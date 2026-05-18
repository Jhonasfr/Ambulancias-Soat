import api from "./axios";

// ─────────── AMBULANCIAS ───────────
export const getAmbulancias = async () => {
  const res = await api.get("api/ambulancias/");
  return res.data.results ?? res.data;
};

export const createAmbulancia = async (data) => {
  const res = await api.post("api/ambulancias/", data);
  return res.data;
};

export const updateAmbulancia = async (id, data) => {
  const res = await api.put(`api/ambulancias/${id}/`, data);
  return res.data;
};

export const deleteAmbulancia = async (id) => {
  const res = await api.delete(`api/ambulancias/${id}/`);
  return res.data;
};

// ─────────── SEDES ───────────
export const getSedes = async () => {
  const res = await api.get("api/sedes/");
  return res.data.results ?? res.data;
};

export const createSede = async (data) => {
  const res = await api.post("api/sedes/", data);
  return res.data;
};

export const updateSede = async (id, data) => {
  const res = await api.put(`api/sedes/${id}/`, data);
  return res.data;
};

export const deleteSede = async (id) => {
  const res = await api.delete(`api/sedes/${id}/`);
  return res.data;
};

// ─────────── ORGANIZACIÓN ───────────
export const getOrganizacion = async () => {
  const res = await api.get("api/organizacion/");
  return res.data;
};

export const saveOrganizacion = async (data) => {
  const res = await api.post("api/organizacion/", data);
  return res.data;
};

// ─────────── SOAT ───────────
export const getRegistrosSOAT = async (page = 1, pageSize = 10, search = "") => {
  const res = await api.get("api/soat/", {
    params: { page, page_size: pageSize, search },
  });
  return res.data;
};

export const getRegistroSOAT = async (id) => {
  const res = await api.get(`api/soat/${id}/`);
  return res.data;
};

export const createRegistroSOAT = async (data) => {
  const res = await api.post("api/soat/", data);
  return res.data;
};

export const updateRegistroSOAT = async (id, data) => {
  const res = await api.put(`api/soat/${id}/`, data);
  return res.data;
};

export const deleteRegistroSOAT = async (id) => {
  const res = await api.delete(`api/soat/${id}/`);
  return res.data;
};

export const exportarSOAT = async (id) => {
  const res = await api.get(`api/soat/${id}/exportar/`, { responseType: "blob" });
  return res;
};

// ─────────── EMPLEADOS ───────────
export const getEmpleados = async (page = 1, pageSize = 10, search = "") => {
  const res = await api.get("user/lista-usuarios/", {
    params: { page, page_size: pageSize, search },
  });
  return res.data;
};

export const toggleEstadoEmpleado = async (colaboradorId, estado) => {
  const res = await api.patch(`user/cambiar-estado-usuario/${colaboradorId}/`, { estado });
  return res.data;
};

// ─────────── CARGOS / NIVELES / REGIONALES ───────────
export const getCargos = async () => {
  const res = await api.get("user/Cargo/");
  return res.data.results ?? res.data;
};

export const getNiveles = async () => {
  const res = await api.get("user/Nivel/");
  return res.data.results ?? res.data;
};

export const getRegionales = async () => {
  const res = await api.get("user/Region/");
  return res.data.results ?? res.data;
};

export const crearEmpleado = async (data) => {
  const res = await api.post("user/register/", data);
  return res.data;
};
