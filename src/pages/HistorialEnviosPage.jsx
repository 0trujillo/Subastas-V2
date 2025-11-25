import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { obtenerHistorial } from "../api/EnviosAPI";

export default function HistorialEnviosPage() {
  const location = useLocation();
  const usuario = location.state?.usuario; // 🔥 GANADOR REAL

  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    if (!usuario) return;

    obtenerHistorial(usuario)
      .then((res) => setHistorial(res.data))
      .catch(() => console.log("Error cargando historial"));
  }, [usuario]);

  return (
    <div className="container mt-4">
      <h2>Historial de Envíos</h2>

      {historial.length === 0 ? (
        <p>No hay historial disponible</p>
      ) : (
        <div className="row">
          {historial.map((h) => (
            <div className="col-md-4" key={h.id}>
              <div className="card mt-3">
                <img src={h.imagen} alt={h.nombreProducto} />
                <div className="card-body">
                  <h5>{h.nombreProducto}</h5>
                  <span>{h.estado}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
