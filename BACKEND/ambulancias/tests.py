
"""
Protocolo de pruebas - API Ambulancias SOAT
============================================
Cubre todos los endpoints definidos en ambulancias/urls.py:

  GET/POST/PUT  /api/organizacion/
  GET/POST/PUT/DELETE  /api/sedes/  y  /api/sedes/<id>/
  GET/POST/PUT/DELETE  /api/ambulancias/  y  /api/ambulancias/<id>/
  GET/POST/PUT/DELETE  /api/soat/  y  /api/soat/<id>/
  GET            /api/soat/<id>/exportar/

Estrategia de autenticación: force_authenticate() para aislar la lógica
de negocio sin depender de JWT en el entorno de pruebas.
"""

from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status

from .models import Organizacion, Sede, Ambulancia, RegistroSOAT
from usuarios.models import Usuarios


# ──────────────────────────────────────────────
#  Helpers
# ──────────────────────────────────────────────

def _crear_usuario(usuario="testusr", tipousuario=2):
    """Crea un usuario de prueba sin colaborador (campo nullable)."""
    u = Usuarios(usuario=usuario, tipousuario=tipousuario, estadousuario=1)
    u.set_password("TestPass@1234")
    u.save()
    return u


def _crear_sede(nombre="Sede Central", activa=True):
    return Sede.objects.create(
        nombre=nombre,
        direccion="Calle 123",
        telefono="3001234567",
        responsable="Juan Pérez",
        activa=activa,
    )


def _crear_ambulancia(placa="ABC123", tipo="BAT", sede=None):
    return Ambulancia.objects.create(
        placa=placa,
        tipo=tipo,
        sede=sede,
        estado=1,
    )


def _crear_soat(sede=None, ambulancia=None, usuario=None, documento="12345678"):
    return RegistroSOAT.objects.create(
        placa_ambulancia=ambulancia.placa if ambulancia else "XYZ999",
        tipo_ambulancia="BAT",
        nombre_paciente="Pedro Ramírez",
        documento_paciente=documento,
        tipo_documento="CC",
        ambulancia=ambulancia,
        sede=sede,
        registrado_por=usuario,
    )


# ──────────────────────────────────────────────
#  ORGANIZACION
# ──────────────────────────────────────────────

class OrganizacionTests(APITestCase):
    """Pruebas del endpoint singleton /api/organizacion/"""

    def setUp(self):
        self.client = APIClient()
        self.user = _crear_usuario()
        self.client.force_authenticate(user=self.user)
        self.url = reverse("organizacion")

    # ── Autenticación ──────────────────────────

    def test_get_sin_autenticacion_retorna_401(self):
        """Un cliente sin token no puede acceder."""
        cliente_anonimo = APIClient()
        resp = cliente_anonimo.get(self.url)
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    # ── GET ────────────────────────────────────

    def test_get_sin_datos_retorna_404(self):
        """Si no hay organización registrada se retorna 404."""
        resp = self.client.get(self.url)
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_con_datos_retorna_200_y_campos(self):
        """Si existe organización se devuelven sus datos."""
        Organizacion.objects.create(nombre="Empresa Test", nit="900111222-3")
        resp = self.client.get(self.url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["nombre"], "Empresa Test")
        self.assertEqual(resp.data["nit"], "900111222-3")

    # ── POST ───────────────────────────────────

    def test_post_crea_organizacion_retorna_201(self):
        """POST crea la organización cuando no existe ninguna."""
        payload = {
            "nombre": "Ambulancias SA",
            "nit": "800123456-1",
            "direccion": "Av. Principal 100",
        }
        resp = self.client.post(self.url, payload, format="json")
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Organizacion.objects.exists())

    def test_post_actualiza_organizacion_existente_retorna_200(self):
        """POST sobre organización existente actúa como PATCH (singleton)."""
        Organizacion.objects.create(nombre="Viejo Nombre", nit="111-1")
        resp = self.client.post(self.url, {"nombre": "Nuevo Nombre"}, format="json")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["nombre"], "Nuevo Nombre")
        self.assertEqual(Organizacion.objects.count(), 1)

    def test_post_sin_nombre_retorna_400(self):
        """Crear organización sin campo requerido retorna 400."""
        resp = self.client.post(self.url, {"nit": "solo-nit"}, format="json")
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    # ── PUT ────────────────────────────────────

    def test_put_actualiza_organizacion(self):
        """PUT actualiza parcialmente la organización existente."""
        Organizacion.objects.create(nombre="Original", nit="222-2")
        resp = self.client.put(self.url, {"telefono": "6017654321"}, format="json")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["telefono"], "6017654321")

    def test_put_sin_organizacion_retorna_404(self):
        """PUT sin organización creada retorna 404."""
        resp = self.client.put(self.url, {"nombre": "X"}, format="json")
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)


