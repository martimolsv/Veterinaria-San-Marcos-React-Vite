import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default function PaginaInformativa({ titulo, mensaje }) {
  return (
    <main className="container py-5">
      <div className="service-card p-4">
        <h1 className="page-title">{titulo}</h1>
        <p>{mensaje}</p>
        <Link className="btn btn-outline-success" to="/">
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}

PaginaInformativa.propTypes = {
  titulo: PropTypes.string.isRequired,
  mensaje: PropTypes.string.isRequired,
};
