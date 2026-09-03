const BASE_URL = "https://api.themoviedb.org/3";

const headers = {
  Authorization: `Bearer ${process.env.REACT_APP_TMDB_TOKEN}`,
  "Content-Type": "application/json",
};

export async function searchMovies(query) {
  if (!query.trim()) return [];

  const response = await fetch(
    `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}`,
    {
      method: "GET",
      headers,
    }
  );

  if (!response.ok) {
    throw new Error(`TMDB search failed: ${response.status}`);
  }

  const data = await response.json();

  return data.results;
}

export async function getMovieDetails(movieId) {
  const response = await fetch(
    `${BASE_URL}/movie/${movieId}?append_to_response=credits`,
    {
      method: "GET",
      headers,
    }
  );

  if (!response.ok) {
    throw new Error(`TMDB details failed: ${response.status}`);
  }

  return await response.json();
}