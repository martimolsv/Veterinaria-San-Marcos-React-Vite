import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import CampoFormulario from "../components/CampoFormulario.jsx";
import { regiones, comunasPorRegion } from "../data/regiones.js";
import { dinero } from "../helpers.js";
import { calcularPrecioFinal, calcularTotal } from "../utils.js";

const datosVacios = {
  nombre: "",
  apellidos: "",
  correo: "",
  calle: "",
  departamento: "",
  region: "",
  comuna: "",
  indicaciones: "",
};

function datosIniciales(usuario, borrador) {
  return {
    ...datosVacios,
    ...borrador,
    nombre: borrador?.nombre ?? usuario?.name ?? "",
    apellidos:
      borrador?.apellidos ?? usuario?.apellidos ?? usuario?.lastName ?? "",
    correo: borrador?.correo ?? usuario?.email ?? "",
  };
}

export default function Checkout({
  carrito,
  usuario = null,
  borrador = null,
  onPagar,
}) {
  const [datos, setDatos] = useState(() => datosIniciales(usuario, borrador));
  const [errores, setErrores] = useState({});
  const [errorPago, setErrorPago] = useState("");
  const actualizar = (campo, valor) =>
    setDatos((actual) => ({
      ...actual,
      [campo]: valor,
      ...(campo === "region" ? { comuna: "" } : {}),
    }));
  const total = calcularTotal(carrito);

  function procesar(evento) {
    evento.preventDefault();
    const nuevosErrores = {};
    ["nombre", "apellidos", "calle", "region", "comuna"].forEach((campo) => {
      if (!datos[campo].trim())
        nuevosErrores[campo] = "Este campo es obligatorio.";
    });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo.trim()))
      nuevosErrores.correo = "Ingresa un correo electrónico válido.";
    setErrores(nuevosErrores);
    setErrorPago("");
    if (Object.keys(nuevosErrores).length) return;
    try {
      onPagar(datos, evento.nativeEvent.submitter?.value !== "rechazado");
    } catch (problema) {
      setErrorPago(problema.message);
    }
  }

  if (!carrito.length)
    return (
      <main className="container py-5">
        <h1 className="page-title">Finalizar compra</h1>
        <p>Tu carrito está vacío.</p>
        <Link className="btn btn-success" to="/productos">
          Ver productos
        </Link>
      </main>
    );
  const comunas = datos.region ? comunasPorRegion[datos.region] : [];

  return (
    <main className="container py-5">
      <h1 className="page-title">Finalizar compra</h1>
      <div className="row g-4">
        <section className="col-lg-7">
          <div className="service-card p-4">
            <h2 className="h4">Datos del cliente y entrega</h2>
            {errorPago && (
              <div className="alert alert-danger" role="alert">
                {errorPago}
              </div>
            )}
            <form onSubmit={procesar} noValidate>
              <div className="row g-2">
                <div className="col-md-6">
                  <CampoFormulario
                    id="nombre"
                    label="Nombre"
                    value={datos.nombre}
                    onChange={(valor) => actualizar("nombre", valor)}
                    error={errores.nombre}
                    required
                    autoComplete="given-name"
                  />
                </div>
                <div className="col-md-6">
                  <CampoFormulario
                    id="apellidos"
                    label="Apellidos"
                    value={datos.apellidos}
                    onChange={(valor) => actualizar("apellidos", valor)}
                    error={errores.apellidos}
                    required
                    autoComplete="family-name"
                  />
                </div>
              </div>
              <CampoFormulario
                id="correo"
                label="Correo electrónico"
                type="email"
                value={datos.correo}
                onChange={(valor) => actualizar("correo", valor)}
                error={errores.correo}
                required
                autoComplete="email"
              />
              <CampoFormulario
                id="calle"
                label="Calle y número"
                value={datos.calle}
                onChange={(valor) => actualizar("calle", valor)}
                error={errores.calle}
                required
                autoComplete="street-address"
              />
              <CampoFormulario
                id="departamento"
                label="Departamento (opcional)"
                value={datos.departamento}
                onChange={(valor) => actualizar("departamento", valor)}
              />
              <div className="row g-2">
                <div className="col-md-6">
                  <CampoFormulario
                    id="region"
                    label="Región"
                    value={datos.region}
                    onChange={(valor) => actualizar("region", valor)}
                    error={errores.region}
                    options={regiones}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <CampoFormulario
                    id="comuna"
                    label="Comuna"
                    value={datos.comuna}
                    onChange={(valor) => actualizar("comuna", valor)}
                    error={errores.comuna}
                    options={comunas}
                    required
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="indicaciones">
                  Indicaciones (opcional)
                </label>
                <textarea
                  id="indicaciones"
                  className="form-control"
                  rows="3"
                  value={datos.indicaciones}
                  onChange={(evento) =>
                    actualizar("indicaciones", evento.target.value)
                  }
                />
              </div>
              <div className="d-flex flex-wrap gap-2">
                <button
                  className="btn btn-success"
                  type="submit"
                  value="aprobado"
                >
                  Simular pago aprobado
                </button>
                <button
                  className="btn btn-outline-danger"
                  type="submit"
                  value="rechazado"
                >
                  Simular pago rechazado
                </button>
              </div>
            </form>
          </div>
        </section>
        <aside className="col-lg-5">
          <div className="service-card p-4">
            <h2 className="h4">Resumen del pedido</h2>
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cant.</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {carrito.map((producto) => (
                    <tr key={producto.id}>
                      <td>{producto.name}</td>
                      <td>{producto.cantidad}</td>
                      <td>
                        $
                        {dinero(
                          calcularPrecioFinal(producto) * producto.cantidad,
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h3 className="h5 text-end">Total: ${dinero(total)}</h3>
            <Link to="/carrito">Volver al carrito</Link>
          </div>
        </aside>
      </div>
    </main>
  );
}

Checkout.propTypes = {
  carrito: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      cantidad: PropTypes.number.isRequired,
    }),
  ).isRequired,
  usuario: PropTypes.shape({
    name: PropTypes.string,
    apellidos: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
  }),
  borrador: PropTypes.shape({
    nombre: PropTypes.string,
    apellidos: PropTypes.string,
    correo: PropTypes.string,
    calle: PropTypes.string,
    region: PropTypes.string,
    comuna: PropTypes.string,
  }),
  onPagar: PropTypes.func.isRequired,
};
