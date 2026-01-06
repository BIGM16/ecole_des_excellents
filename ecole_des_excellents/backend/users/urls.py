from django.urls import path
from . import views

app_name = 'users'

urlpatterns = [
    # CSRF token endpoint
    path('csrf/', views.csrf_token, name='csrf_token'),
    
    # API login endpoint (JSON only)
    path('login/', views.login_api, name='login_api'),
    
    # JWT token endpoints (legacy, can be deprecated)
    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', views.TokenRefreshView.as_view(), name='token_refresh'),
    
    # Cookie-based JWT endpoints (preferred for frontend)
    path('token/cookie/', views.CookieTokenObtainPairView.as_view(), name='token_obtain_pair_cookie'),
    path('token/refresh/cookie/', views.CookieTokenRefreshView.as_view(), name='token_refresh_cookie'),
    
    # User auth endpoints (JSON API)
    path('auth/me/', views.current_user, name='current_user'),
    path('auth/logout/', views.api_logout, name='api_logout'),
    
    # User profile endpoints (JSON API)
    path('profil/', views.profil_api, name='profil_api'),
    path('profil/change_password/', views.change_password_api, name='change_password_api'),
]
