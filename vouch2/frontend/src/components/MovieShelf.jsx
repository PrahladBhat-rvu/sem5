import React, { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getTitleUrl } from "../utils/slug";

function formatShelfImageUrl(raw, title, year) {
  if (!raw) {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="780" height="439" viewBox="0 0 780 439">
        <rect width="100%" height="100%" fill="#111319"/>
        <text x="50%" y="45%" fill="#71717a" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="700" text-anchor="middle">${title || "Movie"}</text>
        <text x="50%" y="58%" fill="#52525b" font-family="system-ui, -apple-system, sans-serif" font-size="16" text-anchor="middle">${year || ""}</text>
      </svg>
    `)}`;
  }

  if (raw.startsWith("/api/image/")) {
    return raw;
  }

  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    // TMDB images: route through proxy to avoid local ISP blockage
    if (raw.includes("image.tmdb.org/t/p/")) {
      const match = raw.match(/image\.tmdb\.org\/t\/p\/([^/]+)\/(.+)$/);
      if (match) {
        return `/api/image/${match[1]}/${match[2]}`;
      }
    }
    // Amazon, Wikimedia, IGDB, and other CDNs load directly with full browser CDN caching
    return raw;
  }

  // Relative TMDB path
  const clean = raw.startsWith("/") ? raw.slice(1) : raw;
  return `/api/image/w780/${clean}`;
}

/**
 * MovieShelf: Apple TV / Netflix style horizontal landscape carousel.
 * Matches reference image: 16:9 cards, "Explore All >" inline link,
 * dash pagination indicators (— - - -), and chevron navigation controls.
 */
