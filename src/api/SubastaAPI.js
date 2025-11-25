import axios from "axios";

const SubastaAPI = axios.create({
  baseURL: "http://localhost:8080/api",
});

const token = localStorage.getItem("token");
if (token) SubastaAPI.defaults.headers.common["Authorization"] = `Bearer ${token}`;

export default SubastaAPI;

export const obtenerSubastas = () => SubastaAPI.get("/subastas");
export const obtenerSubasta = (id) => SubastaAPI.get(`/subastas/${id}`);
export const crearSubasta = (data) => SubastaAPI.post("/subastas", data);
export const pujar = (id, data) => SubastaAPI.post(`/subastas/${id}/pujar`, data);
export const finalizarSubasta = (id) => SubastaAPI.put(`/subastas/${id}/finalizar`);
export const obtenerGanadores = () => SubastaAPI.get("/ganadores");
