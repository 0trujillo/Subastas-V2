import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "../components/layout/Footer";

describe("Footer", () => {

  it("debería renderizar el texto con el año actual", () => {
    render(<Footer />);
    const year = new Date().getFullYear();
    const elemento = screen.getByText(new RegExp(`${year}`));
    expect(elemento).not.toBeNull();
  });

  it("debería mostrar los íconos de redes sociales", () => {
    render(<Footer />);
    const videoIcon = screen.getByTitle(/Ver video promocional/i);
    expect(videoIcon).not.toBeNull();

    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThanOrEqual(4);
  });

  it("debería tener los enlaces configurados para abrir en nueva pestaña", () => {
    render(<Footer />);
    const links = screen.getAllByRole("link");

    links.forEach(link => {
      expect(link.getAttribute("target")).toBe("_blank");
    });
  });

});
