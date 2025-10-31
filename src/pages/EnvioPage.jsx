// src/pages/EnvioPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductoEnvioCard from "../components/envios/ProductoEnvioCard";
import ModalEnvio from "../components/envios/ModalEnvio";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";

export default function EnvioPage() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [direccion, setDireccion] = useState("");
  const [modalProducto, setModalProducto] = useState(null);

  useEffect(() => {
    const lista = JSON.parse(localStorage.getItem("productosGanados")) || [];
    setProductos(lista);
  }, []);

  const configurarEnvio = (producto) => {
    if (!direccion.trim()) return alert("⚠️ Ingresa una dirección de envío.");

    const actualizados = productos.map((p) =>
      p.id === producto.id
        ? { ...p, direccion, estado: "ENVIADO", fechaEnvio: new Date().toISOString() }
        : p
    );

    setProductos(actualizados);
    localStorage.setItem("productosGanados", JSON.stringify(actualizados));
    alert("🚚 Envío configurado correctamente.");
    setDireccion("");
    setModalProducto(null);
  };

  const entregarProducto = (producto) => {
    const actualizados = productos.map((p) =>
      p.id === producto.id ? { ...p, estado: "ENTREGADO" } : p
    );
    setProductos(actualizados);
    localStorage.setItem("productosGanados", JSON.stringify(actualizados));
    alert("📦 Producto entregado con éxito.");
  };

  const limpiarHistorial = () => {
    if (window.confirm("¿Seguro que deseas borrar el historial de envíos?")) {
      localStorage.removeItem("productosGanados");
      setProductos([]);
    }
  };

  return (
    <>
    

      <main className="container mt-5">
        <div className="d-flex justify-content-between mb-3">
          <button className="btn btn-outline-primary" onClick={() => navigate("/subastas")}>
            <i className="fas fa-arrow-left me-2"></i>Volver a Subastas
          </button>
          <button className="btn btn-outline-danger" onClick={limpiarHistorial}>
            <i className="fas fa-trash me-2"></i>Limpiar historial
          </button>
        </div>

        {productos.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-box-open fa-3x text-muted mb-3"></i>
            <h5>No hay productos ganados aún.</h5>
            <p>Participa en una subasta para ganar premios.</p>
            <button className="btn btn-primary mt-2" onClick={() => navigate("/subastas")}>
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
                  onEntregarProducto={entregarProducto}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {modalProducto && (
        <ModalEnvio
          producto={modalProducto}
          direccion={direccion}
          onDireccionChange={(e) => setDireccion(e.target.value)}
          onCancelar={() => setModalProducto(null)}
          onGuardar={() => configurarEnvio(modalProducto)}
        />
      )}

    
    </>
  );
}
