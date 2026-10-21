import PropTypes from "prop-types";
import { Outlet } from "react-router-dom";
import Encabezado from "../components/Encabezado.jsx";
import PiePagina from "../components/PiePagina.jsx";

export default function TiendaLayout({ unidades, oscuro, cambiarModo }) {
  return (
    <>
      <Encabezado
        unidades={unidades}
        oscuro={oscuro}
        cambiarModo={cambiarModo}
      />
      <Outlet />
      <PiePagina />
    </>
  );
}

TiendaLayout.propTypes = {
  unidades: PropTypes.number.isRequired,
  oscuro: PropTypes.bool.isRequired,
  cambiarModo: PropTypes.func.isRequired,
};
