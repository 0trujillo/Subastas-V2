import { useEffect } from 'react';

// Definimos los bots fuera del hook para que no se re-creen
const bots = [
  { nombre: "User2314", agresividad: 0.5, incrementoMax: 20 },
  { nombre: "User000", agresividad: 0.5, incrementoMax: 20 },
  { nombre: "User9875", agresividad: 0.5, incrementoMax: 20 },
];

/**
 * Hook personalizado para gestionar la lógica de las pujas automáticas de los bots.
 * @param {Function} setSubastas - La función 'setState' para actualizar la lista de subastas.
 */
export default function useBotLogic(setSubastas) {
  
  useEffect(() => {
    // 🤖 Lógica de Bots
    const intervaloBots = setInterval(() => {
      
      // Usamos la forma funcional de 'setSubastas' 
      // para no depender de la variable 'subastas' directamente.
      setSubastas((subastasActuales) =>
        subastasActuales.map((s) => {
          if (s.tiempo <= 0) return s; // No pujar si la subasta terminó

          const bot = bots[Math.floor(Math.random() * bots.length)];
          const probabilidad = Math.random();

          // El bot puja si...
          const puedePujar =
            probabilidad < bot.agresividad || // es agresivo
            !s.ganador ||                     // no hay ganador
            s.ganador === "usuario";          // o el usuario va ganando

          if (puedePujar && s.precio < 3000) {
            const incremento = Math.floor(Math.random() * bot.incrementoMax) + 5;
            return {
              ...s,
              precio: s.precio + incremento,
              ganador: bot.nombre,
            };
          }

          // Si no puja, devuelve la subasta sin cambios
          return s;
        })
      );
    }, 2500); // Los bots pujan cada 2.5 segundos

    // Función de limpieza: se ejecuta cuando el componente se desmonta
    return () => clearInterval(intervaloBots);

  // La dependencia es 'setSubastas'. Como es un 'setState' de useState,
  // es estable y este efecto solo se ejecutará una vez.
  }, [setSubastas]);

  // Este hook no necesita devolver nada, solo ejecuta el efecto.
}
