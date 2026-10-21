import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { dinero } from "../helpers.js";
import { calcularPrecioFinal } from "../utils.js";

export default function DetalleProducto({ productos, agregar }) {
  const { id } = useParams();
  const producto = productos.find((item) => String(item.id) === id);
  if (!producto)
    return (
      <main className="container py-5">
        <h1>Producto no encontrado</h1>
        <Link to="/productos">Volver al catálogo</Link>
      </main>
    );
  return (
    <main className="container py-5">
      <div className="row g-4 align-items-center">
        <div className="col-md-5">
          <div className="product-placeholder display-1 text-center p-5">
            <i className="bi bi-capsule" />
          </div>
        </div>
        <div className="col-md-7">
          <span className="product-category">{producto.category}</span>
          <h1 className="page-title">{producto.name}</h1>
          <p>
            {producto.active} · {producto.presentation}
          </p>
          <p>
            Especie: {producto.species}. Stock disponible: {producto.stock}.
          </p>
          <h2 className="product-price">
            {producto.descuento > 0 && (
              <del className="text-secondary fs-5 me-2">
                ${dinero(producto.price)}
              </del>
            )}
            ${dinero(calcularPrecioFinal(producto))}
          </h2>
          <button className="btn btn-success" onClick={() => agregar(producto)}>
            Agregar al carrito
          </button>{" "}
          <Link className="btn btn-outline-success" to="/productos">
            Seguir comprando
          </Link>
        </div>
      </div>
    </main>
  );
}

DetalleProducto.propTypes = {
  productos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
    }),
  ).isRequired,
  agregar: PropTypes.func.isRequired,
};
