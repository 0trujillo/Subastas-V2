import API from "./API";

export const obtenerUsuario = (nombre) => API.get(`/usuario/${nombre}`);
export const recargarPresupuesto = (nombre, monto) =>
  API.post(`/usuario/recargar?nombre=${nombre}&monto=${monto}`);
