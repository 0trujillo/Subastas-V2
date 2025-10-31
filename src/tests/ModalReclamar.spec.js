import React from 'react';
import { render, cleanup, fireEvent, screen, act } from '@testing-library/react';
import ModalReclamar from '../components/subastas/ModalReclamar';

// --- MOCKS ---
const mockProducto = { 
  id: 10, 
  nombre: "PlayStation 5", 
  precio: 500, 
  imagen: "play5.jpg" 
};

// "Spies" de Jasmine para simular las funciones de las props
const mockOnCerrar = jasmine.createSpy('onCerrar');
const mockOnReclamar = jasmine.createSpy('onReclamar');

// --- VARIABLES DE PRUEBA ---
let component;

// --- PRUEBAS ---
describe('ModalReclamar Component (con Jasmine)', () => {

  // Antes de cada prueba, renderizamos el componente con sus props
  // historial de los spies limpios.
  beforeEach(() => {
    mockOnCerrar.calls.reset();
    mockOnReclamar.calls.reset();

    act(() => {
      component = render(
        <ModalReclamar
          producto={mockProducto}
          onCerrar={mockOnCerrar}
          onReclamar={mockOnReclamar}
        />
      );
    });
  });

  afterEach(() => {
    cleanup();
    component = null;
  });

  // --- TESTS ---
  it('Debe mostrar el mensaje de "Procesando" y cambiar el texto del botón al hacer clic', async () => {
    // --- ESTADO INICIAL ---
    // Verificamos que el botón de reclamo está normal
    const botonReclamar = screen.getByText('Reclamar Producto');
    expect(botonReclamar).toBeTruthy();
    
    // Verificamos que no hay ningún mensaje de alerta
    const alerta = screen.queryByRole('alert');
    expect(alerta).toBeNull();

    // --- ACCIÓN ---
    // Simulamos el clic del usuario dentro de act()
    await act(async () => {
      fireEvent.click(botonReclamar);
    });

    // --- ESTADO 1 (Inmediato) ---
    // Test 1: "Debe mostrar el mensaje... inmediatamente"
    const mensajeProcesando = screen.getByText('⏳ Procesando reclamo...');
    expect(mensajeProcesando).toBeTruthy();

    // Test 2: "Debe cambiar el texto del botón..."
    const botonReclamando = screen.getByText('Reclamando...');
    expect(botonReclamando).toBeTruthy();

    // Verificamos también que los botones están deshabilitados
    expect(botonReclamando.disabled).toBeTrue();
    const botonCancelar = screen.getByText('Cancelar');
    expect(botonCancelar.disabled).toBeTrue();
  });

  // --- 4. TEST ADICIONAL (Comportamiento asíncrono) ---
  it('Debe llamar a onReclamar y onCerrar después de los timeouts', () => {
    // 1. Instalamos el reloj falso de Jasmine
    jasmine.clock().install();

    const botonReclamar = screen.getByText('Reclamar Producto');

    // 2. Hacemos clic en el botón dentro de act()
    act(() => {
      fireEvent.click(botonReclamar);
    });

    // 3. Verificamos que las funciones *no* han sido llamadas aún
    expect(mockOnReclamar).not.toHaveBeenCalled();
    expect(mockOnCerrar).not.toHaveBeenCalled();

    // 4. Adelantamos el reloj 600ms (para el primer timeout)
    act(() => {
      jasmine.clock().tick(600);
    });

    // 5. Verificamos que 'onReclamar' fue llamada
    expect(mockOnReclamar).toHaveBeenCalledTimes(1);
    
    // 6. Verificamos que el mensaje de éxito se muestra
    const mensajeExito = screen.getByText('✅ Producto reclamado exitosamente.');
    expect(mensajeExito).toBeTruthy();

    // 7. 'onCerrar' aún no debe ser llamada
    expect(mockOnCerrar).not.toHaveBeenCalled();

    // 8. Adelantamos el reloj 1000ms más (para el segundo timeout)
    act(() => {
      jasmine.clock().tick(1000);
    });

    // 9. Verificamos que 'onCerrar' finalmente fue llamada
    expect(mockOnCerrar).toHaveBeenCalledTimes(1);

    // 10. Desinstalamos el reloj al final de la prueba
    jasmine.clock().uninstall();
  });
});
