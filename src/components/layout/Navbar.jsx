import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";

export default function Navbar({ navigate: injectedNavigate }) {
  // ✅ useNavigate se llama siempre, nunca condicionalmente
  const defaultNavigate = useNavigate();
  const navigate = injectedNavigate || defaultNavigate;

  const usuario = JSON.parse(localStorage.getItem("usuarioActual"));

  const cerrarSesion = () => {
    if (window.confirm("¿Seguro que deseas cerrar sesión?")) {
      localStorage.removeItem("usuarioActual");
      navigate("/"); // ✅ siempre seguro
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/subastas">
          <i className="fas fa-gavel me-2"></i>Subastas Online
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {usuario ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/subastas">
                    <i className="fas fa-store me-1"></i>Subastas
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/envios">
                    <i className="fas fa-truck me-1"></i>Envíos
                  </Link>
                </li>
                <li className="nav-item dropdown">
                  <button
                    className="btn nav-link dropdown-toggle text-white"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="fas fa-user-circle me-1"></i>
                    {usuario.nombre || "Usuario"}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={cerrarSesion}
                      >
                        <i className="fas fa-sign-out-alt me-2"></i>
                        Cerrar sesión
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  <i className="fas fa-sign-in-alt me-1"></i>Iniciar Sesión
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
