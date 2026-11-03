import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaStar, FaArrowRight } from "react-icons/fa";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import ObjectsGallery from "../components/ObjectsGallery";
import { getTitleUrl } from "../utils/slug";
import { getDiscoverMovies, getTMDBImageUrl } from "../api/tmdb";

const GENRES = [
  { id: "", label: "All Genres" },
  { id: "action", label: "Action" },
  { id: "sci-fi", label: "Sci-Fi" },
  { id: "drama", label: "Drama" },
  { id: "comedy", label: "Comedy" },
  { id: "horror", label: "Horror" },
  { id: "thriller", label: "Thriller" },
  { id: "adventure", label: "Adventure" },
  { id: "animation", label: "Animation" },
];

const SORT_OPTIONS = [
  { id: "popularity.desc", label: "Most Popular" },
  { id: "vote_average.desc", label: "Highest Rated" },
  { id: "primary_release_date.desc", label: "Recently Added" },
];

function Discover() {
  const navigate = useNavigate();
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedSort, setSelectedSort] = useState("popularity.desc");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quickSearch, setQuickSearch] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function loadMovies() {
      try {
        setLoading(true);
        setError("");
        const results = await getDiscoverMovies({
          genre: selectedGenre,
          sortBy: selectedSort,
        });
        if (!cancelled) {
          setMovies(results || []);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Discover load error:", err);
          setError("Failed to load titles. Showing curated selections.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadMovies();
    return () => {
      cancelled = true;
    };
  }, [selectedGenre, selectedSort]);

  const handleQuickSearch = (e) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      navigate(`/search?q=${encodeURIComponent(quickSearch.trim())}`);
    }
  };

  const featured = movies[0];

  return (
    <div className="site">
      <Navbar />
      <main className="discover-page">
        {/* HERO SECTION */}
        <section className="discover-hero">
          <div className="discover-hero-content">
            <h1>
              Discover the best of
              <br />
              <em>film & media.</em>
            </h1>
            <p className="discover-subtitle">
              Browse consensus ratings, critically acclaimed gems, and community favorites.
              Everything worth your evening.
            </p>

            <SearchBar />
          </div>
        </section>

        {/* 3D OBJECTS GALLERY (MOTION SPEC SPECIFICATION) */}
        <ObjectsGallery />

        {/* SPOTLIGHT BANNER */}
        {featured && (
          <section className="spotlight-section">
            <div className="spotlight-card">
              <div className="spotlight-image">
                <img
                  src={
                    featured.image ||
                    (featured.poster_path
                      ? getTMDBImageUrl(featured.poster_path)
                      : "/api/image/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg")
                  }
                  alt={featured.title}
                />
              </div>
              <div className="spotlight-info">
                <span className="spotlight-tag">EDITOR'S PICK</span>
                <h2>{featured.title}</h2>
                <div className="spotlight-meta">
                  <span className="spotlight-year">{featured.year || "2024"}</span>
                  <span className="spotlight-rating" style={{ display: "inline-flex", alignItems: "center" }}>
                    <FaStar style={{ color: "#f59e0b", marginRight: "4px", fontSize: "12px" }} />
                    {featured.rating || featured.vote_average || "8.5"}
                  </span>
                  {featured.genres && (
                    <span className="spotlight-genres">{featured.genres.join(" • ")}</span>
                  )}
                </div>
                <p className="spotlight-overview">
                  {featured.overview ||
                    "A landmark cinematic experience hailed by critics and audiences alike. See consensus ratings and breakdown on Vouch."}
                </p>
                <Link to={getTitleUrl(featured)} className="spotlight-btn" style={{ display: "inline-flex", alignItems: "center" }}>
                  <span>View Full Consensus & Reviews</span>
                  <FaArrowRight style={{ marginLeft: "8px", fontSize: "12px" }} />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* FILTER BAR */}
        <section className="discover-controls">
          <div className="genre-pills">
            {GENRES.map((g) => (
              <button
                key={g.id}
                type="button"
                className={`genre-pill ${selectedGenre === g.id ? "active" : ""}`}
                onClick={() => setSelectedGenre(g.id)}
              >
                {g.label}
              </button>
            ))}
          </div>

          <div className="sort-selector">
            <label htmlFor="discover-sort">Sort by:</label>
            <select
              id="discover-sort"
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* MOVIE GRID */}
        <section className="discover-grid-section">
          <div className="discover-results-header">
            <p>
              Showing{" "}
              <strong>
                {selectedGenre
                  ? `${GENRES.find((g) => g.id === selectedGenre)?.label} Titles`
                  : "All Selections"}
              </strong>
            </p>
            <span>{movies.length} titles</span>
          </div>

          {loading ? (
            <div className="discover-loading">
              <div className="loading-spinner"></div>
              <p>Fetching movies from TMDB & Vouch...</p>
            </div>
          ) : error ? (
            <div className="discover-error">
              <p>{error}</p>
            </div>
          ) : movies.length === 0 ? (
            <div className="discover-empty">
              <h3>No movies found in this category.</h3>
              <p>Try switching to another genre or reset filters.</p>
              <button
                type="button"
                className="reset-filter-btn"
                onClick={() => {
                  setSelectedGenre("");
                  setSelectedSort("popularity.desc");
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="movie-grid">
              {movies.map((movie) => {
                const poster =
                  movie.image ||
                  (movie.poster_path ? getTMDBImageUrl(movie.poster_path) : null);
                const rating =
                  movie.rating ||
                  (movie.vote_average
                    ? Number(movie.vote_average).toFixed(1)
                    : "—");
                const year =
                  movie.year ||
                  (movie.release_date ? movie.release_date.slice(0, 4) : "—");

                return (
                  <Link
                    to={getTitleUrl(movie)}
                    className="movie-card discover-card"
                    key={movie.id}
                  >
                    <div className="movie-image">
                      {poster ? (
                        <img src={poster} alt={movie.title} loading="lazy" />
                      ) : (
                        <div className="movie-card-placeholder">No image</div>
                      )}
                      <div className="card-badge" style={{ display: "inline-flex", alignItems: "center" }}>
                        <FaStar style={{ color: "#f59e0b", marginRight: "3px", fontSize: "11px" }} />
                        {rating}
                      </div>
                    </div>
                    <div className="movie-info">
                      <p className="card-type">
                        {movie.genres?.[0] || "MOVIE"}
                      </p>
                      <h3>{movie.title}</h3>
                      <div className="movie-meta">
                        <span>{year}</span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>
                          Consensus: <FaStar style={{ color: "#f59e0b", fontSize: "10px" }} /> {rating}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Discover;

