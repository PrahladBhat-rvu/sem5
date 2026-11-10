import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaGamepad, FaStar, FaFire, FaCalendarAlt, FaTrophy, FaSearch, FaFilter } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { getPopularGames, getTrendingGames, getUpcomingGames, searchGames } from "../api/igdb";
import "./Games.css";

const PLATFORMS = ["All", "PC", "PlayStation", "Xbox", "Nintendo Switch"];
const GENRES = ["All", "Action", "Role-playing (RPG)", "Adventure", "Shooter", "Indie", "Strategy"];

// Resilient fallback games curated with real IGDB image IDs and metadata
const FALLBACK_POPULAR = [
  {
    id: 119133,
    name: "Elden Ring",
    title: "Elden Ring",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co4jni.jpg",
    cover_small: "https://images.igdb.com/igdb/image/upload/t_cover_small/co4jni.jpg",
    rating: "9.4",
    year: "2022",
    genres: ["Role-playing (RPG)", "Adventure"],
    platforms: ["PC", "PlayStation", "Xbox"],
    summary: "Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between.",
  },
  {
    id: 204350,
    name: "The Last of Us Part I",
    title: "The Last of Us Part I",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co5xex.jpg",
    cover_small: "https://images.igdb.com/igdb/image/upload/t_cover_small/co5xex.jpg",
    rating: "8.9",
    year: "2022",
    genres: ["Action", "Adventure"],
    platforms: ["PlayStation", "PC"],
    summary: "Endure and survive. Experience the emotional storytelling and unforgettable characters in The Last of Us, rebuilt from the ground up.",
  },
  {
    id: 119171,
    name: "Baldur's Gate 3",
    title: "Baldur's Gate 3",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co670h.jpg",
    cover_small: "https://images.igdb.com/igdb/image/upload/t_cover_small/co670h.jpg",
    rating: "9.6",
    year: "2023",
    genres: ["Role-playing (RPG)", "Strategy"],
    platforms: ["PC", "PlayStation", "Xbox"],
    summary: "Gather your party and return to the Forgotten Realms in a tale of fellowship, betrayal, sacrifice and survival.",
  },
  {
    id: 1877,
    name: "Cyberpunk 2077",
    title: "Cyberpunk 2077",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2mvt.jpg",
    cover_small: "https://images.igdb.com/igdb/image/upload/t_cover_small/co2mvt.jpg",
    rating: "8.4",
    year: "2020",
    genres: ["Role-playing (RPG)", "Shooter"],
    platforms: ["PC", "PlayStation", "Xbox"],
    summary: "An open-world, action-adventure story set in Night City, a megalopolis obsessed with power, glamour and body modification.",
  },
  {
    id: 25076,
    name: "Red Dead Redemption 2",
    title: "Red Dead Redemption 2",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1q1f.jpg",
    cover_small: "https://images.igdb.com/igdb/image/upload/t_cover_small/co1q1f.jpg",
    rating: "9.3",
    year: "2018",
    genres: ["Action", "Adventure"],
    platforms: ["PC", "PlayStation", "Xbox"],
    summary: "America, 1899. Arthur Morgan and the Van der Linde gang are outlaws on the run in an unforgiving heartland.",
  },
  {
    id: 1020,
    name: "Grand Theft Auto V",
    title: "Grand Theft Auto V",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2lbd.jpg",
    cover_small: "https://images.igdb.com/igdb/image/upload/t_cover_small/co2lbd.jpg",
    rating: "9.1",
    year: "2013",
    genres: ["Action", "Adventure"],
    platforms: ["PC", "PlayStation", "Xbox"],
    summary: "When a young street hustler, a retired bank robber and a terrifying psychopath find themselves entangled with the criminal underworld.",
  },
  {
    id: 1942,
    name: "The Witcher 3: Wild Hunt",
    title: "The Witcher 3: Wild Hunt",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.jpg",
    cover_small: "https://images.igdb.com/igdb/image/upload/t_cover_small/co1wyy.jpg",
    rating: "9.5",
    year: "2015",
    genres: ["Role-playing (RPG)", "Adventure"],
    platforms: ["PC", "PlayStation", "Xbox", "Nintendo Switch"],
    summary: "Become Geralt of Rivia, a monster slayer for hire, searching for the child of prophecy in a war-torn world.",
  },
  {
    id: 138225,
    name: "God of War Ragnarök",
    title: "God of War Ragnarök",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co5s5v.jpg",
    cover_small: "https://images.igdb.com/igdb/image/upload/t_cover_small/co5s5v.jpg",
    rating: "9.2",
    year: "2022",
    genres: ["Action", "Adventure"],
    platforms: ["PlayStation", "PC"],
    summary: "Embark on an epic and heartfelt journey as Kratos and Atreus struggle with holding on and letting go.",
  },
];

