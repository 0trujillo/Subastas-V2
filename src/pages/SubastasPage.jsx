// src/pages/SubastasPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ProductoCard from "../components/subastas/ProductoCard";
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
  const presupuestoMaximo = 100000;

  // 🧩 Inicializar datos
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

  // 🕒 Temporizador de subastas
  useEffect(() => {
    const interval = setInterval(() => {
      setSubastas((prev) =>
        prev.map((s) => (s.tiempo > 0 ? { ...s, tiempo: s.tiempo - 1 } : s))
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // 🤖 Bot inteligente
  const iniciarBot = useCallback((id) => {
    const randomDelay = Math.random() * 4000 + 1500;
    setTimeout(() => {
      setSubastas((prev) =>
        prev.map((s) => {
          if (s.id === id && s.tiempo > 0) {
            const probabilidad = Math.random();
            if (probabilidad > 0.5) {
              return {
                ...s,
                precio: s.precio + Math.floor(Math.random() * 30) + 10,
                ganador: "BOT",
              };
            }
          }
          return s;
        })
      );
    }, randomDelay);
  }, []);

  // 👨‍💻 Pujar manualmente
  const pujar = (subasta) => {
    if (presupuesto < 10) return alert("⚠️ No tienes suficiente presupuesto.");
    const nuevaSubasta = { ...subasta, precio: subasta.precio + 10, ganador: "usuario" };
    setSubastas((prev) => prev.map((s) => (s.id === subasta.id ? nuevaSubasta : s)));
    setPresupuesto((p) => p - 10);
    iniciarBot(subasta.id);

    // 🎯 Si alcanza el límite, finaliza la subasta
    if (subasta.precio + 10 >= 2000) {
      lanzarConfeti();
      const nuevaSubastaFinalizada = { ...nuevaSubasta, tiempo: 0 };
      setSubastas((prev) =>
        prev.map((s) => (s.id === subasta.id ? nuevaSubastaFinalizada : s))
      );

      setProductoGanado(nuevaSubastaFinalizada);
      setModalVisible(true);

      const nuevoGanador = {
        nombre: nuevaSubastaFinalizada.nombre,
        usuario: "Tú",
        precio: nuevaSubastaFinalizada.precio,
        fecha: new Date().toISOString(),
      };

      setGanadores((prev) => {
        const actualizados = [...prev, nuevoGanador];
        localStorage.setItem("ganadores", JSON.stringify(actualizados));
        return actualizados;
      });
    }
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

    let productosGanados = JSON.parse(localStorage.getItem("productosGanados")) || [];
    productosGanados.push(producto);
    localStorage.setItem("productosGanados", JSON.stringify(productosGanados));

    alert("✅ Producto reclamado exitosamente. Redirigiendo a Envíos...");
    setModalVisible(false);
    setTimeout(() => navigate("/envios"), 800);
  };

  // 💸 Recargar presupuesto
  const recargar = (monto) => {
    if (presupuesto + monto > presupuestoMaximo)
      return alert("Límite máximo alcanzado");
    setPresupuesto((p) => p + monto);
  };

  const formatearDinero = (monto) =>
    monto.toLocaleString("es-CL", { style: "currency", currency: "CLP" });

  return (
    <>
      <Navbar />
      <main className="container mt-5 position-relative">
        {/* Panel lateral */}
        <div
          className="card position-fixed end-0 top-50 translate-middle-y p-3 shadow bg-light border-0"
          style={{ width: "250px", zIndex: 1000 }}
        >
          <h6 className="text-primary fw-bold">👤 Mi Cuenta</h6>
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

        {/* Banner del último ganador */}
        {ganadores.length > 0 && (
          <div className="alert alert-success text-center shadow-sm mt-3">
            🏅 Último ganador: <strong>{ganadores[ganadores.length - 1].usuario}</strong> ganó{" "}
            <strong>{ganadores[ganadores.length - 1].nombre}</strong> por{" "}
            <strong>${ganadores[ganadores.length - 1].precio}</strong>
          </div>
        )}

        {/* Encabezado */}
        <div className="text-end mb-3">
          <span className="badge bg-success fs-6">
            💰 Presupuesto: {formatearDinero(presupuesto)}
          </span>
        </div>

        <h2 className="text-center mb-4 fw-bold text-primary">🔥 Subastas Activas</h2>

        {/* Lista de subastas */}
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
                      style={{ width: `${(subasta.tiempo / 60) * 100}%` }}
                    ></div>
                  </div>
                  <small className="text-muted">⏳ {subasta.tiempo}s restantes</small>
                  <button
                    className="btn btn-primary w-100 mt-2"
                    onClick={() => pujar(subasta)}
                    disabled={subasta.tiempo <= 0}
                  >
                    {subasta.tiempo > 0 ? "Pujar" : "Finalizada"}
                  </button>

                  {/* 🏆 Mostrar ganador */}
                  {subasta.tiempo <= 0 && subasta.ganador && (
                    <div
                      className={`alert ${
                        subasta.ganador === "usuario" ? "alert-success" : "alert-warning"
                      } mt-2 py-1`}
                    >
                      🏆 Ganador:{" "}
                      {subasta.ganador === "usuario" ? "Tú" : "BOT"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabla de ganadores */}
        <TablaGanadores ganadores={ganadores} />
      </main>

      {/* Modal de reclamo */}
      {modalVisible && (
        <ModalReclamar
          producto={productoGanado}
          onCerrar={() => setModalVisible(false)}
          onReclamar={reclamarSubasta}
        />
      )}

      <Footer />
    </>
  );
}
