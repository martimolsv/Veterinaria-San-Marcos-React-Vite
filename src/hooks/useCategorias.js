import { useCallback, useState } from "react";
import { db } from "../data/db.js";

export default function useCategorias() {
  const [categorias, setCategorias] = useState(() => db.listarCategorias());
  const recargar = useCallback(() => setCategorias(db.listarCategorias()), []);
  const crear = useCallback(
    (nombre) => {
      const resultado = db.crearCategoria(nombre);
      recargar();
      return resultado;
    },
    [recargar],
  );
  const actualizar = useCallback(
    (id, nombre) => {
      const resultado = db.actualizarCategoria(id, nombre);
      recargar();
      return resultado;
    },
    [recargar],
  );
  const eliminar = useCallback(
    (id) => {
      const resultado = db.eliminarCategoria(id);
      recargar();
      return resultado;
    },
    [recargar],
  );
  return { categorias, crear, actualizar, eliminar, recargar };
}
