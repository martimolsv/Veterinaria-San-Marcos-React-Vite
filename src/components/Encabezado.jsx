import PropTypes from "prop-types";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const enlaces = [
  ["/", "Inicio"],
  ["/productos", "Productos"],
  ["/categorias", "Categorías"],
  ["/ofertas", "Ofertas"],
  ["/servicios", "Servicios"],
  ["/nosotros", "Nosotros"],
  ["/blog", "Blog"],
  ["/contacto", "Contacto"],
];

export default function Encabezado({ unidades, oscuro, cambiarModo }) {
  const [busqueda, setBusqueda] = useState("");
  const navegar = useNavigate();
  const ubicacion = useLocation();

  function buscar(evento) {
    evento.preventDefault();
    navegar(`/productos?busqueda=${encodeURIComponent(busqueda.trim())}`);
  }

  return (
    <nav className="navbar navbar-expand-lg shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <div className="logo-icon">
            <img src="/img/logo-sanmarcos.png" alt="Logo San Marcos" />
          </div>
          <div className="ms-2 text-start">
            <span className="logo-title">San Marcos</span>
            <small className="d-block logo-subtitle">Veterinaria</small>
          </div>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#menuPrincipal"
          aria-controls="menuPrincipal"
          aria-expanded="false"
          aria-label="Abrir menú"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="menuPrincipal">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            {enlaces.map(([ruta, texto]) => (
              <li className="nav-item" key={ruta}>
                <NavLink end={ruta === "/"} className="nav-link" to={ruta}>
                  {texto}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="d-flex align-items-center flex-wrap gap-2">
            <form className="d-flex" role="search" onSubmit={buscar}>
              <label className="visually-hidden" htmlFor="busqueda-navbar">
                Buscar productos
              </label>
              <input
                id="busqueda-navbar"
                className="form-control form-control-sm"
                placeholder="Buscar..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <button
                className="btn btn-outline-success btn-sm"
                aria-label="Buscar"
              >
                <i className="bi bi-search" />
              </button>
            </form>
            <button
              className="btn btn-outline-success btn-sm"
              onClick={cambiarModo}
            >
              {oscuro ? "☀️" : "🌙"}
              <span className="visually-hidden">
                {oscuro ? "Modo claro" : "Modo oscuro"}
              </span>
            </button>
            <Link className="btn btn-outline-success btn-sm" to="/login">
              Ingresar
            </Link>
            <Link className="btn btn-success btn-sm" to="/registro">
              Registrarse
            </Link>
            <Link className="btn btn-outline-success btn-sm" to="/carrito">
              <i className="bi bi-cart3" /> Carrito ({unidades})
            </Link>
          </div>
        </div>
      </div>
      {ubicacion.pathname.startsWith("/admin") && (
        <span className="visually-hidden">Navegación de administración</span>
      )}
    </nav>
  );
}

Encabezado.propTypes = {
  unidades: PropTypes.number.isRequired,
  oscuro: PropTypes.bool.isRequired,
  cambiarModo: PropTypes.func.isRequired,
};
