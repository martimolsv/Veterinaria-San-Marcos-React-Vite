import React, { useEffect, useState } from 'react';
import { productosIniciales, servicios } from './data/catalogos.js';
import { calcularTotal, contarUnidades, filtrarPorTextoYCategoria } from './utils.js';

const dinero = (valor) => new Intl.NumberFormat('es-CL').format(valor);
const leer = (clave, respaldo) => { try { return JSON.parse(localStorage.getItem(clave)) ?? respaldo; } catch { return respaldo; } };

function Encabezado({ pagina, cambiarPagina, unidades, oscuro, cambiarModo }) {
  function navegar(id) {
    cambiarPagina(id);
    // En móviles, cerrar el menú después de seleccionar una sección.
    if (window.innerWidth < 992) {
      document.getElementById('menuPrincipal')?.classList.remove('show');
      document.querySelector('.navbar-toggler')?.setAttribute('aria-expanded', 'false');
    }
  }
  const enlaces = [['inicio','Inicio'],['productos','Productos'],['servicios','Servicios'],['nosotros','Nosotros'],['blog','Blog']];
  return <nav className="navbar navbar-expand-lg shadow-sm sticky-top"><div className="container">
    <button className="navbar-brand d-flex align-items-center border-0 bg-transparent" onClick={() => navegar('inicio')}>
      <div className="logo-icon"><img src="/img/logo-sanmarcos.png" alt="Logo San Marcos" onError={(e) => { e.currentTarget.style.display='none'; }} /></div>
      <div className="ms-2 text-start"><span className="logo-title">San Marcos</span><small className="d-block logo-subtitle">Veterinaria</small></div>
    </button>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menuPrincipal" aria-label="Abrir menú"><span className="navbar-toggler-icon" /></button>
    <div className="collapse navbar-collapse" id="menuPrincipal"><ul className="navbar-nav mx-auto mb-2 mb-lg-0">
      {enlaces.map(([id, texto]) => <li className="nav-item" key={id}><button className={'nav-link '+(pagina===id?'active':'')} onClick={() => navegar(id)}>{texto}</button></li>)}
    </ul><div className="d-flex align-items-center flex-wrap gap-2">
      <button className="btn btn-outline-success btn-sm" onClick={() => { cambiarModo(); if (window.innerWidth < 992) navegar(pagina); }}>{oscuro?'☀️ Modo claro':'🌙 Modo oscuro'}</button>
      <button className="btn btn-outline-success btn-sm" onClick={() => navegar('login')}>Iniciar sesión</button>
      <button className="btn btn-success btn-sm" onClick={() => navegar('registro')}>Registrarse</button>
      <button className="btn btn-outline-success btn-sm" onClick={() => navegar('carrito')}><i className="bi bi-cart3"/> Carrito ({unidades})</button>
    </div></div></div></nav>;
}

function Inicio({ cambiarPagina }) {
 return <><section className="hero-section"><div className="container"><div className="row align-items-center g-5"><div className="col-lg-7">
  <span className="badge rounded-pill hero-badge"><i className="bi bi-heart-fill me-1"/> Cuidamos a quienes más quieres</span>
  <h1 className="hero-title">El bienestar de tu mascota <span>es nuestra prioridad.</span></h1>
  <p className="hero-text">En Veterinaria San Marcos encontrarás atención, productos y orientación pensados para el cuidado de tus compañeros.</p>
  <div className="d-flex flex-wrap gap-3 mt-4"><button className="btn btn-success btn-lg" onClick={() => cambiarPagina('servicios')}>Ver servicios</button><button className="btn btn-outline-success btn-lg" onClick={() => cambiarPagina('productos')}>Visitar tienda</button></div>
 </div><div className="col-lg-5"><div className="service-card p-5 text-center"><i className="bi bi-heart-pulse-fill display-1 text-success"/><h3 className="mt-3">Atención profesional</h3><p className="text-secondary">Para perros, gatos y otras especies</p></div></div></div></div></section>
 <section className="section"><div className="container text-center"><span className="section-label">SAN MARCOS</span><h2 className="section-title">Cuidado pensado para ellos</h2><p className="section-text">Conoce nuestras áreas de atención y encuentra rápidamente lo que necesitas.</p><div className="row g-4 mt-2">{[['bi-heart-pulse','Consultas','Atenciones generales, urgencias y controles.','servicios'],['bi-capsule','Productos','Medicamentos, vacunas y más.','productos'],['bi-journal-text','Consejos','Información para cuidar a tu mascota.','blog']].map(x=><div className="col-md-4" key={x[1]}><div className="service-card h-100"><i className={'bi '+x[0]+' service-icon'}/><h3>{x[1]}</h3><p>{x[2]}</p><button className="btn btn-outline-success" onClick={()=>cambiarPagina(x[3])}>Ver más</button></div></div>)}</div></div></section></>;
}

