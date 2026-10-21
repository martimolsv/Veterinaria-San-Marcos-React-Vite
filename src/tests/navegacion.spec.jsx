import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App.jsx";

function completarDireccion() {
  fireEvent.change(screen.getByLabelText("Nombre *"), {
    target: { value: "Camila" },
  });
  fireEvent.change(screen.getByLabelText("Apellidos *"), {
    target: { value: "Rojas" },
  });
  fireEvent.change(screen.getByLabelText("Correo electrónico *"), {
    target: { value: "camila@duoc.cl" },
  });
  fireEvent.change(screen.getByLabelText("Calle y número *"), {
    target: { value: "Av. Central 123" },
  });
  fireEvent.change(screen.getByLabelText("Región *"), {
    target: { value: "Valparaíso" },
  });
  fireEvent.change(screen.getByLabelText("Comuna *"), {
    target: { value: "Viña del Mar" },
  });
}

describe("Navegación y eventos de la tienda", function () {
  beforeEach(function () {
    localStorage.clear();
  });

  afterEach(function () {
    cleanup();
    localStorage.clear();
    document.body.classList.remove("dark-mode");
  });

  it("navega entre inicio, catálogo y detalle con MemoryRouter", function () {
    render(
      <MemoryRouter
        initialEntries={["/"]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <App />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole("link", { name: "Productos" }));

    expect(
      screen.getByRole("heading", { name: "Catálogo de productos" }),
    ).toBeTruthy();
    fireEvent.click(screen.getByRole("link", { name: "Amoxibay 250mg" }));
    expect(
      screen.getByRole("heading", { name: "Amoxibay 250mg" }),
    ).toBeTruthy();
  });

  it("redirige al login al intentar abrir una ruta admin sin sesión", function () {
    render(
      <MemoryRouter
        initialEntries={["/admin"]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: "Iniciar sesión" }),
    ).toBeTruthy();
    expect(
      screen.queryByRole("heading", { name: "Panel de administración" }),
    ).toBeNull();
  });

  it("agrega un producto al carrito y actualiza unidades y total", function () {
    render(
      <MemoryRouter
        initialEntries={["/productos"]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <App />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getAllByRole("button", { name: "Agregar" })[0]);

    expect(screen.getByRole("link", { name: "Carrito (1)" })).toBeTruthy();
    fireEvent.click(screen.getByRole("link", { name: "Carrito (1)" }));
    expect(screen.getByRole("heading", { name: "Total: $3.780" })).toBeTruthy();
  });

  it("conserva datos cuando falla el pago y completa la boleta al reintentar", function () {
    render(
      <MemoryRouter
        initialEntries={["/productos"]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <App />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getAllByRole("button", { name: "Agregar" })[0]);
    fireEvent.click(screen.getByRole("link", { name: "Carrito (1)" }));
    fireEvent.click(screen.getByRole("button", { name: "Finalizar compra" }));
    completarDireccion();
    fireEvent.click(
      screen.getByRole("button", { name: "Simular pago rechazado" }),
    );

    expect(
      screen.getByRole("heading", { name: "No se pudo procesar el pago" }),
    ).toBeTruthy();
    expect(
      screen.getByText(
        "El carrito y los datos de entrega se conservaron para que puedas intentarlo otra vez.",
      ),
    ).toBeTruthy();
    fireEvent.click(
      screen.getByRole("link", { name: "Volver a realizar el pago" }),
    );
    expect(screen.getByLabelText("Nombre *").value).toBe("Camila");
    expect(screen.getByLabelText("Comuna *").value).toBe("Viña del Mar");
    fireEvent.click(
      screen.getByRole("button", { name: "Simular pago aprobado" }),
    );

    expect(
      screen.getByRole("heading", { name: "¡Pago correcto!" }),
    ).toBeTruthy();
    expect(screen.getByText(/Camila Rojas/)).toBeTruthy();
    expect(JSON.parse(localStorage.getItem("carritoSanMarcosReact"))).toEqual(
      [],
    );
    expect(JSON.parse(localStorage.getItem("ordenesSanMarcos")).length).toBe(2);
  });
});
