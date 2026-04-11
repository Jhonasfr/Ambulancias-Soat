# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, UserManager


class Colaboradores(models.Model):
    idcolaborador = models.AutoField(primary_key=True)
    cccolaborador = models.CharField(max_length=30, null=False, blank=True, unique=True)
    nombrecolaborador = models.CharField(max_length=30)
    apellidocolaborador = models.CharField(max_length=30)
    cargocolaborador = models.ForeignKey('Cargo', models.SET_NULL, null=True)
    correocolaborador = models.CharField(max_length=50, blank=True, null=True)
    telefocolaborador = models.CharField(max_length=20, blank=True, null=True)
    estadocolaborador = models.IntegerField(default=1)
    nivelcolaborador = models.ForeignKey('Niveles', models.SET_NULL, null=True)
    regionalcolab = models.ForeignKey('Regional', models.SET_NULL, blank=True, null=True)
    sede = models.ForeignKey('ambulancias.Sede', models.SET_NULL, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'colaboradores'


class Cargo(models.Model):
    idcargo = models.AutoField(primary_key=True)
    nombrecargo = models.CharField(max_length=30)
    estadocargo = models.IntegerField(default=1)

    class Meta:
        managed = True
        db_table = 'cargo'


class Niveles(models.Model):
    idnivel = models.AutoField(primary_key=True)
    nombrenivel = models.CharField(max_length=50)
    estadonivel = models.IntegerField(default=1)
    prom = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'niveles'


class Usuarios(AbstractBaseUser):
    id = models.AutoField(primary_key=True)
    usuario = models.CharField(max_length=30, null=True, blank=True, unique=True)
    password = models.CharField(max_length=500)
    idcolaboradoru = models.ForeignKey(Colaboradores, models.DO_NOTHING, null=True)
    estadousuario = models.IntegerField(default=1)
    tipousuario = models.IntegerField()

    objects = UserManager()

    USERNAME_FIELD = 'usuario'
    REQUIRED_FIELDS = [
        'password'
    ]

    @property
    def is_staff(self):
        """Retorna True si es admin o super admin para acceso al admin de Django"""
        return self.tipousuario in [1, 4]
    
    @property
    def is_superuser(self):
        """Retorna True si es super admin"""
        return self.tipousuario == 4
    
    @property
    def is_active(self):
        """Retorna True si el usuario está activo"""
        return self.estadousuario == 1
    
    def has_perm(self, perm, obj=None):
        """Retorna True si el usuario tiene el permiso especificado"""
        return self.tipousuario in [1, 4]
    
    def has_module_perms(self, app_label):
        """Retorna True si el usuario tiene permisos para ver el módulo"""
        return self.tipousuario in [1, 4]

    class Meta:
        managed = True
        db_table = 'usuarios'


class Regional(models.Model):
    idregional = models.AutoField(primary_key=True)
    nombreregional = models.CharField(max_length=30)
    estadoregional = models.IntegerField(default=1)

    class Meta:
        managed = True
        db_table = 'regional'
