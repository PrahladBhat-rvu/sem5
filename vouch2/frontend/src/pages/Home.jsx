import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaPlay,
  FaPause,
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaFilm,
  FaTv,
  FaGamepad,
  FaArrowRight,
  FaFire,
  FaCheckCircle,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import MovieShelf from "../components/MovieShelf";
import { CURATED_SHELVES } from "../data/shelfData";
import { useAuthModal } from "../context/AuthModalContext";
import { getTitleUrl } from "../utils/slug";
import { getPopularGames } from "../api/igdb";
import "./Home.css";

// =========================================================
// TIMED CARDS OPENING SLIDER DATA (Giulio Cuscito Concept)
// Spanning Movies, TV Shows, and Video Games (IGDB)
// =========================================================

const TIMED_HERO_SLIDES = [
  {
    id: "game-204350",
    numericId: 204350,
    type: "game",
    badge: "FLAGSHIP VIDEO GAME",
    title: "The Last of Us Part I",
    meta: "Naughty Dog · PlayStation 5 & PC · 2022",
    rating: "8.9",
    verifiedSource: "IGDB Verified Consensus",
    synopsis:
      "Endure and survive. Experience the emotional storytelling and unforgettable characters in Joel and Ellie's harrowing journey across a post-pandemic America, rebuilt from the ground up.",
    backdrop: "https://images.igdb.com/igdb/image/upload/t_1080p/co5xex.jpg",
    poster: "https://images.igdb.com/igdb/image/upload/t_cover_big/co5xex.jpg",
    ctaLink: "/game/204350",
    ctaText: "Explore Game & Vouches",
    secondaryLink: "/games?q=last+of+us",
    secondaryText: "Search Franchise",
  },
  {
    id: "movie-27205",
    numericId: 27205,
    type: "movie",
    badge: "CINEMA MASTERPIECE",
    title: "Inception",
    meta: "Christopher Nolan · Sci-Fi / Action · 2010",
    rating: "8.8",
    verifiedSource: "IMDb / Metacritic Consensus",
    synopsis:
      "A skilled thief who steals corporate secrets through dream-sharing technology is offered a chance to erase his criminal past in exchange for an impossible task: inception.",
    backdrop: "/api/image/w1280/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
    fallbackBackdrop: "https://image.tmdb.org/t/p/w1280/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
    poster: "/api/image/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    ctaLink: "/title/inception-27205",
    ctaText: "View Movie Reviews",
    secondaryLink: "/search?q=Christopher+Nolan",
    secondaryText: "More from Nolan",
  },
  {
    id: "tv-2316",
    numericId: 2316,
    type: "tv",
    badge: "ACCLAIMED TV SERIES",
    title: "The Office",
    meta: "Episodic Dir. Marc Webb · Comedy · 9 Seasons",
    rating: "9.0",
    verifiedSource: "Audience Consensus",
    synopsis:
      "A mockumentary on a group of typical office workers in Scranton, Pennsylvania, where the workday consists of ego clashes, inappropriate behavior, tedium, and romance.",
    backdrop: "/api/image/w780/7DJKHzAi83BmQrWLrYYOqcoKfhR.jpg",
    fallbackBackdrop: "https://image.tmdb.org/t/p/w780/7DJKHzAi83BmQrWLrYYOqcoKfhR.jpg",
    poster: "/api/image/w500/7DJKHzAi83BmQrWLrYYOqcoKfhR.jpg",
    ctaLink: "/title/the-office-2316",
    ctaText: "Explore Episodes & Vouches",
    secondaryLink: "/search?q=Marc+Webb",
    secondaryText: "Marc Webb Works",
  },
  {
    id: "game-119133",
    numericId: 119133,
    type: "game",
    badge: "GAME OF THE YEAR",
    title: "Elden Ring",
    meta: "FromSoftware · Multi-platform · 2022",
    rating: "9.4",
    verifiedSource: "IGDB Consensus 94%",
    synopsis:
      "Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the vast, mythical Lands Between.",
    backdrop: "https://images.igdb.com/igdb/image/upload/t_1080p/co4jni.jpg",
    poster: "https://images.igdb.com/igdb/image/upload/t_cover_big/co4jni.jpg",
    ctaLink: "/game/119133",
    ctaText: "Explore Game & Vouches",
    secondaryLink: "/games?q=Elden+Ring",
    secondaryText: "Search Soulslike",
  },
  {
    id: "movie-155",
    numericId: 155,
    type: "movie",
    badge: "ALL-TIME TOP 10",
    title: "The Dark Knight",
    meta: "Christopher Nolan · Action / Crime · 2008",
    rating: "9.0",
    verifiedSource: "Consensus 9.0 ★",
    synopsis:
      "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    backdrop: "/api/image/w1280/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg",
    fallbackBackdrop: "https://image.tmdb.org/t/p/w1280/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg",
    poster: "/api/image/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    ctaLink: "/title/the-dark-knight-155",
    ctaText: "View Consensus & Reviews",
    secondaryLink: "/search?q=Batman",
    secondaryText: "Batman Universe",
  },
];

