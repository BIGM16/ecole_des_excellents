from django.contrib import admin
from .models import Cours, Document, Profil, DocumentFile


# Inline pour afficher/ajouter les fichiers d'un Document
class DocumentFileInline(admin.TabularInline):
    model = DocumentFile
    extra = 1


# Inline pour afficher/ajouter des Documents depuis la page Cours
# Note : on ne peut pas imbriquer les inlines (DocumentFile inside Document inline) dans l'admin Django.
class DocumentInline(admin.TabularInline):
    model = Document
    extra = 1


class CoursAdmin(admin.ModelAdmin):
    inlines = [DocumentInline]
    list_display = ('titre', 'promotion', 'encadreur', 'date_creation')
    search_fields = ('titre', 'description')


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    inlines = [DocumentFileInline]
    list_display = ('titre', 'cours', 'categorie', 'date_ajout')
    list_filter = ('categorie', 'cours')
    search_fields = ('titre',)


class ProfilAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'bio')  # colonnes visibles
    list_filter = ('role',)
    search_fields = ('user__username', 'user__email')


admin.site.register(Profil, ProfilAdmin)
admin.site.register(Cours, CoursAdmin)