"""Compatibilité: réexport des formulaires déplacés vers leurs apps respectives."""

from users.forms import UserProfilForm, UserUpdateForm, ProfilUpdateForm, ChangePasswordForm
from cours.forms import DocumentForm, CoursForm

__all__ = [
    'UserProfilForm',
    'UserUpdateForm',
    'ProfilUpdateForm',
    'ChangePasswordForm',
    'DocumentForm',
    'CoursForm',
]