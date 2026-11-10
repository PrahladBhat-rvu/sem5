import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FaStar,
  FaHeart,
  FaBookmark,
  FaPlus,
  FaTimes,
  FaTrash,
  FaArrowLeft,
  FaArrowRight,
  FaSearch,
  FaCheck,
  FaFilm,
  FaLayerGroup,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import { ALL_CURATED_MOVIES, FALLBACK_TRENDING } from "../api/tmdb";
import { CURATED_SHELVES } from "../data/shelfData";
import { getTitleUrl } from "../utils/slug";
import "./Lists.css";

// Helper to resolve poster image safely through proxy
function getMoviePoster(m) {
  if (!m) return "/api/image/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg";
  const raw = m.image || m.poster || (m.poster_path ? `/api/image/w500${m.poster_path}` : null);
  if (!raw) return "/api/image/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg";
  if (raw.includes("media-amazon.com") || raw.includes("images-amazon.com")) {
    return `/api/image/omdb?url=${encodeURIComponent(raw)}`;
  }
  return raw;
}

// Starter collections if the user has no custom lists yet
const INITIAL_STARTER_LISTS = [
  {
    id: "custom-starter-mindbenders",
    title: "Mind-Bending Masterpieces",
    description: "Films with intricate narratives, temporal paradoxes, and reality-altering twists.",
    category: "Sci-Fi & Thriller",
    createdAt: "Curated Starter",
    movies: [
      {
        id: 27205,
        title: "Inception",
        year: "2010",
        rating: "8.8",
        poster: "/api/image/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
        genres: ["Action", "Sci-Fi"],
      },
      {
        id: 157336,
        title: "Interstellar",
        year: "2014",
        rating: "8.7",
        poster: "/api/image/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        genres: ["Sci-Fi", "Adventure"],
      },
      {
        id: 155,
        title: "The Dark Knight",
        year: "2008",
        rating: "9.0",
        poster: "/api/image/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
        genres: ["Action", "Crime"],
      },
      {
        id: 693134,
        title: "Dune: Part Two",
        year: "2024",
        rating: "8.6",
        poster: "/api/image/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
        genres: ["Sci-Fi", "Adventure"],
      },
    ],
  },
];

