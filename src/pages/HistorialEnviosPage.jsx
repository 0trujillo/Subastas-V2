import React, { useEffect, useState } from "react";
import { obtenerHistorial } from "../api/EnviosAPI";

export default function HistorialEnviosPage() {
  const usuario = JSON.parse(localStorage.getItem("usuarioActual"))?.nombre;

  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    if (!usuario) return;

    obtenerHistorial(usuario)
      .then((res) => {
        setHistorial(res.data);
      })
      .catch((err) => {
        console.log("Error cargando historial", err);
      });
  }, [usuario]);

  return (
    <div className="container mt-4">
      <h2>Historial de Envíos</h2>

      {historial.length === 0 ? (
        <p>No hay historial disponible</p>
      ) : (
        <div className="row">
          {historial.map((item) => (
            <div className="col-md-4" key={item.id}>
              <div className="card mt-3">

                {/* 📦 Placeholder sin imagen */}
                <div
                  style={{
                    width: "100%",
                    height: "180px",
                    backgroundColor: "#e9ecef",
                    borderBottom: "1px solid #ddd",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "48px",
                    color: "#6c757d",
                  }}
                >
                  📦
                </div>

                <div className="card-body">
                  <h5>{item.nombreProducto}</h5>

                  {/* 🎨 Badge dinámico según estado */}
                  <span
                    className={`badge ${
                      item.estado === "ENTREGADO"
                        ? "bg-primary"
                        : item.estado === "DESCARTADO"
                        ? "bg-danger"
                        : "bg-secondary"
                    }`}
                  >
                    {item.estado}
                  </span>

                  {item.fechaEntrega && (
                    <p className="mt-2">
                      Finalizado:{" "}
                      {new Date(item.fechaEntrega).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
