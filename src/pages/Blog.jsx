import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { entradasBlog } from "../data/blog.js";

export default function Blog() {
  return (
    <main className="container py-5">
      <h1 className="page-title">Consejos para cuidar a tu mascota</h1>
      <div className="row g-4">
        {entradasBlog.map((entrada) => (
          <article className="col-md-6" key={entrada.id}>
            <div className="service-card h-100">
              <h2 className="h4">{entrada.titulo}</h2>
              <p>{entrada.resumen}</p>
              <Link
                className="btn btn-outline-success"
                to={`/blog/${entrada.id}`}
              >
                Leer artículo
              </Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

Blog.propTypes = {};
