import api from "./axios";

// ─────────── INTERFACES ───────────
export interface Ambulancia {
  idambulancia: number;
  placa: string;
  tipo: string;
  tipo_display: string;
  sede: number | null;
  sede_nombre: string | null;
  estado: number;
}

export interface Sede {
  idsede: number;
  nombre: string;
  direccion: string | null;
  telefono: string | null;
  responsable: string | null;
  activa: boolean;
}

export interface Organizacion {
  idorganizacion?: number;
  nombre: string;
  nit: string;
  direccion?: string | null;
  telefono?: string | null;
  email?: string | null;
  representante?: string | null;
  descripcion?: string | null;
}

export interface RegistroSOAT {
  idregistro: number;
  placa_ambulancia: string;
  tipo_ambulancia: string;
  tripulante1: string;
  tripulante2: string;
  nombre_paciente: string;
  documento_paciente: string;
  tipo_documento: string;
  edad_paciente: string;
  genero_paciente: string;
  direccion_paciente: string;
  telefono_paciente: string;
  fecha_siniestro: string | null;
  hora_siniestro: string | null;
  lugar_siniestro: string;
  tipo_vehiculo: string;
  placa_vehiculo: string;
  poliza: string;
  aseguradora: string;
  descripcion_siniestro: string;
  departamento: string;
  ciudad: string;
  sede_prestadora: string;
  fecha_registro: string;
  sede_nombre: string | null;
}

export interface PaginatedResponse<T> {
  count: number;
  page: number;
  page_size: number;
  results: T[];
}

export interface Empleado {
  id_colaborador: number;
  cc_colaborador: string;
  tipo_documento: string | null;
  nombre_colaborador: string;
  apellido_colaborador: string;
  correo_colaborador: string;
  telefo_colaborador: string | null;
  direccion: string | null;
  nombre_cargo: string | null;
  nombre_sede: string | null;
  ambulancia_id: number | null;
  ambulancia_placa: string | null;
  estado_colaborador: number;
  numero_licencia: string | null;
  especialidad: string | null;
  tipo_sangre: string | null;
  contacto_emergencia: string | null;
}

export interface PerfilData {
  id_colaborador: number;
  cc_colaborador: string;
  tipo_documento: string;
  nombre_colaborador: string;
  apellido_colaborador: string;
  correo_colaborador: string | null;
  telefo_colaborador: string | null;
  direccion: string | null;
  nombre_cargo: string | null;
  nombre_sede: string | null;
  nombre_nivel: string | null;
  nombre_regional: string | null;
  numero_licencia: string | null;
  especialidad: string | null;
  tipo_sangre: string | null;
  contacto_emergencia: string | null;
}

export interface Cargo {
  idcargo: number;
  nombrecargo: string;
  estadocargo: number;
}

export interface Nivel {
  idnivel: number;
  nombrenivel: string;
}

export interface Regional {
  idregional: number;
  nombreregional: string;
}

// ─────────── AMBULANCIAS ───────────
export const getAmbulancias = async (): Promise<Ambulancia[]> => {
  const res = await api.get("api/ambulancias/");
  return res.data.results ?? res.data;
};

export const createAmbulancia = async (data: Partial<Ambulancia>): Promise<Ambulancia> => {
  const res = await api.post("api/ambulancias/", data);
  return res.data;
};

export const updateAmbulancia = async (id: number, data: Partial<Ambulancia>): Promise<Ambulancia> => {
  const res = await api.put(`api/ambulancias/${id}/`, data);
  return res.data;
};

export const deleteAmbulancia = async (id: number): Promise<void> => {
  await api.delete(`api/ambulancias/${id}/`);
};

// ─────────── SEDES ───────────
export const getSedes = async (): Promise<Sede[]> => {
  const res = await api.get("api/sedes/");
  return res.data.results ?? res.data;
};

export const createSede = async (data: Partial<Sede>): Promise<Sede> => {
  const res = await api.post("api/sedes/", data);
  return res.data;
};

export const updateSede = async (id: number, data: Partial<Sede>): Promise<Sede> => {
  const res = await api.put(`api/sedes/${id}/`, data);
  return res.data;
};

export const deleteSede = async (id: number): Promise<void> => {
  await api.delete(`api/sedes/${id}/`);
};

// ─────────── ORGANIZACIÓN ───────────
export const getOrganizacion = async (): Promise<Organizacion> => {
  const res = await api.get("api/organizacion/");
  return res.data;
};

export const saveOrganizacion = async (data: Partial<Organizacion>): Promise<Organizacion> => {
  const res = await api.post("api/organizacion/", data);
  return res.data;
};

// ─────────── SOAT ───────────
export const getRegistrosSOAT = async (
  page = 1,
  pageSize = 10,
  search = ""
): Promise<PaginatedResponse<RegistroSOAT>> => {
  const res = await api.get("api/soat/", {
    params: { page, page_size: pageSize, search },
  });
  return res.data;
};

export const getRegistroSOAT = async (id: number): Promise<RegistroSOAT> => {
  const res = await api.get(`api/soat/${id}/`);
  return res.data;
};

export const createRegistroSOAT = async (data: Partial<RegistroSOAT>): Promise<RegistroSOAT> => {
  const res = await api.post("api/soat/", data);
  return res.data;
};

export const updateRegistroSOAT = async (
  id: number,
  data: Partial<RegistroSOAT>
): Promise<RegistroSOAT> => {
  const res = await api.put(`api/soat/${id}/`, data);
  return res.data;
};

export const deleteRegistroSOAT = async (id: number): Promise<void> => {
  await api.delete(`api/soat/${id}/`);
};

export const exportarSOAT = async (id: number) => {
  const res = await api.get(`api/soat/${id}/exportar/`, { responseType: "blob" });
  return res;
};

// ─────────── EMPLEADOS ───────────
export const getEmpleados = async (
  page = 1,
  pageSize = 10,
  search = ""
): Promise<PaginatedResponse<Empleado>> => {
  const res = await api.get("user/lista-usuarios/", {
    params: { page, page_size: pageSize, search },
  });
  return res.data;
};

export const toggleEstadoEmpleado = async (
  colaboradorId: number,
  estado: 0 | 1
): Promise<void> => {
  await api.patch(`user/cambiar-estado-usuario/${colaboradorId}/`, { estado });
};

// ─────────── CARGOS / NIVELES / REGIONALES ───────────
export const getCargos = async (): Promise<Cargo[]> => {
  const res = await api.get("user/Cargo/");
  return res.data.results ?? res.data;
};

export const getNiveles = async (): Promise<Nivel[]> => {
  const res = await api.get("user/Nivel/");
  return res.data.results ?? res.data;
};

export const getRegionales = async (): Promise<Regional[]> => {
  const res = await api.get("user/Region/");
  return res.data.results ?? res.data;
};

export const crearEmpleado = async (data: object): Promise<void> => {
  await api.post("user/register/", data);
};

// ─────────── PERFIL ───────────
export const getPerfil = async (): Promise<PerfilData> => {
  const res = await api.get("user/perfil/");
  return res.data;
};

export const actualizarPerfil = async (data: Partial<PerfilData> & { sede_id?: number }): Promise<void> => {
  await api.put("user/perfil/", data);
};
