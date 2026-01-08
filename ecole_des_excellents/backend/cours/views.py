from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db.models import Q
from core.models import Cours
from django.contrib.auth import get_user_model

User = get_user_model()

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def cours_list_api(request):
    # GET: support q, promotion, matiere filters (same behaviour as ancien search_cours)
    if request.method == "GET":
        promotion = request.GET.get("promotion", "all")
        matiere = request.GET.get("matiere", "").strip()
        q = request.GET.get("q", "").strip()
        qs = Cours.objects.all().order_by("-date_creation")
        if promotion and promotion != "all":
            qs = qs.filter(promotion=promotion)
        if matiere and matiere.lower() not in ["all", ""]:
            qs = qs.filter(Q(titre__icontains=matiere) | Q(description__icontains=matiere))
        if q:
            qs = qs.filter(Q(titre__icontains=q) | Q(description__icontains=q))
        results = []
        for c in qs:
            encadreur = None
            if c.encadreur:
                encadreur = c.encadreur.user.get_full_name() or c.encadreur.user.username
            results.append({
                "id": c.id,
                "titre": c.titre,
                "promotion": c.get_promotion_display() if hasattr(c, "get_promotion_display") else c.promotion,
                "encadreur": encadreur,
                "documents_count": c.documents.count() if hasattr(c, "documents") else 0,
            })
        return Response({"results": results})

    # POST: create cours (admin only)
    profil = getattr(request.user, "profil", None)
    if not profil or profil.role != "admin":
        return Response({"detail": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    data = request.data
    titre = data.get("titre")
    if not titre:
        return Response({"detail": "titre requis"}, status=status.HTTP_400_BAD_REQUEST)
    c = Cours.objects.create(titre=titre, description=data.get("description", ""), promotion=data.get("promotion", None))
    return Response({"id": c.id, "titre": c.titre}, status=status.HTTP_201_CREATED)


@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def cours_detail_api(request, id):
    c = get_object_or_404(Cours, id=id)
    if request.method == "GET":
        encadreur = c.encadreur.user.get_full_name() if c.encadreur else None
        data = {
            "id": c.id,
            "titre": c.titre,
            "description": c.description,
            "promotion": c.get_promotion_display() if hasattr(c, "get_promotion_display") else c.promotion,
            "encadreur": encadreur,
        }
        return Response(data)

    profil = getattr(request.user, "profil", None)
    if not profil or profil.role != "admin":
        return Response({"detail": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    if request.method == "PUT":
        data = request.data
        c.titre = data.get("titre", c.titre)
        c.description = data.get("description", c.description)
        c.save()
        return Response({"detail": "updated"})

    if request.method == "DELETE":
        c.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)