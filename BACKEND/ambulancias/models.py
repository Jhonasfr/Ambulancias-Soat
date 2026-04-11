from django.db import models
from usuarios.models import Colaboradores


class Organizacion(models.Model):
    idorganizacion = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    nit = models.CharField(max_length=20, unique=True)
    direccion = models.CharField(max_length=200, blank=True, null=True)
    telefono = models.CharField(max_length=30, blank=True, null=True)
    email = models.CharField(max_length=100, blank=True, null=True)
    representante = models.CharField(max_length=100, blank=True, null=True)
    descripcion = models.TextField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'organizacion'

    def __str__(self):
        return self.nombre


class Sede(models.Model):
    idsede = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    direccion = models.CharField(max_length=200, blank=True, null=True)
    telefono = models.CharField(max_length=30, blank=True, null=True)
    responsable = models.CharField(max_length=100, blank=True, null=True)
    activa = models.BooleanField(default=True)

    class Meta:
        managed = True
        db_table = 'sede'

    def __str__(self):
        return self.nombre


class Ambulancia(models.Model):
    TIPO_CHOICES = [
        ('BAT', 'Basica Asistencial Terrestre'),
        ('MAT', 'Medicalizada Asistencial Terrestre'),
        ('TAB', 'Transporte Asistencial Basico'),
        ('TAM', 'Transporte Asistencial Medicalizado'),
    ]
    idambulancia = models.AutoField(primary_key=True)
    placa = models.CharField(max_length=10, unique=True)
    tipo = models.CharField(max_length=5, choices=TIPO_CHOICES)
    sede = models.ForeignKey(Sede, models.SET_NULL, null=True, blank=True)
    estado = models.IntegerField(default=1)  # 1=activa, 0=inactiva

    class Meta:
        managed = True
        db_table = 'ambulancia'

    def __str__(self):
        return f"{self.placa} - {self.get_tipo_display()}"


class RegistroSOAT(models.Model):
    TIPO_DOCUMENTO_CHOICES = [
        ('CC', 'Cedula de Ciudadania'),
        ('TI', 'Tarjeta de Identidad'),
        ('CE', 'Cedula de Extranjeria'),
        ('PA', 'Pasaporte'),
        ('RC', 'Registro Civil'),
    ]
    GENERO_CHOICES = [
        ('M', 'Masculino'),
        ('F', 'Femenino'),
        ('O', 'Otro'),
    ]

    idregistro = models.AutoField(primary_key=True)

    # Ambulancia
    ambulancia = models.ForeignKey(Ambulancia, models.SET_NULL, null=True, blank=True)
    placa_ambulancia = models.CharField(max_length=10, blank=True)
    tipo_ambulancia = models.CharField(max_length=50, blank=True)
    tripulante1 = models.CharField(max_length=100, blank=True)
    tripulante2 = models.CharField(max_length=100, blank=True)
    sede = models.ForeignKey(Sede, models.SET_NULL, null=True, blank=True)

    # Paciente
    nombre_paciente = models.CharField(max_length=100)
    documento_paciente = models.CharField(max_length=30)
    tipo_documento = models.CharField(max_length=3, choices=TIPO_DOCUMENTO_CHOICES, default='CC')
    edad_paciente = models.CharField(max_length=10, blank=True)
    genero_paciente = models.CharField(max_length=1, choices=GENERO_CHOICES, blank=True)
    direccion_paciente = models.CharField(max_length=200, blank=True)
    telefono_paciente = models.CharField(max_length=20, blank=True)

    # Siniestro
    fecha_siniestro = models.DateField(null=True, blank=True)
    hora_siniestro = models.TimeField(null=True, blank=True)
    lugar_siniestro = models.CharField(max_length=200, blank=True)
    tipo_vehiculo = models.CharField(max_length=50, blank=True)
    placa_vehiculo = models.CharField(max_length=10, blank=True)
    poliza = models.CharField(max_length=50, blank=True)
    aseguradora = models.CharField(max_length=100, blank=True)
    descripcion_siniestro = models.TextField(blank=True)

    # IPS
    departamento = models.CharField(max_length=50, blank=True)
    ciudad = models.CharField(max_length=50, blank=True)
    sede_prestadora = models.CharField(max_length=100, blank=True)

    # Meta
    fecha_registro = models.DateTimeField(auto_now_add=True)
    registrado_por = models.ForeignKey(
        'usuarios.Usuarios', models.SET_NULL, null=True, blank=True
    )

    class Meta:
        managed = True
        db_table = 'registro_soat'
        ordering = ['-fecha_registro']

    def __str__(self):
        return f"SOAT-{self.idregistro} | {self.documento_paciente} | {self.fecha_registro}"

    def exportar_txt(self):
        sede_nombre = self.sede.nombre if self.sede else ''
        return (
            f"REGISTRO SOAT - Sistema de Ambulancias\n"
            f"==========================================\n\n"
            f"DATOS DE AMBULANCIA\n"
            f"-------------------\n"
            f"Placa: {self.placa_ambulancia}\n"
            f"Tipo: {self.tipo_ambulancia}\n"
            f"Tripulante 1: {self.tripulante1}\n"
            f"Tripulante 2: {self.tripulante2}\n"
            f"Sede: {sede_nombre}\n\n"
            f"DATOS DEL PACIENTE\n"
            f"------------------\n"
            f"Nombre: {self.nombre_paciente}\n"
            f"Documento: {self.tipo_documento} {self.documento_paciente}\n"
            f"Edad: {self.edad_paciente}\n"
            f"Genero: {self.genero_paciente}\n"
            f"Direccion: {self.direccion_paciente}\n"
            f"Telefono: {self.telefono_paciente}\n\n"
            f"DATOS DEL SINIESTRO\n"
            f"-------------------\n"
            f"Fecha: {self.fecha_siniestro or ''}\n"
            f"Hora: {self.hora_siniestro or ''}\n"
            f"Lugar: {self.lugar_siniestro}\n"
            f"Tipo de Vehiculo: {self.tipo_vehiculo}\n"
            f"Placa Vehiculo: {self.placa_vehiculo}\n"
            f"Poliza: {self.poliza}\n"
            f"Aseguradora: {self.aseguradora}\n"
            f"Descripcion: {self.descripcion_siniestro}\n\n"
            f"DATOS IPS\n"
            f"---------\n"
            f"Departamento: {self.departamento}\n"
            f"Ciudad: {self.ciudad}\n"
            f"Sede Prestadora: {self.sede_prestadora}\n\n"
            f"==========================================\n"
            f"Generado: {self.fecha_registro}\n"
        )
