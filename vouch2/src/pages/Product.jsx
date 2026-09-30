import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  getMovieDetails,
  getTMDBImageUrl,
} from "../api/tmdb";

function getPosterUrl(movie) {
  // ----------------------------------------------------------
  // OMDb poster
  // ----------------------------------------------------------

  if (movie?.Poster && movie.Poster !== "N/A") {
    return `/api/image/omdb?url=${encodeURIComponent(
      movie.Poster
    )}`;
  }

  // Some normalized responses may use "poster"
  if (movie?.poster && movie.poster !== "N/A") {
    return `/api/image/omdb?url=${encodeURIComponent(
      movie.poster
    )}`;
  }

  // ----------------------------------------------------------
  // TMDB poster
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
      return rating;
    }
  }

  // TMDB rating
  if (
    movie?.vote_average !== undefined &&
    movie?.vote_average !== null
  ) {
    const rating = Number(movie.vote_average);

    if (!Number.isNaN(rating) && rating > 0) {
      return rating;
    }
  }

  return null;
}

function getGenres(movie) {
  // ----------------------------------------------------------
  // OMDb
  // ----------------------------------------------------------

  if (
    movie?.Genre &&
    movie.Genre !== "N/A"
  ) {
    return movie.Genre;
  }

  // ----------------------------------------------------------
  // TMDB
  // ----------------------------------------------------------

  if (Array.isArray(movie?.genres)) {
    return movie.genres
      .map((genre) => genre.name)
      .filter(Boolean)
      .join(" · ");
  }

  return "—";
}

function getRuntime(movie) {
  // OMDb gives:
  // "152 min"
  //
  // TMDB gives:
  // runtime: 152

  if (
    movie?.Runtime &&
    movie.Runtime !== "N/A"
  ) {
    return movie.Runtime;
  }

  if (
    movie?.runtime !== undefined &&
    movie?.runtime !== null
  ) {
    const minutes = Number(movie.runtime);

    if (!Number.isNaN(minutes) && minutes > 0) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;

      if (hours > 0) {
        return `${hours}h ${
          remainingMinutes > 0
            ? `${remainingMinutes}m`
            : ""
        }`.trim();
      }

      return `${minutes}m`;
    }
  }

  return "—";
}

function getPlot(movie) {
  // OMDb
  if (
    movie?.Plot &&
    movie.Plot !== "N/A"
  ) {
    return movie.Plot;
  }

  // TMDB
  if (movie?.overview) {
    return movie.overview;
  }

  return "No description available.";
}

function getCast(movie) {
  // ----------------------------------------------------------
  // OMDb
  // ----------------------------------------------------------

  if (
    movie?.Actors &&
    movie.Actors !== "N/A"
  ) {
    return movie.Actors
      .split(",")
      .map((actor) => actor.trim())
      .filter(Boolean);
  }

  // ----------------------------------------------------------
  // TMDB
  // ----------------------------------------------------------

  if (Array.isArray(movie?.credits?.cast)) {
    return movie.credits.cast
      .slice(0, 10)
      .map((person) => person.name)
      .filter(Boolean);
  }

  // Some APIs may return cast directly
  if (Array.isArray(movie?.cast)) {
    return movie.cast
      .slice(0, 10)
      .map((person) =>
        typeof person === "string"
          ? person
          : person.name
      )
      .filter(Boolean);
  }

  return [];
}

function getDirector(movie) {
  // ----------------------------------------------------------
  // OMDb
  // ----------------------------------------------------------

  if (
    movie?.Director &&
    movie.Director !== "N/A"
  ) {
    return movie.Director;
  }

  // ----------------------------------------------------------
  // TMDB
  // ----------------------------------------------------------

  if (Array.isArray(movie?.credits?.crew)) {
    const directors = movie.credits.crew
      .filter(
        (person) => person.job === "Director"
      )
      .map((person) => person.name)
      .filter(Boolean);

    if (directors.length > 0) {
      return directors.join(", ");
    }
  }

  return "Unknown";
}

function getWriters(movie) {
  // ----------------------------------------------------------
  // OMDb
  // ----------------------------------------------------------

  if (
    movie?.Writer &&
    movie.Writer !== "N/A"
  ) {
    return movie.Writer;
  }

  // ----------------------------------------------------------
  // TMDB
  // ----------------------------------------------------------

  if (Array.isArray(movie?.credits?.crew)) {
    const writers = movie.credits.crew
      .filter((person) =>
        [
          "Writer",
          "Screenplay",
          "Story",
        ].includes(person.job)
      )
      .map((person) => person.name)
      .filter(Boolean);

    const uniqueWriters = [
      ...new Set(writers),
    ];

    if (uniqueWriters.length > 0) {
      return uniqueWriters.join(", ");
    }
  }

  return "Unknown";
}

