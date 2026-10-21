import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { dinero } from "../helpers.js";
import { db } from "../data/db.js";

const productoPropType = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  name: PropTypes.string,
  category: PropTypes.string,
  stock: PropTypes.number,
  price: PropTypes.number,
});

const ordenPropType = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  numero: PropTypes.string,
  fecha: PropTypes.string,
  total: PropTypes.number,
  estado: PropTypes.string,
  paymentStatus: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      category: PropTypes.string,
      price: PropTypes.number,
      descuento: PropTypes.number,
      cantidad: PropTypes.number,
    }),
  ),
});

function AdminDashboard({ productos = [] } = {}) {
  const ordenes = db.listarOrdenes();
  const usuarios = db.listarUsuarios();
  const ventas = ordenes.filter(
    (item) => item.paymentStatus === "approved" || item.estado === "Pagada",
  );
  const criticos = productos.filter((producto) => producto.stock <= 5);

  return (
    <section>
      <h1 className="page-title">Panel de administración</h1>
      <div className="row g-3">
        <div className="col-sm-6 col-xl-3">
          <div className="admin-stat">
            <span>Compras pagadas</span>
            <strong>{ventas.length}</strong>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="admin-stat">
            <span>Productos</span>
            <strong>{productos.length}</strong>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="admin-stat">
            <span>Usuarios</span>
            <strong>{usuarios.length}</strong>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="admin-stat">
            <span>Stock crítico (≤ 5)</span>
            <strong>{criticos.length}</strong>
          </div>
        </div>
        <div className="col-12">
          <h2 className="h4 mt-3">Productos que requieren reposición</h2>
          {criticos.length ? (
            <ul>
              {criticos.map((item) => (
                <li key={item.id}>
                  {item.name}: {item.stock} unidades
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay productos con stock crítico.</p>
          )}
        </div>
      </div>
    </section>
  );
}

AdminDashboard.propTypes = {
  productos: PropTypes.arrayOf(productoPropType),
};

function AdminCriticos({ productos = [] } = {}) {
  const criticos = productos.filter((producto) => producto.stock <= 5);

  return (
    <section>
      <h1 className="page-title">Productos con stock crítico</h1>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Stock</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody>
            {criticos.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.stock}</td>
                <td>${dinero(item.price)}</td>
              </tr>
            ))}
            {!criticos.length && (
              <tr>
                <td colSpan="3">No hay productos con stock crítico.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

AdminCriticos.propTypes = {
  productos: PropTypes.arrayOf(productoPropType),
};

function AdminOrdenes({ ordenes = db.listarOrdenes() } = {}) {
  return (
    <section>
      <h1 className="page-title">Órdenes</h1>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Número</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Estado</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {ordenes.map((item) => (
              <tr key={item.id}>
                <td>{item.numero}</td>
                <td>{new Date(item.fecha).toLocaleDateString("es-CL")}</td>
                <td>${dinero(item.total)}</td>
                <td>{item.estado || "Pagada"}</td>
                <td>
                  <Link to={`/admin/ordenes/${item.numero}`}>Ver boleta</Link>
                </td>
              </tr>
            ))}
            {!ordenes.length && (
              <tr>
                <td colSpan="5">Aún no hay órdenes registradas.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

AdminOrdenes.propTypes = {
  ordenes: PropTypes.arrayOf(ordenPropType),
};

function AdminBoleta({ orden: ordenProp = undefined } = {}) {
  const { id } = useParams();
  const orden = ordenProp ?? db.obtenerOrden(id);

  return (
    <section>
      <h1 className="page-title">Detalle de orden{id ? ` #${id}` : ""}</h1>
      {orden ? (
        <div className="service-card p-4">
          <h2>Orden {orden.numero}</h2>
          <p>Fecha: {new Date(orden.fecha).toLocaleString("es-CL")}</p>
          <p>Total: ${dinero(orden.total)}</p>
          <ul>
            {orden.items?.map((item) => (
              <li key={item.id}>
                {item.name} × {item.cantidad}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No se encontró la orden solicitada.</p>
      )}
    </section>
  );
}

AdminBoleta.propTypes = {
  orden: ordenPropType,
};

function AdminReportes({ ordenes = db.listarOrdenes() } = {}) {
  const ventas = ordenes.filter(
    (item) => item.paymentStatus === "approved" || item.estado === "Pagada",
  );
  const ventasPorCategoria = ventas
    .flatMap((compra) => compra.items || [])
    .reduce((acumulado, item) => {
      const categoria = item.category || "Sin categoría";
      acumulado[categoria] =
        (acumulado[categoria] || 0) +
        Math.round(item.price * (1 - Number(item.descuento || 0) / 100)) *
          item.cantidad;
      return acumulado;
    }, {});
  const productosVendidos = ventas
    .flatMap((compra) => compra.items || [])
    .reduce((acumulado, item) => {
      acumulado[item.id] = {
        nombre: item.name,
        cantidad: (acumulado[item.id]?.cantidad || 0) + item.cantidad,
      };
      return acumulado;
    }, {});
  const masVendidos = Object.values(productosVendidos)
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 5);

  return (
    <section>
      <h1 className="page-title">Reportes</h1>
      <div className="row g-4">
        <div className="col-lg-6">
          <h2 className="h4">Ventas por categoría</h2>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Categoría</th>
                  <th>Ventas</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(ventasPorCategoria).map(
                  ([categoria, total]) => (
                    <tr key={categoria}>
                      <td>{categoria}</td>
                      <td>${dinero(total)}</td>
                    </tr>
                  ),
                )}
                {!Object.keys(ventasPorCategoria).length && (
                  <tr>
                    <td colSpan="2">Aún no hay ventas pagadas.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-lg-6">
          <h2 className="h4">Productos más vendidos</h2>
          <ol>
            {masVendidos.map((item, indice) => (
              <li key={`${item.nombre}-${indice}`}>
                {item.nombre}: {item.cantidad} unidades
              </li>
            ))}
          </ol>
          {!masVendidos.length && <p>Aún no hay productos vendidos.</p>}
        </div>
      </div>
    </section>
  );
}

AdminReportes.propTypes = {
  ordenes: PropTypes.arrayOf(ordenPropType),
};

function AdminPerfil({ alCerrar = () => {} } = {}) {
  return (
    <section>
      <h1 className="page-title">Perfil de administración</h1>
      <button className="btn btn-outline-danger" onClick={alCerrar}>
        Cerrar sesión de administrador
      </button>
    </section>
  );
}

AdminPerfil.propTypes = {
  alCerrar: PropTypes.func,
};

export {
  AdminBoleta,
  AdminCriticos,
  AdminDashboard,
  AdminOrdenes,
  AdminPerfil,
  AdminReportes,
};