// Curated Top TV Shows Shelf
const CURATED_TV_SHOWS = [
  {
    id: 2316,
    title: "The Office",
    year: "2005",
    rating: "9.0",
    media_type: "tv",
    backdrop: "https://m.media-amazon.com/images/M/MV5BMjA5NjM3NTk1M15BMl5BanBnXkFtZTgwMzg1MzU2NjE@._V1_QL75_UX380_CR0,4,380,562_.jpg",
    poster: "https://m.media-amazon.com/images/M/MV5BMjA5NjM3NTk1M15BMl5BanBnXkFtZTgwMzg1MzU2NjE@._V1_QL75_UX380_CR0,4,380,562_.jpg",
    genres: ["Comedy"],
    badge: "EPISODIC DIRECTOR",
  },
  {
    id: 87428,
    title: "Why Women Kill",
    year: "2019",
    rating: "8.3",
    media_type: "tv",
    backdrop: "https://m.media-amazon.com/images/M/MV5BYzZjZDc3NTctMzZlNS00NjY4LTllMTMtMmZmNDc1ZjE0NjMyXkEyXkFqcGc@._V1_QL75_UX380_CR0,1,380,562_.jpg",
    poster: "https://m.media-amazon.com/images/M/MV5BYzZjZDc3NTctMzZlNS00NjY4LTllMTMtMmZmNDc1ZjE0NjMyXkEyXkFqcGc@._V1_QL75_UX380_CR0,1,380,562_.jpg",
    genres: ["Comedy", "Drama"],
    badge: "DIRECTOR MARC WEBB",
  },
  {
    id: 57243,
    title: "Doctor Who",
    year: "2007",
    rating: "8.6",
    media_type: "tv",
    backdrop: "https://m.media-amazon.com/images/M/MV5BZjE4OTRkMTktNTdmNS00MTFhLTljZTItOWI3Y2UyZTYyMWRiXkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg",
    poster: "https://m.media-amazon.com/images/M/MV5BZjE4OTRkMTktNTdmNS00MTFhLTljZTItOWI3Y2UyZTYyMWRiXkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg",
    genres: ["Sci-Fi", "Adventure"],
    badge: "GUEST STAR",
  },
  {
    id: 63161,
    title: "Crazy Ex-Girlfriend",
    year: "2015",
    rating: "7.8",
    media_type: "tv",
    backdrop: "https://m.media-amazon.com/images/M/MV5BMjVjM2Y3YzctYzQwMi00OTY2LWEyMjMtODdkZmZiMWQxM2M4XkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg",
    poster: "https://m.media-amazon.com/images/M/MV5BMjVjM2Y3YzctYzQwMi00OTY2LWEyMjMtODdkZmZiMWQxM2M4XkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg",
    genres: ["Comedy", "Musical"],
    badge: "DIRECTOR MARC WEBB",
  },
  {
    id: 226637,
    title: "High Potential",
    year: "2024",
    rating: "7.9",
    media_type: "tv",
    backdrop: "/api/image/w780/yVP12H81dwaay5B7GVqgO893q2c.jpg",
    poster: "/api/image/w500/xCtaUDBUP1iKqtoqpHfeH1T2pWF.jpg",
    genres: ["Crime", "Drama"],
    badge: "DIRECTOR MARC WEBB",
  },
];

