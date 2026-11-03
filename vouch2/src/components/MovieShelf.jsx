import React, { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getTitleUrl } from "../utils/slug";

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
            const rawImg = m.backdrop || m.backdrop_path || m.image || m.poster;
            const imgSrc = rawImg?.startsWith("http") || rawImg?.startsWith("/api/")
              ? rawImg
              : rawImg
              ? `/api/image/w780${rawImg}`
              : "/api/image/w780/xJHokMbljvjADYDit5fK5VQsXEG.jpg";

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
                      // Fallback if specific backdrop fails
                      e.currentTarget.onerror = null;
                      if (m.poster && e.currentTarget.src !== m.poster) {
                        e.currentTarget.src = m.poster;
                      } else {
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=780&q=80";
                      }
                    }}
                  />
                  {/* Subtle lower vignette overlay */}
                  <div className="shelf-card-gradient" />

                  {/* Optional corner badge */}
                  {m.badge && <span className="shelf-card-chip">{m.badge}</span>}

                  {/* Card bottom text */}
                  <div className="shelf-card-info">
                    <h3 className="shelf-card-title">{m.title}</h3>
                    <div className="shelf-card-meta">
                      {m.year && <span className="shelf-meta-year">{m.year}</span>}
                      {m.rating && (
                        <span className="shelf-meta-rating" style={{ display: "inline-flex", alignItems: "center" }}>
                          <FaStar className="star-icon" style={{ fontSize: "10px", color: "#f59e0b", marginRight: "3px" }} /> {m.rating}
                        </span>
                      )}
                      {m.genres?.[0] && (
                        <span className="shelf-meta-genre">{m.genres[0]}</span>
                      )}
                    </div>
                  </div>
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

