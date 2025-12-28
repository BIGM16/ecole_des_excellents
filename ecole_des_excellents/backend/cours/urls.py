from django.urls import path
from . import views

app_name = 'cours'

urlpatterns = [
    path('cours/<int:cours_id>/edit/', views.edit_cours, name='edit_cours'),
    path('cours/<int:cours_id>/document/ajouter/', views.ajouter_document, name='ajouter_document'),
    path('create-ajax/', views.create_cours_ajax, name='create_cours_ajax'),
    path('document/<int:document_id>/fichiers/ajouter/', views.ajouter_fichiers_document, name='ajouter_fichiers_document'),
    path('document/fichier/<int:file_id>/supprimer/', views.supprimer_document_file, name='supprimer_document_file'),
    path('cours/<int:cours_id>/delete/', views.delete_cours, name='delete_cours'),
]

