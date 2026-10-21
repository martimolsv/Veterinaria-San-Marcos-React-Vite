import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import TarjetaProducto from "../components/TarjetaProducto.jsx";

export default function CategoriaProductos({ productos, agregar }) {
  const { nombre } = useParams();
  const categoria = decodeURIComponent(nombre || "");
  const filtrados = productos.filter(
    (producto) => producto.category.toLowerCase() === categoria.toLowerCase(),
  );
  return (
    <main className="container py-5">
      <h1 className="page-title">{categoria}</h1>
      <div className="row g-4">
        {filtrados.map((producto) => (
          <div className="col-md-6 col-lg-4" key={producto.id}>
            <TarjetaProducto producto={producto} agregar={agregar} />
          </div>
        ))}
      </div>
      {!filtrados.length && (
        <p>
          No hay productos en esta categoría.{" "}
          <Link to="/categorias">Ver categorías</Link>
        </p>
      )}
    </main>
  );
}

CategoriaProductos.propTypes = {
  productos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      category: PropTypes.string.isRequired,
    }),
  ).isRequired,
  agregar: PropTypes.func.isRequired,
};
