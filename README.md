# Veterinaria San Marcos

Proyecto académico para la Evaluación Parcial 2 de **DSY1104 Desarrollo Fullstack II (Duoc UC)**. Es una aplicación frontend hecha con React 19, Vite 6, JavaScript y Bootstrap 5. No tiene backend: los catálogos, las cuentas de demostración, el carrito y las órdenes se guardan en `localStorage`.

## Requisitos

- Node.js LTS y npm.
- Google Chrome o Chromium para ejecutar las pruebas de Karma.
- Si el navegador no está en una ubicación detectada automáticamente, configurar la variable de entorno `CHROME_BIN` para que apunte al ejecutable de Chrome o Chromium. Karma hereda esa variable en Windows y Linux.

## Instalación y ejecución

Desde la carpeta del proyecto, ejecutar los mismos comandos en Windows o Linux:

```sh
npm install
npm run dev
npm test
npm run build
```

- `npm run dev` inicia Vite y muestra la dirección local de la aplicación.
- `npm test` ejecuta Jasmine en ChromeHeadless, procesa JSX con Babel/Webpack y genera el reporte de cobertura.
- `npm run test:watch` deja Karma observando cambios para el desarrollo.
- `npm run build` crea la versión de producción en `dist/`.

Si `CHROME_BIN` está definido, el launcher de Karma usa ese navegador. El launcher de pruebas agrega `--no-sandbox`; no se necesita configurar un servidor.

## Funcionalidades

- Catálogo con búsqueda por texto, categoría y rango de precio; detalle de producto y ofertas.
- Servicios veterinarios y categorías de productos.
- Carrito con cantidades, descuentos y totales.
- Checkout con validación de cliente y entrega, región y comuna dependientes, pago simulado aprobado/rechazado y boleta.
- Registro e inicio de sesión de demostración; panel administrativo de demostración protegido por una sesión guardada localmente.
- Administración de productos, categorías y usuarios; órdenes, productos críticos, reportes básicos, blog y modo oscuro.

Para acceder al panel de demostración, iniciar sesión con `admin@duoc.cl` y `Admin123`. Esta protección es únicamente del lado del cliente y no ofrece seguridad real.

## Rutas

### Tienda

| Ruta | Vista |
| --- | --- |
| `/` | Inicio |
| `/productos` | Catálogo y filtros |
| `/productos/:id` | Detalle del producto |
| `/categorias` | Categorías |
| `/categorias/:nombre` | Productos de una categoría |
| `/ofertas` | Productos con descuento |
| `/servicios` | Servicios y precios |
| `/carrito` | Carrito de compra |
| `/checkout` | Datos de entrega y pago simulado |
| `/pago-correcto` | Boleta de la orden aprobada |
| `/pago-error` | Reintento conservando los datos |
| `/registro`, `/login` | Formularios de demostración |
| `/nosotros`, `/contacto` | Información de la veterinaria |
| `/blog`, `/blog/:id` | Entradas y detalle del blog |
| `*` | Página 404 |

### Administración (requiere sesión de demostración)

| Ruta | Vista |
| --- | --- |
| `/admin` | Dashboard |
| `/admin/ordenes`, `/admin/ordenes/:id` | Órdenes y boleta |
| `/admin/productos` | Listado y CRUD de productos |
| `/admin/productos/nuevo`, `/admin/productos/:id/editar` | Formulario de producto |
| `/admin/productos/criticos` | Stock crítico |
| `/admin/categorias` | CRUD de categorías |
| `/admin/usuarios`, `/admin/usuarios/nuevo` | CRUD de usuarios |
| `/admin/usuarios/:id/editar`, `/admin/usuarios/:id/historial` | Edición e historial |
| `/admin/reportes`, `/admin/perfil` | Reportes y perfil |

Las rutas de administración redirigen a `/login` cuando no hay una sesión administrativa local.

## Estructura del proyecto

```text
src/
  components/       Componentes reutilizables de tienda y formularios
  data/             Catálogos, blog, regiones, CRUD simulado y almacenamiento
  hooks/            Estado reactivo de productos y categorías
  layouts/          Layouts de tienda y administración
  pages/            Vistas públicas y administrativas
  routes/           Definición de rutas y protección del panel
  tests/            Pruebas Jasmine de utilidades, componentes, datos y rutas
  App.jsx           Estado global de la aplicación y composición de rutas
  helpers.js        Formateo y helpers compartidos
  utils.js          Cálculos, validación de correo y filtros
docs/               Reporte de cobertura y guía para la defensa
```

La persistencia usa los módulos `src/data/db.js` y `src/data/storage.js`. Se conservan las claves `productosSanMarcos`, `carritoSanMarcosReact` y `modoOscuroSanMarcos` para mantener los datos previos del navegador.

## Reporte de cobertura

Después de ejecutar `npm test`, abrir `coverage/html/index.html`. El reporte textual también aparece en la salida de Karma. Los valores medidos y el análisis de cobertura se documentan en [docs/cobertura-testing.md](./docs/cobertura-testing.md).

## Alcance académico

El registro, el login y los pagos son simulaciones locales. No se transmiten datos a un servidor ni se realiza un cobro real. Las contraseñas no se usan como mecanismo de autenticación persistente; la sesión administrativa de demostración tampoco protege información fuera del navegador.
