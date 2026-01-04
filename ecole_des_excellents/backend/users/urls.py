from django.urls import path
from . import views

app_name = 'users'

urlpatterns = [
    path('connexion/', views.connexion_utilisateur, name='connexion'),
    path('api/csrf/', views.csrf_token, name='csrf_token'),
    # JWT endpoints
    path('api/token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', views.TokenRefreshView.as_view(), name='token_refresh'),
    # cookie-based JWT endpoints
    path('api/token/cookie/', views.CookieTokenObtainPairView.as_view(), name='token_obtain_pair_cookie'),
    path('api/token/refresh/cookie/', views.CookieTokenRefreshView.as_view(), name='token_refresh_cookie'),
    path('api/auth/me/', views.current_user, name='current_user'),
    path('api/auth/logout/', views.api_logout, name='api_logout'),
    path('deconnexion/', views.deconnexion, name='deconnexion'),
    path('profil/', views.profil_view, name='profil'),
    path('profil/change_password/', views.change_password, name='change_password'),
]
