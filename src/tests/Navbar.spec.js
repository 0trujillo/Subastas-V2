import React from "react";

export default function Navbar() {
  const usuario = JSON.parse(localStorage.getItem("usuarioActual"));

  const cerrarSesion = () => {
    if (window.confirm("¿Desea cerrar sesión?")) {
      localStorage.removeItem("usuarioActual");
    }
  };

  return (
    <nav>
      <h1>Subastas Online</h1>
      {!usuario ? (
        <a href="#">Iniciar Sesión</a>
      ) : (
        <div>
          <span>{usuario.nombre}</span>
          <button onClick={cerrarSesion}>Salir</button>
        </div>
      )}
    </nav>
  );
}
