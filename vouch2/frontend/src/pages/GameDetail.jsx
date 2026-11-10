import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaStar,
  FaCalendarAlt,
  FaExternalLinkAlt,
  FaGamepad,
  FaUsers,
  FaBuilding,
  FaArrowLeft,
  FaCheck,
  FaBookmark,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import { getGameDetails } from "../api/igdb";
import { supabase } from "../lib/supabase";
import { useAuthModal } from "../context/AuthModalContext";
import "./GameDetail.css";

export default function GameDetail() {
  const { id } = useParams();
  const { openLogin } = useAuthModal();

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // User interaction states
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);
  const [inWishlist, setInWishlist] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [activeMediaTab, setActiveMediaTab] = useState("screenshots"); // 'screenshots' | 'artworks'

  useEffect(() => {
    let isMounted = true;
    async function fetchGame() {
      setLoading(true);
      setError(null);
      try {
        const data = await getGameDetails(id);
        if (isMounted) {
          setGame(data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load game details.");
          setLoading(false);
        }
      }
    }

    fetchGame();
    return () => {
      isMounted = false;
    };
  }, [id]);

  // Load reviews from Supabase
  useEffect(() => {
    async function loadReviews() {
      if (!id) return;
      try {
        const { data, error: err } = await supabase
          .from("game_reviews")
          .select("*")
          .eq("game_id", String(id))
          .order("created_at", { ascending: false });

        if (!err && data) {
          setReviews(data);
        }
      } catch {
        // Silent fallback
      }
    }
    loadReviews();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    setSubmittingReview(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        openLogin();
        setSubmittingReview(false);
        return;
      }

      const newReview = {
        user_id: user.id,
        game_id: String(game.id),
        game_title: game.name,
        rating: userRating || 8.0,
        review_text: reviewText.trim(),
      };

      const { data, error: insertError } = await supabase
        .from("game_reviews")
        .insert([newReview])
        .select();

      if (!insertError && data) {
        setReviews([data[0], ...reviews]);
        setReviewText("");
      } else {
        // Optimistic UI fallback
        setReviews([
          {
            id: Date.now(),
            game_id: String(game.id),
            game_title: game.name,
            rating: userRating || 8.0,
            review_text: reviewText.trim(),
            created_at: new Date().toISOString(),
          },
          ...reviews,
        ]);
        setReviewText("");
      }
    } catch {
      // Local fallback
      setReviews([
        {
          id: Date.now(),
          game_id: String(game.id),
          game_title: game.name,
          rating: userRating || 8.0,
          review_text: reviewText.trim(),
          created_at: new Date().toISOString(),
        },
        ...reviews,
      ]);
      setReviewText("");
    } finally {
      setSubmittingReview(false);
    }
  };

  const toggleWishlist = async () => {
    setInWishlist(!inWishlist);
  };

  if (loading) {
    return (
      <div className="game-detail-page">
        <Navbar />
        <div className="game-detail-loading">
          <div className="spinner" />
          <p>Loading game details from IGDB...</p>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="game-detail-page">
        <Navbar />
        <div className="game-detail-error">
          <FaGamepad className="error-icon" />
          <h2>Game Not Found</h2>
          <p>{error || "Unable to retrieve game information from IGDB."}</p>
          <Link to="/games" className="back-btn">
            <FaArrowLeft /> Back to Games
          </Link>
        </div>
      </div>
    );
  }

  const bgImage = game.backdrop || game.cover;

  return (
    <div className="game-detail-page">
      <Navbar />

      {/* BACKDROP HERO */}
      <section className="game-backdrop-hero">
        {bgImage && (
          <div
            className="game-backdrop-bg"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
        )}
        <div className="game-backdrop-overlay" />

        <div className="game-hero-inner">
          <Link to="/games" className="game-back-link">
            <FaArrowLeft /> All Games
          </Link>

          <div className="game-header-grid">
            {/* COVER IMAGE */}
            <div className="game-cover-container">
              <img
                src={game.cover || game.image}
                alt={game.name}
                className="game-cover-img"
              />
            </div>

            {/* HEADER DETAILS */}
            <div className="game-header-info">
              <div className="game-meta-tags">
                <span className="game-type-chip">VIDEO GAME</span>
                {game.year && <span className="game-year-chip">{game.year}</span>}
              </div>

              <h1 className="game-title">{game.name}</h1>

              {/* RATINGS STRIP */}
              <div className="game-ratings-row">
                {game.rating && (
                  <div className="rating-box user-rating">
                    <FaStar className="star-icon" />
                    <div className="rating-values">
                      <span className="rating-score">{game.rating}</span>
                      <span className="rating-label">IGDB RATING</span>
                    </div>
                  </div>
                )}
                {game.aggregated_rating && (
                  <div className="rating-box critic-rating">
                    <FaStar className="star-icon critic" />
                    <div className="rating-values">
                      <span className="rating-score">{game.aggregated_rating}</span>
                      <span className="rating-label">CRITIC SCORE</span>
                    </div>
                  </div>
                )}
              </div>

              {/* ACTION BUTTONS */}
              <div className="game-actions-row">
                <button
                  type="button"
                  className={`wishlist-btn ${inWishlist ? "active" : ""}`}
                  onClick={toggleWishlist}
                >
                  {inWishlist ? (
                    <>
                      <FaCheck /> Saved to Wishlist
                    </>
                  ) : (
                    <>
                      <FaBookmark /> Add to Wishlist
                    </>
                  )}
                </button>
              </div>

              {/* QUICK SPECS */}
              <div className="game-specs-grid">
                {game.platforms && game.platforms.length > 0 && (
                  <div className="spec-item">
                    <span className="spec-label">Platforms</span>
                    <span className="spec-val">{game.platforms.join(", ")}</span>
                  </div>
                )}
                {game.developers && game.developers.length > 0 && (
                  <div className="spec-item">
                    <span className="spec-label">Developer</span>
                    <span className="spec-val">{game.developers.join(", ")}</span>
                  </div>
                )}
                {game.publishers && game.publishers.length > 0 && (
                  <div className="spec-item">
                    <span className="spec-label">Publisher</span>
                    <span className="spec-val">{game.publishers.join(", ")}</span>
                  </div>
                )}
                {game.release_date && (
                  <div className="spec-item">
                    <span className="spec-label">Release Date</span>
                    <span className="spec-val">{game.release_date}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT BODY */}
      <div className="game-body-wrapper">
        <div className="game-body-grid">
          {/* LEFT: SUMMARY, STORYLINE, SCREENSHOTS, REVIEWS */}
          <div className="game-main-col">
            {/* SUMMARY */}
            {game.summary && (
              <section className="game-section">
                <h2 className="section-title">Overview</h2>
                <p className="game-text">{game.summary}</p>
              </section>
            )}

            {/* STORYLINE */}
            {game.storyline && (
              <section className="game-section">
                <h2 className="section-title">Storyline</h2>
                <p className="game-text storyline">{game.storyline}</p>
              </section>
            )}

            {/* SCREENSHOTS & ARTWORK GALLERY */}
            {((game.screenshots && game.screenshots.length > 0) ||
              (game.artworks && game.artworks.length > 0)) && (
              <section className="game-section">
                <div className="gallery-header">
                  <h2 className="section-title">Visual Media</h2>
                  <div className="media-tabs">
                    {game.screenshots?.length > 0 && (
                      <button
                        className={`media-tab ${activeMediaTab === "screenshots" ? "active" : ""}`}
                        onClick={() => setActiveMediaTab("screenshots")}
                      >
                        Screenshots ({game.screenshots.length})
                      </button>
                    )}
                    {game.artworks?.length > 0 && (
                      <button
                        className={`media-tab ${activeMediaTab === "artworks" ? "active" : ""}`}
                        onClick={() => setActiveMediaTab("artworks")}
                      >
                        Artwork ({game.artworks.length})
                      </button>
                    )}
                  </div>
                </div>

                <div className="game-media-gallery">
                  {activeMediaTab === "screenshots"
                    ? game.screenshots.map((s, idx) => (
                        <div key={idx} className="gallery-item">
                          <img src={s.big || s.huge} alt={`${game.name} screenshot ${idx + 1}`} loading="lazy" />
                        </div>
                      ))
                    : game.artworks.map((a, idx) => (
                        <div key={idx} className="gallery-item">
                          <img src={a.big} alt={`${game.name} artwork ${idx + 1}`} loading="lazy" />
                        </div>
                      ))}
                </div>
              </section>
            )}

            {/* VOUCH REVIEWS & VERDICTS */}
            <section className="game-section reviews-section">
              <h2 className="section-title">Community Vouch Reviews</h2>

              {/* WRITE REVIEW FORM */}
              <form className="game-review-form" onSubmit={handleReviewSubmit}>
                <div className="review-rating-picker">
                  <label>Your Score:</label>
                  <div className="rating-buttons">
                    {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].reverse().map((num) => (
                      <button
                        key={num}
                        type="button"
                        className={`score-btn ${userRating === num ? "selected" : ""}`}
                        onClick={() => setUserRating(num)}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  className="review-textarea"
                  placeholder={`Write your honest review and verdict for ${game.name}...`}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={4}
                  required
                />

                <button
                  type="submit"
                  className="submit-review-btn"
                  disabled={submittingReview}
                >
                  {submittingReview ? "Submitting..." : "Post Review"}
                </button>
              </form>

              {/* REVIEWS LIST */}
              <div className="game-reviews-list">
                {reviews.length === 0 ? (
                  <p className="no-reviews-note">No community reviews yet. Be the first to vouch for {game.name}!</p>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev.id} className="game-review-card">
                      <div className="review-card-header">
                        <span className="reviewer-tag">Vouch Cinephile / Gamer</span>
                        <div className="review-card-rating">
                          <FaStar className="star-icon" /> {rev.rating} / 10
                        </div>
                      </div>
                      <p className="review-card-text">{rev.review_text}</p>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* RIGHT SIDEBAR: DETAILS & LINKS */}
          <aside className="game-sidebar-col">
            {/* GENRES */}
            {game.genres && game.genres.length > 0 && (
              <div className="sidebar-widget">
                <h3 className="widget-title">Genres</h3>
                <div className="widget-chips">
                  {game.genres.map((g) => (
                    <span key={g} className="sidebar-chip">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* GAME MODES */}
            {game.game_modes && game.game_modes.length > 0 && (
              <div className="sidebar-widget">
                <h3 className="widget-title">Game Modes</h3>
                <div className="widget-chips">
                  {game.game_modes.map((gm) => (
                    <span key={gm} className="sidebar-chip mode">
                      <FaUsers style={{ marginRight: 4 }} /> {gm}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* OFFICIAL WEBSITES */}
            {game.websites && game.websites.length > 0 && (
              <div className="sidebar-widget">
                <h3 className="widget-title">Official Links</h3>
                <div className="links-list">
                  {game.websites.map((w, idx) => (
                    <a
                      key={idx}
                      href={w.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="external-link-btn"
                    >
                      <span>{w.category || "Website"}</span>
                      <FaExternalLinkAlt className="ext-icon" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

