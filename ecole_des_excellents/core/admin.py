from django.contrib import admin
from .models import Cours, Document, Profil
# Register your models here.

class DocumentInline(admin.TabularInline):
    model = Document
    extra = 1  # permet d'ajouter plusieurs fichiers à la fois

class CoursAdmin(admin.ModelAdmin):
    inlines = [DocumentInline]

class ProfilAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'bio')  # colonnes visibles
    list_filter = ('role',)
    search_fields = ('user__username', 'user__email')

admin.site.register(Profil, ProfilAdmin)
admin.site.register(Cours, CoursAdmin)
admin.site.register(Document)