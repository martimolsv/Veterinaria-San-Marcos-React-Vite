import PropTypes from "prop-types";
import { NavLink, Outlet } from "react-router-dom";

const enlaces = [
  [".", "Resumen"],
  ["ordenes", "Órdenes"],
  ["productos", "Productos"],
  ["productos/criticos", "Stock crítico"],
  ["categorias", "Categorías"],
  ["usuarios", "Usuarios"],
  ["reportes", "Reportes"],
  ["perfil", "Perfil"],
];

export default function AdminLayout() {
  return (
    <div className="container-fluid py-4">
      <div className="row g-4">
        <aside className="col-lg-3 col-xl-2">
          <nav
            className="nav flex-column admin-shell gap-1"
            aria-label="Administración"
          >
            <strong className="mb-2">Panel administrativo</strong>
            {enlaces.map(([ruta, texto]) => (
              <NavLink
                key={ruta}
                end={ruta === "."}
                className="nav-link"
                to={ruta}
              >
                {texto}
              </NavLink>
            ))}
            <NavLink className="nav-link mt-3" to="/">
              Volver a la tienda
            </NavLink>
          </nav>
        </aside>
        <main className="col-lg-9 col-xl-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

AdminLayout.propTypes = {};
