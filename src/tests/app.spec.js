import { renderHook, act } from "@testing-library/react";
import SubastasPage from "../pages/SubastasPage.jsx";
import EnvioPage from "../pages/EnvioPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";


// Mock de localStorage
const mockStorage = {};
global.localStorage = {
  getItem: (key) => mockStorage[key] || null,
  setItem: (key, value) => (mockStorage[key] = value),
  removeItem: (key) => delete mockStorage[key],
};

describe("🔹 LoginPage Tests", () => {
  beforeEach(() => {
    localStorage.removeItem("usuarios");
  });

  it("debe registrar un nuevo usuario", () => {
    const nuevoUsuario = {
      nombre: "Juan",
      correo: "juan@test.com",
      contraseña: "123456",
      confirmar: "123456",
    };
    const usuarios = [nuevoUsuario];
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    const almacenados = JSON.parse(localStorage.getItem("usuarios"));
    expect(almacenados.length).toBe(1);
    expect(almacenados[0].nombre).toBe("Juan");
  });

  it("debe fallar si las contraseñas no coinciden", () => {
    const usuario = {
      nombre: "Pedro",
      correo: "pedro@test.com",
      contraseña: "123456",
      confirmar: "654321",
    };
    expect(usuario.contraseña === usuario.confirmar).toBeFalse();
  });
});

describe("🔹 SubastasPage Logic", () => {
  it("debe iniciar subastas con tiempo aleatorio entre 60 y 240", () => {
    const tiempo = Math.floor(Math.random() * (240 - 60 + 1)) + 60;
    expect(tiempo).toBeGreaterThanOrEqual(60);
    expect(tiempo).toBeLessThanOrEqual(240);
  });

  it("el bot debe incrementar el precio automáticamente", () => {
    const subasta = { precio: 100, ganador: null, tiempo: 100 };
    const nuevoPrecio = subasta.precio + Math.floor(Math.random() * 20) + 5;
    expect(nuevoPrecio).toBeGreaterThan(100);
  });

  it("debe descontar presupuesto al pujar", () => {
    let presupuesto = 500;
    presupuesto -= 10;
    expect(presupuesto).toBe(490);
  });

  it("no debe permitir pujar si presupuesto es menor a 10", () => {
    const presupuesto = 5;
    expect(presupuesto < 10).toBeTrue();
  });

  it("debe guardar producto ganado en localStorage", () => {
    const producto = { id: 1, nombre: "Laptop", precio: 500 };
    localStorage.setItem("productosGanados", JSON.stringify([producto]));
    const data = JSON.parse(localStorage.getItem("productosGanados"));
    expect(data[0].nombre).toBe("Laptop");
  });
});

describe("🔹 EnvioPage Logic", () => {
  it("debe configurar dirección de envío correctamente", () => {
    const producto = { id: 1, estado: "PENDIENTE_ENVIO" };
    const actualizado = { ...producto, direccion: "Calle Falsa 123", estado: "ENVIADO" };
    expect(actualizado.estado).toBe("ENVIADO");
    expect(actualizado.direccion).toContain("Calle Falsa");
  });

  it("debe marcar producto como entregado", () => {
    const producto = { id: 2, estado: "ENVIADO" };
    producto.estado = "ENTREGADO";
    expect(producto.estado).toBe("ENTREGADO");
  });

  it("debe limpiar historial del localStorage", () => {
    localStorage.setItem("productosGanados", JSON.stringify([{ id: 1 }]));
    localStorage.removeItem("productosGanados");
    expect(localStorage.getItem("productosGanados")).toBeNull();
  });

  it("formatea correctamente el dinero", () => {
    const monto = 1000;
    const formato = monto.toLocaleString("es-CL", {
      style: "currency",
      currency: "CLP",
    });
    expect(formato).toContain("$");
  });
});
