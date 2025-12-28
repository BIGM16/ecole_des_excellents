from rest_framework import serializers
from core.models import Profil

class EncadreurSerializer(serializers.ModelSerializer):
    nom = serializers.CharField(source='user.get_full_name')
    email = serializers.EmailField(source='user.email')

    class Meta:
        model = Profil
        fields = [
            'id',
            'nom',
            'email',
            'telephone',
            'promotion',
        ]