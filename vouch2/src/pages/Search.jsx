import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  searchMovies,
  getTMDBImageUrl,
} from "../api/tmdb";

function getPosterUrl(movie) {
  // ----------------------------------------------------------
  // OMDb
  // ----------------------------------------------------------
  if (movie?.Poster && movie.Poster !== "N/A") {
    return `/api/image/omdb?url=${encodeURIComponent(
      movie.Poster
    )}`;
  }

  if (movie?.poster && movie.poster !== "N/A") {
    return `/api/image/omdb?url=${encodeURIComponent(
      movie.poster
    )}`;
  }

  // ----------------------------------------------------------
  // TMDB
  // ----------------------------------------------------------
  if (movie?.poster_path) {
    return getTMDBImageUrl(movie.poster_path);
  }

  return null;
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
  if (movie?.Year && movie.Year !== "N/A") {
    return movie.Year;
  }

  if (movie?.year) {
    return movie.year;
  }

  if (movie?.release_date) {
    return movie.release_date.slice(0, 4);
  }

  return "—";
}

function getRating(movie) {
  // OMDb IMDb rating
  if (
    movie?.imdbRating &&
    movie.imdbRating !== "N/A"
  ) {
    const rating = Number(movie.imdbRating);

    if (!Number.isNaN(rating)) {
      return rating.toFixed(1);
    }
  }

  // TMDB rating
  if (
    movie?.vote_average !== undefined &&
    movie?.vote_average !== null
  ) {
    const rating = Number(movie.vote_average);

    if (!Number.isNaN(rating) && rating > 0) {
      return rating.toFixed(1);
    }
  }

  return "—";
}

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

    let cancelled = false;

    async function loadMovies() {
      try {
        setLoading(true);
        setError("");

        const movies = await searchMovies(searchQuery);

        if (!cancelled) {
          setResults(movies || []);
        }
      } catch (err) {
        console.error("Search error:", err);

        if (!cancelled) {
          setResults([]);
          setError(
            "Something went wrong while searching."
          );
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
  }, [searchParams]);

  function handleSearch(e) {
    e.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setSearchParams({});
      return;
    }

    setSearchParams({
      q: trimmedQuery,
    });
  }

  return (
    <div>
      <Navbar />

      <main className="search-page">
        <section className="search-header">
          <p className="eyebrow">DISCOVER</p>

          <h1>Find something worth watching.</h1>

          <p className="search-description">
            Search movies and discover what people think
            about them.
          </p>

          <form
            className="search-form"
            onSubmit={handleSearch}
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a movie..."
              aria-label="Search for a movie"
            />

            <button type="submit">
              Search
            </button>
          </form>
        </section>

        {loading && (
          <div className="search-state">
            Searching...
          </div>
        )}

        {!loading && error && (
          <div className="search-state search-error">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          searchParams.get("q") &&
          results.length === 0 && (
            <div className="search-state">
              No movies found.
            </div>
          )}

        {!loading &&
          !error &&
          results.length > 0 && (
            <section className="search-results">
              <div className="search-results-header">
                <p>
                  Results for{" "}
                  <strong>
                    "{searchParams.get("q")}"
                  </strong>
                </p>

                <span>
                  {results.length} result
                  {results.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="movie-grid">
                {results.map((movie) => {
                  const poster = getPosterUrl(movie);
                  const title = getTitle(movie);
                  const year = getYear(movie);
                  const rating = getRating(movie);

                  /*
                   * IMPORTANT:
                   *
                   * OMDb:
                   * movie.id = "tt0468569"
                   *
                   * TMDB:
                   * movie.id = 550
                   *
                   * Therefore the same Link works for both.
                   */
                  const movieId =
                    movie.id ||
                    movie.imdbID ||
                    movie.tmdbID;

                  return (
                    <Link
                      to={`/product/${movieId}`}
                      className="movie-card"
                      key={`${movie.source || "movie"}-${movieId}`}
                    >
                      {poster ? (
                        <img
                          src={poster}
                          alt={title}
                          loading="lazy"
                        />
                      ) : (
                        <div className="movie-card-placeholder">
                          No image
                        </div>
                      )}

                      <div className="movie-info">
                        <p className="card-type">
                          MOVIE
                        </p>

                        <h3>{title}</h3>

                        <div className="movie-meta">
                          <span>{year}</span>

                          <span>
                            ★ {rating}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
      </main>
    </div>
  );
}

export default Search;