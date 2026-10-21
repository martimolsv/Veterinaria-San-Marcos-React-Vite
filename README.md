# Veterinaria San Marcos

Proyecto académico de frontend hecho con React, Vite, Bootstrap y JavaScript.

## Cómo ejecutarlo

1. Instalar Node.js LTS.
2. Abrir esta carpeta en VS Code.
3. En la terminal, ejecutar `npm install`. Si PowerShell bloquea `npm.ps1`, usar `npm.cmd install`.
4. Ejecutar `npm.cmd run dev` y abrir la dirección que muestre la terminal.

## Secciones

- Inicio
- Catálogo de productos con búsqueda y filtro
- Catálogo de servicios con búsqueda y filtro
- Carrito con cantidades y total
- Información de la veterinaria y consejos
- Formularios demostrativos de registro e inicio de sesión
- Administración básica para agregar y eliminar productos
- Modo claro y oscuro

## Cómo está organizado

- `src/App.jsx`: pantallas y navegación principal.
- `src/data/catalogos.js`: datos iniciales de productos y servicios.
- `src/utils.js`: funciones de cálculo del carrito y filtros.
- `src/style.css`: estilos de la página.
- `src/tests/utils.spec.js`: pruebas unitarias.

## Pruebas

Ejecutar `npm.cmd test`. Karma usa ChromeHeadless, por lo que se necesita Google Chrome instalado.

## Importante

Es una demostración de frontend. El inicio de sesión, el registro y la compra no usan servidor ni procesan pagos reales. La administración guarda los cambios en el almacenamiento local del navegador; no es un panel protegido.
