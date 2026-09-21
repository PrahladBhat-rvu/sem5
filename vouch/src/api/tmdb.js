const API_BASE = "http://localhost:5000/api";

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
    `${API_BASE}/movie/${movieId}`
  );

  if (!response.ok) {
    throw new Error(`Movie details failed: ${response.status}`);
  }

  return await response.json();
}