// LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../api/AuthAPI";

const LoginPage = () => {
  const navigate = useNavigate();
  const [modo, setModo] = useState("login");

  const [form, setForm] = useState({
    nombre: "",      // <--- Username real
    correo: "",      // (Opcional, si lo quieres)
    contraseña: "",
    confirmar: "",
  });

  const [notificacion, setNotificacion] = useState({ mensaje: "", tipo: "" });

  const mostrarNotificacion = (mensaje, tipo) => {
    setNotificacion({ mensaje, tipo });
    setTimeout(() => setNotificacion({ mensaje: "", tipo: "" }), 2500);
  };

  const cambiarFormulario = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ------------------------- LOGIN ---------------------------------
  const ingresarUsuario = async (e) => {
    e.preventDefault();

    try {
      // ⬇⬇ SE ENVÍA EXACTAMENTE LO QUE EL BACKEND PIDE ⬇⬇
      const res = await login({
        nombre: form.nombre,        // <--- corregido
        password: form.contraseña,  // <--- correcto
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem(
        "usuarioActual",
        JSON.stringify({
          nombre: res.data.nombre,
          presupuesto: res.data.presupuesto,
          roles: res.data.roles,
        })
      );

      mostrarNotificacion(`Bienvenido ${res.data.nombre}`, "success");
      navigate("/subastas");
    } catch {
      mostrarNotificacion("Usuario o contraseña incorrectos", "danger");
    }
  };

  // ---------------------- REGISTRO ---------------------------------
  const registrarUsuario = async (e) => {
    e.preventDefault();

    if (form.contraseña !== form.confirmar) {
      return mostrarNotificacion("Las contraseñas no coinciden", "warning");
    }

    try {
      // ⬇⬇ Backend SOLO usa nombre + password ⬇⬇
      await register({
        nombre: form.nombre,
        password: form.contraseña,
      });

      mostrarNotificacion("Cuenta creada con éxito. Inicia sesión.", "success");
      setModo("login");
    } catch {
      mostrarNotificacion("Error al crear la cuenta", "danger");
    }
  };

  return (
    <div className="login-container">
      <h1>{modo === "login" ? "Iniciar Sesión" : "Registrarse"}</h1>

      {notificacion.mensaje && (
        <div className={`alert alert-${notificacion.tipo}`}>
          {notificacion.mensaje}
        </div>
      )}

      {/* ---------------------- FORMULARIO LOGIN ---------------------- */}
      {modo === "login" && (
        <form onSubmit={ingresarUsuario}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre de usuario"
            value={form.nombre}
            onChange={cambiarFormulario}
            required
          />

          <input
            type="password"
            name="contraseña"
            placeholder="Contraseña"
            value={form.contraseña}
            onChange={cambiarFormulario}
            required
          />

          <button type="submit">Entrar</button>
        </form>
      )}

      {/* ---------------------- FORMULARIO REGISTRO ------------------ */}
      {modo === "registro" && (
        <form onSubmit={registrarUsuario}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre de usuario"
            value={form.nombre}
            onChange={cambiarFormulario}
            required
          />

          <input
            type="password"
            name="contraseña"
            placeholder="Contraseña"
            value={form.contraseña}
            onChange={cambiarFormulario}
            required
          />

          <input
            type="password"
            name="confirmar"
            placeholder="Confirmar contraseña"
            value={form.confirmar}
            onChange={cambiarFormulario}
            required
          />

          <button type="submit">Crear Cuenta</button>
        </form>
      )}

      <p>
        {modo === "login" ? (
          <span onClick={() => setModo("registro")}>Crear una cuenta</span>
        ) : (
          <span onClick={() => setModo("login")}>
            ¿Ya tienes cuenta? Inicia sesión
          </span>
        )}
      </p>
    </div>
  );
};

export default LoginPage;