function Product() {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadMovie() {
      try {
        setLoading(true);
        setError("");

        // ----------------------------------------------------
        // First request
        //
        // Can be:
        //
        // /api/movie/tt0468569
        //
        // OR
        //
        // /api/movie/550
        // ----------------------------------------------------

        const data = await getMovieDetails(id);

        if (cancelled) {
          return;
        }

        let finalMovie = data;

        // ----------------------------------------------------
        // TMDB IMDb fallback
        //
        // If the server used TMDB /find to resolve an IMDb ID,
        // the first response may contain:
        //
        // id: 155
        // source: "tmdb"
        //
        // but not credits.
        //
        // Fetch the numeric TMDB movie endpoint to get:
        //
        // credits.cast
        // credits.crew
        // ----------------------------------------------------

        const needsCredits =
          data?.source === "tmdb" &&
          data?.id &&
          !data?.credits;

        if (needsCredits) {
          try {
            const detailedTMDBMovie =
              await getMovieDetails(data.id);

            if (
              detailedTMDBMovie &&
              !cancelled
            ) {
              finalMovie = {
                ...data,
                ...detailedTMDBMovie,

                // Preserve the original source
                // and IMDb ID.
                source: "tmdb",
                imdbID:
                  data.imdbID ||
                  data.external_ids?.imdb_id ||
                  id,
              };
            }
          } catch (creditError) {
            console.warn(
              "Could not load TMDB credits:",
              creditError
            );

            // We still use the first response.
            finalMovie = data;
          }
        }

        if (!cancelled) {
          setMovie(finalMovie);
        }
      } catch (err) {
        console.error(
          "Movie details error:",
          err
        );

        if (!cancelled) {
          setError(
            "Could not load this movie."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadMovie();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // ==========================================================
  // STATES
  // ==========================================================

  if (loading) {
    return (
      <div>
        <Navbar />

        <main className="product-page">
          <div className="product-state">
            Loading movie...
          </div>
        </main>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div>
        <Navbar />

        <main className="product-page">
          <div className="product-state product-error">
            {error || "Movie not found."}
          </div>
        </main>
      </div>
    );
  }

  // ==========================================================
  // NORMALIZED DISPLAY VALUES
  // ==========================================================

  const title = getTitle(movie);
  const year = getYear(movie);
  const poster = getPosterUrl(movie);
  const rating = getRating(movie);
  const genre = getGenres(movie);
  const runtime = getRuntime(movie);
  const plot = getPlot(movie);

  const cast = getCast(movie);
  const director = getDirector(movie);
  const writers = getWriters(movie);

  return (
    <div>
      <Navbar />

      <main className="product-page">
        <section className="product-hero">
          {/* ==================================================
              POSTER
          ================================================== */}

          <div className="product-poster">
            {poster ? (
              <img
                src={poster}
                alt={title}
              />
            ) : (
              <div className="product-poster-placeholder">
                No image
              </div>
            )}
          </div>

          {/* ==================================================
              MAIN INFORMATION
          ================================================== */}

          <div className="product-content">
            <p className="eyebrow">
              MOVIE
            </p>

            <h1>{title}</h1>

            <div className="product-meta">
              <span>{year}</span>

              <span>•</span>

              <span>{runtime}</span>

              <span>•</span>

              <span>{genre}</span>
            </div>

            {/* Rating */}

            <div className="product-rating">
              <span className="rating-star">
                ★
              </span>

              <strong>
                {rating !== null
                  ? rating.toFixed(1)
                  : "—"}
              </strong>

              <span>/ 10</span>
            </div>

            {/* Plot */}

            <div className="product-description">
              <h2>About the movie</h2>

              <p>{plot}</p>
            </div>

            {/* =================================================
                DIRECTOR
            ================================================= */}

            <div className="product-detail">
              <span className="detail-label">
                Director
              </span>

              <span className="detail-value">
                {director}
              </span>
            </div>

            {/* =================================================
                WRITERS
            ================================================= */}

            <div className="product-detail">
              <span className="detail-label">
                Writers
              </span>

              <span className="detail-value">
                {writers}
              </span>
            </div>

            {/* =================================================
                CAST
            ================================================= */}

            {cast.length > 0 && (
              <div className="product-cast">
                <h2>Cast</h2>

                <div className="cast-list">
                  {cast.map(
                    (actor, index) => (
                      <span
                        className="cast-chip"
                        key={`${actor}-${index}`}
                      >
                        {actor}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}

            {/* =================================================
                BACK LINK
            ================================================= */}

            <Link
              to="/search"
              className="back-to-search"
            >
              ← Back to search
            </Link>
          </div>
        </section>

        {/* ====================================================
            SOURCE DEBUG / METADATA
            ==================================================== */}

        <section className="product-source">
          <span>
            Data source:{" "}
            <strong>
              {movie.source === "tmdb"
                ? "TMDB"
                : "OMDb"}
            </strong>
          </span>

          {movie.imdbID && (
            <span>
              IMDb: {movie.imdbID}
            </span>
          )}

          {movie.tmdbID && (
            <span>
              TMDB: {movie.tmdbID}
            </span>
          )}
        </section>
      </main>
    </div>
  );
}

export default Product;