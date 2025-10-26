from django.shortcuts import redirect
from django.contrib import messages

def role_required(allowed_roles=[]):
    def decorator(view_func):
        def wrapper(request, *args, **kwargs):
            profil = getattr(request.user, 'profil', None)
            if profil and profil.role in allowed_roles:
                return view_func(request, *args, **kwargs)
            else:
                messages.error(request, "Accès refusé : vous n'avez pas les permissions nécessaires.")
                return redirect('accueil')
        return wrapper
    return decorator
