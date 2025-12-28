from django.db import models

from core.models import Profil, Cours


class Horaire(models.Model):
	"""Horaire créé par un coordinateur pour sa promotion.

	Permet d'informer les étudiants d'une promotion des sessions d'encadrement.
	"""
	coordinateur = models.ForeignKey(Profil, on_delete=models.CASCADE, related_name='horaires')
	titre = models.CharField(max_length=200)
	description = models.TextField(blank=True, null=True)
	cours = models.ForeignKey(Cours, on_delete=models.SET_NULL, null=True, blank=True)
	date_debut = models.DateTimeField()
	date_fin = models.DateTimeField(blank=True, null=True)
	lieu = models.CharField(max_length=200, blank=True, null=True)
	promotion = models.CharField(max_length=50, null=True, blank=True)
	created_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f"{self.titre} — {self.promotion or self.coordinateur.promotion}"
