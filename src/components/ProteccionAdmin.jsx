import PropTypes from "prop-types";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProteccionAdmin({ autorizado }) {
  const ubicacion = useLocation();
  return autorizado ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />
  );
}

ProteccionAdmin.propTypes = { autorizado: PropTypes.bool.isRequired };
