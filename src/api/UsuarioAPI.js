import axios from "axios";

const UsuarioAPI = axios.create({
  baseURL: "http://localhost:8080/api",
});

const token = localStorage.getItem("token");
if (token) UsuarioAPI.defaults.headers.common["Authorization"] = `Bearer ${token}`;

export const obtenerUsuario = (nombre) =>
  UsuarioAPI.get(`/usuario/${nombre}`);

export const recargarPresupuesto = (nombre, monto) =>
  UsuarioAPI.post(`/usuario/recargar?nombre=${nombre}&monto=${monto}`);

export const descontarPresupuesto = (nombre, monto) =>
  UsuarioAPI.post(`/usuario/descontar?nombre=${nombre}&monto=${monto}`);
