import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";   // estilos base de create-react-app
import "./styles.css";  // 🎨 tu tema personalizado
import reportWebVitals from "./reportWebVitals";

// Crear raíz de React 18
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Métricas opcionales
reportWebVitals();
