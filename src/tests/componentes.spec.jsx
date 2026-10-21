import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Productos from "../pages/Productos.jsx";
import TarjetaProducto from "../components/TarjetaProducto.jsx";
import Checkout from "../pages/Checkout.jsx";

const productosPrueba = [
  {
    id: "P1",
    name: "Alimento Canino",
    category: "Alimentos",
    active: "Proteína",
    presentation: "Bolsa",
    species: "Perro",
    stock: 4,
    price: 5000,
  },
  {
    id: "P2",
    name: "Shampoo Felino",
    category: "Higiene",
    active: "Avena",
    presentation: "Frasco",
    species: "Gato",
    stock: 8,
    price: 3500,
  },
];

describe("Componentes de tienda", function () {
  beforeEach(function () {
    localStorage.clear();
  });

  afterEach(function () {
    cleanup();
    localStorage.clear();
  });

  it("renderiza todos los productos recibidos por props", function () {
    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Productos
          productos={productosPrueba}
          agregar={jasmine.createSpy("agregar")}
        />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: "Alimento Canino" }),
    ).toBeTruthy();
    expect(
      screen.getByRole("heading", { name: "Shampoo Felino" }),
    ).toBeTruthy();
    expect(screen.getAllByRole("button", { name: "Agregar" }).length).toBe(2);
  });

  it("muestra el mensaje sin resultados solo cuando la lista filtrada está vacía", function () {
    const agregar = jasmine.createSpy("agregar");
    const vista = render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Productos productos={productosPrueba} agregar={agregar} />
      </MemoryRouter>,
    );
    expect(
      screen.queryByText("No hay productos que coincidan con la búsqueda."),
    ).toBeNull();

    fireEvent.change(screen.getByLabelText("Buscar"), {
      target: { value: "producto inexistente" },
    });
    expect(
      screen.getByText("No hay productos que coincidan con la búsqueda."),
    ).toBeTruthy();

    vista.rerender(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Productos productos={[]} agregar={agregar} />
      </MemoryRouter>,
    );
    expect(
      screen.getByText("No hay productos que coincidan con la búsqueda."),
    ).toBeTruthy();
  });

  it("la tarjeta entrega el producto correcto al callback recibido", function () {
    const agregar = jasmine.createSpy("agregar");
    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <TarjetaProducto producto={productosPrueba[0]} agregar={agregar} />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Agregar" }));
    expect(agregar).toHaveBeenCalledWith(productosPrueba[0]);
  });

  it("controla los campos de checkout, valida datos y envía el resultado elegido", function () {
    const onPagar = jasmine.createSpy("onPagar");
    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Checkout
          carrito={[{ id: "P1", name: "Alimento", price: 4200, cantidad: 1 }]}
          usuario={{ name: "Ana", apellidos: "Pérez", email: "ana@duoc.cl" }}
          borrador={null}
          onPagar={onPagar}
        />
      </MemoryRouter>,
    );

    expect(screen.getByLabelText("Nombre *").value).toBe("Ana");
    fireEvent.click(
      screen.getByRole("button", { name: "Simular pago aprobado" }),
    );
    expect(screen.getAllByText("Este campo es obligatorio.").length).toBe(3);
    expect(onPagar).not.toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText("Calle y número *"), {
      target: { value: "Av. Central 123" },
    });
    fireEvent.change(screen.getByLabelText("Región *"), {
      target: { value: "Valparaíso" },
    });
    fireEvent.change(screen.getByLabelText("Comuna *"), {
      target: { value: "Viña del Mar" },
    });
    expect(screen.getByLabelText("Calle y número *").value).toBe(
      "Av. Central 123",
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Simular pago rechazado" }),
    );

    expect(onPagar).toHaveBeenCalledWith(
      jasmine.objectContaining({
        calle: "Av. Central 123",
        comuna: "Viña del Mar",
      }),
      false,
    );
  });
});
