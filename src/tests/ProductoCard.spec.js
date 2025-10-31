// --- IMPORTS ---
import React from 'react';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import ProductoCard from '../components/subastas/ProductoCard';

// --- MOCKS ---
const mockOnPujar = jasmine.createSpy('onPujar');

// Mock para una subasta activa
const mockSubastaActiva = {
  id: 1,
  nombre: "Subasta Activa",
  precio: 100,
  tiempo: 60,
  imagen: "activa.jpg"
};

// Mock para una subasta finalizada
const mockSubastaFinalizada = {
  id: 2,
  nombre: "Subasta Finalizada",
  precio: 200,
  tiempo: 0,
  imagen: "finalizada.jpg"
};

// --- PRUEBAS ---
describe('ProductoCard Component (con Jasmine puro)', () => {

  // Antes de cada test limpiamos los mocks y renderizamos de nuevo
  beforeEach(() => {
    mockOnPujar.calls.reset();
  });

  // Después de cada test, limpiamos el DOM
  afterEach(() => {
    cleanup();
  });

  // --- TEST 1 ---
  it('Debe habilitar el botón si subasta.tiempo > 0', async () => {
    await act(async () => {
      render(<ProductoCard subasta={mockSubastaActiva} onPujar={mockOnPujar} />);
    });

    // Buscamos el botón (por texto o rol si lo tiene)
    const boton = screen.getByRole('button');

    // Verificamos que el botón exista y esté habilitado
    expect(boton).toBeTruthy();
    expect(boton.disabled).toBeFalse();

    // Simulamos clic dentro de act()
    await act(async () => {
      fireEvent.click(boton);
    });

    // Verificamos que la función mock fue llamada correctamente
    expect(mockOnPujar).toHaveBeenCalledTimes(1);
    expect(mockOnPujar).toHaveBeenCalledWith(mockSubastaActiva);
  });

  // --- TEST 2 ---
  it('Debe deshabilitar el botón si subasta.tiempo <= 0', async () => {
    await act(async () => {
      render(<ProductoCard subasta={mockSubastaFinalizada} onPujar={mockOnPujar} />);
    });

    const boton = screen.getByRole('button');
    expect(boton).toBeTruthy();
    expect(boton.disabled).toBeTrue();

    // Intentamos hacer clic (no debe ejecutar nada)
    await act(async () => {
      fireEvent.click(boton);
    });

    // Verificamos que la función mock NO fue llamada
    expect(mockOnPujar).not.toHaveBeenCalled();
  });
});
