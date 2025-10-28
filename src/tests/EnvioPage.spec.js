import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import EnvioPage from "../pages/EnvioPage";

describe("EnvioPage", () => {

  beforeEach(() => {
    // Limpia el estado antes de cada test
    localStorage.removeItem("productosGanados");
  });

  it("debería mostrar mensaje cuando no hay productos", () => {
    // Renderiza el componente dentro del router
    render(
      <MemoryRouter>
        <EnvioPage />
      </MemoryRouter>
    );

    // Verifica que el texto esté presente
    const mensaje = screen.getByText(/No hay productos ganados aún/i);
    expect(mensaje).not.toBeNull();
  });

});
