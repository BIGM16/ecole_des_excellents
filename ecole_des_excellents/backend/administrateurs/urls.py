from django.urls import path
from . import views

app_name = 'administrateurs'

urlpatterns = [
    path('admin_dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('etudiant/<int:id>/edit/', views.edit_etudiant, name='edit_etudiant'),
    path('etudiant/<int:id>/delete/', views.delete_etudiant, name='delete_etudiant'),
    path('etudiant/search/', views.search_etudiant, name='search_etudiant'),
    path('cours/search/', views.search_cours, name='search_cours'),
]

