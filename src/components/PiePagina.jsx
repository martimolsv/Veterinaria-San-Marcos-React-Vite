import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default function PiePagina() {
  return (
    <footer className="py-4 mt-5 border-top">
      <div className="container d-flex flex-wrap justify-content-between gap-3">
        <span>
          <strong>Veterinaria San Marcos</strong> · Cuidamos a quienes más
          quieres.
        </span>
        <Link className="btn btn-outline-success btn-sm" to="/admin">
          <i className="bi bi-gear me-1" />
          Administración
        </Link>
      </div>
      <div className="container small text-secondary mt-2">
        Álvarez 2366, Chorrillos, Viña del Mar
      </div>
    </footer>
  );
}

PiePagina.propTypes = {};
