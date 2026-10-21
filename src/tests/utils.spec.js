import { calcularTotal, contarUnidades, filtrarPorTextoYCategoria } from '../utils.js';

describe('Funciones del catálogo y carrito', function () {
  it('calcula el total del carrito', function () {
    expect(calcularTotal([{ precio: 1000, cantidad: 2 }, { precio: 500, cantidad: 3 }])).toBe(3500);
  });
  it('cuenta las unidades del carrito', function () {
    expect(contarUnidades([{ cantidad: 2 }, { cantidad: 3 }])).toBe(5);
  });
  it('filtra por texto y categoría', function () {
    const resultado = filtrarPorTextoYCategoria([{ name: 'Amoxibay', category: 'Antibióticos' }, { name: 'Nexgard', category: 'Antiparasitarios' }], 'amox', 'Antibióticos', 'category');
    expect(resultado.length).toBe(1);
    expect(resultado[0].name).toBe('Amoxibay');
  });
});
