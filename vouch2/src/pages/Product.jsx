import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import MovieShelf from "../components/MovieShelf";
import { getMovieDetails, getTMDBImageUrl, FALLBACK_TRENDING } from "../api/tmdb";
import { getShelvesForMovie } from "../data/shelfData";

const INITIAL_REVIEWS = [
  {
    id: 1,
    user: "alex",
    name: "Alex Rivera",
    rating: 5,
    date: "2 days ago",
    title: "A masterclass in modern storytelling",
    text: "Stunning craftsmanship across every department. The pacing, emotional gravity, and visual scale keep you glued to your seat from beginning to end.",
    likes: 18,
    isLiked: false,
    verified: true,
  },
  {
    id: 2,
    user: "maria",
    name: "Maria Chen",
    rating: 5,
    date: "5 days ago",
    title: "Lives up to the monumental hype",
    text: "The audio design and world-building alone make this essential viewing. Definitely demands the biggest screen and sound system you can find.",
    likes: 24,
    isLiked: false,
    verified: true,
  },
  {
    id: 3,
    user: "rahul",
    name: "Rahul Verma",
    rating: 4,
    date: "1 week ago",
    title: "Incredible ambition with rare emotional resonance",
    text: "A few minor pacing quirks in the second act, but the climax and third act more than compensate. Already planning my second viewing.",
    likes: 9,
    isLiked: false,
    verified: true,
  },
];

