import {
  calcularTotal,
  contarUnidades,
  esCorreoDuocValido,
  calcularPrecioFinal,
  filtrarPorTextoYCategoria,
} from "../utils.js";

describe("Funciones del catálogo y carrito", function () {
  beforeEach(function () {
    localStorage.clear();
  });

  afterEach(function () {
    localStorage.clear();
  });

  it("calcula el total del carrito", function () {
    const carrito = [
      { precio: 1000, cantidad: 2 },
      { precio: 500, cantidad: 3 },
    ];

    expect(calcularTotal(carrito)).toBe(3500);
  });

  it("devuelve cero para un carrito vacío y aplica descuentos por unidad", function () {
    expect(calcularTotal([])).toBe(0);
    expect(calcularPrecioFinal({ price: 1000, descuento: 15 })).toBe(850);
    expect(calcularTotal([{ price: 1000, descuento: 15, cantidad: 2 }])).toBe(
      1700,
    );
  });

  it("cuenta las unidades del carrito", function () {
    const carrito = [{ cantidad: 2 }, { cantidad: 3 }];

    expect(contarUnidades(carrito)).toBe(5);
  });

  it("acepta solo correos de los dominios DUOC permitidos", function () {
    expect(esCorreoDuocValido("estudiante@duoc.cl")).toBe(true);
    expect(esCorreoDuocValido("estudiante@duocuc.cl")).toBe(true);
    expect(esCorreoDuocValido("ESTUDIANTE@DUOC.CL")).toBe(true);
    expect(esCorreoDuocValido("")).toBe(false);
    expect(esCorreoDuocValido(" estudiante@duoc.cl")).toBe(false);
    expect(esCorreoDuocValido("estudiante@gmail.com")).toBe(false);
    expect(esCorreoDuocValido("estudiante@sub.duoc.cl")).toBe(false);
  });

  it("filtra por texto y categoría", function () {
    const elementos = [
      { name: "Amoxibay", category: "Antibióticos" },
      { name: "Nexgard", category: "Antiparasitarios" },
    ];
    const resultado = filtrarPorTextoYCategoria(
      elementos,
      "amox",
      "Antibióticos",
      "category",
    );

    expect(resultado.length).toBe(1);
    expect(resultado[0].name).toBe("Amoxibay");
  });

  it("filtra por rango de precio y no altera el arreglo original", function () {
    const elementos = [
      { name: "Oferta", category: "A", price: 1000, descuento: 20 },
      { name: "Regular", category: "A", price: 900 },
      { name: "Otra", category: "B", price: 2000 },
    ];
    const resultado = filtrarPorTextoYCategoria(elementos, "", "A", 750, 850);

    expect(resultado.map((item) => item.name)).toEqual(["Oferta"]);
    expect(elementos.length).toBe(3);
  });
});
