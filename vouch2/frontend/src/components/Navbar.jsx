import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaSearch, FaCheck, FaBolt, FaArrowRight } from "react-icons/fa";
import { supabase } from "../lib/supabase";
import { useAuthModal } from "../context/AuthModalContext";
import { useTheme } from "../context/ThemeContext";
import CoolThemeSwitch from "./CoolThemeSwitch";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { openLogin, openSignup } = useAuthModal();
  const { isDark, toggleTheme } = useTheme();

  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Search input state (Search bar replacing the "+ Create" button)
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);

  // User menu state
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // Check Supabase Auth state
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });

      return () => {
        window.removeEventListener("scroll", handleScroll);
        subscription.unsubscribe();
      };
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Click outside to close user dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenuOpen]);

  // Global keyboard shortcuts: "/" or "Cmd/Ctrl+K" focuses search, "Esc" closes menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeTag = document.activeElement?.tagName;
      const isInput = ["INPUT", "TEXTAREA", "SELECT"].includes(activeTag);

      if (e.key === "Escape") {
        if (isInput) document.activeElement.blur();
        setUserMenuOpen(false);
        setShowShortcutsModal(false);
        setShowUpgradeModal(false);
        return;
      }

      if (!isInput) {
        if (e.key === "/" || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) {
          e.preventDefault();
          searchInputRef.current?.focus();
        } else if (e.key.toLowerCase() === "t" && !e.metaKey && !e.ctrlKey) {
          toggleTheme();
        } else if (e.key === "?" && e.shiftKey) {
          setShowShortcutsModal((prev) => !prev);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleTheme]);

  const handleLogout = async () => {
    setUserMenuOpen(false);
    if (supabase) {
      await supabase.auth.signOut();
      setUser(null);
      navigate("/");
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      const isGamesRoute = location.pathname.startsWith("/games") || location.pathname.startsWith("/game/");
      const targetUrl = isGamesRoute
        ? `/games?q=${encodeURIComponent(query)}`
        : `/search?q=${encodeURIComponent(query)}`;
      navigate(targetUrl);
      searchInputRef.current?.blur();
    }
  };

  const userName =
    user?.user_metadata?.display_name ||
    user?.email?.split("@")[0] ||
    "Cinephile";

  const userInitial = userName.charAt(0).toUpperCase() || "U";

  // Use uploaded profile avatar or handsome cinephile portrait default
  const avatarUrl =
    user?.user_metadata?.avatar_url ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80";

  const isProfileActive = location.pathname === "/profile";

  return (
    <>
      <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
        {/* BRAND LOGO + COOL THEME SWITCH */}
        <div className="nav-brand-group">
          <Link to="/" className="logo">
            VOUCH
          </Link>
          <CoolThemeSwitch toggleSize={10} />
        </div>

        <button
          type="button"
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className={`nav-links ${mobileMenuOpen ? "mobile-open" : ""}`}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>
            Home
          </Link>
          <Link to="/games" onClick={() => setMobileMenuOpen(false)}>
            Games
          </Link>
          <Link to="/lists" onClick={() => setMobileMenuOpen(false)}>
            Lists
          </Link>

          <div className="nav-dropdown">
            <Link to="/categories" className="nav-dropdown-trigger">
              Categories
            </Link>
            <div className="category-menu">
              <div className="category-column">
                <h4>Movies</h4>
                <Link to="/category/movies/action">Action</Link>
                <Link to="/category/movies/comedy">Comedy</Link>
                <Link to="/category/movies/drama">Drama</Link>
                <Link to="/category/movies/horror">Horror</Link>
                <Link to="/category/movies/sci-fi">Sci-Fi</Link>
              </div>
              <div className="category-column">
                <h4>Products</h4>
                <Link to="/category/products/technology">Technology</Link>
                <Link to="/category/products/fashion">Fashion</Link>
                <Link to="/category/products/beauty">Beauty</Link>
                <Link to="/category/products/home">Home</Link>
                <Link to="/category/products/fitness">Fitness</Link>
              </div>
              <div className="category-column">
                <h4>Games</h4>
                <Link to="/category/games/pc">PC</Link>
                <Link to="/category/games/playstation">PlayStation</Link>
                <Link to="/category/games/xbox">Xbox</Link>
                <Link to="/category/games/nintendo">Nintendo</Link>
                <Link to="/category/games/mobile">Mobile</Link>
              </div>
              <div className="category-column">
                <h4>Books</h4>
                <Link to="/category/books/fiction">Fiction</Link>
                <Link to="/category/books/non-fiction">Non-fiction</Link>
                <Link to="/category/books/mystery">Mystery</Link>
                <Link to="/category/books/fantasy">Fantasy</Link>
                <Link to="/category/books/sci-fi">Sci-Fi</Link>
              </div>
            </div>
          </div>

          <Link to="/new-releases" onClick={() => setMobileMenuOpen(false)}>
            New Releases
          </Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)}>
            About
          </Link>
        </div>

        {/* NAV ACTIONS: SEARCH BAR (ALWAYS VISIBLE) +
            USER PROFILE AVATAR MENU (WHEN LOGGED IN) OR
            THEME TOGGLE + SIGN IN + GET STARTED (WHEN LOGGED OUT) */}
        <div className="nav-actions">
          {/* SEARCH BAR (Always present beside profile circle or auth buttons) */}
          <form
            onSubmit={handleSearchSubmit}
            className="nav-header-search"
            role="search"
          >
            <span className="nav-search-lens">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="nav-search-input"
              aria-label="Search movies and reviews"
            />
            {searchQuery ? (
              <button
                type="button"
                className="nav-search-reset"
                onClick={() => setSearchQuery("")}
                aria-label="Clear input"
              >
                <FaTimes style={{ fontSize: "11px" }} />
              </button>
            ) : (
              <kbd className="nav-search-shortcut" title="Press / to focus">
                /
              </kbd>
            )}
          </form>

          {user ? (
            /* USER PROFILE CIRCLE + FLOATING MENU */
            <div className="nav-user-dropdown-anchor" ref={menuRef}>
                <button
                  type="button"
                  className={`nav-avatar-circle-btn ${userMenuOpen ? "active" : ""}`}
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  aria-label="User profile and navigation menu"
                  aria-expanded={userMenuOpen}
                  title={`${userName} (Account menu)`}
                >
                  <img
                    src={avatarUrl}
                    alt={userName}
                    className="nav-avatar-photo"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      if (e.currentTarget.nextSibling) {
                        e.currentTarget.nextSibling.style.display = "flex";
                      }
                    }}
                  />
                  <div
                    className="nav-avatar-initial"
                    style={{ display: "none" }}
                  >
                    {userInitial}
                  </div>
                </button>

                {/* FLOATING DROPDOWN MENU (Pixel-perfect replica of reference image) */}
                {userMenuOpen && (
                  <div className="user-floating-card" role="menu">
                    {/* 1. Profile */}
                    <Link
                      to="/profile"
                      className={`user-card-item ${isProfileActive ? "selected" : ""}`}
                      onClick={() => setUserMenuOpen(false)}
                      role="menuitem"
                    >
                      <span className="user-item-indicator" />
                      <span className="user-item-icon">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </span>
                      <span className="user-item-label">Profile</span>
                    </Link>

                    {/* 2. Settings */}
                    <Link
                      to="/profile#settings"
                      className="user-card-item"
                      onClick={() => setUserMenuOpen(false)}
                      role="menuitem"
                    >
                      <span className="user-item-indicator" />
                      <span className="user-item-icon">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </span>
                      <span className="user-item-label">Settings</span>
                    </Link>

                    {/* 3. Theme */}
                    <button
                      type="button"
                      className="user-card-item"
                      onClick={() => {
                        toggleTheme();
                      }}
                      role="menuitem"
                    >
                      <span className="user-item-indicator" />
                      <span className="user-item-icon">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="2" y="3" width="20" height="14" rx="2" />
                          <line x1="8" y1="21" x2="16" y2="21" />
                          <line x1="12" y1="17" x2="12" y2="21" />
                        </svg>
                      </span>
                      <span className="user-item-label">Theme</span>
                      <span className="user-item-chevron">›</span>
                    </button>

                    {/* 4. Upgrade */}
                    <button
                      type="button"
                      className="user-card-item"
                      onClick={() => {
                        setUserMenuOpen(false);
                        setShowUpgradeModal(true);
                      }}
                      role="menuitem"
                    >
                      <span className="user-item-indicator" />
                      <span className="user-item-icon">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14" />
                        </svg>
                      </span>
                      <span className="user-item-label">Upgrade</span>
                    </button>

                    {/* Divider Line */}
                    <div className="user-card-divider" />

                    {/* 5. Keyboard shortcuts */}
                    <button
                      type="button"
                      className="user-card-item"
                      onClick={() => {
                        setUserMenuOpen(false);
                        setShowShortcutsModal(true);
                      }}
                      role="menuitem"
                    >
                      <span className="user-item-indicator" />
                      <span className="user-item-icon">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
                        </svg>
                      </span>
                      <span className="user-item-label">Keyboard shortcuts</span>
                    </button>

                    {/* 6. Help center */}
                    <Link
                      to="/about"
                      className="user-card-item"
                      onClick={() => setUserMenuOpen(false)}
                      role="menuitem"
                    >
                      <span className="user-item-indicator" />
                      <span className="user-item-icon">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="16" x2="12" y2="12" />
                          <line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                      </span>
                      <span className="user-item-label">Help center</span>
                    </Link>

                    {/* 7. Log out */}
                    <button
                      type="button"
                      className="user-card-item logout"
                      onClick={handleLogout}
                      role="menuitem"
                    >
                      <span className="user-item-indicator" />
                      <span className="user-item-icon">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                      </span>
                      <span className="user-item-label">Log out</span>
                    </button>
                  </div>
                )}
              </div>
          ) : (
            <>
              {/* SIGN IN BUTTON */}
              <button
                type="button"
                className="login-button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openLogin();
                }}
              >
                Sign In
              </button>

              {/* GET STARTED BUTTON */}
              <button
                type="button"
                className="signup-button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openSignup();
                }}
              >
                Get Started
              </button>
            </>
          )}
        </div>
      </nav>

      {/* KEYBOARD SHORTCUTS MODAL */}
      {showShortcutsModal && (
        <div
          className="modal-backdrop"
          onClick={() => setShowShortcutsModal(false)}
        >
          <div
            className="shortcuts-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="shortcuts-modal-header">
              <div className="shortcuts-title-wrap">
                <span className="shortcuts-badge">⌘</span>
                <h3>Keyboard Shortcuts</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowShortcutsModal(false)}
                aria-label="Close shortcuts modal"
              >
                <FaTimes style={{ fontSize: "14px" }} />
              </button>
            </div>
            <div className="shortcuts-list">
              <div className="shortcut-row">
                <span>Focus search bar</span>
                <div className="shortcut-keys">
                  <kbd>/</kbd> or <kbd>⌘</kbd> <kbd>K</kbd>
                </div>
              </div>
              <div className="shortcut-row">
                <span>Toggle Theme (Dark / Light)</span>
                <div className="shortcut-keys">
                  <kbd>T</kbd>
                </div>
              </div>
              <div className="shortcut-row">
                <span>Show Shortcuts menu</span>
                <div className="shortcut-keys">
                  <kbd>?</kbd>
                </div>
              </div>
              <div className="shortcut-row">
                <span>Close menus & modals</span>
                <div className="shortcut-keys">
                  <kbd>Esc</kbd>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UPGRADE / PRO MODAL */}
      {showUpgradeModal && (
        <div
          className="modal-backdrop"
          onClick={() => setShowUpgradeModal(false)}
        >
          <div
            className="upgrade-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="upgrade-header">
              <div className="upgrade-sparkle-pill">
                <FaBolt style={{ color: "#f59e0b", marginRight: "5px", fontSize: "12px" }} />
                VOUCH PRO
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowUpgradeModal(false)}
                aria-label="Close upgrade modal"
              >
                <FaTimes style={{ fontSize: "14px" }} />
              </button>
            </div>
            <h2>Elevate your cinema journey.</h2>
            <p className="upgrade-subtitle">
              Verified review consensus, custom 16:9 shelf curation, and advanced critic badges.
            </p>
            <ul className="upgrade-perks">
              <li>
                <FaCheck style={{ color: "#10b981", marginRight: "8px", fontSize: "12px" }} />
                Verified Critic badge on every published vouch
              </li>
              <li>
                <FaCheck style={{ color: "#10b981", marginRight: "8px", fontSize: "12px" }} />
                Unlimited custom watchlist collections
              </li>
              <li>
                <FaCheck style={{ color: "#10b981", marginRight: "8px", fontSize: "12px" }} />
                High-priority consensus impact weighting
              </li>
              <li>
                <FaCheck style={{ color: "#10b981", marginRight: "8px", fontSize: "12px" }} />
                Early screening discussion circles
              </li>
            </ul>
            <button
              type="button"
              className="upgrade-action-btn"
              onClick={() => {
                setShowUpgradeModal(false);
                alert("You've been added to the Vouch Pro priority review circle!");
              }}
            >
              <span>Activate Pro Preview (Free)</span>
              <FaArrowRight style={{ marginLeft: "8px", fontSize: "12px" }} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
