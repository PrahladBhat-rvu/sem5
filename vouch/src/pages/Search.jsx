import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { searchMovies } from "../api/tmdb";

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const searchQuery = searchParams.get("q") || "";

    setQuery(searchQuery);

    if (!searchQuery.trim()) {
      setResults([]);
      setError("");
      return;
    }

    async function loadMovies() {
      try {
        setLoading(true);
        setError("");

        const movies = await searchMovies(searchQuery);

        setResults(movies || []);
      } catch (err) {
        console.error("Search error:", err);
        setResults([]);
        setError("Something went wrong while searching.");
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, [searchParams]);

  function handleSearch(e) {
    e.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setSearchParams({});
      return;
    }

    setSearchParams({ q: trimmedQuery });
  }

  return (
    <div>
      <Navbar />

      <main className="search-page">
        <section className="search-header">
          <p className="eyebrow">SEARCH VOUCH</p>

          <h1>Find something to review.</h1>

          <p className="search-description">
            Search movies, products, games and more. See what people think
            before you decide.
          </p>

          <form className="search-box" onSubmit={handleSearch}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a movie, product, game..."
              autoFocus
            />

            <button type="submit">Search</button>
          </form>
        </section>

        <section className="search-results">
          <div className="section-header">
            <div>
              <p className="eyebrow">
                {query ? "SEARCH RESULTS" : "TRENDING"}
              </p>

              <h2>
                {query
                  ? `Results for "${query}"`
                  : "What people are looking at"}
              </h2>
            </div>

            {query && !loading && !error && (
              <span className="result-count">
                {results.length} results
              </span>
            )}
          </div>

          {loading && (
            <div className="search-state">
              <h3>Searching...</h3>
              <p>Finding movies for you.</p>
            </div>
          )}

          {!loading && error && (
            <div className="search-state">
              <h3>Something went wrong.</h3>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && query && results.length === 0 && (
            <div className="no-results">
              <h3>No results found.</h3>

              <p>
                Try searching for another movie, product or game.
              </p>
            </div>
          )}

          {!loading && !error && results.length > 0 && (
            <div className="movie-grid">
              {results.map((movie) => (
                <Link
                  to={`/product/${movie.id}`}
                  className="movie-card"
                  key={movie.id}
                >
                  {movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                    />
                  ) : (
                    <div className="movie-card-placeholder">
                      No image
                    </div>
                  )}

                  <div className="movie-info">
                    <p className="card-type">MOVIE</p>

                    <h3>{movie.title}</h3>

                    <div className="movie-meta">
                      <span>
                        {movie.release_date
                          ? movie.release_date.slice(0, 4)
                          : "—"}
                      </span>

                      <span>
                        ★{" "}
                        {movie.vote_average
                          ? movie.vote_average.toFixed(1)
                          : "—"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Search;