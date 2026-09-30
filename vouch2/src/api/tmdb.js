const API_BASE = "/api";

// ============================================================
// TMDB IMAGE
// ============================================================

export function getTMDBImageUrl(
  path,
  size = "w500"
) {
  if (!path) {
    return null;
  }

  return `${API_BASE}/image/${size}${path}`;
}

// ============================================================
// MOVIE SEARCH
// ============================================================

export async function searchMovies(query) {
  if (!query?.trim()) {
    return [];
  }

  const response = await fetch(
    `${API_BASE}/search/movie?query=${encodeURIComponent(
      query.trim()
    )}`
  );

  if (!response.ok) {
    throw new Error(
      `Search failed: ${response.status}`
    );
  }

  const data = await response.json();

  return data.results || [];
}

// ============================================================
// MOVIE DETAILS
// ============================================================
//
// Works with:
//
// tt0468569  -> OMDb IMDb ID
//
// 550        -> TMDB numeric ID
//
// The backend decides which API to use.
//

export async function getMovieDetails(
  movieId
) {
  if (!movieId) {
    throw new Error(
      "Movie ID is required."
    );
  }

  const response = await fetch(
    `${API_BASE}/movie/${encodeURIComponent(
      movieId
    )}`
  );

  if (!response.ok) {
    let message =
      `Movie details failed: ${response.status}`;

    try {
      const data = await response.json();

      if (data?.error) {
        message = data.error;
      }
    } catch {
      // Ignore JSON parsing errors.
    }

    throw new Error(message);
  }

  return await response.json();
}