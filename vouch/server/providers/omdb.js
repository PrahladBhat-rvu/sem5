const OMDB_URL = "https://www.omdbapi.com/";

export async function searchOMDb(query) {
  const url = new URL(OMDB_URL);

  url.searchParams.set("apikey", process.env.OMDB_API_KEY);
  url.searchParams.set("s", query);
  url.searchParams.set("type", "movie");

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`OMDb HTTP ${response.status}`);
  }

  const data = await response.json();

  if (data.Response === "False") {
    throw new Error(data.Error || "OMDb search failed");
  }

  return data.Search || [];
}

export async function getOMDbMovie(imdbId) {
  const url = new URL(OMDB_URL);

  url.searchParams.set("apikey", process.env.OMDB_API_KEY);
  url.searchParams.set("i", imdbId);
  url.searchParams.set("plot", "full");

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`OMDb HTTP ${response.status}`);
  }

  const data = await response.json();

  if (data.Response === "False") {
    throw new Error(data.Error || "OMDb movie lookup failed");
  }

  return data;
}