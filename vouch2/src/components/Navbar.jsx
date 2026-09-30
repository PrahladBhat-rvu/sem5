import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <Link to="/" className="logo">
        VOUCH
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>

        <Link to="/search">Discover</Link>

        <div className="nav-dropdown">
          <Link
            to="/categories"
            className="nav-dropdown-trigger"
          >
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

              <Link to="/category/products/technology">
                Technology
              </Link>
              <Link to="/category/products/fashion">
                Fashion
              </Link>
              <Link to="/category/products/beauty">
                Beauty
              </Link>
              <Link to="/category/products/home">
                Home
              </Link>
              <Link to="/category/products/fitness">
                Fitness
              </Link>
            </div>

            <div className="category-column">
              <h4>Games</h4>

              <Link to="/category/games/pc">PC</Link>
              <Link to="/category/games/playstation">
                PlayStation
              </Link>
              <Link to="/category/games/xbox">Xbox</Link>
              <Link to="/category/games/nintendo">
                Nintendo
              </Link>
              <Link to="/category/games/mobile">
                Mobile
              </Link>
            </div>

            <div className="category-column">
              <h4>Books</h4>

              <Link to="/category/books/fiction">
                Fiction
              </Link>
              <Link to="/category/books/non-fiction">
                Non-fiction
              </Link>
              <Link to="/category/books/mystery">
                Mystery
              </Link>
              <Link to="/category/books/fantasy">
                Fantasy
              </Link>
              <Link to="/category/books/sci-fi">
                Sci-Fi
              </Link>
            </div>
          </div>
        </div>

        <Link to="/new-releases">New Releases</Link>

        <Link to="/search">About</Link>
      </div>

      <div className="nav-actions">
        <Link to="/login" className="login-button">
          Login
        </Link>

        <Link to="/signup" className="signup-button">
          Get Started
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;