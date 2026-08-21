function FeatureCard({
  title,
  description,
  buttonText,
  className = "",
}) {
  return (
    <section className={`feature-card ${className}`}>

      <div className="feature-content">

        <h2>{title}</h2>

        <p>{description}</p>

        <button>
          {buttonText}
        </button>

      </div>

    </section>
  );
}

export default FeatureCard;