# ──────────────────────────────────────────────
#  SEDES
# ──────────────────────────────────────────────

class SedeListTests(APITestCase):
    """Pruebas del endpoint de lista /api/sedes/"""

    def setUp(self):
        self.client = APIClient()
        self.user = _crear_usuario("user_sedes")
        self.client.force_authenticate(user=self.user)
        self.url = reverse("sedes")

    # ── Autenticación ──────────────────────────

    def test_get_sin_autenticacion_retorna_401(self):
        cliente_anonimo = APIClient()
        resp = cliente_anonimo.get(self.url)
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    # ── GET lista ──────────────────────────────

    def test_get_lista_vacia(self):
        """Lista vacía retorna count=0."""
        resp = self.client.get(self.url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["count"], 0)
        self.assertEqual(resp.data["results"], [])

    def test_get_lista_con_sedes(self):
        """Devuelve todas las sedes creadas."""
        _crear_sede("Sede Norte")
        _crear_sede("Sede Sur")
        resp = self.client.get(self.url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["count"], 2)

    # ── POST ───────────────────────────────────

    def test_post_crea_sede_correctamente(self):
        """POST crea sede y retorna 201 con mensaje."""
        payload = {
            "nombre": "Sede Occidente",
            "direccion": "Calle 50 # 30-15",
            "telefono": "3109876543",
            "responsable": "Ana Gómez",
            "activa": True,
        }
        resp = self.client.post(self.url, payload, format="json")
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertIn("mensaje", resp.data)
        self.assertTrue(Sede.objects.filter(nombre="Sede Occidente").exists())

    def test_post_sin_nombre_retorna_400(self):
        """Nombre es requerido; sin él retorna 400."""
        resp = self.client.post(self.url, {"direccion": "Sin nombre"}, format="json")
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)


class SedeDetalleTests(APITestCase):
    """Pruebas del endpoint de detalle /api/sedes/<id>/"""

    def setUp(self):
        self.client = APIClient()
        self.user = _crear_usuario("user_sede_det")
        self.client.force_authenticate(user=self.user)
        self.sede = _crear_sede()
        self.url = reverse("sede-detalle", kwargs={"sede_id": self.sede.idsede})
        self.url_inexistente = reverse("sede-detalle", kwargs={"sede_id": 99999})

    # ── GET detalle ────────────────────────────

    def test_get_sede_existente(self):
        resp = self.client.get(self.url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["nombre"], self.sede.nombre)

    def test_get_sede_inexistente_retorna_404(self):
        resp = self.client.get(self.url_inexistente)
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)

    # ── PUT ────────────────────────────────────

    def test_put_actualiza_sede(self):
        resp = self.client.put(self.url, {"responsable": "Carlos López"}, format="json")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["data"]["responsable"], "Carlos López")

    def test_put_sede_inexistente_retorna_404(self):
        resp = self.client.put(self.url_inexistente, {"nombre": "X"}, format="json")
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)

    # ── DELETE ─────────────────────────────────

    def test_delete_desactiva_sede(self):
        """DELETE marca la sede como inactiva (soft-delete)."""
        resp = self.client.delete(self.url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.sede.refresh_from_db()
        self.assertFalse(self.sede.activa)

    def test_delete_sede_inexistente_retorna_404(self):
        resp = self.client.delete(self.url_inexistente)
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)


