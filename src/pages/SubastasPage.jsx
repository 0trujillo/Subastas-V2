import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";

export default function SubastasPage() {
  const navigate = useNavigate();
  const [presupuesto, setPresupuesto] = useState(5000);
  const presupuestoMaximo = 100000;
  const [subastas, setSubastas] = useState([]);
  const [modal, setModal] = useState(null);
  const [productoGanado, setProductoGanado] = useState(null);

  // 🔹 Simulación de subastas con temporizador
  const iniciarSubasta = useCallback(
    (subasta) => {
      const tiempoInicial = Math.floor(Math.random() * (240 - 60 + 1)) + 60;
      setSubastas((prev) =>
        prev.map((s) =>
          s.id === subasta.id ? { ...s, tiempo: tiempoInicial } : s
        )
      );

      iniciarBot(subasta.id);

      const intervalo = setInterval(() => {
        setSubastas((prev) =>
          prev.map((s) => {
            if (s.id === subasta.id) {
              const nuevoTiempo = s.tiempo - 1;
              if (nuevoTiempo <= 0) {
                clearInterval(intervalo);
                finalizarSubasta(s);
                return { ...s, tiempo: 0 };
              }
              return { ...s, tiempo: nuevoTiempo };
            }
            return s;
          })
        );
      }, 1000);
    },
    [] // se mantiene estable
  );

  // 🔹 BOT que puja automáticamente
  const iniciarBot = (idSubasta) => {
    const pujarBot = () => {
      setSubastas((prevSubastas) => {
        const actualizadas = prevSubastas.map((s) => {
          if (s.id === idSubasta && s.tiempo > 0) {
            // Solo puja si no es el ganador actual
            if (s.ganador !== "bot") {
              const nuevoPrecio = s.precio + Math.floor(Math.random() * 20) + 5;
              return { ...s, precio: nuevoPrecio, ganador: "bot" };
            }
          }
          return s;
        });

        const subastaActual = actualizadas.find((s) => s.id === idSubasta);
        if (subastaActual && subastaActual.tiempo > 0) {
          let delay = Math.random() * 4000 + 2000;
          if (subastaActual.precio >= 2000) delay *= 2;
          if (subastaActual.precio >= 5000) delay *= 3;
          setTimeout(() => pujarBot(), delay);
        }

        return actualizadas;
      });
    };

    // Primera puja del bot después de 1-4 segundos
    setTimeout(() => pujarBot(), Math.random() * 7000 + 8000);
  };

  // 🔹 Actualizar subasta
  const actualizarSubasta = (subasta) => {
    setSubastas((prev) =>
      prev.map((s) => (s.id === subasta.id ? { ...subasta } : s))
    );
  };

  // 🔹 Pujar manualmente
  const pujar = (subasta) => {
    if (subasta.tiempo <= 0) return;
    if (presupuesto < 10)
      return alert("⚠️ No tienes suficiente presupuesto.");

    const nuevaPuja = subasta.precio + 10;
    const nuevaSubasta = {
      ...subasta,
      precio: nuevaPuja,
      ganador: "usuario",
      ultimaPujaUsuario: nuevaPuja,
    };

    setPresupuesto((p) => p - 10);
    actualizarSubasta(nuevaSubasta);

    // 🔸 Reacciona el bot después de una puja del usuario
    setTimeout(() => iniciarBot(subasta.id), 1500);
  };

  // 🔹 Finalizar subasta
  const finalizarSubasta = (subasta) => {
    if (subasta.ganador === "usuario") {
      setProductoGanado(subasta);
      setModal("reclamar");
    }
  };

  // 🔹 Reclamar subasta ganada
  const reclamarSubasta = () => {
    if (!productoGanado) return;

    const producto = {
      id: productoGanado.id,
      nombre: productoGanado.nombre,
      imagen: productoGanado.imagen,
      precio: productoGanado.ultimaPujaUsuario,
      fechaGanada: new Date().toISOString(),
      estado: "PENDIENTE_ENVIO",
    };

    let productosGanados =
      JSON.parse(localStorage.getItem("productosGanados")) || [];
    productosGanados.push(producto);
    localStorage.setItem("productosGanados", JSON.stringify(productosGanados));

    alert("✅ Producto reclamado exitosamente. Redirigiendo a Envíos...");
    setModal(null);
    setTimeout(() => navigate("/envios"), 800);
  };

  // 🔹 Recargar presupuesto
  const recargar = (monto) => {
    if (presupuesto + monto > presupuestoMaximo) {
      alert("Límite máximo alcanzado");
      return;
    }
    setPresupuesto((p) => p + monto);
  };

  const formatearDinero = (monto) =>
    monto.toLocaleString("es-CL", { style: "currency", currency: "CLP" });

  const formatearTiempo = (segundos) => {
    const min = Math.floor(segundos / 60);
    const sec = segundos % 60;
    return `${min}:${sec < 10 ? "0" + sec : sec}`;
  };

  // 🔹 Inicializar subastas y presupuesto del usuario
  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
    if (!usuario) {
      alert("Por favor inicia sesión primero");
      navigate("/");
      return;
    }
    setPresupuesto(usuario.presupuesto || 5000);

    const lista = [
      {
        id: 1,
        nombre: "Laptop Gamer",
        precio: 100,
        tiempo: 0,
        ganador: null,
        ultimaPujaUsuario: null,
        imagen: "Imagenes/Lgamer.jpg",
      },
      {
        id: 2,
        nombre: "Smartphone",
        precio: 250,
        tiempo: 0,
        ganador: null,
        ultimaPujaUsuario: null,
        imagen: "Imagenes/cel.webp",
      },
      {
        id: 3,
        nombre: "Auriculares",
        precio: 75,
        tiempo: 0,
        ganador: null,
        ultimaPujaUsuario: null,
        imagen: "Imagenes/auri.jpg",
      },
      {
        id: 4,
        nombre: "Carta Pokémon",
        precio: 1000,
        tiempo: 0,
        ganador: null,
        ultimaPujaUsuario: null,
        imagen: "Imagenes/ctpokemon.jpg",
      },
      {
        id: 5,
        nombre: "PlayStation 5",
        precio: 500,
        tiempo: 0,
        ganador: null,
        ultimaPujaUsuario: null,
        imagen: "Imagenes/play5.jpg",
      },
      {
        id: 6,
        nombre: "Bicicleta",
        precio: 300,
        tiempo: 0,
        ganador: null,
        ultimaPujaUsuario: null,
        imagen: "Imagenes/bici.webp",
      },
    ];

    const subastasAleatorias = lista.sort(() => Math.random() - 0.5);
    setSubastas(subastasAleatorias);

    subastasAleatorias.forEach((s) => iniciarSubasta(s));
  }, [navigate, iniciarSubasta]);

  // =================== UI ===================
  return (
    <>
      <main className="container mt-5">
        <div className="text-end mb-3">
          <span className="badge bg-success fs-6">
            💰 Presupuesto: {formatearDinero(presupuesto)}
          </span>
          <button
            className="btn btn-sm btn-outline-primary ms-2"
            onClick={() => recargar(1000)}
          >
            + Recargar $1,000
          </button>
        </div>

        <h2 className="text-center mb-4">Subastas Activas</h2>
        <div className="row">
          {subastas.map((subasta) => (
            <div className="col-md-4 mb-4" key={subasta.id}>
              <div className="card shadow-sm">
                <img
                  src={subasta.imagen}
                  alt={subasta.nombre}
                  className="card-img-top"
                  style={{ height: "220px", objectFit: "cover" }}
                />
                <div className="card-body text-center">
                  <h5>{subasta.nombre}</h5>
                  <p>
                    Precio actual:{" "}
                    <strong>{formatearDinero(subasta.precio)}</strong>
                  </p>
                  <p className="text-danger">
                    Tiempo: {formatearTiempo(subasta.tiempo)}
                  </p>
                  <button
                    className="btn btn-primary w-100 mb-2"
                    onClick={() => pujar(subasta)}
                    disabled={subasta.tiempo <= 0}
                  >
                    {subasta.tiempo > 0 ? "Pujar" : "Finalizada"}
                  </button>

                  {subasta.ultimaPujaUsuario && (
                    <p className="text-success">
                      Tu última puja:{" "}
                      {formatearDinero(subasta.ultimaPujaUsuario)}
                    </p>
                  )}

                  {subasta.tiempo === 0 && subasta.ganador && (
                    <p
                      className={
                        subasta.ganador === "usuario"
                          ? "text-success fw-bold"
                          : "text-danger fw-bold"
                      }
                    >
                      {subasta.ganador === "usuario"
                        ? "¡Ganaste! 🎉"
                        : "Gano user235 👤"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {modal === "reclamar" && productoGanado && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">
                  <i className="fas fa-trophy me-2"></i>¡Felicitaciones!
                </h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={() => setModal(null)}
                ></button>
              </div>
              <div className="modal-body text-center">
                <i
                  className="fas fa-trophy text-success mb-3"
                  style={{ fontSize: "3rem" }}
                ></i>
                <h6>¡Has ganado la subasta!</h6>
                <p>
                  Producto: <strong>{productoGanado.nombre}</strong>
                </p>
                <p>
                  Precio final:{" "}
                  <strong>
                    {formatearDinero(productoGanado.ultimaPujaUsuario)}
                  </strong>
                </p>
                <div className="alert alert-info">
                  Para completar tu compra, configura el envío.
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setModal(null)}
                >
                  Más tarde
                </button>
                <button className="btn btn-success" onClick={reclamarSubasta}>
                  <i className="fas fa-gift me-2"></i>Reclamar y Ver Envío
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
