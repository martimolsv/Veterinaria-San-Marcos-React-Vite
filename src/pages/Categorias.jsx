import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default function Categorias({ categorias, productos }) {
  return (
    <main className="container py-5">
      <h1 className="page-title">Categorías</h1>
      <div className="row g-3">
        {categorias.map((categoria) => (
          <div className="col-sm-6 col-lg-4" key={categoria.id}>
            <Link
              className="service-card d-block h-100"
              to={`/categorias/${encodeURIComponent(categoria.name)}`}
            >
              <h2 className="h4">{categoria.name}</h2>
              <p className="mb-0">
                {
                  productos.filter(
                    (producto) => producto.category === categoria.name,
                  ).length
                }{" "}
                productos
              </p>
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}

Categorias.propTypes = {
  categorias: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  productos: PropTypes.arrayOf(
    PropTypes.shape({ category: PropTypes.string.isRequired }),
  ).isRequired,
};
