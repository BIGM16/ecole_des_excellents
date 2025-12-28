from django.urls import path
from . import views

app_name = 'coordinateurs'

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('horaire/create/', views.create_horaire_ajax, name='create_horaire_ajax'),
]
