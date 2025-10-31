// --- IMPORTS ---
import React from 'react';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import ProductoEnvioCard from '../components/envios/ProductoEnvioCard';

// --- MOCKS ---

// Spies de Jasmine para simular las funciones
const mockOnConfigurarEnvio = jasmine.createSpy('onConfigurarEnvio');
const mockOnEntregarProducto = jasmine.createSpy('onEntregarProducto');

// Mocks para los diferentes estados del producto
const mockProductoPendiente = {
  id: 1,
  nombre: "Laptop Pendiente",
  precio: 500,
  imagen: "laptop.jpg",
  estado: "PENDIENTE_ENVIO"
};

const mockProductoEnviado = {
  id: 2,
  nombre: "Celular Enviado",
  precio: 300,
  imagen: "celular.jpg",
  estado: "ENVIADO"
};

const mockProductoEntregado = {
  id: 3,
  nombre: "Auri Entregados",
  precio: 100,
  imagen: "auri.jpg",
  estado: "ENTREGADO" // Estado final
};

// --- 2. SUITE DE PRUEBAS ---
describe('ProductoEnvioCard Component (con Jasmine)', () => {

  // Antes de cada prueba, limpiamos el historial de los spies
  beforeEach(() => {
    mockOnConfigurarEnvio.calls.reset();
    mockOnEntregarProducto.calls.reset();
  });

  // Después de cada test, limpiamos el DOM renderizado
  afterEach(() => {
    cleanup();
  });

  // --- 3. TEST (Estado PENDIENTE_ENVIO) ---
  it('Debe mostrar "Configurar Envío" si el estado es PENDIENTE_ENVIO', async () => {
    // 1. Renderizamos el componente dentro de act()
    await act(async () => {
      render(
        <ProductoEnvioCard
          producto={mockProductoPendiente}
          onConfigurarEnvio={mockOnConfigurarEnvio}
          onEntregarProducto={mockOnEntregarProducto}
        />
      );
    });

    // 2. Verificamos que los datos básicos (nombre, precio, estado) están
    expect(screen.getByText('Laptop Pendiente')).toBeTruthy();
    expect(screen.getByText('$500')).toBeTruthy();
    expect(screen.getByText('PENDIENTE_ENVIO')).toBeTruthy();

    // 3. Buscamos el botón "Configurar Envío"
    const botonConfigurar = screen.getByText('Configurar Envío');
    expect(botonConfigurar).toBeTruthy();

    // 4. Verificamos que el *otro* botón NO existe
    const botonEntregar = screen.queryByText('Confirmar Entrega');
    expect(botonEntregar).toBeNull();

    // 5. Simulamos clic dentro de act() y verificamos que se llamó al spy correcto
    await act(async () => {
      fireEvent.click(botonConfigurar);
    });

    expect(mockOnConfigurarEnvio).toHaveBeenCalledTimes(1);
    expect(mockOnConfigurarEnvio).toHaveBeenCalledWith(mockProductoPendiente);
    expect(mockOnEntregarProducto).not.toHaveBeenCalled();
  });

  // --- 4. TEST (Estado ENVIADO) ---
  it('Debe mostrar "Confirmar Entrega" si el estado es ENVIADO', async () => {
    await act(async () => {
      render(
        <ProductoEnvioCard
          producto={mockProductoEnviado}
          onConfigurarEnvio={mockOnConfigurarEnvio}
          onEntregarProducto={mockOnEntregarProducto}
        />
      );
    });

    // 2. Verificamos los datos
    expect(screen.getByText('Celular Enviado')).toBeTruthy();
    expect(screen.getByText('ENVIADO')).toBeTruthy();

    // 3. Buscamos el botón "Confirmar Entrega"
    const botonEntregar = screen.getByText('Confirmar Entrega');
    expect(botonEntregar).toBeTruthy();

    // 4. Verificamos que el *otro* botón NO existe
    const botonConfigurar = screen.queryByText('Configurar Envío');
    expect(botonConfigurar).toBeNull();

    // 5. Simulamos clic dentro de act() y verificamos que se llamó al spy correcto
    await act(async () => {
      fireEvent.click(botonEntregar);
    });

    expect(mockOnEntregarProducto).toHaveBeenCalledTimes(1);
    expect(mockOnEntregarProducto).toHaveBeenCalledWith(mockProductoEnviado);
    expect(mockOnConfigurarEnvio).not.toHaveBeenCalled();
  });

  // --- 5. TEST (Estado ENTREGADO) ---
  it('No debe mostrar botones de acción si el estado es ENTREGADO', async () => {
    await act(async () => {
      render(
        <ProductoEnvioCard
          producto={mockProductoEntregado}
          onConfigurarEnvio={mockOnConfigurarEnvio}
          onEntregarProducto={mockOnEntregarProducto}
        />
      );
    });

    // 2. Verificamos los datos
    expect(screen.getByText('Auri Entregados')).toBeTruthy();
    expect(screen.getByText('ENTREGADO')).toBeTruthy();

    // 3. Verificamos que NINGÚN botón de acción existe
    expect(screen.queryByText('Configurar Envío')).toBeNull();
    expect(screen.queryByText('Confirmar Entrega')).toBeNull();

    // 4. Verificamos que ningún spy fue llamado (no hay botones que clicar)
    expect(mockOnEntregarProducto).not.toHaveBeenCalled();
    expect(mockOnConfigurarEnvio).not.toHaveBeenCalled();
  });
});