# ──────────────────────────────────────────────
#  AMBULANCIAS
# ──────────────────────────────────────────────

class AmbulanciaListTests(APITestCase):
    """Pruebas del endpoint de lista /api/ambulancias/"""

    def setUp(self):
        self.client = APIClient()
        self.user = _crear_usuario("user_amb")
        self.client.force_authenticate(user=self.user)
        self.url = reverse("ambulancias")

    # ── Autenticación ──────────────────────────

    def test_get_sin_autenticacion_retorna_401(self):
        cliente_anonimo = APIClient()
        resp = cliente_anonimo.get(self.url)
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    # ── GET lista ──────────────────────────────

    def test_get_lista_vacia(self):
        resp = self.client.get(self.url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["count"], 0)

    def test_get_lista_con_ambulancias(self):
        sede = _crear_sede()
        _crear_ambulancia("AAA001", sede=sede)
        _crear_ambulancia("BBB002", tipo="MAT", sede=sede)
        resp = self.client.get(self.url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["count"], 2)

    # ── POST ───────────────────────────────────

    def test_post_crea_ambulancia_correctamente(self):
        sede = _crear_sede()
        payload = {
            "placa": "CCC333",
            "tipo": "TAB",
            "sede": sede.idsede,
            "estado": 1,
        }
        resp = self.client.post(self.url, payload, format="json")
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertIn("mensaje", resp.data)
        self.assertTrue(Ambulancia.objects.filter(placa="CCC333").exists())

    def test_post_sin_placa_retorna_400(self):
        resp = self.client.post(self.url, {"tipo": "BAT"}, format="json")
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_post_tipo_invalido_retorna_400(self):
        resp = self.client.post(
            self.url,
            {"placa": "ZZZ999", "tipo": "INVALIDO"},
            format="json",
        )
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_post_placa_duplicada_retorna_400(self):
        """Placa única; duplicar retorna 400."""
        _crear_ambulancia("DDD444")
        resp = self.client.post(self.url, {"placa": "DDD444", "tipo": "BAT"}, format="json")
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)


class AmbulanciaDetalleTests(APITestCase):
    """Pruebas del endpoint de detalle /api/ambulancias/<id>/"""

    def setUp(self):
        self.client = APIClient()
        self.user = _crear_usuario("user_amb_det")
        self.client.force_authenticate(user=self.user)
        self.sede = _crear_sede()
        self.amb = _crear_ambulancia("EEE555", sede=self.sede)
        self.url = reverse("ambulancia-detalle", kwargs={"ambulancia_id": self.amb.idambulancia})
        self.url_inexistente = reverse("ambulancia-detalle", kwargs={"ambulancia_id": 99999})

    # ── GET detalle ────────────────────────────

    def test_get_ambulancia_existente(self):
        resp = self.client.get(self.url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["placa"], "EEE555")

    def test_get_ambulancia_incluye_sede_nombre(self):
        """El serializer añade el campo calculado sede_nombre."""
        resp = self.client.get(self.url)
        self.assertIn("sede_nombre", resp.data)
        self.assertEqual(resp.data["sede_nombre"], self.sede.nombre)

    def test_get_ambulancia_inexistente_retorna_404(self):
        resp = self.client.get(self.url_inexistente)
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)

    # ── PUT ────────────────────────────────────

    def test_put_actualiza_ambulancia(self):
        resp = self.client.put(self.url, {"tipo": "MAT"}, format="json")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.amb.refresh_from_db()
        self.assertEqual(self.amb.tipo, "MAT")

    def test_put_ambulancia_inexistente_retorna_404(self):
        resp = self.client.put(self.url_inexistente, {"tipo": "BAT"}, format="json")
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)

    # ── DELETE ─────────────────────────────────

    def test_delete_desactiva_ambulancia(self):
        """DELETE marca estado=0 (soft-delete)."""
        resp = self.client.delete(self.url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.amb.refresh_from_db()
        self.assertEqual(self.amb.estado, 0)

    def test_delete_ambulancia_inexistente_retorna_404(self):
        resp = self.client.delete(self.url_inexistente)
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)


