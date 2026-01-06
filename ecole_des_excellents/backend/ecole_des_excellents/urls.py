from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/core/', include('core.urls')),
    path('api/administrateurs/', include('administrateurs.urls')),
    path('api/etudiants/', include('etudiants.urls')),
    path('api/encadreurs/', include('encadreurs.urls')),
    path('api/coordinateurs/', include('coordinateurs.urls')),
    path('api/cours/', include('cours.urls')),
    path('api/notifications/', include('notifications.urls')),
    path('accounts/', include('django.contrib.auth.urls')),
    # mount users app at /api/ so internal paths like /api/token/, /api/auth/me/ match frontend
    path('api/', include('users.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)