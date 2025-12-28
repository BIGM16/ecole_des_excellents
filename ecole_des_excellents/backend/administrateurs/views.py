from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from core.decorators import role_required
from django.db.models import Q
from django.core.paginator import Paginator

from core.models import Profil, Cours
from users.forms import UserProfilForm, UserUpdateForm, ProfilUpdateForm
from cours.forms import CoursForm
from django.contrib.auth.models import User


@login_required(login_url='users:connexion')
@role_required(allowed_roles=['admin'])
def admin_dashboard(request):
	nb_encadreurs = User.objects.filter(profil__role='encadreur').count()
	nb_etudiants = User.objects.filter(profil__role='etudiant').count()
	nb_cours = Cours.objects.count()

	form_etudiant = UserProfilForm()
	encadreur_form = UserProfilForm()
	cours_form = CoursForm()

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
				return redirect('administrateurs:admin_dashboard')
			else:
				messages.error(request, "Erreur dans le formulaire étudiant.")
		elif form_type == 'encadreur':
			encadreur_form = UserProfilForm(request.POST, request.FILES)
			if encadreur_form.is_valid():
				encadreur = encadreur_form.save(request=request)
				encadreur.role = 'encadreur'
				encadreur.save()
				messages.success(request, "Encadreur ajouté avec succès !")
				return redirect('administrateurs:admin_dashboard')
			else:
				messages.error(request, "Erreur dans le formulaire encadreur.")
		elif form_type == 'cours':
			cours_form = CoursForm(request.POST, request.FILES)
			if cours_form.is_valid():
				c = cours_form.save()
				messages.success(request, "Cours ajouté avec succès !")
				return redirect('administrateurs:admin_dashboard')
			else:
				messages.error(request, "Erreur dans le formulaire cours.")

	encadreurs = Profil.objects.select_related('user').filter(role='encadreur').order_by('user__last_name')

	query_encadreur = request.GET.get('query_encadreur')
	promotion_encadreur = request.GET.get('promotion_encadreur')

	if query_encadreur:
		encadreurs = encadreurs.filter(
			Q(user__username__icontains=query_encadreur) |
			Q(user__first_name__icontains=query_encadreur) |
			Q(user__last_name__icontains=query_encadreur) |
			Q(user__email__icontains=query_encadreur)
		)

	if promotion_encadreur:
		encadreurs = encadreurs.filter(promotion=promotion_encadreur)

	paginator = Paginator(encadreurs, 10)
	page_number = request.GET.get('page_encadreur')
	encadreurs_page = paginator.get_page(page_number)

	return render(request, 'administrations/admin_dashboard.html', {
		'nb_encadreurs': nb_encadreurs,
		'nb_etudiants': nb_etudiants,
		'nb_cours': nb_cours,
		'promotion_choices': Profil.PROMOTION_CHOICES,
		'etudiants': etudiants_page,
		'encadreurs': encadreurs_page,
		'promotions': promotions,
		'form_etudiant': form_etudiant,
		'encadreur_form': encadreur_form,
		'cours_list': Cours.objects.all().order_by('-date_creation'),
		'cours_form': cours_form,
		'section_active': request.GET.get('section', 'etudiants'),
	})


@login_required(login_url='users:connexion')
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
			return redirect('administrateurs:admin_dashboard')
		else:
			messages.error(request, "Veuillez corriger les erreurs dans le formulaire.")
	else:
		user_form = UserUpdateForm(instance=user)
		profil_form = ProfilUpdateForm(instance=profil)

	return render(request, 'etudiants/edit_etudiant.html', {
		'user_form': user_form,
		'profil_form': profil_form,
		'profil': profil
	})


@login_required(login_url='users:connexion')
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


@login_required(login_url='users:connexion')
@role_required(allowed_roles=['admin'])
def delete_etudiant(request, id):
	profil = get_object_or_404(Profil, id=id)
	user = profil.user
	user.delete()
	messages.success(request, "Étudiant supprimé.")
	return redirect('administrateurs:admin_dashboard')


@login_required(login_url='users:connexion')
@role_required(allowed_roles=['admin'])
def search_cours(request):
	"""Recherche/filtre AJAX pour les cours.

	Paramètres GET attendus:
	- promotion: code de promotion ou 'all'
	- matiere: chaîne pour filtrer le titre/description (ou 'all')
	- q: texte libre de recherche (titre/description)
	"""
	promotion = request.GET.get('promotion', 'all')
	matiere = request.GET.get('matiere', '').strip()
	q = request.GET.get('q', '').strip()

	qs = Cours.objects.all().order_by('-date_creation')

	if promotion and promotion != 'all':
		qs = qs.filter(promotion=promotion)

	if matiere and matiere.lower() not in ['all', '']:
		qs = qs.filter(
			Q(titre__icontains=matiere) | Q(description__icontains=matiere)
		)

	if q:
		qs = qs.filter(
			Q(titre__icontains=q) | Q(description__icontains=q)
		)

	results = []
	for c in qs:
		encadreur = None
		if c.encadreur:
			encadreur = c.encadreur.user.get_full_name() or c.encadreur.user.username
		results.append({
			'id': c.id,
			'titre': c.titre,
			'promotion': c.get_promotion_display(),
			'encadreur': encadreur,
			'documents_count': c.documents.count(),
			'edit_url': f"{request.scheme}://{request.get_host()}{'/'}cours/{c.id}/edit/",
			'delete_url': f"{request.scheme}://{request.get_host()}{'/'}cours/{c.id}/delete/",
		})

	return JsonResponse({'results': results})