// Fallback Video Games (IGDB)
const FALLBACK_HOMEPAGE_GAMES = [
  {
    id: 119133,
    name: "Elden Ring",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co4jni.jpg",
    rating: "9.4",
    year: "2022",
    genres: ["Role-playing (RPG)", "Adventure"],
    platforms: ["PC", "PlayStation", "Xbox"],
  },
  {
    id: 204350,
    name: "The Last of Us Part I",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co5xex.jpg",
    rating: "8.9",
    year: "2022",
    genres: ["Action", "Adventure"],
    platforms: ["PlayStation 5", "PC"],
  },
  {
    id: 119171,
    name: "Baldur's Gate 3",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co670h.jpg",
    rating: "9.6",
    year: "2023",
    genres: ["Role-playing (RPG)", "Strategy"],
    platforms: ["PC", "PlayStation", "Xbox"],
  },
  {
    id: 1877,
    name: "Cyberpunk 2077",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2mvt.jpg",
    rating: "8.4",
    year: "2020",
    genres: ["Role-playing (RPG)", "Shooter"],
    platforms: ["PC", "PlayStation", "Xbox"],
  },
  {
    id: 25076,
    name: "Red Dead Redemption 2",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1q1f.jpg",
    rating: "9.3",
    year: "2018",
    genres: ["Action", "Adventure"],
    platforms: ["PC", "PlayStation", "Xbox"],
  },
  {
    id: 1020,
    name: "Grand Theft Auto V",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2lbd.jpg",
    rating: "9.1",
    year: "2013",
    genres: ["Action", "Adventure"],
    platforms: ["PC", "PlayStation", "Xbox"],
  },
  {
    id: 1942,
    name: "The Witcher 3: Wild Hunt",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.jpg",
    rating: "9.5",
    year: "2015",
    genres: ["Role-playing (RPG)", "Adventure"],
    platforms: ["PC", "PlayStation", "Switch"],
  },
  {
    id: 138225,
    name: "God of War Ragnarök",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co5s5v.jpg",
    rating: "9.2",
    year: "2022",
    genres: ["Action", "Adventure"],
    platforms: ["PlayStation 5", "PC"],
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { openSignup } = useAuthModal();

  // Slider State
  const [activeSlide, setActiveSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Dynamic games from IGDB API
  const [games, setGames] = useState(FALLBACK_HOMEPAGE_GAMES);

  const slideDuration = 5500; // 5.5 seconds per card
  const currentSlide = TIMED_HERO_SLIDES[activeSlide];

  // Auto-play timer with smooth progress bar
  useEffect(() => {
    if (isPaused) return;

    const intervalMs = 50;
    const increment = (intervalMs / slideDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveSlide((cur) => (cur + 1) % TIMED_HERO_SLIDES.length);
          return 0;
        }
        return prev + increment;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPaused, activeSlide]);

  // Fetch live games on mount
  useEffect(() => {
    let isMounted = true;
    async function loadGames() {
      try {
        const live = await getPopularGames();
        if (isMounted && Array.isArray(live) && live.length > 0) {
          setGames(live.slice(0, 8));
        }
      } catch (e) {
        // Fallback already in place
      }
    }
    loadGames();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectSlide = (index) => {
    setActiveSlide(index);
    setProgress(0);
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % TIMED_HERO_SLIDES.length);
    setProgress(0);
  };

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + TIMED_HERO_SLIDES.length) % TIMED_HERO_SLIDES.length);
    setProgress(0);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="home-page">
      <Navbar />

      <main>
        {/* =========================================================
            HERO: TIMED CARDS OPENING SLIDER (GIULIO CUSCITO CONCEPT)
            ========================================================= */}
        <section
          className="timed-slider-section"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          aria-label="Featured Masterpieces Carousel"
        >
          <div className="timed-slider-container">
            {/* ACTIVE EXPANDED STAGE (LEFT) */}
            <div className="active-card-stage">
              <img
                src={currentSlide.backdrop}
                alt={currentSlide.title}
                className="active-card-backdrop"
                onError={(e) => {
                  if (currentSlide.fallbackBackdrop && e.currentTarget.src !== currentSlide.fallbackBackdrop) {
                    e.currentTarget.src = currentSlide.fallbackBackdrop;
                  } else if (currentSlide.poster) {
                    e.currentTarget.src = currentSlide.poster;
                  }
                }}
              />
              <div className="active-card-overlay" />

              <div className="active-card-content">
                {/* BADGES ROW */}
                <div className="slide-badges-row">
                  <span className={`slide-type-pill ${currentSlide.type}`}>
                    {currentSlide.type === "game" && <FaGamepad style={{ fontSize: "12px" }} />}
                    {currentSlide.type === "movie" && <FaFilm style={{ fontSize: "11px" }} />}
                    {currentSlide.type === "tv" && <FaTv style={{ fontSize: "11px" }} />}
                    {currentSlide.badge}
                  </span>

                  <span className="slide-rating-pill">
                    <FaStar style={{ fontSize: "11px" }} />
                    {currentSlide.rating}
                    <span className="verified">· {currentSlide.verifiedSource}</span>
                  </span>
                </div>

                {/* TITLE & METADATA */}
                <h1 className="slide-title">{currentSlide.title}</h1>
                <div className="slide-meta">{currentSlide.meta}</div>

                {/* SYNOPSIS */}
                <p className="slide-synopsis">{currentSlide.synopsis}</p>

                {/* ACTIONS */}
                <div className="slide-actions">
                  <Link to={currentSlide.ctaLink} className="slide-primary-btn">
                    <span>{currentSlide.ctaText}</span>
                    <FaArrowRight style={{ fontSize: "11px" }} />
                  </Link>

                  <Link to={currentSlide.secondaryLink} className="slide-secondary-btn">
                    <span>{currentSlide.secondaryText}</span>
                  </Link>
                </div>

                {/* BOTTOM TIMED PROGRESS BAR */}
                <div className="slider-bottom-bar">
                  <div className="slider-step-indicator">
                    0{activeSlide + 1} <span className="total">/ 0{TIMED_HERO_SLIDES.length}</span>
                  </div>

                  <div className="slider-progress-track">
                    <div
                      className="slider-progress-fill"
                      style={{
                        width: `${progress}%`,
                        background:
                          currentSlide.type === "game"
                            ? "linear-gradient(90deg, #8b5cf6, #c084fc)"
                            : currentSlide.type === "tv"
                            ? "linear-gradient(90deg, #10b981, #34d399)"
                            : "linear-gradient(90deg, #3b82f6, #60a5fa)",
                      }}
                    />
                  </div>

                  <div className="slider-nav-controls">
                    <button
                      type="button"
                      className="slider-ctrl-btn"
                      onClick={handlePrevSlide}
                      aria-label="Previous card"
                    >
                      <FaChevronLeft />
                    </button>

                    <button
                      type="button"
                      className="slider-ctrl-btn"
                      onClick={() => setIsPaused(!isPaused)}
                      aria-label={isPaused ? "Play slider" : "Pause slider"}
                    >
                      {isPaused ? <FaPlay style={{ fontSize: "9px" }} /> : <FaPause style={{ fontSize: "9px" }} />}
                    </button>

                    <button
                      type="button"
                      className="slider-ctrl-btn"
                      onClick={handleNextSlide}
                      aria-label="Next card"
                    >
                      <FaChevronRight />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* UPCOMING PEEK CARDS DECK (RIGHT / OPENING CARDS) */}
            <aside className="peek-cards-deck" aria-label="Upcoming Cards">
              {TIMED_HERO_SLIDES.map((slide, idx) => {
                if (idx === activeSlide) return null; // Don't duplicate active card
                return (
                  <div
                    key={slide.id}
                    className="peek-card"
                    onClick={() => handleSelectSlide(idx)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Open ${slide.title}`}
                  >
                    <img
                      src={slide.poster || slide.backdrop}
                      alt={slide.title}
                      className="peek-card-bg"
                    />
                    <div className="peek-card-overlay" />

                    <div className="peek-card-info">
                      <div className="peek-card-top-row">
                        <span className="peek-card-step">0{idx + 1}</span>
                        <span className="peek-card-tag">{slide.type}</span>
                      </div>
                      <h4 className="peek-card-title">{slide.title}</h4>
                      <div className="peek-card-meta">
                        <span className="peek-card-rating">
                          <FaStar style={{ fontSize: "10px" }} /> {slide.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </aside>
          </div>
        </section>

        {/* =========================================================
            UNIVERSAL SEARCH & MULTI-CATEGORY QUICK JUMP STRIP
            ========================================================= */}
        <section className="home-search-strip">
          <div className="home-search-wrap">
            <SearchBar
              showPopular={true}
              placeholder="Search across movies, tv shows, and video games..."
            />
          </div>

          {/* QUICK ANCHOR JUMPS (MOVIES, TV SHOWS, GAMES) */}
          <div className="home-category-quicklinks">
            <button
              type="button"
              className="cat-jump-btn movies"
              onClick={() => scrollToSection("movies-section")}
            >
              <FaFilm /> <span>Blockbuster Movies</span>
            </button>

            <button
              type="button"
              className="cat-jump-btn tv"
              onClick={() => scrollToSection("tv-shows-section")}
            >
              <FaTv /> <span>Binge-Worthy TV Shows</span>
            </button>

            <button
              type="button"
              className="cat-jump-btn games"
              onClick={() => scrollToSection("games-section")}
            >
              <FaGamepad /> <span>Video Games (IGDB)</span>
            </button>

            <button
              type="button"
              className="cat-jump-btn"
              onClick={() => scrollToSection("creators-section")}
            >
              <FaFire /> <span>Creator Shelves</span>
            </button>
          </div>
        </section>

        {/* =========================================================
            SECTION 1: BLOCKBUSTER MOVIES & CINEMA MASTERPIECES
            ========================================================= */}
        <section id="movies-section" className="home-section-block">
          <div className="section-hero-header">
            <div className="section-header-left">
              <span className="section-badge movie">
                <FaFilm /> CINEMA & FILMS
              </span>
              <h2 className="section-title">Trending Movies & Consensus Masterpieces</h2>
              <p className="section-subtitle">
                Explore the highest-rated theatrical and streaming films with aggregated scores from IMDb, Rotten Tomatoes, and Metacritic.
              </p>
            </div>
            <Link to="/search?type=movies" className="section-view-all-link">
              <span>Explore All Movies</span>
              <FaArrowRight style={{ fontSize: "11px" }} />
            </Link>
          </div>

          <MovieShelf
            shelfId="shelf-home-movies"
            title="Consensus Masterpieces"
            exploreLink="/search?type=movies"
            exploreText="Explore All ›"
            movies={CURATED_SHELVES["Trending Masterpieces"]}
          />
        </section>

        {/* =========================================================
            SECTION 2: BINGE-WORTHY TV SHOWS
            ========================================================= */}
        <section id="tv-shows-section" className="home-section-block">
          <div className="section-hero-header">
            <div className="section-header-left">
              <span className="section-badge tv">
                <FaTv /> TELEVISION & SERIES
              </span>
              <h2 className="section-title">Critically Acclaimed TV Shows</h2>
              <p className="section-subtitle">
                From landmark comedy to gripping drama, discover the most binge-worthy series voted on by real audiences.
              </p>
            </div>
            <Link to="/search?type=movies" className="section-view-all-link">
              <span>Browse All Shows</span>
              <FaArrowRight style={{ fontSize: "11px" }} />
            </Link>
          </div>

          <MovieShelf
            shelfId="shelf-home-tv"
            title="Top Episodic Releases"
            exploreLink="/search?type=movies"
            exploreText="Explore All ›"
            movies={CURATED_TV_SHOWS}
          />
        </section>

        {/* =========================================================
            SECTION 3: VIDEO GAMES (POWERED BY IGDB)
            ========================================================= */}
        <section id="games-section" className="home-section-block">
          <div className="section-hero-header">
            <div className="section-header-left">
              <span className="section-badge game">
                <FaGamepad /> IGDB GAMING DATABASE
              </span>
              <h2 className="section-title">Top-Rated Video Games</h2>
              <p className="section-subtitle">
                Real gamer vouches, verified developer credits, and authentic scores powered directly by the IGDB API.
              </p>
            </div>
            <Link to="/games" className="section-view-all-link">
              <span>Open Games Discovery Hub</span>
              <FaArrowRight style={{ fontSize: "11px" }} />
            </Link>
          </div>

          <div className="home-games-grid">
            {games.map((game) => (
              <Link to={`/game/${game.id}`} key={game.id} className="home-game-card">
                <div className="game-card-media">
                  <img
                    src={game.cover || game.image}
                    alt={game.name}
                    className="game-card-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
                        <svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400">
                          <rect width="100%" height="100%" fill="#1a1d27"/>
                          <text x="50%" y="50%" fill="#71717a" font-family="sans-serif" font-size="16" text-anchor="middle">Cover</text>
                        </svg>
                      `)}`;
                    }}
                  />
                  {game.rating && (
                    <div className="game-card-rating-badge">
                      <FaStar style={{ fontSize: "10px" }} />
                      <span>{game.rating}</span>
                    </div>
                  )}
                </div>

                <div className="game-card-body">
                  <h4 className="game-card-title">{game.name}</h4>
                  <div className="game-card-meta">
                    <span>{game.year || "Game"}</span>
                    {game.genres && game.genres.length > 0 && <span>· {game.genres[0]}</span>}
                  </div>

                  {game.platforms && game.platforms.length > 0 && (
                    <div className="game-card-platforms">
                      {game.platforms.slice(0, 3).map((p) => (
                        <span key={p} className="platform-pill">
                          {p.replace("PlayStation", "PS")}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* =========================================================
            SECTION 4: CREATOR SPOTLIGHT & AUTEUR SHELVES
            ========================================================= */}
        <div id="creators-section" className="home-creator-shelves">
          <div className="section-hero-header">
            <div className="section-header-left">
              <span className="section-badge creator">
                <FaFire /> CREATOR SPOTLIGHTS
              </span>
              <h2 className="section-title">Auteurs, Directors & Lead Casts</h2>
              <p className="section-subtitle">
                Explore curated filmographies and director visions from Marc Webb, Andrew Garfield, Christopher Nolan, and more.
              </p>
            </div>
          </div>

          <MovieShelf
            shelfId="shelf-marc-webb"
            title="More from Marc Webb"
            exploreLink="/search?q=Marc+Webb"
            exploreText="Explore All ›"
            movies={CURATED_SHELVES["Marc Webb"]}
          />

          <MovieShelf
            shelfId="shelf-andrew-garfield"
            title="Starring Andrew Garfield"
            exploreLink="/search?q=Andrew+Garfield"
            exploreText="Explore All ›"
            movies={CURATED_SHELVES["Andrew Garfield"]}
          />

          <MovieShelf
            shelfId="shelf-christopher-nolan"
            title="Auteur Spotlight: Christopher Nolan"
            exploreLink="/search?q=Christopher+Nolan"
            exploreText="Explore All ›"
            movies={CURATED_SHELVES["Christopher Nolan"]}
          />
        </div>

        {/* =========================================================
            SECTION 5: VERIFIED SOURCES & REVIEWS
            ========================================================= */}
        <section className="home-sources-banner">
          <div className="sources-label">Reviews Aggregated Across Industry Standards</div>
          <div className="sources-logos-row">
            <span className="source-item rt">
              <FaCheckCircle style={{ fontSize: "13px" }} /> Rotten Tomatoes
            </span>
            <span className="source-item imdb">
              <FaCheckCircle style={{ fontSize: "13px" }} /> IMDb Pro
            </span>
            <span className="source-item meta">
              <FaCheckCircle style={{ fontSize: "13px" }} /> Metacritic
            </span>
            <span className="source-item igdb">
              <FaCheckCircle style={{ fontSize: "13px" }} /> IGDB (Twitch)
            </span>
          </div>
        </section>

        {/* =========================================================
            SECTION 6: HOW VOUCH WORKS
            ========================================================= */}
        <section className="how-section">
          <div className="how-heading">
            <h2>One place for every opinion.</h2>
          </div>

          <div className="steps">
            <div className="step">
              <span>01</span>
              <h3>Search</h3>
              <p>Find the movie, TV series, or video game you're considering.</p>
            </div>

            <div className="step">
              <span>02</span>
              <h3>Compare</h3>
              <p>See verified ratings, critic consensus, and gamer reviews side-by-side.</p>
            </div>

            <div className="step">
              <span>03</span>
              <h3>Vouch</h3>
              <p>Join thousands of authentic tastemakers and vouch for what's worth your time.</p>
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 7: CALL TO ACTION
            ========================================================= */}
        <section className="cta">
          <h2>
            Found something worth
            <br />
            talking about?
          </h2>

          <button
            type="button"
            className="home-cta-button"
            onClick={openSignup}
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}
          >
            <span>Join Vouch</span>
            <FaArrowRight style={{ marginLeft: "8px", fontSize: "13px" }} />
          </button>
        </section>
      </main>
    </div>
  );
}
