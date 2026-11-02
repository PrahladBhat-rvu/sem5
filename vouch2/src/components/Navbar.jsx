import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuthModal } from "../context/AuthModalContext";

function Navbar() {
  const navigate = useNavigate();
  const { openLogin, openSignup } = useAuthModal();
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
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

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
      setUser(null);
      navigate("/");
    }
  };

  const userInitial =
    user?.user_metadata?.display_name?.charAt(0) ||
    user?.email?.charAt(0)?.toUpperCase() ||
    "U";

  return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <Link to="/" className="logo">
        VOUCH
      </Link>

      <button
        type="button"
        className="mobile-menu-toggle"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle navigation menu"
      >
        {mobileMenuOpen ? "✕" : "☰"}
      </button>

      <div className={`nav-links ${mobileMenuOpen ? "mobile-open" : ""}`}>
        <Link to="/" onClick={() => setMobileMenuOpen(false)}>
          Home
        </Link>
        <Link to="/discover" onClick={() => setMobileMenuOpen(false)}>
          Discover
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

      <div className="nav-actions">
        {user ? (
          <div className="nav-user-menu">
            <Link to="/profile" className="nav-user-pill">
              <span className="nav-user-avatar">{userInitial}</span>
              <span className="nav-user-name">
                {user.user_metadata?.display_name || user.email?.split("@")[0]}
              </span>
            </Link>
            <button
              type="button"
              className="nav-logout-btn"
              onClick={handleLogout}
            >
              Sign out
            </button>
          </div>
        ) : (
          <>
            <button
              type="button"
              className="login-button"
              onClick={() => {
                setMobileMenuOpen(false);
                openLogin();
              }}
            >
              Login
            </button>
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
  );
}

export default Navbar;
