import PropTypes from "prop-types";
import { useState } from "react";

const categoriasIniciales = [
  "Antibióticos",
  "Antiparasitarios",
  "Antiinflamatorios",
  "Dermatología",
  "Digestivo",
  "Cardíaco",
  "Analgésicos",
  "Vacunas",
  "Suplementos",
  "Otros",
];

export default function FormularioProducto({
  producto = null,
  categorias = categoriasIniciales,
  onGuardar,
  onCancelar = undefined,
}) {
  const [datos, setDatos] = useState(
    () =>
      producto || {
        name: "",
        category: "Otros",
        price: "",
        stock: "",
        descuento: "",
      },
  );
  const editar = Boolean(producto);
  const actualizar = (campo, valor) =>
    setDatos((actuales) => ({ ...actuales, [campo]: valor }));
  const opcionesCategoria = [...new Set([datos.category, ...categorias])];

  function enviar(evento) {
    evento.preventDefault();
    if (
      !datos.name.trim() ||
      Number(datos.price) <= 0 ||
      datos.stock === "" ||
      Number(datos.stock) < 0
    )
      return;
    const guardado = onGuardar({
      ...datos,
      name: datos.name.trim(),
      price: Number(datos.price),
      stock: Number(datos.stock),
      descuento: datos.descuento === "" ? undefined : Number(datos.descuento),
    });
    if (!editar && guardado !== false)
      setDatos({
        name: "",
        category: "Otros",
        price: "",
        stock: "",
        descuento: "",
      });
  }

  return (
    <form className="row g-3" onSubmit={enviar}>
      <div className="col-md-4">
        <label className="form-label">Nombre</label>
        <input
          className="form-control"
          value={datos.name}
          onChange={(e) => actualizar("name", e.target.value)}
          required
        />
      </div>
      <div className="col-md-3">
        <label className="form-label">Categoría</label>
        <select
          className="form-select"
          value={datos.category}
          onChange={(e) => actualizar("category", e.target.value)}
        >
          {opcionesCategoria.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>
      <div className="col-md-2">
        <label className="form-label">Precio ($)</label>
        <input
          type="number"
          min="1"
          className="form-control"
          value={datos.price}
          onChange={(e) => actualizar("price", e.target.value)}
          required
        />
      </div>
      <div className="col-md-1">
        <label className="form-label">Stock</label>
        <input
          type="number"
          min="0"
          className="form-control"
          value={datos.stock}
          onChange={(e) => actualizar("stock", e.target.value)}
          required
        />
      </div>
      <div className="col-md-2">
        <label className="form-label">Descuento (%)</label>
        <input
          type="number"
          min="0"
          max="100"
          className="form-control"
          value={datos.descuento ?? ""}
          onChange={(e) => actualizar("descuento", e.target.value)}
        />
      </div>
      <div className="col-md-2 d-flex align-items-end">
        <button className="btn btn-success w-100" type="submit">
          {editar ? "Guardar cambios" : "Agregar"}
        </button>
      </div>
      {editar && (
        <div className="col-12">
          <button
            className="btn btn-secondary"
            type="button"
            onClick={onCancelar}
          >
            Cancelar
          </button>
        </div>
      )}
    </form>
  );
}

FormularioProducto.propTypes = {
  producto: PropTypes.shape({
    name: PropTypes.string,
    category: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    stock: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    descuento: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  categorias: PropTypes.arrayOf(PropTypes.string),
  onGuardar: PropTypes.func.isRequired,
  onCancelar: PropTypes.func,
};
