import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { leer } from "./helpers.js";
import { eliminar, escribir } from "./data/storage.js";
import { db } from "./data/db.js";
import { calcularTotal } from "./utils.js";
import useProductos from "./hooks/useProductos.js";
import useCategorias from "./hooks/useCategorias.js";
import RutasAplicacion from "./routes/RutasAplicacion.jsx";

export default function App() {
  const navegar = useNavigate();
  const {
    productos,
    crear: crearProducto,
    actualizar: actualizarProducto,
    eliminar: eliminarProducto,
    recargar: recargarProductos,
  } = useProductos();
  const {
    categorias,
    crear: crearCategoria,
    actualizar: actualizarCategoriaBase,
    eliminar: eliminarCategoria,
  } = useCategorias();
  const [carrito, setCarrito] = useState(() =>
    leer("carritoSanMarcosReact", []),
  );
  const [oscuro, setOscuro] = useState(() =>
    leer("modoOscuroSanMarcos", false),
  );
  const [sesionAdmin, setSesionAdmin] = useState(() =>
    leer("sesionAdminSanMarcos", false),
  );
  const [usuarioActual, setUsuarioActual] = useState(() =>
    leer("sesionUsuarioSanMarcos", null),
  );
  const [ordenActual, setOrdenActual] = useState(() =>
    leer("ultimaOrdenSanMarcos", null),
  );
  const [borradorCheckout, setBorradorCheckout] = useState(() =>
    leer("borradorCheckoutSanMarcos", null),
  );

  useEffect(() => escribir("carritoSanMarcosReact", carrito), [carrito]);
  useEffect(() => {
    escribir("modoOscuroSanMarcos", oscuro);
    document.body.classList.toggle("dark-mode", oscuro);
  }, [oscuro]);

  const agregar = (producto) =>
    setCarrito((actual) => {
      const existente = actual.find((item) => item.id === producto.id);
      return existente
        ? actual.map((item) =>
            item.id === producto.id
              ? { ...item, cantidad: item.cantidad + 1 }
              : item,
          )
        : [...actual, { ...producto, cantidad: 1 }];
    });
  const cambiarCantidad = (id, cambio) =>
    setCarrito((actual) =>
      actual
        .map((item) =>
          item.id === id ? { ...item, cantidad: item.cantidad + cambio } : item,
        )
        .filter((item) => item.cantidad > 0),
    );
  const actualizarCategoria = (id, nombre) => {
    const resultado = actualizarCategoriaBase(id, nombre);
    recargarProductos();
    return resultado;
  };
  const iniciarAdmin = () => {
    const administrador = {
      name: "Administrador",
      apellidos: "San Marcos",
      email: "admin@duoc.cl",
      role: "administrador",
    };
    escribir("sesionAdminSanMarcos", true);
    escribir("sesionUsuarioSanMarcos", administrador);
    setSesionAdmin(true);
    setUsuarioActual(administrador);
  };
  const iniciarUsuario = (correo) => {
    const usuario =
      db.listarUsuarios().find((item) => item.email.toLowerCase() === correo) ||
      db.crearUsuario({
        name: correo.split("@")[0],
        apellidos: "",
        email: correo,
        role: "cliente",
      });
    escribir("sesionUsuarioSanMarcos", usuario);
    setUsuarioActual(usuario);
  };
  const procesarPago = (datos, aprobado) => {
    if (!carrito.length)
      throw new Error("No hay productos en el carrito para generar una orden.");
    const orden = db.crearOrden({
      cliente: {
        nombre: datos.nombre,
        apellidos: datos.apellidos,
        correo: datos.correo,
      },
      direccion: {
        calle: datos.calle,
        departamento: datos.departamento,
        region: datos.region,
        comuna: datos.comuna,
        indicaciones: datos.indicaciones,
      },
      items: carrito.map((item) => ({ ...item })),
      total: calcularTotal(carrito),
      estado: aprobado ? "Pagada" : "Pago rechazado",
      paymentStatus: aprobado ? "approved" : "rejected",
    });
    escribir("ultimaOrdenSanMarcos", orden);
    setOrdenActual(orden);
    escribir("borradorCheckoutSanMarcos", datos);
    setBorradorCheckout(datos);
    if (aprobado) {
      setCarrito([]);
      eliminar("borradorCheckoutSanMarcos");
      setBorradorCheckout(null);
      navegar("/pago-correcto");
    } else {
      navegar("/pago-error");
    }
  };
  const cerrarAdmin = () => {
    eliminar("sesionAdminSanMarcos");
    eliminar("sesionUsuarioSanMarcos");
    setSesionAdmin(false);
    setUsuarioActual(null);
  };

  return (
    <RutasAplicacion
      productos={productos}
      categorias={categorias}
      carrito={carrito}
      usuarioActual={usuarioActual}
      ordenActual={ordenActual}
      borradorCheckout={borradorCheckout}
      oscuro={oscuro}
      cambiarModo={() => setOscuro((actual) => !actual)}
      sesionAdmin={sesionAdmin}
      unidades={carrito.reduce((total, item) => total + item.cantidad, 0)}
      agregar={agregar}
      cambiarCantidad={cambiarCantidad}
      eliminarArticulo={(id) =>
        setCarrito((actual) => actual.filter((item) => item.id !== id))
      }
      vaciarCarrito={() => setCarrito([])}
      irCheckout={() => navegar("/checkout")}
      procesarPago={procesarPago}
      iniciarAdmin={iniciarAdmin}
      iniciarUsuario={iniciarUsuario}
      registrarUsuario={(datos) => db.crearUsuario(datos)}
      cerrarAdmin={cerrarAdmin}
      crearProducto={crearProducto}
      actualizarProducto={actualizarProducto}
      eliminarProducto={eliminarProducto}
      crearCategoria={crearCategoria}
      actualizarCategoria={actualizarCategoria}
      eliminarCategoria={eliminarCategoria}
    />
  );
}

App.propTypes = {};
