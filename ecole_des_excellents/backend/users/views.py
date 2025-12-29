from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.middleware.csrf import get_token

from core.models import Profil
from users.forms import UserUpdateForm, ProfilUpdateForm, ChangePasswordForm
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model

UserModel = get_user_model()


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
	@classmethod
	def get_token(cls, user):
		token = super().get_token(user)
		# add custom claims if needed
		return token

	def validate(self, attrs):
		# allow users to submit email or username as 'username'
		identifier = attrs.get('username')
		try:
			user_obj = UserModel.objects.get(email=identifier)
			attrs['username'] = user_obj.username
		except UserModel.DoesNotExist:
			pass

		data = super().validate(attrs)

		# attach role and redirect suggestions
		try:
			profil = Profil.objects.get(user=self.user)
			data['role'] = profil.role
			if profil.role == 'admin':
				data['redirect'] = '/admin'
			elif profil.role == 'coordinateur':
				data['redirect'] = '/coordon'
			elif profil.role == 'encadreur':
				data['redirect'] = '/encadreur'
			else:
				data['redirect'] = '/etudiant'
		except Profil.DoesNotExist:
			data['role'] = None
			data['redirect'] = '/'

		return data


class MyTokenObtainPairView(TokenObtainPairView):
	serializer_class = MyTokenObtainPairSerializer


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
			# redirige selon le profil
			profil = Profil.objects.get(user=user)

			# Support AJAX login: retourner JSON
			if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
				redirect_url = ''
				if profil.role == 'admin':
					redirect_url = '/admin/'
				elif profil.role == 'encadreur':
					redirect_url = '/encadreur/'
				elif profil.role == 'etudiant':
					redirect_url = '/etudiant/'
				elif profil.role == 'coordinateur':
					redirect_url = '/coordon/'
				return JsonResponse({'success': True, 'role': profil.role, 'redirect': redirect_url})

			if profil.role == 'admin':
				return redirect('administrateurs:admin_dashboard')
			elif profil.role == 'encadreur':
				return redirect('encadreurs:encadreur_dashboard')
			elif profil.role == 'etudiant':
				return redirect('core:portail')
		else:
			if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
				return JsonResponse({'success': False, 'error': 'Email/username ou mot de passe incorrect'}, status=400)
			messages.error(request, "Email/username ou mot de passe incorrect")

	# Pour GET ou échec d'auth, afficher le template
	return render(request, 'users/connexion.html', {'next': request.GET.get('next', '')})



@ensure_csrf_cookie
def csrf_token(request):
	"""Endpoint simple pour définir le cookie CSRF et retourner le token en JSON."""
	token = get_token(request)
	return JsonResponse({'csrfToken': token})


# transmet la valeur next au template si fournie
# return render(request, 'users/connexion.html', {'next': request.GET.get('next', '')})


def deconnexion(request):
	logout(request)
	return redirect('core:accueil')


@login_required(login_url='users:connexion')
def profil_view(request):
	profil = request.user.profil
	user = profil.user

	if request.method == 'POST':
		user_form = UserUpdateForm(request.POST, instance=user)
		profil_form = ProfilUpdateForm(request.POST, request.FILES, instance=profil)

		if user_form.is_valid() and profil_form.is_valid():
			user_form.save()
			profil_form.save()
			messages.success(request, "Les informations de l'étudiant ont été mises à jour.")
			return redirect('users:profil')
		else:
			messages.error(request, "Veuillez corriger les erreurs dans le formulaire.")
	else:
		user_form = UserUpdateForm(instance=user)
		profil_form = ProfilUpdateForm(instance=profil)

	return render(request, 'users/profil.html', {
		'user_form': user_form,
		'profil_form': profil_form,
		'profil': profil
	})


@login_required(login_url='users:connexion')
def change_password(request):
	if request.method == 'POST':
		form = ChangePasswordForm(request.user, request.POST)
		if form.is_valid():
			user = form.save()
			update_session_auth_hash(request, user)  # évite la déconnexion automatique
			messages.success(request, "Votre mot de passe a été modifié avec succès.")
			return redirect('users:profil')  # ou redirige où tu veux
		else:
			messages.error(request, "Veuillez corriger les erreurs ci-dessous.")
	else:
		form = ChangePasswordForm(request.user)

	return render(request, 'users/change_password.html', {'form': form})
