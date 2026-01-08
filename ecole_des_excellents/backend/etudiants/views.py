from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from core.models import Profil
from django.contrib.auth import get_user_model

User = get_user_model()

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def etudiants_list_api(request):
    # GET: liste filtrable via q & promotion query params
    if request.method == "GET":
        q = request.GET.get("q", "").strip()
        promotion = request.GET.get("promotion", "all")
        qs = Profil.objects.select_related("user").filter(role="etudiant")
        if promotion and promotion != "all":
            qs = qs.filter(promotion=promotion)
        if q:
            qs = qs.filter(
                q(user__username__icontains=q) |
                q(user__email__icontains=q) |
                q(telephone__icontains=q)
            )
        results = []
        for e in qs:
            results.append({
                "id": e.id,
                "nom": e.user.get_full_name() or e.user.username,
                "email": e.user.email,
                "promotion": e.get_promotion_display() if hasattr(e, "get_promotion_display") else e.promotion,
                "telephone": e.telephone,
                "photo": e.photo.url if e.photo else None,
            })
        return Response({"results": results})

    # POST: create étudiant (admin only)
    user_profil = getattr(request.user, "profil", None)
    if not user_profil or user_profil.role != "admin":
        return Response({"detail": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    data = request.data
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    if not username or not email or not password:
        return Response({"detail": "username,email,password requis"}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({"detail": "username existe"}, status=status.HTTP_400_BAD_REQUEST)

    u = User.objects.create_user(username=username, email=email, password=password, first_name=data.get("first_name", ""), last_name=data.get("last_name", ""))
    p = Profil.objects.create(user=u, role="etudiant", promotion=data.get("promotion", ""), telephone=data.get("telephone", ""))
    return Response({"id": p.id, "nom": u.get_full_name(), "email": u.email}, status=status.HTTP_201_CREATED)


@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def etudiant_detail_api(request, id):
    p = get_object_or_404(Profil, id=id, role="etudiant")
    if request.method == "GET":
        data = {
            "id": p.id,
            "nom": p.user.get_full_name() or p.user.username,
            "email": p.user.email,
            "promotion": p.get_promotion_display() if hasattr(p, "get_promotion_display") else p.promotion,
            "telephone": p.telephone,
            "photo": p.photo.url if p.photo else None,
        }
        return Response(data)

    user_profil = getattr(request.user, "profil", None)
    if not user_profil or user_profil.role != "admin":
        return Response({"detail": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    if request.method == "PUT":
        data = request.data
        u = p.user
        if "email" in data:
            u.email = data.get("email")
        if "nom" in data:
            parts = data.get("nom", "").strip().split(" ", 1)
            u.first_name = parts[0] if parts else ""
            u.last_name = parts[1] if len(parts) > 1 else ""
        u.save()
        p.telephone = data.get("telephone", p.telephone)
        p.promotion = data.get("promotion", p.promotion)
        p.save()
        return Response({"detail": "updated"})

    if request.method == "DELETE":
        p.user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)