import React from "react";
import "../../index.css";


export default function ModalReclamar({ producto, onCerrar, onReclamar }) {

  // ⛑ Evita errores si producto es null
  if (!producto) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">

        <h3 className="text-center mb-3">📦 Reclamar Producto</h3>

        <img
          src={producto.imagen}
          alt={producto.nombre}
          className="img-fluid mb-3"
          style={{ maxHeight: "200px", objectFit: "cover" }}
        />

        <p>
          <strong>Producto:</strong> {producto.nombre}
        </p>

        <p>
          <strong>Precio final:</strong> ${producto.precio}
        </p>

        <div className="d-flex justify-content-between mt-4">
          <button className="btn btn-secondary" onClick={onCerrar}>
            Cancelar
          </button>

          {producto.estado !== "RECLAMADA" ? (
            <button className="btn btn-success" onClick={onReclamar}>
              Confirmar Reclamo
            </button>
          ) : (
            <button className="btn btn-secondary" disabled>
              Ya reclamado
            </button>
          )}
          {producto.estado !== "RECLAMADA" ? (
            <button className="btn btn-success" onClick={onReclamar}>
              Confirmar Reclamo
            </button>
          ) : (
            <button className="btn btn-secondary" disabled>
              Ya reclamado
            </button>
          )}

        </div>

      </div>
    </div>
  );
}
