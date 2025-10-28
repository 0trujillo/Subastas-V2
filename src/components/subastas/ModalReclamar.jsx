// src/components/subastas/ModalReclamar.jsx
import React from "react";

export default function ModalReclamar({ producto, onCerrar, onReclamar }) {
  if (!producto) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header bg-success text-white">
            <h5 className="modal-title">
              <i className="fas fa-trophy me-2"></i>¡Felicitaciones!
            </h5>
            <button className="btn-close btn-close-white" onClick={onCerrar}></button>
          </div>

          <div className="modal-body text-center">
            <i className="fas fa-trophy text-success mb-3" style={{ fontSize: "3rem" }}></i>
            <h6>Has ganado la subasta de:</h6>
            <strong>{producto.nombre}</strong>
            <p>Precio final: ${producto.precio}</p>
            <p className="text-muted">Configura el envío para recibir tu producto</p>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onCerrar}>
              Más tarde
            </button>
            <button className="btn btn-success" onClick={onReclamar}>
              <i className="fas fa-gift me-2"></i>Reclamar y Ver Envío
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
