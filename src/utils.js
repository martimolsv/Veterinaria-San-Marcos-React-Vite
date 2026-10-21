export function calcularTotal(carrito) {
  return carrito.reduce((total, producto) => {
    const precio = Number(producto.price ?? producto.precio);
    const descuento = Number(producto.descuento || 0);
    return (
      total + Math.round(precio * (1 - descuento / 100)) * producto.cantidad
    );
  }, 0);
}

export function calcularPrecioFinal(producto) {
  const precio = Number(producto.price ?? producto.precio);
  const descuento = Number(producto.descuento || 0);
  return Math.round(precio * (1 - descuento / 100));
}

export function contarUnidades(carrito) {
  return carrito.reduce((total, producto) => total + producto.cantidad, 0);
}

export function esCorreoDuocValido(correo) {
  return /^[^\s@]+@(?:duocuc\.cl|duoc\.cl)$/i.test(correo);
}

export function filtrarPorTextoYCategoria(
  elementos,
  texto,
  categoria,
  precioMinimo = "",
  precioMaximo = "",
) {
  const busqueda = String(texto || "")
    .toLowerCase()
    .trim();
  const minimo = precioMinimo === "category" ? "" : precioMinimo;

  return elementos.filter((elemento) => {
    const coincideTexto = Object.values(elemento)
      .join(" ")
      .toLowerCase()
      .includes(busqueda);
    const precio = Math.round(
      Number(elemento.price ?? elemento.precio) *
        (1 - Number(elemento.descuento || 0) / 100),
    );
    const coincideCategoria = !categoria || elemento.category === categoria;
    const coincidePrecioMinimo = minimo === "" || precio >= Number(minimo);
    const coincidePrecioMaximo =
      precioMaximo === "" || precio <= Number(precioMaximo);

    return (
      coincideTexto &&
      coincideCategoria &&
      coincidePrecioMinimo &&
      coincidePrecioMaximo
    );
  });
}
