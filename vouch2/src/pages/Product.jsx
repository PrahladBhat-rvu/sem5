import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const movies = {
  1: {
    title: "Interstellar",
    year: "2014",
    genre: "Sci-Fi · Drama · Mystery",
    runtime: "2h 49m",
    rating: "8.7",
    poster:
      "/api/image/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    director: "Christopher Nolan",
    description:
      "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
  },

  2: {
    title: "The Dark Knight",
    year: "2008",
    genre: "Action · Crime · Drama",
    runtime: "2h 32m",
    rating: "9.0",
    poster:
      "/api/image/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    director: "Christopher Nolan",
    description:
      "Batman faces a criminal mastermind who throws Gotham into chaos and forces him to confront his limits.",
  },

  3: {
    title: "Inception",
    year: "2010",
    genre: "Action · Sci-Fi · Thriller",
    runtime: "2h 28m",
    rating: "8.8",
    poster:
      "/api/image/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    director: "Christopher Nolan",
    description:
      "A skilled thief who steals secrets through dreams is given a chance to erase his past by planting an idea in someone's mind.",
  },

  4: {
    title: "Dune: Part Two",
    year: "2024",
    genre: "Sci-Fi · Drama · War",
    runtime: "2h 46m",
    rating: "8.6",
    poster:
      "/api/image/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    director: "Denis Villeneuve",
    description:
      "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
  },
};

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

  const movie = movies[id] || movies[1];

  return (
    <div className="site">
      <Navbar />

      <main className="product-page">
        {/* PRODUCT HERO */}
        <section className="product-hero">
          <div className="product-poster">
            <img src={movie.poster} alt={movie.title} />
          </div>

          <div className="product-info">
            <p className="product-type">MOVIE</p>

            <h1>{movie.title}</h1>

            <div className="product-meta">
              <span>{movie.year}</span>
              <span>{movie.genre}</span>
              <span>{movie.runtime}</span>
            </div>

            <div className="main-rating">
              <strong>★ {movie.rating}</strong>
              <span>/ 10</span>
            </div>

            <p className="director">
              Directed by <strong>{movie.director}</strong>
            </p>

            <p className="product-description">
              {movie.description}
            </p>

            <div className="product-actions">
              <button className="primary vouch-button">
                + Vouch for this
              </button>

              <Link to="/search">Back to search</Link>
            </div>
          </div>
        </section>

        {/* EXTERNAL REVIEWS */}
        <section className="external-reviews">
          <div className="product-section-heading">
            <p className="eyebrow">REVIEWS FROM</p>
            <h2>What the internet thinks.</h2>
          </div>

          <div className="external-grid">
            <div className="external-card">
              <span>IMDb</span>

              <div>
                <strong>{movie.rating}</strong>
                <small>/ 10</small>
              </div>
            </div>

            <div className="external-card">
              <span>Rotten Tomatoes</span>

              <div>
                <strong>94%</strong>
                <small>Tomatometer</small>
              </div>
            </div>

            <div className="external-card">
              <span>Metacritic</span>

              <div>
                <strong>74</strong>
                <small>Metascore</small>
              </div>
            </div>
          </div>
        </section>

        {/* VOUCH REVIEWS */}
        <section className="vouch-reviews">
          <div className="reviews-heading">
            <div>
              <p className="eyebrow">VOUCH REVIEWS</p>
              <h2>What people here think.</h2>
            </div>

            <button className="write-review">
              Write a review →
            </button>
          </div>

          <div className="review-layout">
            {/* RATING SUMMARY */}
            <div className="review-summary">
              <div className="review-score">
                <strong>4.7</strong>

                <Stars rating={5} />

                <span>Based on 128 reviews</span>
              </div>

              <div className="rating-bars">
                <div className="rating-row">
                  <span>5</span>

                  <div className="bar">
                    <div
                      className="bar-fill"
                      style={{ width: "82%" }}
                    />
                  </div>

                  <span>82%</span>
                </div>

                <div className="rating-row">
                  <span>4</span>

                  <div className="bar">
                    <div
                      className="bar-fill"
                      style={{ width: "12%" }}
                    />
                  </div>

                  <span>12%</span>
                </div>

                <div className="rating-row">
                  <span>3</span>

                  <div className="bar">
                    <div
                      className="bar-fill"
                      style={{ width: "4%" }}
                    />
                  </div>

                  <span>4%</span>
                </div>

                <div className="rating-row">
                  <span>2</span>

                  <div className="bar">
                    <div
                      className="bar-fill"
                      style={{ width: "1%" }}
                    />
                  </div>

                  <span>1%</span>
                </div>

                <div className="rating-row">
                  <span>1</span>

                  <div className="bar">
                    <div
                      className="bar-fill"
                      style={{ width: "1%" }}
                    />
                  </div>

                  <span>1%</span>
                </div>
              </div>
            </div>

            {/* INDIVIDUAL REVIEWS */}
            <div className="review-list">
              {reviews.map((review) => (
                <article className="review-item" key={review.user}>
                  <div className="review-user">
                    <div className="avatar">
                      {review.user[0].toUpperCase()}
                    </div>

                    <div className="review-user-info">
                      <div className="review-user-name">
                        <strong>{review.name}</strong>

                        <span className="verified-badge">
                          Verified
                        </span>
                      </div>

                      <div className="review-meta">
                        <Stars rating={review.rating} />
                        <span>{review.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="review-content">
                    <h3>{review.title}</h3>

                    <p>{review.text}</p>

                    <div className="review-actions">
                      <button>♡ Like</button>
                      <button>Comment</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* BACK */}
        <div className="back-link">
          <Link to="/search">← Back to search</Link>
        </div>
      </main>
    </div>
  );
}

export default Product;