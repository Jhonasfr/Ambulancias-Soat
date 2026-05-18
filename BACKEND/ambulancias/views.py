from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q, Count
from django.utils import timezone
from datetime import timedelta
from .models import Organizacion, Sede, Ambulancia, RegistroSOAT
from .serializers import (
    OrganizacionSerializer, SedeSerializer, AmbulanciaSerializer,
    RegistroSOATSerializer, RegistroSOATListSerializer,
)


# ──────────────────────────────────────────────
#  ORGANIZACION  (singleton - solo 1 registro)
# ──────────────────────────────────────────────
class OrganizacionView(APIView):
    permission_classes = [IsAuthenticated]

    def _get_org(self):
        return Organizacion.objects.first()

    def get(self, request):
        org = self._get_org()
        if not org:
            return Response({"detail": "No hay datos de organizacion registrados"}, status=404)
        return Response(OrganizacionSerializer(org).data)

    def post(self, request):
        """Crea o actualiza la organizacion (singleton)."""
        org = self._get_org()
        if org:
            serializer = OrganizacionSerializer(org, data=request.data, partial=True)
        else:
            serializer = OrganizacionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=200 if org else 201)

    def put(self, request):
        org = self._get_org()
        if not org:
            return Response({"error": "No hay organizacion para actualizar"}, status=404)
        serializer = OrganizacionSerializer(org, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


# ──────────────────────────────────────────────
#  SEDES  (CRUD completo)
# ──────────────────────────────────────────────
class SedeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, sede_id=None):
        if sede_id:
            sede = Sede.objects.filter(idsede=sede_id).first()
            if not sede:
                return Response({"error": "Sede no encontrada"}, status=404)
            return Response(SedeSerializer(sede).data)

        sedes = Sede.objects.all().order_by('idsede')
        return Response({
            "count": sedes.count(),
            "results": SedeSerializer(sedes, many=True).data
        })

    def post(self, request):
        serializer = SedeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"mensaje": "Sede creada correctamente", "data": serializer.data}, status=201)

    def put(self, request, sede_id=None):
        if not sede_id:
            return Response({"error": "Se requiere el id de la sede"}, status=400)
        sede = Sede.objects.filter(idsede=sede_id).first()
        if not sede:
            return Response({"error": "Sede no encontrada"}, status=404)
        serializer = SedeSerializer(sede, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"mensaje": "Sede actualizada correctamente", "data": serializer.data})

    def delete(self, request, sede_id=None):
        if not sede_id:
            return Response({"error": "Se requiere el id de la sede"}, status=400)
        sede = Sede.objects.filter(idsede=sede_id).first()
        if not sede:
            return Response({"error": "Sede no encontrada"}, status=404)
        sede.activa = False
        sede.save()
        return Response({"mensaje": "Sede desactivada correctamente"})


# ──────────────────────────────────────────────
#  AMBULANCIAS  (CRUD completo)
# ──────────────────────────────────────────────
class AmbulanciaView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, ambulancia_id=None):
        if ambulancia_id:
            amb = Ambulancia.objects.select_related('sede').filter(idambulancia=ambulancia_id).first()
            if not amb:
                return Response({"error": "Ambulancia no encontrada"}, status=404)
            return Response(AmbulanciaSerializer(amb).data)

        ambulancias = Ambulancia.objects.select_related('sede').order_by('idambulancia')
        return Response({
            "count": ambulancias.count(),
            "results": AmbulanciaSerializer(ambulancias, many=True).data
        })

    def post(self, request):
        serializer = AmbulanciaSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"mensaje": "Ambulancia creada correctamente", "data": serializer.data}, status=201)

    def put(self, request, ambulancia_id=None):
        if not ambulancia_id:
            return Response({"error": "Se requiere el id de la ambulancia"}, status=400)
        amb = Ambulancia.objects.filter(idambulancia=ambulancia_id).first()
        if not amb:
            return Response({"error": "Ambulancia no encontrada"}, status=404)
        serializer = AmbulanciaSerializer(amb, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"mensaje": "Ambulancia actualizada correctamente", "data": serializer.data})

    def delete(self, request, ambulancia_id=None):
        if not ambulancia_id:
            return Response({"error": "Se requiere el id de la ambulancia"}, status=400)
        amb = Ambulancia.objects.filter(idambulancia=ambulancia_id).first()
        if not amb:
            return Response({"error": "Ambulancia no encontrada"}, status=404)
        amb.estado = 0
        amb.save()
        return Response({"mensaje": "Ambulancia desactivada correctamente"})


