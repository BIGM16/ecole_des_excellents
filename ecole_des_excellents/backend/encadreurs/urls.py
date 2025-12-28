from django.urls import path
from core import views as core_views
from .views import encadreurs_list

app_name = 'encadreurs'

urlpatterns = [
    path('encadreur_dashboard/', core_views.encadreur_dashboard, name='encadreur_dashboard'),
    path('encadreurs/', encadreurs_list, name='encadreurs_list'),
]

