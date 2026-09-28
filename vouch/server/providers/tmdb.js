const TMDB_URL = "https://api.themoviedb.org/3";

async function tmdbRequest(path, params = {}) {
  const url = new URL(`${TMDB_URL}${path}`);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
      accept: "application/json",
    },
  });

  if (!response.ok) {
    const error = new Error(`TMDB HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return response.json();
}

export async function searchTMDB(query) {
  return tmdbRequest("/search/movie", {
    query,
    include_adult: "false",
    language: "en-US",
    page: "1",
  });
}

export async function getTMDBMovie(tmdbId) {
  return tmdbRequest(`/movie/${tmdbId}`, {
    language: "en-US",
    append_to_response: "credits",
  });
}