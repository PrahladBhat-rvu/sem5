// Slug generation and semantic URL routing helper for movies & TV shows

export function slugify(text) {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove non-word characters except hyphen
    .replace(/[\s_-]+/g, "-") // Collapse whitespaces & underscores into single hyphen
    .replace(/^-+|-+$/g, ""); // Trim leading/trailing hyphens
}

// Known TV Show IDs in Vouch catalogs
const KNOWN_TV_IDS = new Set([
  2316,   // The Office
  238234, // High Potential
  88785,  // Why Women Kill
  63688,  // Crazy Ex-Girlfriend
  57243,  // Doctor Who
  2919,   // The Tonight Show
  2912,   // Jeopardy!
  60574,  // Peaky Blinders
  1104,   // Mad Men
  1399,   // Game of Thrones
  1396,   // Breaking Bad
]);

export function isTvShow(item) {
  if (!item) return false;
  const id = Number(item.id || item.tmdbID);
  if (KNOWN_TV_IDS.has(id)) return true;

  const type = String(item.type || item.media_type || "").toLowerCase();
  if (type === "tv" || type === "series" || type === "tvshow" || type === "show") {
    return true;
  }

  const genres = item.genres || [];
  if (Array.isArray(genres)) {
    const hasTvGenre = genres.some((g) => {
      const name = typeof g === "string" ? g.toLowerCase() : g.name?.toLowerCase() || "";
      return name.includes("talk show") || name.includes("game show") || name.includes("soap");
    });
    if (hasTvGenre) return true;
  }

  return false;
}

/**
 * Returns clean semantic URL:
 * - Movies:   /movie/the-dark-knight
 * - TV Shows: /tvshow/the-office
 */
export function getTitleUrl(item) {
  if (!item) return "/";

  if (typeof item === "string") {
    return `/movie/${slugify(item)}`;
  }

  let rawTitle = item.title || item.Title || item.name || item.movieTitle || "";

  // Guard against dummy placeholder numbers like "Movie #12345"
  if (/^(movie|title)\s*#?\d+$/i.test(String(rawTitle).trim())) {
    rawTitle = "";
  }

  const slug = slugify(rawTitle || item.movieSlug || "");
  const prefix = isTvShow(item) ? "tvshow" : "movie";

  if (!slug) {
    const id = item.id || item.imdbID || item.tmdbID || item.movieId;
    return id ? `/${prefix}/${id}` : "/";
  }

  return `/${prefix}/${slug}`;
}

