const API_BASE = "/api";

export function getTMDBImageUrl(path, size = "w500") {
  if (!path) return null;
  return `${API_BASE}/image/${size}${path}`;
}

export async function searchMovies(query) {
  if (!query.trim()) return [];

  const response = await fetch(
    `${API_BASE}/search/movie?query=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    throw new Error(`Search failed: ${response.status}`);
  }

  const data = await response.json();

  return data.results || [];
}

export async function getMovieDetails(movieId) {
  const response = await fetch(
    `${API_BASE}/movie/${encodeURIComponent(movieId)}`
  );

  if (!response.ok) {
    throw new Error(`Movie details failed: ${response.status}`);
  }

  return await response.json();
}
