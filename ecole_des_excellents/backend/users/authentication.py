"""Custom JWT authentication that reads tokens from HttpOnly cookies."""

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.backends import TokenBackend
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings


class CookieJWTAuthentication(JWTAuthentication):
    """
    Extend DRF's JWTAuthentication to read JWT from HttpOnly cookies
    instead of requiring the Authorization header.
    
    Priority:
    1. Authorization: Bearer <token> header (traditional)
    2. accessToken cookie (HttpOnly)
    """

    def get_validated_token(self, raw_token):
        """Validate token and return decoded data."""
        try:
            backend = TokenBackend(
                algorithm=settings.SIMPLE_JWT.get('ALGORITHM', 'HS256'),
                signing_key=settings.SIMPLE_JWT.get('SIGNING_KEY', settings.SECRET_KEY),
            )
            validated_token = backend.decode(raw_token, verify=True)
            return validated_token
        except Exception as e:
            raise AuthenticationFailed(f'Invalid token: {str(e)}')

    def authenticate(self, request):
        """
        Attempt to authenticate using JWT from:
        1. Authorization header
        2. accessToken cookie
        """
        # Try Authorization header first (standard approach)
        auth = super().authenticate(request)
        if auth is not None:
            return auth

        # Fall back to cookie-based JWT
        token = request.COOKIES.get('accessToken')
        if not token:
            return None

        try:
            # Decode token using TokenBackend
            validated_token = self.get_validated_token(token)
            user = self.get_user(validated_token)
            return (user, validated_token)
        except Exception:
            # If cookie validation fails, return None (treat as unauthenticated)
            # Don't raise exception here; let other auth methods handle it
            return None
