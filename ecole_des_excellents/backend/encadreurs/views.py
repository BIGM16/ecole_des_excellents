from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model

from core.models import Profil
from .serializers import EncadreurSerializer

User = get_user_model()

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def encadreurs_list_api(request):
    if request.method == "GET":
        encadreurs = Profil.objects.filter(role="encadreur").select_related("user").order_by("user__last_name")
        serializer = EncadreurSerializer(encadreurs, many=True)
        return Response(serializer.data)

    # POST -> créer un encadreur (admin only)
    user = request.user
    profil = getattr(user, "profil", None)
    if not profil or profil.role != "admin":
        return Response({"detail": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    data = request.data
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    if not username or not email or not password:
        return Response({"detail": "username, email et password requis"}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({"detail": "username existe déjà"}, status=status.HTTP_400_BAD_REQUEST)

    user_obj = User.objects.create_user(username=username, email=email, password=password, first_name=data.get("first_name", ""), last_name=data.get("last_name", ""))
    p = Profil.objects.create(user=user_obj, role="encadreur", telephone=data.get("telephone", ""), promotion=data.get("promotion", ""))
    serializer = EncadreurSerializer(p)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def encadreur_detail_api(request, id):
    profil = get_object_or_404(Profil, id=id, role="encadreur")

    if request.method == "GET":
        serializer = EncadreurSerializer(profil)
        return Response(serializer.data)

    # write operations: admin only
    user = request.user
    user_profil = getattr(user, "profil", None)
    if not user_profil or user_profil.role != "admin":
        return Response({"detail": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    if request.method == "PUT":
        data = request.data
        # update user email / name
        u = profil.user
        if "email" in data:
            u.email = data.get("email")
        if "nom" in data:
            # split name into first/last
            parts = data.get("nom", "").strip().split(" ", 1)
            u.first_name = parts[0] if parts else ""
            u.last_name = parts[1] if len(parts) > 1 else ""
        u.save()
        # update profil fields
        profil.telephone = data.get("telephone", profil.telephone)
        profil.promotion = data.get("promotion", profil.promotion)
        profil.save()
        serializer = EncadreurSerializer(profil)
        return Response(serializer.data)

    if request.method == "DELETE":
        # delete user (and profile cascades)
        profil.user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)