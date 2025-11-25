import axios from "axios";

const EnviosAPI = axios.create({
  baseURL: "http://localhost:8080/api/envios",
});

const token = localStorage.getItem("token");
if (token) EnviosAPI.defaults.headers.common["Authorization"] = `Bearer ${token}`;

export default EnviosAPI;

export const crearEnvio = (data) => EnviosAPI.post("/", data);
export const obtenerEnvios = (usuario) => EnviosAPI.get(`/${usuario}`);
export const configurarEnvio = (id, datos) => EnviosAPI.put(`/${id}/configurar`, datos);
export const marcarEntregado = (id) => EnviosAPI.put(`/${id}/entregar`);
export const reclamarEnvio = (subastaId, usuario) =>
  EnviosAPI.post(`/reclamar/${subastaId}?usuario=${usuario}`);
export const descartarEnvio = (idProducto) => EnviosAPI.put(`/${idProducto}/descartar`);
export const obtenerHistorial = (usuario) => EnviosAPI.get(`/historial/${usuario}`);
