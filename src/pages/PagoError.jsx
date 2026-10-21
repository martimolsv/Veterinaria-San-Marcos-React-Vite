import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default function PagoError({ orden = null }) {
  return (
    <main className="container py-5">
      <div className="service-card p-4">
        <div className="alert alert-warning">
          <h1 className="h3">No se pudo procesar el pago</h1>
          <p className="mb-0">
            El carrito y los datos de entrega se conservaron para que puedas
            intentarlo otra vez.
          </p>
        </div>
        {orden && <p>Referencia del intento: {orden.numero}</p>}
        <Link className="btn btn-success" to="/checkout">
          Volver a realizar el pago
        </Link>
      </div>
    </main>
  );
}

PagoError.propTypes = { orden: PropTypes.shape({ numero: PropTypes.string }) };
