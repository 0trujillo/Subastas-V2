// src/components/subastas/ProductoCard.jsx
import React from "react";

export default function ProductoCard({ subasta, onPujar }) {
  return (
    <div className="card shadow-sm">
      <img
        src={subasta.imagen}
        alt={subasta.nombre}
        className="card-img-top"
        style={{ height: "220px", objectFit: "cover" }}
      />
      <div className="card-body text-center">
        <h5>{subasta.nombre}</h5>
        <p>
          Precio actual: <strong>${subasta.precio}</strong>
        </p>
        <button
          className="btn btn-primary w-100"
          onClick={() => onPujar(subasta)}
          disabled={subasta.tiempo <= 0}
        >
          {subasta.tiempo > 0 ? "Pujar" : "Finalizada"}
        </button>
      </div>
    </div>
  );
}
