import { useState } from "react";
import PropTypes from "prop-types";

export default function AdminCategorias({
  categorias,
  productos,
  crear,
  actualizar,
  eliminar,
}) {
  const [nombre, setNombre] = useState("");
  const [edicion, setEdicion] = useState(null);
  const [error, setError] = useState("");

  function guardar(evento) {
    evento.preventDefault();
    try {
      if (edicion) actualizar(edicion.id, nombre);
      else crear(nombre);
      setNombre("");
      setEdicion(null);
      setError("");
    } catch (problema) {
      setError(problema.message);
    }
  }

  function borrar(id) {
    try {
      eliminar(id);
      setError("");
    } catch (problema) {
      setError(problema.message);
    }
  }

  return (
    <section>
      <h1 className="page-title">Categorías</h1>
      <form className="row g-2 mb-3" onSubmit={guardar}>
        <div className="col-md-8">
          <label className="form-label" htmlFor="nombreCategoria">
            Nombre
          </label>
          <input
            id="nombreCategoria"
            className="form-control"
            value={nombre}
            onChange={(evento) => setNombre(evento.target.value)}
            required
          />
        </div>
        <div className="col-md-4 d-flex align-items-end gap-2">
          <button className="btn btn-success" type="submit">
            {edicion ? "Guardar" : "Agregar categoría"}
          </button>
          {edicion && (
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => {
                setEdicion(null);
                setNombre("");
              }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Categoría</th>
              <th>Productos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.id}>
                <td>{categoria.name}</td>
                <td>
                  {
                    productos.filter(
                      (producto) => producto.category === categoria.name,
                    ).length
                  }
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-success me-2"
                    onClick={() => {
                      setEdicion(categoria);
                      setNombre(categoria.name);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => borrar(categoria.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

AdminCategorias.propTypes = {
  categorias: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  productos: PropTypes.arrayOf(
    PropTypes.shape({ category: PropTypes.string.isRequired }),
  ).isRequired,
  crear: PropTypes.func.isRequired,
  actualizar: PropTypes.func.isRequired,
  eliminar: PropTypes.func.isRequired,
};
