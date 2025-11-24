import React from "react";

export default function ListaSubastas({ subastas, onPujar, onReclamar, usuarioActual }) {
  return (
    <div className="row">
      {subastas.map((s) => {
        const finalizada = s.ganada || s.tiempo <= 0;
        const esGanador = usuarioActual && s.ganada && s.ganador === usuarioActual.nombre;

        return (
          <div key={s.id} className="col-md-4 mb-4">
            <div className="card shadow-sm">
              <img
                src={s.imagen}
                alt={s.nombre}
                className="card-img-top"
                style={{ height: "200px", objectFit: "cover" }}
              />

              <div className="card-body">
                <h5 className="card-title">{s.nombre}</h5>

                {/* Precio */}
                <p className="card-text">
                  <strong>💰 Precio actual:</strong> ${s.precio}
                </p>

                {/* Tiempo */}
                {!finalizada ? (
                  <p className="text-primary">
                    🕒 Tiempo restante: <strong>{s.tiempo}s</strong>
                  </p>
                ) : (
                  <p className="text-danger">⛔ Subasta finalizada</p>
                )}

                {/* Ganador actual */}
                {s.ganador ? (
                  <p>
                    🏅 <strong>Ganador actual:</strong> {s.ganador}
                  </p>
                ) : (
                  <p className="text-muted">Sin pujas aún</p>
                )}

                {/* ============================
                    BOTÓN RECLAMAR ENVÍO
                ============================ */}
                {/* BOTÓN RECLAMAR */}
                {esGanador && (
                  s.estado === "RECLAMADA" ? (
                    <button className="btn btn-secondary btn-sm mt-2 w-100" disabled>
                      ✔ Ya reclamado
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-success btn-sm mt-2 w-100"
                      onClick={() => onReclamar(s)}
                    >
                      📦 Reclamar Envío
                    </button>
                  )
                )}


                {/* Botón Pujar */}
                {!finalizada ? (
                  <button className="btn btn-success w-100 mt-2" onClick={() => onPujar(s)}>
                    Pujar +10
                  </button>
                ) : (
                  <button className="btn btn-secondary w-100 mt-2" disabled>
                    {s.ganador ? `Ganada por ${s.ganador}` : "Sin ganador"}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
