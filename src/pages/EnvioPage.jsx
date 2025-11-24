// src/pages/EnvioPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductoEnvioCard from "../components/envios/ProductoEnvioCard";
import ModalEnvio from "../components/envios/ModalEnvio";

import {
  obtenerEnvios,
  configurarEnvio,
  marcarEntregado,
  descartarEnvio,  // ✨ IMPORTANTE
} from "../api/EnviosAPI";

import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";

export default function EnvioPage() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [direccion, setDireccion] = useState("");
  const [modalProducto, setModalProducto] = useState(null);

  const usuario = JSON.parse(localStorage.getItem("usuarioActual"));

  // 🔥 Cargar envíos reales desde el backend
  useEffect(() => {
    if (!usuario) {
      navigate("/");
      return;
    }

    obtenerEnvios(usuario.nombre)
      .then((res) => setProductos(res.data))
      .catch((err) => console.error("Error cargando envíos:", err));
  }, [navigate]);

  // ================================
  // 1️⃣ Configurar Envío
  // ================================
  const guardarConfiguracionEnvio = async (producto, datos) => {
    try {
      await configurarEnvio(producto.id, {
        nombreCompleto: datos.nombre,
        telefono: datos.telefono,
        direccion: datos.direccion,
        ciudad: datos.ciudad,
        region: datos.region,
      });

      alert("🚚 Envío configurado correctamente.");

      const res = await obtenerEnvios(usuario.nombre);
      setProductos(res.data);

      setModalProducto(null);
      setDireccion("");
    } catch (err) {
      console.error(err);
      alert("Error al configurar envío");
    }
  };

  // ================================
  // 2️⃣ Marcar como entregado
  // ================================
  const entregarProducto = async (producto) => {
    try {
      await marcarEntregado(producto.id);

      alert("📦 Producto marcado como ENTREGADO");

      const res = await obtenerEnvios(usuario.nombre);
      setProductos(res.data);
    } catch (err) {
      console.error(err);
      alert("Error al entregar producto");
    }
  };

  // ================================
  // 3️⃣ Descartar envío (NUEVO)
  // ================================
  const descartarProducto = async (producto) => {
  if (!window.confirm("¿Seguro que quieres descartar este envío?")) return;

  try {
    await descartarEnvio(producto.id);  // 👈 USANDO EL ID REAL DEL ENVÍO

    alert("🗑️ Envío descartado correctamente.");

    const res = await obtenerEnvios(usuario.nombre);
    setProductos(res.data);

  } catch (err) {
    console.error(err);
    alert("Error al descartar envío");
  }
  };


  return (
    <>
      <main className="container mt-5">
        <div className="d-flex justify-content-between mb-3">
          <button
            className="btn btn-outline-primary"
            onClick={() => navigate("/subastas")}
          >
            <i className="fas fa-arrow-left me-2"></i>
            Volver a Subastas
          </button>
        </div>

        {productos.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-box-open fa-3x text-muted mb-3"></i>
            <h5>No hay productos ganados aún.</h5>
            <p>Participa en una subasta para ganar premios.</p>
            <button
              className="btn btn-primary mt-2"
              onClick={() => navigate("/subastas")}
            >
              Ir a Subastas
            </button>
          </div>
        ) : (
          <div className="row">
            {productos.map((producto) => (
              <div className="col-md-4 mb-4" key={producto.id}>
                <ProductoEnvioCard
                  producto={producto}
                  onConfigurarEnvio={setModalProducto}
                  onEntregarProducto={() => entregarProducto(producto)}
                  onDescartarProducto={() => descartarProducto(producto)} // 👈 NUEVO
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal de configuración */}
      {modalProducto && (
        <ModalEnvio
          producto={modalProducto}
          direccion={direccion}
          onDireccionChange={(e) => setDireccion(e.target.value)}
          onCancelar={() => setModalProducto(null)}
          onGuardar={(data) => guardarConfiguracionEnvio(modalProducto, data)}
        />
      )}
    </>
  );
}
