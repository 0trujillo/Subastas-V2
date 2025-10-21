import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";

// 🧩 Importa tus páginas
import SubastasPage from "./pages/SubastasPage";
import EnvioPage from "./pages/EnvioPage";
import LoginPage from "./pages/LoginPage"; // si tienes una página de login
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      {/* 🔹 Navbar fijo en todas las páginas */}
      <Navbar />

      {/* 🔹 Rutas */}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/subastas" element={<SubastasPage />} />
        <Route path="/envios" element={<EnvioPage />} />
      </Routes>

      {/* 🔹 Footer global */}
      <Footer />
    </Router>
  );
}

export default App;
