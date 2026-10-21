import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { dinero } from "../helpers.js";
import FormularioProducto from "../components/FormularioProducto.jsx";
import TablaProductos from "../components/TablaProductos.jsx";

export default function Admin({
  productos,
  categorias,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
}) {
  const [edicion, setEdicion] = useState(null);
  const [error, setError] = useState("");
  const stockTotal = productos.reduce(
    (total, producto) => total + Number(producto.stock || 0),
    0,
  );
  const guardar = (datos) => {
    try {
      if (edicion) {
        actualizarProducto(edicion.id, datos);
        setEdicion(null);
      } else {
        crearProducto({
          active: "No especificado",
          presentation: "Unidad",
          species: "Perro / Gato",
          ...datos,
        });
      }
      setError("");
      return true;
    } catch (problema) {
      setError(problema.message);
      return false;
    }
  };
  const eliminar = (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este producto?")) return;
    try {
      eliminarProducto(id);
      setError("");
    } catch (problema) {
      setError(problema.message);
    }
    if (edicion?.id === id) setEdicion(null);
  };
  return (
    <main className="container py-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <h1 className="page-title">Administración</h1>
        <span className="badge text-bg-success">Vista admin</span>
      </div>
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="admin-stat">
            <span>Productos registrados</span>
            <strong>{productos.length}</strong>
          </div>
        </div>
        <div className="col-md-4">
          <div className="admin-stat">
            <span>Categorías</span>
            <strong>
              {new Set(productos.map((item) => item.category)).size}
            </strong>
          </div>
        </div>
        <div className="col-md-4">
          <div className="admin-stat">
            <span>Stock total</span>
            <strong>{dinero(stockTotal)}</strong>
          </div>
        </div>
      </div>
      <div className="admin-shell mb-4">
        <h2 className="h4">
          {edicion ? "Editar producto" : "Agregar producto"}
        </h2>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <FormularioProducto
          key={edicion?.id || "nuevo"}
          producto={edicion}
          categorias={categorias.map((categoria) => categoria.name)}
          onGuardar={guardar}
          onCancelar={() => setEdicion(null)}
        />
      </div>
      <div className="d-flex justify-content-between align-items-center mt-4">
        <h2 className="h4">Listado de productos</h2>
        <Link className="btn btn-outline-success" to="/admin/productos/nuevo">
          Nuevo producto
        </Link>
      </div>
      <TablaProductos
        productos={productos}
        alEditar={setEdicion}
        alEliminar={eliminar}
      />
    </main>
  );
}

Admin.propTypes = {
  productos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      stock: PropTypes.number.isRequired,
    }),
  ).isRequired,
  categorias: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  crearProducto: PropTypes.func.isRequired,
  actualizarProducto: PropTypes.func.isRequired,
  eliminarProducto: PropTypes.func.isRequired,
};
