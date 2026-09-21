import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getMoviesByCategory } from "../api/tmdb";

function Category() {
  const { category, subcategory } = useParams();

  const [movies, setMovies] = useState([]);
  const [totalResults, setTotalResults] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categoryName =
    subcategory?.replace(/-/g, " ") || "Movies";

  const formattedCategory =
    categoryName.charAt(0).toUpperCase() +
    categoryName.slice(1);

  useEffect(() => {
    async function loadCategory() {
      try {
        setLoading(true);
        setError("");

        const data = await getMoviesByCategory(subcategory);

        setMovies(data.movies);
        setTotalResults(data.totalResults);
      } catch (err) {
        setMovies([]);
        setError(
          err.message ||
            "Something went wrong while loading this category."
        );
      } finally {
        setLoading(false);
      }
    }

    loadCategory();
  }, [subcategory]);

  return (
    <div className="site">
      <Navbar />

      <main className="category-page">

        {/* CATEGORY HERO */}

        <section className="category-hero">

          <p className="eyebrow">
            {category?.toUpperCase()} / DISCOVER
          </p>

          <h1>
            {formattedCategory}
            <br />
            <em>movies.</em>
          </h1>

          <p className="category-description">
            Discover popular {categoryName} movies and
            see what people are watching right now.
          </p>

        </section>


        {/* MOVIES */}

        <section className="category-content">

          <div className="category-header">

            <div>
              <p className="eyebrow">
                TRENDING NOW
              </p>

              <h2>
                Popular {formattedCategory}
              </h2>
            </div>

            {!loading && !error && (
              <span className="category-count">
                {totalResults.toLocaleString()} movies
              </span>
            )}

          </div>


          {/* LOADING */}

          {loading && (
            <div className="category-state">

              <div className="loading-spinner"></div>

              <p>
                Loading {categoryName} movies...
              </p>

            </div>
          )}


          {/* ERROR */}

          {!loading && error && (
            <div className="category-state error-state">

              <h3>
                Couldn't load this category.
              </h3>

              <p>
                {error}
              </p>

              <button
                className="retry-button"
                onClick={() =>
                  window.location.reload()
                }
              >
                Try again
              </button>

            </div>
          )}


          {/* EMPTY */}

          {!loading &&
            !error &&
            movies.length === 0 && (
              <div className="category-state">

                <h3>
                  No movies found.
                </h3>

                <p>
                  There aren't any movies available
                  for this category right now.
                </p>

                <Link to="/categories">
                  Browse other categories →
                </Link>

              </div>
            )}


          {/* MOVIE RESULTS */}

          {!loading &&
            !error &&
            movies.length > 0 && (
              <div className="category-movie-grid">

                {movies.map((movie) => (

                  <Link
                    key={movie.id}
                    to={`/product/${movie.id}`}
                    className="category-movie-card"
                  >

                    <div className="category-movie-image">

                      {movie.image ? (
                        <img
                          src={movie.image}
                          alt={movie.title}
                        />
                      ) : (
                        <div className="no-poster">
                          No image
                        </div>
                      )}

                    </div>

                    <div className="category-movie-info">

                      <h3>
                        {movie.title}
                      </h3>

                      <div className="category-movie-meta">

                        <span>
                          {movie.year}
                        </span>

                        <span>
                          ★ {movie.rating}
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

export default Category;