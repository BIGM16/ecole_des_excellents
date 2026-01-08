from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.middleware.csrf import get_token

from core.models import Profil
from users.forms import ChangePasswordForm

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.backends import TokenBackend
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings

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


class CookieTokenObtainPairView(MyTokenObtainPairView):
	"""Return tokens and set them as HttpOnly cookies on the response."""
	def post(self, request, *args, **kwargs):
		response = super().post(request, *args, **kwargs)
		# response is a DRF Response containing access and refresh on success
		if response.status_code == status.HTTP_200_OK:
			data = getattr(response, 'data', {}) or {}
			access = data.get('access')
			refresh = data.get('refresh')
			# cookie lifetimes (seconds) — tune as needed or derive from settings
			access_max_age = getattr(settings, 'JWT_ACCESS_COOKIE_AGE', 60 * 30)
			refresh_max_age = getattr(settings, 'JWT_REFRESH_COOKIE_AGE', 60 * 60 * 24 * 7)

			# set HttpOnly cookies
			if access:
				response.set_cookie(
					key='accessToken',
					value=access,
					max_age=access_max_age,
					httponly=True,
					secure=getattr(settings, 'SESSION_COOKIE_SECURE', False),
					samesite=getattr(settings, 'CSRF_COOKIE_SAMESITE', 'Lax'),
					path='/'
				)
			if refresh:
				response.set_cookie(
					key='refreshToken',
					value=refresh,
					max_age=refresh_max_age,
					httponly=True,
					secure=getattr(settings, 'SESSION_COOKIE_SECURE', False),
					samesite=getattr(settings, 'CSRF_COOKIE_SAMESITE', 'Lax'),
					path='/'
				)
		return response


class CookieTokenRefreshView(TokenRefreshView):
	"""Refresh view that sets a new access token cookie when refresh is valid."""
	def post(self, request, *args, **kwargs):
		response = super().post(request, *args, **kwargs)
		if response.status_code == status.HTTP_200_OK:
			data = getattr(response, 'data', {}) or {}
			access = data.get('access')
			access_max_age = getattr(settings, 'JWT_ACCESS_COOKIE_AGE', 60 * 30)
			if access:
				response.set_cookie(
					key='accessToken',
					value=access,
					max_age=access_max_age,
					httponly=True,
					secure=getattr(settings, 'SESSION_COOKIE_SECURE', False),
					samesite=getattr(settings, 'CSRF_COOKIE_SAMESITE', 'Lax'),
					path='/'
				)
		return response


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
	"""Return current authenticated user's information.
	
	JWT authentication via cookie (HttpOnly) is handled by CookieJWTAuthentication.
	If user is not authenticated, returns 401.
	"""
	user = request.user

	# Check if user is authenticated
	if not user or not getattr(user, 'is_authenticated', False):
		return Response(
			{'detail': 'Authentication credentials were not provided.'},
			status=status.HTTP_401_UNAUTHORIZED
		)

	try:
		profil = Profil.objects.get(user=user)
		data = {
			'id': user.id,
			'username': user.username,
			'email': user.email,
			'role': profil.role,
			'nom_complet': f"{user.first_name} {user.last_name}".strip(),
			'promotion': profil.promotion,
			'photo': profil.photo.url if profil.photo else None,
		}
	except Profil.DoesNotExist:
		data = {
			'id': user.id,
			'username': user.username,
			'email': user.email,
			'role': None,
		}

	return Response(data)


@api_view(['POST'])
def login_api(request):
	"""JSON API for login: accepts username/email + password, returns user data and sets JWT cookies."""
	try:
		data = request.data
		identifier = data.get('username', '').strip()  # username or email
		password = data.get('password', '')

		if not identifier or not password:
			return Response(
				{'detail': 'username and password are required'},
				status=status.HTTP_400_BAD_REQUEST
			)

		# Try to find user by email if identifier looks like email
		username = identifier
		if '@' in identifier:
			try:
				user_obj = UserModel.objects.get(email=identifier)
				username = user_obj.username
			except UserModel.DoesNotExist:
				pass

		# Authenticate
		user = authenticate(request, username=username, password=password)
		if user is None:
			return Response(
				{'detail': 'Invalid credentials'},
				status=status.HTTP_401_UNAUTHORIZED
			)

		# Generate JWT tokens (using serializer)
		serializer = MyTokenObtainPairSerializer(data={'username': username, 'password': password})
		if not serializer.is_valid():
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

		tokens = serializer.validated_data

		# Get user profile
		try:
			profil = Profil.objects.get(user=user)
			user_data = {
				'id': user.id,
				'username': user.username,
				'email': user.email,
				'role': profil.role,
				'nom_complet': f"{user.first_name} {user.last_name}".strip(),
				'promotion': profil.promotion,
				'photo': profil.photo.url if profil.photo else None,
			}
		except Profil.DoesNotExist:
			user_data = {
				'id': user.id,
				'username': user.username,
				'email': user.email,
				'role': None,
			}

		response = Response(
			{
				'user': user_data,
				'access': tokens.get('access'),
				'refresh': tokens.get('refresh'),
			},
			status=status.HTTP_200_OK
		)

		# Set HttpOnly cookies
		access = tokens.get('access')
		refresh = tokens.get('refresh')
		if access:
			response.set_cookie(
				key='accessToken',
				value=access,
				max_age=60 * 30,  # 30 minutes
				httponly=True,
				secure=getattr(settings, 'SESSION_COOKIE_SECURE', False),
				samesite=getattr(settings, 'CSRF_COOKIE_SAMESITE', 'Lax'),
				path='/'
			)
		if refresh:
			response.set_cookie(
				key='refreshToken',
				value=refresh,
				max_age=60 * 60 * 24 * 7,  # 7 days
				httponly=True,
				secure=getattr(settings, 'SESSION_COOKIE_SECURE', False),
				samesite=getattr(settings, 'CSRF_COOKIE_SAMESITE', 'Lax'),
				path='/'
			)

		return response
	except Exception as e:
		return Response(
			{'detail': f'Login error: {str(e)}'},
			status=status.HTTP_500_INTERNAL_SERVER_ERROR
		)



