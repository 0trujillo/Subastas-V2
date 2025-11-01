// src/components/envios/ModalEnvio.jsx
import React, { useState } from "react";

export default function ModalEnvio({
  producto,
  direccion,
  onDireccionChange,
  onCancelar,
  onGuardar,
}) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [region, setRegion] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [guardando, setGuardando] = useState(false);

  const manejarGuardar = () => {
    if (!nombre || !telefono || !direccion || !ciudad || !region) {
      setMensaje("⚠️ Por favor completa todos los campos antes de continuar.");
      return;
    }

    setGuardando(true);
    setMensaje("⏳ Procesando envío...");

    // Simula validación / proceso
    setTimeout(() => {
      onGuardar({
        nombre,
        telefono,
        direccion,
        ciudad,
        region,
      });
      setGuardando(false);
      setMensaje("✅ Envío configurado correctamente.");

      setTimeout(() => onCancelar(), 1000);
    }, 800);
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              <i className="fas fa-shipping-fast me-2"></i>Configurar Envío
            </h5>
            <button
              className="btn-close btn-close-white"
              onClick={onCancelar}
              disabled={guardando}
            ></button>
          </div>

          <div className="modal-body">
            <div className="text-center mb-3">
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="img-fluid rounded shadow-sm"
                style={{ maxHeight: "180px" }}
              />
              <h6 className="mt-3 fw-bold">{producto.nombre}</h6>
            </div>

            {/* Campos del formulario */}
            <div className="form-group mb-2">
              <label htmlFor="nombre" className="form-label fw-semibold">
                <i className="fas fa-user me-2 text-primary"></i>Nombre completo
              </label>
              <input
                id="nombre"
                type="text"
                className="form-control"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Juan Pérez"
              />
            </div>

            <div className="form-group mb-2">
              <label htmlFor="telefono" className="form-label fw-semibold">
                <i className="fas fa-phone me-2 text-primary"></i>Teléfono
              </label>
              <input
                id="telefono"
                type="tel"
                className="form-control"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="Ej: +56 9 1234 5678"
              />
            </div>

            <div className="form-group mb-2">
              <label htmlFor="direccion" className="form-label fw-semibold">
                <i className="fas fa-map-marker-alt me-2 text-primary"></i>Dirección
              </label>
              <input
                id="direccion"
                type="text"
                className="form-control"
                value={direccion}
                onChange={onDireccionChange}
                placeholder="Ej: Calle Falsa 123"
              />
            </div>

            <div className="form-group mb-2">
              <label htmlFor="ciudad" className="form-label fw-semibold">
                <i className="fas fa-city me-2 text-primary"></i>Ciudad
              </label>
              <input
                id="ciudad"
                type="text"
                className="form-control"
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
                placeholder="Ej: Santiago"
              />
            </div>

            <div className="form-group mb-2">
              <label htmlFor="region" className="form-label fw-semibold">
                <i className="fas fa-globe-americas me-2 text-primary"></i>Región
              </label>
              <input
                id="region"
                type="text"
                className="form-control"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="Ej: Región Metropolitana"
              />
            </div>

            {/* Mensaje de validación */}
            {mensaje && (
              <div
                className={`alert mt-3 py-2 ${
                  mensaje.startsWith("✅")
                    ? "alert-success"
                    : "alert-warning"
                }`}
              >
                {mensaje}
              </div>
            )}
          </div>

          <div className="modal-footer border-0">
            <button
              className="btn btn-secondary"
              onClick={onCancelar}
              disabled={guardando}
            >
              Cancelar
            </button>
            <button
              className="btn btn-primary"
              onClick={manejarGuardar}
              disabled={guardando}
            >
              {guardando ? "Guardando..." : "Guardar Envío"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
