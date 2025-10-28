import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";

export default function Footer() {
  return (
    <footer className="bg-dark text-white mt-5 py-4">
      <div className="container text-center">
        <p className="mb-2">
          © {new Date().getFullYear()} <strong>Subastas Online</strong>. Todos los derechos reservados.
        </p>

        <div className="d-flex justify-content-center gap-4">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white text-decoration-none fs-4"
          >
            <i className="fab fa-facebook"></i>
          </a>

          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white text-decoration-none fs-4"
          >
            <i className="fab fa-twitter"></i>
          </a>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white text-decoration-none fs-4"
          >
            <i className="fab fa-instagram"></i>
          </a>

          {/* 🔹 Enlace al video (YouTube) */}
          <a
            href="https://youtu.be/dQw4w9WgXcQ?si=4E0N-jqrPpAnwF0H"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white text-decoration-none fs-4"
            title="Ver video promocional"
          >
            <i className="fab fa-youtube"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}
