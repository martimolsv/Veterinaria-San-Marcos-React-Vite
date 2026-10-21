import PropTypes from "prop-types";
import { dinero } from "../helpers.js";
import { calcularPrecioFinal } from "../utils.js";

export default function FilaCarrito({ producto, cambiarCantidad, eliminar }) {
  return (
    <tr>
      <td>{producto.name}</td>
      <td>
        {producto.descuento > 0 && (
          <del className="text-secondary me-1">${dinero(producto.price)}</del>
        )}
        ${dinero(calcularPrecioFinal(producto))}
      </td>
      <td>
        <button
          className="btn btn-sm btn-outline-success"
          aria-label={`Reducir ${producto.name}`}
          onClick={() => cambiarCantidad(producto.id, -1)}
        >
          -
        </button>
        <strong className="mx-2">{producto.cantidad}</strong>
        <button
          className="btn btn-sm btn-outline-success"
          aria-label={`Aumentar ${producto.name}`}
          onClick={() => cambiarCantidad(producto.id, 1)}
        >
          +
        </button>
      </td>
      <td>${dinero(calcularPrecioFinal(producto) * producto.cantidad)}</td>
      <td>
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={() => eliminar(producto.id)}
        >
          Eliminar
        </button>
      </td>
    </tr>
  );
}

FilaCarrito.propTypes = {
  producto: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    cantidad: PropTypes.number.isRequired,
  }).isRequired,
  cambiarCantidad: PropTypes.func.isRequired,
  eliminar: PropTypes.func.isRequired,
};
