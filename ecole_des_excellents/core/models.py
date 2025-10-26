from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


# Create your models here.
# class Encadreur(models.Model):
#     nom = models.CharField(max_length=100)
#     email = models.EmailField(unique=True)
#     
#     bio = models.TextField(blank=True)

#     def __str__(self):
#         return self.nom

# class Promotion(models.Model) :
#     ROLE_CHOICES = [
#         ('L0', 'Préparatoire'),
#         ('B1', 'BioMédical1'),
#         ('B2', 'BioMédical2'),
#         ('B3', 'BioMédical3'),
#         ('M1', 'Master1'),
#     ]
#     nom = models.CharField(max_length=50, unique= True, null=True, choices=ROLE_CHOICES, default='L0')
#     annee = models.IntegerField(null=True, default='2025')

#     def __str__(self):
#         return f"{self.nom} ({self.annee})"


class Profil(models.Model):
    ROLE_CHOICES = [
        ('admin', 'Administrateur'),
        ('encadreur', 'Encadreur'),
        ('etudiant', 'Étudiant'),
    ]
    PROMOTION_CHOICES = [
        ('L0', 'Préparatoire'),
        ('B1', 'BioMédical1'),
        ('B2', 'BioMédical2'),
        ('B3', 'BioMédical3'),
        ('M1', 'Master1'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='etudiant')
    photo = models.ImageField(upload_to='profils/', blank=True, null=True, default='profils/IMG-20250807-WA0097.jpg')
    bio = models.TextField(blank=True, null=True)
    telephone = models.CharField(max_length=15, blank=True, null=True)
    promotion = models.CharField(max_length=50, null=True, choices=PROMOTION_CHOICES, default='L0')

    def __str__(self):
        return f"{self.user.username} - {self.role}"


# class Etudiant(models.Model) :
#     profil = models.OneToOneField(Profil, on_delete=models.CASCADE, null=True)
#     promotion = models.ForeignKey(Promotion, on_delete=models.CASCADE, null=True, blank=True)
#     nom = models.CharField(max_length=100)
#     email = models.EmailField(unique=True)
#     telephone = models.CharField(max_length=15, blank=True, null=True)
#     date_inscription = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return self.nom


class Cours(models.Model) :
    PROMOTION_CHOICES = [
        ('L0', 'Préparatoire'),
        ('B1', 'BioMédical1'),
        ('B2', 'BioMédical2'),
        ('B3', 'BioMédical3'),
        ('M1', 'Master1'),
    ]

    titre = models.CharField(max_length=100)
    description = models.TextField()
    fichier_pdf = models.FileField(upload_to='pdfs/')
    encadreur = models.ForeignKey(
        Profil, 
        on_delete=models.SET_NULL, 
        null = True, 
        blank = True, 
        limit_choices_to={'role' : 'encadreur'}
    )
    date_creation = models.DateTimeField(auto_now_add=True)
    promotion = models.CharField(max_length=50, null=True, choices=PROMOTION_CHOICES, default='L0')
    
    def __str__(self):
        return self.titre

class Document(models.Model):
    cours = models.ForeignKey(Cours, on_delete=models.CASCADE, related_name='documents')
    titre = models.CharField(max_length=200)
    fichier = models.FileField(upload_to='documents/')
    date_ajout = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.titre} ({self.cours.titre})"

