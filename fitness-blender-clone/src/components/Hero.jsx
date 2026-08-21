import heroTrainers from "../assets/hero/hero-trainers.png";

function Hero() {
  return (
    <section className="hero">

      <div className="hero-content">

        <h1>
          Feel Great.
          <br />
          Body and Mind.
        </h1>

        <p>
          Choose from hundreds of workouts, healthy recipes, relaxing
          meditations, and expert articles, for a whole body and mind
          approach to feeling great.
        </p>

        <button>
          Join Now
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