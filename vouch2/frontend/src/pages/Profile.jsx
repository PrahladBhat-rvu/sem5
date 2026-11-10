import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaStar,
  FaTimes,
  FaCheckCircle,
  FaBookmark,
  FaEye,
  FaHeart,
  FaPen,
  FaArrowRight,
  FaShareAlt,
  FaUserEdit,
  FaSignOutAlt,
  FaFilm,
  FaSlidersH,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabase";
import {
  getMyMovieReviews,
  deleteMovieReview,
  getUserProfile,
  updateUserProfile,
} from "../lib/api";
import { ALL_CURATED_MOVIES, FALLBACK_TRENDING, getTMDBImageUrl } from "../api/tmdb";
import { CURATED_SHELVES } from "../data/shelfData";
import { useAuthModal } from "../context/AuthModalContext";
import { getTitleUrl, slugify } from "../utils/slug";
import "./Profile.css";

// Helper to resolve full movie/tv title and metadata from all available catalogs
function getProfilePoster(movie) {
  if (!movie) return "/api/image/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg";
  const raw = movie.image || movie.poster || (movie.poster_path ? getTMDBImageUrl(movie.poster_path) : null);
  if (!raw) return "/api/image/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg";
  if (raw.includes("media-amazon.com") || raw.includes("images-amazon.com")) {
    return `/api/image/omdb?url=${encodeURIComponent(raw)}`;
  }
  return raw;
}

function resolveMovieMetadata(identifier, fallbackTitle) {
  if (!identifier && !fallbackTitle) return null;
  const cleanId = String(identifier || "").trim();
  const cleanSlug = slugify(fallbackTitle || identifier || "");

  // 1. Search ALL_CURATED_MOVIES
  let match = ALL_CURATED_MOVIES.find(
    (m) => String(m.id) === cleanId || slugify(m.title) === cleanSlug
  );
  if (match) return match;

  // 2. Search all CURATED_SHELVES
  for (const list of Object.values(CURATED_SHELVES)) {
    match = list.find(
      (m) => String(m.id) === cleanId || slugify(m.title) === cleanSlug
    );
    if (match) return match;
  }

  // 3. Search FALLBACK_TRENDING
  match = FALLBACK_TRENDING.find(
    (m) => String(m.id) === cleanId || slugify(m.title) === cleanSlug
  );
  if (match) return match;

  // 4. Search user's watchlist
  try {
    const wl = JSON.parse(localStorage.getItem("vouch_watchlist") || "[]");
    match = wl.find(
      (m) => String(m.id) === cleanId || slugify(m.title) === cleanSlug
    );
    if (match) return match;
  } catch {}

  return null;
}

export default function Profile() {
  const navigate = useNavigate();
  const { openLogin } = useAuthModal();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Active tab state: "watchlist" | "watched" | "favorites" | "vouches"
  const [activeTab, setActiveTab] = useState("watchlist");
  const [sortBy, setSortBy] = useState("default"); // "default" | "rating" | "year"

  // Live storage collections
  const [watchlist, setWatchlist] = useState([]);
  const [watchedIds, setWatchedIds] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [userReviews, setUserReviews] = useState([]);

  // User profile customization
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [customProfile, setCustomProfile] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("vouch_user_profile") || "{}");
    } catch {
      return {};
    }
  });

  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editGenre, setEditGenre] = useState("");
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  };

  // 1. Sync Supabase user session
  useEffect(() => {
    async function initUser() {
      if (!supabase) {
        setLoading(false);
        return;
      }
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (err) {
        console.warn("Auth check warning:", err);
      } finally {
        setLoading(false);
      }
    }
    initUser();
  }, []);

  // 2. Load and sync user collections from localStorage
  const refreshStorage = () => {
    try {
      // A. Watchlist
      const storedWatchlist = JSON.parse(localStorage.getItem("vouch_watchlist") || "[]");
      setWatchlist(Array.isArray(storedWatchlist) ? storedWatchlist : []);

      // B. Watched
      const storedWatched = JSON.parse(localStorage.getItem("vouch_watched") || "[]");
      setWatchedIds(Array.isArray(storedWatched) ? storedWatched : []);

      // C. Favorites
      const storedFavs = JSON.parse(localStorage.getItem("vouch_favorites") || "[]");
      setFavoriteIds(Array.isArray(storedFavs) ? storedFavs : []);

      
    } catch (e) {
      console.warn("Storage sync error:", e);
    }
  };

  useEffect(() => {
    refreshStorage();
    window.addEventListener("storage", refreshStorage);
    return () => window.removeEventListener("storage", refreshStorage);
  }, []);

  // Load reviews belonging to the currently logged-in user
