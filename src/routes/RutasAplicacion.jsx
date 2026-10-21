import PropTypes from "prop-types";
import { Navigate, Route, Routes } from "react-router-dom";
import TiendaLayout from "../layouts/TiendaLayout.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";
import ProteccionAdmin from "../components/ProteccionAdmin.jsx";
import Inicio from "../pages/Inicio.jsx";
import Productos from "../pages/Productos.jsx";
import Servicios from "../pages/Servicios.jsx";
import Carrito from "../pages/Carrito.jsx";
import Admin from "../pages/Admin.jsx";
import Formulario from "../pages/Formulario.jsx";
import Informacion from "../pages/Informacion.jsx";
import DetalleProducto from "../pages/DetalleProducto.jsx";
import Categorias from "../pages/Categorias.jsx";
import CategoriaProductos from "../pages/CategoriaProductos.jsx";
import Ofertas from "../pages/Ofertas.jsx";
import Blog from "../pages/Blog.jsx";
import DetalleBlog from "../pages/DetalleBlog.jsx";
import PaginaInformativa from "../pages/PaginaInformativa.jsx";
import NoEncontrada from "../pages/NoEncontrada.jsx";
import {
  AdminBoleta,
  AdminCriticos,
  AdminDashboard,
  AdminOrdenes,
  AdminPerfil,
  AdminReportes,
} from "../pages/AdminSeccion.jsx";
import AdminCategorias from "../pages/AdminCategorias.jsx";
import AdminUsuarios from "../pages/AdminUsuarios.jsx";
import AdminProductoFormulario from "../pages/AdminProductoFormulario.jsx";
import Checkout from "../pages/Checkout.jsx";
import PagoCorrecto from "../pages/PagoCorrecto.jsx";
import PagoError from "../pages/PagoError.jsx";

