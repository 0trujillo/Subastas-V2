import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";

export default function MisPujasPage() {
  const navigate = useNavigate();
  const [pujas, setPujas] = useState([]);

  useEffect(() => {
    // 🔹 Recupera historial guardado desde localStorage
    const historial = JSON.parse(localStorage.getItem("historialPujas")) || [];
    setPujas(historial);
  }, []);

  const formatearDinero = (monto) =>
    monto.toLocaleString("es-CL", { style: "currency", currency: "CLP" });

  // 🔹 Marca una puja como reclamada
  const reclamarPremio = (id) => {
    const actualizadas = pujas.map((p) =>
      p.id === id ? { ...p, reclamado: true } : p
    );
    setPujas(actualizadas);
    localStorage.setItem("historialPujas", JSON.stringify(actualizadas));
    alert("🎉 Has reclamado tu premio con éxito.");
  };

  // 🔹 Totales y filtros
  const totalGastado = pujas.reduce((acc, p) => acc + p.precio, 0);
  const ganadas = pujas.filter((p) => p.ganador === "usuario");
  const perdidas = pujas.filter((p) => p.ganador !== "usuario");

  return (
    <main className="container mt-5">
      <div className="d-flex justify-content-between mb-3">
        <button
          className="btn btn-outline-primary"
          onClick={() => navigate("/subastas")}
        >
          <i className="fas fa-arrow-left me-2"></i>Volver
        </button>
        <h4 className="fw-bold text-primary mb-0">
          <i className="fas fa-hand-holding-usd me-2"></i>Mis Pujas
        </h4>
      </div>

      {pujas.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-hourglass-half fa-3x text-muted mb-3"></i>
          <h5>No has participado en ninguna puja aún.</h5>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-striped align-middle shadow-sm">
              <thead className="table-primary">
                <tr>
                  <th>Producto</th>
                  <th>Estado</th>
                  <th>Precio Final</th>
                  <th>Fecha</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {pujas.map((p) => (
                  <tr key={p.id}>
                    <td>{p.nombre}</td>
                    <td>
                      <span
                        className={`badge ${
                          p.ganador === "usuario"
                            ? "bg-success"
                            : "bg-danger"
                        }`}
                      >
                        {p.ganador === "usuario" ? "Ganada" : "Perdida"}
                      </span>
                    </td>
                    <td>{formatearDinero(p.precio)}</td>
                    <td>{new Date(p.fecha).toLocaleString()}</td>
                    <td>
                      {p.ganador === "usuario" ? (
                        p.reclamado ? (
                          <span className="badge bg-info">
                            <i className="fas fa-check-circle me-1"></i>
                            Reclamado
                          </span>
                        ) : (
                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={() => reclamarPremio(p.id)}
                          >
                            <i className="fas fa-gift me-1"></i>Reclamar
                          </button>
                        )
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-end">
            <h5 className="fw-bold">
              💰 Total Gastado:{" "}
              <span className="text-primary">
                {formatearDinero(totalGastado)}
              </span>
            </h5>
            <p className="text-muted mb-0">
              Ganadas: {ganadas.length} | Perdidas: {perdidas.length}
            </p>
          </div>
        </>
      )}
    </main>
  );
}
