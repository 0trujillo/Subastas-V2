import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ModalReclamar from "../components/subastas/ModalReclamar";
import TablaGanadores from "../components/subastas/TablaGanadores";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import confetti from "canvas-confetti";

export default function SubastasPage() {
  const navigate = useNavigate();
  const [presupuesto, setPresupuesto] = useState(5000);
  const [subastas, setSubastas] = useState([]);
  const [productoGanado, setProductoGanado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [ganadores, setGanadores] = useState([]);
  const [panelVisible, setPanelVisible] = useState(false);
  const presupuestoMaximo = 100000;

  // 🧩 Inicialización
  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
    if (!usuario) {
      alert("Por favor inicia sesión primero");
      navigate("/");
      return;
    }

    setPresupuesto(usuario.presupuesto || 5000);

    const lista = [
      { id: 1, nombre: "Laptop Gamer", precio: 100, tiempo: 60, imagen: "Imagenes/Lgamer.jpg" },
      { id: 2, nombre: "Smartphone", precio: 250, tiempo: 70, imagen: "Imagenes/cel.webp" },
      { id: 3, nombre: "Auriculares", precio: 75, tiempo: 50, imagen: "Imagenes/auri.jpg" },
      { id: 4, nombre: "Carta Pokémon", precio: 1000, tiempo: 80, imagen: "Imagenes/ctpokemon.jpg" },
      { id: 5, nombre: "PlayStation 5", precio: 500, tiempo: 65, imagen: "Imagenes/play5.jpg" },
      { id: 6, nombre: "Bicicleta", precio: 300, tiempo: 75, imagen: "Imagenes/bici.webp" },
    ];
    setSubastas(lista);

    const ganadoresGuardados = JSON.parse(localStorage.getItem("ganadores")) || [];
    setGanadores(ganadoresGuardados);
  }, [navigate]);

  // 🕒 Temporizador
  useEffect(() => {
    const interval = setInterval(() => {
      setSubastas((prevSubastas) =>
        prevSubastas.map((s) => {
          if (s.tiempo > 1) return { ...s, tiempo: s.tiempo - 1 };

          if (s.tiempo === 1 && s.ganador && !s.ganadorGuardado) {
            const nuevoGanador = {
              nombre: s.nombre,
              usuario: s.ganador === "usuario" ? "Tú" : s.ganador,
              precio: s.precio,
              fecha: new Date().toISOString(),
            };

            setGanadores((prevG) => {
              const yaExiste = prevG.some(
                (g) => g.nombre === nuevoGanador.nombre && g.precio === nuevoGanador.precio
              );
              if (yaExiste) return prevG;

              const actualizados = [...prevG, nuevoGanador];
              localStorage.setItem("ganadores", JSON.stringify(actualizados));
              return actualizados;
            });

            const historial = JSON.parse(localStorage.getItem("historialPujas")) || [];
            const nuevaEntrada = {
              id: s.id,
              nombre: s.nombre,
              precio: s.precio,
              fecha: new Date().toISOString(),
              ganador: s.ganador,
              reclamado: false,
            };
            if (!historial.some((p) => p.id === s.id)) {
              historial.push(nuevaEntrada);
              localStorage.setItem("historialPujas", JSON.stringify(historial));
            }

            if (s.ganador === "usuario") {
              lanzarConfeti();
              const finalizada = { ...s, tiempo: 0, ganadorGuardado: true };
              setProductoGanado(finalizada);
              setModalVisible(true);
              return finalizada;
            }

            return { ...s, tiempo: 0, ganadorGuardado: true };
          }

          if (s.tiempo === 1 && !s.ganador) {
            return { ...s, tiempo: 0, ganadorGuardado: true };
          }

          return s;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 🤖 Bots
  useEffect(() => {
    const bots = [
      { nombre: "User2314", agresividad: 0.5, incrementoMax: 20 },
      { nombre: "User000", agresividad: 0.5, incrementoMax: 20 },
      { nombre: "User9875", agresividad: 0.5, incrementoMax: 20 },
    ];

    const intervaloBots = setInterval(() => {
      setSubastas((prev) =>
        prev.map((s) => {
          if (s.tiempo <= 0) return s;
          const bot = bots[Math.floor(Math.random() * bots.length)];
          const probabilidad = Math.random();

          const puedePujar =
            probabilidad < bot.agresividad ||
            !s.ganador ||
            s.ganador === "usuario";

          if (puedePujar && s.precio < 3000) {
            const incremento = Math.floor(Math.random() * bot.incrementoMax) + 5;
            return {
              ...s,
              precio: s.precio + incremento,
              ganador: bot.nombre,
            };
          }

          return s;
        })
      );
    }, 2500);

    return () => clearInterval(intervaloBots);
  }, []);

  // 👨‍💻 Pujar manualmente
  const pujar = (subasta) => {
    if (presupuesto < 10) {
      alert("⚠️ No tienes suficiente presupuesto.");
      return;
    }

    setSubastas((prev) =>
      prev.map((s) => {
        if (s.id === subasta.id && s.tiempo > 0) {
          return { ...s, precio: s.precio + 10, ganador: "usuario" };
        }
        return s;
      })
    );

    setPresupuesto((p) => p - 10);
  };

  // 🎉 Confeti
  const lanzarConfeti = () => {
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
  };

  // 🏅 Reclamar subasta ganada
  const reclamarSubasta = () => {
    if (!productoGanado) return;

    const producto = {
      id: productoGanado.id,
      nombre: productoGanado.nombre,
      imagen: productoGanado.imagen,
      precio: productoGanado.precio,
      fechaGanada: new Date().toISOString(),
      estado: "PENDIENTE_ENVIO",
    };

    const productosGanados = JSON.parse(localStorage.getItem("productosGanados")) || [];
    localStorage.setItem("productosGanados", JSON.stringify([...productosGanados, producto]));

    alert("✅ Producto reclamado exitosamente. Redirigiendo a Envíos...");
    setModalVisible(false);
    setTimeout(() => navigate("/envios"), 800);
  };

  // 💸 Recargar presupuesto
  const recargar = (monto) => {
    setPresupuesto((p) => {
      if (p + monto > presupuestoMaximo) {
        alert("Límite máximo alcanzado");
        return p;
      }
      return p + monto;
    });
  };

  const formatearDinero = (monto) =>
    monto.toLocaleString("es-CL", { style: "currency", currency: "CLP" });

  return (
    <>
      <main className="container mt-5 position-relative">
        {/* 💲 Botón flotante */}
        <button
          className="btn btn-primary rounded-circle shadow-lg position-fixed"
          style={{
            bottom: "30px",
            right: "30px",
            width: "60px",
            height: "60px",
            zIndex: 1050,
            fontSize: "1.5rem",
          }}
          onClick={() => setPanelVisible((p) => !p)}
          title="Mi Cuenta"
        >
          💲
        </button>

        {/* 💼 Panel lateral colapsable */}
        {panelVisible && (
          <div
            className="card position-fixed end-0 top-50 translate-middle-y p-3 shadow bg-light border-0"
            style={{
              width: "260px",
              zIndex: 1040,
              transition: "all 0.3s ease",
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="text-primary fw-bold mb-0">👤 Mi Cuenta</h6>
              <button
                className="btn btn-sm btn-outline-danger rounded-circle"
                onClick={() => setPanelVisible(false)}
              >
                ✖
              </button>
            </div>

            <p>
              Presupuesto: <strong>{formatearDinero(presupuesto)}</strong>
            </p>
            <button
              className="btn btn-success btn-sm w-100 mb-2"
              onClick={() => recargar(1000)}
            >
              💸 Recargar $1,000
            </button>
            <button
              className="btn btn-info btn-sm w-100"
              onClick={() => navigate("/envios")}
            >
              📦 Mis Envíos
            </button>
          </div>
        )}

        {/* 🏅 Banner de ganador */}
        {ganadores.length > 0 && (
          <div className="alert alert-success text-center shadow-sm mt-3">
            🏅 Último ganador:{" "}
            <strong>{ganadores[ganadores.length - 1].usuario}</strong> ganó{" "}
            <strong>{ganadores[ganadores.length - 1].nombre}</strong> por{" "}
            <strong>${ganadores[ganadores.length - 1].precio}</strong>
          </div>
        )}

        {/* 💰 Presupuesto */}
        <div className="text-end mb-3">
          <span className="badge bg-success fs-6">
            💰 Presupuesto: {formatearDinero(presupuesto)}
          </span>
        </div>

        <h2 className="text-center mb-4 fw-bold text-primary">
          🔥 Subastas Activas
        </h2>

        {/* 🧩 Lista de subastas */}
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
                        width: `${subasta.tiempo > 0 ? (subasta.tiempo / 60) * 100 : 0}%`,
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
                    onClick={() => pujar(subasta)}
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

        {/* 🏆 Tabla de ganadores */}
        <TablaGanadores ganadores={ganadores} />
      </main>

      {/* 🪄 Modal de reclamo */}
      {modalVisible && (
        <ModalReclamar
          producto={productoGanado}
          onCerrar={() => setModalVisible(false)}
          onReclamar={reclamarSubasta}
        />
      )}
    </>
  );
}
