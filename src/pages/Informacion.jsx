import PropTypes from "prop-types";

const contenido = {
  nosotros: [
    "Sobre nosotros",
    "En Veterinaria San Marcos nos preocupamos por el bienestar de las mascotas y sus familias. Nuestro objetivo es ofrecer orientación, productos y servicios para su cuidado.",
  ],
  blog: [
    "Consejos para cuidar a tu mascota",
    "Mantén al día sus controles veterinarios, proporciona agua fresca y una alimentación adecuada, y consulta a un profesional ante cualquier cambio de comportamiento.",
  ],
};

export default function Informacion({ pagina }) {
  const [titulo, descripcion] = contenido[pagina];
  return (
    <main className="container py-5">
      <div className="service-card p-5">
        <h1 className="page-title">{titulo}</h1>
        <p>{descripcion}</p>
      </div>
    </main>
  );
}

Informacion.propTypes = {
  pagina: PropTypes.oneOf(["nosotros", "blog"]).isRequired,
};