# ──────────────────────────────────────────────
#  REGISTRO SOAT
# ──────────────────────────────────────────────

class SOATListTests(APITestCase):
    """Pruebas del endpoint de lista /api/soat/"""

    def setUp(self):
        self.client = APIClient()
        self.user = _crear_usuario("user_soat")
        self.client.force_authenticate(user=self.user)
        self.url = reverse("soat-lista")
        self.sede = _crear_sede()
        self.amb = _crear_ambulancia(sede=self.sede)

    # ── Autenticación ──────────────────────────

    def test_get_sin_autenticacion_retorna_401(self):
        cliente_anonimo = APIClient()
        resp = cliente_anonimo.get(self.url)
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    # ── GET lista ──────────────────────────────

    def test_get_lista_vacia(self):
        resp = self.client.get(self.url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["count"], 0)
        self.assertEqual(resp.data["results"], [])

    def test_get_lista_con_registros(self):
        _crear_soat(self.sede, self.amb, self.user, "11111111")
        _crear_soat(self.sede, self.amb, self.user, "22222222")
        resp = self.client.get(self.url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["count"], 2)

    # ── Paginación ─────────────────────────────

    def test_paginacion_page_y_page_size(self):
        """page y page_size recortan el resultado correctamente."""
        for i in range(15):
            _crear_soat(self.sede, self.amb, self.user, str(i).zfill(8))
        resp = self.client.get(self.url, {"page": 2, "page_size": 5})
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["count"], 15)
        self.assertEqual(len(resp.data["results"]), 5)
        self.assertEqual(resp.data["page"], 2)

    # ── Búsqueda ───────────────────────────────

    def test_search_por_nombre_paciente(self):
        _crear_soat(self.sede, self.amb, self.user, "33333333")
        RegistroSOAT.objects.filter(
            documento_paciente="33333333"
        ).update(nombre_paciente="Lucía Fernández")
        resp = self.client.get(self.url, {"search": "Lucía"})
        self.assertEqual(resp.data["count"], 1)

    def test_search_por_documento(self):
        _crear_soat(self.sede, self.amb, self.user, "99887766")
        resp = self.client.get(self.url, {"search": "99887766"})
        self.assertEqual(resp.data["count"], 1)

    def test_search_por_placa_ambulancia(self):
        _crear_soat(self.sede, self.amb, self.user, "55667788")
        placa = self.amb.placa
        resp = self.client.get(self.url, {"search": placa})
        self.assertGreaterEqual(resp.data["count"], 1)

    def test_search_sin_resultados(self):
        resp = self.client.get(self.url, {"search": "XXXXXX"})
        self.assertEqual(resp.data["count"], 0)

    # ── POST ───────────────────────────────────

    def test_post_crea_registro_correctamente(self):
        payload = {
            "nombre_paciente": "María Torres",
            "documento_paciente": "44556677",
            "tipo_documento": "CC",
            "placa_ambulancia": self.amb.placa,
            "tipo_ambulancia": "BAT",
            "ambulancia": self.amb.idambulancia,
            "sede": self.sede.idsede,
        }
        resp = self.client.post(self.url, payload, format="json")
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertIn("mensaje", resp.data)
        self.assertTrue(
            RegistroSOAT.objects.filter(documento_paciente="44556677").exists()
        )

    def test_post_asigna_registrado_por(self):
        """El campo registrado_por debe quedar como el usuario autenticado."""
        payload = {
            "nombre_paciente": "Luis Mora",
            "documento_paciente": "77889900",
            "tipo_documento": "CC",
        }
        self.client.post(self.url, payload, format="json")
        reg = RegistroSOAT.objects.get(documento_paciente="77889900")
        self.assertEqual(reg.registrado_por, self.user)

    def test_post_sin_nombre_paciente_retorna_400(self):
        resp = self.client.post(
            self.url,
            {"documento_paciente": "00000000"},
            format="json",
        )
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)


