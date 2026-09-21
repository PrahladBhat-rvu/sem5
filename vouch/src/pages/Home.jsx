import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const movies = [
  {
    id: 1,
    title: "Interstellar",
    year: "2014",
    rating: "8.7",
    image:
      "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
  },
  {
    id: 2,
    title: "The Dark Knight",
    year: "2008",
    rating: "9.0",
    image:
      "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
  },
  {
    id: 3,
    title: "Inception",
    year: "2010",
    rating: "8.8",
    image:
      "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
  },
  {
    id: 4,
    title: "Dune: Part Two",
    year: "2024",
    rating: "8.6",
    image:
      "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
  },
];

function Home() {
  return (
    <div className="site">
      <Navbar />

      <main>
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">THE INTERNET'S OPINION, IN ONE PLACE</p>

            <h1>
              Before you buy.
              <br />
              Before you watch.
              <br />
              <em>Check Vouch.</em>
            </h1>

            <p className="hero-text">
              Reviews from everywhere, brought together in one place.
              Find out what people really think.
            </p>

            <form
              className="hero-search"
              onSubmit={(e) => e.preventDefault()}
            >
              <span className="search-icon">⌕</span>

              <input
                type="text"
                placeholder="Search for a movie, product, game..."
              />

              <Link to="/search" className="search-button">
                Search
              </Link>
            </form>

            <div className="popular">
              <span>Popular:</span>

              <Link to="/search?q=Interstellar">Interstellar</Link>
              <Link to="/search?q=iPhone">iPhone</Link>
              <Link to="/search?q=AirPods">AirPods</Link>
              <Link to="/search?q=PS5">PS5</Link>
            </div>
          </div>

          <div className="hero-posters">
            {movies.slice(0, 3).map((movie, index) => (
              <Link
                key={movie.id}
                to={`/product/${movie.id}`}
                className={`hero-poster poster-${index + 1}`}
              >
                <img src={movie.image} alt={movie.title} />
              </Link>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <div>
              <p className="eyebrow">TRENDING NOW</p>
              <h2>What people are talking about</h2>
            </div>

            <Link to="/search" className="view-all">
              View all →
            </Link>
          </div>

          <div className="movie-grid">
            {movies.map((movie) => (
              <Link
                to={`/product/${movie.id}`}
                className="movie-card"
                key={movie.id}
              >
                <div className="movie-image">
                  <img src={movie.image} alt={movie.title} />
                </div>

                <div className="movie-info">
                  <h3>{movie.title}</h3>

                  <div className="movie-meta">
                    <span>{movie.year}</span>
                    <span>★ {movie.rating}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="sources">
          <p>REVIEWS FROM</p>

          <div className="source-list">
            <span>Rotten Tomatoes</span>
            <span>IMDb</span>
            <span>Metacritic</span>
          </div>
        </section>

        <section className="how-section">
          <div className="how-heading">
            <p className="eyebrow">HOW VOUCH WORKS</p>
            <h2>One place for every opinion.</h2>
          </div>

          <div className="steps">
            <div className="step">
              <span>01</span>
              <h3>Search</h3>
              <p>
                Find the movie, product, game or anything you're considering.
              </p>
            </div>

            <div className="step">
              <span>02</span>
              <h3>Compare</h3>
              <p>
                See ratings and opinions from different sources together.
              </p>
            </div>

            <div className="step">
              <span>03</span>
              <h3>Vouch</h3>
              <p>
                Read what real people on Vouch have to say.
              </p>
            </div>
          </div>
        </section>

        <section className="cta">
          <p className="eyebrow">YOUR OPINION MATTERS</p>

          <h2>
            Found something worth
            <br />
            talking about?
          </h2>

          <Link to="/signup">Join Vouch →</Link>
        </section>
      </main>
    </div>
  );
}

export default Home;