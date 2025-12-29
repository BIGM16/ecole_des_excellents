from django.shortcuts import render
from .models import Cours, Profil
from django.contrib.auth.decorators import login_required
from .decorators import role_required
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def auth_me(request):
    user = request.user
    try:
        profil = Profil.objects.get(user=user)
        data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': profil.role,
            'nom_complet': user.get_full_name(),
            'promotion': profil.promotion,
            'photo': profil.photo.url if profil.photo else None,
        }
        return Response(data)
    except Profil.DoesNotExist:
        return Response({'error': 'Profil non trouvé'}, status=404)