# ──────────────────────────────────────────────
#  REGISTRO SOAT  (CRUD + exportar TXT)
# ──────────────────────────────────────────────
class RegistroSOATView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, registro_id=None):
        if registro_id:
            reg = RegistroSOAT.objects.select_related('ambulancia', 'sede').filter(idregistro=registro_id).first()
            if not reg:
                return Response({"error": "Registro SOAT no encontrado"}, status=404)
            return Response(RegistroSOATSerializer(reg).data)

        # Listado paginado
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('page_size', 10))
        search = request.GET.get('search', '').strip()

        qs = RegistroSOAT.objects.select_related('sede').order_by('-fecha_registro')
        if search:
            qs = qs.filter(
                Q(nombre_paciente__icontains=search) |
                Q(documento_paciente__icontains=search) |
                Q(placa_ambulancia__icontains=search)
            )

        total = qs.count()
        start = (page - 1) * page_size
        items = qs[start:start + page_size]

        return Response({
            "count": total,
            "page": page,
            "page_size": page_size,
            "results": RegistroSOATListSerializer(items, many=True).data
        })

    def post(self, request):
        serializer = RegistroSOATSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(registrado_por=request.user)
        return Response({
            "mensaje": "Registro SOAT guardado correctamente",
            "data": serializer.data
        }, status=201)

    def put(self, request, registro_id=None):
        if not registro_id:
            return Response({"error": "Se requiere el id del registro"}, status=400)
        reg = RegistroSOAT.objects.filter(idregistro=registro_id).first()
        if not reg:
            return Response({"error": "Registro SOAT no encontrado"}, status=404)
        serializer = RegistroSOATSerializer(reg, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"mensaje": "Registro actualizado correctamente", "data": serializer.data})

    def delete(self, request, registro_id=None):
        if not registro_id:
            return Response({"error": "Se requiere el id del registro"}, status=400)
        reg = RegistroSOAT.objects.filter(idregistro=registro_id).first()
        if not reg:
            return Response({"error": "Registro SOAT no encontrado"}, status=404)
        reg.delete()
        return Response({"mensaje": "Registro SOAT eliminado correctamente"})


class ExportarSOATView(APIView):
    """Exporta un registro SOAT como archivo .txt."""
    permission_classes = [IsAuthenticated]

    def get(self, request, registro_id):
        reg = RegistroSOAT.objects.select_related('sede', 'ambulancia').filter(idregistro=registro_id).first()
        if not reg:
            return Response({"error": "Registro SOAT no encontrado"}, status=404)

        contenido = reg.exportar_txt()
        response = HttpResponse(contenido, content_type='text/plain; charset=utf-8')
        response['Content-Disposition'] = (
            f'attachment; filename="SOAT_{reg.documento_paciente}_{reg.fecha_registro.strftime("%Y-%m-%d")}.txt"'
        )
        return response


# ──────────────────────────────────────────────
#  DASHBOARD  (estadísticas semanales)
# ──────────────────────────────────────────────
class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from usuarios.models import Colaboradores

        hoy = timezone.now().date()
        inicio_semana = hoy - timedelta(days=hoy.weekday())

        registros_semana = RegistroSOAT.objects.filter(
            fecha_registro__date__gte=inicio_semana
        )
        total_semana = registros_semana.count()

        dias_transcurridos = max(hoy.weekday() + 1, 1)
        promedio_diario = round(total_semana / dias_transcurridos, 1)

        dias_labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
        por_dia = []
        for i in range(7):
            dia = inicio_semana + timedelta(days=i)
            count = RegistroSOAT.objects.filter(fecha_registro__date=dia).count()
            por_dia.append({'day': dias_labels[i], 'registros': count})

        ambulancia_top = (
            registros_semana
            .exclude(placa_ambulancia='')
            .values('placa_ambulancia')
            .annotate(total=Count('idregistro'))
            .order_by('-total')
            .first()
        )

        tripulante_top = (
            registros_semana
            .exclude(tripulante1='')
            .values('tripulante1')
            .annotate(total=Count('idregistro'))
            .order_by('-total')
            .first()
        )

        total_empleados = Colaboradores.objects.filter(estadocolaborador=1).count()
        total_ambulancias = Ambulancia.objects.filter(estado=1).count()

        return Response({
            'total_semana': total_semana,
            'promedio_diario': promedio_diario,
            'por_dia': por_dia,
            'ambulancia_destacada': ambulancia_top['placa_ambulancia'] if ambulancia_top else '—',
            'ambulancia_registros': ambulancia_top['total'] if ambulancia_top else 0,
            'mayor_registro_nombre': tripulante_top['tripulante1'] if tripulante_top else '—',
            'mayor_registro_count': tripulante_top['total'] if tripulante_top else 0,
            'total_empleados': total_empleados,
            'total_ambulancias': total_ambulancias,
        })
