from django.urls import path
from . import views

app_name = "cours"

urlpatterns = [
    path("", views.cours_list_api, name="cours_list_api"),
    path("search/", views.cours_list_api, name="cours_search_api"),
    path("<int:id>/", views.cours_detail_api, name="cours_detail_api"),
    # keep older page-oriented endpoints if still used:
    # path("cours/<int:cours_id>/edit/", views.edit_cours, name="edit_cours"),
    # path("cours/<int:cours_id>/delete/", views.delete_cours, name="delete_cours"),
    # path("create-ajax/", views.create_cours_ajax, name="create_cours_ajax"),
    # path("document/<int:document_id>/fichiers/ajouter/", views.ajouter_fichiers_document, name="ajouter_fichiers_document"),
    # path("document/fichier/<int:file_id>/supprimer/", views.supprimer_document_file, name="supprimer_document_file"),
]