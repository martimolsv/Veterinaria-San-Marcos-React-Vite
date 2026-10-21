import { useState } from "react";
import PropTypes from "prop-types";
import { servicios } from "../data/catalogos.js";
import { dinero } from "../helpers.js";
import { filtrarPorTextoYCategoria } from "../utils.js";

export default function Servicios() {
  const [texto, setTexto] = useState("");
  const [categoria, setCategoria] = useState("");
  const filtrados = filtrarPorTextoYCategoria(servicios, texto, categoria);
  const categorias = [
    ...new Set(servicios.map((servicio) => servicio.category)),
  ];
  return (
    <main className="container py-5">
      <h1 className="page-title">Servicios veterinarios</h1>
      <p>Consulta nuestros servicios y precios referenciales.</p>
      <div className="row g-3 mb-4">
        <div className="col-md-8">
          <input
            className="form-control"
            placeholder="Buscar servicio..."
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
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
      </div>
      <div className="table-responsive admin-table">
        <table className="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th>Código</th>
              <th>Categoría</th>
              <th>Servicio</th>
              <th>Especie</th>
              <th>Duración</th>
              <th>Precio</th>
              <th>Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((servicio) => (
              <tr key={servicio.id}>
                <td>{servicio.id}</td>
                <td>{servicio.category}</td>
                <td>{servicio.name}</td>
                <td>{servicio.species}</td>
                <td>{servicio.duration}</td>
                <td>${dinero(servicio.price)}</td>
                <td>{servicio.notes || "—"}</td>
              </tr>
            ))}
            {!filtrados.length && (
              <tr>
                <td colSpan="7" className="text-center">
                  No hay servicios que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

Servicios.propTypes = {};