@ensure_csrf_cookie
def csrf_token(request):
	"""Endpoint simple pour définir le cookie CSRF et retourner le token en JSON."""
	token = get_token(request)
	return JsonResponse({'csrfToken': token})


# transmet la valeur next au template si fournie
# return render(request, 'users/connexion.html', {'next': request.GET.get('next', '')})





@api_view(['POST'])
def api_logout(request):
	"""Logout API: clear auth cookies set by cookie-based token endpoints."""
	response = Response({'detail': 'logged out'}, status=200)
	response.delete_cookie('accessToken', path='/')
	response.delete_cookie('refreshToken', path='/')
	return response


@api_view(['GET', 'PUT'])
def api_profile(request):
	"""GET: retourne les informations du profil courant.
	PUT: met à jour `first_name`, `last_name`, `email`, `promotion` et `photo` (multipart/form-data supporté).
	Authentification via header Bearer ou cookie `accessToken`.
	"""
	# reuse current_user resolution logic
	user = request.user
	if not getattr(user, 'is_authenticated', False):
		token = request.COOKIES.get('accessToken')
		if token:
			try:
				backend = TokenBackend(algorithm=settings.SIMPLE_JWT.get('ALGORITHM', 'HS256'))
				valid_data = backend.decode(token, verify=True)
				user_id = valid_data.get('user_id')
				if user_id:
					try:
						user = UserModel.objects.get(id=user_id)
					except UserModel.DoesNotExist:
						user = None
			except Exception:
				user = None

	if not user:
		return Response({'detail': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)

	try:
		profil = Profil.objects.get(user=user)
	except Profil.DoesNotExist:
		return Response({'detail': 'Profile not found.'}, status=status.HTTP_404_NOT_FOUND)

	if request.method == 'GET':
		data = {
			'id': user.id,
			'username': user.username,
			'email': user.email,
			'first_name': user.first_name,
			'last_name': user.last_name,
			'role': profil.role,
			'nom_complet': f"{user.first_name} {user.last_name}".strip(),
			'promotion': profil.promotion,
			'photo': profil.photo.url if profil.photo else None,
		}
		return Response(data)

	# PUT: update
	# accept multipart/form-data or application/json
	data = request.data
	changed = False
	first = data.get('first_name')
	last = data.get('last_name')
	email = data.get('email')
	promotion = data.get('promotion')
	photo = None
	if hasattr(request, 'FILES'):
		photo = request.FILES.get('photo')

	if first is not None:
		user.first_name = first
		changed = True
	if last is not None:
		user.last_name = last
		changed = True
	if email is not None:
		user.email = email
		changed = True
	if promotion is not None:
		profil.promotion = promotion
		changed = True
	if photo is not None:
		profil.photo = photo
		changed = True

	if changed:
		user.save()
		profil.save()

	return Response({'detail': 'updated'})


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def profil_api(request):
	"""Get or update user profile — JSON API, authenticated users only."""
	user = request.user
	try:
		profil = Profil.objects.get(user=user)
	except Profil.DoesNotExist:
		return Response({'detail': 'Profil not found'}, status=status.HTTP_404_NOT_FOUND)

	if request.method == 'GET':
		# Return user profile data
		data = {
			'id': user.id,
			'username': user.username,
			'email': user.email,
			'first_name': user.first_name,
			'last_name': user.last_name,
			'role': profil.role,
			'promotion': profil.promotion,
			'photo': profil.photo.url if profil.photo else None,
		}
		return Response(data)

	elif request.method == 'POST':
		# Update profile
		data = request.data

		# Update user fields
		if 'first_name' in data:
			user.first_name = data['first_name']
		if 'last_name' in data:
			user.last_name = data['last_name']
		if 'email' in data:
			user.email = data['email']
		user.save()

		# Update profil fields
		if 'promotion' in data:
			profil.promotion = data['promotion']
		if 'photo' in request.FILES:
			profil.photo = request.FILES['photo']
		profil.save()

		result_data = {
			'id': user.id,
			'username': user.username,
			'email': user.email,
			'first_name': user.first_name,
			'last_name': user.last_name,
			'role': profil.role,
			'promotion': profil.promotion,
			'photo': profil.photo.url if profil.photo else None,
		}
		return Response({'message': 'Profil updated', 'profil': result_data})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password_api(request):
	"""Change password API — JSON only, authenticated users."""
	user = request.user
	data = request.data

	old_password = data.get('old_password', '')
	new_password = data.get('new_password', '')
	confirm_password = data.get('confirm_password', '')

	if not old_password or not new_password or not confirm_password:
		return Response(
			{'detail': 'old_password, new_password, and confirm_password are required'},
			status=status.HTTP_400_BAD_REQUEST
		)

	# Check old password
	if not user.check_password(old_password):
		return Response(
			{'detail': 'Old password is incorrect'},
			status=status.HTTP_400_BAD_REQUEST
		)

	# Check if new passwords match
	if new_password != confirm_password:
		return Response(
			{'detail': 'New passwords do not match'},
			status=status.HTTP_400_BAD_REQUEST
		)

	# Update password
	user.set_password(new_password)
	user.save()
	update_session_auth_hash(request, user)

	return Response({'message': 'Password changed successfully'})
