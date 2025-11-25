// auth.js
import API from "./API";

export const login = (body) => API.post("/login", body);
export const register = (body) => API.post("/register", body);
