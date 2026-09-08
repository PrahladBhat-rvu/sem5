export default function Section({ id, title, children }) {
  return (
    <section id={id} className="section">
      <div className="section-heading">
        <span className="section-number">Lab</span>
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}
