import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
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
            <Link to="/" className="btn-primary" style={{ display: "inline-flex", alignItems: "center" }}>
              <FaArrowLeft style={{ marginRight: "8px", fontSize: "12px" }} />
              <span>Return to Homepage</span>
            </Link>
            <Link to="/lists" className="btn-secondary">
              Browse Movie Lists
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default NotFound;

