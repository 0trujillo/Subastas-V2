import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ModalReclamar from "../components/subastas/ModalReclamar";
import TablaGanadores from "../components/subastas/TablaGanadores";
import ListaSubastas from "../components/subastas/ListaSubastas";
import useBotLogic from "../hooks/useBotLogic";
import PanelCuenta from "../components/subastas/PanelCuenta"; // <-- Ya lo tienes importado, ¡genial!

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
  // const [panelVisible, setPanelVisible] = useState(false); // <-- 1. ELIMINAMOS ESTE ESTADO
  const presupuestoMaximo = 100000;

  useBotLogic(setSubastas);

  // ... (useEffect de Inicialización y Temporizador se mantienen igual) ...
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


  // ... (pujar, lanzarConfeti, reclamarSubasta se mantienen igual) ...
  // 👨‍💻 Pujar manually
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

  // 💸 Recargar presupuesto (Esta función se queda aquí)
  const recargar = (monto) => {
    setPresupuesto((p) => {
      if (p + monto > presupuestoMaximo) {
        alert("Límite máximo alcanzado");
        return p;
      }
      return p + monto;
    });
  };

  // Esta función se queda aquí
  const formatearDinero = (monto) =>
    monto.toLocaleString("es-CL", { style: "currency", currency: "CLP" });

  return (
    <>
      {/* 2. AÑADIMOS EL NUEVO COMPONENTE Y LE PASAMOS PROPS */}
      <PanelCuenta
        presupuesto={presupuesto}
        formatearDinero={formatearDinero}
        onRecargar={recargar}
        onVerEnvios={() => navigate("/envios")}
      />

      <main className="container mt-5 position-relative">
        
        {/* 3. ELIMINAMOS EL BOTÓN FLOTANTE Y EL PANEL LATERAL DE AQUÍ */}

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
        <ListaSubastas subastas={subastas} onPujar={pujar} />

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