export default function MovieShelf({
  title,
  exploreLink = "/search",
  exploreText = "Explore All ›",
  movies = [],
  shelfId = "shelf",
}) {
  const trackRef = useRef(null);
  const [activeDash, setActiveDash] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const dashCount = 4;

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    const current = el.scrollLeft;

    setCanScrollLeft(current > 8);
    setCanScrollRight(current < maxScroll - 8);

    if (maxScroll > 0) {
      const progress = current / maxScroll;
      const dashIndex = Math.min(
        dashCount - 1,
        Math.max(0, Math.round(progress * (dashCount - 1)))
      );
      setActiveDash(dashIndex);
    }
  }, [dashCount]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState, movies]);

  const scrollByPages = (direction) => {
    const el = trackRef.current;
    if (!el) return;

    // Scroll by roughly 80% of visible container width for natural browsing
    const distance = el.clientWidth * 0.82 * direction;
    el.scrollBy({ left: distance, behavior: "smooth" });
  };

  const jumpToDash = (index) => {
    const el = trackRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    const target = (maxScroll / (dashCount - 1)) * index;
    el.scrollTo({ left: target, behavior: "smooth" });
  };

  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <section className="movie-shelf-section" aria-label={title}>
      {/* SHELF HEADER */}
      <div className="movie-shelf-header">
        <div className="movie-shelf-title-wrap">
          <h2 className="movie-shelf-title">{title}</h2>
          {exploreLink && (
            <Link to={exploreLink} className="movie-shelf-explore-link">
              {exploreText}
            </Link>
          )}
        </div>

        {/* CONTROLS: DASH INDICATORS + CHEVRONS */}
        <div className="movie-shelf-controls">
          {/* DASH PROGRESS INDICATORS (— - - -) */}
          <div className="movie-shelf-dashes" role="tablist" aria-label="Carousel pages">
            {Array.from({ length: dashCount }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`shelf-dash ${activeDash === idx ? "active" : ""}`}
                onClick={() => jumpToDash(idx)}
                aria-label={`Jump to page ${idx + 1}`}
                role="tab"
                aria-selected={activeDash === idx}
              />
            ))}
          </div>

          {/* CHEVRON ARROWS */}
          <div className="movie-shelf-arrows">
            <button
              type="button"
              className="shelf-nav-btn prev"
              onClick={() => scrollByPages(-1)}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
              title="Previous titles"
            >
              <FaChevronLeft style={{ fontSize: "11px" }} />
            </button>
            <button
              type="button"
              className="shelf-nav-btn next"
              onClick={() => scrollByPages(1)}
              disabled={!canScrollRight}
              aria-label="Scroll right"
              title="More titles"
            >
              <FaChevronRight style={{ fontSize: "11px" }} />
            </button>
          </div>
        </div>
      </div>

      {/* HORIZONTAL CAROUSEL TRACK */}
      <div className="movie-shelf-track-wrapper">
        <div className="movie-shelf-track" ref={trackRef}>
          {movies.map((m, index) => {
            const rawImg = m.poster || m.image || m.backdrop || m.backdrop_path;
            const imgSrc = formatShelfImageUrl(rawImg, m.title, m.year);

            return (
              <Link
                to={getTitleUrl(m)}
                key={`${shelfId}-${m.id}-${index}`}
                className="movie-shelf-card"
                title={`${m.title} (${m.year || "Movie"})`}
              >
                <div className="shelf-card-media">
                  <img
                    src={imgSrc}
                    alt={m.title}
                    loading={index < 5 ? "eager" : "lazy"}
                    onError={(e) => {
                      const cur = e.currentTarget.src;

                      // Step 1: If /api/image/omdb proxy failed, try the direct Amazon URL
                      if (cur.includes("/api/image/omdb")) {
                        try {
                          const urlParam = new URL(cur, window.location.origin).searchParams.get("url");
                          if (urlParam && !cur.includes(urlParam)) {
                            e.currentTarget.src = urlParam;
                            return;
                          }
                        } catch {}
                      }

                      // Step 2: If /api/image/ proxy is unreachable, fall back to direct TMDB CDN
                      if (cur.includes("/api/image/")) {
                        const match = cur.match(/\/api\/image\/(w\d+|original)\/(.+)$/);
                        if (match) {
                          e.currentTarget.src = `https://image.tmdb.org/t/p/${match[1]}/${match[2]}`;
                          return;
                        }
                      }

                      // Step 2: Fall back to poster if distinct from backdrop
                      const posterFallback = m.poster ? formatShelfImageUrl(m.poster, m.title, m.year) : null;
                      if (posterFallback && !cur.includes(posterFallback) && !cur.includes("svg+xml")) {
                        e.currentTarget.src = posterFallback;
                        return;
                      }

                      // Step 3: Title-branded slate card with sleek dark gradient
                      e.currentTarget.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
                        <svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400">
                          <rect width="100%" height="100%" fill="#1a1d27"/>
                          <text x="50%" y="46%" fill="#f4f4f5" font-family="system-ui, sans-serif" font-size="20" font-weight="700" text-anchor="middle">${(m.title || "Movie").replace(/[<>&'"]/g, "")}</text>
                          <text x="50%" y="58%" fill="#a1a1aa" font-family="system-ui, sans-serif" font-size="14" text-anchor="middle">${m.year || ""}</text>
                        </svg>
                      `)}`;
                    }}
                  />

                  {/* FLOATING RATING BADGE (TOP-LEFT) */}
                  {m.rating && (
                    <div className="shelf-card-rating">
                      <FaStar style={{ fontSize: "10px" }} />
                      <span>{m.rating}</span>
                    </div>
                  )}

                  {/* FLOATING YEAR / BADGE (TOP-RIGHT) */}
                  <div className="shelf-card-year">
                    {m.badge ? m.badge : m.year || "Movie"}
                  </div>
                </div>

                {/* CARD BODY DETAILS (BOTTOM) */}
                <div className="shelf-card-info">
                  <h3 className="shelf-card-title">{m.title}</h3>
                  <div className="shelf-card-meta">
                    <span>{m.year || "Cinema"}</span>
                    {m.director && <span>· {m.director}</span>}
                  </div>

                  {m.genres && m.genres.length > 0 && (
                    <div className="shelf-card-genres">
                      {m.genres.slice(0, 2).map((g) => (
                        <span key={g} className="shelf-genre-pill">
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

        {/* RIGHT EDGE FLOATING ADVANCE CHEVRON (Matching reference image overlay on edge) */}
        {canScrollRight && (
          <button
            type="button"
            className="shelf-edge-peek-btn"
            onClick={() => scrollByPages(1)}
            aria-label="Next titles"
          >
            <FaChevronRight style={{ fontSize: "12px" }} />
          </button>
        )}
      </div>
    </section>
  );
}