function Productos({ productos, agregar }) {
 const [texto,setTexto]=useState(''); const [categoria,setCategoria]=useState('');
 const filtrados=filtrarPorTextoYCategoria(productos,texto,categoria);
 const categorias=[...new Set(productos.map(p=>p.category))];
 return <main className="container py-5"><h1 className="page-title">Catálogo de productos</h1><p>Consulta los productos disponibles para tus mascotas.</p><div className="row g-3 mb-4"><div className="col-md-8"><input className="form-control" placeholder="Buscar producto..." value={texto} onChange={e=>setTexto(e.target.value)}/></div><div className="col-md-4"><select className="form-select" value={categoria} onChange={e=>setCategoria(e.target.value)}><option value="">Todas las categorías</option>{categorias.map(c=><option key={c}>{c}</option>)}</select></div></div><div className="row g-4">{filtrados.map(p=><div className="col-md-6 col-lg-4" key={p.id}><div className="product-card h-100"><div className="product-image"><div className="product-placeholder"><i className="bi bi-capsule"/></div></div><div className="product-body"><span className="product-category">{p.category}</span><h3>{p.name}</h3><p><strong>Principio activo:</strong> {p.active}</p><p><strong>Presentación:</strong> {p.presentation}</p><p><strong>Especie:</strong> {p.species} · <strong>Stock:</strong> {p.stock}</p><div className="d-flex justify-content-between align-items-center gap-2"><span className="product-price">${dinero(p.price)}</span><button className="btn btn-success" onClick={()=>agregar(p)}><i className="bi bi-cart-plus me-1"/>Agregar</button></div></div></div></div>)}{!filtrados.length&&<p>No hay productos que coincidan con la búsqueda.</p>}</div></main>;
}

function Servicios() {
 const [texto,setTexto]=useState(''); const [categoria,setCategoria]=useState('');
 const filtrados=filtrarPorTextoYCategoria(servicios,texto,categoria);
 const categorias=[...new Set(servicios.map(s=>s.category))];
 return <main className="container py-5"><h1 className="page-title">Servicios veterinarios</h1><p>Consulta nuestros servicios y precios referenciales.</p><div className="row g-3 mb-4"><div className="col-md-8"><input className="form-control" placeholder="Buscar servicio..." value={texto} onChange={e=>setTexto(e.target.value)}/></div><div className="col-md-4"><select className="form-select" value={categoria} onChange={e=>setCategoria(e.target.value)}><option value="">Todas las categorías</option>{categorias.map(c=><option key={c}>{c}</option>)}</select></div></div><div className="table-responsive admin-table"><table className="table table-hover align-middle mb-0"><thead><tr><th>Código</th><th>Categoría</th><th>Servicio</th><th>Especie</th><th>Duración</th><th>Precio</th><th>Observaciones</th></tr></thead><tbody>{filtrados.map(s=><tr key={s.id}><td>{s.id}</td><td>{s.category}</td><td>{s.name}</td><td>{s.species}</td><td>{s.duration}</td><td>${dinero(s.price)}</td><td>{s.notes||'—'}</td></tr>)}</tbody></table></div></main>;
}

function Carrito({ carrito, cambiarCantidad, eliminar, vaciar, finalizar }) {
 const total=calcularTotal(carrito);
 return <main className="container py-5"><h1 className="page-title">Carrito de compras</h1>{!carrito.length?<div className="service-card text-center p-5"><i className="bi bi-cart3 display-3 text-success"/><h3>Tu carrito está vacío</h3><p>Agrega productos desde nuestro catálogo.</p></div>:<><div className="table-responsive admin-table"><table className="table align-middle mb-0"><thead><tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th><th/></tr></thead><tbody>{carrito.map(p=><tr key={p.id}><td>{p.name}</td><td>${dinero(p.price)}</td><td><button className="btn btn-sm btn-outline-success" onClick={()=>cambiarCantidad(p.id,-1)}>-</button> <strong className="mx-2">{p.cantidad}</strong><button className="btn btn-sm btn-outline-success" onClick={()=>cambiarCantidad(p.id,1)}>+</button></td><td>${dinero(p.price*p.cantidad)}</td><td><button className="btn btn-sm btn-outline-danger" onClick={()=>eliminar(p.id)}>Eliminar</button></td></tr>)}</tbody></table></div><div className="text-end mt-4"><h3>Total: ${dinero(total)}</h3><button className="btn btn-outline-danger me-2" onClick={vaciar}>Vaciar carrito</button><button className="btn btn-success" onClick={finalizar}>Finalizar compra</button></div></>}</main>;
}


