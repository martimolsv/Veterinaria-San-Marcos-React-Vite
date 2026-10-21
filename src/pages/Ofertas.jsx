import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import TarjetaProducto from "../components/TarjetaProducto.jsx";

export default function Ofertas({ productos, agregar }) {
  const ofertas = productos.filter(
    (producto) => Number(producto.descuento) > 0,
  );
  return (
    <main className="container py-5">
      <h1 className="page-title">Ofertas</h1>
      {ofertas.length ? (
        <div className="row g-4">
          {ofertas.map((producto) => (
            <div className="col-md-6 col-lg-4" key={producto.id}>
              <TarjetaProducto producto={producto} agregar={agregar} />
            </div>
          ))}
        </div>
      ) : (
        <div className="service-card p-4">
          <p>No hay ofertas activas en este momento.</p>
          <Link to="/productos">Explorar productos</Link>
        </div>
      )}
    </main>
  );
}

Ofertas.propTypes = {
  productos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      descuento: PropTypes.number,
    }),
  ).isRequired,
  agregar: PropTypes.func.isRequired,
};
