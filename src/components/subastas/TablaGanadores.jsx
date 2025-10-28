import React, { useEffect, useState } from "react";

export default function TablaGanadores({ ganadores }) {
  const [lista, setLista] = useState(ganadores);

  // Sincronizar con localStorage si cambia externamente
  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem("ganadores")) || [];
    setLista(guardados);
  }, [ganadores]);

  return (
    <div className="card mt-5 shadow">
      <div className="card-header bg-warning text-dark fw-bold">
        🏆 Últimos Ganadores
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
            {lista.length > 0 ? (
              lista.map((g, i) => (
                <tr key={i}>
                  <td>{g.nombre}</td>
                  <td>{g.usuario}</td>
                  <td>${g.precio}</td>
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
