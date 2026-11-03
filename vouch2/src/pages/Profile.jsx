import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaStar, FaTimes, FaCheckCircle, FaBookmark, FaPen, FaArrowRight } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabase";
import { FALLBACK_TRENDING } from "../api/tmdb";
import { useAuthModal } from "../context/AuthModalContext";
import { getTitleUrl } from "../utils/slug";

function Profile() {
  const navigate = useNavigate();
  const { openLogin } = useAuthModal();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("watchlist"); // "watchlist" | "vouches"

  // User saved state
  const [watchlist, setWatchlist] = useState([
    FALLBACK_TRENDING[0], // Dune: Part Two
    FALLBACK_TRENDING[1], // Oppenheimer
    FALLBACK_TRENDING[2], // Interstellar
  ]);

  const [userReviews, setUserReviews] = useState([
    {
      id: 101,
      movieTitle: "Dune: Part Two",
      movieId: 693134,
      rating: 5,
      date: "3 days ago",
      title: "An undisputed modern masterpiece",
      text: "Visually uncompromised, sound design that rattles your chest, and storytelling that treats the viewer with respect. 5 stars all day.",
    },
  ]);

  useEffect(() => {
    async function checkUser() {
      if (!supabase) {
        setLoading(false);
        return;
      }
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    }

    checkUser();
  }, []);

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
      navigate("/");
    }
  };

  const handleRemoveFromWatchlist = (e, movieId) => {
    e.preventDefault();
    e.stopPropagation();
    setWatchlist((prev) => prev.filter((m) => m.id !== movieId));
  };

  const handleDeleteReview = (reviewId) => {
    setUserReviews((prev) => prev.filter((r) => r.id !== reviewId));
  };

  if (loading) {
    return (
      <div className="site">
        <Navbar />
        <main className="profile-page">
          <div className="search-state">
            <div className="loading-spinner"></div>
            <p>Loading your profile...</p>
          </div>
        </main>
      </div>
    );
  }

  const displayName =
    user?.user_metadata?.display_name ||
    user?.email?.split("@")[0] ||
    "Film Enthusiast";
  const userInitial = displayName.charAt(0).toUpperCase();
  const userEmail = user?.email || "guest@vouch.media";

  return (
    <div className="site">
      <Navbar />

      <main className="profile-page">
        {/* PROFILE HEADER CARD */}
        <section className="profile-header-card">
          <div className="profile-avatar-large">{userInitial}</div>

          <div className="profile-user-details">
            <div className="profile-name-row">
              <h1>{displayName}</h1>
              <span className="verified-badge" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <FaCheckCircle style={{ color: "#10b981", fontSize: "12px" }} />
                Verified Member
              </span>
            </div>
            <p className="profile-handle">@{displayName.toLowerCase().replace(/\s+/g, "")}</p>
            <p className="profile-email">{userEmail}</p>

            <div className="profile-stats-row">
              <div className="profile-stat-box">
                <strong>{watchlist.length}</strong>
                <span>In Watchlist</span>
              </div>
              <div className="profile-stat-box">
                <strong>{userReviews.length}</strong>
                <span>Vouches Written</span>
              </div>
              <div className="profile-stat-box">
                <strong>100%</strong>
                <span>Honest Feedback</span>
              </div>
            </div>
          </div>

          <div className="profile-actions-header">
            {user ? (
              <button
                type="button"
                className="profile-logout-btn"
                onClick={handleLogout}
              >
                Sign Out
              </button>
            ) : (
              <button
                type="button"
                className="btn-primary"
                onClick={openLogin}
              >
                Sign In to Sync
              </button>
            )}
          </div>
        </section>

        {/* TABS SELECTOR */}
        <section className="profile-tabs-wrap">
          <div className="profile-tabs">
            <button
              type="button"
              className={`profile-tab ${activeTab === "watchlist" ? "active" : ""}`}
              onClick={() => setActiveTab("watchlist")}
            >
              Saved Watchlist ({watchlist.length})
            </button>
            <button
              type="button"
              className={`profile-tab ${activeTab === "vouches" ? "active" : ""}`}
              onClick={() => setActiveTab("vouches")}
            >
              My Written Vouches ({userReviews.length})
            </button>
          </div>
        </section>

        {/* TAB 1: WATCHLIST */}
        {activeTab === "watchlist" && (
          <section className="profile-content-section">
            {watchlist.length === 0 ? (
              <div className="profile-empty-state">
                <div className="empty-icon">
                  <FaBookmark style={{ fontSize: "28px", color: "var(--color-primary, #ff5436)", opacity: 0.8 }} />
                </div>
                <h3>Your watchlist is empty</h3>
                <p>
                  Found a film you want to save for later? Click "Bookmark / Watchlist" on any title.
                </p>
                <Link to="/discover" className="btn-primary" style={{ marginTop: "16px", display: "inline-flex", alignItems: "center" }}>
                  <span>Explore Movies</span>
                  <FaArrowRight style={{ marginLeft: "6px", fontSize: "12px" }} />
                </Link>
              </div>
            ) : (
              <div className="movie-grid">
                {watchlist.map((movie) => (
                  <div key={movie.id} className="movie-card watchlist-card">
                    <Link to={getTitleUrl(movie)}>
                      <div className="movie-image">
                        <img src={movie.image} alt={movie.title} loading="lazy" />
                        <span className="card-badge" style={{ display: "inline-flex", alignItems: "center" }}>
                          <FaStar style={{ color: "#f59e0b", marginRight: "3px", fontSize: "11px" }} />
                          {movie.rating}
                        </span>
                        <button
                          type="button"
                          className="watchlist-remove-btn"
                          title="Remove from watchlist"
                          onClick={(e) => handleRemoveFromWatchlist(e, movie.id)}
                        >
                          <FaTimes style={{ fontSize: "12px" }} />
                        </button>
                      </div>
                      <div className="movie-info">
                        <p className="card-type">{movie.genres?.[0] || "SAVED"}</p>
                        <h3>{movie.title}</h3>
                        <div className="movie-meta">
                          <span>{movie.year}</span>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>
                            Consensus: <FaStar style={{ color: "#f59e0b", fontSize: "10px" }} /> {movie.rating}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* TAB 2: VOUCHES */}
        {activeTab === "vouches" && (
          <section className="profile-content-section">
            {userReviews.length === 0 ? (
              <div className="profile-empty-state">
                <div className="empty-icon">
                  <FaPen style={{ fontSize: "28px", color: "var(--color-primary, #ff5436)", opacity: 0.8 }} />
                </div>
                <h3>You haven't posted any reviews yet</h3>
                <p>
                  Watched something recently? Share your consensus verdict with the community.
                </p>
                <Link to="/search" className="btn-primary" style={{ marginTop: "16px", display: "inline-flex", alignItems: "center" }}>
                  <span>Find a Movie to Review</span>
                  <FaArrowRight style={{ marginLeft: "6px", fontSize: "12px" }} />
                </Link>
              </div>
            ) : (
              <div className="user-reviews-list">
                {userReviews.map((rev) => (
                  <article key={rev.id} className="user-review-card">
                    <div className="user-review-header">
                      <div>
                        <Link to={getTitleUrl({ id: rev.movieId, title: rev.movieTitle })} className="review-movie-link" style={{ display: "inline-flex", alignItems: "center" }}>
                          <span>{rev.movieTitle}</span>
                          <FaArrowRight style={{ marginLeft: "5px", fontSize: "11px" }} />
                        </Link>
                        <div className="user-review-stars" style={{ display: "inline-flex", alignItems: "center", gap: "2px" }}>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <FaStar
                              key={i}
                              style={{
                                color: i < rev.rating ? "#f59e0b" : "#4b5563",
                                fontSize: "13px",
                              }}
                            />
                          ))}
                          <span className="user-review-date" style={{ marginLeft: "6px" }}>{rev.date}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="delete-review-btn"
                        onClick={() => handleDeleteReview(rev.id)}
                        title="Delete review"
                      >
                        Delete
                      </button>
                    </div>

                    <h3>{rev.title}</h3>
                    <p>{rev.text}</p>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default Profile;
