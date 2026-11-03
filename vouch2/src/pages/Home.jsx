import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import MovieShelf from "../components/MovieShelf";
import { CURATED_SHELVES } from "../data/shelfData";
import { useAuthModal } from "../context/AuthModalContext";
import { getTitleUrl } from "../utils/slug";

const movies = [
  {
    id: 157336,
    title: "Interstellar",
    year: "2014",
    rating: "8.7",
    image:
      "/api/image/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
  },
  {
    id: 155,
    title: "The Dark Knight",
    year: "2008",
    rating: "9.0",
    image:
      "/api/image/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
  },
  {
    id: 27205,
    title: "Inception",
    year: "2010",
    rating: "8.8",
    image:
      "/api/image/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
  },
  {
    id: 693134,
    title: "Dune: Part Two",
    year: "2024",
    rating: "8.6",
    image:
      "/api/image/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
  },
];

function Home() {
  const navigate = useNavigate();
  const { openSignup } = useAuthModal();
  const [searchQuery, setSearchQuery] = useState("");

  function handleSearch(e) {
    e.preventDefault();

    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery) {
      navigate("/search");
      return;
    }

    navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
  }

  return (
    <div className="site">
      <Navbar />

      <main>
        {/* HERO */}
        <section className="hero">
          <div className="hero-content">
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

            {/* SEARCH */}
            <SearchBar showPopular={true} />
          </div>

          {/* HERO POSTERS */}
          <div className="hero-posters">
            {movies.slice(0, 3).map((movie, index) => (
              <Link
                key={movie.id}
                to={getTitleUrl(movie)}
                className={`hero-poster poster-${index + 1}`}
              >
                <img src={movie.image} alt={movie.title} />
              </Link>
            ))}
          </div>
        </section>

        {/* STREAMING-PLATFORM CURATED ROWS (Matching reference layout) */}
        <div className="home-shelves-wrap">
          <MovieShelf
            shelfId="shelf-marc-webb"
            title="More from Marc Webb"
            exploreLink="/search?q=Marc+Webb"
            exploreText="Explore All ›"
            movies={CURATED_SHELVES["Marc Webb"]}
          />

          <MovieShelf
            shelfId="shelf-andrew-garfield"
            title="Starring Andrew Garfield"
            exploreLink="/search?q=Andrew+Garfield"
            exploreText="Explore All ›"
            movies={CURATED_SHELVES["Andrew Garfield"]}
          />

          <MovieShelf
            shelfId="shelf-christopher-nolan"
            title="Auteur Spotlight: Christopher Nolan"
            exploreLink="/search?q=Christopher+Nolan"
            exploreText="Explore All ›"
            movies={CURATED_SHELVES["Christopher Nolan"]}
          />

          <MovieShelf
            shelfId="shelf-trending-masterpieces"
            title="Trending Masterpieces"
            exploreLink="/search"
            exploreText="Explore All ›"
            movies={CURATED_SHELVES["Trending Masterpieces"]}
          />
        </div>

        {/* SOURCES */}
        <section className="sources">
          <p>REVIEWS FROM</p>

          <div className="source-list">
            <span>Rotten Tomatoes</span>
            <span>IMDb</span>
            <span>Metacritic</span>
          </div>
        </section>

        {/* HOW VOUCH WORKS */}
        <section className="how-section">
          <div className="how-heading">
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

        {/* CTA */}
        <section className="cta">
          <h2>
            Found something worth
            <br />
            talking about?
          </h2>

          <button
            type="button"
            className="home-cta-button"
            onClick={openSignup}
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}
          >
            <span>Join Vouch</span>
            <FaArrowRight style={{ marginLeft: "8px", fontSize: "13px" }} />
          </button>
        </section>
      </main>
    </div>
  );
}

export default Home;