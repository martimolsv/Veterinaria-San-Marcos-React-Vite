import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { db } from "../data/db.js";
import { dinero } from "../helpers.js";

const usuarioVacio = { name: "", email: "", role: "cliente" };

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState(() => db.listarUsuarios());
  const [ordenes] = useState(() => db.listarOrdenes());
  const [datos, setDatos] = useState(usuarioVacio);
  const [error, setError] = useState("");
  const { id } = useParams();
  const ubicacion = useLocation();
  const navegar = useNavigate();
  const usuario = usuarios.find((item) => String(item.id) === id);
  const esNuevo = ubicacion.pathname === "/admin/usuarios/nuevo";
  const esEdicion = /^\/admin\/usuarios\/[^/]+\/editar$/.test(
    ubicacion.pathname,
  );
  const esHistorial = /^\/admin\/usuarios\/[^/]+\/historial$/.test(
    ubicacion.pathname,
  );
  const esFormulario = esNuevo || esEdicion;
  const actualizarCampo = (campo, valor) =>
    setDatos((actual) => ({ ...actual, [campo]: valor }));
  const recargar = () => setUsuarios(db.listarUsuarios());

  useEffect(() => {
    if (esNuevo) {
      setDatos(usuarioVacio);
      setError("");
    } else if (esEdicion) {
      setDatos(
        usuario
          ? { name: usuario.name, email: usuario.email, role: usuario.role }
          : usuarioVacio,
      );
      setError("");
    }
  }, [esNuevo, esEdicion, usuario]);

  function guardar(evento) {
    evento.preventDefault();
    try {
      if (esEdicion) db.actualizarUsuario(id, datos);
      else db.crearUsuario(datos);
      setDatos(usuarioVacio);
      setError("");
      recargar();
      navegar("/admin/usuarios");
    } catch (problema) {
      setError(problema.message);
    }
  }

  function borrar(usuarioId) {
    try {
      db.eliminarUsuario(usuarioId);
      recargar();
      setError("");
    } catch (problema) {
      setError(problema.message);
    }
  }

  if (esHistorial) {
    const compras = ordenes.filter(
      (orden) => orden.cliente?.correo === usuario?.email,
    );
    return (
      <section>
        <h1 className="page-title">
          Historial de {usuario?.name || "usuario no encontrado"}
        </h1>
        {compras.map((orden) => (
          <p key={orden.id}>
            <Link to={`/admin/ordenes/${orden.numero}`}>{orden.numero}</Link> ·{" "}
            {new Date(orden.fecha).toLocaleDateString("es-CL")} · $
            {dinero(orden.total)}
          </p>
        ))}
        {!compras.length && <p>Este usuario aún no tiene órdenes.</p>}
        <Link to="/admin/usuarios">Volver a usuarios</Link>
      </section>
    );
  }

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="page-title">
          {esNuevo
            ? "Nuevo usuario"
            : esEdicion
              ? "Editar usuario"
              : "Usuarios"}
        </h1>
        {!esFormulario && (
          <Link className="btn btn-success" to="/admin/usuarios/nuevo">
            Nuevo usuario
          </Link>
        )}
      </div>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {esEdicion && !usuario && <p>No se encontró el usuario solicitado.</p>}
      {esFormulario && (!esEdicion || usuario) && (
        <form className="row g-2 mb-4" onSubmit={guardar} noValidate>
          <div className="col-md-4">
            <label className="form-label" htmlFor="nombreUsuario">
              Nombre
            </label>
            <input
              id="nombreUsuario"
              className={`form-control ${error === "El nombre del usuario es obligatorio." ? "is-invalid" : ""}`}
              value={datos.name}
              onChange={(evento) =>
                actualizarCampo("name", evento.target.value)
              }
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label" htmlFor="correoUsuario">
              Correo
            </label>
            <input
              id="correoUsuario"
              type="email"
              className={`form-control ${error === "El correo del usuario no es válido." ? "is-invalid" : ""}`}
              value={datos.email}
              onChange={(evento) =>
                actualizarCampo("email", evento.target.value)
              }
              required
            />
          </div>
          <div className="col-md-2">
            <label className="form-label" htmlFor="rolUsuario">
              Rol
            </label>
            <select
              id="rolUsuario"
              className="form-select"
              value={datos.role}
              onChange={(evento) =>
                actualizarCampo("role", evento.target.value)
              }
            >
              <option value="cliente">Cliente</option>
              <option value="administrador">Administrador</option>
            </select>
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <button className="btn btn-success w-100">
              {esEdicion ? "Guardar" : "Crear usuario"}
            </button>
          </div>
          {error === "El nombre del usuario es obligatorio." && (
            <div className="col-md-4 invalid-feedback d-block">
              El nombre es obligatorio.
            </div>
          )}
          {error === "El correo del usuario no es válido." && (
            <div className="col-md-4 offset-md-4 invalid-feedback d-block">
              Ingresa un correo válido.
            </div>
          )}
        </form>
      )}
      {!esFormulario && (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.role}</td>
                  <td>
                    <Link
                      className="btn btn-sm btn-outline-success me-2"
                      to={`/admin/usuarios/${item.id}/editar`}
                    >
                      Editar
                    </Link>
                    <Link
                      className="btn btn-sm btn-outline-primary me-2"
                      to={`/admin/usuarios/${item.id}/historial`}
                    >
                      Historial
                    </Link>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => borrar(item.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {!usuarios.length && (
                <tr>
                  <td colSpan="4">Aún no hay usuarios registrados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {esFormulario && <Link to="/admin/usuarios">Cancelar</Link>}
    </section>
  );
}

AdminUsuarios.propTypes = {};
