const API_URL = "http://localhost:5000";

export async function searchMovies(query) {
  const response = await fetch(
    `${API_URL}/api/movies/search?q=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    throw new Error("Movie search failed");
  }

  return response.json();
}

export async function getMovie(id) {
  const response = await fetch(
    `${API_URL}/api/movies/${encodeURIComponent(id)}`
  );

  if (!response.ok) {
    throw new Error("Movie lookup failed");
  }

  return response.json();
}