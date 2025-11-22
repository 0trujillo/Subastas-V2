// ===== SubastaAPI.js =====
import axios from "axios";


const API = axios.create({
baseURL: "http://localhost:8080/api/subastas",
});


export const obtenerSubastas = () => API.get("");
export const obtenerSubasta = (id) => API.get(`/${id}`);
export const crearSubasta = (data) => API.post("/", data);
export const pujar = (id, data) => API.post(`/${id}/pujar`, data);
export const finalizarSubasta = (id) => API.put(`/${id}/finalizar`);