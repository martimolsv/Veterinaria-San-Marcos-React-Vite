# Pruebas y cobertura

## Pruebas ejecutadas

`npm test` ejecuta Jasmine en ChromeHeadless mediante Karma. Las pruebas de componentes se renderizan con React Testing Library y `@testing-library/dom`.

| Archivo | Qué verifica | Tipo |
| --- | --- | --- |
| `src/tests/utils.spec.js` | Total y unidades del carrito, descuentos, validación de correo DUOC y filtros de texto/categoría/precio | Unitarias, lógica pura |
| `src/tests/componentes.spec.jsx` | Renderizado de productos, estado vacío, callback de la tarjeta, campos controlados, validación de checkout y selección de pago | Componentes React |
| `src/tests/db.spec.js` | CRUD de productos, categorías, usuarios y órdenes; continuidad del catálogo legado y restricciones | Unitarias, persistencia simulada |
| `src/tests/navegacion.spec.jsx` | Inicio, catálogo, detalle, protección de administración, carrito y flujo de pago rechazado/reintentado/aprobado | Integración y navegación |
| `src/tests/admin.spec.jsx` | Órdenes, reportes y perfil vacíos; stock crítico; protección de sesión; lista, alta, edición e historial de usuarios | Integración y navegación administrativa |

**Total: 29 pruebas.** Cada suite limpia `localStorage` o los datos mockeados después de sus casos. Los componentes de React se desmontan entre pruebas.

## Configuración del entorno

- `karma.conf.cjs` usa Jasmine, Webpack 5, `babel-loader`, `@babel/preset-env` y `@babel/preset-react` con runtime automático para compilar JSX.
- `babel-plugin-istanbul` instrumenta los módulos de aplicación importados por las pruebas; `karma-coverage` produce el HTML en `coverage/html/` y el resumen de texto en la salida de Karma.
- El launcher personalizado `ChromeHeadlessNoSandbox` hereda `ChromeHeadless` y añade `--no-sandbox` y `--disable-dev-shm-usage`.
- `CHROME_BIN` es opcional si Chrome/Chromium se detecta automáticamente; si no, debe apuntar al ejecutable del navegador instalado.
- Los umbrales globales mínimos son 30 % para sentencias, 20 % para ramas, 30 % para funciones y 30 % para líneas.

## Mocks de almacenamiento

`crearBaseDatos` recibe una implementación de almacenamiento. En `db.spec.js` se pasa un `Map` en memoria y Jasmine espía los métodos de lectura y escritura; así se prueba el CRUD sin leer ni modificar el almacenamiento real:

```js
const almacenamiento = {
  leer: (clave, respaldo) => valores.get(clave) ?? respaldo,
  escribir: (clave, valor) => valores.set(clave, valor)
};
spyOn(almacenamiento, 'leer').and.callThrough();
spyOn(almacenamiento, 'escribir').and.callThrough();
const db = crearBaseDatos(almacenamiento);
```

El módulo de producción `src/data/storage.js` es la implementación local; `src/data/db.js` contiene las operaciones de negocio y permite inyectar el mock.

## Resultado medido

Cobertura global de la ejecución de `npm test` con las 29 pruebas:

| Métrica | Resultado | Cubierto |
| --- | ---: | ---: |
| Sentencias | **65,85 %** | 544 / 826 |
| Ramas | **47,32 %** | 230 / 486 |
| Funciones | **57,47 %** | 173 / 301 |
| Líneas | **66,83 %** | 520 / 778 |

El reporte HTML se genera en `coverage/html/index.html`. La carpeta `coverage/` se excluye de Git.

## Análisis de lo que queda por cubrir

- La lógica pura de `utils.js` alcanza cobertura total de sentencias, funciones y líneas. El caso de compatibilidad de filtro aporta las ramas restantes.
- `src/data/` supera el 87 % de sentencias gracias a las pruebas de CRUD; quedan caminos secundarios de validación y manejo de datos malformados.
- Las pruebas administrativas cubren estados vacíos, el filtro de stock crítico, protección de sesión y vistas de usuarios; aún faltan combinaciones visuales de CRUD, errores y reportes con datos.
- El flujo de tienda cubre una ruta representativa de compra y las ramas principales del resultado de pago. No se recorren todas las rutas públicas ni todas las variantes de formulario, filtros y menú responsive.
- La cobertura es una medición del código de aplicación que Webpack incorpora al grafo de pruebas, no una afirmación de que todas las vistas y combinaciones de la interfaz estén probadas. El siguiente incremento recomendado es completar pruebas de CRUD visual administrativo y navegación móvil.
