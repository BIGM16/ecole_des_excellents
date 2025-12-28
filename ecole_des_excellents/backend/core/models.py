from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


# Create your models here.
class Profil(models.Model):
    ROLE_CHOICES = [
        ('admin', 'Administrateur'),
        ('encadreur', 'Encadreur'),
        ('etudiant', 'Étudiant'),
        ('coordinateur', 'Coordinateur'),
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
    cours_enseignes = models.ManyToManyField('Cours', related_name='encadreurs', blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.role}"
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
    # Types de documents (notes, items, résumé, etc.)
    DOCUMENT_TYPE_CHOICES = [
        ('notes', 'Notes'),
        ('items', 'Items'),
        ('resume', 'Résumé'),
        ('autre', 'Autre'),
    ]
    cours = models.ForeignKey(Cours, on_delete=models.CASCADE, related_name='documents')
    titre = models.CharField(max_length=200)
    categorie = models.CharField(max_length=20, choices=DOCUMENT_TYPE_CHOICES, default='notes')
    date_ajout = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.titre} ({self.cours.titre}) - {self.categorie}"


class DocumentFile(models.Model):
    """Permet d'attacher plusieurs fichiers à un même Document.

    Exemple d'utilisation : créer un Document, puis plusieurs DocumentFile liés à ce Document.
    """
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='fichiers')
    fichier = models.FileField(upload_to='documents/')
    nom = models.CharField(max_length=200, blank=True, null=True)
    date_ajout = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nom or self.fichier.name} ({self.document.titre})"

