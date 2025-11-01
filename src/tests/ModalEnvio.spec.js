// --- IMPORTS ---
import React from 'react';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import ModalEnvio from '../components/envios/ModalEnvio';

// --- MOCKS ---
const mockProducto = {
  nombre: "Laptop Gamer",
  imagen: "Imagenes/Lgamer.jpg"
};

// "Spies" de Jasmine para simular las funciones de las props
const mockOnCancelar = jasmine.createSpy('onCancelar');
const mockOnGuardar = jasmine.createSpy('onGuardar');
const mockOnDireccionChange = jasmine.createSpy('onDireccionChange');

// --- PRUEBAS ---
describe('ModalEnvio Component (con Jasmine)', () => {

  // Antes de cada prueba, renderizamos el componente con props básicas
  // y limpiamos el historial de los spies.
  beforeEach(() => {
    mockOnCancelar.calls.reset();
    mockOnGuardar.calls.reset();
    mockOnDireccionChange.calls.reset();

    render(
      <ModalEnvio
        producto={mockProducto}
        direccion="Calle Falsa 123" // Pasamos un valor inicial para el campo 'direccion'
        onDireccionChange={mockOnDireccionChange}
        onCancelar={mockOnCancelar}
        onGuardar={mockOnGuardar}
      />
    );
  });

  afterEach(() => {
    // Limpieza del DOM tras cada test
    cleanup();
  });

  // --- 3. TEST (Renderizado) ---
  it('Debe renderizar el nombre y la imagen del producto que se recibe por props', () => {
    // 1. Buscamos el nombre del producto
    const nombreProducto = screen.getByText('Laptop Gamer');
    expect(nombreProducto).toBeTruthy();

    // 2. Buscamos la imagen por su texto alternativo (alt text)
    const imagenProducto = screen.getByAltText('Laptop Gamer');
    expect(imagenProducto).toBeTruthy();

    // 3. Verificamos que la imagen tiene el 'src' correcto
    expect(imagenProducto.getAttribute('src')).toBe('Imagenes/Lgamer.jpg');

    // 4. (Bonus) Verificamos que el campo dirección tiene el valor de la prop
    const inputDireccion = screen.getByDisplayValue('Calle Falsa 123');
    expect(inputDireccion).toBeTruthy();
  });

  // --- 4. TEST (Validación de campos vacíos) ---
  it('Debe mostrar un mensaje de advertencia si se presiona “Guardar Envío” con campos vacíos', async () => {
    // 1. Buscamos el botón de guardar
    const botonGuardar = screen.getByText('Guardar Envío');

    // 2. (Nota: Los campos 'nombre', 'telefono', etc., están vacíos por defecto)
    await act(async () => {
      fireEvent.click(botonGuardar);
    });

    // 3. Buscamos el mensaje de advertencia
    const mensajeAdvertencia = screen.getByText('⚠️ Por favor completa todos los campos antes de continuar.');
    expect(mensajeAdvertencia).toBeTruthy();

    // 4. Verificamos que 'onGuardar' NO fue llamada
    expect(mockOnGuardar).not.toHaveBeenCalled();
  });

  // --- 5. TEST (Simulación de llenado de formulario y guardado) ---
  it('Debe llamar a onGuardar con los datos correctos si todos los campos están llenos', async () => {
    // 1. Instalamos el reloj falso de Jasmine
    jasmine.clock().install();

    // 2. Llenamos todos los campos del formulario
    const inputNombre = screen.getByLabelText(/nombre completo/i);
    const inputTelefono = screen.getByLabelText(/teléfono/i);
    const inputDireccion = screen.getByLabelText(/dirección/i);
    const inputCiudad = screen.getByLabelText(/ciudad/i);
    const inputRegion = screen.getByLabelText(/región/i);

    await act(async () => {
      fireEvent.change(inputNombre, { target: { value: 'Juan Pérez' } });
      fireEvent.change(inputTelefono, { target: { value: '+56912345678' } });
      fireEvent.change(inputCiudad, { target: { value: 'Santiago' } });
      fireEvent.change(inputRegion, { target: { value: 'Metropolitana' } });
      fireEvent.change(inputDireccion, { target: { value: 'Calle Falsa 123' } });
    });

    // 3. Hacemos clic en guardar
    const botonGuardar = screen.getByText('Guardar Envío');
    await act(async () => {
      fireEvent.click(botonGuardar);
    });

    // 4. Verificamos que el mensaje de "Procesando" aparece
    expect(screen.getByText('⏳ Procesando envío...')).toBeTruthy();

    const botonGuardando = screen.getByText('Guardando...');
    expect(botonGuardando.disabled).toBeTrue();

    // 5. Verificamos que la validación de campos vacíos NO apareció
    const advertencia = screen.queryByText(/Por favor completa todos los campos/i);
    expect(advertencia).toBeNull();

    // 6. Adelantamos el reloj 800ms (para el primer timeout)
    await act(() => {
      jasmine.clock().tick(800);
    });

    // 7. Verificamos que 'onGuardar' fue llamada con los datos correctos
    expect(mockOnGuardar).toHaveBeenCalledTimes(1);
    expect(mockOnGuardar).toHaveBeenCalledWith({
      nombre: 'Juan Pérez',
      telefono: '+56912345678',
      direccion: 'Calle Falsa 123', // Este valor vino de la prop
      ciudad: 'Santiago',
      region: 'Metropolitana'
    });

    // 8. Verificamos que el mensaje de éxito se muestra
    expect(screen.getByText('✅ Envío configurado correctamente.')).toBeTruthy();

    // 9. Adelantamos el reloj 1000ms más (para el segundo timeout)
    await act(() => {
      jasmine.clock().tick(1000);
    });

    // 10. Verificamos que 'onCancelar' fue llamada al final
    expect(mockOnCancelar).toHaveBeenCalledTimes(1);

    // 11. Desinstalamos el reloj
    jasmine.clock().uninstall();
  });
});
