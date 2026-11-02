import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const DEFAULT_POPULAR = [
  "Dune",
  "The Dark Knight",
  "Michael",
  "The Odyssey",
  "Interstellar",
];

function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = "Search for a movie or tv show",
  showPopular = false,
  popularItems = DEFAULT_POPULAR,
  popularLabel = "Popular right now:",
  autoFocus = false,
  className = "",
}) {
  const navigate = useNavigate();
  const [internalVal, setInternalVal] = useState(value || "");

  useEffect(() => {
    if (value !== undefined) {
      setInternalVal(value);
    }
  }, [value]);

  const handleChange = (e) => {
    const val = e.target.value;
    setInternalVal(val);
    if (onChange) {
      onChange(e);
    }
  };

  const handleClear = () => {
    setInternalVal("");
    if (onChange) {
      onChange({ target: { value: "" } });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = internalVal.trim();
    if (onSubmit) {
      onSubmit(query, e);
    } else {
      if (query) {
        navigate(`/search?q=${encodeURIComponent(query)}`);
      } else {
        navigate("/search");
      }
    }
  };

  return (
    <div className={`vouch-search-container ${className}`}>
      <form className="hero-search" onSubmit={handleSubmit}>
        <svg
          className="search-input-icon"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#111"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7.5" />
          <line x1="21" y1="21" x2="16.5" y2="16.5" />
        </svg>

        <input
          type="text"
          value={internalVal}
          onChange={handleChange}
          placeholder={placeholder}
          aria-label={placeholder}
          autoFocus={autoFocus}
        />

        {internalVal && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={handleClear}
            aria-label="Clear input"
          >
            ✕
          </button>
        )}

        <button
          type="submit"
          className="hero-search-arrow-btn"
          aria-label="Submit search"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#111"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </form>

      {showPopular && popularItems && popularItems.length > 0 && (
        <div className="popular">
          <span className="popular-title">{popularLabel}</span>
          {popularItems.map((item) => (
            <Link
              key={item}
              to={`/search?q=${encodeURIComponent(item)}`}
              className="hero-popular-pill"
            >
              {item}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
