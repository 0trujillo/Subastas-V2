// --- IMPORTS ---
import React from 'react';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import ListaSubastas from '../components/subastas/ListaSubastas.jsx';

// --- MOCKS ---
const mockSubastas = [
  { 
    id: 1, 
    nombre: "Laptop Gamer", 
    precio: 100, 
    tiempo: 60, 
    imagen: "laptop.jpg",
    ganador: "usuario"
  },
  { 
    id: 2, 
    nombre: "Smartphone", 
    precio: 250, 
    tiempo: 70, 
    imagen: "celular.webp",
    ganador: "User123"
  },
];

// Creamos una "función mock" para espiar si la prop `onPujar` es llamada.
const mockOnPujar = jasmine.createSpy('onPujar');

// --- PRUEBAS ---
// Agrupamos nuestras pruebas para este componente
describe('ListaSubastas Component', function() {

  // Antes de cada prueba, limpiamos los mocks y renderizamos el componente
  beforeEach(function() {
    // Limpia las llamadas anteriores del mock
    mockOnPujar.calls.reset();

    // Renderiza el componente con @testing-library/react
    render(<ListaSubastas subastas={mockSubastas} onPujar={mockOnPujar} />);
  });

  afterEach(function() {
    // Limpia el DOM entre pruebas
    cleanup();
  });

  // --- TEST 1 ---
  it('Debe mostrar el nombre, precio e imagen correctamente por cada subasta', function() {

    // Prueba para la Subasta 1 (Laptop)
    const subasta1 = mockSubastas[0];

    const nombre1 = screen.getByText(subasta1.nombre);
    expect(nombre1).not.toBeNull();

    const precio1 = screen.getByText(`$${subasta1.precio}`);
    expect(precio1).not.toBeNull();

    const img1 = screen.getByAltText(subasta1.nombre);
    expect(img1).not.toBeNull();
    expect(img1.getAttribute('src')).toBe(subasta1.imagen);

    // Prueba para la Subasta 2 (Smartphone)
    const subasta2 = mockSubastas[1];

    const nombre2 = screen.getByText(subasta2.nombre);
    expect(nombre2).not.toBeNull();

    const precio2 = screen.getByText(`$${subasta2.precio}`);
    expect(precio2).not.toBeNull();

    const img2 = screen.getByAltText(subasta2.nombre);
    expect(img2).not.toBeNull();
    expect(img2.getAttribute('src')).toBe(subasta2.imagen);
  });

  // --- TEST 2 ---
  it('Debe llamar a la función onPujar con los datos correctos al hacer clic', function() {
    const botones = screen.getAllByRole('button');
    expect(botones.length).toBeGreaterThan(0);

    // Simula clic en el primer botón
    act(() => {
      fireEvent.click(botones[0]);
    });
    expect(mockOnPujar).toHaveBeenCalledTimes(1);
    expect(mockOnPujar).toHaveBeenCalledWith(mockSubastas[0]);

    // Simula clic en el segundo botón
    act(() => {
      fireEvent.click(botones[1]);
    });
    expect(mockOnPujar).toHaveBeenCalledTimes(2);
    expect(mockOnPujar).toHaveBeenCalledWith(mockSubastas[1]);
  });

  // --- TEST 3 ---
  it('Debe mostrar el estado correcto del ganador', function() {
    // Para la subasta 1, el ganador es "usuario"
    const ganador1 = screen.getByText(/🏆 Vas ganando/i);
    expect(ganador1).not.toBeNull();

    // Para la subasta 2, el ganador es "User123"
    const ganador2 = screen.getByText(/👤 User123 va ganando/i);
    expect(ganador2).not.toBeNull();
  });
});
