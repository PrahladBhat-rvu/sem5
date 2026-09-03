import heroTrainers from "../assets/hero/hero-trainers.png";
import { useLanguage } from "../context/LanguageContext";

function Hero() {
  const { t } = useLanguage();

  return (
    <section className="hero">

      <div className="hero-content">

        <h1>
          {t.hero.titleLine1}
          <br />
          {t.hero.titleLine2}
        </h1>

        <p>
          {t.hero.description}
        </p>

        <button>
          {t.hero.button}
        </button>

      </div>


      <div className="hero-trainers">

        <img
          src={heroTrainers}
          alt="Fitness Blender trainers"
        />

      </div>

    </section>
  );
}

export default Hero;