from django.urls import path
from . import views

app_name = "encadreurs"

urlpatterns = [
    path("", views.encadreurs_list_api, name="encadreurs_list_api"),
    path("<int:id>/", views.encadreur_detail_api, name="encadreur_detail_api"),
]