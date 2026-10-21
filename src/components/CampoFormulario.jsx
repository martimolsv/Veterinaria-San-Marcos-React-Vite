import PropTypes from "prop-types";

export default function CampoFormulario({
  id,
  label,
  value,
  onChange,
  error = "",
  type = "text",
  required = false,
  options = null,
  placeholder = "",
  autoComplete = undefined,
}) {
  const className = `form-control${error ? " is-invalid" : ""}`;
  return (
    <div className="mb-3">
      <label className="form-label" htmlFor={id}>
        {label}
        {required ? " *" : ""}
      </label>
      {options ? (
        <select
          id={id}
          className={`form-select${error ? " is-invalid" : ""}`}
          value={value}
          onChange={(evento) => onChange(evento.target.value)}
          required={required}
        >
          <option value="">Selecciona una opción</option>
          {options.map((opcion) => (
            <option key={opcion} value={opcion}>
              {opcion}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          className={className}
          type={type}
          value={value}
          onChange={(evento) => onChange(evento.target.value)}
          required={required}
          placeholder={placeholder}
          autoComplete={autoComplete}
        />
      )}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}

CampoFormulario.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  type: PropTypes.string,
  required: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.string),
  placeholder: PropTypes.string,
  autoComplete: PropTypes.string,
};
