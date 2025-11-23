import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api/envios",
});

export const crearEnvio = (data) => API.post("/", data);
export const obtenerEnvios = (usuario) => API.get(`/${usuario}`);
export const configurarEnvio = (id, datos) => API.put(`/${id}/configurar`, datos);
export const marcarEntregado = (id) => API.put(`/${id}/entregar`);
