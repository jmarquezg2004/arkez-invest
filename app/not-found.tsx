export default function NotFound() {
  return (
    <section className="container-shell page-body">
      <p className="eyebrow">Error 404</p>
      <h1 className="section-title">Página no encontrada</h1>
      <p className="section-description">Vuelve al inicio o usa el menú para encontrar la sección que buscas.</p>
      <a href="/" className="button button-dark">Volver al inicio</a>
    </section>
  );
}
