from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from core.decorators import role_required
from core.models import Cours, Document, DocumentFile
from cours.forms import CoursForm, DocumentForm
from django.db import transaction


@login_required(login_url='users:connexion')
@role_required(allowed_roles=['admin'])
def edit_cours(request, cours_id):
	cours = get_object_or_404(Cours, id=cours_id)

	if request.method == 'POST':
		form = CoursForm(request.POST, request.FILES, instance=cours)
		if form.is_valid():
			form.save()
			messages.success(request, 'Cours mis à jour.')
			return redirect('administrateurs:admin_dashboard')
		else:
			messages.error(request, 'Veuillez corriger les erreurs du formulaire.')
	else:
		form = CoursForm(instance=cours)

	documents = cours.documents.all().order_by('-date_ajout')

	# DocumentForm pour la partie d'ajout (AJAX) — on envoie via JS
	doc_form = DocumentForm()

	return render(request, 'cours/edit_cours.html', {
		'cours': cours,
		'form': form,
		'documents': documents,
		'doc_form': doc_form,
	})


@login_required(login_url='users:connexion')
@role_required(allowed_roles=['encadreur', 'admin'])
def ajouter_document(request, cours_id):
	if request.method != 'POST' or request.headers.get('X-Requested-With') != 'XMLHttpRequest':
		return JsonResponse({'success': False, 'error': 'Requête invalide'}, status=400)

	cours = get_object_or_404(Cours, id=cours_id)
	form = DocumentForm(request.POST)
	fichiers = request.FILES.getlist('fichiers[]')

	if not fichiers:
		return JsonResponse({'success': False, 'error': 'Aucun fichier reçu'})

	if not form.is_valid():
		return JsonResponse({'success': False, 'error': 'Formulaire invalide', 'errors': form.errors}, status=400)

	try:
		with transaction.atomic():
			doc = form.save(commit=False)
			doc.cours = cours
			doc.save()
			uploaded = []
			for f in fichiers:
				if f.size > 20 * 1024 * 1024:
					raise ValueError(f'Le fichier {f.name} est trop volumineux')
				ext = f.name.split('.')[-1].lower()
				if ext not in ['pdf', 'doc', 'docx', 'ppt', 'pptx']:
					raise ValueError(f'Type de fichier non autorisé: {ext}')

				df = DocumentFile.objects.create(document=doc, fichier=f, nom=getattr(f, 'name', None))
				uploaded.append({'name': df.nom or df.fichier.name, 'id': df.id})

		return JsonResponse({'success': True, 'document': {'id': doc.id, 'titre': doc.titre, 'categorie': doc.categorie}, 'files': uploaded})
	except ValueError as e:
		return JsonResponse({'success': False, 'error': str(e)}, status=400)
	except Exception as e:
		return JsonResponse({'success': False, 'error': 'Erreur serveur'}, status=500)


@login_required(login_url='users:connexion')
@role_required(allowed_roles=['admin'])
def delete_cours(request, cours_id):
	cours = get_object_or_404(Cours, id=cours_id)
	cours.delete()
	messages.success(request, 'Cours supprimé.')
	return redirect('administrateurs:admin_dashboard')


@login_required(login_url='users:connexion')
@role_required(allowed_roles=['admin'])
def create_cours_ajax(request):
	if request.method != 'POST' or request.headers.get('X-Requested-With') != 'XMLHttpRequest':
		return JsonResponse({'success': False, 'error': 'Requête invalide'}, status=400)

	form = CoursForm(request.POST, request.FILES)
	if not form.is_valid():
		return JsonResponse({'success': False, 'error': 'Formulaire invalide', 'errors': form.errors}, status=400)

	try:
		c = form.save()
		encadreur = None
		if c.encadreur:
			encadreur = c.encadreur.user.get_full_name() or c.encadreur.user.username

		return JsonResponse({
			'success': True,
			'cours': {
				'id': c.id,
				'titre': c.titre,
				'promotion': c.get_promotion_display(),
				'encadreur': encadreur,
				'documents_count': c.documents.count(),
				'edit_url': f"/cours/{c.id}/edit/",
				'delete_url': f"/cours/{c.id}/delete/",
			}
		})
	except Exception as e:
		return JsonResponse({'success': False, 'error': 'Erreur serveur lors de la création'}, status=500)


@login_required(login_url='users:connexion')
@role_required(allowed_roles=['encadreur', 'admin'])
def ajouter_fichiers_document(request, document_id):
	if request.method != 'POST' or request.headers.get('X-Requested-With') != 'XMLHttpRequest':
		return JsonResponse({'success': False, 'error': 'Requête invalide'}, status=400)

	doc = get_object_or_404(Document, id=document_id)
	fichiers = request.FILES.getlist('fichiers[]')

	if not fichiers:
		return JsonResponse({'success': False, 'error': 'Aucun fichier reçu'})

	try:
		created = []
		with transaction.atomic():
			for f in fichiers:
				if f.size > 20 * 1024 * 1024:
					raise ValueError(f'Le fichier {f.name} est trop volumineux')
				ext = f.name.split('.')[-1].lower()
				if ext not in ['pdf', 'doc', 'docx', 'ppt', 'pptx']:
					raise ValueError(f'Type de fichier non autorisé: {ext}')

				df = DocumentFile.objects.create(document=doc, fichier=f, nom=getattr(f, 'name', None))
				created.append({'id': df.id, 'name': df.nom or df.fichier.name, 'url': df.fichier.url})

		return JsonResponse({'success': True, 'files': created, 'document_id': doc.id})
	except ValueError as e:
		return JsonResponse({'success': False, 'error': str(e)}, status=400)
	except Exception as e:
		return JsonResponse({'success': False, 'error': 'Erreur serveur'}, status=500)


@login_required(login_url='users:connexion')
@role_required(allowed_roles=['encadreur', 'admin'])
def supprimer_document_file(request, file_id):
	if request.method not in ['POST', 'DELETE'] or request.headers.get('X-Requested-With') != 'XMLHttpRequest':
		return JsonResponse({'success': False, 'error': 'Requête invalide'}, status=400)

	df = get_object_or_404(DocumentFile, id=file_id)
	try:
		df.fichier.delete(save=False)
		df.delete()
		return JsonResponse({'success': True, 'file_id': file_id})
	except Exception as e:
		return JsonResponse({'success': False, 'error': 'Impossible de supprimer le fichier'}, status=500)