function Admin({ productos, guardarProductos }) {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('Otros');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');

  const [productoEditar, setProductoEditar] = useState(null);
  const [datosEditar, setDatosEditar] = useState({
    name: '',
    category: 'Otros',
    price: '',
    stock: ''
  });

  const categorias = [
    'Antibióticos',
    'Antiparasitarios',
    'Antiinflamatorios',
    'Dermatología',
    'Digestivo',
    'Cardíaco',
    'Analgésicos',
    'Vacunas',
    'Suplementos',
    'Otros'
  ];

  function agregar(e) {
    e.preventDefault();

    if (
      !nombre.trim() ||
      Number(precio) <= 0 ||
      precio === '' ||
      stock === '' ||
      Number(stock) < 0
    ) {
      alert('Completa nombre, precio y stock correctamente.');
      return;
    }

    const nuevoProducto = {
      id: 'AD' + Date.now(),
      name: nombre.trim(),
      category: categoria,
      active: 'No especificado',
      presentation: 'Unidad',
      species: 'Perro / Gato',
      price: Number(precio),
      stock: Number(stock)
    };

    guardarProductos([...productos, nuevoProducto]);

    setNombre('');
    setCategoria('Otros');
    setPrecio('');
    setStock('');
  }

  function eliminar(id) {
    if (!window.confirm('¿Seguro que quieres eliminar este producto?')) {
      return;
    }

    guardarProductos(productos.filter(p => p.id !== id));

    if (productoEditar === id) {
      cancelarEdicion();
    }
  }

  function iniciarEdicion(producto) {
    setProductoEditar(producto.id);

    setDatosEditar({
      name: producto.name,
      category: producto.category,
      price: producto.price,
      stock: producto.stock
    });
  }

  function cancelarEdicion() {
    setProductoEditar(null);

    setDatosEditar({
      name: '',
      category: 'Otros',
      price: '',
      stock: ''
    });
  }

  function guardarEdicion(e) {
    e.preventDefault();

    if (
      !datosEditar.name.trim() ||
      datosEditar.price === '' ||
      Number(datosEditar.price) <= 0 ||
      datosEditar.stock === '' ||
      Number(datosEditar.stock) < 0
    ) {
      alert('Revisa el nombre, el precio y el stock.');
      return;
    }

    const productosActualizados = productos.map(p => {
      if (p.id === productoEditar) {
        return {
          ...p,
          name: datosEditar.name.trim(),
          category: datosEditar.category,
          price: Number(datosEditar.price),
          stock: Number(datosEditar.stock)
        };
      }

      return p;
    });

    guardarProductos(productosActualizados);
    cancelarEdicion();
    alert('Producto modificado correctamente.');
  }

  const stockTotal = productos.reduce(
    (total, producto) => total + Number(producto.stock || 0),
    0
  );

  const totalCategorias = new Set(
    productos.map(p => p.category)
  ).size;

  return (
    <main className="container py-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <h1 className="page-title">Administración</h1>
        </div>

        <span className="badge text-bg-success">
          Vista admin
        </span>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="admin-stat">
            <span>Productos registrados</span>
            <strong>{productos.length}</strong>
          </div>
        </div>

        <div className="col-md-4">
          <div className="admin-stat">
            <span>Categorías</span>
            <strong>{totalCategorias}</strong>
          </div>
        </div>

        <div className="col-md-4">
          <div className="admin-stat">
            <span>Stock total</span>
            <strong>{stockTotal}</strong>
          </div>
        </div>
      </div>

      <div className="admin-shell mb-4">
        <h2 className="h4">Agregar producto</h2>

        <form className="row g-3" onSubmit={agregar}>
          <div className="col-md-4">
            <label className="form-label">Nombre</label>
            <input
              className="form-control"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              required
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Categoría</label>
            <select
              className="form-select"
              value={categoria}
              onChange={e => setCategoria(e.target.value)}
            >
              {categorias.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-2">
            <label className="form-label">Precio ($)</label>
            <input
              type="number"
              min="1"
              className="form-control"
              value={precio}
              onChange={e => setPrecio(e.target.value)}
              required
            />
          </div>

          <div className="col-md-1">
            <label className="form-label">Stock</label>
            <input
              type="number"
              min="0"
              className="form-control"
              value={stock}
              onChange={e => setStock(e.target.value)}
              required
            />
          </div>

          <div className="col-md-2 d-flex align-items-end">
            <button className="btn btn-success w-100" type="submit">
              Agregar
            </button>
          </div>
        </form>
      </div>

      {productoEditar !== null && (
        <div className="admin-shell mb-4">
          <h2 className="h4">Editar producto</h2>

          <form className="row g-3" onSubmit={guardarEdicion}>
            <div className="col-md-4">
              <label className="form-label">Nombre</label>
              <input
                className="form-control"
                value={datosEditar.name}
                onChange={e =>
                  setDatosEditar({
                    ...datosEditar,
                    name: e.target.value
                  })
                }
                required
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Categoría</label>
              <select
                className="form-select"
                value={datosEditar.category}
                onChange={e =>
                  setDatosEditar({
                    ...datosEditar,
                    category: e.target.value
                  })
                }
              >
                {categorias.map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <label className="form-label">Precio ($)</label>
              <input
                type="number"
                min="1"
                className="form-control"
                value={datosEditar.price}
                onChange={e =>
                  setDatosEditar({
                    ...datosEditar,
                    price: e.target.value
                  })
                }
                required
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">Stock</label>
              <input
                type="number"
                min="0"
                className="form-control"
                value={datosEditar.stock}
                onChange={e =>
                  setDatosEditar({
                    ...datosEditar,
                    stock: e.target.value
                  })
                }
                required
              />
            </div>

            <div className="col-12 d-flex gap-2">
              <button className="btn btn-success" type="submit">
                Guardar cambios
              </button>

              <button
                className="btn btn-secondary"
                type="button"
                onClick={cancelarEdicion}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <h2 className="h4">Listado de productos</h2>

      <div className="table-responsive admin-table">
        <table className="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acción</th>
            </tr>
          </thead>

          <tbody>
            {productos.map(p => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>${dinero(p.price)}</td>
                <td>{p.stock}</td>
                <td>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-success"
                      onClick={() => iniciarEdicion(p)}
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => eliminar(p.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {productos.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No hay productos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

function Formulario({ tipo, cambiarPagina }) {
 const [correo,setCorreo]=useState('');
 const [clave,setClave]=useState('');
 const [clave2,setClave2]=useState('');
 const registro=tipo==='registro';
 const correoValido=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo);
 const claveValida=clave.length>=8 && /[A-Za-z]/.test(clave) && /[0-9]/.test(clave);
 const clavesCoinciden=clave2.length>0 && clave===clave2;
 function enviar(e){
   e.preventDefault();
   if(!correoValido){return;}
   if(registro && !claveValida){return;}
   if(registro && !clavesCoinciden){return;}
   alert(registro?'Registro simulado correctamente.':'Inicio de sesión simulado correctamente.');
   cambiarPagina(registro?'login':'inicio');
 }
 return <main className="container py-5"><div className="mx-auto service-card p-4" style={{maxWidth:520}}><h1 className="page-title">{registro?'Crear cuenta':'Iniciar sesión'}</h1><form onSubmit={enviar}>
   <label className="form-label mt-3">Correo electrónico</label>
   <input type="email" className={'form-control '+(correo.length===0?'':correoValido?'is-valid':'is-invalid')} value={correo} onChange={e=>setCorreo(e.target.value)} placeholder="nombre@ejemplo.cl" required aria-describedby="correoAyuda"/>
   {correo.length>0 && <div id="correoAyuda" className={correoValido?'valid-feedback d-block':'invalid-feedback d-block'}>{correoValido?'Formato de correo válido.':'Escribe un correo válido, por ejemplo nombre@ejemplo.cl.'}</div>}
   <label className="form-label mt-3">Contraseña</label>
   <input type="password" className={'form-control '+(registro&&clave.length>0?(claveValida?'is-valid':'is-invalid'):'')} value={clave} onChange={e=>setClave(e.target.value)} required autoComplete={registro?'new-password':'current-password'}/>
   {registro && <div className={clave.length===0?'form-text':claveValida?'valid-feedback d-block':'invalid-feedback d-block'}>{clave.length===0?'Usa al menos 8 caracteres, una letra y un número.':claveValida?'Contraseña válida.':'La contraseña debe tener al menos 8 caracteres, una letra y un número.'}</div>}
   {registro&&<><label className="form-label mt-3">Confirmar contraseña</label><input type="password" className={'form-control '+(clave2.length===0?'':clavesCoinciden?'is-valid':'is-invalid')} value={clave2} onChange={e=>setClave2(e.target.value)} required autoComplete="new-password"/>{clave2.length>0&&<div className={clavesCoinciden?'valid-feedback d-block':'invalid-feedback d-block'}>{clavesCoinciden?'Las contraseñas coinciden.':'Las contraseñas no coinciden.'}</div>}</>}
   <button className="btn btn-success w-100 mt-4" disabled={!correoValido || (registro && (!claveValida || !clavesCoinciden))}>{registro?'Registrarse':'Ingresar'}</button></form><button className="btn btn-link mt-2" onClick={()=>cambiarPagina(registro?'login':'registro')}>{registro?'Ya tengo cuenta':'Crear una cuenta'}</button></div></main>;
}

function Informacion({ pagina }) {
 const contenido={nosotros:['Sobre nosotros','En Veterinaria San Marcos nos preocupamos por el bienestar de las mascotas y sus familias. Nuestro objetivo es ofrecer orientación, productos y servicios para su cuidado.'],blog:['Consejos para cuidar a tu mascota','Mantén al día sus controles veterinarios, proporciona agua fresca y una alimentación adecuada, y consulta a un profesional ante cualquier cambio de comportamiento.']};
 const c=contenido[pagina]; return <main className="container py-5"><div className="service-card p-5"><h1 className="page-title">{c[0]}</h1><p>{c[1]}</p></div></main>;
}

export default function App(){
 const [pagina,setPagina]=useState('inicio');
 const [productos,setProductos]=useState(()=>leer('productosSanMarcos',productosIniciales));
 const [carrito,setCarrito]=useState(()=>leer('carritoSanMarcosReact',[]));
 const [oscuro,setOscuro]=useState(()=>leer('modoOscuroSanMarcos',false));
 useEffect(()=>{
  localStorage.setItem('productosSanMarcos',JSON.stringify(productos));}
  ,[productos]);
 useEffect(()=>{
  localStorage.setItem('carritoSanMarcosReact',JSON.stringify(carrito));}
  ,[carrito]);
 useEffect(()=>{
  localStorage.setItem('modoOscuroSanMarcos',JSON.stringify(oscuro));document.body.classList.toggle('dark-mode',oscuro);},[oscuro]);
 const agregar=(producto)=>setCarrito(actual=>{const existente=actual.find(p=>p.id===producto.id);return existente?actual.map(p=>p.id===producto.id?{...p,cantidad:p.cantidad+1}:p):[...actual,{...producto,cantidad:1}];});
 const cambiarCantidad=(id,cambio)=>setCarrito(actual=>actual.map(p=>p.id===id?{...p,cantidad:p.cantidad+cambio}:p).filter(p=>p.cantidad>0));
 const eliminar=(id)=>setCarrito(actual=>actual.filter(p=>p.id!==id));
 const vaciar=()=>setCarrito([]);
 const finalizar=()=>{alert('Compra simulada correctamente. ¡Gracias por confiar en San Marcos!');vaciar();};
 return <><Encabezado pagina={pagina} cambiarPagina={setPagina} unidades={contarUnidades(carrito)} oscuro={oscuro} cambiarModo={()=>setOscuro(!oscuro)}/>
 {pagina==='inicio'&&<Inicio cambiarPagina={setPagina}/>}{pagina==='productos'&&<Productos productos={productos} agregar={agregar}/>}{pagina==='servicios'&&<Servicios/>}{pagina==='carrito'&&<Carrito carrito={carrito} cambiarCantidad={cambiarCantidad} eliminar={eliminar} vaciar={vaciar} finalizar={finalizar}/>}{pagina==='admin'&&<Admin productos={productos} guardarProductos={setProductos}/>}{(pagina==='login'||pagina==='registro')&&<Formulario tipo={pagina} cambiarPagina={setPagina}/>}{(pagina==='nosotros'||pagina==='blog')&&<Informacion pagina={pagina}/>}
 <footer className="py-4 mt-5 border-top"><div className="container d-flex flex-wrap justify-content-between gap-3"><span><strong>Veterinaria San Marcos</strong> · Cuidamos a quienes más quieres.</span><button className="btn btn-outline-success btn-sm" onClick={()=>setPagina('admin')}><i className="bi bi-gear me-1"/>Administración</button></div><div className="container small text-secondary mt-2">Álvarez 2366, Chorrillos, Viña del Mar</div></footer></>;
}
