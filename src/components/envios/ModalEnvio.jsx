// src/components/envios/ModalEnvio.jsx
import React from "react";

export default function ModalEnvio({
  producto,
  direccion,
  onDireccionChange,
  onCancelar,
  onGuardar,
}) {
  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              <i className="fas fa-shipping-fast me-2"></i>Configurar Envío
            </h5>
            <button className="btn-close btn-close-white" onClick={onCancelar}></button>
          </div>
          <div className="modal-body text-center">
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="img-fluid rounded mb-3"
              style={{ maxHeight: "200px" }}
            />
            <h6>{producto.nombre}</h6>
            <label className="form-label mt-3">Dirección de envío:</label>
            <input
              type="text"
              className="form-control"
              value={direccion}
              onChange={onDireccionChange}
              placeholder="Ej: Calle Falsa 123"
            />
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onCancelar}>
              Cancelar
            </button>
            <button className="btn btn-primary" onClick={onGuardar}>
              Guardar Envío
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
