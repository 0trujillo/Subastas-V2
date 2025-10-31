import React from "react";

// Este componente no necesita importar ModalReclamar, TablaGanadores, ni a sí mismo.
// Solo recibe props y renderiza JSX.

export default function ListaSubastas({ subastas, onPujar }) {
  return (
    <div className="row">
      {subastas.map((subasta) => (
        <div className="col-md-4 mb-4" key={subasta.id}>
          <div className="card shadow-sm border-0">
            <img
              src={subasta.imagen}
              alt={subasta.nombre}
              className="card-img-top"
              style={{ height: "220px", objectFit: "cover" }}
            />
            <div className="card-body text-center">
              <h5>{subasta.nombre}</h5>
              <p className="mb-1">
                Precio actual: <strong>${subasta.precio}</strong>
              </p>

              <div className="progress my-2" style={{ height: "8px" }}>
                <div
                  className="progress-bar bg-success"
                  role="progressbar"
                  style={{
                    width: `${
                      subasta.tiempo > 0 ? (subasta.tiempo / 60) * 100 : 0
                    }%`,
                  }}
                ></div>
              </div>
              <small className="text-muted d-block mb-1">
                ⏳ {subasta.tiempo}s restantes
              </small>

              <div className="mb-2">
                {subasta.ganador === "usuario" ? (
                  <span className="badge bg-success">🏆 Vas ganando</span>
                ) : subasta.ganador ? (
                  <span className="badge bg-warning text-dark">
                    👤 {subasta.ganador} va ganando
                  </span>
                ) : (
                  <span className="badge bg-secondary">Sin pujas aún</span>
                )}
              </div>

              <button
                className="btn btn-primary w-100 mt-1"
                onClick={() => onPujar(subasta)}
                disabled={subasta.tiempo <= 0}
              >
                {subasta.tiempo > 0 ? "Pujar" : "Finalizada"}
              </button>

              {subasta.tiempo <= 0 && subasta.ganador && (
                <div
                  className={`alert ${
                    subasta.ganador === "usuario"
                      ? "alert-success"
                      : "alert-warning"
                  } mt-2 py-1`}
                >
                  🏁 Ganador final:{" "}
                  {subasta.ganador === "usuario" ? "Tú" : subasta.ganador}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