useEffect(() => {
  let cancelled = false;

  async function loadReviews() {
    if (!user) {
      setUserReviews([]);
      return;
    }

    try {
      const reviews = await getMyMovieReviews(user.id);

      if (!cancelled) {
        setUserReviews(reviews);
      }
    } catch (error) {
      console.error("Failed to load user reviews:", error);
      if (!cancelled) showToast("Could not load your reviews");
    }
  }

  loadReviews();

  return () => {
    cancelled = true;
  };
}, [user]);

  // Compute full movie objects for Watched & Favorites
  const watchedMovies = useMemo(() => {
    return watchedIds
      .map((id) => {
        const info = resolveMovieMetadata(id);
        if (info) return info;
        return (
          watchlist.find((m) => String(m.id) === String(id)) || {
            id,
            title: isNaN(Number(id))
              ? String(id).replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
              : `Title #${id}`,
            year: "2024",
            rating: "8.5",
            image: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
            genres: ["Film"],
          }
        );
      })
      .filter(Boolean);
  }, [watchedIds, watchlist]);

  const favoriteMovies = useMemo(() => {
    return favoriteIds
      .map((id) => {
        const info = resolveMovieMetadata(id);
        if (info) return info;
        return (
          watchlist.find((m) => String(m.id) === String(id)) || {
            id,
            title: isNaN(Number(id))
              ? String(id).replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
              : `Title #${id}`,
            year: "2024",
            rating: "9.0",
            image: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
            genres: ["Featured"],
          }
        );
      })
      .filter(Boolean);
  }, [favoriteIds, watchlist]);

  // Sorting helper for card grids
  const sortMoviesList = (list) => {
    const copy = [...list];
    if (sortBy === "rating") {
      return copy.sort((a, b) => Number(b.rating || b.vote_average || 0) - Number(a.rating || a.vote_average || 0));
    }
    if (sortBy === "year") {
      return copy.sort((a, b) => Number(b.year || 0) - Number(a.year || 0));
    }
    return copy;
  };

  // Actions
  const handleRemoveFromWatchlist = (e, movieId) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = watchlist.filter((m) => String(m.id) !== String(movieId));
    setWatchlist(updated);
    localStorage.setItem("vouch_watchlist", JSON.stringify(updated));
    showToast("Removed from Watchlist");
  };

  const handleRemoveFromWatched = (e, movieId) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = watchedIds.filter((id) => String(id) !== String(movieId));
    setWatchedIds(updated);
    localStorage.setItem("vouch_watched", JSON.stringify(updated));
    showToast("Removed from Watched History");
  };

  const handleRemoveFromFavorites = (e, movieId) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = favoriteIds.filter((id) => String(id) !== String(movieId));
    setFavoriteIds(updated);
    localStorage.setItem("vouch_favorites", JSON.stringify(updated));
    showToast("Removed from Favorites");
  };

  const handleDeleteReview = async (reviewId) => {
  try {
    await deleteMovieReview(reviewId);

    setUserReviews((previous) =>
      previous.filter((review) => review.id !== reviewId)
    );

    showToast("Review deleted successfully");
  } catch (error) {
    console.error("Review deletion failed:", error);
    showToast(error.message || "Could not delete review");
  }
};

  const handleShareProfile = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      showToast("Profile link copied to clipboard!");
    } catch {
      showToast("Profile URL ready to share!");
    }
  };

  const handleOpenEdit = () => {
    setEditName(customProfile.name || displayName);
    setEditBio(customProfile.bio || defaultBio);
    setEditGenre(customProfile.genre || "Sci-Fi & Thrillers");
    setIsEditingProfile(true);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updated = {
      ...customProfile,
      name: editName.trim() || displayName,
      bio: editBio.trim() || defaultBio,
      genre: editGenre.trim() || "Cinema Enthusiast",
    };
    setCustomProfile(updated);
    localStorage.setItem("vouch_user_profile", JSON.stringify(updated));
    setIsEditingProfile(false);
    showToast("Profile updated successfully!");
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
      navigate("/");
    }
  };

  // Display fields
  const displayName =
    customProfile.name ||
    user?.user_metadata?.display_name ||
    user?.email?.split("@")[0] ||
    "Film Enthusiast";

  const userInitial = displayName.charAt(0).toUpperCase();
  const userHandle = `@${displayName.toLowerCase().replace(/[^a-z0-9]/g, "")}`;
  const userEmail = user?.email || "guest@vouch.media";
  const defaultBio =
    "Curating authentic movie opinions, ranking masterworks, and exploring cinematic storytelling.";
  const displayBio = customProfile.bio || defaultBio;
  const favoriteGenre = customProfile.genre || "Sci-Fi & Modern Classics";

  return (
    <div className="site">
      <Navbar />

      <main className="profile-page-modern">
        <div className="profile-container">
          {/* 1. HERO PROFILE CARD */}
          <section className="profile-card-glass">
            <div className="profile-card-glow" />

            <div className="profile-avatar-wrap">
              <div className="profile-avatar-core">{userInitial}</div>
              <div className="profile-online-dot" title="Active on Vouch" />
            </div>

            <div className="profile-details-col">
              <div className="profile-title-row">
                <h1>{displayName}</h1>
                <span className="profile-badge-pill">
                  <FaCheckCircle style={{ fontSize: "12px" }} />
                  Verified Critic
                </span>
              </div>

              <div className="profile-submeta-row">
                <span className="profile-handle-tag">{userHandle}</span>
                <span className="profile-email-tag">{userEmail}</span>
                <span className="profile-badge-pill" style={{ color: "#f59e0b", borderColor: "rgba(245, 158, 11, 0.3)", background: "rgba(245, 158, 11, 0.1)" }}>
                  <FaFilm style={{ fontSize: "11px" }} />
                  {favoriteGenre}
                </span>
              </div>

              <p className="profile-bio-text">{displayBio}</p>

              {/* Actionable Metrics Bar */}
              <div className="profile-metrics-row">
                <div
                  className="profile-metric-card"
                  onClick={() => setActiveTab("watchlist")}
                  title="View Saved Watchlist"
                >
                  <div className="profile-metric-header">
                    <span>Watchlist</span>
                    <FaBookmark className="profile-metric-icon" />
                  </div>
                  <span className="profile-metric-number">{watchlist.length}</span>
                </div>

                <div
                  className="profile-metric-card"
                  onClick={() => setActiveTab("watched")}
                  title="View Watched Movies"
                >
                  <div className="profile-metric-header">
                    <span>Watched</span>
                    <FaEye className="profile-metric-icon" style={{ color: "#3b82f6" }} />
                  </div>
                  <span className="profile-metric-number">{watchedMovies.length}</span>
                </div>

                <div
                  className="profile-metric-card"
                  onClick={() => setActiveTab("favorites")}
                  title="View Favorites"
                >
                  <div className="profile-metric-header">
                    <span>Favorites</span>
                    <FaHeart className="profile-metric-icon" style={{ color: "#ec4899" }} />
                  </div>
                  <span className="profile-metric-number">{favoriteMovies.length}</span>
                </div>

                <div
                  className="profile-metric-card"
                  onClick={() => setActiveTab("vouches")}
                  title="View Written Vouches"
                >
                  <div className="profile-metric-header">
                    <span>Vouches</span>
                    <FaPen className="profile-metric-icon" style={{ color: "#10b981" }} />
                  </div>
                  <span className="profile-metric-number">{userReviews.length}</span>
                </div>
              </div>
            </div>

            {/* Actions Toolbar */}
            <div className="profile-actions-toolbar">
              <button
                type="button"
                className="profile-edit-btn"
                onClick={handleOpenEdit}
                aria-label="Edit Profile Bio & Details"
              >
                <FaUserEdit />
                <span>Edit Profile</span>
              </button>

              <button
                type="button"
                className="profile-share-btn"
                onClick={handleShareProfile}
                aria-label="Share Profile"
              >
                <FaShareAlt />
                <span>Share Profile</span>
              </button>

              {user ? (
                <button
                  type="button"
                  className="profile-signout-btn"
                  onClick={handleLogout}
                  aria-label="Sign Out"
                >
                  <FaSignOutAlt />
                  <span>Sign Out</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="profile-edit-btn"
                  style={{ background: "#ff5436", color: "#ffffff", borderColor: "#ff5436" }}
                  onClick={openLogin}
                >
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </section>

          {/* 2. NAVIGATION TABS BAR */}
          <div className="profile-tabs-container">
            <div className="profile-tabs-list" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "watchlist"}
                className={`profile-nav-tab ${activeTab === "watchlist" ? "active" : ""}`}
                onClick={() => setActiveTab("watchlist")}
              >
                <FaBookmark />
                <span>Saved Watchlist</span>
                <span className="profile-tab-count">{watchlist.length}</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "watched"}
                className={`profile-nav-tab ${activeTab === "watched" ? "active" : ""}`}
                onClick={() => setActiveTab("watched")}
              >
                <FaEye />
                <span>Watched History</span>
                <span className="profile-tab-count">{watchedMovies.length}</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "favorites"}
                className={`profile-nav-tab ${activeTab === "favorites" ? "active" : ""}`}
                onClick={() => setActiveTab("favorites")}
              >
                <FaHeart />
                <span>Favorites</span>
                <span className="profile-tab-count">{favoriteMovies.length}</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "vouches"}
                className={`profile-nav-tab ${activeTab === "vouches" ? "active" : ""}`}
                onClick={() => setActiveTab("vouches")}
              >
                <FaPen />
                <span>My Vouches</span>
                <span className="profile-tab-count">{userReviews.length}</span>
              </button>
            </div>

            {/* Sort Filter (for movie grids) */}
            {activeTab !== "vouches" && (
              <div className="profile-sort-wrap">
                <FaSlidersH style={{ fontSize: "12px" }} />
                <span>Sort by:</span>
                <select
                  className="profile-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="default">Recently Added</option>
                  <option value="rating">Highest Rated</option>
                  <option value="year">Release Year</option>
                </select>
              </div>
            )}
          </div>

          {/* 3. TAB PANELS */}

          {/* TAB 1: WATCHLIST */}
          {activeTab === "watchlist" && (
            <section className="profile-tab-panel">
              {watchlist.length === 0 ? (
                <div className="profile-empty-panel">
                  <div className="profile-empty-icon">
                    <FaBookmark />
                  </div>
                  <h3>Your watchlist is empty</h3>
                  <p>
                    Browse movies and click "+ Watchlist" on any title to save it for your next movie night.
                  </p>
                  <Link to="/lists" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <span>Explore Movie Lists</span>
                    <FaArrowRight style={{ fontSize: "12px" }} />
                  </Link>
                </div>
              ) : (
                <div className="profile-cards-grid">
                  {sortMoviesList(watchlist).map((movie) => (
                    <div key={movie.id} className="profile-movie-card">
                      <Link to={getTitleUrl(movie)}>
                        <div className="profile-poster-holder">
                          <img
                            src={getProfilePoster(movie)}
                            alt={movie.title}
                            loading="lazy"
                          />
                          <span className="profile-poster-badge">
                            <FaStar style={{ color: "#f59e0b", fontSize: "10px" }} />
                            {Number(movie.rating || movie.vote_average || 8.5).toFixed(1)}
                          </span>

                          <button
                            type="button"
                            className="profile-card-action-btn"
                            title="Remove from Watchlist"
                            onClick={(e) => handleRemoveFromWatchlist(e, movie.id)}
                            aria-label={`Remove ${movie.title} from Watchlist`}
                          >
                            <FaTimes style={{ fontSize: "11px" }} />
                          </button>
                        </div>

                        <div className="profile-card-details">
                          <span className="profile-card-genre">
                            {Array.isArray(movie.genres) ? movie.genres[0] : "SAVED"}
                          </span>
                          <h3 className="profile-card-title">{movie.title}</h3>
                          <div className="profile-card-meta">
                            <span>{movie.year || "2024"}</span>
                            <span style={{ color: "#10b981" }}>Ready to Watch</span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* TAB 2: WATCHED HISTORY */}
          {activeTab === "watched" && (
            <section className="profile-tab-panel">
              {watchedMovies.length === 0 ? (
                <div className="profile-empty-panel">
                  <div className="profile-empty-icon" style={{ background: "rgba(59, 130, 246, 0.1)", color: "#3b82f6" }}>
                    <FaEye />
                  </div>
                  <h3>No watched movies logged yet</h3>
                  <p>
                    Track movies you've completed! Click "Mark Watched" on any movie page to build your film log.
                  </p>
                  <Link to="/" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <span>Browse Popular Titles</span>
                    <FaArrowRight style={{ fontSize: "12px" }} />
                  </Link>
                </div>
              ) : (
                <div className="profile-cards-grid">
                  {sortMoviesList(watchedMovies).map((movie) => (
                    <div key={movie.id} className="profile-movie-card">
                      <Link to={getTitleUrl(movie)}>
                        <div className="profile-poster-holder">
                          <img
                            src={getProfilePoster(movie)}
                            alt={movie.title}
                            loading="lazy"
                          />
                          <span className="profile-poster-badge" style={{ color: "#3b82f6" }}>
                            <FaCheckCircle style={{ fontSize: "10px" }} />
                            Watched
                          </span>

                          <button
                            type="button"
                            className="profile-card-action-btn"
                            title="Remove from Watched"
                            onClick={(e) => handleRemoveFromWatched(e, movie.id)}
                            aria-label={`Remove ${movie.title} from Watched`}
                          >
                            <FaTimes style={{ fontSize: "11px" }} />
                          </button>
                        </div>

                        <div className="profile-card-details">
                          <span className="profile-card-genre" style={{ color: "#3b82f6" }}>WATCHED LOG</span>
                          <h3 className="profile-card-title">{movie.title}</h3>
                          <div className="profile-card-meta">
                            <span>{movie.year || "2024"}</span>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>
                              <FaStar style={{ color: "#f59e0b", fontSize: "10px" }} />
                              {Number(movie.rating || movie.vote_average || 8.5).toFixed(1)}
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

          {/* TAB 3: FAVORITES */}
          {activeTab === "favorites" && (
            <section className="profile-tab-panel">
              {favoriteMovies.length === 0 ? (
                <div className="profile-empty-panel">
                  <div className="profile-empty-icon" style={{ background: "rgba(236, 72, 153, 0.1)", color: "#ec4899" }}>
                    <FaHeart />
                  </div>
                  <h3>No favorites saved yet</h3>
                  <p>
                    Tap the heart icon on films that blew you away to pin them to your personal Hall of Fame.
                  </p>
                  <Link to="/lists" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <span>Explore Great Lists</span>
                    <FaArrowRight style={{ fontSize: "12px" }} />
                  </Link>
                </div>
              ) : (
                <div className="profile-cards-grid">
                  {sortMoviesList(favoriteMovies).map((movie) => (
                    <div key={movie.id} className="profile-movie-card">
                      <Link to={getTitleUrl(movie)}>
                        <div className="profile-poster-holder">
                          <img
                            src={getProfilePoster(movie)}
                            alt={movie.title}
                            loading="lazy"
                          />
                          <span className="profile-poster-badge" style={{ color: "#ec4899" }}>
                            <FaHeart style={{ fontSize: "10px" }} />
                            Favorite
                          </span>

                          <button
                            type="button"
                            className="profile-card-action-btn"
                            title="Remove from Favorites"
                            onClick={(e) => handleRemoveFromFavorites(e, movie.id)}
                            aria-label={`Remove ${movie.title} from Favorites`}
                          >
                            <FaTimes style={{ fontSize: "11px" }} />
                          </button>
                        </div>

                        <div className="profile-card-details">
                          <span className="profile-card-genre" style={{ color: "#ec4899" }}>ALL-TIME FAVORITE</span>
                          <h3 className="profile-card-title">{movie.title}</h3>
                          <div className="profile-card-meta">
                            <span>{movie.year || "2024"}</span>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>
                              <FaStar style={{ color: "#f59e0b", fontSize: "10px" }} />
                              {Number(movie.rating || movie.vote_average || 9.0).toFixed(1)}
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

          {/* TAB 4: MY VOUCHES / REVIEWS */}
          {activeTab === "vouches" && (
            <section className="profile-tab-panel">
              {userReviews.length === 0 ? (
                <div className="profile-empty-panel">
                  <div className="profile-empty-icon" style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981" }}>
                    <FaPen />
                  </div>
                  <h3>No reviews written yet</h3>
                  <p>
                    Watched a title recently? Write a verified vouch on any movie page to contribute to the global consensus.
                  </p>
                  <Link to="/search" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <span>Find a Movie to Review</span>
                    <FaArrowRight style={{ fontSize: "12px" }} />
                  </Link>
                </div>
              ) : (
                <div className="profile-reviews-list">
                  {userReviews.map((rev) => (
                    <article key={rev.id} className="profile-review-card">
                      <div className="profile-review-header">
                        <div>
                          <Link
                            to={getTitleUrl({
                              id: rev.movieId,
                              title: rev.movieTitle,
                              movieSlug: rev.movieSlug,
                              type: rev.mediaType,
                            })}
                            className="profile-review-film-link"
                          >
                            <span>{rev.movieTitle}</span>
                            <FaArrowRight style={{ fontSize: "11px" }} />
                          </Link>

                          <div className="profile-review-stars">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <FaStar
                                key={i}
                                style={{
                                  color: i < rev.rating ? "#f59e0b" : "#4b5563",
                                  fontSize: "12px",
                                }}
                              />
                            ))}
                            <span style={{ marginLeft: "8px", fontSize: "12px", color: "rgba(255, 255, 255, 0.5)" }}>
                              {rev.date || "Verified Vouch"}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="profile-card-action-btn"
                          style={{ position: "static", width: "28px", height: "28px" }}
                          onClick={() => handleDeleteReview(rev.id)}
                          title="Delete Review"
                          aria-label="Delete Review"
                        >
                          <FaTimes style={{ fontSize: "11px" }} />
                        </button>
                      </div>

                      <h3 className="profile-review-heading">{rev.title}</h3>
                      <p className="profile-review-body">{rev.text}</p>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </main>

      {/* 4. EDIT PROFILE MODAL */}
      {isEditingProfile && (
        <div className="profile-modal-overlay" onClick={() => setIsEditingProfile(false)}>
          <div className="profile-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <h2>Customize Profile</h2>
              <button
                type="button"
                className="profile-modal-close"
                onClick={() => setIsEditingProfile(false)}
                aria-label="Close edit profile dialog"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSaveProfile}>
              <div className="profile-form-group">
                <label htmlFor="edit-name">Display Name</label>
                <input
                  id="edit-name"
                  type="text"
                  className="profile-form-input"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Your Name or Alias"
                  maxLength={40}
                  required
                />
              </div>

              <div className="profile-form-group">
                <label htmlFor="edit-genre">Favorite Genre / Cinema Focus</label>
                <input
                  id="edit-genre"
                  type="text"
                  className="profile-form-input"
                  value={editGenre}
                  onChange={(e) => setEditGenre(e.target.value)}
                  placeholder="e.g. Sci-Fi, Psychological Thrillers, Nolan Fan"
                  maxLength={50}
                />
              </div>

              <div className="profile-form-group">
                <label htmlFor="edit-bio">Bio Tagline</label>
                <textarea
                  id="edit-bio"
                  className="profile-form-textarea"
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Share a sentence about your film taste..."
                  maxLength={160}
                />
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
                <button
                  type="button"
                  className="profile-edit-btn"
                  style={{ flex: 1 }}
                  onClick={() => setIsEditingProfile(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="profile-toast-pill" role="status">
          {toastMessage}
        </div>
      )}
    </div>
  );
}

