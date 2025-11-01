import React from 'react';
import { render, cleanup, screen, fireEvent, act } from '@testing-library/react';
import PanelCuenta from '../components/subastas/PanelCuenta';

// ---  MOCKS  ---
const mockOnRecargar = jasmine.createSpy('onRecargar');
const mockOnVerEnvios = jasmine.createSpy('onVerEnvios');

// Simulamos la función de formateo de dinero
const mockFormatearDinero = jasmine.createSpy('formatearDinero')
  .and.callFake(monto => `$${monto.toLocaleString('es-CL')}`);

const mockPresupuesto = 5000;
let component;

// --- PRUEBAS ---
describe('PanelCuenta Component (con Jasmine)', () => {
  beforeEach(() => {
    mockOnRecargar.calls.reset();
    mockOnVerEnvios.calls.reset();
    mockFormatearDinero.calls.reset();

    act(() => {
      component = render(
        <PanelCuenta
          presupuesto={mockPresupuesto}
          onRecargar={mockOnRecargar}
          onVerEnvios={mockOnVerEnvios}
          formatearDinero={mockFormatearDinero}
        />
      );
    });
  });

  afterEach(() => {
    cleanup();
    component = null;
  });

  // --- TEST 1 ---
  it('Debe mostrar y ocultar el panel (toggle) al hacer clic en el botón 💲', () => {
    // --- Estado inicial (oculto) ---
    expect(screen.queryByText(/mi cuenta/i)).toBeNull();

    const botonFlotante = screen.getByTitle('Mi Cuenta');
    expect(botonFlotante).toBeTruthy();

    // --- Mostrar panel ---
    act(() => fireEvent.click(botonFlotante));
    expect(screen.getByText(/mi cuenta/i)).toBeTruthy();

    const presupuestoFormateado = mockFormatearDinero(mockPresupuesto);

    // Usamos matcher flexible para evitar fallos por etiquetas o espacios
    const parrafoPresupuesto = screen.getByText(/Presupuesto:/i).closest('p');
    expect(parrafoPresupuesto).toBeTruthy();
    expect(parrafoPresupuesto.textContent).toContain(mockFormatearDinero(mockPresupuesto));


    // --- Ocultar panel ---
    act(() => fireEvent.click(botonFlotante));
    expect(screen.queryByText(/mi cuenta/i)).toBeNull();
  });

  // --- TEST 2 ---
  it('Debe ocultar el panel al hacer clic en el botón de cerrar ✖', () => {
    const botonFlotante = screen.getByTitle('Mi Cuenta');
    act(() => fireEvent.click(botonFlotante));

    expect(screen.getByText(/mi cuenta/i)).toBeTruthy();

    const botonCerrar = screen.getByText('✖');
    expect(botonCerrar).toBeTruthy();

    act(() => fireEvent.click(botonCerrar));
    expect(screen.queryByText(/mi cuenta/i)).toBeNull();
  });

  // --- TEST 3 ---
  it('Debe llamar a las props onRecargar y onVerEnvios', () => {
    const botonFlotante = screen.getByTitle('Mi Cuenta');
    act(() => fireEvent.click(botonFlotante));

    // Usamos función matcher flexible
    const botonRecargar = screen.getByText((t) => t.includes('💸 Recargar'));
    act(() => fireEvent.click(botonRecargar));

    expect(mockOnRecargar).toHaveBeenCalledTimes(1);
    expect(mockOnRecargar).toHaveBeenCalledWith(1000);

    const botonEnvios = screen.getByText((t) => t.includes('📦 Mis Envíos'));
    act(() => fireEvent.click(botonEnvios));

    expect(mockOnVerEnvios).toHaveBeenCalledTimes(1);
  });
});
