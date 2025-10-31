import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProductoCard from "../components/subastas/ProductoCard";

describe("ProductoCard", () => {

  it("debería mostrar el nombre y el precio del producto", () => {
    const subasta = { id: 1, nombre: "Laptop Gamer", precio: 1000, tiempo: 50, imagen: "" };

    render(<ProductoCard subasta={subasta} onPujar={() => {}} />);

    const nombre = screen.getByText("Laptop Gamer");
    const precio = screen.getByText(/Precio actual/i);

    // Jasmine usa matchers más básicos
    expect(nombre).not.toBeNull();
    expect(precio).not.toBeNull();
  });

  it("debería llamar a onPujar al hacer clic en el botón", () => {
    const subasta = { id: 1, nombre: "Laptop Gamer", precio: 1000, tiempo: 50, imagen: "" };
    const mockPujar = jasmine.createSpy("onPujar");

    render(<ProductoCard subasta={subasta} onPujar={mockPujar} />);

    const boton = screen.getByText("Pujar");
    fireEvent.click(boton);

    expect(mockPujar).toHaveBeenCalled();
    expect(mockPujar.calls.count()).toBe(1); // ✅ validación exacta del número de llamadas
  });

});
