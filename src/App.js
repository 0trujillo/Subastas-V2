import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";

import SubastasPage from "./pages/SubastasPage";
import EnvioPage from "./pages/EnvioPage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Componente que envuelve toda la app para controlar Navbar
const AppLayout = () => {
  const location = useLocation();

  // Solo mostrar el Navbar si NO estamos en / (login)
  const mostrarNavbar = location.pathname !== "/";

  return (
    <>
      {mostrarNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/subastas" element={<SubastasPage />} />
        <Route path="/envios" element={<EnvioPage />} />
      </Routes>

      <Footer />
    </>
  );
};

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
