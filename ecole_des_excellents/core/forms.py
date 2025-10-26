from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import PasswordResetForm
from .models import Profil
from django.core.exceptions import ValidationError

class UserProfilForm(forms.ModelForm):
    username = forms.CharField(label="Nom d'utilisateur")
    email = forms.EmailField(label="Email")

    class Meta:
        model = Profil
        fields = ['username', 'email', 'photo', 'bio', 'telephone', 'promotion']
        widgets = {
            'bio': forms.Textarea(attrs={'rows': 3, 'class': 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent'}),
            'telephone': forms.TextInput(attrs={'class': 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent'}),
            'photo': forms.FileInput(attrs={'class': 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent'}),
            'promotion': forms.Select(attrs={'class': 'w-full px-3 py-2 border mb-6 border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent'}),
        }

    def save(self, commit=True, request=None):
        username = self.cleaned_data['username']
        email = self.cleaned_data['email']
        if User.objects.filter(username=username).exists():
            raise ValidationError(f"Le nom d'utilisateur '{username}' existe déjà.")
        if User.objects.filter(email=email).exists():
            raise ValidationError(f"L'adresse email '{email}' est déjà utilisée.")
        import random, string
        password = ''.join(random.choices(string.ascii_letters + string.digits, k=10))

        user = User.objects.create_user(username=username, email=email, password=password)
        profil = Profil.objects.create(
            user=user,
            role='etudiant',
            promotion=self.cleaned_data.get('promotion'),
            telephone=self.cleaned_data.get('telephone'),
            bio=self.cleaned_data.get('bio'),
            photo=self.cleaned_data.get('photo'),
        )

        # Envoi de l’e-mail de réinitialisation
        reset_form = PasswordResetForm({'email': email})
        if reset_form.is_valid():
            reset_form.save(
                request=request,
                use_https=request.is_secure(),
                from_email='joanthanmuangala@gmail.com',
                email_template_name='registration/password_reset_email.html'
            )

        print(f"Mot de passe temporaire pour {username} : {password}")
        return profil
