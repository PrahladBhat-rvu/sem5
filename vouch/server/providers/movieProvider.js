import {
  searchOMDb,
  getOMDbMovie,
} from "./omdb.js";

import {
  searchTMDB,
  getTMDBMovie,
} from "./tmdb.js";

export async function searchMovies(query) {
  try {
    console.log("Searching OMDb...");

    const results = await searchOMDb(query);

    return {
      provider: "omdb",
      results,
    };
  } catch (omdbError) {
    console.warn("OMDb failed:", omdbError.message);
    console.log("Falling back to TMDB...");

    try {
      const data = await searchTMDB(query);

      return {
        provider: "tmdb",
        results: data.results,
      };
    } catch (tmdbError) {
      console.error("TMDB also failed:", tmdbError.message);

      throw new Error("All movie providers failed");
    }
  }
}