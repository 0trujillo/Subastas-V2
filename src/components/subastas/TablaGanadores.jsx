import React from "react";

export default function TablaGanadores({ ganadores }) {
  const lista =
    ganadores && ganadores.length > 0
      ? ganadores
      : JSON.parse(localStorage.getItem("ganadores")) || [];

  // Mostrar solo los últimos 10 (más recientes primero)
  const ultimos10 = lista.slice(-10).reverse();

  return (
    <div className="card mt-5 shadow">
      <div className="card-header bg-warning text-dark fw-bold">
        🏆 Últimas 10 subastas ganadas
      </div>
      <div className="table-responsive">
        <table className="table table-striped align-middle mb-0">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Ganador</th>
              <th>Precio</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {ultimos10.length > 0 ? (
              ultimos10.map((g, i) => (
                <tr key={i}>
                  <td>{g.nombre}</td> {/* antes era g.producto */}
                  <td>{g.usuario}</td>
                  <td>${g.precio}</td> {/* antes era g.monto */}
                  <td>{g.fecha ? new Date(g.fecha).toLocaleString() : "—"}</td>
                </tr>
              ))  
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  Sin ganadores aún
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
