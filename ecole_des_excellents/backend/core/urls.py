from django.urls import path
from . import views

app_name = 'core'

urlpatterns = [
    path('', views.accueil, name='accueil'),
    path('contact/', views.contact, name='contact'),
    path('portail/', views.portail, name='portail'),
    path('app/', views.react_app, name='react'),
]
