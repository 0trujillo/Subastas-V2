import API from "./API";


export const obtenerSubastas = () => API.get("/subastas");
export const obtenerSubasta = (id) => API.get(`/subastas/${id}`);
export const crearSubasta = (data) => API.post("/subastas", data);
export const pujar = (id, data) => API.post(`/subastas/${id}/pujar`, data);
export const finalizarSubasta = (id) => API.put(`/subastas/${id}/finalizar`);
export const obtenerGanadores = () => API.get("/ganadores");

