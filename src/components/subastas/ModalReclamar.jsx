// src/components/subastas/ModalReclamar.jsx
import React, { useState } from "react";

export default function ModalReclamar({ producto, onCerrar, onReclamar }) {
  const [reclamando, setReclamando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const manejarReclamo = () => {
    setReclamando(true);
    setMensaje("⏳ Procesando reclamo...");

    // Simula breve retraso visual antes de ejecutar el reclamo real
    setTimeout(() => {
      onReclamar(); // ejecuta el reclamo real
      setMensaje("✅ Producto reclamado exitosamente.");
      setReclamando(false);

      // Se cierra automáticamente después de unos segundos
      setTimeout(() => {
        onCerrar();
      }, 1000);
    }, 600);
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow">
          <div className="modal-header bg-success text-white">
            <h5 className="modal-title">
              <i className="fas fa-trophy me-2"></i>¡Has ganado una subasta!
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onCerrar}
              disabled={reclamando}
            ></button>
          </div>

          <div className="modal-body text-center">
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="img-fluid rounded mb-3"
              style={{ maxHeight: "200px" }}
            />
            <h5 className="fw-bold mb-2">{producto.nombre}</h5>
            <p className="text-muted mb-3">
              Precio final: <strong>${producto.precio}</strong>
            </p>

            {mensaje && (
              <div
                className={`alert ${
                  mensaje.includes("✅")
                    ? "alert-success"
                    : "alert-warning"
                } py-2`}
              >
                {mensaje}
              </div>
            )}
          </div>

          <div className="modal-footer border-0">
            <button
              className="btn btn-secondary"
              onClick={onCerrar}
              disabled={reclamando}
            >
              Cancelar
            </button>
            <button
              className="btn btn-success"
              onClick={manejarReclamo}
              disabled={reclamando}
            >
              {reclamando ? "Reclamando..." : "Reclamar Producto"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
