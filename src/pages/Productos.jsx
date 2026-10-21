import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useSearchParams } from "react-router-dom";
import { filtrarPorTextoYCategoria } from "../utils.js";
import TarjetaProducto from "../components/TarjetaProducto.jsx";

export default function Productos({ productos, agregar }) {
  const [parametros] = useSearchParams();
  const [texto, setTexto] = useState(() => parametros.get("busqueda") || "");
  const [categoria, setCategoria] = useState("");
  const [precioMinimo, setPrecioMinimo] = useState("");
  const [precioMaximo, setPrecioMaximo] = useState("");
  useEffect(() => setTexto(parametros.get("busqueda") || ""), [parametros]);
  const filtrados = filtrarPorTextoYCategoria(
    productos,
    texto,
    categoria,
    precioMinimo,
    precioMaximo,
  );
  const categorias = [
    ...new Set(productos.map((producto) => producto.category)),
  ];
  return (
    <main className="container py-5">
      <h1 className="page-title">Catálogo de productos</h1>
      <p>Consulta los productos disponibles para tus mascotas.</p>
      <div className="row g-3 mb-4">
        <div className="col-md-5">
          <label className="form-label" htmlFor="buscarProducto">
            Buscar
          </label>
          <input
            id="buscarProducto"
            className="form-control"
            placeholder="Buscar producto..."
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label" htmlFor="filtrarCategoria">
            Categoría
          </label>
          <select
            id="filtrarCategoria"
            className="form-select"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categorias.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <label className="form-label" htmlFor="precioMinimo">
            Precio mínimo
          </label>
          <input
            id="precioMinimo"
            type="number"
            min="0"
            className="form-control"
            value={precioMinimo}
            onChange={(e) => setPrecioMinimo(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <label className="form-label" htmlFor="precioMaximo">
            Precio máximo
          </label>
          <input
            id="precioMaximo"
            type="number"
            min="0"
            className="form-control"
            value={precioMaximo}
            onChange={(e) => setPrecioMaximo(e.target.value)}
          />
        </div>
      </div>
      <div className="row g-4">
        {filtrados.map((producto) => (
          <div className="col-md-6 col-lg-4" key={producto.id}>
            <TarjetaProducto producto={producto} agregar={agregar} />
          </div>
        ))}
        {!filtrados.length && (
          <p>No hay productos que coincidan con la búsqueda.</p>
        )}
      </div>
    </main>
  );
}

Productos.propTypes = {
  productos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
    }),
  ).isRequired,
  agregar: PropTypes.func.isRequired,
};
