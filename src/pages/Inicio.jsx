import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const tarjetas = [
  [
    "bi-heart-pulse",
    "Consultas",
    "Atenciones generales, urgencias y controles.",
    "/servicios",
  ],
  ["bi-capsule", "Productos", "Medicamentos, vacunas y más.", "/productos"],
  [
    "bi-journal-text",
    "Consejos",
    "Información para cuidar a tu mascota.",
    "/blog",
  ],
];

export default function Inicio() {
  return (
    <>
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <span className="badge rounded-pill hero-badge">
                <i className="bi bi-heart-fill me-1" />
                Cuidamos a quienes más quieres
              </span>
              <h1 className="hero-title">
                El bienestar de tu mascota <span>es nuestra prioridad.</span>
              </h1>
              <p className="hero-text">
                En Veterinaria San Marcos encontrarás atención, productos y
                orientación pensados para el cuidado de tus compañeros.
              </p>
              <div className="d-flex flex-wrap gap-3 mt-4">
                <Link className="btn btn-success btn-lg" to="/servicios">
                  Ver servicios
                </Link>
                <Link
                  className="btn btn-outline-success btn-lg"
                  to="/productos"
                >
                  Visitar tienda
                </Link>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="service-card p-5 text-center">
                <i className="bi bi-heart-pulse-fill display-1 text-success" />
                <h3 className="mt-3">Atención profesional</h3>
                <p className="text-secondary">
                  Para perros, gatos y otras especies
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container text-center">
          <span className="section-label">SAN MARCOS</span>
          <h2 className="section-title">Cuidado pensado para ellos</h2>
          <p className="section-text">
            Conoce nuestras áreas de atención y encuentra rápidamente lo que
            necesitas.
          </p>
          <div className="row g-4 mt-2">
            {tarjetas.map(([icono, titulo, descripcion, ruta]) => (
              <div className="col-md-4" key={titulo}>
                <div className="service-card h-100">
                  <i className={`bi ${icono} service-icon`} />
                  <h3>{titulo}</h3>
                  <p>{descripcion}</p>
                  <Link className="btn btn-outline-success" to={ruta}>
                    Ver más
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

Inicio.propTypes = {};
