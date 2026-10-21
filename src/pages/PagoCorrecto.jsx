import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { dinero } from "../helpers.js";

export default function PagoCorrecto({ orden = null }) {
  if (!orden)
    return (
      <main className="container py-5">
        <h1 className="page-title">No hay una boleta reciente</h1>
        <Link to="/productos">Volver a la tienda</Link>
      </main>
    );
  const enviarCorreo = () =>
    window.alert(
      `Boleta ${orden.numero} enviada a ${orden.cliente.correo} (simulación).`,
    );
  return (
    <main className="container py-5">
      <section className="service-card p-4">
        <div className="alert alert-success">
          <h1 className="h3">¡Pago correcto!</h1>
          <p className="mb-0">Tu pedido fue registrado.</p>
        </div>
        <div id="boleta">
          <h2>Boleta {orden.numero}</h2>
          <p>Fecha: {new Date(orden.fecha).toLocaleString("es-CL")}</p>
          <p>
            Cliente: {orden.cliente.nombre} {orden.cliente.apellidos}
          </p>
          <p>Correo: {orden.cliente.correo}</p>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {orden.items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.cantidad}</td>
                    <td>
                      $
                      {dinero(
                        Math.round(
                          item.price * (1 - Number(item.descuento || 0) / 100),
                        ) * item.cantidad,
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h3 className="text-end">Total pagado: ${dinero(orden.total)}</h3>
          <p>
            Entrega: {orden.direccion.calle}, {orden.direccion.comuna},{" "}
            {orden.direccion.region}
          </p>
        </div>
        <div className="d-flex flex-wrap gap-2 mt-4">
          <button
            className="btn btn-outline-success"
            onClick={() => window.print()}
          >
            Imprimir boleta
          </button>
          <button className="btn btn-outline-success" onClick={enviarCorreo}>
            Enviar por correo (simulado)
          </button>
          <Link className="btn btn-success" to="/productos">
            Seguir comprando
          </Link>
        </div>
      </section>
    </main>
  );
}

PagoCorrecto.propTypes = {
  orden: PropTypes.shape({
    numero: PropTypes.string,
    fecha: PropTypes.string,
    cliente: PropTypes.shape({
      nombre: PropTypes.string,
      apellidos: PropTypes.string,
      correo: PropTypes.string,
    }),
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        name: PropTypes.string,
        cantidad: PropTypes.number,
        price: PropTypes.number,
        descuento: PropTypes.number,
      }),
    ),
    total: PropTypes.number,
    direccion: PropTypes.shape({
      calle: PropTypes.string,
      comuna: PropTypes.string,
      region: PropTypes.string,
    }),
  }),
};