const FALLBACK_UPCOMING = [
  {
    id: 26845,
    name: "Grand Theft Auto VI",
    title: "Grand Theft Auto VI",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co7t9m.jpg",
    cover_small: "https://images.igdb.com/igdb/image/upload/t_cover_small/co7t9m.jpg",
    rating: null,
    year: "2025",
    genres: ["Action", "Adventure"],
    platforms: ["PlayStation", "Xbox"],
    summary: "Grand Theft Auto VI heads to the state of Leonida, home to the neon-soaked streets of Vice City and beyond.",
  },
  {
    id: 115278,
    name: "Hollow Knight: Silksong",
    title: "Hollow Knight: Silksong",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1r76.jpg",
    cover_small: "https://images.igdb.com/igdb/image/upload/t_cover_small/co1r76.jpg",
    rating: null,
    year: "2025",
    genres: ["Adventure", "Indie"],
    platforms: ["PC", "Nintendo Switch", "PlayStation", "Xbox"],
    summary: "Play as Hornet, princess-protector of Hallownest, and adventure through a whole new kingdom ruled by silk and song.",
  },
];

export default function Games() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParam = useMemo(() => new URLSearchParams(location.search).get("q") || "", [location.search]);

  const [activeTab, setActiveTab] = useState("popular"); // 'popular' | 'trending' | 'upcoming'
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [selectedGenre, setSelectedGenre] = useState("All");

  const [popularGames, setPopularGames] = useState(FALLBACK_POPULAR);
  const [trendingGames, setTrendingGames] = useState(FALLBACK_POPULAR);
  const [upcomingGames, setUpcomingGames] = useState(FALLBACK_UPCOMING);
  const [searchResults, setSearchResults] = useState([]);

  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync searchQuery when URL query param changes
  useEffect(() => {
    if (queryParam) {
      setSearchQuery(queryParam);
    }
  }, [queryParam]);

  // Fetch initial shelves from IGDB via backend
  useEffect(() => {
    let isMounted = true;
    async function loadShelves() {
      setLoading(true);
      setError(null);
      try {
        const [pop, trend, upc] = await Promise.allSettled([
          getPopularGames(),
          getTrendingGames(),
          getUpcomingGames(),
        ]);

        if (isMounted) {
          const popList = pop.status === "fulfilled" && Array.isArray(pop.value) && pop.value.length ? pop.value : FALLBACK_POPULAR;
          const trendList = trend.status === "fulfilled" && Array.isArray(trend.value) && trend.value.length ? trend.value : popList;
          const upcList = upc.status === "fulfilled" && Array.isArray(upc.value) && upc.value.length ? upc.value : FALLBACK_UPCOMING;

          setPopularGames(popList);
          setTrendingGames(trendList);
          setUpcomingGames(upcList);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setPopularGames(FALLBACK_POPULAR);
          setTrendingGames(FALLBACK_POPULAR);
          setUpcomingGames(FALLBACK_UPCOMING);
          setLoading(false);
        }
      }
    }

    loadShelves();
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle live search with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await searchGames(searchQuery);
        if (Array.isArray(res) && res.length > 0) {
          setSearchResults(res);
        } else {
          // If API returned empty, match against cached library
          const q = searchQuery.toLowerCase().trim();
          const localMatches = FALLBACK_POPULAR.filter(
            (g) => g.name.toLowerCase().includes(q) || (g.summary && g.summary.toLowerCase().includes(q))
          );
          setSearchResults(localMatches.length > 0 ? localMatches : (res || []));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setSearchLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Current list based on active tab or search
  const displayedGames = useMemo(() => {
    let list = [];
    if (searchQuery.trim()) {
      list = searchResults;
    } else if (activeTab === "popular") {
      list = popularGames;
    } else if (activeTab === "trending") {
      list = trendingGames;
    } else if (activeTab === "upcoming") {
      list = upcomingGames;
    }

    // Filter by platform
    if (selectedPlatform !== "All") {
      list = list.filter((g) =>
        g.platforms?.some((p) => p.toLowerCase().includes(selectedPlatform.toLowerCase()))
      );
    }

    // Filter by genre
    if (selectedGenre !== "All") {
      list = list.filter((g) =>
        g.genres?.some((gen) => gen.toLowerCase().includes(selectedGenre.toLowerCase()))
      );
    }

    return list;
  }, [searchQuery, searchResults, activeTab, popularGames, trendingGames, upcomingGames, selectedPlatform, selectedGenre]);

  return (
    <div className="games-page">
      <Navbar />

      <main className="games-main">
        {/* HERO SECTION */}
        <section className="games-hero">
          <div className="games-hero-content">
            <span className="games-badge">
              <FaGamepad className="badge-icon" /> IGDB GAMING DATABASE
            </span>
            <h1 className="games-hero-title">Video Games on Vouch</h1>
            <p className="games-hero-subtitle">
              Discover ratings, official platforms, developer credits, and authentic gamer verifications powered by the IGDB API.
            </p>

            {/* SEARCH INPUT */}
            <div className="games-search-box">
              <FaSearch className="games-search-icon" />
              <input
                type="text"
                placeholder="Search games (e.g. Elden Ring, Cyberpunk 2077, Zelda)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="games-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="games-clear-btn"
                  onClick={() => setSearchQuery("")}
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </section>

        {/* CONTROLS STRIP (Tabs & Filters) */}
        {!searchQuery.trim() && (
          <div className="games-tabs-container">
            <div className="games-tabs">
              <button
                className={`games-tab ${activeTab === "popular" ? "active" : ""}`}
                onClick={() => setActiveTab("popular")}
              >
                <FaTrophy /> Popular
              </button>
              <button
                className={`games-tab ${activeTab === "trending" ? "active" : ""}`}
                onClick={() => setActiveTab("trending")}
              >
                <FaFire /> Trending
              </button>
              <button
                className={`games-tab ${activeTab === "upcoming" ? "active" : ""}`}
                onClick={() => setActiveTab("upcoming")}
              >
                <FaCalendarAlt /> Upcoming
              </button>
            </div>
          </div>
        )}

        {/* PLATFORM & GENRE CHIP FILTERS */}
        <div className="games-filter-strip">
          <div className="filter-group">
            <span className="filter-label"><FaFilter style={{ marginRight: 6 }} /> Platform:</span>
            <div className="filter-chips">
              {PLATFORMS.map((p) => (
                <button
                  key={p}
                  className={`chip ${selectedPlatform === p ? "active" : ""}`}
                  onClick={() => setSelectedPlatform(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <span className="filter-label">Genre:</span>
            <div className="filter-chips">
              {GENRES.map((g) => (
                <button
                  key={g}
                  className={`chip ${selectedGenre === g ? "active" : ""}`}
                  onClick={() => setSelectedGenre(g)}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* GAMES GRID */}
        <section className="games-grid-section">
          {loading || searchLoading ? (
            <div className="games-grid skeleton-grid">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="game-card skeleton-card">
                  <div className="skeleton-media" />
                  <div className="skeleton-info">
                    <div className="skeleton-line" style={{ width: "80%" }} />
                    <div className="skeleton-line" style={{ width: "40%" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="games-empty-state">
              <p className="empty-title">{error}</p>
              <button
                className="retry-btn"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          ) : displayedGames.length === 0 ? (
            <div className="games-empty-state">
              <FaGamepad className="empty-icon" />
              <h3 className="empty-title">No games found</h3>
              <p className="empty-desc">
                {searchQuery
                  ? `No games matching "${searchQuery}". Check the spelling or try another title.`
                  : "No games found matching your selected platform and genre filters."}
              </p>
            </div>
          ) : (
            <div className="games-grid">
              {displayedGames.map((game) => {
                const coverUrl =
                  game.cover ||
                  game.image ||
                  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400">
                      <rect width="100%" height="100%" fill="#1a1d27"/>
                      <text x="50%" y="50%" fill="#71717a" font-family="sans-serif" font-size="16" text-anchor="middle">No Cover</text>
                    </svg>
                  `)}`;

                return (
                  <Link
                    to={`/game/${game.id}`}
                    key={game.id}
                    className="game-card"
                  >
                    <div className="game-card-media">
                      <img
                        src={coverUrl}
                        alt={game.name}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
                            <svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400">
                              <rect width="100%" height="100%" fill="#1a1d27"/>
                              <text x="50%" y="50%" fill="#a1a1aa" font-family="sans-serif" font-size="14" text-anchor="middle">${(game.name || "Game").replace(/[<>&'"]/g, "")}</text>
                            </svg>
                          `)}`;
                        }}
                      />
                      {game.rating && (
                        <div className="game-card-rating">
                          <FaStar className="star-icon" /> {game.rating}
                        </div>
                      )}
                      {game.year && (
                        <span className="game-card-year">{game.year}</span>
                      )}
                    </div>

                    <div className="game-card-info">
                      <h3 className="game-card-title" title={game.name}>
                        {game.name}
                      </h3>
                      {game.platforms && game.platforms.length > 0 && (
                        <p className="game-card-platforms">
                          {game.platforms.slice(0, 3).join(" • ")}
                          {game.platforms.length > 3 ? " +" : ""}
                        </p>
                      )}
                      {game.genres && game.genres.length > 0 && (
                        <div className="game-card-genres">
                          {game.genres.slice(0, 2).map((g) => (
                            <span key={g} className="genre-tag">
                              {g}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

