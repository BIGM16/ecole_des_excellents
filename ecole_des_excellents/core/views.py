from django.shortcuts import render, redirect, get_object_or_404
from .models import Cours, Profil
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.http import JsonResponse
from .decorators import role_required
from django.contrib.auth.models import User
from .forms import UserProfilForm, UserUpdateForm, ProfilUpdateForm,ChangePasswordForm
from django.db.models import Q
from django.core.paginator import Paginator

def accueil(request):
    return render(request, 'core/accueil.html')

def contact(request):
    return render(request, 'core/contact.html')


def connexion_utilisateur(request):
    # Ici on accepte soit username soit email dans le champ "email"
    if request.method == 'POST':
        identifier = request.POST.get('email', '').strip()  # email ou username
        password = request.POST.get('password', '')

        # Si l'utilisateur existe par email, on récupère son username
        username = identifier
        try:
            user_obj = User.objects.get(email=identifier)
            username = user_obj.username
        except User.DoesNotExist:
            # on garde identifier tel quel (au cas où c'est déjà un username)
            pass

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            #redirige selon le profil
            profil = Profil.objects.get(user=user)

            if profil.role == 'admin' :
                return redirect('admin_dashboard')
            elif profil.role == 'encadreur' :
                return redirect('encadreur_dashboard')
            elif profil.role == 'etudiant' :
                return redirect('portail')
        else:
            messages.error(request, "Email/username ou mot de passe incorrect")

    # transmet la valeur next au template si fournie
    return render(request, 'core/connexion.html', {'next': request.GET.get('next', '')})

def deconnexion(request):
    logout(request)
    return redirect('accueil')

@login_required(login_url='connexion')
@role_required(allowed_roles=['etudiant'])
def portail(request):
    cours_list = Cours.objects.all().order_by('-date_creation')
    return render(request, 'core/portail.html', {'cours_list': cours_list})





@login_required(login_url='connexion')
@role_required(allowed_roles=['admin'])
def admin_dashboard(request):
    nb_encadreurs = User.objects.filter(profil__role='encadreur').count()
    nb_etudiants = User.objects.filter(profil__role='etudiant').count()
    nb_cours = Cours.objects.count()

    #####################
    # ETUDIANTS SECTION #
    #####################
    form_etudiant = UserProfilForm()
    encadreur_form = UserProfilForm()

    etudiants = Profil.objects.select_related('user').filter(role='etudiant').order_by('user__username')
    paginator = Paginator(etudiants, 10)
    page_number = request.GET.get('page')
    etudiants_page = paginator.get_page(page_number)

    promotions = [{'id': value, 'nom': label} for value, label in Profil.PROMOTION_CHOICES]

    if request.method == 'POST':
        form_type = request.POST.get('form_type')
        if form_type == 'etudiant':
            form_etudiant = UserProfilForm(request.POST, request.FILES)
            if form_etudiant.is_valid():
                form_etudiant.save(request=request)
                messages.success(request, "Étudiant ajouté et e-mail envoyé avec le lien de mot de passe.")
                return redirect('admin_dashboard')
            else:
                messages.error(request, "Erreur dans le formulaire étudiant.")
        elif form_type == 'encadreur':
            encadreur_form = UserProfilForm(request.POST, request.FILES)
            if encadreur_form.is_valid():
                encadreur = encadreur_form.save(request=request)
                encadreur.role = 'encadreur'
                encadreur.save()
                messages.success(request, "Encadreur ajouté avec succès !")
                return redirect('admin_dashboard')
            else:
                messages.error(request, "Erreur dans le formulaire encadreur.")
        

    

    ######################
    # ENCADREURS SECTION #
    ######################

    encadreurs = Profil.objects.select_related('user').filter(role='encadreur').order_by('user__last_name')
    
    paginator = Paginator(encadreurs, 10)
    page_number = request.GET.get('page')
    encadreurs_page = paginator.get_page(page_number)


    #################
    # COURS SECTION #
    #################


    cours_list = Cours.objects.select_related('encadreur').all().order_by('-date_creation')

    return render(request, 'core/admin_dashboard.html', {
        'nb_encadreurs': nb_encadreurs,
        'nb_etudiants': nb_etudiants,
        'nb_cours': nb_cours,
        'promotion_choices': Profil.PROMOTION_CHOICES,
        'etudiants': etudiants_page,  # on renvoie la page ici
        'encadreurs': encadreurs_page,
        'promotions': promotions,
        'form_etudiant' : form_etudiant,
        'encadreur_form' : encadreur_form,
        'cours_list': cours_list,
        'section_active': request.GET.get('section', 'etudiants'),
    })



