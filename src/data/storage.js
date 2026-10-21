export function leer(clave, respaldo) {
  const contenido = localStorage.getItem(clave);
  if (contenido === null) return respaldo;
  try {
    return JSON.parse(contenido);
  } catch (error) {
    console.error(
      `No se pudo interpretar el almacenamiento "${clave}".`,
      error,
    );
    return respaldo;
  }
}

export function escribir(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch (error) {
    throw new Error(
      `No se pudo guardar "${clave}" en el almacenamiento local.`,
      { cause: error },
    );
  }
}

export function eliminar(clave) {
  localStorage.removeItem(clave);
}
