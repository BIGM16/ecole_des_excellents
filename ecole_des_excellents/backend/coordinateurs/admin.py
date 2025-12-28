from django.contrib import admin
from .models import Horaire


@admin.register(Horaire)
class HoraireAdmin(admin.ModelAdmin):
	list_display = ('titre', 'coordinateur', 'promotion', 'date_debut', 'lieu')
	list_filter = ('promotion', 'date_debut')
	search_fields = ('titre', 'description')
