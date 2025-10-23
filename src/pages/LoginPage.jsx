import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function LoginPage() {
  const navigate = useNavigate();

  const [modo, setModo] = useState("login");
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    contraseña: "",
    confirmar: ""
  });

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("usuarios")) || [];
    if (data.length === 0) {
      const demo = [
        {
          id: 1,
          nombre: "Usuario Demo",
          correo: "demo@ejemplo.com",
          contraseña: "123456",
          presupuesto: 15000
        }
      ];
      localStorage.setItem("usuarios", JSON.stringify(demo));
      setUsuarios(demo);
    } else {
      setUsuarios(data);
    }
  }, []);

  const mostrarNotificacion = (mensaje, tipo = "info") => {
    alert(`${tipo.toUpperCase()}: ${mensaje}`);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const registrarUsuario = (e) => {
    e.preventDefault();

    if (!form.nombre || !form.correo || !form.contraseña || !form.confirmar) {
      return mostrarNotificacion("Completa todos los campos", "warning");
    }

    if (form.contraseña !== form.confirmar) {
      return mostrarNotificacion("Las contraseñas no coinciden", "danger");
    }

    const existente = usuarios.find((u) => u.correo === form.correo);
    if (existente) {
      return mostrarNotificacion("Ya existe un usuario con este correo", "warning");
    }

    const nuevo = {
      id: Date.now(),
      nombre: form.nombre,
      correo: form.correo,
      contraseña: form.contraseña,
      presupuesto: 5000,
      fechaRegistro: new Date().toISOString()
    };

    const actualizados = [...usuarios, nuevo];
    setUsuarios(actualizados);
    localStorage.setItem("usuarios", JSON.stringify(actualizados));

    mostrarNotificacion(`✅ Bienvenido ${form.nombre}, cuenta creada exitosamente`, "success");
    setModo("login");
  };

  const ingresarUsuario = (e) => {
    e.preventDefault();
    const usuario = usuarios.find(
      (u) => u.correo === form.correo && u.contraseña === form.contraseña
    );
    if (usuario) {
      localStorage.setItem("usuarioActual", JSON.stringify(usuario));
      mostrarNotificacion(`Bienvenido ${usuario.nombre}`, "success");
      navigate("/subastas");
    } else {
      mostrarNotificacion("Correo o contraseña incorrectos", "danger");
    }
  };

  return (
    <div>
      {/* Header */}
      <header className="bg-primary text-white py-3 text-center">
        <h1>
          <i className="fa-solid fa-gavel me-2"></i>Subastas Online
        </h1>
        <p>El mejor sitio de subastas online</p>
      </header>

      <main className="container my-5">
        {/* Formulario Login */}
        {modo === "login" && (
          <section className="row justify-content-center">
            <div className="col-md-6">
              <div className="card shadow">
                <div className="card-header bg-primary text-white">
                  <h2 className="mb-0">
                    <i className="fa-solid fa-right-to-bracket me-2"></i>Iniciar Sesión
                  </h2>
                </div>
                <div className="card-body">
                  <form onSubmit={ingresarUsuario}>
                    <div className="mb-3">
                      <label className="form-label">
                        <i className="fa-solid fa-envelope me-2"></i>Correo electrónico
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        name="correo"
                        value={form.correo}
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
                      <i className="fa-solid fa-user-plus me-2"></i>Crear cuenta nueva
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Formulario Registro */}
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
                  <form onSubmit={registrarUsuario}>
                    <div className="mb-3">
                      <label className="form-label">
                        <i className="fa-solid fa-user me-2"></i>Nombre completo
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
                        <i className="fa-solid fa-envelope me-2"></i>Correo electrónico
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        name="correo"
                        value={form.correo}
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
                        <i className="fa-solid fa-circle-check me-2"></i>Confirmar contraseña
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
