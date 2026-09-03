function FeatureCard({
  title,
  titleLine2,
  description,
  buttonText,
  className = "",
}) {
  return (
    <section className={`feature-card ${className}`}>

      <div className="feature-content">

        <h2>
          {title}

          {titleLine2 && (
            <>
              <br />
              {titleLine2}
            </>
          )}
        </h2>

        <p>
          {description}
        </p>

        <button>
          {buttonText}
        </button>

      </div>

    </section>
  );
}

export default FeatureCard;