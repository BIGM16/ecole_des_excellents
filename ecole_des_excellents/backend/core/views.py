from django.shortcuts import render
from .models import Cours, Profil
from django.contrib.auth.decorators import login_required
from .decorators import role_required

def react_app(request):
    return render(request, "core/react.html")


def accueil(request):
    return render(request, 'core/accueil.html')


def contact(request):
    return render(request, 'core/contact.html')


@login_required(login_url='users:connexion')
@role_required(allowed_roles=['etudiant'])
def portail(request):
    cours_list = Cours.objects.all().order_by('-date_creation')
    return render(request, 'etudiants/portail.html', {'cours_list': cours_list})


@login_required(login_url='users:connexion')
@role_required(allowed_roles=['encadreur'])
def encadreur_dashboard(request):
    return render(request, 'encadreurs/encadreur_dashboard.html')
