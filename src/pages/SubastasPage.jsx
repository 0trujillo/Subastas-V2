
// ===== SubastasPage.jsx =====
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ModalReclamar from "../components/subastas/ModalReclamar";
import TablaGanadores from "../components/subastas/TablaGanadores";
import ListaSubastas from "../components/subastas/ListaSubastas";
import PanelCuenta from "../components/subastas/PanelCuenta";
import {
  obtenerSubastas,
  pujar as pujarAPI,
} from "../api/SubastaAPI";
import confetti from "canvas-confetti";

export default function SubastasPage() {
  const navigate = useNavigate();
  const [presupuesto, setPresupuesto] = useState(5000);
  const [subastas, setSubastas] = useState([]);
  const [productoGanado, setProductoGanado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [ganadores, setGanadores] = useState([]);

  const presupuestoMaximo = 100000;

  // 🔥 TEMPORIZADOR LOCAL (actualiza la vista cada segundo)
useEffect(() => {
  const interval = setInterval(() => {
    setSubastas(prev =>
      prev.map(s =>
        s.tiempo > 0 ? { ...s, tiempo: s.tiempo - 1 } : s
      )
    );
  }, 1000);

  return () => clearInterval(interval);
}, []);


  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
    if (!usuario) {
      alert("Por favor inicia sesión primero");
      navigate("/");
      return;
    }

    setPresupuesto(usuario.presupuesto || 5000);

    obtenerSubastas()
      .then((res) => setSubastas(res.data))
      .catch(console.error);

    const ganadoresGuardados = JSON.parse(localStorage.getItem("ganadores")) || [];
    setGanadores(ganadoresGuardados);
  }, [navigate]);

  const pujar = async (subasta) => {
    const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
    if (!usuario) return alert("Debes iniciar sesión");

    if (presupuesto < 10) return alert("⚠️ No tienes suficiente presupuesto.");

    try {
      const res = await pujarAPI(subasta.id, {
        usuario: usuario.nombre,
        incremento: 10,
      });

      const actualizada = res.data;

      setSubastas((prev) => prev.map((s) => (s.id === actualizada.id ? actualizada : s)));
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

    alert("Producto reclamado. Redirigiendo...");
    setModalVisible(false);
    setTimeout(() => navigate("/envios"), 800);
  };

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
      <PanelCuenta
        presupuesto={presupuesto}
        formatearDinero={formatearDinero}
        onRecargar={recargar}
        onVerEnvios={() => navigate("/envios")}
      />

      <main className="container mt-5 position-relative">
        {ganadores.length > 0 && (
          <div className="alert alert-success text-center shadow-sm mt-3">
            🏅 Último ganador: <strong>{ganadores[ganadores.length - 1].usuario}</strong> ganó
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

        <ListaSubastas subastas={subastas} onPujar={pujar} />
        <TablaGanadores ganadores={ganadores} />
      </main>

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


