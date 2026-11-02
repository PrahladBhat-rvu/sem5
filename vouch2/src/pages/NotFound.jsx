import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";

function NotFound() {
  return (
    <div className="site">
      <Navbar />

      <main className="not-found-page">
        <div className="not-found-content">
          <h1>
            Lost in the
            <br />
            <em>cutting room.</em>
          </h1>
          <p className="not-found-text">
            The scene or title you're looking for doesn't exist, was renamed, or has moved to another reel.
          </p>

          <div className="not-found-search-wrap">
            <SearchBar placeholder="Try searching for a title instead..." />
          </div>

          <div className="not-found-actions">
            <Link to="/" className="btn-primary">
              ← Return to Homepage
            </Link>
            <Link to="/discover" className="btn-secondary">
              Browse Discover
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default NotFound;