@login_required(login_url='connexion')
@role_required(allowed_roles=['admin'])
def edit_etudiant(request, id):
    profil = get_object_or_404(Profil, id=id)
    user = profil.user

    if request.method == 'POST':
        user_form = UserUpdateForm(request.POST, instance=user)
        profil_form = ProfilUpdateForm(request.POST, request.FILES, instance=profil)

        if user_form.is_valid() and profil_form.is_valid():
            user_form.save()
            profil_form.save()
            messages.success(request, "Les informations de l'étudiant ont été mises à jour.")
            return redirect('admin_dashboard')
        else:
            messages.error(request, "Veuillez corriger les erreurs dans le formulaire.")
    else:
        user_form = UserUpdateForm(instance=user)
        profil_form = ProfilUpdateForm(instance=profil)

    return render(request, 'core/edit_etudiant.html', {
        'user_form': user_form,
        'profil_form': profil_form,
        'profil': profil
    })

@login_required(login_url='connexion')
@role_required(allowed_roles=['admin'])
def search_etudiant(request):
    q = request.GET.get('q', '').strip()
    promotion_filter = request.GET.get('promotion', 'all')

    etudiants = Profil.objects.select_related('user').filter(role='etudiant')

    if promotion_filter != 'all':
        etudiants = etudiants.filter(promotion=promotion_filter)
    if q:
        etudiants = etudiants.filter(
            Q(user__username__icontains=q) |
            Q(user__email__icontains=q) |
            Q(telephone__icontains=q)
        )

    results = []
    for e in etudiants:
        photo_url = e.photo.url if e.photo else '/media/default.png'
        results.append({
            'id': e.id,
            'nom': e.user.username,
            'email': e.user.email,
            'promotion': e.get_promotion_display(),
            'telephone': e.telephone,
            'photo': photo_url,
        })

    return JsonResponse({'results': results})


@login_required(login_url='connexion')
@role_required(allowed_roles=['admin'])
def delete_etudiant(request, id):
    profil = get_object_or_404(Profil, id=id)
    user = profil.user
    user.delete()  # supprime user et profil (cascade)
    messages.success(request, "Étudiant supprimé.")
    return redirect('admin_dashboard')


@login_required(login_url='connexion')
@role_required(allowed_roles=['encadreur'])
def encadreur_dashboard(request):
    return render(request, 'core/encadreur_dashboard.html')

@login_required(login_url='connexion')
def profil_view(request) :
    profil = request.user.profil
    user = profil.user

    if request.method == 'POST':
        user_form = UserUpdateForm(request.POST, instance=user)
        profil_form = ProfilUpdateForm(request.POST, request.FILES, instance=profil)

        if user_form.is_valid() and profil_form.is_valid():
            user_form.save()
            profil_form.save()
            messages.success(request, "Les informations de l'étudiant ont été mises à jour.")
            return redirect('profil')
        else:
            messages.error(request, "Veuillez corriger les erreurs dans le formulaire.")
    else:
        user_form = UserUpdateForm(instance=user)
        profil_form = ProfilUpdateForm(instance=profil)

    return render(request, 'core/profil.html', {
        'user_form': user_form,
        'profil_form': profil_form,
        'profil': profil
    })

@login_required(login_url='connexion')
def change_password(request):
    if request.method == 'POST':
        form = ChangePasswordForm(request.user, request.POST)
        if form.is_valid():
            user = form.save()
            update_session_auth_hash(request, user)  # évite la déconnexion automatique
            messages.success(request, "Votre mot de passe a été modifié avec succès.")
            return redirect('profil')  # ou redirige où tu veux
        else:
            messages.error(request, "Veuillez corriger les erreurs ci-dessous.")
    else:
        form = ChangePasswordForm(request.user)

    return render(request, 'core/change_password.html', {'form': form})