class SOATDetalleTests(APITestCase):
    """Pruebas del endpoint de detalle /api/soat/<id>/"""

    def setUp(self):
        self.client = APIClient()
        self.user = _crear_usuario("user_soat_det")
        self.client.force_authenticate(user=self.user)
        self.sede = _crear_sede()
        self.amb = _crear_ambulancia("FFF666", sede=self.sede)
        self.reg = _crear_soat(self.sede, self.amb, self.user)
        self.url = reverse("soat-detalle", kwargs={"registro_id": self.reg.idregistro})
        self.url_inexistente = reverse("soat-detalle", kwargs={"registro_id": 99999})

    # ── GET detalle ────────────────────────────

    def test_get_registro_existente(self):
        resp = self.client.get(self.url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["documento_paciente"], self.reg.documento_paciente)

    def test_get_registro_incluye_campos_calculados(self):
        """El serializer agrega sede_nombre y ambulancia_placa."""
        resp = self.client.get(self.url)
        self.assertIn("sede_nombre", resp.data)
        self.assertIn("ambulancia_placa", resp.data)

    def test_get_registro_inexistente_retorna_404(self):
        resp = self.client.get(self.url_inexistente)
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)

    # ── PUT ────────────────────────────────────

    def test_put_actualiza_registro(self):
        resp = self.client.put(
            self.url,
            {"nombre_paciente": "Nombre Actualizado"},
            format="json",
        )
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.reg.refresh_from_db()
        self.assertEqual(self.reg.nombre_paciente, "Nombre Actualizado")

    def test_put_registro_inexistente_retorna_404(self):
        resp = self.client.put(
            self.url_inexistente, {"nombre_paciente": "X"}, format="json"
        )
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)

    # ── DELETE ─────────────────────────────────

    def test_delete_elimina_registro(self):
        """DELETE hace hard-delete del registro SOAT."""
        resp = self.client.delete(self.url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertFalse(
            RegistroSOAT.objects.filter(idregistro=self.reg.idregistro).exists()
        )

    def test_delete_registro_inexistente_retorna_404(self):
        resp = self.client.delete(self.url_inexistente)
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)


# ──────────────────────────────────────────────
#  EXPORTAR SOAT (TXT)
# ──────────────────────────────────────────────

class ExportarSOATTests(APITestCase):
    """Pruebas del endpoint /api/soat/<id>/exportar/"""

    def setUp(self):
        self.client = APIClient()
        self.user = _crear_usuario("user_exportar")
        self.client.force_authenticate(user=self.user)
        self.sede = _crear_sede()
        self.amb = _crear_ambulancia("GGG777", sede=self.sede)
        self.reg = _crear_soat(self.sede, self.amb, self.user)
        self.url = reverse("soat-exportar", kwargs={"registro_id": self.reg.idregistro})

    # ── Autenticación ──────────────────────────

    def test_exportar_sin_autenticacion_retorna_401(self):
        cliente_anonimo = APIClient()
        resp = cliente_anonimo.get(self.url)
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    # ── GET exportar ───────────────────────────

    def test_exportar_retorna_200_y_content_type_text(self):
        resp = self.client.get(self.url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn("text/plain", resp["Content-Type"])

    def test_exportar_retorna_header_content_disposition(self):
        resp = self.client.get(self.url)
        self.assertIn("Content-Disposition", resp)
        self.assertIn("attachment", resp["Content-Disposition"])
        self.assertIn(".txt", resp["Content-Disposition"])

    def test_exportar_contenido_incluye_datos_registro(self):
        resp = self.client.get(self.url)
        contenido = resp.content.decode("utf-8")
        self.assertIn(self.reg.documento_paciente, contenido)
        self.assertIn("REGISTRO SOAT", contenido)

    def test_exportar_registro_inexistente_retorna_404(self):
        url = reverse("soat-exportar", kwargs={"registro_id": 99999})
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)
