import React from "react";

export default function TablaGanadores({ ganadores }) {

  const ultimos10 = ganadores.slice(0, 10);

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
              ultimos10.map((g) => (
                <tr key={g.id}>
                  <td>{g.nombreProducto}</td>
                  <td>{g.usuarioGanador}</td>
                  <td>${g.precioFinal}</td>
                  <td>{new Date(g.fecha).toLocaleString()}</td>
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
