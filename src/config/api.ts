// Configuración de la API del inventario
// En desarrollo usa localhost:3001, en producción usa el proxy de Apache

const API_BASE_URL = import.meta.env.DEV 
  ? 'http://localhost:3001'  // Desarrollo: conectar directamente al backend
  : '';  // Producción: usar proxy de Apache (rutas relativas)

export const API_ENDPOINTS = {
  login: `${API_BASE_URL}/api/inventory/login`,
  logout: `${API_BASE_URL}/api/inventory/logout`,
  verify: `${API_BASE_URL}/api/inventory/verify`,
  changePassword: `${API_BASE_URL}/api/inventory/change-password`,
  items: `${API_BASE_URL}/api/inventory/items`,
  stats: `${API_BASE_URL}/api/inventory/stats`,
  itemById: (id: number) => `${API_BASE_URL}/api/inventory/items/${id}`,
};

export default API_BASE_URL;
