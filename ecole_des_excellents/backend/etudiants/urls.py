from django.urls import path
from . import views

app_name = "etudiants"

urlpatterns = [
    path("", views.etudiants_list_api, name="etudiants_list_api"),
    path("search/", views.etudiants_list_api, name="etudiants_search_api"),  # same handler supports q & promotion
    path("<int:id>/", views.etudiant_detail_api, name="etudiant_detail_api"),
]