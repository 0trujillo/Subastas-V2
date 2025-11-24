import React from "react";

export default function ProductoEnvioCard({
  producto,
  onConfigurarEnvio,
  onEntregarProducto,
  onDescartarProducto,
}) {
  const formatearDinero = (monto) =>
    monto.toLocaleString("es-CL", { style: "currency", currency: "CLP" });

  return (
    <div className="card shadow-sm h-100">
      <img
        src={producto.imagen}
        alt={producto.nombre}
        className="card-img-top"
        style={{ height: "220px", objectFit: "cover" }}
      />

      <div className="card-body text-center">
        <h5>{producto.nombre}</h5>
        <p className="text-muted mb-1">
          Precio ganado: <strong>{formatearDinero(producto.precio)}</strong>
        </p>

        <p>
          Estado:{" "}
          <span
            className={`badge ${
              producto.estado === "PENDIENTE_ENVIO"
                ? "bg-warning text-dark"
                : producto.estado === "ENVIADO"
                ? "bg-info text-dark"
                : "bg-success"
            }`}
          >
            {producto.estado}
          </span>
        </p>

        {producto.estado === "PENDIENTE_ENVIO" && (
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => onConfigurarEnvio(producto)}
          >
            Configurar Envío
          </button>
        )}

        {producto.estado === "ENVIADO" && (
          <button
            className="btn btn-outline-success btn-sm"
            onClick={() => onEntregarProducto(producto)}
          >
            Confirmar Entrega
          </button>
        )}

        <button
          className="btn btn-outline-danger btn-sm mt-2"
          onClick={() => onDescartarProducto(producto)}
        >
          Descartar Envío
        </button>
      </div>
    </div>
  );
}
