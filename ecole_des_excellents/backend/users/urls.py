from django.urls import path
from . import views

app_name = 'users'

urlpatterns = [
    path('connexion/', views.connexion_utilisateur, name='connexion'),
    path('api/csrf/', views.csrf_token, name='csrf_token'),
    path('deconnexion/', views.deconnexion, name='deconnexion'),
    path('profil/', views.profil_view, name='profil'),
    path('profil/change_password/', views.change_password, name='change_password'),
]
