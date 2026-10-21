# Guía para la defensa del proyecto

## Framework y estructura

La aplicación se inicia en `src/main.jsx`, que crea el root de React, aplica Bootstrap y monta `BrowserRouter`. `src/App.jsx` concentra el estado compartido, mientras que `src/routes/RutasAplicacion.jsx` organiza las rutas y delega cada pantalla a `src/pages/`.

```jsx
<BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
  <App />
</BrowserRouter>
```

Se separaron páginas, layouts, componentes, datos y hooks para que cada módulo tenga una responsabilidad concreta y sea más fácil de probar.

## Props y estado

`src/components/TarjetaProducto.jsx` recibe el producto y el callback desde `src/pages/Productos.jsx`. No administra el catálogo: emite la acción al padre mediante props.

```jsx
<TarjetaProducto producto={producto} agregar={agregar} />
```

`src/hooks/useProductos.js` mantiene el catálogo reactivo en React y delega la persistencia a `src/data/db.js`. El estado local de un formulario, por ejemplo los campos del checkout, vive en su página mientras el carrito y el usuario pertenecen a la aplicación.

## Diseño responsivo con Bootstrap

`src/pages/Checkout.jsx` utiliza `.container`, `.row`, `.col-lg-*` y `.col-md-*` para apilar los datos y el resumen en pantallas pequeñas y distribuirlos en pantallas amplias. Las tablas de catálogo y carrito usan `.table-responsive`. `src/components/Encabezado.jsx` implementa una navbar colapsable.

```jsx
<div className="row g-4">
  <section className="col-lg-7">...</section>
  <aside className="col-lg-5">...</aside>
</div>
```

Bootstrap se usa para mantener una grilla consistente sin añadir otra biblioteca de interfaz.

## Pruebas con Jasmine y Karma

`karma.conf.cjs` compila los archivos `.jsx` de prueba con Babel/Webpack y utiliza `karma-coverage` para instrumentar y medir el código con Istanbul. `src/tests/componentes.spec.jsx` renderiza componentes con Testing Library; `src/tests/navegacion.spec.jsx` usa `MemoryRouter` para probar rutas sin iniciar un servidor.

```js
describe('Funciones del catálogo y carrito', function () {
  it('calcula el total del carrito', function () {
    expect(calcularTotal([{ price: 1000, cantidad: 2 }])).toBe(2000);
  });
});
```

La configuración genera el reporte HTML y muestra un resumen textual al ejecutar `npm test`.

## Mocks

`src/data/db.js` acepta un adaptador de almacenamiento. En `src/tests/db.spec.js` cada prueba inyecta un `Map` en memoria y espía `leer` y `escribir` con `spyOn`, evitando modificar el `localStorage` real.

```js
spyOn(almacenamiento, 'leer').and.callThrough();
spyOn(almacenamiento, 'escribir').and.callThrough();
const db = crearBaseDatos(almacenamiento);
```

El mock conserva el mismo contrato que `src/data/storage.js`, por lo que las pruebas verifican el CRUD real de `db.js` sin depender de un navegador con datos persistentes.
