// ===== SubastaAPI.js =====
import axios from "axios";


const API = axios.create({
baseURL: "http://localhost:8080/api",
});


export const obtenerSubastas = () => API.get("/subastas");
export const obtenerSubasta = (id) => API.get(`/subastas/${id}`);
export const crearSubasta = (data) => API.post("/subastas", data);
export const pujar = (id, data) => API.post(`/subastas/${id}/pujar`, data);
export const finalizarSubasta = (id) => API.put(`/subastas/${id}/finalizar`);
export const obtenerGanadores = () => API.get("/ganadores");