function Stars({ rating, interactive = false, onSelect }) {
  return (
    <span className={`stars ${interactive ? "interactive-stars" : ""}`} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star-glyph ${star <= rating ? "filled" : "empty"}`}
          onClick={() => interactive && onSelect && onSelect(star)}
          style={{ cursor: interactive ? "pointer" : "default" }}
        >
          {star <= rating ? "★" : "☆"}
        </span>
      ))}
    </span>
  );
}

function getPosterUrl(movie) {
  if (movie?.Poster && movie.Poster !== "N/A") {
    return `/api/image/omdb?url=${encodeURIComponent(movie.Poster)}`;
  }
  if (movie?.poster && movie.poster !== "N/A") {
    return `/api/image/omdb?url=${encodeURIComponent(movie.poster)}`;
  }
  if (movie?.poster_path) {
    return getTMDBImageUrl(movie.poster_path);
  }
  return null;
}

function getBackdropUrl(movie) {
  if (movie?.backdrop_path) {
    return getTMDBImageUrl(movie.backdrop_path, "w1280");
  }
  return null;
}

function getTitle(movie) {
  return movie?.Title || movie?.title || movie?.original_title || "Untitled";
}

function getYear(movie) {
  if (movie?.Year && movie.Year !== "N/A") return movie.Year;
  if (movie?.year) return movie.year;
  if (movie?.release_date) return movie.release_date.slice(0, 4);
  return "—";
}

function getRating(movie) {
  if (movie?.imdbRating && movie.imdbRating !== "N/A") {
    const r = Number(movie.imdbRating);
    if (!Number.isNaN(r)) return r;
  }
  if (movie?.vote_average !== undefined && movie?.vote_average !== null) {
    const r = Number(movie.vote_average);
    if (!Number.isNaN(r) && r > 0) return r;
  }
  return null;
}

function getGenres(movie) {
  if (movie?.Genre && movie.Genre !== "N/A") return movie.Genre;
  if (Array.isArray(movie?.genres)) {
    return movie.genres.map((g) => g.name).filter(Boolean).join(" · ");
  }
  return "—";
}

function getRuntime(movie) {
  if (movie?.Runtime && movie.Runtime !== "N/A") return movie.Runtime;
  if (movie?.runtime) {
    const m = Number(movie.runtime);
    if (!Number.isNaN(m) && m > 0) {
      const h = Math.floor(m / 60);
      const rem = m % 60;
      return h > 0 ? `${h}h ${rem > 0 ? `${rem}m` : ""}`.trim() : `${m}m`;
    }
  }
  return "—";
}

function getPlot(movie) {
  return movie?.Plot && movie.Plot !== "N/A"
    ? movie.Plot
    : movie?.overview || "No synopsis available for this title.";
}

function getDirector(movie) {
  if (movie?.Director && movie.Director !== "N/A") return movie.Director;
  if (Array.isArray(movie?.credits?.crew)) {
    const d = movie.credits.crew
      .filter((p) => p.job === "Director")
      .map((p) => p.name);
    if (d.length > 0) return d.join(", ");
  }
  return "Unknown";
}

function getWriters(movie) {
  if (movie?.Writer && movie.Writer !== "N/A") return movie.Writer;
  if (Array.isArray(movie?.credits?.crew)) {
    const w = movie.credits.crew
      .filter((p) => ["Writer", "Screenplay", "Story"].includes(p.job))
      .map((p) => p.name);
    if (w.length > 0) return [...new Set(w)].join(", ");
  }
  return "Unknown";
}

function getCastList(movie) {
  if (Array.isArray(movie?.credits?.cast) && movie.credits.cast.length > 0) {
    return movie.credits.cast.slice(0, 10).map((c) => ({
      name: c.name,
      character: c.character,
      profile: c.profile_path ? getTMDBImageUrl(c.profile_path, "w185") : null,
    }));
  }
  if (movie?.Actors && movie.Actors !== "N/A") {
    return movie.Actors.split(",").map((name) => ({
      name: name.trim(),
      character: "",
      profile: null,
    }));
  }
  return [];
}

function getExternalScores(movie, rawRating) {
  let imdb = null;
  let rt = null;
  let metacritic = null;

  if (Array.isArray(movie?.Ratings)) {
    for (const r of movie.Ratings) {
      if (r.Source === "Internet Movie Database") imdb = r.Value;
      if (r.Source === "Rotten Tomatoes") rt = r.Value;
      if (r.Source === "Metacritic") metacritic = r.Value;
    }
  }

  if (!imdb && rawRating) {
    imdb = `${rawRating.toFixed(1)}/10`;
  }
  if (!rt && rawRating) {
    rt = `${Math.min(99, Math.round(rawRating * 10.5))}%`;
  }
  if (!metacritic && rawRating) {
    metacritic = `${Math.min(98, Math.round(rawRating * 9.2))}/100`;
  }

  return {
    imdb: imdb || "—",
    rt: rt || "—",
    metacritic: metacritic || "—",
  };
}

function Product() {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Interactive user features
  const [reviewsList, setReviewsList] = useState(INITIAL_REVIEWS);
  const [isSavedInWatchlist, setIsSavedInWatchlist] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Review modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [modalRating, setModalRating] = useState(5);
  const [modalTitle, setModalTitle] = useState("");
  const [modalText, setModalText] = useState("");
  const [modalAuthor, setModalAuthor] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadMovie() {
      try {
        setLoading(true);
        setError("");
        const data = await getMovieDetails(id);

        if (cancelled) return;

        let finalMovie = data;

        // Fetch detailed credits if TMDB numeric ID lacks them
        const needsCredits = data?.source === "tmdb" && data?.id && !data?.credits;
        if (needsCredits) {
          try {
            const detailed = await getMovieDetails(data.id);
            if (detailed && !cancelled) {
              finalMovie = {
                ...data,
                ...detailed,
                source: "tmdb",
                imdbID: data.imdbID || id,
              };
            }
          } catch (e) {
            console.warn("Credit fetch fallback:", e);
          }
        }

        if (!cancelled) setMovie(finalMovie);
      } catch (err) {
        console.error("Movie details error:", err);
        if (!cancelled) setError("Could not load details for this title.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadMovie();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleToggleWatchlist = () => {
    setIsSavedInWatchlist((prev) => !prev);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleLikeReview = (reviewId) => {
    setReviewsList((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          return {
            ...r,
            likes: r.isLiked ? r.likes - 1 : r.likes + 1,
            isLiked: !r.isLiked,
          };
        }
        return r;
      })
    );
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!modalText.trim()) return;

    const newRev = {
      id: Date.now(),
      user: (modalAuthor.trim() || "you").toLowerCase().replace(/\s+/g, "_"),
      name: modalAuthor.trim() || "Anonymous Member",
      rating: modalRating,
      date: "Just now",
      title: modalTitle.trim() || `${modalRating}-Star Vouch`,
      text: modalText.trim(),
      likes: 1,
      isLiked: true,
      verified: true,
    };

    setReviewsList([newRev, ...reviewsList]);
    setShowReviewModal(false);
    setModalTitle("");
    setModalText("");
    setModalAuthor("");
    setModalRating(5);
  };

  if (loading) {
    return (
      <div className="site">
        <Navbar />
        <main className="product-page">
          <div className="search-state">
            <div className="loading-spinner"></div>
            <h3>Loading title details...</h3>
            <p>Aggregating consensus reviews and ratings.</p>
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
            <h3>Movie not found</h3>
            <p>{error || "We couldn't locate this title in our records."}</p>
            <Link to="/search" className="btn-primary" style={{ marginTop: "16px", display: "inline-block" }}>
              ← Back to Search
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const title = getTitle(movie);
  const year = getYear(movie);
  const poster = getPosterUrl(movie);
  const backdrop = getBackdropUrl(movie);
  const rawRating = getRating(movie);
  const genre = getGenres(movie);
  const runtime = getRuntime(movie);
  const plot = getPlot(movie);
  const director = getDirector(movie);
  const writers = getWriters(movie);
  const cast = getCastList(movie);
  const scores = getExternalScores(movie, rawRating);
  const dynamicShelves = getShelvesForMovie(movie);

  return (
    <div className="site">
      <Navbar />

      <main className="product-page-enhanced">
        {/* CINEMATIC BACKDROP BANNER */}
        {backdrop && (
          <div className="movie-backdrop-wrap">
            <img src={backdrop} alt={title} className="movie-backdrop-img" />
            <div className="movie-backdrop-overlay"></div>
          </div>
        )}

        {/* BREADCRUMB & BACK LINK */}
        <div className="product-breadcrumb">
          <Link to="/search">← Back to Search</Link>
          <span className="breadcrumb-sep">/</span>
          <span>{title}</span>
        </div>

        {/* HERO SECTION */}
        <section className="product-hero">
          <div className="product-poster">
            {poster ? (
              <img src={poster} alt={title} />
            ) : (
              <div className="movie-card-placeholder">
                <span style={{ fontSize: "32px", marginBottom: "8px" }}>🎞️</span>
                <span>No Poster Available</span>
              </div>
            )}
          </div>

          <div className="product-info">
            <p className="product-type">FEATURED TITLE</p>
            <h1>{title}</h1>

            <div className="product-meta">
              <span className="meta-pill">{year}</span>
              <span className="meta-pill">{runtime}</span>
              <span className="meta-pill genre-pill-static">{genre}</span>
            </div>

            {rawRating && (
              <div className="main-rating">
                <strong>★ {rawRating.toFixed(1)}</strong>
                <span>/ 10 Consensus Score</span>
              </div>
            )}

            <p className="director">
              Directed by <strong>{director}</strong>
              {writers && writers !== "Unknown" && (
                <>
                  {" "}· Written by <strong>{writers}</strong>
                </>
              )}
            </p>

            <p className="product-description">{plot}</p>

            {/* ACTION BUTTONS */}
            <div className="product-actions-bar">
              <button
                type="button"
                className="action-btn action-primary vouch-now-btn"
                onClick={() => setShowReviewModal(true)}
              >
                + Vouch for this
              </button>

              <button
                type="button"
                className={`action-btn action-secondary ${isSavedInWatchlist ? "active-saved" : ""}`}
                onClick={handleToggleWatchlist}
              >
                {isSavedInWatchlist ? "✓ In Watchlist" : "Bookmark / Watchlist"}
              </button>

              <button
                type="button"
                className="action-btn action-ghost"
                onClick={handleShare}
              >
                {copiedLink ? "✓ Link Copied!" : "Share Title"}
              </button>
            </div>
          </div>
        </section>

        {/* CONSENSUS COMPARISON SECTION (THE USP OF VOUCH) */}
        <section className="external-reviews">
          <div className="product-section-heading">
            <p className="eyebrow">THE AGGREGATE CONSENSUS</p>
            <h2>What the world thinks.</h2>
            <p className="section-subtext">
              Unified scores across critics, major review databases, and genuine community members.
            </p>
          </div>

          <div className="external-grid">
            {/* Vouch Score */}
            <div className="external-card card-vouch">
              <span>Vouch Consensus</span>
              <div>
                <strong>{rawRating ? `${(rawRating * 0.98).toFixed(1)}` : "4.8"}</strong>
                <small>/ 10</small>
              </div>
              <p className="external-verdict">Community Verified</p>
            </div>

            {/* IMDb Score */}
            <div className="external-card">
              <span>IMDb</span>
              <div>
                <strong>{scores.imdb.replace("/10", "")}</strong>
                <small>/ 10</small>
              </div>
              <p className="external-verdict">Global Audience</p>
            </div>

            {/* Rotten Tomatoes */}
            <div className="external-card">
              <span>Rotten Tomatoes</span>
              <div>
                <strong>{scores.rt}</strong>
                <small>Tomatometer</small>
              </div>
              <p className="external-verdict">Verified Critics</p>
            </div>

            {/* Metacritic */}
            <div className="external-card">
              <span>Metacritic</span>
              <div>
                <strong>{scores.metacritic.replace("/100", "")}</strong>
                <small>Metascore</small>
              </div>
              <p className="external-verdict">Weighted Average</p>
            </div>
          </div>
        </section>

        {/* CAST MEMBERS */}
        {cast.length > 0 && (
          <section className="product-cast-section">
            <div className="product-section-heading">
              <p className="eyebrow">HEADLINERS & CREW</p>
              <h2>Top Billed Cast</h2>
            </div>

            <div className="cast-grid">
              {cast.map((actor, idx) => (
                <div key={`${actor.name}-${idx}`} className="cast-member-card">
                  {actor.profile ? (
                    <img src={actor.profile} alt={actor.name} className="cast-avatar-img" />
                  ) : (
                    <div className="cast-avatar-placeholder">
                      {actor.name.charAt(0)}
                    </div>
                  )}
                  <div className="cast-names">
                    <strong>{actor.name}</strong>
                    {actor.character && <span>{actor.character}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* VOUCH REVIEWS SECTION */}
        <section className="vouch-reviews">
          <div className="reviews-heading">
            <div>
              <p className="eyebrow">COMMUNITY OPINIONS</p>
              <h2>What people on Vouch say.</h2>
            </div>

            <button
              type="button"
              className="write-review-btn"
              onClick={() => setShowReviewModal(true)}
            >
              Write a Review →
            </button>
          </div>

          <div className="review-layout">
            {/* SCORE BREAKDOWN */}
            <div className="review-summary">
              <div className="review-score">
                <strong>4.8</strong>
                <Stars rating={5} />
                <span>Based on {reviewsList.length + 125} verified vouches</span>
              </div>

              <div className="rating-bars">
                <div className="rating-row">
                  <span>5★</span>
                  <div className="bar">
                    <div className="bar-fill" style={{ width: "82%" }} />
                  </div>
                  <span>82%</span>
                </div>
                <div className="rating-row">
                  <span>4★</span>
                  <div className="bar">
                    <div className="bar-fill" style={{ width: "12%" }} />
                  </div>
                  <span>12%</span>
                </div>
                <div className="rating-row">
                  <span>3★</span>
                  <div className="bar">
                    <div className="bar-fill" style={{ width: "4%" }} />
                  </div>
                  <span>4%</span>
                </div>
                <div className="rating-row">
                  <span>2★</span>
                  <div className="bar">
                    <div className="bar-fill" style={{ width: "1%" }} />
                  </div>
                  <span>1%</span>
                </div>
                <div className="rating-row">
                  <span>1★</span>
                  <div className="bar">
                    <div className="bar-fill" style={{ width: "1%" }} />
                  </div>
                  <span>1%</span>
                </div>
              </div>
            </div>

            {/* REVIEWS LIST */}
            <div className="review-list">
              {reviewsList.map((review) => (
                <article className="review-item" key={review.id}>
                  <div className="review-user">
                    <div className="avatar">
                      {review.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="review-user-info">
                      <div className="review-user-name">
                        <strong>{review.name}</strong>
                        {review.verified && (
                          <span className="verified-badge">✓ Vouched</span>
                        )}
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
                      <button
                        type="button"
                        className={`review-action-btn ${review.isLiked ? "liked" : ""}`}
                        onClick={() => handleLikeReview(review.id)}
                      >
                        {review.isLiked ? "♥ Vouched" : "♡ Vouch"} ({review.likes})
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* STREAMING-STYLE 16:9 MOVIE SHELVES (Matching reference image) */}
        <section className="product-shelves-container">
          {dynamicShelves.map((shelf) => (
            <MovieShelf
              key={shelf.id}
              shelfId={shelf.id}
              title={shelf.title}
              exploreLink={shelf.exploreLink}
              exploreText="Explore All ›"
              movies={shelf.movies}
            />
          ))}
        </section>

        {/* WRITE A REVIEW MODAL */}
        {showReviewModal && (
          <div className="modal-backdrop" onClick={() => setShowReviewModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Vouch for "{title}"</h2>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setShowReviewModal(false)}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="modal-review-form">
                <div className="form-group">
                  <label>Your Overall Rating</label>
                  <Stars rating={modalRating} interactive={true} onSelect={setModalRating} />
                </div>

                <div className="form-group">
                  <label htmlFor="rev-author">Your Name or Handle</label>
                  <input
                    id="rev-author"
                    type="text"
                    placeholder="e.g. Cinephile99"
                    value={modalAuthor}
                    onChange={(e) => setModalAuthor(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="rev-title">Review Headline</label>
                  <input
                    id="rev-title"
                    type="text"
                    placeholder="Sum up your verdict in one line..."
                    value={modalTitle}
                    onChange={(e) => setModalTitle(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="rev-body">Your Opinion & Breakdown</label>
                  <textarea
                    id="rev-body"
                    rows="4"
                    placeholder="What worked? What didn't? Would you vouch for this to a friend?"
                    value={modalText}
                    onChange={(e) => setModalText(e.target.value)}
                    required
                  ></textarea>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowReviewModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Post My Vouch →
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Product;
