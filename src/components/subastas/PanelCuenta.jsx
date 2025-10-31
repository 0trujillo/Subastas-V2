import React, { useState } from "react";

/**
 * Componente para el botón flotante y el panel lateral de "Mi Cuenta".
 * Maneja su propia visibilidad.
 *
 * @param {object} props
 * @param {number} props.presupuesto - El presupuesto actual del usuario.
 * @param {function} props.onRecargar - Función a llamar para recargar el presupuesto.
 * @param {function} props.onVerEnvios - Función a llamar para navegar a "Mis Envíos".
 * @param {function} props.formatearDinero - Función para dar formato de moneda.
 */
export default function PanelCuenta({ presupuesto, onRecargar, onVerEnvios, formatearDinero }) {
  // Este componente ahora maneja su propio estado de visibilidad
  const [panelVisible, setPanelVisible] = useState(false);

  return (
    <>
      {/* 💲 Botón flotante */}
      <button
        className="btn btn-primary rounded-circle shadow-lg position-fixed"
        style={{
          bottom: "30px",
          right: "30px",
          width: "60px",
          height: "60px",
          zIndex: 1050,
          fontSize: "1.5rem",
        }}
        onClick={() => setPanelVisible((p) => !p)} // <-- Controla su propio estado
        title="Mi Cuenta"
      >
        💲
      </button>

      {/* 💼 Panel lateral colapsable */}
      {panelVisible && (
        <div
          className="card position-fixed end-0 top-50 translate-middle-y p-3 shadow bg-light border-0"
          style={{
            width: "260px",
            zIndex: 1040,
            transition: "all 0.3s ease",
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="text-primary fw-bold mb-0">👤 Mi Cuenta</h6>
            <button
              className="btn btn-sm btn-outline-danger rounded-circle"
              onClick={() => setPanelVisible(false)} // <-- Cierra el panel
            >
              ✖
            </button>
          </div>

          <p>
            {/* Usa las props para mostrar datos */}
            Presupuesto: <strong>{formatearDinero(presupuesto)}</strong>
          </p>
          <button
            className="btn btn-success btn-sm w-100 mb-2"
            onClick={() => onRecargar(1000)} // <-- Llama a la prop
          >
            💸 Recargar $1,000
          </button>
          <button
            className="btn btn-info btn-sm w-100"
            onClick={onVerEnvios} // <-- Llama a la prop
          >
            📦 Mis Envíos
          </button>
        </div>
      )}
    </>
  );
}
