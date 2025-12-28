from django import forms
from core.models import Document, Cours, Profil

class DocumentForm(forms.ModelForm):
	"""Formulaire pour créer/éditer un Document (sans fichiers). Les fichiers sont gérés séparément via l'input multiple."""

	class Meta:
		model = Document
		fields = ['titre', 'categorie']
		widgets = {
			'titre': forms.TextInput(attrs={'class': 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent'}),
			'categorie': forms.Select(attrs={'class': 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent'}),
		}

class CoursForm(forms.ModelForm):
	"""Formulaire pour créer un Cours depuis le tableau de bord admin."""

	class Meta:
		model = Cours
		fields = ['titre', 'description', 'promotion', 'encadreur']
		widgets = {
			'titre': forms.TextInput(attrs={'class': 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent'}),
			'description': forms.Textarea(attrs={'rows': 3, 'class': 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent'}),
			'promotion': forms.Select(attrs={'class': 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent'}),
			'encadreur': forms.Select(attrs={'class': 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent'}),
		}

	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		# limiter les encadreurs aux profils ayant le role 'encadreur'
		try:
			self.fields['encadreur'].queryset = Profil.objects.filter(role='encadreur')
		except Exception:
			pass
