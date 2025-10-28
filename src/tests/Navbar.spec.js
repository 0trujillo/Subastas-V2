import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

describe("Navbar", () => {
  const mockNavigate = jasmine.createSpy("navigate");

  beforeEach(() => {
    localStorage.clear();
    mockNavigate.calls.reset();
  });

  it("muestra logo e iniciar sesión si no hay usuario", () => {
    render(
      <MemoryRouter>
        <Navbar navigate={mockNavigate} />
      </MemoryRouter>
    );

    expect(screen.getByText(/Subastas Online/i)).toBeDefined();
    expect(screen.getByText(/Iniciar Sesión/i)).toBeDefined();
  });

  it("muestra nombre del usuario cuando hay sesión iniciada", () => {
    localStorage.setItem("usuarioActual", JSON.stringify({ nombre: "Diony" }));

    render(
      <MemoryRouter>
        <Navbar navigate={mockNavigate} />
      </MemoryRouter>
    );

    expect(screen.getByText(/Diony/i)).toBeDefined();
  });

  it("cierra sesión correctamente", () => {
    spyOn(window, "confirm").and.returnValue(true);
    localStorage.setItem("usuarioActual", JSON.stringify({ nombre: "Diony" }));

    render(
      <MemoryRouter>
        <Navbar navigate={mockNavigate} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Cerrar sesión/i));
    expect(localStorage.getItem("usuarioActual")).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
