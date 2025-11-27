// ===== SubastasPage.jsx =====
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { reclamarEnvio } from "../api/EnviosAPI";
import ModalReclamar from "../components/subastas/ModalReclamar";
import TablaGanadores from "../components/subastas/TablaGanadores";
import ListaSubastas from "../components/subastas/ListaSubastas";
import PanelCuenta from "../components/subastas/PanelCuenta";
import {
  obtenerSubastas,
  pujar as pujarAPI,
  obtenerGanadores
} from "../api/SubastaAPI";

import {
  obtenerUsuario,
  recargarPresupuesto,
  descontarPresupuesto,
} from "../api/UsuarioAPI";

import confetti from "canvas-confetti";

export default function SubastasPage() {
  const navigate = useNavigate();
  const [presupuesto, setPresupuesto] = useState(0);
  const [subastas, setSubastas] = useState([]);
  const [productoGanado, setProductoGanado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [ganadores, setGanadores] = useState([]);
  const [cargandoReclamo, setCargandoReclamo] = useState(false);

  const presupuestoMaximo = 100000;

  const usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));

  // ==========================
  // CARGAR SUBASTAS + USUARIO (inicio)
  // ==========================
  useEffect(() => {
    if (!usuarioActual) {
      alert("Por favor inicia sesión primero");
      navigate("/");
      return;
    }

    // Obtener usuario REAL desde backend
    obtenerUsuario(usuarioActual.nombre)
      .then((res) => {
        setPresupuesto(res.data.presupuesto);
        localStorage.setItem("usuarioActual", JSON.stringify(res.data));
      })
      .catch(console.error);

    obtenerSubastas()
      .then((res) => setSubastas(res.data))
      .catch(console.error);
  }, [navigate]);

  // ==========================
  // SINCRONIZAR SUBASTAS CADA 1s
  // ==========================
  useEffect(() => {
    const interval = setInterval(() => {
      obtenerSubastas()
        .then((res) => setSubastas(res.data))
        .catch(console.error);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ==========================
  // GANADORES
  // ==========================
  useEffect(() => {
    obtenerGanadores()
      .then((res) => setGanadores(res.data))
      .catch(console.error);
  }, []);

  // ==========================
  // 🚚 RECLAMAR ENVÍO
  // ==========================
  const reclamarSubasta = async () => {
    const usuario = JSON.parse(localStorage.getItem("usuarioActual"));

    try {
      setCargandoReclamo(true);

      await reclamarEnvio(productoGanado.id, usuario.nombre);

      alert("✨ Reclamo realizado. Configura tu envío.");
      setModalVisible(false);
      navigate("/envios");

    } catch (error) {
      console.error(error);
      alert("No fue posible reclamar la subasta.");
    } finally {
      setCargandoReclamo(false);
    }
  };
  

  // ==========================
  // 🟡 PUJAR
  // ==========================
  const pujar = async (subasta) => {
    const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
    if (!usuario) return alert("Debes iniciar sesión");

    if (presupuesto < 10)
      return alert("⚠️ No tienes suficiente presupuesto.");

    try {
      const res = await pujarAPI(subasta.id, {
        usuario: usuario.nombre,
        incremento: 10,
      });

      const actualizada = res.data;

      setSubastas((prev) =>
        prev.map((s) => (s.id === actualizada.id ? actualizada : s))
      );

      // Descontar localmente
      setPresupuesto((p) => p - 10);

      if (actualizada.ganada && actualizada.ganador === usuario.nombre) {
        lanzarConfeti();
        setProductoGanado(actualizada);
        setModalVisible(true);
      }

    } catch (err) {
      console.error(err);
      alert("Error al pujar");
    }
  };

  const lanzarConfeti = () => {
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
  };

  // ==========================
  // 💸 RECARGAR (REAL + BACKEND)
  // ==========================
  const recargar = async (monto) => {
    if (!usuarioActual) return;

    try {
      const res = await recargarPresupuesto(usuarioActual.nombre, monto);

      const usuarioActualizado = res.data;

      // guardar usuario nuevo en localStorage
      localStorage.setItem("usuarioActual", JSON.stringify(usuarioActualizado));

      // actualizar presupuesto en pantalla
      setPresupuesto(usuarioActualizado.presupuesto);

    } catch (err) {
      console.error(err);
      alert("Error al recargar presupuesto");
    }
  };

  const formatearDinero = (monto) =>
    monto.toLocaleString("es-CL", { style: "currency", currency: "CLP" });

  return (
    <>
      <PanelCuenta
        presupuesto={presupuesto}
        formatearDinero={formatearDinero}
        onRecargar={recargar}
        onVerEnvios={() => navigate("/envios")}
      />

      <main className="container mt-5 position-relative">

        {ganadores.length > 0 && (
          <div className="alert alert-success text-center shadow-sm mt-3">
            🏅 Último ganador:
            <strong> {ganadores[ganadores.length - 1].usuario}</strong> ganó
            <strong> {ganadores[ganadores.length - 1].nombre}</strong> por
            <strong> ${ganadores[ganadores.length - 1].precio}</strong>
          </div>
        )}

        <div className="text-end mb-3">
          <span className="badge bg-success fs-6">
            💰 Presupuesto: {formatearDinero(presupuesto)}
          </span>
        </div>

        <h2 className="text-center mb-4 fw-bold text-primary">🔥 Subastas Activas</h2>

        <ListaSubastas
          subastas={subastas}
          onPujar={pujar}
          onReclamar={(subasta) => {
            setProductoGanado(subasta);
            setModalVisible(true);
          }}
          usuarioActual={usuarioActual}
        />

        <TablaGanadores ganadores={ganadores} />
      </main>

      {modalVisible && (
        <ModalReclamar
          producto={productoGanado}
          onCerrar={() => setModalVisible(false)}
          onReclamar={reclamarSubasta}
          loading={cargandoReclamo}
        />
      )}
    </>
  );
}
