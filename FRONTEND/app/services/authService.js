import axios from 'axios';
import api from "./axios";
import dedupe from './dedupe';


// Iniciar sesión
const login = async (data) => {
  // Deduplicate simultaneous login attempts with same credentials
  return dedupe('auth:login', data, async () => {
    const response = await api.post('auth/token/', data);
    return response.data;
  });
};

// Registrar nuevo usuario (requiere autenticación de administrador)
const register = async (data) => {
  const response = await api.post('user/register/', data);
  return response.data;
};

// Cerrar sesión
const logout = () => {
  localStorage.removeItem('user');
};

const authService = {
  login,
  logout,
  register,
};

export default authService;