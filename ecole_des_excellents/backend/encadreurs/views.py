from django.shortcuts import render

# Create your views here.

from rest_framework.decorators import api_view
from rest_framework.response import Response
from core.models import Profil
from .serializers import EncadreurSerializer

@api_view(['GET'])
def encadreurs_list(request):
    encadreurs = Profil.objects.filter(role='encadreur')
    serializer = EncadreurSerializer(encadreurs, many=True)
    return Response(serializer.data)