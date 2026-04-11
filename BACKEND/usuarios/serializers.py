from rest_framework import serializers
from usuarios.models import Colaboradores, Cargo, Niveles, Regional


class ColaboradorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Colaboradores
        fields = [
            'idcolaborador',
            'nombrecolaborador',
            'apellidocolaborador',
            'correocolaborador'
        ]


class PerfilSerializer(serializers.ModelSerializer):
    class Meta:
        model = Colaboradores
        fields = [
            'idcolaborador',
            'nombrecolaborador',
            'apellidocolaborador',
            'correocolaborador',
            'telefocolaborador'
        ]


class CapacitacionItemSerializer(serializers.Serializer):
    id_capacitacion = serializers.IntegerField()
    nombre_capacitacion = serializers.CharField()
    completada = serializers.BooleanField()
    progreso = serializers.FloatField()
    lecciones_completadas = serializers.IntegerField()
    total_lecciones = serializers.IntegerField()


class ColaboradorListadoSerializer(serializers.ModelSerializer):
    id_colaborador = serializers.IntegerField(source='idcolaborador', read_only=True)
    cc_colaborador = serializers.CharField(source='cccolaborador')
    nombre_colaborador = serializers.CharField(source='nombrecolaborador')
    apellido_colaborador = serializers.CharField(source='apellidocolaborador')
    correo_colaborador = serializers.CharField(source='correocolaborador')
    nombre_cargo = serializers.CharField(source='cargocolaborador.nombrecargo', allow_null=True)
    capacitaciones_totales = serializers.IntegerField(source='total_capacitaciones', read_only=True)
    estado_colaborador = serializers.IntegerField(source='estadocolaborador')
    capacitaciones_completadas = serializers.IntegerField(source='completadas', read_only=True)

    class Meta:
        model = Colaboradores
        fields = [
            'id_colaborador',
            'cc_colaborador',
            'nombre_colaborador',
            'apellido_colaborador',
            'correo_colaborador',
            'nombre_cargo',
            'capacitaciones_totales',
            'estado_colaborador',
            'capacitaciones_completadas',
        ]


class CargoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cargo
        fields = ['idcargo', 'nombrecargo', 'estadocargo']


class NivelesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Niveles
        fields = ['idnivel', 'nombrenivel', 'estadonivel', 'prom']


class RegionalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Regional
        fields = ['idregional', 'nombreregional', 'estadoregional']