import { useEffect, useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaExclamationTriangle, FaFilm, FaRedo, FaUndo, FaStar } from "react-icons/fa";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import "./Search.css";
import { getTitleUrl } from "../utils/slug";
import {
  searchMovies,
  getTMDBImageUrl,
  FALLBACK_TRENDING,
} from "../api/tmdb";

const POPULAR_SUGGESTIONS = [
  "Interstellar",
  "Dune",
  "Oppenheimer",
  "The Dark Knight",
  "Inception",
  "Spider-Man",
  "Parasite",
  "The Matrix",
];

const QUICK_GENRES = ["All", "Action", "Sci-Fi", "Drama", "Comedy", "Horror"];

function getPosterUrl(movie) {
  const p =
    movie?.Poster && movie.Poster !== "N/A"
      ? movie.Poster
      : movie?.poster && movie.poster !== "N/A"
      ? movie.poster
      : movie?.poster_path;

  if (!p) return null;

  // If already relative proxy or local path
  if (p.startsWith("/api/image/")) {
    return p;
  }
  // Full remote URLs
  if (p.startsWith("http://") || p.startsWith("https://")) {
    if (p.includes("media-amazon.com")) {
      return `/api/image/omdb?url=${encodeURIComponent(p)}`;
    }
    return p;
  }
  // TMDB relative filename (e.g. /qJ2tW6WMUDux911r6m7haRef0WH.jpg)
  if (p.startsWith("/")) {
    return getTMDBImageUrl(p);
  }
  return `/api/image/omdb?url=${encodeURIComponent(p)}`;
}

function getTitle(movie) {
  return (
    movie?.Title ||
    movie?.title ||
    movie?.original_title ||
    "Untitled"
  );
}

function getYear(movie) {
  if (movie?.Year && movie.Year !== "N/A") return movie.Year;
  if (movie?.year) return movie.year;
  if (movie?.release_date) return movie.release_date.slice(0, 4);
  return "—";
}

