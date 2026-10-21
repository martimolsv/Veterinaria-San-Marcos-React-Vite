import PropTypes from "prop-types";
import { calcularTotal } from "../utils.js";
import { dinero } from "../helpers.js";
import FilaCarrito from "../components/FilaCarrito.jsx";

export default function Carrito({
  carrito,
  cambiarCantidad,
  eliminar,
  vaciar,
  finalizar,
}) {
  return (
    <main className="container py-5">
      <h1 className="page-title">Carrito de compras</h1>
      {!carrito.length ? (
        <div className="service-card text-center p-5">
          <i className="bi bi-cart3 display-3 text-success" />
          <h3>Tu carrito está vacío</h3>
          <p>Agrega productos desde nuestro catálogo.</p>
        </div>
      ) : (
        <>
          <div className="table-responsive admin-table">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {carrito.map((producto) => (
                  <FilaCarrito
                    key={producto.id}
                    producto={producto}
                    cambiarCantidad={cambiarCantidad}
                    eliminar={eliminar}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-end mt-4">
            <h3>Total: ${dinero(calcularTotal(carrito))}</h3>
            <button className="btn btn-outline-danger me-2" onClick={vaciar}>
              Vaciar carrito
            </button>
            <button className="btn btn-success" onClick={finalizar}>
              Finalizar compra
            </button>
          </div>
        </>
      )}
    </main>
  );
}

Carrito.propTypes = {
  carrito: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      cantidad: PropTypes.number.isRequired,
    }),
  ).isRequired,
  cambiarCantidad: PropTypes.func.isRequired,
  eliminar: PropTypes.func.isRequired,
  vaciar: PropTypes.func.isRequired,
  finalizar: PropTypes.func.isRequired,
};
