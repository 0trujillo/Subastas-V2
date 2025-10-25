import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";

export default function EnvioPage() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [direccion, setDireccion] = useState("");
  const [modalProducto, setModalProducto] = useState(null);

  // 🔹 Cargar productos ganados desde localStorage
  useEffect(() => {
    const lista = JSON.parse(localStorage.getItem("productosGanados")) || [];
    setProductos(lista);
  }, []);

  // 🔹 Formatear dinero
  const formatearDinero = (monto) =>
    monto.toLocaleString("es-CL", { style: "currency", currency: "CLP" });

  // 🔹 Configurar envío
  const configurarEnvio = (producto) => {
    if (!direccion.trim()) {
      alert("⚠️ Por favor ingresa una dirección de envío.");
      return;
    }

    const actualizados = productos.map((p) =>
      p.id === producto.id
        ? {
            ...p,
            direccion,
            estado: "ENVIADO",
            fechaEnvio: new Date().toISOString(),
          }
        : p
    );

    setProductos(actualizados);
    localStorage.setItem("productosGanados", JSON.stringify(actualizados));
    alert("🚚 Envío configurado correctamente.");
    setDireccion("");
    setModalProducto(null);
  };

  // 🔹 Simular entrega del producto
  const entregarProducto = (producto) => {
    const actualizados = productos.map((p) =>
      p.id === producto.id ? { ...p, estado: "ENTREGADO" } : p
    );
    setProductos(actualizados);
    localStorage.setItem("productosGanados", JSON.stringify(actualizados));
    alert("📦 Producto entregado con éxito.");
  };

  // 🔹 Limpiar historial
  const limpiarHistorial = () => {
    if (window.confirm("¿Seguro que deseas borrar el historial de envíos?")) {
      localStorage.removeItem("productosGanados");
      setProductos([]);
    }
  };

  return (
    <>


      {/* 🔹 Contenido principal */}
      <main className="container mt-5">
        <div className="d-flex justify-content-between mb-3">
          <button
            className="btn btn-outline-primary"
            onClick={() => navigate("/subastas")}
          >
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
                <div className="card shadow-sm h-100">
                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    className="card-img-top"
                    style={{ height: "220px", objectFit: "cover" }}
                  />
                  <div className="card-body text-center">
                    <h5>{producto.nombre}</h5>
                    <p className="text-muted mb-1">
                      Precio ganado:{" "}
                      <strong>{formatearDinero(producto.precio)}</strong>
                    </p>

                    <p>
                      Estado:{" "}
                      <span
                        className={`badge ${
                          producto.estado === "PENDIENTE_ENVIO"
                            ? "bg-warning text-dark"
                            : producto.estado === "ENVIADO"
                            ? "bg-info text-dark"
                            : "bg-success"
                        }`}
                      >
                        {producto.estado}
                      </span>
                    </p>

                    {producto.estado === "PENDIENTE_ENVIO" && (
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => setModalProducto(producto)}
                      >
                        <i className="fas fa-map-marker-alt me-2"></i>Configurar Envío
                      </button>
                    )}

                    {producto.estado === "ENVIADO" && (
                      <button
                        className="btn btn-outline-success btn-sm"
                        onClick={() => entregarProducto(producto)}
                      >
                        <i className="fas fa-check me-2"></i>Confirmar Entrega
                      </button>
                    )}
                  </div>

                  <div className="card-footer text-center text-muted small">
                    {producto.fechaGanada && (
                      <div>
                        Ganado el:{" "}
                        {new Date(producto.fechaGanada).toLocaleDateString("es-CL")}
                      </div>
                    )}
                    {producto.fechaEnvio && (
                      <div>
                        Enviado el:{" "}
                        {new Date(producto.fechaEnvio).toLocaleDateString("es-CL")}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>



      {/* 🔹 Modal configuración envío */}
      {modalProducto && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  <i className="fas fa-shipping-fast me-2"></i>
                  Configurar Envío
                </h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={() => setModalProducto(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="text-center mb-3">
                  <img
                    src={modalProducto.imagen}
                    alt={modalProducto.nombre}
                    className="img-fluid rounded"
                    style={{ maxHeight: "200px" }}
                  />
                  <h6 className="mt-2">{modalProducto.nombre}</h6>
                  <p className="text-muted">
                    Precio: {formatearDinero(modalProducto.precio)}
                  </p>
                </div>
                <label className="form-label">Dirección de envío:</label>
                <input
                  type="text"
                  className="form-control"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  placeholder="Ej: Calle Falsa 123, Santiago"
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setModalProducto(null)}
                >
                  Cancelar
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => configurarEnvio(modalProducto)}
                >
                  <i className="fas fa-paper-plane me-2"></i>Guardar Envío
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