export default function Lists() {
  const [activeTab, setActiveTab] = useState("all");
  const [activeListId, setActiveListId] = useState(null);

  // Lists state
  const [watchlist, setWatchlist] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [customLists, setCustomLists] = useState([]);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddMovieOpen, setIsAddMovieOpen] = useState(false);

  // Form state
  const [newListName, setNewListName] = useState("");
  const [newListDesc, setNewListDesc] = useState("");
  const [newListCategory, setNewListCategory] = useState("Custom");

  // Movie Search Picker inside a list
  const [searchQuery, setSearchQuery] = useState("");

  // Load lists from storage
  const syncStorage = () => {
    try {
      const storedWl = JSON.parse(localStorage.getItem("vouch_watchlist") || "[]");
      setWatchlist(Array.isArray(storedWl) ? storedWl : []);
    } catch {
      setWatchlist([]);
    }

    try {
      const storedFav = JSON.parse(localStorage.getItem("vouch_favorites") || "[]");
      setFavorites(Array.isArray(storedFav) ? storedFav : []);
    } catch {
      setFavorites([]);
    }

    try {
      const storedCustom = JSON.parse(localStorage.getItem("vouch_custom_lists") || "null");
      if (storedCustom && Array.isArray(storedCustom)) {
        setCustomLists(storedCustom);
      } else {
        localStorage.setItem("vouch_custom_lists", JSON.stringify(INITIAL_STARTER_LISTS));
        setCustomLists(INITIAL_STARTER_LISTS);
      }
    } catch {
      setCustomLists(INITIAL_STARTER_LISTS);
    }
  };

  useEffect(() => {
    syncStorage();
    window.addEventListener("storage", syncStorage);
    return () => window.removeEventListener("storage", syncStorage);
  }, []);

  // Built-in lists definitions
  const builtInLists = useMemo(() => [
    {
      id: "builtin-watchlist",
      title: "Watchlist",
      description: "Films and series you have queued up to experience next.",
      category: "Watchlist",
      chip: "WATCHLIST",
      chipClass: "watchlist",
      isBuiltIn: true,
      storageKey: "vouch_watchlist",
      movies: watchlist,
    },
    {
      id: "builtin-favorites",
      title: "Liked Movies & Favorites",
      description: "Your all-time favorites, highly vouched cinematic gems, and top picks.",
      category: "Favorites",
      chip: "LIKED",
      chipClass: "favorites",
      isBuiltIn: true,
      storageKey: "vouch_favorites",
      movies: favorites,
    },
  ], [watchlist, favorites]);

  // Combined lists for display
  const allLists = useMemo(() => {
    return [...builtInLists, ...customLists];
  }, [builtInLists, customLists]);

  // Filtered lists based on active tab
  const displayedLists = useMemo(() => {
    if (activeTab === "watchlist") return [builtInLists[0]];
    if (activeTab === "favorites") return [builtInLists[1]];
    if (activeTab === "custom") return customLists;
    return allLists;
  }, [activeTab, builtInLists, customLists, allLists]);

  // Currently opened list
  const activeList = useMemo(() => {
    if (!activeListId) return null;
    return allLists.find((l) => l.id === activeListId) || null;
  }, [activeListId, allLists]);

  // Candidate catalog for searching movies to add
  const catalogCandidates = useMemo(() => {
    const map = new Map();
    // Add ALL_CURATED_MOVIES
    for (const m of ALL_CURATED_MOVIES) {
      if (m && m.id && !map.has(String(m.id))) {
        map.set(String(m.id), m);
      }
    }
    // Add FALLBACK_TRENDING
    for (const m of FALLBACK_TRENDING) {
      if (m && m.id && !map.has(String(m.id))) {
        map.set(String(m.id), m);
      }
    }
    // Add CURATED_SHELVES items
    for (const shelf of Object.values(CURATED_SHELVES)) {
      if (Array.isArray(shelf)) {
        for (const m of shelf) {
          if (m && m.id && !map.has(String(m.id))) {
            map.set(String(m.id), m);
          }
        }
      }
    }
    return Array.from(map.values());
  }, []);

  // Filtered search results for movie picker
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return catalogCandidates.slice(0, 15);
    return catalogCandidates
      .filter((m) => {
        const titleMatch = (m.title || "").toLowerCase().includes(q);
        const yearMatch = String(m.year || "").includes(q);
        const genreMatch = (m.genres || []).some((g) => g.toLowerCase().includes(q));
        return titleMatch || yearMatch || genreMatch;
      })
      .slice(0, 20);
  }, [searchQuery, catalogCandidates]);

  // ============================================================
  // ACTIONS: Create, Delete, Add, Remove
  // ============================================================

  const handleCreateList = (e) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    const newList = {
      id: `custom-${Date.now()}`,
      title: newListName.trim(),
      description: newListDesc.trim() || "A custom curated cinema list.",
      category: newListCategory || "Custom",
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      movies: [],
    };

    const updated = [newList, ...customLists];
    setCustomLists(updated);
    localStorage.setItem("vouch_custom_lists", JSON.stringify(updated));

    // Reset & open newly created list
    setNewListName("");
    setNewListDesc("");
    setIsCreateModalOpen(false);
    setActiveListId(newList.id);
  };

  const handleDeleteCustomList = (e, listId) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this list?")) return;

    const updated = customLists.filter((l) => l.id !== listId);
    setCustomLists(updated);
    localStorage.setItem("vouch_custom_lists", JSON.stringify(updated));

    if (activeListId === listId) {
      setActiveListId(null);
    }
  };

  const handleToggleMovieInActiveList = (movie) => {
    if (!activeList) return;

    const isAlreadyIn = activeList.movies.some((m) => String(m.id) === String(movie.id));

    if (activeList.isBuiltIn) {
      const storageKey = activeList.storageKey;
      let currentList = activeList.movies;
      let updated;
      if (isAlreadyIn) {
        updated = currentList.filter((m) => String(m.id) !== String(movie.id));
      } else {
        updated = [movie, ...currentList];
      }
      localStorage.setItem(storageKey, JSON.stringify(updated));
      if (storageKey === "vouch_watchlist") setWatchlist(updated);
      if (storageKey === "vouch_favorites") setFavorites(updated);
    } else {
      let updatedMovies;
      if (isAlreadyIn) {
        updatedMovies = activeList.movies.filter((m) => String(m.id) !== String(movie.id));
      } else {
        updatedMovies = [movie, ...activeList.movies];
      }
      const updatedCustom = customLists.map((l) => (l.id === activeList.id ? { ...l, movies: updatedMovies } : l));
      setCustomLists(updatedCustom);
      localStorage.setItem("vouch_custom_lists", JSON.stringify(updatedCustom));
    }
  };

  const handleRemoveMovieFromList = (e, movieId) => {
    e.stopPropagation();
    if (!activeList) return;

    if (activeList.isBuiltIn) {
      const storageKey = activeList.storageKey;
      const updated = activeList.movies.filter((m) => String(m.id) !== String(movieId));
      localStorage.setItem(storageKey, JSON.stringify(updated));
      if (storageKey === "vouch_watchlist") setWatchlist(updated);
      if (storageKey === "vouch_favorites") setFavorites(updated);
    } else {
      const updatedMovies = activeList.movies.filter((m) => String(m.id) !== String(movieId));
      const updatedCustom = customLists.map((l) => (l.id === activeList.id ? { ...l, movies: updatedMovies } : l));
      setCustomLists(updatedCustom);
      localStorage.setItem("vouch_custom_lists", JSON.stringify(updatedCustom));
    }
  };

  return (
    <>
      <Navbar />

      <main className="lists-page">
        {/* ============================================================
            VIEW 1: ACTIVE LIST DETAIL VIEW
           ============================================================ */}
        {activeList ? (
          <div className="list-detail-view">
            <button
              type="button"
              className="list-detail-back-btn"
              onClick={() => setActiveListId(null)}
              aria-label="Back to all lists"
            >
              <FaArrowLeft />
              <span>Back to all lists</span>
            </button>

            <section className="list-detail-hero">
              <div className="list-detail-hero-left">
                <h2>{activeList.title}</h2>
                <p>{activeList.description}</p>
                <div className="list-detail-stats">
                  <span>
                    <FaFilm />
                    <strong>{activeList.movies.length}</strong> {activeList.movies.length === 1 ? "film" : "films"}
                  </span>
                  <span>
                    <FaLayerGroup />
                    <span>{activeList.category || "Custom List"}</span>
                  </span>
                </div>
              </div>

              <div className="list-detail-hero-actions">
                <button
                  type="button"
                  className="list-btn-add-movies"
                  onClick={() => setIsAddMovieOpen(true)}
                >
                  <FaPlus />
                  <span>Add Movies</span>
                </button>
              </div>
            </section>

            {/* Movies Grid in List */}
            {activeList.movies.length === 0 ? (
              <div className="list-empty-state">
                <div className="list-empty-icon">
                  <FaFilm />
                </div>
                <h3>This list is currently empty</h3>
                <p>Start curating by searching and adding your favorite movies and series.</p>
                <button
                  type="button"
                  className="list-btn-add-movies"
                  onClick={() => setIsAddMovieOpen(true)}
                >
                  <FaPlus />
                  <span>Add your first film</span>
                </button>
              </div>
            ) : (
              <div className="list-movies-grid">
                {activeList.movies.map((m) => (
                  <div key={m.id} className="list-movie-item">
                    <Link to={getTitleUrl(m)}>
                      <div className="list-movie-poster-wrap">
                        <img src={getMoviePoster(m)} alt={m.title} loading="lazy" />
                        <span className="card-badge">
                          <FaStar style={{ fontSize: "10px" }} />
                          <span>{Number(m.rating || m.vote_average || 8.0).toFixed(1)}</span>
                        </span>
                        <span className="card-year-badge">
                          {m.year || "FILM"}
                        </span>
                        <button
                          type="button"
                          className="list-movie-remove-btn"
                          title="Remove film from list"
                          onClick={(e) => handleRemoveMovieFromList(e, m.id)}
                          aria-label={`Remove ${m.title} from list`}
                        >
                          <FaTimes />
                        </button>
                      </div>

                      <div className="list-movie-info">
                        <h4 className="list-movie-title">{m.title}</h4>
                        <div className="list-movie-meta">
                          <span>{m.year || "Movie"}</span>
                          <span>· {m.genres?.[0] || "Cinema"}</span>
                        </div>
                        {Array.isArray(m.genres) && m.genres.length > 0 && (
                          <div className="card-genres-row">
                            {m.genres.slice(0, 2).map((g) => (
                              <span key={g} className="card-genre-pill">{g}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* ============================================================
             VIEW 2: ALL LISTS CARDS OVERVIEW
             ============================================================ */
          <>
            <header className="lists-header">
              <div className="lists-header-left">
                <h1>Movie Lists & Collections</h1>
                <p>Curate your personal watchlists, liked films, and custom cinema collections.</p>
              </div>

              <div className="lists-header-actions">
                <button
                  type="button"
                  className="lists-btn-create"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  <FaPlus />
                  <span>Create New List</span>
                </button>
              </div>
            </header>

            {/* Navigation Filter Tabs */}
            <nav className="lists-tabs-bar" aria-label="Lists Filters">
              <button
                type="button"
                className={`lists-tab-btn ${activeTab === "all" ? "active" : ""}`}
                onClick={() => setActiveTab("all")}
              >
                All Lists <span className="lists-tab-count">{allLists.length}</span>
              </button>
              <button
                type="button"
                className={`lists-tab-btn ${activeTab === "watchlist" ? "active" : ""}`}
                onClick={() => setActiveTab("watchlist")}
              >
                <FaBookmark style={{ fontSize: "12px" }} />
                Watchlist <span className="lists-tab-count">{watchlist.length}</span>
              </button>
              <button
                type="button"
                className={`lists-tab-btn ${activeTab === "favorites" ? "active" : ""}`}
                onClick={() => setActiveTab("favorites")}
              >
                <FaHeart style={{ fontSize: "12px" }} />
                Liked & Favorites <span className="lists-tab-count">{favorites.length}</span>
              </button>
              <button
                type="button"
                className={`lists-tab-btn ${activeTab === "custom" ? "active" : ""}`}
                onClick={() => setActiveTab("custom")}
              >
                <FaLayerGroup style={{ fontSize: "12px" }} />
                Custom Lists <span className="lists-tab-count">{customLists.length}</span>
              </button>
            </nav>

            {/* Lists Cards Grid */}
            <div className="lists-grid">
              {displayedLists.map((list) => {
                const previewPosters = list.movies.slice(0, 4);

                return (
                  <article
                    key={list.id}
                    className="list-card"
                    onClick={() => setActiveListId(list.id)}
                  >
                    {/* Mosaic Posters Preview Banner */}
                    <div className={`list-card-mosaic ${previewPosters.length === 1 ? "single-hero" : ""}`}>
                      {previewPosters.length > 0 ? (
                        previewPosters.map((m, idx) => (
                          <img
                            key={`${list.id}-prev-${m.id}-${idx}`}
                            src={getMoviePoster(m)}
                            alt={m.title}
                            loading="lazy"
                          />
                        ))
                      ) : (
                        <div className="list-card-mosaic-empty">
                          <FaFilm />
                          <span>Empty List</span>
                        </div>
                      )}
                      <div className="list-card-mosaic-overlay" />
                    </div>

                    {list.chip && (
                      <span className={`list-card-chip ${list.chipClass || ""}`}>{list.chip}</span>
                    )}

                    <div className="list-card-body">
                      <div className="list-card-meta-top">
                        <span className="list-card-count">
                          {list.movies.length} {list.movies.length === 1 ? "film" : "films"}
                        </span>
                        <span className="list-card-date">{list.createdAt || "Collection"}</span>
                      </div>

                      <h3 className="list-card-title">{list.title}</h3>
                      <p className="list-card-desc">{list.description}</p>

                      <div className="list-card-footer">
                        <span className="list-card-view-btn">
                          <span>Explore list</span>
                          <FaArrowRight style={{ fontSize: "11px" }} />
                        </span>

                        {!list.isBuiltIn && (
                          <button
                            type="button"
                            className="list-card-delete-btn"
                            title="Delete custom list"
                            onClick={(e) => handleDeleteCustomList(e, list.id)}
                            aria-label={`Delete list ${list.title}`}
                          >
                            <FaTrash style={{ fontSize: "12px" }} />
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}

        {/* ============================================================
            MODAL 1: CREATE NEW LIST MODAL
           ============================================================ */}
        {isCreateModalOpen && (
          <div className="lists-modal-backdrop" onClick={() => setIsCreateModalOpen(false)}>
            <div className="lists-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="lists-modal-header">
                <h3>Create New Movie List</h3>
                <button
                  type="button"
                  className="lists-modal-close"
                  onClick={() => setIsCreateModalOpen(false)}
                  aria-label="Close modal"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleCreateList}>
                <div className="lists-modal-body">
                  <div className="lists-field">
                    <label htmlFor="new-list-name">List Title *</label>
                    <input
                      id="new-list-name"
                      type="text"
                      placeholder="e.g. Late Night Noir, Sci-Fi Essentials"
                      value={newListName}
                      onChange={(e) => setNewListName(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>

                  <div className="lists-field">
                    <label htmlFor="new-list-desc">Description</label>
                    <textarea
                      id="new-list-desc"
                      placeholder="Describe the mood, theme, or ranking of this list..."
                      value={newListDesc}
                      onChange={(e) => setNewListDesc(e.target.value)}
                    />
                  </div>

                  <div className="lists-field">
                    <label htmlFor="new-list-category">Category / Tag</label>
                    <select
                      id="new-list-category"
                      value={newListCategory}
                      onChange={(e) => setNewListCategory(e.target.value)}
                    >
                      <option value="Custom">Custom</option>
                      <option value="Favorites">Favorites</option>
                      <option value="Sci-Fi & Thriller">Sci-Fi & Thriller</option>
                      <option value="Drama & Classics">Drama & Classics</option>
                      <option value="Weekend Marathon">Weekend Marathon</option>
                      <option value="Directorial Highlights">Directorial Highlights</option>
                    </select>
                  </div>
                </div>

                <div className="lists-modal-footer">
                  <button
                    type="button"
                    className="lists-btn-cancel"
                    onClick={() => setIsCreateModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="lists-btn-submit">
                    Create List
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================
            MODAL 2: ADD MOVIES TO ACTIVE LIST SEARCH PICKER
           ============================================================ */}
        {isAddMovieOpen && activeList && (
          <div className="lists-modal-backdrop" onClick={() => setIsAddMovieOpen(false)}>
            <div className="lists-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="lists-modal-header">
                <h3>Add Films to {activeList.title}</h3>
                <button
                  type="button"
                  className="lists-modal-close"
                  onClick={() => setIsAddMovieOpen(false)}
                  aria-label="Close picker"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="lists-modal-body">
                <div className="lists-picker-search">
                  <FaSearch className="lists-picker-icon" />
                  <input
                    type="text"
                    placeholder="Search movies by title, year, or genre..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                </div>

                <div className="lists-picker-list">
                  {searchResults.map((m) => {
                    const isAdded = activeList.movies.some((x) => String(x.id) === String(m.id));

                    return (
                      <div key={`picker-${m.id}`} className="lists-picker-item">
                        <div className="lists-picker-item-left">
                          <img src={getMoviePoster(m)} alt={m.title} loading="lazy" />
                          <div className="lists-picker-item-details">
                            <strong>{m.title}</strong>
                            <span>
                              {m.year || "Movie"} • {m.genres?.[0] || "Film"} • ★ {Number(m.rating || 8.0).toFixed(1)}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          className={`lists-picker-toggle-btn ${isAdded ? "added" : ""}`}
                          onClick={() => handleToggleMovieInActiveList(m)}
                        >
                          {isAdded ? (
                            <>
                              <FaCheck style={{ marginRight: "4px" }} />
                              Added
                            </>
                          ) : (
                            <>
                              <FaPlus style={{ marginRight: "4px" }} />
                              Add
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="lists-modal-footer">
                <button
                  type="button"
                  className="lists-btn-submit"
                  onClick={() => {
                    setIsAddMovieOpen(false);
                    setSearchQuery("");
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

