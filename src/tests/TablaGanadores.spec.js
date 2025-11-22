import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import TablaGanadores from '../components/subastas/TablaGanadores';

// --- MOCK: localStorage ---
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: jasmine.createSpy('getItem').and.callFake((key) => store[key] || null),
    setItem: jasmine.createSpy('setItem').and.callFake((key, value) => (store[key] = String(value))),
    removeItem: jasmine.createSpy('removeItem').and.callFake((key) => delete store[key]),
    clear: jasmine.createSpy('clear').and.callFake(() => (store = {})),
  };
})();
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// --- DATOS DE PRUEBA ---
const ganadoresEjemplo = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  usuario: `Usuario ${i + 1}`,
  nombre: `Producto ${i + 1}`, // ← antes era "producto"
  precio: 1000 + i * 100,      // ← antes era "monto"
}));

// --- TESTS ---
describe('TablaGanadores Component (con Jasmine)', () => {
  afterEach(() => {
    cleanup();
    window.localStorage.clear();
    window.localStorage.getItem.calls.reset();
    window.localStorage.setItem.calls.reset();
  });

  // --- 1 ---
  it('Debe renderizar exactamente el número de filas que ganadores (pasados por props)', () => {
    render(<TablaGanadores ganadores={ganadoresEjemplo.slice(0, 3)} />);
    const filas = screen.getAllByRole('row');
    expect(filas.length).toBe(4); // +1 encabezado
  });

  // --- 2 ---
  it('Debe mostrar una sola fila con el texto “Sin ganadores aún” si no hay datos', () => {
    window.localStorage.getItem.and.returnValue(null); // fuerza sin datos
    render(<TablaGanadores ganadores={[]} />);
    expect(screen.getByText(/Sin ganadores aún/i)).toBeTruthy();
  });

  // --- 3 ---
  it('Debe usar localStorage si las props de "ganadores" están vacías', () => {
    const ganadoresGuardados = [{ usuario: 'Pedro', nombre: 'TV', precio: 2000 }];
    window.localStorage.getItem.and.returnValue(JSON.stringify(ganadoresGuardados));

    render(<TablaGanadores ganadores={[]} />);

    expect(window.localStorage.getItem).toHaveBeenCalledWith('ganadores');
    expect(screen.getByText('Pedro')).toBeTruthy();
    expect(screen.getByText('TV')).toBeTruthy();
  });

  // --- 4 ---
  it('Debe renderizar un MÁXIMO de 10 filas aunque se pasen más ganadores', () => {
    render(<TablaGanadores ganadores={ganadoresEjemplo} />);
    const filas = screen.getAllByRole('row');
    expect(filas.length).toBe(11); // 1 encabezado + 10 ganadores
  });
});
