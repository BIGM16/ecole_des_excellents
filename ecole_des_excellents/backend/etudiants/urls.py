from django.urls import path
from administrateurs import views as admin_views

app_name = 'etudiants'

urlpatterns = [
    path('etudiant/search/', admin_views.search_etudiant, name='search_etudiant'),
    path('etudiant/<int:id>/edit/', admin_views.edit_etudiant, name='edit_etudiant'),
    path('etudiant/<int:id>/delete/', admin_views.delete_etudiant, name='delete_etudiant'),
]

