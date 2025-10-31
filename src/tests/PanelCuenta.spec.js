import React from 'react';
import { render, cleanup, screen, fireEvent, act } from '@testing-library/react';
import PanelCuenta from '../components/subastas/PanelCuenta';

// ---  MOCKS  ---

const mockOnRecargar = jasmine.createSpy('onRecargar');
const mockOnVerEnvios = jasmine.createSpy('onVerEnvios');

// Para 'formatearDinero', le decimos que "finja" (callFake)
// la lógica para que devuelva un string.
const mockFormatearDinero = jasmine.createSpy('formatearDinero')
  .and.callFake(monto => `$${monto.toLocaleString('es-CL')}`);

const mockPresupuesto = 5000;

let component; // referencia al render del componente

// --- PRUEBAS ---
describe('PanelCuenta Component (con Jasmine)', () => {

  // Antes de cada prueba ('it'), renderizamos el componente con las props mockeadas
  // y limpiamos el historial de llamadas de nuestros spies.
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

  // --- TESTS 1 ---
  it('Debe mostrar y ocultar el panel (toggle) al hacer clic en el botón 💲', () => {
    
    // --- ESTADO INICIAL (Oculto) ---
    // Usamos queryByText porque esperamos que NO encuentre el elemento.
    expect(screen.queryByText('👤 Mi Cuenta')).toBeNull();

    // Encontramos el botón flotante por su 'title' (un buen selector)
    const botonFlotante = screen.getByTitle('Mi Cuenta');
    expect(botonFlotante).toBeTruthy(); // Verificamos que el botón 💲 SÍ existe

    // --- PRIMER CLIC (Mostrar) ---
    act(() => {
      fireEvent.click(botonFlotante);
    });

    // --- ESTADO 2 (Visible) ---
    const panel = screen.getByText('👤 Mi Cuenta');
    expect(panel).toBeTruthy();

    // Verificamos que usa las props como 'presupuesto'
    const presupuestoFormateado = mockFormatearDinero(mockPresupuesto);
    expect(screen.getByText(`Presupuesto: ${presupuestoFormateado}`)).toBeTruthy();

    // --- SEGUNDO CLIC (Ocultar) ---
    act(() => {
      fireEvent.click(botonFlotante);
    });

    // --- ESTADO 3 (Oculto de nuevo) ---
    expect(screen.queryByText('👤 Mi Cuenta')).toBeNull();
  });

  // --- 4. TEST X ---
  it('Debe ocultar el panel al hacer clic en el botón de cerrar ✖', () => {
    
    // 1. Mostramos el panel primero
    const botonFlotante = screen.getByTitle('Mi Cuenta');
    act(() => {
      fireEvent.click(botonFlotante);
    });
    expect(screen.getByText('👤 Mi Cuenta')).toBeTruthy(); // Verificamos que está visible

    // 2. Encontramos y hacemos clic en el botón de cerrar (✖)
    const botonCerrar = screen.getByText('✖');
    expect(botonCerrar).toBeTruthy();

    act(() => {
      fireEvent.click(botonCerrar);
    });

    // 3. Verificamos que el panel se ocultó
    expect(screen.queryByText('👤 Mi Cuenta')).toBeNull();
  });

  // --- 5. TEST FUNCIONALIDAD ---
  it('Debe llamar a las props onRecargar y onVerEnvios', () => {
    // 1. Mostramos el panel
    const botonFlotante = screen.getByTitle('Mi Cuenta');
    act(() => {
      fireEvent.click(botonFlotante);
    });

    // 2. Hacemos clic en "Recargar"
    const botonRecargar = screen.getByText('💸 Recargar');
    act(() => {
      fireEvent.click(botonRecargar);
    });

    // 3. Verificamos que el spy 'onRecargar' fue llamado (Jasmine)
    expect(mockOnRecargar).toHaveBeenCalledTimes(1);
    expect(mockOnRecargar).toHaveBeenCalledWith(1000); // Con el monto correcto

    // 4. Hacemos clic en "Mis Envíos"
    const botonEnvios = screen.getByText('📦 Mis Envíos');
    act(() => {
      fireEvent.click(botonEnvios);
    });

    // 5. Verificamos que el spy 'onVerEnvios' fue llamado (Jasmine)
    expect(mockOnVerEnvios).toHaveBeenCalledTimes(1);
  });
});
