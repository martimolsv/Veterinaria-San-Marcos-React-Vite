import { useState } from "react";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import { esCorreoDuocValido } from "../utils.js";

export default function Formulario({
  tipo,
  alIniciarAdmin,
  alIniciarUsuario,
  alRegistrar,
}) {
  const navegar = useNavigate();
  const ubicacion = useLocation();
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [clave2, setClave2] = useState("");
  const [error, setError] = useState("");
  const [intentado, setIntentado] = useState(false);
  const registro = tipo === "registro";
  const correoValido = esCorreoDuocValido(correo);
  const claveValida =
    clave.length >= 8 && /[A-Za-z]/.test(clave) && /[0-9]/.test(clave);
  const clavesCoinciden = clave2.length > 0 && clave === clave2;

  function enviar(evento) {
    evento.preventDefault();
    setIntentado(true);
    setError("");
    if (
      !correoValido ||
      !clave.trim() ||
      (registro &&
        (!nombre.trim() ||
          !apellidos.trim() ||
          !claveValida ||
          !clavesCoinciden))
    )
      return;
    try {
      if (registro) {
        alRegistrar({
          name: nombre.trim(),
          apellidos: apellidos.trim(),
          email: correo.trim().toLowerCase(),
          role: "cliente",
        });
        window.alert("Registro simulado correctamente.");
        navegar("/login");
        return;
      }
      if (correo.toLowerCase() === "admin@duoc.cl" && clave === "Admin123") {
        alIniciarAdmin();
        navegar(ubicacion.state?.desde || "/admin");
        return;
      }
      alIniciarUsuario(correo.trim().toLowerCase());
      window.alert("Inicio de sesión simulado correctamente.");
      navegar(ubicacion.state?.desde || "/");
    } catch (problema) {
      setError(problema.message);
    }
  }

  return (
    <main className="container py-5">
      <div className="mx-auto service-card p-4" style={{ maxWidth: 520 }}>
        <h1 className="page-title">
          {registro ? "Crear cuenta" : "Iniciar sesión"}
        </h1>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={enviar} noValidate>
          {registro && (
            <>
              <label className="form-label mt-3" htmlFor="nombreCuenta">
                Nombre
              </label>
              <input
                id="nombreCuenta"
                className={`form-control ${intentado && !nombre.trim() ? "is-invalid" : ""}`}
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
              <div className="invalid-feedback">El nombre es obligatorio.</div>
              <label className="form-label mt-3" htmlFor="apellidosCuenta">
                Apellidos
              </label>
              <input
                id="apellidosCuenta"
                className={`form-control ${intentado && !apellidos.trim() ? "is-invalid" : ""}`}
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
                required
              />
              <div className="invalid-feedback">
                Los apellidos son obligatorios.
              </div>
            </>
          )}
          <label className="form-label mt-3" htmlFor="correoCuenta">
            Correo electrónico
          </label>
          <input
            id="correoCuenta"
            type="email"
            className={`form-control ${correo ? (correoValido ? "is-valid" : "is-invalid") : intentado ? "is-invalid" : ""}`}
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="nombre@duoc.cl"
            required
            autoComplete="email"
          />
          {(correo || intentado) && (
            <div
              className={`${correoValido ? "valid" : "invalid"}-feedback d-block`}
            >
              {correoValido
                ? "Correo DUOC válido."
                : "Usa un correo terminado en @duocuc.cl o @duoc.cl."}
            </div>
          )}
          <label className="form-label mt-3" htmlFor="claveCuenta">
            Contraseña
          </label>
          <input
            id="claveCuenta"
            type="password"
            className={`form-control ${registro && clave ? (claveValida ? "is-valid" : "is-invalid") : intentado && !clave ? "is-invalid" : ""}`}
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            required
            autoComplete={registro ? "new-password" : "current-password"}
          />
          {registro && (
            <>
              <div
                className={
                  clave && !claveValida
                    ? "invalid-feedback d-block"
                    : "form-text"
                }
              >
                {clave && !claveValida
                  ? "La contraseña debe tener 8 caracteres, una letra y un número."
                  : "Usa al menos 8 caracteres, una letra y un número."}
              </div>
              <label className="form-label mt-3" htmlFor="confirmarClave">
                Confirmar contraseña
              </label>
              <input
                id="confirmarClave"
                type="password"
                className={`form-control ${clave2 ? (clavesCoinciden ? "is-valid" : "is-invalid") : intentado ? "is-invalid" : ""}`}
                value={clave2}
                onChange={(e) => setClave2(e.target.value)}
                required
                autoComplete="new-password"
              />
              {(clave2 || intentado) && (
                <div
                  className={`${clavesCoinciden ? "valid" : "invalid"}-feedback d-block`}
                >
                  {clavesCoinciden
                    ? "Las contraseñas coinciden."
                    : "Las contraseñas no coinciden."}
                </div>
              )}
            </>
          )}
          {!registro && intentado && !clave && (
            <div className="invalid-feedback d-block">
              La contraseña es obligatoria.
            </div>
          )}
          <button className="btn btn-success w-100 mt-4">
            {registro ? "Registrarse" : "Ingresar"}
          </button>
        </form>
        <button
          className="btn btn-link mt-2"
          onClick={() => navegar(registro ? "/login" : "/registro")}
        >
          {registro ? "Ya tengo cuenta" : "Crear una cuenta"}
        </button>
        {!registro && (
          <p className="form-text mt-2">
            Acceso demo de administración: admin@duoc.cl / Admin123.
          </p>
        )}
      </div>
    </main>
  );
}

Formulario.propTypes = {
  tipo: PropTypes.oneOf(["registro", "login"]).isRequired,
  alIniciarAdmin: PropTypes.func.isRequired,
  alIniciarUsuario: PropTypes.func.isRequired,
  alRegistrar: PropTypes.func.isRequired,
};
