import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ModalEnvio from "../components/envios/ModalEnvio";

const producto = { nombre: "Celular", imagen: "img.jpg" };

describe("ModalEnvio", () => {

  it("debería mostrar el nombre del producto en el modal", () => {
    render(
      <ModalEnvio
        producto={producto}
        direccion=""
        onDireccionChange={() => {}}
        onCancelar={() => {}}
        onGuardar={() => {}}
      />
    );
    const texto = screen.getByText("Celular");
    expect(texto).not.toBeNull();
  });

  it("debería permitir escribir una dirección", () => {
    const mockChange = jasmine.createSpy("onDireccionChange");

    render(
      <ModalEnvio
        producto={producto}
        direccion=""
        onDireccionChange={mockChange}
        onCancelar={() => {}}
        onGuardar={() => {}}
      />
    );

    const input = screen.getByPlaceholderText(/Calle Falsa/i);
    fireEvent.change(input, { target: { value: "Calle Real 456" } });

    expect(mockChange).toHaveBeenCalled();
  });

  it("debería ejecutar la función Guardar al hacer clic", () => {
    const mockGuardar = jasmine.createSpy("onGuardar");

    render(
      <ModalEnvio
        producto={producto}
        direccion="Calle"
        onDireccionChange={() => {}}
        onCancelar={() => {}}
        onGuardar={mockGuardar}
      />
    );

    const boton = screen.getByText(/Guardar Envío/i);
    fireEvent.click(boton);

    expect(mockGuardar).toHaveBeenCalled();
  });

});
