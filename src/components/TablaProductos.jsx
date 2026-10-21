import PropTypes from "prop-types";
import { dinero } from "../helpers.js";

export default function TablaProductos({ productos, alEditar, alEliminar }) {
  return (
    <div className="table-responsive admin-table">
      <table className="table table-hover align-middle mb-0">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.name}</td>
              <td>{producto.category}</td>
              <td>${dinero(producto.price)}</td>
              <td>{producto.stock}</td>
              <td>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-success"
                    onClick={() => alEditar(producto)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => alEliminar(producto.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {!productos.length && (
            <tr>
              <td colSpan="5" className="text-center py-4">
                No hay productos registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

TablaProductos.propTypes = {
  productos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      stock: PropTypes.number.isRequired,
    }),
  ).isRequired,
  alEditar: PropTypes.func.isRequired,
  alEliminar: PropTypes.func.isRequired,
};
