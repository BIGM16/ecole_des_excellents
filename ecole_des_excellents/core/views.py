from django.shortcuts import render, redirect
from .models import Cours, Profil
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from .decorators import role_required
from django.contrib.auth.models import User
from .forms import UserProfilForm
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
            # redirige vers next (si présent) ou vers portail
            # next_url = request.POST.get('next') or request.GET.get('next') or 'portail'
            # return redirect(next_url)
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
    # --- Tableau de bords --- #
    nb_encadreurs = User.objects.filter(profil__role='encadreur').count()
    nb_etudiants = User.objects.filter(profil__role='etudiant').count()
    nb_cours = Cours.objects.count()


    # --- Etudiants --- #
    etudiants = Profil.objects.select_related('user').filter(role='etudiant').order_by('user__last_name')

    promo_id = request.GET.get('promotion')
    if promo_id and promo_id != 'all' :
        etudiants = etudiants.filter(promotion_id=promo_id)

    query = request.GET.get('q')
    if query :
        etudiants = etudiants.filter(
            Q(profil__user__first_name__icontains=query)|
            Q(profil__user__last_name__icontains=query)
        )
    paginator = Paginator(etudiants, 10)
    page_numbers = request.GET.get('page')
    etudiants_page = paginator.get_page(page_numbers)

    form_etudiant = UserProfilForm()
    if request.method == 'POST':
        form_etudiant = UserProfilForm(request.POST, request.FILES)
        if form_etudiant.is_valid():
            form_etudiant.save(request=request)
            messages.success(request, "Étudiant ajouté et e-mail envoyé avec le lien de mot de passe.")
            return redirect('admin_dashboard')
        else:
            messages.error(request, 'Erreur dans le formulaire.')

    else:
        form_etudiant=UserProfilForm()

    # -- Encadreurs ( à compéter plus tard) -- #

    
    # --- Cours ( à compléter plus tard) --- #
    courst_list = Cours.objects.select_related('encadreur').all().order_by('-date_creation')
    
    
    return render(request, 'core/admin_dashboard.html', {
        'nb_encadreurs' : nb_encadreurs,
        'nb_etudiants' : nb_etudiants,
        'nb_cours' : nb_cours,
        'etudiants' : etudiants,
        'etudiants_page' : etudiants_page,
        'form_etudiant' : form_etudiant,
        'cours_list' : courst_list,
        'section_active' : request.GET.get('section', 'etudiants')
    })

@login_required(login_url='connexion')
@role_required(allowed_roles=['encadreur'])
def encadreur_dashboard(request):
    return render(request, 'core/encadreur_dashboard.html')

@login_required(login_url='connexion')
def profil_view(request) :
    profil = request.user.profil
    user = request.user
    if request.method == 'POST' :
        form = UserProfilForm(request.POST, request.FILES, instance=profil)

        if form.is_valid():
            form.save()
            return redirect('profil')
    else :
        form = UserProfilForm(instance=profil)
    context = {
        'form' : form,
        'profil' : profil
    }
    return render(request, 'core/profil.html', context)
