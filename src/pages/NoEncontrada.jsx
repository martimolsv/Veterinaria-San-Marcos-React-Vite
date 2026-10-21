import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default function NoEncontrada() {
  return (
    <main className="container py-5 text-center">
      <h1 className="page-title">Página no encontrada</h1>
      <p>La dirección que buscas no existe.</p>
      <Link className="btn btn-success" to="/">
        Ir al inicio
      </Link>
    </main>
  );
}

NoEncontrada.propTypes = {};
