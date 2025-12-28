from django import forms

class DocumentForm(forms.ModelForm):
    """Formulaire pour créer/éditer un Document et uploader plusieurs fichiers."""
    class Meta:
        from .models import Document
        model = Document
        fields = ['titre', 'categorie']
        widgets = {
            'titre': forms.TextInput(attrs={
                'class': 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent'
            }),
            'categorie': forms.Select(attrs={
                'class': 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent'
            })
        }

    class Meta:
        # import local to avoid circular import when module is loaded
        from .models import Document

        model = Document
        fields = ['titre', 'categorie']
