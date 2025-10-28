import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SubastasPage from "../pages/SubastasPage";

describe("SubastasPage", () => {

  it("debería mostrar el título 'Subastas Activas'", () => {
    render(
      <MemoryRouter>
        <SubastasPage />
      </MemoryRouter>
    );

    const titulo = screen.getByText(/Subastas Activas/i);
    expect(titulo).not.toBeNull(); //  Jasmine puro
  });

  it("debería mostrar el presupuesto inicial", () => {
    render(
      <MemoryRouter>
        <SubastasPage />
      </MemoryRouter>
    );

    const presupuesto = screen.getByText(/Presupuesto/i);
    expect(presupuesto).not.toBeNull(); //  Jasmine puro
  });

});
