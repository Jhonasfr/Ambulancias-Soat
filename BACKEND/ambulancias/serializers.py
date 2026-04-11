from rest_framework import serializers
from .models import Organizacion, Sede, Ambulancia, RegistroSOAT


class OrganizacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organizacion
        fields = '__all__'


class SedeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sede
        fields = '__all__'


class AmbulanciaSerializer(serializers.ModelSerializer):
    sede_nombre = serializers.CharField(source='sede.nombre', read_only=True, default=None)
    tipo_display = serializers.CharField(source='get_tipo_display', read_only=True)

    class Meta:
        model = Ambulancia
        fields = '__all__'


class RegistroSOATSerializer(serializers.ModelSerializer):
    sede_nombre = serializers.CharField(source='sede.nombre', read_only=True, default=None)
    ambulancia_placa = serializers.CharField(source='ambulancia.placa', read_only=True, default=None)

    class Meta:
        model = RegistroSOAT
        fields = '__all__'
        read_only_fields = ['fecha_registro', 'registrado_por']


class RegistroSOATListSerializer(serializers.ModelSerializer):
    """Serializer ligero para listados."""
    sede_nombre = serializers.CharField(source='sede.nombre', read_only=True, default=None)

    class Meta:
        model = RegistroSOAT
        fields = [
            'idregistro', 'placa_ambulancia', 'nombre_paciente',
            'documento_paciente', 'fecha_siniestro', 'fecha_registro',
            'sede_nombre',
        ]
