from django.shortcuts import get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.utils import timezone
from django.db.models import Q

from core.decorators import role_required
from core.models import Profil, Cours
from .models import Horaire


@login_required(login_url='users:connexion')
@role_required(allowed_roles=['coordinateur'])
def dashboard(request):
	"""Affiche le dashboard du coordinateur : étudiants et cours de sa promotion, et horaires."""
	profil = getattr(request.user, 'profil', None)
	if not profil:
		return JsonResponse({'success': False, 'error': 'Profil introuvable'}, status=403)

	promo = profil.promotion

	etudiants = Profil.objects.filter(role='etudiant', promotion=promo).select_related('user').order_by('user__username')
	cours = Cours.objects.filter(promotion=promo).order_by('-date_creation')
	horaires = Horaire.objects.filter(promotion=promo).order_by('date_debut')

	# support creation simple via POST (API)
	if request.method == 'POST':
		titre = request.POST.get('titre')
		description = request.POST.get('description')
		cours_id = request.POST.get('cours')
		date_debut = request.POST.get('date_debut')
		date_fin = request.POST.get('date_fin')
		lieu = request.POST.get('lieu')

		if not titre or not date_debut:
			return JsonResponse({'success': False, 'error': 'Titre et date_debut requis'}, status=400)

		h = Horaire()
		h.coordinateur = profil
		h.titre = titre
		h.description = description
		if cours_id:
			try:
				h.cours = Cours.objects.get(id=int(cours_id))
			except Exception:
				h.cours = None
		try:
			# allow ISO datetime from input
			h.date_debut = timezone.datetime.fromisoformat(date_debut)
		except Exception:
			h.date_debut = timezone.now()
		if date_fin:
			try:
				h.date_fin = timezone.datetime.fromisoformat(date_fin)
			except Exception:
				h.date_fin = None
		h.lieu = lieu
		h.promotion = promo
		h.save()
		return JsonResponse({'success': True, 'horaire': {'id': h.id, 'titre': h.titre, 'date_debut': h.date_debut.isoformat() if h.date_debut else None, 'lieu': h.lieu}}, status=201)

	# GET: renvoyer les données en JSON
	etudiants_list = []
	for p in etudiants:
		etudiants_list.append({
			'id': p.id,
			'username': getattr(p.user, 'username', None),
			'nom': getattr(p.user, 'first_name', '') + ' ' + getattr(p.user, 'last_name', ''),
			'promotion': getattr(p, 'promotion', None),
			'photo': p.photo.url if getattr(p, 'photo', None) else None,
		})

	cours_list = []
	for c in cours:
		cours_list.append({
			'id': c.id,
			'titre': c.titre,
			'description': getattr(c, 'description', ''),
		})

	horaires_list = []
	for h in horaires:
		horaires_list.append({
			'id': h.id,
			'titre': h.titre,
			'date_debut': h.date_debut.isoformat() if h.date_debut else None,
			'lieu': h.lieu,
		})

	return JsonResponse({'etudiants': etudiants_list, 'cours': cours_list, 'horaires': horaires_list, 'promotion': promo}, safe=False)


@login_required(login_url='users:connexion')
@role_required(allowed_roles=['coordinateur'])
@require_POST
def create_horaire_ajax(request):
	"""Endpoint AJAX pour créer un horaire (retourne JSON)."""
	profil = getattr(request.user, 'profil', None)
	if not profil:
		return JsonResponse({'success': False, 'error': 'Profil introuvable'}, status=403)

	promo = profil.promotion
	titre = request.POST.get('titre')
	description = request.POST.get('description')
	cours_id = request.POST.get('cours')
	date_debut = request.POST.get('date_debut')
	lieu = request.POST.get('lieu')

	if not titre or not date_debut:
		return JsonResponse({'success': False, 'error': 'Titre et date_debut requis'}, status=400)

	h = Horaire()
	h.coordinateur = profil
	h.titre = titre
	h.description = description
	if cours_id:
		try:
			h.cours = Cours.objects.get(id=int(cours_id), promotion=promo)
		except Exception:
			h.cours = None
	try:
		h.date_debut = timezone.datetime.fromisoformat(date_debut)
	except Exception:
		h.date_debut = timezone.now()
	h.lieu = lieu
	h.promotion = promo
	h.save()

	return JsonResponse({'success': True, 'horaire': {'id': h.id, 'titre': h.titre, 'date_debut': h.date_debut.isoformat(), 'lieu': h.lieu}})