function getRating(movie) {
  if (movie?.imdbRating && movie.imdbRating !== "N/A") {
    const rating = Number(movie.imdbRating);
    if (!Number.isNaN(rating)) return rating.toFixed(1);
  }
  if (movie?.vote_average !== undefined && movie?.vote_average !== null) {
    const rating = Number(movie.vote_average);
    if (!Number.isNaN(rating) && rating > 0) return rating.toFixed(1);
  }
  return "—";
}

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentQuery = searchParams.get("q") || "";

  const [inputVal, setInputVal] = useState(currentQuery);

  // Clean up any legacy search keys from sessionStorage
  useEffect(() => {
    try {
      sessionStorage.removeItem("vouch_last_search_url");
      sessionStorage.removeItem("vouch_last_search_query");
    } catch {}
  }, []);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("relevance"); // "relevance" | "rating" | "year"
  const [selectedGenre, setSelectedGenre] = useState("All");

  useEffect(() => {
    setInputVal(currentQuery);

    if (!currentQuery.trim()) {
      setResults([]);
      setError("");
      return;
    }

    let cancelled = false;

    async function loadMovies() {
      try {
        setLoading(true);
        setError("");
        const movies = await searchMovies(currentQuery);
        if (!cancelled) {
          setResults(movies || []);
        }
      } catch (err) {
        console.error("Search error:", err);
        if (!cancelled) {
          setResults([]);
          setError("Failed to fetch search results. Please check your connection or query.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadMovies();

    return () => {
      cancelled = true;
    };
  }, [currentQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = inputVal.trim();
    if (!trimmed) {
      setSearchParams({});
      return;
    }
    setSearchParams({ q: trimmed });
  };

  const handleSuggestionClick = (keyword) => {
    setInputVal(keyword);
    setSearchParams({ q: keyword });
  };

  const handleClear = () => {
    setInputVal("");
    setSearchParams({});
  };

  // Filter & Sort Results
  const filteredAndSortedResults = useMemo(() => {
    let list = [...results];

    // Filter by genre if applied
    if (selectedGenre !== "All") {
      const gLower = selectedGenre.toLowerCase();
      list = list.filter((m) => {
        if (Array.isArray(m.genres)) {
          return m.genres.some((g) => g.toLowerCase().includes(gLower));
        }
        if (typeof m.Genre === "string") {
          return m.Genre.toLowerCase().includes(gLower);
        }
        return true;
      });
    }

    // Sort
    if (sortBy === "rating") {
      list.sort((a, b) => {
        const rA = Number(getRating(a)) || 0;
        const rB = Number(getRating(b)) || 0;
        return rB - rA;
      });
    } else if (sortBy === "year") {
      list.sort((a, b) => {
        const yA = parseInt(getYear(a), 10) || 0;
        const yB = parseInt(getYear(b), 10) || 0;
        return yB - yA;
      });
    }

    return list;
  }, [results, selectedGenre, sortBy]);

  return (
    <div className="site">
      <Navbar />

      <main className="search-page-enhanced">
        {/* HERO SEARCH HEADER */}
        <section className="search-hero">
          <div className="search-hero-inner">
            <h1>
              Find something
              <br />
              <em>worth your time.</em>
            </h1>
            <p className="search-subtitle">
              Instant access to verified scores from Rotten Tomatoes, IMDb, Metacritic, and real audience vouches.
            </p>

            {/* SEARCH INPUT BAR */}
            <SearchBar
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onSubmit={(trimmed) => {
                if (!trimmed) {
                  setSearchParams({});
                } else {
                  setSearchParams({ q: trimmed });
                }
              }}
              autoFocus={true}
            />

            {/* POPULAR SEARCH PILLS */}
            <div className="search-popular-row">
              <span className="popular-label">Popular right now:</span>
              <div className="popular-pills">
                {POPULAR_SUGGESTIONS.map((term) => (
                  <button
                    key={term}
                    type="button"
                    className={`popular-pill ${currentQuery.toLowerCase() === term.toLowerCase() ? "active" : ""}`}
                    onClick={() => handleSuggestionClick(term)}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CONTROLS (Only visible if searching or has results) */}
        {currentQuery && results.length > 0 && !loading && (
          <section className="search-controls-bar">
            <div className="search-filter-pills">
              {QUICK_GENRES.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  className={`genre-filter-pill ${selectedGenre === genre ? "active" : ""}`}
                  onClick={() => setSelectedGenre(genre)}
                >
                  {genre}
                </button>
              ))}
            </div>

            <div className="search-sort-wrap">
              <label htmlFor="search-sort">Sort by:</label>
              <select
                id="search-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="relevance">Relevance</option>
                <option value="rating">Highest Consensus Rating</option>
                <option value="year">Release Year (Newest)</option>
              </select>
            </div>
          </section>
        )}

        {/* LOADING STATE - SKELETON CARDS */}
        {loading && (
          <section className="search-results-section">
            <div className="search-loading-header">
              <div className="loading-spinner"></div>
              <p>Gathering consensus across review databases for "{currentQuery}"...</p>
            </div>
            <div className="search-skeleton-grid">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="skeleton-card">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-text line-1"></div>
                  <div className="skeleton-text line-2"></div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ERROR STATE */}
        {!loading && error && (
          <section className="search-status-card error" role="alert">
            <div className="status-icon-badge error-badge">
              <FaExclamationTriangle />
            </div>
            <h3>Search temporarily unavailable</h3>
            <p>{error}</p>
            <button
              type="button"
              className="status-btn status-btn-retry"
              onClick={() => handleSuggestionClick(currentQuery)}
            >
              <FaRedo className="btn-icon" />
              <span>Retry Search</span>
            </button>
          </section>
        )}

        {/* NO RESULTS STATE */}
        {!loading && !error && currentQuery && results.length === 0 && (
          <section className="search-status-card empty">
            <div className="status-icon-badge empty-badge">
              <FaFilm />
            </div>
            <h3>No movies matched "{currentQuery}"</h3>
            <p>
              Double check the spelling or try searching for a franchise, actor, or popular title below.
            </p>
            <div className="empty-suggestions">
              {POPULAR_SUGGESTIONS.slice(0, 4).map((term) => (
                <button
                  key={term}
                  type="button"
                  className="popular-pill"
                  onClick={() => handleSuggestionClick(term)}
                >
                  Search "{term}"
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ACTIVE SEARCH RESULTS */}
        {!loading && !error && currentQuery && results.length > 0 && (
          <section className="search-results-section">
            <div className="search-results-meta">
              <h2>
                Results for <strong>"{currentQuery}"</strong>
              </h2>
              <span className="results-count">
                {filteredAndSortedResults.length} title
                {filteredAndSortedResults.length !== 1 ? "s" : ""} found
              </span>
            </div>

            {filteredAndSortedResults.length === 0 ? (
              <div className="search-status-card empty">
                <div className="status-icon-badge empty-badge">
                  <FaUndo />
                </div>
                <h3>No results in {selectedGenre}</h3>
                <p>No results found for genre "{selectedGenre}".</p>
                <button
                  type="button"
                  className="status-btn"
                  onClick={() => setSelectedGenre("All")}
                >
                  <FaUndo className="btn-icon" />
                  <span>Reset Genre Filter</span>
                </button>
              </div>
            ) : (
              <div className="movie-grid">
                {filteredAndSortedResults.map((movie) => {
                  const poster = getPosterUrl(movie);
                  const title = getTitle(movie);
                  const year = getYear(movie);
                  const rating = getRating(movie);
                  const movieId =
                    movie.id || movie.imdbID || movie.tmdbID;

                  return (
                    <Link
                      to={getTitleUrl(movie)}
                      state={{
                        fromSearch: currentQuery
                          ? `/search?q=${encodeURIComponent(currentQuery)}`
                          : "/search",
                        query: currentQuery || "",
                      }}
                      className="movie-card search-result-card"
                      key={`${movie.source || "movie"}-${movieId}`}
                    >
                      <div className="movie-image">
                        {poster ? (
                          <img
                            src={poster}
                            alt={title}
                            loading="lazy"
                          />
                        ) : (
                          <div className="movie-card-placeholder">
                            <FaFilm className="placeholder-icon" style={{ fontSize: "24px", opacity: 0.6, marginBottom: "6px" }} />
                            <span>No Poster Available</span>
                          </div>
                        )}
                        <span className="card-badge" style={{ display: "inline-flex", alignItems: "center" }}>
                          <FaStar style={{ color: "#f59e0b", marginRight: "3px", fontSize: "11px" }} />
                          {rating}
                        </span>
                      </div>

                      <div className="movie-info">
                        <p className="card-type">
                          {movie.source ? `${movie.source.toUpperCase()} VERIFIED` : "MOVIE"}
                        </p>
                        <h3>{title}</h3>
                        <div className="movie-meta">
                          <span>{year}</span>
                          <span className="rating-pill" style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>
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
        )}

        {/* EMPTY QUERY INITIAL STATE - SHOW TRENDING RECS */}
        {!currentQuery && !loading && (
          <section className="search-initial-view">
            <div className="initial-header">
              <h2>Or start with high-consensus favorites</h2>
            </div>

            <div className="movie-grid">
              {FALLBACK_TRENDING.slice(0, 8).map((movie) => (
                <Link
                  to={getTitleUrl(movie)}
                  state={{
                    fromSearch: "/search",
                    query: "",
                  }}
                  className="movie-card search-result-card"
                  key={movie.id}
                >
                  <div className="movie-image">
                    {movie.image ? (
                      <img
                        src={movie.image}
                        alt={movie.title}
                        loading="lazy"
                      />
                    ) : (
                      <div className="movie-card-placeholder">No image</div>
                    )}
                    <span className="card-badge" style={{ display: "inline-flex", alignItems: "center" }}>
                      <FaStar style={{ color: "#f59e0b", marginRight: "3px", fontSize: "11px" }} />
                      {movie.rating}
                    </span>
                  </div>
                  <div className="movie-info">
                    <p className="card-type">{movie.genres?.[0] || "FEATURED"}</p>
                    <h3>{movie.title}</h3>
                    <div className="movie-meta">
                      <span>{movie.year}</span>
                      <span style={{ display: "inline-flex", alignItems: "center" }}>
                        <FaStar style={{ color: "#f59e0b", marginRight: "3px", fontSize: "11px" }} />
                        {movie.rating}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default Search;
