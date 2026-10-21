import { useState } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate, useParams } from "react-router-dom";
import FormularioProducto from "../components/FormularioProducto.jsx";

export default function AdminProductoFormulario({
  productos,
  categorias,
  crear,
  actualizar,
}) {
  const { id } = useParams();
  const navegar = useNavigate();
  const producto = id ? productos.find((item) => String(item.id) === id) : null;
  const [error, setError] = useState("");

  function guardar(datos) {
    try {
      if (id) actualizar(id, datos);
      else
        crear({
          active: "No especificado",
          presentation: "Unidad",
          species: "Perro / Gato",
          ...datos,
        });
      navegar("/admin/productos");
      return true;
    } catch (problema) {
      setError(problema.message);
      return false;
    }
  }

  if (id && !producto)
    return (
      <section>
        <h1 className="page-title">Producto no encontrado</h1>
        <Link to="/admin/productos">Volver a productos</Link>
      </section>
    );
  return (
    <section>
      <h1 className="page-title">
        {id ? "Editar producto" : "Nuevo producto"}
      </h1>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <div className="admin-shell">
        <FormularioProducto
          key={producto?.id || "nuevo"}
          producto={producto}
          categorias={categorias.map((item) => item.name)}
          onGuardar={guardar}
          onCancelar={() => navegar("/admin/productos")}
        />
      </div>
    </section>
  );
}

AdminProductoFormulario.propTypes = {
  productos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    }),
  ).isRequired,
  categorias: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  crear: PropTypes.func.isRequired,
  actualizar: PropTypes.func.isRequired,
};
