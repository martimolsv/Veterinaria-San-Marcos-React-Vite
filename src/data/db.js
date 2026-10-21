import * as almacenamientoLocal from "./storage.js";
import { productosIniciales } from "./catalogos.js";

const claves = {
  productos: "productosSanMarcos",
  categorias: "categoriasSanMarcos",
  usuarios: "usuariosSanMarcos",
  ordenes: "ordenesSanMarcos",
};

function crearId(prefijo) {
  const id =
    globalThis.crypto?.randomUUID?.() ||
    `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return `${prefijo}-${id}`;
}

function crearBaseDatos(almacenamiento = almacenamientoLocal) {
  function listar(clave, respaldo = []) {
    const registros = almacenamiento.leer(clave, respaldo);
    if (!Array.isArray(registros))
      throw new Error(`Los datos de "${clave}" deben ser una lista.`);
    return registros;
  }

  function crear(clave, prefijo, datos, validar = () => {}, respaldo = []) {
    validar(datos);
    const registros = listar(clave, respaldo);
    const nuevo = { ...datos, id: datos.id || crearId(prefijo) };
    if (registros.some((registro) => registro.id === nuevo.id))
      throw new Error(`Ya existe el registro ${nuevo.id}.`);
    almacenamiento.escribir(clave, [...registros, nuevo]);
    return nuevo;
  }

  function obtener(clave, id) {
    return (
      listar(clave).find((registro) => String(registro.id) === String(id)) ||
      null
    );
  }

  function actualizar(clave, id, cambios, validar = () => {}, respaldo = []) {
    const registros = listar(clave, respaldo);
    const actual = registros.find(
      (registro) => String(registro.id) === String(id),
    );
    if (!actual) throw new Error(`No existe el registro ${id}.`);
    const actualizado = { ...actual, ...cambios, id: actual.id };
    validar(actualizado);
    almacenamiento.escribir(
      clave,
      registros.map((registro) =>
        registro.id === actual.id ? actualizado : registro,
      ),
    );
    return actualizado;
  }

  function eliminarRegistro(clave, id, respaldo = []) {
    const registros = listar(clave, respaldo);
    const restantes = registros.filter(
      (registro) => String(registro.id) !== String(id),
    );
    if (registros.length === restantes.length) return false;
    almacenamiento.escribir(clave, restantes);
    return true;
  }

  function validarProducto(producto) {
    if (!String(producto.name || "").trim())
      throw new Error("El nombre del producto es obligatorio.");
    if (!Number.isFinite(Number(producto.price)) || Number(producto.price) <= 0)
      throw new Error("El precio debe ser un número positivo.");
    if (!Number.isFinite(Number(producto.stock)) || Number(producto.stock) < 0)
      throw new Error("El stock debe ser un número igual o mayor que cero.");
    if (
      producto.descuento != null &&
      (Number(producto.descuento) < 0 || Number(producto.descuento) > 100)
    )
      throw new Error("El descuento debe estar entre 0 y 100.");
  }

  function validarCategoria(categoria) {
    const nombre = String(categoria.name || "").trim();
    if (!nombre) throw new Error("El nombre de la categoría es obligatorio.");
  }

  function validarUsuario(usuario) {
    if (!String(usuario.name || "").trim())
      throw new Error("El nombre del usuario es obligatorio.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(usuario.email || "")))
      throw new Error("El correo del usuario no es válido.");
  }

  function listarProductos() {
    return listar(claves.productos, productosIniciales).map((producto) => {
      const inicial = productosIniciales.find(
        (item) => item.id === producto.id,
      );
      return producto.descuento == null && inicial?.descuento
        ? { ...producto, descuento: inicial.descuento }
        : producto;
    });
  }

  const crearProducto = (producto) => {
    almacenamiento.escribir(claves.productos, listarProductos());
    return crear(
      claves.productos,
      "PR",
      producto,
      validarProducto,
      productosIniciales,
    );
  };
  const obtenerProducto = (id) =>
    listarProductos().find((producto) => String(producto.id) === String(id)) ||
    null;
  const actualizarProducto = (id, cambios) => {
    almacenamiento.escribir(claves.productos, listarProductos());
    return actualizar(
      claves.productos,
      id,
      cambios,
      validarProducto,
      productosIniciales,
    );
  };
  const eliminarProducto = (id) => {
    almacenamiento.escribir(claves.productos, listarProductos());
    return eliminarRegistro(claves.productos, id, productosIniciales);
  };

  function listarCategorias() {
    const respaldo = [
      ...new Set(listarProductos().map((producto) => producto.category)),
    ].map((name) => ({
      id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name,
    }));
    return listar(claves.categorias, respaldo);
  }

  const crearCategoria = (categoria) => {
    const datos =
      typeof categoria === "string" ? { name: categoria } : categoria;
    const repetida = listarCategorias().some(
      (item) =>
        item.name.toLowerCase() ===
        String(datos.name || "")
          .trim()
          .toLowerCase(),
    );
    if (repetida) throw new Error("Ya existe una categoría con ese nombre.");
    almacenamiento.escribir(claves.categorias, listarCategorias());
    return crear(claves.categorias, "CAT", datos, validarCategoria);
  };

  function actualizarCategoria(id, cambios) {
    const anterior = listarCategorias().find(
      (categoria) => String(categoria.id) === String(id),
    );
    if (!anterior) throw new Error(`No existe la categoría ${id}.`);
    const datos = typeof cambios === "string" ? { name: cambios } : cambios;
    const nombre = String(datos.name || "").trim();
    const repetida = listarCategorias().some(
      (item) =>
        item.id !== anterior.id &&
        item.name.toLowerCase() === nombre.toLowerCase(),
    );
    if (repetida) throw new Error("Ya existe una categoría con ese nombre.");
    almacenamiento.escribir(claves.categorias, listarCategorias());
    const actualizada = actualizar(
      claves.categorias,
      id,
      datos,
      validarCategoria,
    );
    if (anterior.name !== actualizada.name) {
      almacenamiento.escribir(
        claves.productos,
        listarProductos().map((producto) =>
          producto.category === anterior.name
            ? { ...producto, category: actualizada.name }
            : producto,
        ),
      );
    }
    return actualizada;
  }

  function eliminarCategoria(id) {
    const categoria = listarCategorias().find(
      (item) => String(item.id) === String(id),
    );
    if (!categoria) return false;
    if (
      listarProductos().some((producto) => producto.category === categoria.name)
    )
      throw new Error(
        "No se puede eliminar una categoría que tiene productos asociados.",
      );
    almacenamiento.escribir(claves.categorias, listarCategorias());
    return eliminarRegistro(claves.categorias, id);
  }

  const listarUsuarios = () => listar(claves.usuarios);
  const crearUsuario = (usuario) => {
    if (
      listarUsuarios().some(
        (item) =>
          String(item.email).toLowerCase() ===
          String(usuario.email).toLowerCase(),
      )
    )
      throw new Error("Ya existe un usuario con ese correo.");
    return crear(claves.usuarios, "US", usuario, validarUsuario);
  };
  const obtenerUsuario = (id) => obtener(claves.usuarios, id);
  const actualizarUsuario = (id, cambios) => {
    if (
      listarUsuarios().some(
        (item) =>
          String(item.id) !== String(id) &&
          String(item.email).toLowerCase() ===
            String(cambios.email).toLowerCase(),
      )
    )
      throw new Error("Ya existe un usuario con ese correo.");
    return actualizar(claves.usuarios, id, cambios, validarUsuario);
  };
  const eliminarUsuario = (id) => eliminarRegistro(claves.usuarios, id);

  const listarOrdenes = () => listar(claves.ordenes);
  const crearOrden = (orden) => {
    const numero =
      orden.numero ||
      `SM-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    return crear(claves.ordenes, "ORD", {
      ...orden,
      numero,
      fecha: orden.fecha || new Date().toISOString(),
    });
  };
  const obtenerOrden = (id) =>
    obtener(claves.ordenes, id) ||
    listarOrdenes().find((orden) => orden.numero === id) ||
    null;
  const actualizarOrden = (id, cambios) =>
    actualizar(claves.ordenes, id, cambios);
  const eliminarOrden = (id) => eliminarRegistro(claves.ordenes, id);

  return {
    listarProductos,
    crearProducto,
    obtenerProducto,
    actualizarProducto,
    eliminarProducto,
    listarCategorias,
    crearCategoria,
    obtenerCategoria: (id) =>
      listarCategorias().find(
        (categoria) => String(categoria.id) === String(id),
      ) || null,
    actualizarCategoria,
    eliminarCategoria,
    listarUsuarios,
    crearUsuario,
    obtenerUsuario,
    actualizarUsuario,
    eliminarUsuario,
    listarOrdenes,
    crearOrden,
    obtenerOrden,
    actualizarOrden,
    eliminarOrden,
  };
}

export { crearBaseDatos };
export const db = crearBaseDatos();
export const {
  listarProductos,
  crearProducto,
  obtenerProducto,
  actualizarProducto,
  eliminarProducto,
  listarCategorias,
  crearCategoria,
  obtenerCategoria,
  actualizarCategoria,
  eliminarCategoria,
  listarUsuarios,
  crearUsuario,
  obtenerUsuario,
  actualizarUsuario,
  eliminarUsuario,
  listarOrdenes,
  crearOrden,
  obtenerOrden,
  actualizarOrden,
  eliminarOrden,
} = db;
