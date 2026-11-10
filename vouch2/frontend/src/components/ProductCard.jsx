import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getMovieDetails, getTMDBImageUrl } from "../api/tmdb";

const reviews = [
  {
    user: "alex",
    name: "Alex",
    rating: 5,
    date: "3 days ago",
    title: "One of those movies that stays with you",
    text: "One of those movies that stays with you long after it ends.",
  },
  {
    user: "maria",
    name: "Maria",
    rating: 5,
    date: "1 week ago",
    title: "The visuals and story work perfectly",
    text: "The visuals, music and story all come together perfectly.",
  },
  {
    user: "rahul",
    name: "Rahul",
    rating: 4,
    date: "2 weeks ago",
    title: "Definitely worth watching on a big screen",
    text: "A great experience. Definitely worth watching on a big screen.",
  },
];

function Stars({ rating }) {
  return (
    <span className="stars" aria-label={`${rating} out of 5 stars`}>
      {"★".repeat(rating)}
      {"☆".repeat(5 - rating)}
    </span>
  );
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

        const data = await getMovieDetails(id);

        if (!cancelled) {
          setMovie(data);
        }
      } catch (err) {
        console.error("Movie details error:", err);

        if (!cancelled) {
          setError("Could not load this movie.");
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

  if (loading) {
    return (
      <div className="site">
        <Navbar />

        <main className="product-page">
          <div className="search-state">
            <h3>Loading movie...</h3>
            <p>Getting the movie details.</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="site">
        <Navbar />

        <main className="product-page">
          <div className="search-state">
            <h3>Movie not found.</h3>
            <p>{error || "We couldn't find this movie."}</p>

            <Link to="/search">
              ← Back to search
            </Link>
          </div>
        </main>
      </div>
    );
  }

  /*
   * Supports the OMDb-style response we're using now.
   */

  const title = movie.Title || movie.title || "Untitled";

  const year =
    movie.Year ||
    (movie.release_date
      ? movie.release_date.slice(0, 4)
      : "—");

  const poster =
    movie.Poster && movie.Poster !== "N/A"
      ? movie.Poster
      : movie.poster_path
        ? getTMDBImageUrl(movie.poster_path)
        : null;

  const genre =
    movie.Genre ||
    movie.genre ||
    "—";

  const runtime =
    movie.Runtime ||
    movie.runtime ||
    "—";

  const director =
    movie.Director ||
    movie.director ||
    "Unknown";

  const description =
    movie.Plot ||
    movie.overview ||
    "No description available.";

  const imdbRating =
    movie.imdbRating ||
    movie.vote_average;

  const rating =
    imdbRating && imdbRating !== "N/A"
      ? Number(imdbRating)
      : null;

  const actors =
    movie.Actors ||
    movie.actors ||
    "";

  const writers =
    movie.Writer ||
    movie.writer ||
    "";

  return (
    <div className="site">
      <Navbar />

      <main className="product-page">

        {/* =================================================
            PRODUCT HERO
            ================================================= */}

        <section className="product-hero">

          <div className="product-poster">
            {poster ? (
              <img
                src={poster}
                alt={title}
              />
            ) : (
              <div className="movie-card-placeholder">
                No poster available
              </div>
            )}
          </div>

          <div className="product-info">

            <p className="product-type">
              MOVIE
            </p>

            <h1>{title}</h1>

            <div className="product-meta">
              <span>{year}</span>
              <span>{genre}</span>
              <span>{runtime}</span>
            </div>

            {rating && (
              <div className="main-rating">
                <strong>
                  ★ {rating}
                </strong>

                <span>/ 10</span>
              </div>
            )}

            <p className="director">
              Directed by{" "}
              <strong>{director}</strong>
            </p>

            <p className="product-description">
              {description}
            </p>

            {actors && (
              <p className="director">
                <strong>Cast:</strong>{" "}
                {actors}
              </p>
            )}

            {writers && (
              <p className="director">
                <strong>Writer:</strong>{" "}
                {writers}
              </p>
            )}

            <div className="product-actions">

              <button className="primary vouch-button">
                + Vouch for this
              </button>

              <Link to="/search">
                Back to search
              </Link>

            </div>

          </div>
        </section>


        {/* =================================================
            EXTERNAL REVIEWS
            ================================================= */}

        <section className="external-reviews">

          <div className="product-section-heading">

            <p className="eyebrow">
              REVIEWS FROM
            </p>

            <h2>
              What the internet thinks.
            </h2>

          </div>


          <div className="external-grid">

            <div className="external-card">

              <span>IMDb</span>

              <div>

                <strong>
                  {rating || "—"}
                </strong>

                <small>
                  / 10
                </small>

              </div>

            </div>


            <div className="external-card">

              <span>
                Rotten Tomatoes
              </span>

              <div>

                <strong>
                  —
                </strong>

                <small>
                  Tomatometer
                </small>

              </div>

            </div>


            <div className="external-card">

              <span>
                Metacritic
              </span>

              <div>

                <strong>
                  —
                </strong>

                <small>
                  Metascore
                </small>

              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            VOUCH REVIEWS
            ================================================= */}

        <section className="vouch-reviews">

          <div className="reviews-heading">

            <div>

              <p className="eyebrow">
                VOUCH REVIEWS
              </p>

              <h2>
                What people here think.
              </h2>

            </div>

            <button className="write-review">
              Write a review →
            </button>

          </div>


          <div className="review-layout">

            <div className="review-summary">

              <div className="review-score">

                <strong>
                  4.7
                </strong>

                <Stars rating={5} />

                <span>
                  Based on 128 reviews
                </span>

              </div>


              <div className="rating-bars">

                <div className="rating-row">
                  <span>5</span>

                  <div className="bar">
                    <div
                      className="bar-fill"
                      style={{
                        width: "82%",
                      }}
                    />
                  </div>

                  <span>82%</span>
                </div>


                <div className="rating-row">
                  <span>4</span>

                  <div className="bar">
                    <div
                      className="bar-fill"
                      style={{
                        width: "12%",
                      }}
                    />
                  </div>

                  <span>12%</span>
                </div>


                <div className="rating-row">
                  <span>3</span>

                  <div className="bar">
                    <div
                      className="bar-fill"
                      style={{
                        width: "4%",
                      }}
                    />
                  </div>

                  <span>4%</span>
                </div>


                <div className="rating-row">
                  <span>2</span>

                  <div className="bar">
                    <div
                      className="bar-fill"
                      style={{
                        width: "1%",
                      }}
                    />
                  </div>

                  <span>1%</span>
                </div>


                <div className="rating-row">
                  <span>1</span>

                  <div className="bar">
                    <div
                      className="bar-fill"
                      style={{
                        width: "1%",
                      }}
                    />
                  </div>

                  <span>1%</span>
                </div>

              </div>

            </div>


            <div className="review-list">

              {reviews.map((review) => (

                <article
                  className="review-item"
                  key={review.user}
                >

                  <div className="review-user">

                    <div className="avatar">
                      {review.user[0].toUpperCase()}
                    </div>

                    <div className="review-user-info">

                      <div className="review-user-name">

                        <strong>
                          {review.name}
                        </strong>

                        <span className="verified-badge">
                          Verified
                        </span>

                      </div>

                      <div className="review-meta">

                        <Stars
                          rating={review.rating}
                        />

                        <span>
                          {review.date}
                        </span>

                      </div>

                    </div>

                  </div>


                  <div className="review-content">

                    <h3>
                      {review.title}
                    </h3>

                    <p>
                      {review.text}
                    </p>

                    <div className="review-actions">

                      <button>
                        ♡ Like
                      </button>

                      <button>
                        Comment
                      </button>

                    </div>

                  </div>

                </article>

              ))}

            </div>

          </div>

        </section>


        <div className="back-link">
          <Link to="/search">
            ← Back to search
          </Link>
        </div>

      </main>
    </div>
  );
}

export default Product;