import { useCallback, useState } from "react";
import { db } from "../data/db.js";

export default function useProductos() {
  const [productos, setProductos] = useState(() => db.listarProductos());
  const recargar = useCallback(() => setProductos(db.listarProductos()), []);
  const crear = useCallback(
    (datos) => {
      const resultado = db.crearProducto(datos);
      recargar();
      return resultado;
    },
    [recargar],
  );
  const actualizar = useCallback(
    (id, datos) => {
      const resultado = db.actualizarProducto(id, datos);
      recargar();
      return resultado;
    },
    [recargar],
  );
  const eliminar = useCallback(
    (id) => {
      const resultado = db.eliminarProducto(id);
      recargar();
      return resultado;
    },
    [recargar],
  );
  return { productos, crear, actualizar, eliminar, recargar };
}
