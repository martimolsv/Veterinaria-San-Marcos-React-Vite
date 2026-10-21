import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { dinero } from "../helpers.js";
import { calcularPrecioFinal } from "../utils.js";

export default function TarjetaProducto({ producto, agregar }) {
  return (
    <article className="product-card h-100">
      <div className="product-image">
        <div className="product-placeholder">
          <i className="bi bi-capsule" />
        </div>
      </div>
      <div className="product-body">
        <span className="product-category">{producto.category}</span>
        <h3>
          <Link to={`/productos/${producto.id}`}>{producto.name}</Link>
        </h3>
        <p>
          <strong>Principio activo:</strong> {producto.active}
        </p>
        <p>
          <strong>Presentación:</strong> {producto.presentation}
        </p>
        <p>
          <strong>Especie:</strong> {producto.species} · <strong>Stock:</strong>{" "}
          {producto.stock}
        </p>
        <div className="d-flex justify-content-between align-items-center gap-2">
          <span className="product-price">
            {producto.descuento > 0 && (
              <>
                <del className="text-secondary fs-6">
                  ${dinero(producto.price)}
                </del>{" "}
              </>
            )}
            <span>${dinero(calcularPrecioFinal(producto))}</span>
            {producto.descuento > 0 && (
              <small className="badge text-bg-danger ms-1">
                -{producto.descuento}%
              </small>
            )}
          </span>
          <button className="btn btn-success" onClick={() => agregar(producto)}>
            <i className="bi bi-cart-plus me-1" />
            Agregar
          </button>
        </div>
      </div>
    </article>
  );
}

TarjetaProducto.propTypes = {
  producto: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    active: PropTypes.string,
    presentation: PropTypes.string,
    species: PropTypes.string,
    stock: PropTypes.number,
    price: PropTypes.number.isRequired,
  }).isRequired,
  agregar: PropTypes.func.isRequired,
};
