import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaArrowRight } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { getTitleUrl } from "../utils/slug";
import { getNewReleases, getTrendingMovies, getTMDBImageUrl } from "../api/tmdb";

function NewReleases() {
  const [activeTab, setActiveTab] = useState("theatres"); // "theatres" | "trending"
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function fetchReleases() {
      try {
        setLoading(true);
        setError("");
        const data =
          activeTab === "theatres"
            ? await getNewReleases()
            : await getTrendingMovies("week");

        if (!cancelled) {
          setMovies(data || []);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load releases:", err);
          setError("Could not load latest releases. Showing curated drops.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchReleases();
    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  return (
    <div className="site">
      <Navbar />
      <main className="new-releases-page">
        {/* HEADER */}
        <section className="releases-hero">
          <h1>
            What's new.
            <br />
            <em>What's worth your time.</em>
          </h1>
          <p className="releases-subtitle">
            Skip the marketing hype. See verified aggregate reviews and community vouches
            for the latest theatrical and streaming releases.
          </p>

          {/* TAB SWITCHER */}
          <div className="releases-tabs">
            <button
              type="button"
              className={`releases-tab ${activeTab === "theatres" ? "active" : ""}`}
              onClick={() => setActiveTab("theatres")}
            >
              In Theatres Now
            </button>
            <button
              type="button"
              className={`releases-tab ${activeTab === "trending" ? "active" : ""}`}
              onClick={() => setActiveTab("trending")}
            >
              Trending This Week
            </button>
          </div>
        </section>

        {/* RELEASES LIST */}
        <section className="releases-content">
          <div className="releases-header-meta">
            <div>
              <h2>
                {activeTab === "theatres"
                  ? "Box Office & Theatrical Premieres"
                  : "Most Talked About This Week"}
              </h2>
            </div>
            <span className="releases-count">{movies.length} releases tracked</span>
          </div>

          {loading ? (
            <div className="releases-loading">
              <div className="loading-spinner"></div>
              <p>Tracking the latest reviews & box office data...</p>
            </div>
          ) : error ? (
            <div className="releases-error">{error}</div>
          ) : movies.length === 0 ? (
            <div className="releases-empty">
              <h3>No releases found.</h3>
              <p>Check back shortly for newly scheduled titles.</p>
            </div>
          ) : (
            <div className="releases-grid">
              {movies.map((movie) => {
                const poster =
                  movie.image ||
                  (movie.poster_path ? getTMDBImageUrl(movie.poster_path) : null);
                const rating =
                  movie.rating ||
                  (movie.vote_average
                    ? Number(movie.vote_average).toFixed(1)
                    : "—");
                const releaseYear =
                  movie.year ||
                  (movie.release_date ? movie.release_date.slice(0, 4) : "2024");
                const releaseDateFormatted = movie.release_date
                  ? new Date(movie.release_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : null;

                return (
                  <article key={movie.id} className="release-card">
                    <div className="release-poster">
                      {poster ? (
                        <img src={poster} alt={movie.title} loading="lazy" />
                      ) : (
                        <div className="release-poster-placeholder">No Poster</div>
                      )}
                      <span className="release-score" style={{ display: "inline-flex", alignItems: "center" }}>
                        <FaStar style={{ color: "#f59e0b", marginRight: "3px", fontSize: "11px" }} />
                        {rating}
                      </span>
                    </div>

                    <div className="release-details">
                      <div className="release-tags">
                        <span className="release-type-badge">THEATRICAL</span>
                        {releaseDateFormatted && (
                          <span className="release-date-badge">
                            {releaseDateFormatted}
                          </span>
                        )}
                      </div>

                      <h3>{movie.title}</h3>

                      {movie.tagline && (
                        <p className="release-tagline">"{movie.tagline}"</p>
                      )}

                      <p className="release-overview">
                        {movie.overview ||
                          "No synopsis provided. Check the full Vouch profile to see aggregate critic and audience breakdown."}
                      </p>

                      <div className="release-footer">
                        <div className="release-meta-items">
                          <span>{releaseYear}</span>
                          {movie.genres && (
                            <span>{movie.genres.slice(0, 2).join(", ")}</span>
                          )}
                        </div>

                        <Link
                          to={getTitleUrl(movie)}
                          className="release-action-link"
                          style={{ display: "inline-flex", alignItems: "center" }}
                        >
                          <span>Check Consensus</span>
                          <FaArrowRight style={{ marginLeft: "5px", fontSize: "11px" }} />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* BOTTOM NEWSLETTER / ALERT CTA */}
        <section className="releases-cta">
          <h2>Want alerts when reviews drop for upcoming films?</h2>
          <p>Create an account to build your personal watchlist and get genuine consensus notifications.</p>
          <div className="releases-cta-actions">
            <Link to="/signup" className="releases-primary-btn" style={{ display: "inline-flex", alignItems: "center" }}>
              <span>Create Free Account</span>
              <FaArrowRight style={{ marginLeft: "6px", fontSize: "12px" }} />
            </Link>
            <Link to="/categories" className="releases-secondary-btn">
              Browse Categories
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default NewReleases;

