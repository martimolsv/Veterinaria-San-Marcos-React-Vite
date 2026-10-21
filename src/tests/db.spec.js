import { crearBaseDatos } from "../data/db.js";

describe("Base de datos simulada", function () {
  let datos;
  let almacenamiento;
  let db;

  beforeEach(function () {
    datos = new Map();
    almacenamiento = {
      leer: (clave, respaldo) =>
        structuredClone(datos.has(clave) ? datos.get(clave) : respaldo),
      escribir: (clave, valor) => datos.set(clave, structuredClone(valor)),
      eliminar: (clave) => datos.delete(clave),
    };
    spyOn(almacenamiento, "leer").and.callThrough();
    spyOn(almacenamiento, "escribir").and.callThrough();
    spyOn(almacenamiento, "eliminar").and.callThrough();
    db = crearBaseDatos(almacenamiento);
  });

  afterEach(function () {
    datos.clear();
  });

  it("crea, lista, obtiene, actualiza y elimina productos usando storage mockeado", function () {
    const producto = db.crearProducto({
      name: "Producto temporal",
      category: "Otros",
      price: 1000,
      stock: 3,
    });

    expect(db.listarProductos().some((item) => item.id === producto.id)).toBe(
      true,
    );
    expect(db.obtenerProducto(producto.id).name).toBe("Producto temporal");
    expect(db.actualizarProducto(producto.id, { price: 1200 }).price).toBe(
      1200,
    );
    expect(db.eliminarProducto(producto.id)).toBe(true);
    expect(db.obtenerProducto(producto.id)).toBeNull();
    expect(almacenamiento.leer).toHaveBeenCalled();
    expect(almacenamiento.escribir).toHaveBeenCalled();
  });

  it("mantiene el catálogo existente si se crea un producto con storage vacío", function () {
    const cantidadInicial = db.listarProductos().length;
    db.crearProducto({
      name: "Nuevo",
      category: "Otros",
      price: 500,
      stock: 1,
    });

    expect(db.listarProductos().length).toBe(cantidadInicial + 1);
  });

  it("realiza el CRUD de categorías y evita borrar categorías con productos", function () {
    const categoria = db.crearCategoria("Temporal");
    expect(db.obtenerCategoria(categoria.id).name).toBe("Temporal");
    expect(
      db.actualizarCategoria(categoria.id, "Temporal renombrada").name,
    ).toBe("Temporal renombrada");
    expect(db.eliminarCategoria(categoria.id)).toBe(true);
    const categoriaOcupada = db
      .listarCategorias()
      .find((item) =>
        db
          .listarProductos()
          .some((producto) => producto.category === item.name),
      );
    expect(() => db.eliminarCategoria(categoriaOcupada.id)).toThrowError(
      /productos asociados/,
    );
  });

  it("realiza el CRUD de usuarios y rechaza correos duplicados", function () {
    const usuario = db.crearUsuario({
      name: "Ada",
      email: "ada@duoc.cl",
      role: "cliente",
    });
    expect(db.obtenerUsuario(usuario.id).email).toBe("ada@duoc.cl");
    expect(() =>
      db.crearUsuario({ name: "Otra", email: "ada@duoc.cl", role: "cliente" }),
    ).toThrowError(/Ya existe/);
    expect(
      db.actualizarUsuario(usuario.id, {
        name: "Ada Lovelace",
        email: "ada@duoc.cl",
        role: "cliente",
      }).name,
    ).toBe("Ada Lovelace");
    expect(db.eliminarUsuario(usuario.id)).toBe(true);
  });

  it("genera y administra órdenes con número y fecha", function () {
    const orden = db.crearOrden({ items: [], total: 0, estado: "Pagada" });
    expect(orden.numero).toMatch(/^SM-\d{4}-\d{6}$/);
    expect(db.obtenerOrden(orden.numero).id).toBe(orden.id);
    expect(db.actualizarOrden(orden.id, { estado: "Cancelada" }).estado).toBe(
      "Cancelada",
    );
    expect(db.eliminarOrden(orden.id)).toBe(true);
  });
});
