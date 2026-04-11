import json
import csv
import io
import os
from io import BytesIO
from django.http import JsonResponse, FileResponse
from django.db import transaction
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from usuarios.permissions import IsSuperAdmin, IsAdminUser, IsUsuarioEspecial, IsSuperUserOrAdmin
from usuarios.models import Colaboradores, Usuarios, Cargo, Niveles, Regional
from usuarios.serializers import ColaboradorListadoSerializer, CargoSerializer, NivelesSerializer, RegionalSerializer
from django.db.models import Count, Q, Prefetch
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.worksheet.table import Table, TableStyleInfo


class Perfil(APIView):
    """
    Vista de perfil del colaborador.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, id=None):
        if id is not None:
            colaborador = Colaboradores.objects.select_related(
                'nivelcolaborador',
                'regionalcolab',
                'cargocolaborador'
            ).filter(idcolaborador=id).first()
        else:
            colaborador = request.user.idcolaboradoru
            if colaborador:
                colaborador = Colaboradores.objects.select_related(
                    'nivelcolaborador',
                    'regionalcolab',
                    'cargocolaborador'
                ).filter(idcolaborador=colaborador.idcolaborador).first()

        if not colaborador:
            return Response(
                {"error": "El usuario no tiene colaborador asociado"},
                status=400
            )

        data = {
            "id_colaborador": colaborador.idcolaborador,
            "nombre_colaborador": colaborador.nombrecolaborador,
            "apellido_colaborador": colaborador.apellidocolaborador,
            "correo_colaborador": colaborador.correocolaborador,
            "telefo_colaborador": colaborador.telefocolaborador,
            "nombre_nivel": getattr(colaborador.nivelcolaborador, 'nombrenivel', None) if colaborador.nivelcolaborador_id else None,
            "nombre_regional": getattr(colaborador.regionalcolab, 'nombreregional', None) if colaborador.regionalcolab_id else None,
            "nombre_cargo": getattr(colaborador.cargocolaborador, 'nombrecargo', None) if colaborador.cargocolaborador_id else None,
        }

        return Response(data)

    def patch(self, request, id=None):
        """Alterna el estado del colaborador (0 <-> 1). Requiere id de colaborador."""
        if id is None:
            return Response({"error": "Se requiere el id del colaborador"}, status=400)

        colaborador = Colaboradores.objects.filter(idcolaborador=id).first()
        if not colaborador:
            return Response({"error": "Colaborador no encontrado"}, status=404)

        if hasattr(colaborador, 'estadocolaborador'):
            nuevo_estado = 0 if colaborador.estadocolaborador == 1 else 1
            colaborador.estadocolaborador = nuevo_estado
            colaborador.save()

            usuario = Usuarios.objects.filter(idcolaboradoru=colaborador).first()
            if usuario:
                if nuevo_estado == 0:
                    usuario.estadousuario = 0
                    usuario.save()

            return Response({
                "id_colaborador": colaborador.idcolaborador,
                "nuevo_estado_colaborador": colaborador.estadocolaborador,
                "nuevo_estado_usuario": usuario.estadousuario if usuario else None
            })
        else:
            return Response({"error": "El colaborador no tiene campo 'estadocolaborador'"}, status=400)


class Register(APIView):
    permission_classes = [IsAuthenticated, IsSuperAdmin, IsAdminUser]

    def post(self, request, *args, **kwargs):
        payload = request.data if hasattr(request, 'data') else None
        if not payload:
            try:
                payload = json.loads(request.body.decode('utf-8'))
            except Exception:
                return JsonResponse({'error': 'JSON invalido'}, status=400)

        required_root = ['usuario', 'password', 'idcolaborador']
        if any(key not in payload for key in required_root):
            return JsonResponse({'error': 'Faltan campos requeridos'}, status=400)

        colab_data = payload.get('idcolaborador') or {}
        required_colab = [
            'cc_colaborador', 'nombre_colaborador', 'apellido_colaborador',
            'cargo_colaborador', 'correo_colaborador', 'nivel_colaborador',
            'regional_colab'
        ]
        if any(key not in colab_data for key in required_colab):
            return JsonResponse({'error': 'Faltan datos del colaborador'}, status=400)

        usuario_nombre = payload.get('usuario', '').strip()
        if not usuario_nombre:
            return JsonResponse({'error': 'El usuario no puede estar vacio'}, status=400)
        if Usuarios.objects.filter(usuario=usuario_nombre).exists():
            return JsonResponse({'error': f'El usuario "{usuario_nombre}" ya existe en la base de datos'}, status=400)

        cc_colaborador = colab_data.get('cc_colaborador', '').strip()
        if not cc_colaborador:
            return JsonResponse({'error': 'La cedula del colaborador no puede estar vacia'}, status=400)
        if Colaboradores.objects.filter(cccolaborador=cc_colaborador).exists():
            return JsonResponse({'error': f'El colaborador con cedula "{cc_colaborador}" ya existe en la base de datos'}, status=400)

        try:
            colaborador = Colaboradores.objects.create(
                cccolaborador=colab_data['cc_colaborador'],
                nombrecolaborador=colab_data['nombre_colaborador'],
                apellidocolaborador=colab_data['apellido_colaborador'],
                cargocolaborador_id=colab_data['cargo_colaborador'],
                correocolaborador=colab_data.get('correo_colaborador', ''),
                telefocolaborador=colab_data.get('telefo_colaborador', ''),
                nivelcolaborador_id=colab_data['nivel_colaborador'],
                regionalcolab_id=colab_data['regional_colab'],
            )

            user = Usuarios(
                usuario=payload['usuario'],
                tipousuario=int(payload.get('is_staff', 0)),
                idcolaboradoru=colaborador,
                estadousuario=1,
            )
            user.set_password(payload['password'])
            user.save()

            return JsonResponse({
                'mensaje': 'Usuario y colaborador creados correctamente',
                'usuario_id': user.id,
                'colaborador_id': colaborador.idcolaborador,
            }, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    def get(self, request, colaborador_id):
        colaborador = (
            Colaboradores.objects
            .select_related('cargocolaborador', 'nivelcolaborador', 'regionalcolab')
            .filter(idcolaborador=colaborador_id)
            .first()
        )
        if not colaborador:
            return Response({"error": "Colaborador no encontrado"}, status=404)

        cargo = colaborador.cargocolaborador
        nivel = colaborador.nivelcolaborador
        region = colaborador.regionalcolab

        data = {
            "idcolaborador": colaborador.idcolaborador,
            "nombre": colaborador.nombrecolaborador,
            "apellido": colaborador.apellidocolaborador,
            "correo": colaborador.correocolaborador,
            "telefono": colaborador.telefocolaborador,
            "cargo": cargo.idcargo if cargo else None,
            "nivel": nivel.idnivel if nivel else None,
            "region": region.idregional if region else None,
        }
        return Response(data)

    def put(self, request, colaborador_id):
        colaborador = Colaboradores.objects.filter(idcolaborador=colaborador_id).first()
        if not colaborador:
            return Response({"error": "Colaborador no encontrado"}, status=404)

        data = request.data
        mapeo = {
            'nombre': 'nombrecolaborador',
            'apellido': 'apellidocolaborador',
            'correo': 'correocolaborador',
            'telefono': 'telefocolaborador',
            'cargo': 'cargocolaborador_id',
            'nivel': 'nivelcolaborador_id',
            'region': 'regionalcolab_id',
        }
        for campo_front, campo_modelo in mapeo.items():
            if campo_front in data:
                setattr(colaborador, campo_modelo, data[campo_front])

        if 'estadocolaborador' in data:
            colaborador.estadocolaborador = data['estadocolaborador']

        colaborador.save()
        serializer = ColaboradorListadoSerializer(colaborador)
        return Response(serializer.data)


class RegisterTemporal(APIView):
    permission_classes = [IsAuthenticated, IsSuperAdmin, IsUsuarioEspecial]

    def post(self, request, *args, **kwargs):
        payload = request.data if hasattr(request, 'data') else None
        if not payload:
            try:
                payload = json.loads(request.body.decode('utf-8'))
            except Exception:
                return JsonResponse({'error': 'JSON invalido'}, status=400)

        required_root = ['usuario', 'password', 'idcolaborador']

        if isinstance(payload.get('idcolaborador'), str):
            try:
                payload['idcolaborador'] = json.loads(payload['idcolaborador'])
            except Exception:
                pass

        if any(key not in payload for key in required_root):
            return JsonResponse({'error': 'Faltan campos requeridos'}, status=400)

        usuario_nombre = payload.get('usuario', '').strip()
        if not usuario_nombre:
            return JsonResponse({'error': 'El usuario no puede estar vacio'}, status=400)
        if Usuarios.objects.filter(usuario=usuario_nombre).exists():
            return JsonResponse({'error': f'El usuario {usuario_nombre} ya existe en la base de datos'}, status=400)

        colab_data = payload.get('idcolaborador') or {}
        required_colab_min = [
            'cc_colaborador', 'nombre_colaborador', 'apellido_colaborador'
        ]
        if any(key not in colab_data for key in required_colab_min):
            return JsonResponse({'error': 'Faltan datos minimos del colaborador'}, status=400)

        cc_colaborador = colab_data.get('cc_colaborador', '').strip()
        if not cc_colaborador:
            return JsonResponse({'error': 'La cedula del colaborador no puede estar vacia'}, status=400)
        if Colaboradores.objects.filter(cccolaborador=cc_colaborador).exists():
            return JsonResponse({'error': f'La cedula {cc_colaborador} ya existe en la base de datos'}, status=400)

        try:
            colaborador = Colaboradores.objects.create(
                cccolaborador=colab_data['cc_colaborador'],
                nombrecolaborador=colab_data['nombre_colaborador'],
                apellidocolaborador=colab_data['apellido_colaborador'],
                cargocolaborador_id=colab_data.get('cargo_colaborador'),
                correocolaborador=colab_data.get('correo_colaborador', ''),
                telefocolaborador=colab_data.get('telefo_colaborador', ''),
                nivelcolaborador_id=colab_data.get('nivel_colaborador'),
                regionalcolab_id=colab_data.get('regional_colab'),
            )

            user = Usuarios(
                usuario=payload['usuario'],
                tipousuario=0,
                idcolaboradoru=colaborador,
                estadousuario=1,
            )
            user.set_password(payload['password'])
            user.save()

            return JsonResponse({
                'mensaje': 'Usuario temporal creado',
                'usuario_id': user.id,
                'colaborador_id': colaborador.idcolaborador,
            }, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)


class ListaUsuarios(APIView):
    permission_classes = [IsAuthenticated, IsSuperAdmin, IsAdminUser]

    def get(self, request, *args, **kwargs):
        try:
            page = int(request.GET.get('page', 1))
            page_size = int(request.GET.get('page_size', 10))
            if page < 1:
                page = 1
            if page_size < 1 or page_size > 100:
                page_size = 10

            search = request.GET.get('search', '').strip()

            base_qs = (
                Colaboradores.objects
                .filter(estadocolaborador=1)
                .select_related('cargocolaborador')
                .order_by('idcolaborador')
            )

            if search:
                base_qs = base_qs.filter(
                    Q(nombrecolaborador__icontains=search) |
                    Q(apellidocolaborador__icontains=search) |
                    Q(cccolaborador__icontains=search)
                )

            total = base_qs.count()
            start = (page - 1) * page_size
            end = start + page_size
            items = list(base_qs[start:end])

            results = ColaboradorListadoSerializer(items, many=True).data

            response = {
                'count': total,
                'page': page,
                'page_size': page_size,
                'results': results,
            }
            return Response(response)
        except Exception as e:
            return Response({'error': str(e)}, status=500)


class CargoNivelRegionalView(APIView):
    """Vista para obtener listas de Cargo, Niveles y Regionales."""
    permission_classes = [IsAuthenticated, IsUsuarioEspecial | IsSuperUserOrAdmin]

    def get(self, request):
        cargos = Cargo.objects.filter(estadocargo=1).order_by('nombrecargo')
        niveles = Niveles.objects.filter(estadonivel=1).order_by('nombrenivel')
        regionales = Regional.objects.filter(estadoregional=1).order_by('nombreregional')

        cargos_data = CargoSerializer(cargos, many=True).data
        niveles_data = NivelesSerializer(niveles, many=True).data
        regionales_data = RegionalSerializer(regionales, many=True).data

        return Response({
            "cargos": cargos_data,
            "niveles": niveles_data,
            "regionales": regionales_data
        })


class FiltrarUsuariosView(APIView):
    """Vista para filtrar usuarios por nombre o CC."""
    permission_classes = [IsAuthenticated, IsSuperAdmin, IsAdminUser]

    def get(self, request):
        query = request.GET.get('q', '').strip()
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('page_size', 10))
        if page < 1:
            page = 1
        if page_size < 1 or page_size > 100:
            page_size = 10

        base_qs = (
            Colaboradores.objects
            .exclude(estadocolaborador=3)
            .order_by('idcolaborador')
        )
        if query:
            base_qs = base_qs.filter(
                Q(nombrecolaborador__icontains=query) |
                Q(apellidocolaborador__icontains=query) |
                Q(cccolaborador__icontains=query)
            )

        total = base_qs.count()
        start = (page - 1) * page_size
        end = start + page_size
        items = list(base_qs[start:end])
        results = ColaboradorListadoSerializer(items, many=True).data

        response = {
            'count': total,
            'page': page,
            'page_size': page_size,
            'results': results,
        }
        return Response(response)


class CambiarEstadoUsuarioView(APIView):
    """Vista para activar o desactivar usuarios (uno o multiples)."""
    permission_classes = [IsAuthenticated, IsSuperAdmin]

    def patch(self, request, colaborador_id=None):
        """PATCH individual: /usuarios/cambiar-estado-usuario/<colaborador_id>/"""
        try:
            if colaborador_id is None:
                return Response({"error": "colaborador_id es requerido en la URL"}, status=400)

            nuevo_estado = request.data.get('estado')
            if nuevo_estado is None:
                return Response({"error": "El campo 'estado' es requerido (0 o 1)"}, status=400)
            if nuevo_estado not in [0, 1]:
                return Response({"error": "El estado debe ser 0 (inactivo) o 1 (activo)"}, status=400)

            usuario = Usuarios.objects.filter(idcolaboradoru__idcolaborador=colaborador_id).first()
            if not usuario:
                return Response({"error": "Usuario no encontrado"}, status=404)

            usuario.estadousuario = nuevo_estado
            usuario.save()

            colaborador = getattr(usuario, 'idcolaboradoru', None)
            nuevo_estado_colaborador = None
            if colaborador:
                try:
                    colaborador.estadocolaborador = nuevo_estado
                    colaborador.save()
                    nuevo_estado_colaborador = colaborador.estadocolaborador
                except Exception:
                    nuevo_estado_colaborador = None

            return Response({
                "mensaje": "Estado del usuario actualizado correctamente",
                "usuario_id": usuario.id,
                "colaborador_id": usuario.idcolaboradoru.idcolaborador if getattr(usuario, 'idcolaboradoru', None) else None,
                "nuevo_estado_usuario": usuario.estadousuario,
                "nuevo_estado_colaborador": nuevo_estado_colaborador
            }, status=200)

        except Exception as e:
            return Response({"error": f"Error al actualizar estado: {str(e)}"}, status=500)

    def post(self, request):
        """POST masivo: /usuarios/cambiar-estado-usuario/"""
        try:
            colaborador_ids = request.data.get('colaborador_ids', [])
            cedulas = request.data.get('cedulas', [])
            nuevo_estado = request.data.get('estado')

            if not (isinstance(colaborador_ids, list) or isinstance(cedulas, list)) or (len(colaborador_ids) == 0 and len(cedulas) == 0):
                return Response({"error": "El campo 'colaborador_ids' o 'cedulas' es requerido y debe ser una lista no vacia"}, status=400)

            if nuevo_estado is None:
                return Response({"error": "El campo 'estado' es requerido (0 o 1)"}, status=400)
            if nuevo_estado not in [0, 1]:
                return Response({"error": "El estado debe ser 0 (inactivo) o 1 (activo)"}, status=400)

            encontrados = []
            no_encontrados = []
            actualizados = 0

            for colaborador_id in colaborador_ids:
                try:
                    colaborador = Colaboradores.objects.filter(idcolaborador=colaborador_id).first()
                    if not colaborador:
                        no_encontrados.append({"identificador": colaborador_id, "tipo": "colaborador_id", "error": "Colaborador no encontrado"})
                        continue

                    usuario = Usuarios.objects.filter(idcolaboradoru=colaborador).first()
                    if not usuario:
                        no_encontrados.append({"identificador": colaborador_id, "tipo": "colaborador_id", "error": "Usuario no encontrado para este colaborador"})
                        continue

                    usuario.estadousuario = nuevo_estado
                    usuario.save()
                    colaborador.estadocolaborador = nuevo_estado
                    colaborador.save()

                    nombre_completo = f"{colaborador.nombrecolaborador} {colaborador.apellidocolaborador}".strip()
                    encontrados.append({
                        "colaborador_id": colaborador_id,
                        "usuario_id": usuario.id,
                        "nombre": nombre_completo,
                        "cedula": colaborador.cccolaborador,
                        "estado": nuevo_estado,
                        "success": True
                    })
                    actualizados += 1
                except Exception as e:
                    no_encontrados.append({"identificador": colaborador_id, "tipo": "colaborador_id", "error": str(e)})

            for cedula in cedulas:
                try:
                    colaborador = Colaboradores.objects.filter(cccolaborador=str(cedula)).first()
                    if not colaborador:
                        no_encontrados.append({"identificador": str(cedula), "tipo": "cedula", "error": "Cedula no encontrada"})
                        continue

                    usuario = Usuarios.objects.filter(idcolaboradoru=colaborador).first()
                    if not usuario:
                        no_encontrados.append({"identificador": str(cedula), "tipo": "cedula", "error": "Usuario no encontrado para esta cedula"})
                        continue

                    usuario.estadousuario = nuevo_estado
                    usuario.save()
                    colaborador.estadocolaborador = nuevo_estado
                    colaborador.save()

                    nombre_completo = f"{colaborador.nombrecolaborador} {colaborador.apellidocolaborador}".strip()
                    encontrados.append({
                        "colaborador_id": colaborador.idcolaborador,
                        "usuario_id": usuario.id,
                        "nombre": nombre_completo,
                        "cedula": str(cedula),
                        "estado": nuevo_estado,
                        "success": True
                    })
                    actualizados += 1
                except Exception as e:
                    no_encontrados.append({"identificador": str(cedula), "tipo": "cedula", "error": str(e)})

            return Response({
                "mensaje": f"Procesamiento completado: {actualizados} activados/desactivados, {len(no_encontrados)} no encontrados",
                "total": len(colaborador_ids) + len(cedulas),
                "actualizados": actualizados,
                "no_encontrados": len(no_encontrados),
                "detalles_encontrados": encontrados,
                "detalles_no_encontrados": no_encontrados
            }, status=200)

        except Exception as e:
            return Response({"error": f"Error al procesar estados: {str(e)}"}, status=500)


class ActualizarRolUsuarioView(APIView):
    """Vista para cambiar el rol de un usuario. Solo SuperAdmin."""
    permission_classes = [IsAuthenticated, IsSuperAdmin]

    def patch(self, request, colaborador_id):
        try:
            nuevo_rol = request.data.get('tipousuario')
            if nuevo_rol is None:
                return Response({"error": "El campo 'tipousuario' es requerido"}, status=400)
            if nuevo_rol not in [0, 1, 2, 3, 4]:
                return Response({"error": "El tipousuario debe ser 0, 1, 2, 3 o 4"}, status=400)

            usuario = Usuarios.objects.filter(idcolaboradoru__idcolaborador=colaborador_id).first()
            if not usuario:
                return Response({"error": "Usuario no encontrado"}, status=404)

            rol_anterior = usuario.tipousuario
            usuario.tipousuario = nuevo_rol
            usuario.save()

            return Response({
                "mensaje": "Rol del usuario actualizado correctamente",
                "usuario_id": usuario.id,
                "colaborador_id": usuario.idcolaboradoru.idcolaborador,
                "rol_anterior": rol_anterior,
                "nuevo_rol": usuario.tipousuario
            }, status=200)

        except Exception as e:
            return Response({"error": f"Error al actualizar rol: {str(e)}"}, status=500)


class DatosCargoView(APIView):
    """CRUD para gestionar Cargos."""
    permission_classes = [IsAuthenticated, IsSuperUserOrAdmin | IsUsuarioEspecial]

    def check_permission(self, request):
        tipo_usuario = getattr(request.user, 'tipousuario', None)
        return tipo_usuario in [1, 3, 4]

    def get(self, request):
        try:
            cargos = Cargo.objects.filter(estadocargo=1).order_by('idcargo')
            serializer = CargoSerializer(cargos, many=True)
            return Response({"count": cargos.count(), "results": serializer.data}, status=200)
        except Exception as e:
            return Response({"error": f"Error al obtener cargos: {str(e)}"}, status=500)

    def post(self, request):
        if not self.check_permission(request):
            return Response({"error": "No tiene permisos para crear cargos"}, status=403)
        try:
            nombre_cargo = request.data.get('nombrecargo')
            if not nombre_cargo:
                return Response({"error": "El campo 'nombrecargo' es requerido"}, status=400)
            if Cargo.objects.filter(nombrecargo=nombre_cargo).exists():
                return Response({"error": "El cargo ya existe"}, status=400)

            cargo = Cargo.objects.create(nombrecargo=nombre_cargo, estadocargo=1)
            serializer = CargoSerializer(cargo)
            return Response({"mensaje": "Cargo creado correctamente", "data": serializer.data}, status=201)
        except Exception as e:
            return Response({"error": f"Error al crear cargo: {str(e)}"}, status=500)

    def put(self, request):
        if not self.check_permission(request):
            return Response({"error": "No tiene permisos para actualizar cargos"}, status=403)
        try:
            cargo_id = request.data.get('idcargo')
            nombre_cargo = request.data.get('nombrecargo')
            if not cargo_id:
                return Response({"error": "El campo 'idcargo' es requerido"}, status=400)
            if not nombre_cargo:
                return Response({"error": "El campo 'nombrecargo' es requerido"}, status=400)

            cargo = Cargo.objects.filter(idcargo=cargo_id).first()
            if not cargo:
                return Response({"error": "Cargo no encontrado"}, status=404)

            cargo.nombrecargo = nombre_cargo
            cargo.save()
            serializer = CargoSerializer(cargo)
            return Response({"mensaje": "Cargo actualizado correctamente", "data": serializer.data}, status=200)
        except Exception as e:
            return Response({"error": f"Error al actualizar cargo: {str(e)}"}, status=500)

    def delete(self, request):
        if not self.check_permission(request):
            return Response({"error": "No tiene permisos para eliminar cargos"}, status=403)
        try:
            cargo_id = request.data.get('idcargo')
            if not cargo_id:
                return Response({"error": "El campo 'idcargo' es requerido"}, status=400)

            cargo = Cargo.objects.filter(idcargo=cargo_id).first()
            if not cargo:
                return Response({"error": "Cargo no encontrado"}, status=404)

            cargo.estadocargo = 0
            cargo.save()
            return Response({"mensaje": "Cargo desactivado correctamente", "cargo_id": cargo.idcargo}, status=200)
        except Exception as e:
            return Response({"error": f"Error al eliminar cargo: {str(e)}"}, status=500)


class DatosNivelView(APIView):
    """CRUD para gestionar Niveles."""
    permission_classes = [IsAuthenticated, IsSuperUserOrAdmin | IsUsuarioEspecial]

    def check_permission(self, request):
        tipo_usuario = getattr(request.user, 'tipousuario', None)
        return tipo_usuario in [1, 3, 4]

    def get(self, request):
        try:
            niveles = Niveles.objects.filter(estadonivel=1).order_by('idnivel')
            serializer = NivelesSerializer(niveles, many=True)
            return Response({"count": niveles.count(), "results": serializer.data}, status=200)
        except Exception as e:
            return Response({"error": f"Error al obtener niveles: {str(e)}"}, status=500)

    def post(self, request):
        if not self.check_permission(request):
            return Response({"error": "No tiene permisos para crear niveles"}, status=403)
        try:
            nombre_nivel = request.data.get('nombrenivel')
            if not nombre_nivel:
                return Response({"error": "El campo 'nombrenivel' es requerido"}, status=400)
            if Niveles.objects.filter(nombrenivel=nombre_nivel).exists():
                return Response({"error": "El nivel ya existe"}, status=400)

            nivel = Niveles.objects.create(nombrenivel=nombre_nivel, estadonivel=1)
            serializer = NivelesSerializer(nivel)
            return Response({"mensaje": "Nivel creado correctamente", "data": serializer.data}, status=201)
        except Exception as e:
            return Response({"error": f"Error al crear nivel: {str(e)}"}, status=500)

    def put(self, request):
        if not self.check_permission(request):
            return Response({"error": "No tiene permisos para actualizar niveles"}, status=403)
        try:
            nivel_id = request.data.get('idnivel')
            nombre_nivel = request.data.get('nombrenivel')
            if not nivel_id:
                return Response({"error": "El campo 'idnivel' es requerido"}, status=400)
            if not nombre_nivel:
                return Response({"error": "El campo 'nombrenivel' es requerido"}, status=400)

            nivel = Niveles.objects.filter(idnivel=nivel_id).first()
            if not nivel:
                return Response({"error": "Nivel no encontrado"}, status=404)

            nivel.nombrenivel = nombre_nivel
            nivel.save()
            serializer = NivelesSerializer(nivel)
            return Response({"mensaje": "Nivel actualizado correctamente", "data": serializer.data}, status=200)
        except Exception as e:
            return Response({"error": f"Error al actualizar nivel: {str(e)}"}, status=500)

    def delete(self, request):
        if not self.check_permission(request):
            return Response({"error": "No tiene permisos para eliminar niveles"}, status=403)
        try:
            nivel_id = request.data.get('idnivel')
            if not nivel_id:
                return Response({"error": "El campo 'idnivel' es requerido"}, status=400)

            nivel = Niveles.objects.filter(idnivel=nivel_id).first()
            if not nivel:
                return Response({"error": "Nivel no encontrado"}, status=404)

            nivel.estadonivel = 0
            nivel.save()
            return Response({"mensaje": "Nivel desactivado correctamente", "nivel_id": nivel.idnivel}, status=200)
        except Exception as e:
            return Response({"error": f"Error al eliminar nivel: {str(e)}"}, status=500)


class DatosRegionView(APIView):
    """CRUD para gestionar Regionales."""
    permission_classes = [IsAuthenticated, IsSuperUserOrAdmin | IsUsuarioEspecial]

    def check_permission(self, request):
        tipo_usuario = getattr(request.user, 'tipousuario', None)
        return tipo_usuario in [1, 3, 4]

    def get(self, request):
        try:
            regionales = Regional.objects.filter(estadoregional=1).order_by('idregional')
            serializer = RegionalSerializer(regionales, many=True)
            return Response({"count": regionales.count(), "results": serializer.data}, status=200)
        except Exception as e:
            return Response({"error": f"Error al obtener regionales: {str(e)}"}, status=500)

    def post(self, request):
        if not self.check_permission(request):
            return Response({"error": "No tiene permisos para crear regionales"}, status=403)
        try:
            nombre_regional = request.data.get('nombreregional')
            if not nombre_regional:
                return Response({"error": "El campo 'nombreregional' es requerido"}, status=400)
            if Regional.objects.filter(nombreregional=nombre_regional).exists():
                return Response({"error": "La regional ya existe"}, status=400)

            regional = Regional.objects.create(nombreregional=nombre_regional, estadoregional=1)
            serializer = RegionalSerializer(regional)
            return Response({"mensaje": "Regional creada correctamente", "data": serializer.data}, status=201)
        except Exception as e:
            return Response({"error": f"Error al crear regional: {str(e)}"}, status=500)

    def put(self, request):
        if not self.check_permission(request):
            return Response({"error": "No tiene permisos para actualizar regionales"}, status=403)
        try:
            regional_id = request.data.get('idregional')
            nombre_regional = request.data.get('nombreregional')
            if not regional_id:
                return Response({"error": "El campo 'idregional' es requerido"}, status=400)
            if not nombre_regional:
                return Response({"error": "El campo 'nombreregional' es requerido"}, status=400)

            regional = Regional.objects.filter(idregional=regional_id).first()
            if not regional:
                return Response({"error": "Regional no encontrada"}, status=404)

            regional.nombreregional = nombre_regional
            regional.save()
            serializer = RegionalSerializer(regional)
            return Response({"mensaje": "Regional actualizada correctamente", "data": serializer.data}, status=200)
        except Exception as e:
            return Response({"error": f"Error al actualizar regional: {str(e)}"}, status=500)

    def delete(self, request):
        if not self.check_permission(request):
            return Response({"error": "No tiene permisos para eliminar regionales"}, status=403)
        try:
            regional_id = request.data.get('idregional')
            if not regional_id:
                return Response({"error": "El campo 'idregional' es requerido"}, status=400)

            regional = Regional.objects.filter(idregional=regional_id).first()
            if not regional:
                return Response({"error": "Regional no encontrada"}, status=404)

            regional.estadoregional = 0
            regional.save()
            return Response({"mensaje": "Regional desactivada correctamente", "regional_id": regional.idregional}, status=200)
        except Exception as e:
            return Response({"error": f"Error al eliminar regional: {str(e)}"}, status=500)


class RegistrarMasivoView(APIView):
    """
    Vista para registrar multiples usuarios a traves de un archivo csv utf-8.

    CSV esperado (separador ;):
    cedula;Nombre;Correo;Numero;Region;Nivel;Cargo

    - La cedula se usa como usuario y contrasena.
    - tipousuario por defecto es 0 (colaborador normal).
    - En la columna Nombre vienen apellidos y nombre juntos:
      las dos primeras palabras son apellidos, las siguientes son nombres.
    - Cargo, Nivel y Region se buscan por nombre en la BD.
    """
    permission_classes = [IsAuthenticated, IsSuperUserOrAdmin]
    parser_classes = [MultiPartParser, FormParser]

    def _separar_nombre(self, nombre_completo):
        partes = nombre_completo.strip().split()
        if len(partes) >= 3:
            apellidos = ' '.join(partes[:2])
            nombres = ' '.join(partes[2:])
        elif len(partes) == 2:
            apellidos = partes[0]
            nombres = partes[1]
        else:
            apellidos = nombre_completo.strip()
            nombres = ''
        return apellidos, nombres

    def _buscar_cargo(self, nombre_cargo):
        return Cargo.objects.filter(nombrecargo__iexact=nombre_cargo.strip(), estadocargo=1).first()

    def _buscar_nivel(self, nombre_nivel):
        return Niveles.objects.filter(nombrenivel__iexact=nombre_nivel.strip(), estadonivel=1).first()

    def _buscar_regional(self, nombre_regional):
        return Regional.objects.filter(nombreregional__iexact=nombre_regional.strip(), estadoregional=1).first()

    def post(self, request):
        archivo = request.FILES.get('archivo')
        if not archivo:
            return Response({"error": "Se requiere un archivo CSV. Envielo con el campo 'archivo'."}, status=400)

        if not archivo.name.lower().endswith('.csv'):
            return Response({"error": "El archivo debe ser de tipo .csv"}, status=400)

        try:
            try:
                contenido = archivo.read().decode('utf-8-sig')
            except UnicodeDecodeError:
                try:
                    archivo.seek(0)
                    contenido = archivo.read().decode('latin-1')
                except Exception:
                    return Response({"error": "No se pudo leer el archivo. Asegurese de que este en formato UTF-8."}, status=400)

            primera_linea = contenido.split('\n')[0]
            if ';' in primera_linea:
                delimitador = ';'
            elif ',' in primera_linea:
                delimitador = ','
            else:
                delimitador = ';'

            reader = csv.DictReader(io.StringIO(contenido), delimiter=delimitador)

            if reader.fieldnames is None:
                return Response({"error": "El archivo CSV esta vacio o no tiene encabezados."}, status=400)

            # Mapeo flexible de columnas
            columnas_normalizadas = {}
            for col in reader.fieldnames:
                col_limpio = col.strip().lower()
                columnas_normalizadas[col.strip()] = col_limpio

            mapeo_columnas = {
                'cedula': None, 'nombre': None, 'correo': None, 'numero': None,
                'region': None, 'nivel': None, 'cargo': None
            }

            busquedas_prioritarias = [
                ('cedula', ['cedula', 'cc', 'id']),
                ('numero', ['numero', 'telefono', 'celular']),
                ('region', ['region', 'regional']),
                ('nivel', ['nivel']),
                ('cargo', ['cargo']),
                ('nombre', ['nombre']),
                ('correo', ['correo', 'email']),
            ]

            for esperada, patrones in busquedas_prioritarias:
                for col_original, col_norm in columnas_normalizadas.items():
                    if mapeo_columnas[esperada] is None:
                        if col_norm in patrones or any(patron == col_norm for patron in patrones):
                            mapeo_columnas[esperada] = col_original
                            break
                        if any(patron in col_norm for patron in patrones):
                            mapeo_columnas[esperada] = col_original
                            break

            requeridas = ['cedula', 'nombre']
            faltantes = [c for c in requeridas if mapeo_columnas[c] is None]
            if faltantes:
                return Response(
                    {"error": f"Faltan columnas requeridas en el CSV: {', '.join(faltantes)}. Columnas encontradas: {', '.join(reader.fieldnames)}"},
                    status=400
                )

            # PASO 1: VALIDAR TODAS LAS FILAS
            filas_datos = []
            errores_validacion = []
            cedulas_en_csv = {}

            for num_fila, fila in enumerate(reader, start=2):
                fila_limpia = {k.strip(): (v.strip() if v else '') for k, v in fila.items()}

                cedula = fila_limpia.get(mapeo_columnas.get('cedula', ''), '').strip()
                nombre_completo = fila_limpia.get(mapeo_columnas.get('nombre', ''), '').strip()
                correo = fila_limpia.get(mapeo_columnas.get('correo', ''), '').strip() if mapeo_columnas.get('correo') else ''
                telefono = fila_limpia.get(mapeo_columnas.get('numero', ''), '').strip() if mapeo_columnas.get('numero') else ''
                region_nombre = fila_limpia.get(mapeo_columnas.get('region', ''), '').strip() if mapeo_columnas.get('region') else ''
                nivel_nombre = fila_limpia.get(mapeo_columnas.get('nivel', ''), '').strip() if mapeo_columnas.get('nivel') else ''
                cargo_nombre = fila_limpia.get(mapeo_columnas.get('cargo', ''), '').strip() if mapeo_columnas.get('cargo') else ''

                if not cedula or not nombre_completo:
                    continue

                if cedula in cedulas_en_csv:
                    errores_validacion.append({
                        "fila": num_fila, "cedula": cedula,
                        "error": f"Cedula duplicada en el CSV: {cedula} ya aparece en la fila {cedulas_en_csv[cedula]}"
                    })
                    continue
                cedulas_en_csv[cedula] = num_fila

                if Colaboradores.objects.filter(cccolaborador=cedula).exists():
                    errores_validacion.append({
                        "fila": num_fila, "cedula": cedula,
                        "error": f"Colaborador ya existe: La cedula {cedula} ya esta registrada en la base de datos"
                    })
                    continue

                if Usuarios.objects.filter(usuario=cedula).exists():
                    errores_validacion.append({
                        "fila": num_fila, "cedula": cedula,
                        "error": f"Usuario ya existe: El usuario con cedula {cedula} ya esta registrado"
                    })
                    continue

                apellidos, nombres = self._separar_nombre(nombre_completo)

                cargo_obj = None
                if cargo_nombre:
                    cargo_obj = self._buscar_cargo(cargo_nombre)
                    if not cargo_obj:
                        errores_validacion.append({"fila": num_fila, "cedula": cedula, "error": f"Cargo no encontrado: {cargo_nombre}"})
                        continue

                nivel_obj = None
                if nivel_nombre:
                    nivel_obj = self._buscar_nivel(nivel_nombre)
                    if not nivel_obj:
                        errores_validacion.append({"fila": num_fila, "cedula": cedula, "error": f"Nivel no encontrado: {nivel_nombre}"})
                        continue

                regional_obj = None
                if region_nombre:
                    regional_obj = self._buscar_regional(region_nombre)
                    if not regional_obj:
                        errores_validacion.append({"fila": num_fila, "cedula": cedula, "error": f"Regional no encontrada: {region_nombre}"})
                        continue

                filas_datos.append({
                    "num_fila": num_fila,
                    "cedula": cedula,
                    "nombre": nombres,
                    "apellido": apellidos,
                    "correo": correo,
                    "telefono": telefono,
                    "cargo_obj": cargo_obj,
                    "nivel_obj": nivel_obj,
                    "regional_obj": regional_obj
                })

            if errores_validacion:
                return Response({
                    "error": "Validacion fallida. No se creo ningun registro.",
                    "total_errores": len(errores_validacion),
                    "detalles_errores": errores_validacion
                }, status=400)

            # PASO 2: CREAR TODOS LOS REGISTROS
            if not filas_datos:
                return Response({"error": "El archivo CSV no contiene filas validas para procesar", "total_filas": 0, "creados": 0}, status=400)

            resultados = []
            try:
                with transaction.atomic():
                    for fila_data in filas_datos:
                        try:
                            colaborador = Colaboradores.objects.create(
                                cccolaborador=fila_data['cedula'],
                                nombrecolaborador=fila_data['nombre'],
                                apellidocolaborador=fila_data['apellido'],
                                cargocolaborador=fila_data['cargo_obj'],
                                correocolaborador=fila_data['correo'],
                                telefocolaborador=fila_data['telefono'],
                                nivelcolaborador=fila_data['nivel_obj'],
                                regionalcolab=fila_data['regional_obj'],
                                estadocolaborador=1,
                            )

                            usuario = Usuarios(
                                usuario=fila_data['cedula'],
                                tipousuario=0,
                                idcolaboradoru=colaborador,
                                estadousuario=1,
                            )
                            usuario.set_password(fila_data['cedula'])
                            usuario.save()

                            resultados.append({
                                "fila": fila_data['num_fila'],
                                "cedula": fila_data['cedula'],
                                "nombre": fila_data['nombre'],
                                "apellido": fila_data['apellido'],
                                "usuario_id": usuario.id,
                                "colaborador_id": colaborador.idcolaborador,
                                "success": True
                            })
                        except Exception as e:
                            raise Exception(f"Error en fila {fila_data['num_fila']} (cedula {fila_data['cedula']}): {str(e)}")

                return Response({
                    "mensaje": f"Todos los {len(resultados)} usuarios fueron registrados exitosamente",
                    "total_creados": len(resultados),
                    "detalles": resultados
                }, status=201)

            except Exception as e:
                return Response({
                    "error": f"Error durante la creacion de registros. Ningun usuario fue creado. Detalles: {str(e)}",
                    "total_intentados": len(filas_datos),
                    "creados": 0
                }, status=500)

        except Exception as e:
            return Response({"error": f"Error al procesar el archivo CSV: {str(e)}"}, status=500)

    def put(self, request):
        """Actualizacion masiva de usuarios existentes a traves de un archivo CSV."""
        archivo = request.FILES.get('archivo')
        if not archivo:
            return Response({"error": "Se requiere un archivo CSV. Envielo con el campo 'archivo'."}, status=400)

        if not archivo.name.lower().endswith('.csv'):
            return Response({"error": "El archivo debe ser de tipo .csv"}, status=400)

        try:
            try:
                contenido = archivo.read().decode('utf-8-sig')
            except UnicodeDecodeError:
                try:
                    archivo.seek(0)
                    contenido = archivo.read().decode('latin-1')
                except Exception:
                    return Response({"error": "No se pudo leer el archivo. Asegurese de que este en formato UTF-8."}, status=400)

            primera_linea = contenido.split('\n')[0]
            if ';' in primera_linea:
                delimitador = ';'
            elif ',' in primera_linea:
                delimitador = ','
            else:
                delimitador = ';'

            reader = csv.DictReader(io.StringIO(contenido), delimiter=delimitador)

            if reader.fieldnames is None:
                return Response({"error": "El archivo CSV esta vacio o no tiene encabezados."}, status=400)

            columnas_normalizadas = {}
            for col in reader.fieldnames:
                col_limpio = col.strip().lower()
                columnas_normalizadas[col.strip()] = col_limpio

            mapeo_columnas = {
                'cedula': None, 'nombre': None, 'correo': None, 'numero': None,
                'region': None, 'nivel': None, 'cargo': None
            }

            busquedas_prioritarias = [
                ('cedula', ['cedula', 'cc', 'id']),
                ('numero', ['numero', 'telefono', 'celular']),
                ('region', ['region', 'regional']),
                ('nivel', ['nivel']),
                ('cargo', ['cargo']),
                ('nombre', ['nombre']),
                ('correo', ['correo', 'email']),
            ]

            for esperada, patrones in busquedas_prioritarias:
                for col_original, col_norm in columnas_normalizadas.items():
                    if mapeo_columnas[esperada] is None:
                        if col_norm in patrones or any(patron == col_norm for patron in patrones):
                            mapeo_columnas[esperada] = col_original
                            break
                        if any(patron in col_norm for patron in patrones):
                            mapeo_columnas[esperada] = col_original
                            break

            if mapeo_columnas['cedula'] is None:
                return Response(
                    {"error": f"Falta la columna 'cedula' en el CSV. Columnas encontradas: {', '.join(reader.fieldnames)}"},
                    status=400
                )

            # PASO 1: VALIDAR TODAS LAS FILAS
            filas_existentes = []
            filas_nuevas = []
            errores_validacion = []
            cedulas_en_csv = {}

            for num_fila, fila in enumerate(reader, start=2):
                fila_limpia = {k.strip(): (v.strip() if v else '') for k, v in fila.items()}

                cedula = fila_limpia.get(mapeo_columnas.get('cedula', ''), '').strip()
                nombre_completo = fila_limpia.get(mapeo_columnas.get('nombre', ''), '').strip()
                correo = fila_limpia.get(mapeo_columnas.get('correo', ''), '').strip() if mapeo_columnas.get('correo') else ''
                telefono = fila_limpia.get(mapeo_columnas.get('numero', ''), '').strip() if mapeo_columnas.get('numero') else ''
                region_nombre = fila_limpia.get(mapeo_columnas.get('region', ''), '').strip() if mapeo_columnas.get('region') else ''
                nivel_nombre = fila_limpia.get(mapeo_columnas.get('nivel', ''), '').strip() if mapeo_columnas.get('nivel') else ''
                cargo_nombre = fila_limpia.get(mapeo_columnas.get('cargo', ''), '').strip() if mapeo_columnas.get('cargo') else ''

                if not cedula:
                    continue

                if cedula in cedulas_en_csv:
                    errores_validacion.append({
                        "fila": num_fila, "cedula": cedula,
                        "error": f"Cedula duplicada en el CSV: {cedula} ya aparece en la fila {cedulas_en_csv[cedula]}"
                    })
                    continue
                cedulas_en_csv[cedula] = num_fila

                apellidos, nombres = None, None
                if nombre_completo:
                    apellidos, nombres = self._separar_nombre(nombre_completo)

                colaborador = Colaboradores.objects.filter(cccolaborador=cedula).first()
                es_nuevo = colaborador is None

                if es_nuevo and not nombre_completo:
                    errores_validacion.append({
                        "fila": num_fila, "cedula": cedula,
                        "error": f"El campo 'Nombre' es obligatorio para crear un nuevo colaborador con cedula {cedula}"
                    })
                    continue

                usuario = None
                if not es_nuevo:
                    usuario = Usuarios.objects.filter(idcolaboradoru=colaborador).first()
                    if not usuario:
                        errores_validacion.append({
                            "fila": num_fila, "cedula": cedula,
                            "error": f"El colaborador con cedula {cedula} no tiene usuario asociado en el sistema"
                        })
                        continue

                cargo_obj = None
                if cargo_nombre:
                    cargo_obj = self._buscar_cargo(cargo_nombre)
                    if not cargo_obj:
                        errores_validacion.append({"fila": num_fila, "cedula": cedula, "error": f"Cargo '{cargo_nombre}' no encontrado en la BD"})
                        continue

                nivel_obj = None
                if nivel_nombre:
                    nivel_obj = self._buscar_nivel(nivel_nombre)
                    if not nivel_obj:
                        errores_validacion.append({"fila": num_fila, "cedula": cedula, "error": f"Nivel '{nivel_nombre}' no encontrado en la BD"})
                        continue

                regional_obj = None
                if region_nombre:
                    regional_obj = self._buscar_regional(region_nombre)
                    if not regional_obj:
                        errores_validacion.append({"fila": num_fila, "cedula": cedula, "error": f"Regional '{region_nombre}' no encontrada en la BD"})
                        continue

                fila_obj = {
                    "num_fila": num_fila,
                    "cedula": cedula,
                    "nombre": nombres,
                    "apellido": apellidos,
                    "correo": correo,
                    "telefono": telefono,
                    "cargo_obj": cargo_obj,
                    "nivel_obj": nivel_obj,
                    "regional_obj": regional_obj,
                }

                if es_nuevo:
                    filas_nuevas.append(fila_obj)
                else:
                    fila_obj['colaborador'] = colaborador
                    filas_existentes.append(fila_obj)

            if errores_validacion:
                return Response({
                    "error": "Validacion fallida. No se actualizo ningun registro.",
                    "total_errores": len(errores_validacion),
                    "detalles_errores": errores_validacion
                }, status=400)

            if not filas_nuevas and not filas_existentes:
                return Response({"error": "El archivo CSV no contiene filas validas para procesar", "total_filas": 0, "procesados": 0}, status=400)

            # PASO 2: ACTUALIZAR/CREAR
            resultados = []
            try:
                with transaction.atomic():
                    for fila_data in filas_nuevas:
                        try:
                            colaborador = Colaboradores.objects.create(
                                cccolaborador=fila_data['cedula'],
                                nombrecolaborador=fila_data['nombre'],
                                apellidocolaborador=fila_data['apellido'],
                                cargocolaborador=fila_data['cargo_obj'],
                                correocolaborador=fila_data['correo'],
                                telefocolaborador=fila_data['telefono'],
                                nivelcolaborador=fila_data['nivel_obj'],
                                regionalcolab=fila_data['regional_obj'],
                                estadocolaborador=1,
                            )

                            usuario = Usuarios(
                                usuario=fila_data['cedula'],
                                tipousuario=0,
                                idcolaboradoru=colaborador,
                                estadousuario=1,
                            )
                            usuario.set_password(fila_data['cedula'])
                            usuario.save()

                            resultados.append({
                                "fila": fila_data['num_fila'],
                                "cedula": fila_data['cedula'],
                                "nombre": colaborador.nombrecolaborador,
                                "apellido": colaborador.apellidocolaborador,
                                "usuario_id": usuario.id,
                                "colaborador_id": colaborador.idcolaborador,
                                "accion": "CREADO",
                                "success": True
                            })
                        except Exception as e:
                            raise Exception(f"Error creando fila {fila_data['num_fila']} (cedula {fila_data['cedula']}): {str(e)}")

                    for fila_data in filas_existentes:
                        try:
                            colaborador = fila_data['colaborador']
                            cambios = []

                            if fila_data['nombre'] and fila_data['nombre'] != colaborador.nombrecolaborador:
                                colaborador.nombrecolaborador = fila_data['nombre']
                                cambios.append('nombre')
                            if fila_data['apellido'] and fila_data['apellido'] != colaborador.apellidocolaborador:
                                colaborador.apellidocolaborador = fila_data['apellido']
                                cambios.append('apellido')
                            if fila_data['correo'] and fila_data['correo'] != (colaborador.correocolaborador or ''):
                                colaborador.correocolaborador = fila_data['correo']
                                cambios.append('correo')
                            if fila_data['telefono'] and fila_data['telefono'] != (colaborador.telefocolaborador or ''):
                                colaborador.telefocolaborador = fila_data['telefono']
                                cambios.append('telefono')
                            if fila_data['cargo_obj'] and fila_data['cargo_obj'] != colaborador.cargocolaborador:
                                colaborador.cargocolaborador = fila_data['cargo_obj']
                                cambios.append('cargo')
                            if fila_data['nivel_obj'] and fila_data['nivel_obj'] != colaborador.nivelcolaborador:
                                colaborador.nivelcolaborador = fila_data['nivel_obj']
                                cambios.append('nivel')
                            if fila_data['regional_obj'] and fila_data['regional_obj'] != colaborador.regionalcolab:
                                colaborador.regionalcolab = fila_data['regional_obj']
                                cambios.append('regional')

                            colaborador.save()

                            resultados.append({
                                "fila": fila_data['num_fila'],
                                "cedula": fila_data['cedula'],
                                "nombre": colaborador.nombrecolaborador,
                                "apellido": colaborador.apellidocolaborador,
                                "colaborador_id": colaborador.idcolaborador,
                                "campos_actualizados": cambios,
                                "accion": "ACTUALIZADO",
                                "success": True
                            })
                        except Exception as e:
                            raise Exception(f"Error en fila {fila_data['num_fila']} (cedula {fila_data['cedula']}): {str(e)}")

                creados = len([r for r in resultados if r.get('accion') == 'CREADO'])
                actualizados = len([r for r in resultados if r.get('accion') == 'ACTUALIZADO'])

                return Response({
                    "mensaje": f"Procesamiento completado: {creados} creados, {actualizados} actualizados",
                    "total_creados": creados,
                    "total_actualizados": actualizados,
                    "total_procesados": len(resultados),
                    "detalles": resultados
                }, status=200)

            except Exception as e:
                return Response({
                    "error": f"Error durante el procesamiento. Ningun usuario fue modificado o creado. Detalles: {str(e)}",
                    "total_intentados": len(filas_nuevas) + len(filas_existentes),
                    "creados": 0,
                    "actualizados": 0
                }, status=500)

        except Exception as e:
            return Response({"error": f"Error al procesar el archivo CSV: {str(e)}"}, status=500)

    def get(self, request):
        """Devuelve la plantilla CSV de ejemplo como descarga."""
        template_path = os.path.join(
            os.path.dirname(__file__), 'templates', 'Registrar usurios - ejemplo.csv'
        )
        if os.path.exists(template_path):
            return FileResponse(
                open(template_path, 'rb'),
                as_attachment=True,
                filename='plantilla_registro_masivo.csv'
            )
        return Response({"error": "Plantilla no encontrada"}, status=404)


class ReporteUsuariosView(APIView):
    """
    Vista para generar reportes de usuarios en formato Excel con tabla dinamica.
    """
    permission_classes = [IsAuthenticated, IsSuperAdmin, IsAdminUser]

    def get(self, request):
        try:
            colaboradores = (
                Colaboradores.objects
                .select_related('cargocolaborador', 'nivelcolaborador', 'regionalcolab')
                .prefetch_related(
                    Prefetch(
                        'usuarios_set',
                        queryset=Usuarios.objects.all(),
                        to_attr='usuarios_list'
                    )
                )
                .exclude(estadocolaborador=3)
                .order_by('idcolaborador')
            )

            wb = Workbook()
            ws = wb.active
            ws.title = "Colaboradores"

            header_fill = PatternFill(start_color="4472C4", end_color="4472C4", fill_type="solid")
            header_font = Font(bold=True, color="FFFFFF", size=11)
            header_alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
            border = Border(
                left=Side(style='thin'), right=Side(style='thin'),
                top=Side(style='thin'), bottom=Side(style='thin')
            )
            center_alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)

            columnas = [
                'Cedula', 'Nombre', 'Apellido', 'Correo', 'Celular',
                'Region', 'Nivel', 'Cargo', 'Estado Usuario'
            ]

            for col_num, col_titulo in enumerate(columnas, start=1):
                celda = ws.cell(row=1, column=col_num)
                celda.value = col_titulo
                celda.fill = header_fill
                celda.font = header_font
                celda.alignment = header_alignment
                celda.border = border

            for row_num, colaborador in enumerate(colaboradores, start=2):
                usuarios_list = getattr(colaborador, 'usuarios_list', [])
                estado_usuario = usuarios_list[0].estadousuario if usuarios_list else None

                datos = [
                    colaborador.cccolaborador or '',
                    colaborador.nombrecolaborador or '',
                    colaborador.apellidocolaborador or '',
                    colaborador.correocolaborador or '',
                    colaborador.telefocolaborador or '',
                    colaborador.regionalcolab.nombreregional if colaborador.regionalcolab else '',
                    colaborador.nivelcolaborador.nombrenivel if colaborador.nivelcolaborador else '',
                    colaborador.cargocolaborador.nombrecargo if colaborador.cargocolaborador else '',
                    'Activado' if estado_usuario == 1 else ('Desactivado' if estado_usuario == 0 else 'N/A')
                ]

                for col_num, valor in enumerate(datos, start=1):
                    celda = ws.cell(row=row_num, column=col_num)
                    celda.value = valor
                    celda.alignment = center_alignment
                    celda.border = border

            anchos = [15, 20, 20, 25, 15, 20, 20, 20, 15]
            for col_num, ancho in enumerate(anchos, start=1):
                ws.column_dimensions[chr(64 + col_num)].width = ancho

            tab = Table(displayName="TablaColaboradores", ref=f"A1:I{max(2, ws.max_row)}")
            style = TableStyleInfo(name="TableStyleMedium2", showFirstColumn=False,
                                   showLastColumn=False, showRowStripes=True, showColumnStripes=False)
            tab.tableStyleInfo = style
            ws.add_table(tab)

            archivo_excel = BytesIO()
            wb.save(archivo_excel)
            archivo_excel.seek(0)

            response = FileResponse(
                archivo_excel,
                as_attachment=True,
                filename='Reporte_Usuarios.xlsx',
                content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            )
            return response

        except Exception as e:
            return Response({"error": f"Error al generar el reporte: {str(e)}"}, status=500)
