import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaCompass,
  FaSearch,
  FaThLarge,
  FaUser,
} from "react-icons/fa";
import { useAuthModal } from "../context/AuthModalContext";
import { supabase } from "../lib/supabase";

export default function MobileBottomNav() {
  const location = useLocation();
  const { openLogin } = useAuthModal();
  const [user, setUser] = useState(null);
  const [watchlistCount, setWatchlistCount] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Update watchlist count from localStorage
  useEffect(() => {
    const updateCount = () => {
      try {
        const list = JSON.parse(localStorage.getItem("vouch_watchlist") || "[]");
        setWatchlistCount(Array.isArray(list) ? list.length : 0);
      } catch {
        setWatchlistCount(0);
      }
    };

    updateCount();
    window.addEventListener("storage", updateCount);
    const interval = setInterval(updateCount, 2500);

    return () => {
      window.removeEventListener("storage", updateCount);
      clearInterval(interval);
    };
  }, []);

  const path = location.pathname;

  const isHomeActive = path === "/";
  const isDiscoverActive = path.startsWith("/discover");
  const isSearchActive = path.startsWith("/search");
  const isCategoriesActive = path.startsWith("/categories") || path.startsWith("/category");
  const isProfileActive = path.startsWith("/profile");

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Bottom Navigation">
      <div className="mobile-bottom-nav-inner">
        {/* 1. HOME */}
        <Link
          to="/"
          className={`mobile-nav-tab ${isHomeActive ? "active" : ""}`}
          aria-label="Home"
          aria-current={isHomeActive ? "page" : undefined}
        >
          <span className="mobile-nav-icon">
            <FaHome />
          </span>
          <span className="mobile-nav-label">Home</span>
          {isHomeActive && <span className="mobile-nav-indicator" />}
        </Link>

        {/* 2. DISCOVER */}
        <Link
          to="/discover"
          className={`mobile-nav-tab ${isDiscoverActive ? "active" : ""}`}
          aria-label="Discover"
          aria-current={isDiscoverActive ? "page" : undefined}
        >
          <span className="mobile-nav-icon">
            <FaCompass />
          </span>
          <span className="mobile-nav-label">Discover</span>
          {isDiscoverActive && <span className="mobile-nav-indicator" />}
        </Link>

        {/* 3. SEARCH (CENTER HERO TAB) */}
        <Link
          to="/search"
          className={`mobile-nav-tab mobile-nav-search-tab ${isSearchActive ? "active" : ""}`}
          aria-label="Search"
          aria-current={isSearchActive ? "page" : undefined}
        >
          <div className="mobile-search-tab-bubble">
            <FaSearch />
          </div>
          <span className="mobile-nav-label">Search</span>
        </Link>

        {/* 4. CATEGORIES */}
        <Link
          to="/categories"
          className={`mobile-nav-tab ${isCategoriesActive ? "active" : ""}`}
          aria-label="Categories"
          aria-current={isCategoriesActive ? "page" : undefined}
        >
          <span className="mobile-nav-icon">
            <FaThLarge />
          </span>
          <span className="mobile-nav-label">Browse</span>
          {isCategoriesActive && <span className="mobile-nav-indicator" />}
        </Link>

        {/* 5. PROFILE / SIGN IN */}
        {user ? (
          <Link
            to="/profile"
            className={`mobile-nav-tab ${isProfileActive ? "active" : ""}`}
            aria-label="Profile and Watchlist"
            aria-current={isProfileActive ? "page" : undefined}
          >
            <span className="mobile-nav-icon">
              <FaUser />
              {watchlistCount > 0 && (
                <span className="mobile-nav-badge" title={`${watchlistCount} items in watchlist`}>
                  {watchlistCount > 9 ? "9+" : watchlistCount}
                </span>
              )}
            </span>
            <span className="mobile-nav-label">Profile</span>
            {isProfileActive && <span className="mobile-nav-indicator" />}
          </Link>
        ) : (
          <button
            type="button"
            className={`mobile-nav-tab ${isProfileActive ? "active" : ""}`}
            onClick={openLogin}
            aria-label="Sign In to Vouch"
          >
            <span className="mobile-nav-icon">
              <FaUser />
            </span>
            <span className="mobile-nav-label">Sign In</span>
          </button>
        )}
      </div>
    </nav>
  );
}

