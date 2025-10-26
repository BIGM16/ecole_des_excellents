from django.urls import path
from . import views

urlpatterns = [
    path('', views.accueil, name='accueil'),
    path('contact/', views.contact, name='contact'),
    path('portail/', views.portail, name='portail'),
    path('admin_dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('encadreur_dashboard/', views.encadreur_dashboard, name='encadreur_dashboard'),
    path('connexion/', views.connexion_utilisateur, name='connexion'),
    path('deconnexion/', views.deconnexion, name='deconnexion'),
    path('profil/', views.profil_view, name ='profil')
]
