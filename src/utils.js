// Funciones pequeñas que se usan en el catálogo y el carrito.

export function calcularTotal(carrito) {
  return carrito.reduce((total, producto) => {
    return total + (producto.price ?? producto.precio) * producto.cantidad;
  }, 0);
}

export function contarUnidades(carrito) {
  return carrito.reduce((total, producto) => total + producto.cantidad, 0);
}

export function filtrarPorTextoYCategoria(elementos, texto, categoria) {
  const busqueda = texto.toLowerCase().trim();

  return elementos.filter((elemento) => {
    const coincideTexto = Object.values(elemento)
      .join(" ")
      .toLowerCase()
      .includes(busqueda);
    const coincideCategoria = !categoria || elemento.category === categoria;

    return coincideTexto && coincideCategoria;
  });
}
