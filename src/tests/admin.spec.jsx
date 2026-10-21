import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App.jsx";

function renderAdmin(ruta) {
  localStorage.setItem("sesionAdminSanMarcos", JSON.stringify(true));
  return render(
    <MemoryRouter
      initialEntries={[ruta]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <App />
    </MemoryRouter>,
  );
}

describe("Rutas administrativas", function () {
  beforeEach(function () {
    localStorage.clear();
  });

  afterEach(function () {
    cleanup();
    localStorage.clear();
    document.body.classList.remove("dark-mode");
  });

  it("renderiza órdenes vacías sin errores", function () {
    localStorage.setItem("ordenesSanMarcos", JSON.stringify([]));
    renderAdmin("/admin/ordenes");

    expect(screen.getByRole("heading", { name: "Órdenes" })).toBeTruthy();
    expect(screen.getByText("Aún no hay órdenes registradas.")).toBeTruthy();
  });

  it("renderiza reportes vacíos sin errores", function () {
    localStorage.setItem("ordenesSanMarcos", JSON.stringify([]));
    renderAdmin("/admin/reportes");

    expect(screen.getByRole("heading", { name: "Reportes" })).toBeTruthy();
    expect(screen.getByText("Aún no hay ventas pagadas.")).toBeTruthy();
  });

  it("renderiza el perfil sin errores", function () {
    renderAdmin("/admin/perfil");

    expect(
      screen.getByRole("heading", { name: "Perfil de administración" }),
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Cerrar sesión de administrador" }),
    ).toBeTruthy();
  });

  it("lista solo los productos con stock igual o menor a cinco", function () {
    localStorage.setItem(
      "productosSanMarcos",
      JSON.stringify([
        {
          id: "critico-1",
          name: "Stock cinco",
          category: "Otros",
          price: 1000,
          stock: 5,
        },
        {
          id: "critico-2",
          name: "Stock cero",
          category: "Otros",
          price: 1000,
          stock: 0,
        },
        {
          id: "disponible",
          name: "Stock seis",
          category: "Otros",
          price: 1000,
          stock: 6,
        },
      ]),
    );
    renderAdmin("/admin/productos/criticos");

    expect(screen.getByText("Stock cinco")).toBeTruthy();
    expect(screen.getByText("Stock cero")).toBeTruthy();
    expect(screen.queryByText("Stock seis")).toBeNull();
  });

  it("redirige al login cuando no hay sesión administrativa", function () {
    render(
      <MemoryRouter
        initialEntries={["/admin/ordenes"]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: "Iniciar sesión" }),
    ).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Órdenes" })).toBeNull();
  });

  it("muestra la vista solicitada cuando hay sesión administrativa", function () {
    renderAdmin("/admin");

    expect(
      screen.getByRole("heading", { name: "Panel de administración" }),
    ).toBeTruthy();
  });

  it("muestra la lista de usuarios solo en la ruta base", function () {
    renderAdmin("/admin/usuarios");

    expect(screen.getByRole("heading", { name: "Usuarios" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Nuevo usuario" })).toBeTruthy();
    expect(screen.queryByLabelText("Nombre")).toBeNull();
  });

  it("muestra un formulario vacío en la ruta de nuevo usuario", function () {
    renderAdmin("/admin/usuarios/nuevo");

    expect(screen.getByRole("heading", { name: "Nuevo usuario" })).toBeTruthy();
    expect(screen.getByLabelText("Nombre").value).toBe("");
  });

  it("carga los datos del usuario en la ruta de edición", function () {
    localStorage.setItem(
      "usuariosSanMarcos",
      JSON.stringify([
        {
          id: "USR-1",
          name: "Camila Rojas",
          email: "camila@duoc.cl",
          role: "cliente",
        },
      ]),
    );
    renderAdmin("/admin/usuarios/USR-1/editar");

    expect(
      screen.getByRole("heading", { name: "Editar usuario" }),
    ).toBeTruthy();
    expect(screen.getByLabelText("Nombre").value).toBe("Camila Rojas");
    expect(screen.getByLabelText("Correo").value).toBe("camila@duoc.cl");
  });

  it("muestra el historial de compras del usuario", function () {
    localStorage.setItem(
      "usuariosSanMarcos",
      JSON.stringify([
        {
          id: "USR-1",
          name: "Camila Rojas",
          email: "camila@duoc.cl",
          role: "cliente",
        },
      ]),
    );
    localStorage.setItem(
      "ordenesSanMarcos",
      JSON.stringify([
        {
          id: "ORD-1",
          numero: "ORD-1",
          fecha: "2026-01-01",
          total: 2500,
          cliente: { correo: "camila@duoc.cl" },
        },
      ]),
    );
    renderAdmin("/admin/usuarios/USR-1/historial");

    expect(
      screen.getByRole("heading", { name: "Historial de Camila Rojas" }),
    ).toBeTruthy();
    expect(screen.getByRole("link", { name: "ORD-1" })).toBeTruthy();
  });
});
