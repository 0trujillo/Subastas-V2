import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LoginPage from "../pages/LoginPage";

describe("LoginPage", () => {

  it("debería renderizar el formulario de login", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const titulo = screen.getByText(/Iniciar Sesión/i);
    expect(titulo).not.toBeNull();
  });

  it("debería permitir cambiar al formulario de registro", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const botonRegistro = screen.getByText(/Crear cuenta nueva/i);
    fireEvent.click(botonRegistro);

    const tituloRegistro = screen.getByText(/Crear Cuenta/i);
    expect(tituloRegistro).not.toBeNull();
  });

});
