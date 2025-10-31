// --- IMPORTS ---
import React from 'react';
import { render, screen, cleanup, act } from '@testing-library/react';
import TablaGanadores from '../components/subastas/TablaGanadores';

// --- MOCKS ---

/**
 * Función helper para generar un array de ganadores mock.
 * @param {number} n - El número de ganadores a generar.
 * @returns {Array<object>}
 */
const generarMockGanadores = (n) => {
  return Array.from({ length: n }, (v, i) => ({
    nombre: `Producto ${i + 1}`,
    usuario: `Ganador ${i + 1}`,
    precio: 100 + i,
    fecha: new Date(2023, 0, i + 1).toISOString(),
  }));
};

// --- PRUEBAS ---
describe('TablaGanadores Component (con Jasmine)', () => {

  // Antes de cada prueba, configuramos el mock de localStorage
  beforeEach(() => {
    // Spy en localStorage.getItem
    spyOn(Storage.prototype, 'getItem').and.returnValue(JSON.stringify([]));
  });

  // Después de cada prueba, limpiamos el DOM renderizado
  afterEach(() => {
    cleanup();
  });

  // --- 3. TEST (Estado Vacío) ---
  it('Debe mostrar una sola fila con el texto “Sin ganadores aún”', async () => {
    await act(async () => {
      render(<TablaGanadores ganadores={[]} />);
    });

    // Buscamos el texto "Sin ganadores aún"
    const filaVacia = screen.getByText('Sin ganadores aún');
    expect(filaVacia).toBeTruthy();

    // Verificamos que tiene el atributo colspan="4"
    expect(filaVacia.getAttribute('colspan')).toBe('4');

    // Verificamos que hay solo 2 filas (header + fila vacía)
    const filasTotales = screen.getAllByRole('row');
    expect(filasTotales.length).toBe(2);
  });

  // --- 4. TEST (Con Ganadores) ---
  it('Debe renderizar exactamente el número de filas que ganadores (pasados por props)', async () => {
    const mockGanadores = generarMockGanadores(5);

    await act(async () => {
      render(<TablaGanadores ganadores={mockGanadores} />);
    });

    // Buscamos todas las filas: 1 header + 5 datos
    const filasTotales = screen.getAllByRole('row');
    expect(filasTotales.length).toBe(6);

    // Verificamos que el texto "Sin ganadores" NO está
    const textoSinGanadores = screen.queryByText('Sin ganadores aún');
    expect(textoSinGanadores).toBeNull();

    // Verificamos que el primer ganador visible es el último del array (reverse)
    const textoTabla = screen.getByRole('table').textContent;
    expect(textoTabla).toContain('Ganador 1');
    expect(textoTabla).toContain('Ganador 5');

  });

  // --- 5. TEST (Límite de 10) ---
  it('Debe renderizar un MÁXIMO de 10 filas aunque se pasen más ganadores', async () => {
    const mockGanadores = generarMockGanadores(12);

    await act(async () => {
      render(<TablaGanadores ganadores={mockGanadores} />);
    });

    // Buscamos todas las filas (1 header + 10 datos)
    const filasTotales = screen.getAllByRole('row');
    expect(filasTotales.length).toBe(11);

    // Verificamos que el primer ganador mostrado es "Ganador 12"
    const tablaTexto = screen.getByRole('table').textContent;
    expect(tablaTexto).toContain('Ganador 12');

    // Verificamos que "Ganador 1" y "Ganador 2" no aparecen
    expect(tablaTexto.includes('Ganador 1')).toBeFalse();
    expect(tablaTexto.includes('Ganador 2')).toBeFalse();
  });

  // --- 6. TEST (Fallback a localStorage) ---
  it('Debe usar localStorage si las props de "ganadores" están vacías', async () => {
    const mockGanadoresStorage = generarMockGanadores(3);

    // Sobrescribimos el spy de localStorage
    Storage.prototype.getItem.and.returnValue(JSON.stringify(mockGanadoresStorage));

    await act(async () => {
      render(<TablaGanadores ganadores={[]} />);
    });

    // Esperamos 4 filas (1 header + 3 de localStorage)
    const filasTotales = screen.getAllByRole('row');
    expect(filasTotales.length).toBe(4);

    // Verificamos que el contenido incluye los mocks
    const texto = screen.getByRole('table').textContent;
    expect(texto.includes('Ganador 3')).toBeTrue();
  });
});
