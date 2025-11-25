// ===== EnviosAPI.js =====
import API from "./API";

// Crear envío manual (no se usa para reclamar)
export const crearEnvio = (data) => API.post("/", data);

// Obtener envíos de un usuario
export const obtenerEnvios = (usuario) => API.get(`/${usuario}`);

// Configurar la dirección y datos del envío
export const configurarEnvio = (id, datos) =>
  API.put(`/${id}/configurar`, datos);

// Marcar como entregado
export const marcarEntregado = (id) => API.put(`/${id}/entregar`);

// ============================
// ⭐ FUNCIONALIDAD QUE FALTABA
// Reclamar subasta → crea envío automáticamente
// ============================
export const reclamarEnvio = (subastaId, usuario) =>
  API.post(`/reclamar/${subastaId}?usuario=${usuario}`);

export const descartarEnvio = (idProducto) => 
  API.put(`/${idProducto}/descartar`);

export const obtenerHistorial = (usuario) =>
  API.get(`/historial/${usuario}`);