export default function RutasAplicacion({
  productos,
  categorias,
  carrito,
  usuarioActual = null,
  ordenActual = null,
  borradorCheckout = null,
  oscuro,
  cambiarModo,
  sesionAdmin,
  unidades,
  agregar,
  cambiarCantidad,
  eliminarArticulo,
  vaciarCarrito,
  irCheckout,
  procesarPago,
  iniciarAdmin,
  iniciarUsuario,
  registrarUsuario,
  cerrarAdmin,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
}) {
  return (
    <Routes>
      <Route
        element={
          <TiendaLayout
            unidades={unidades}
            oscuro={oscuro}
            cambiarModo={cambiarModo}
          />
        }
      >
        <Route index element={<Inicio />} />
        <Route
          path="productos"
          element={<Productos productos={productos} agregar={agregar} />}
        />
        <Route
          path="productos/:id"
          element={<DetalleProducto productos={productos} agregar={agregar} />}
        />
        <Route
          path="categorias"
          element={<Categorias categorias={categorias} productos={productos} />}
        />
        <Route
          path="categorias/:nombre"
          element={
            <CategoriaProductos productos={productos} agregar={agregar} />
          }
        />
        <Route
          path="ofertas"
          element={<Ofertas productos={productos} agregar={agregar} />}
        />
        <Route path="servicios" element={<Servicios />} />
        <Route
          path="carrito"
          element={
            <Carrito
              carrito={carrito}
              cambiarCantidad={cambiarCantidad}
              eliminar={eliminarArticulo}
              vaciar={vaciarCarrito}
              finalizar={irCheckout}
            />
          }
        />
        <Route
          path="checkout"
          element={
            <Checkout
              carrito={carrito}
              usuario={usuarioActual}
              borrador={borradorCheckout}
              onPagar={procesarPago}
            />
          }
        />
        <Route
          path="pago-correcto"
          element={<PagoCorrecto orden={ordenActual} />}
        />
        <Route path="pago-error" element={<PagoError orden={ordenActual} />} />
        <Route
          path="registro"
          element={
            <Formulario
              tipo="registro"
              alIniciarAdmin={iniciarAdmin}
              alIniciarUsuario={iniciarUsuario}
              alRegistrar={registrarUsuario}
            />
          }
        />
        <Route
          path="login"
          element={
            <Formulario
              tipo="login"
              alIniciarAdmin={iniciarAdmin}
              alIniciarUsuario={iniciarUsuario}
              alRegistrar={registrarUsuario}
            />
          }
        />
        <Route path="nosotros" element={<Informacion pagina="nosotros" />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:id" element={<DetalleBlog />} />
        <Route
          path="contacto"
          element={
            <PaginaInformativa
              titulo="Contacto"
              mensaje="Estamos en Álvarez 2366, Chorrillos, Viña del Mar. Escríbenos para resolver tus consultas."
            />
          }
        />
        <Route path="*" element={<NoEncontrada />} />
      </Route>
      <Route element={<ProteccionAdmin autorizado={sesionAdmin} />}>
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard productos={productos} />} />
          <Route path="ordenes" element={<AdminOrdenes />} />
          <Route path="ordenes/:id" element={<AdminBoleta />} />
          <Route
            path="productos"
            element={
              <Admin
                productos={productos}
                categorias={categorias}
                crearProducto={crearProducto}
                actualizarProducto={actualizarProducto}
                eliminarProducto={eliminarProducto}
              />
            }
          />
          <Route
            path="productos/nuevo"
            element={
              <AdminProductoFormulario
                productos={productos}
                categorias={categorias}
                crear={crearProducto}
                actualizar={actualizarProducto}
              />
            }
          />
          <Route
            path="productos/criticos"
            element={<AdminCriticos productos={productos} />}
          />
          <Route
            path="productos/:id/editar"
            element={
              <AdminProductoFormulario
                productos={productos}
                categorias={categorias}
                crear={crearProducto}
                actualizar={actualizarProducto}
              />
            }
          />
          <Route
            path="categorias"
            element={
              <AdminCategorias
                categorias={categorias}
                productos={productos}
                crear={crearCategoria}
                actualizar={actualizarCategoria}
                eliminar={eliminarCategoria}
              />
            }
          />
          <Route path="usuarios" element={<AdminUsuarios />} />
          <Route path="usuarios/nuevo" element={<AdminUsuarios />} />
          <Route path="usuarios/:id/editar" element={<AdminUsuarios />} />
          <Route path="usuarios/:id/historial" element={<AdminUsuarios />} />
          <Route path="reportes" element={<AdminReportes />} />
          <Route
            path="perfil"
            element={<AdminPerfil alCerrar={cerrarAdmin} />}
          />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

RutasAplicacion.propTypes = {
  productos: PropTypes.array.isRequired,
  categorias: PropTypes.array.isRequired,
  carrito: PropTypes.array.isRequired,
  usuarioActual: PropTypes.object,
  ordenActual: PropTypes.object,
  borradorCheckout: PropTypes.object,
  oscuro: PropTypes.bool.isRequired,
  cambiarModo: PropTypes.func.isRequired,
  sesionAdmin: PropTypes.bool.isRequired,
  unidades: PropTypes.number.isRequired,
  agregar: PropTypes.func.isRequired,
  cambiarCantidad: PropTypes.func.isRequired,
  eliminarArticulo: PropTypes.func.isRequired,
  vaciarCarrito: PropTypes.func.isRequired,
  irCheckout: PropTypes.func.isRequired,
  procesarPago: PropTypes.func.isRequired,
  iniciarAdmin: PropTypes.func.isRequired,
  iniciarUsuario: PropTypes.func.isRequired,
  registrarUsuario: PropTypes.func.isRequired,
  cerrarAdmin: PropTypes.func.isRequired,
  crearProducto: PropTypes.func.isRequired,
  actualizarProducto: PropTypes.func.isRequired,
  eliminarProducto: PropTypes.func.isRequired,
  crearCategoria: PropTypes.func.isRequired,
  actualizarCategoria: PropTypes.func.isRequired,
  eliminarCategoria: PropTypes.func.isRequired,
};
