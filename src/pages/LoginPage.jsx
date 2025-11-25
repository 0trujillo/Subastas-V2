// LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../api/AuthAPI";
import "bootstrap/dist/css/bootstrap.min.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [modo, setModo] = useState("login");

  const [form, setForm] = useState({
    nombre: "",
    contraseña: "",
    confirmar: ""
  });

  const [notificacion, setNotificacion] = useState({ mensaje: "", tipo: "" });

  const mostrarNotificacion = (mensaje, tipo) => {
    setNotificacion({ mensaje, tipo });
    setTimeout(() => setNotificacion({ mensaje: "", tipo: "" }), 2500);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // --------------------------- LOGIN ----------------------------
  const ingresarUsuario = async (e) => {
    e.preventDefault();

    try {
      const res = await login({
        nombre: form.nombre,         // ← el backend usa "nombre"
        password: form.contraseña,   // ← y password
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

  // --------------------------- REGISTRO ----------------------------
  const registrarUsuario = async (e) => {
    e.preventDefault();

    if (form.contraseña !== form.confirmar) {
      return mostrarNotificacion("Las contraseñas no coinciden", "warning");
    }

    try {
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
    <div>
      {/* ---------------------------- HEADER ---------------------------- */}
      <header className="bg-primary text-white py-3 text-center">
        <h1>
          <i className="fa-solid fa-gavel me-2"></i>Subastas Online
        </h1>
        <p>El mejor sitio de subastas online</p>
      </header>

      <main className="container my-5">
        {/* ---------------------------- LOGIN FORM ---------------------------- */}
        {modo === "login" && (
          <section className="row justify-content-center">
            <div className="col-md-6">
              <div className="card shadow">
                <div className="card-header bg-primary text-white">
                  <h2 className="mb-0">
                    <i className="fa-solid fa-right-to-bracket me-2"></i>
                    Iniciar Sesión
                  </h2>
                </div>

                <div className="card-body">
                  {notificacion.mensaje && (
                    <div className={`alert alert-${notificacion.tipo}`}>
                      {notificacion.mensaje}
                    </div>
                  )}

                  <form onSubmit={ingresarUsuario}>
                    <div className="mb-3">
                      <label className="form-label">
                        <i className="fa-solid fa-user me-2"></i>Nombre de usuario
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        <i className="fa-solid fa-lock me-2"></i>Contraseña
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        name="contraseña"
                        value={form.contraseña}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="d-grid">
                      <button className="btn btn-primary btn-lg">
                        <i className="fa-solid fa-right-to-bracket me-2"></i>Ingresar
                      </button>
                    </div>
                  </form>

                  <div className="text-center mt-3">
                    <p className="text-muted mb-2">¿No tienes cuenta?</p>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => setModo("registro")}
                    >
                      <i className="fa-solid fa-user-plus me-2"></i>
                      Crear cuenta nueva
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* --------------------------- REGISTRO FORM --------------------------- */}
        {modo === "registro" && (
          <section className="row justify-content-center">
            <div className="col-md-6">
              <div className="card shadow">
                <div className="card-header bg-success text-white">
                  <h2 className="mb-0">
                    <i className="fa-solid fa-user-plus me-2"></i>Crear Cuenta
                  </h2>
                </div>

                <div className="card-body">
                  {notificacion.mensaje && (
                    <div className={`alert alert-${notificacion.tipo}`}>
                      {notificacion.mensaje}
                    </div>
                  )}

                  <form onSubmit={registrarUsuario}>
                    <div className="mb-3">
                      <label className="form-label">
                        <i className="fa-solid fa-user me-2"></i>Nombre de usuario
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        <i className="fa-solid fa-lock me-2"></i>Contraseña
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        name="contraseña"
                        value={form.contraseña}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        <i className="fa-solid fa-circle-check me-2"></i>
                        Confirmar contraseña
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        name="confirmar"
                        value={form.confirmar}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="d-grid">
                      <button className="btn btn-success btn-lg">
                        <i className="fa-solid fa-user-plus me-2"></i>Registrarme
                      </button>
                    </div>
                  </form>

                  <div className="text-center mt-3">
                    <p className="text-muted mb-2">¿Ya tienes cuenta?</p>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => setModo("login")}
                    >
                      <i className="fa-solid fa-right-to-bracket me-2"></i>Iniciar sesión
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
