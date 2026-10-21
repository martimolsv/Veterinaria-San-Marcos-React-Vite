import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { entradasBlog } from "../data/blog.js";

export default function DetalleBlog() {
  const { id } = useParams();
  const entrada = entradasBlog.find((articulo) => articulo.id === id);
  if (!entrada)
    return (
      <main className="container py-5">
        <h1>Artículo no encontrado</h1>
        <Link to="/blog">Volver al blog</Link>
      </main>
    );
  return (
    <main className="container py-5">
      <article className="service-card p-4">
        <h1 className="page-title">{entrada.titulo}</h1>
        <p>{entrada.contenido}</p>
        <Link to="/blog">Volver al blog</Link>
      </article>
    </main>
  );
}

DetalleBlog.propTypes = {};
