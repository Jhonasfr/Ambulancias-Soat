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
    tipo_documento = serializers.CharField(allow_null=True, required=False)
    nombre_colaborador = serializers.CharField(source='nombrecolaborador')
    apellido_colaborador = serializers.CharField(source='apellidocolaborador')
    correo_colaborador = serializers.CharField(source='correocolaborador')
    telefo_colaborador = serializers.CharField(source='telefocolaborador', allow_null=True, required=False)
    direccion = serializers.CharField(allow_null=True, required=False)
    nombre_cargo = serializers.CharField(source='cargocolaborador.nombrecargo', allow_null=True)
    nombre_sede = serializers.CharField(source='sede.nombre', allow_null=True)
    ambulancia_id = serializers.IntegerField(source='ambulancia_id', allow_null=True, read_only=True)
    ambulancia_placa = serializers.CharField(source='ambulancia.placa', allow_null=True, read_only=True)
    capacitaciones_totales = serializers.IntegerField(source='total_capacitaciones', read_only=True)
    estado_colaborador = serializers.IntegerField(source='estadocolaborador')
    capacitaciones_completadas = serializers.IntegerField(source='completadas', read_only=True)
    numero_licencia = serializers.CharField(allow_null=True, required=False)
    especialidad = serializers.CharField(allow_null=True, required=False)
    tipo_sangre = serializers.CharField(allow_null=True, required=False)
    contacto_emergencia = serializers.CharField(allow_null=True, required=False)

    class Meta:
        model = Colaboradores
        fields = [
            'id_colaborador',
            'cc_colaborador',
            'tipo_documento',
            'nombre_colaborador',
            'apellido_colaborador',
            'correo_colaborador',
            'telefo_colaborador',
            'direccion',
            'nombre_cargo',
            'nombre_sede',
            'ambulancia_id',
            'ambulancia_placa',
            'capacitaciones_totales',
            'estado_colaborador',
            'capacitaciones_completadas',
            'numero_licencia',
            'especialidad',
            'tipo_sangre',
            'contacto_emergencia',
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