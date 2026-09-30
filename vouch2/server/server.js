const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// ============================================================
// CONFIG
// ============================================================

const OMDB_BASE_URL = "https://www.omdbapi.com";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p";

const OMDB_API_KEY = process.env.OMDB_API_KEY;
const TMDB_TOKEN = process.env.TMDB_TOKEN;

// ============================================================
// HELPERS
// ============================================================

function hasOMDb() {
  return Boolean(OMDB_API_KEY);
}

function hasTMDB() {
  return Boolean(TMDB_TOKEN);
}

// ------------------------------------------------------------
// TMDB request
// ------------------------------------------------------------

async function tmdbRequest(path) {
  if (!TMDB_TOKEN) {
    throw new Error("TMDB_TOKEN is missing from .env");
  }

  return fetch(`${TMDB_BASE_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${TMDB_TOKEN}`,
      "Content-Type": "application/json",
    },
  });
}

// ------------------------------------------------------------
// OMDb request
// ------------------------------------------------------------

async function omdbRequest(params) {
  if (!OMDB_API_KEY) {
    throw new Error("OMDB_API_KEY is missing from .env");
  }

  const searchParams = new URLSearchParams({
    apikey: OMDB_API_KEY,
    ...params,
  });

  return fetch(`${OMDB_BASE_URL}/?${searchParams.toString()}`);
}

// ------------------------------------------------------------
// Convert OMDb search results into a shape your frontend can use
// ------------------------------------------------------------

function normalizeOMDbSearchResults(data) {
  if (!data || data.Response !== "True" || !Array.isArray(data.Search)) {
    return [];
  }

  return data.Search.map((movie) => ({
    // IMPORTANT:
    // Use the OMDb IMDb ID as the route ID.
    // Example: tt0468569
    id: movie.imdbID,

    imdbID: movie.imdbID,

    title: movie.Title || "Untitled",

    release_date:
      movie.Year && movie.Year !== "N/A"
        ? `${movie.Year}-01-01`
        : "",

    year: movie.Year || "",

    // Keep OMDb poster URL.
    Poster:
      movie.Poster && movie.Poster !== "N/A"
        ? movie.Poster
        : null,

    poster:
      movie.Poster && movie.Poster !== "N/A"
        ? movie.Poster
        : null,

    // Useful for the existing frontend if it expects poster_path.
    poster_path: null,

    type: movie.Type || "movie",

    source: "omdb",
  }));
}

// ------------------------------------------------------------
// Convert TMDB search results into the same basic shape
// ------------------------------------------------------------

function normalizeTMDBSearchResults(data) {
  if (!data || !Array.isArray(data.results)) {
    return [];
  }

  return data.results.map((movie) => ({
    id: movie.id,

    tmdbID: movie.id,

    title: movie.title || movie.name || "Untitled",

    release_date:
      movie.release_date ||
      movie.first_air_date ||
      "",

    year:
      movie.release_date?.slice(0, 4) ||
      movie.first_air_date?.slice(0, 4) ||
      "",

    poster_path: movie.poster_path || null,

    poster: null,

    Poster: null,

    type: "movie",

    source: "tmdb",
  }));
}

// ============================================================
// HEALTH
// ============================================================

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "vouch-api",
    omdb: hasOMDb(),
    tmdb: hasTMDB(),
  });
});

// ============================================================
// SEARCH MOVIES
// ============================================================
//
// OMDb is used first.
//
// If:
// - OMDb key is missing
// - OMDb returns an error
// - OMDb request limit is reached
// - OMDb returns no results
//
// then TMDB is used as fallback.
//

app.get("/api/search/movie", async (req, res) => {
  try {
    const query = String(req.query.query || "").trim();

    if (!query) {
      return res.status(400).json({
        error: "Query is required.",
      });
    }

    // --------------------------------------------------------
    // 1. TRY OMDb
    // --------------------------------------------------------

    if (hasOMDb()) {
      try {
        console.log(`OMDb search: "${query}"`);

        const response = await omdbRequest({
          s: query,
          type: "movie",
        });

        const data = await response.json();

        if (data.Response === "True" && Array.isArray(data.Search)) {
          console.log(
            `OMDb returned ${data.Search.length} result(s)`
          );

          return res.json({
            source: "omdb",
            results: normalizeOMDbSearchResults(data),
          });
        }

        console.warn(
          "OMDb search failed:",
          data.Error || "No results"
        );
      } catch (error) {
        console.error("OMDb SEARCH ERROR:", error.message);
      }
    } else {
      console.warn(
        "OMDB_API_KEY is missing. Skipping OMDb search."
      );
    }

    // --------------------------------------------------------
    // 2. FALL BACK TO TMDB
    // --------------------------------------------------------

    if (hasTMDB()) {
      try {
        console.log(`TMDB fallback search: "${query}"`);

        const response = await tmdbRequest(
          `/search/movie?query=${encodeURIComponent(
            query
          )}&include_adult=false&language=en-US`
        );

        if (!response.ok) {
          const body = await response.text();

          console.error(
            `TMDB search failed: ${response.status}`,
            body
          );

          return res.status(response.status).json({
            error: "TMDB search failed.",
          });
        }

        const data = await response.json();

        return res.json({
          source: "tmdb",
          results: normalizeTMDBSearchResults(data),
        });
      } catch (error) {
        console.error("TMDB SEARCH ERROR:", error.message);
      }
    }

    // --------------------------------------------------------
    // Nothing available
    // --------------------------------------------------------

    return res.status(503).json({
      error:
        "Movie search is currently unavailable. Configure OMDB_API_KEY or TMDB_TOKEN.",
      results: [],
    });
  } catch (error) {
    console.error("SEARCH ERROR:", error);

    res.status(500).json({
      error: "Failed to search movies.",
      details: error.message,
      results: [],
    });
  }
});

// ============================================================
// MOVIE DETAILS
// ============================================================
//
// IMPORTANT:
//
// /api/movie/tt0468569
//        ↑
//        OMDb IMDb ID
//
// /api/movie/550
//        ↑
//        TMDB numeric ID
//
// This route automatically determines which database to use.
//

app.get("/api/movie/:id", async (req, res) => {
  const movieId = String(req.params.id || "").trim();

  if (!movieId) {
    return res.status(400).json({
      error: "Movie ID is required.",
    });
  }

  // ==========================================================
  // OMDb IMDb ID
  // ==========================================================
  //
  // IMDb IDs look like:
  //
  // tt0468569
  // tt1375666
  // tt0816692
  //
  // ==========================================================

  const isIMDbId = /^tt\d+$/i.test(movieId);

  if (isIMDbId) {
    // --------------------------------------------------------
    // Try OMDb
    // --------------------------------------------------------

    if (hasOMDb()) {
      try {
        console.log(`OMDb movie request: ${movieId}`);

        const response = await omdbRequest({
          i: movieId,
          plot: "full",
        });

        const data = await response.json();

        // Successful OMDb response
        if (data.Response === "True") {
          return res.json({
            ...data,

            // Helpful metadata for frontend/debugging
            source: "omdb",
            id: data.imdbID || movieId,
          });
        }

        console.warn(
          `OMDb could not find ${movieId}:`,
          data.Error || "Unknown error"
        );
      } catch (error) {
        console.error(
          `OMDb MOVIE ERROR (${movieId}):`,
          error.message
        );
      }
    } else {
      console.warn(
        "OMDB_API_KEY is missing. Skipping OMDb."
      );
    }

    // --------------------------------------------------------
    // OMDb failed.
    //
    // IMDb IDs cannot directly be sent to TMDB's:
    //
    // /movie/:id
    //
    // because TMDB expects its own numeric movie ID.
    //
    // So we use TMDB's find endpoint to translate:
    //
    // tt0468569
    //      ↓
    // TMDB
    //      ↓
    // numeric TMDB ID
    //
    // --------------------------------------------------------

    if (hasTMDB()) {
      try {
        console.log(
          `TMDB fallback lookup for IMDb ID: ${movieId}`
        );

        const response = await tmdbRequest(
          `/find/${encodeURIComponent(
            movieId
          )}?external_source=imdb_id`
        );

        if (!response.ok) {
          const body = await response.text();

          console.error(
            `TMDB find failed: ${response.status}`,
            body
          );

          return res.status(response.status).json({
            error: "Movie lookup failed.",
          });
        }

        const data = await response.json();

        const movie =
          data.movie_results &&
          data.movie_results.length > 0
            ? data.movie_results[0]
            : null;

        if (!movie) {
          return res.status(404).json({
            error: "Movie not found.",
            id: movieId,
          });
        }

        return res.json({
          ...movie,

          source: "tmdb",

          // Preserve the original IMDb ID
          imdbID: movieId,

          id: movie.id,
        });
      } catch (error) {
        console.error(
          `TMDB IMDb FALLBACK ERROR (${movieId}):`,
          error.message
        );
      }
    }

    return res.status(404).json({
      error: "Movie not found.",
      id: movieId,
    });
  }

  // ==========================================================
  // TMDB numeric ID
  // ==========================================================
  //
  // Example:
  //
  // /api/movie/550
  //
  // ==========================================================

  if (/^\d+$/.test(movieId)) {
    if (!hasTMDB()) {
      return res.status(500).json({
        error:
          "TMDB_TOKEN is missing from .env. Cannot load numeric TMDB movie ID.",
      });
    }

    try {
      console.log(`TMDB movie request: ${movieId}`);

      const response = await tmdbRequest(
        `/movie/${encodeURIComponent(
          movieId
        )}?append_to_response=credits&language=en-US`
      );

      if (!response.ok) {
        const body = await response.text();

        console.error(
          `TMDB movie failed: ${response.status}`,
          body
        );

        return res.status(response.status).json({
          error: "Failed to get movie details from TMDB.",
        });
      }

      const data = await response.json();

      return res.json({
        ...data,
        source: "tmdb",
        tmdbID: data.id,
      });
    } catch (error) {
      console.error(
        `TMDB MOVIE ERROR (${movieId}):`,
        error.message
      );

      return res.status(500).json({
        error: "Failed to get movie details.",
        details: error.message,
      });
    }
  }

  // ==========================================================
  // Unknown ID format
  // ==========================================================

  return res.status(400).json({
    error:
      "Invalid movie ID. Expected an IMDb ID such as tt0468569 or a numeric TMDB ID.",
  });
});

// ============================================================
// OMDb POSTER PROXY
// ============================================================
//
// Example:
//
// /api/image/omdb?url=https%3A%2F%2Fm.media-amazon.com%2Fimages%2F...
//
// This prevents the browser from having to request OMDb poster
// URLs directly.
//

app.get("/api/image/omdb", async (req, res) => {
  try {
    const imageUrl = String(req.query.url || "").trim();

    if (!imageUrl) {
      return res.status(400).json({
        error: "Poster URL is required.",
      });
    }

    let parsedUrl;

    try {
      parsedUrl = new URL(imageUrl);
    } catch {
      return res.status(400).json({
        error: "Invalid poster URL.",
      });
    }

    // Only allow Amazon's image host.
    // OMDb commonly returns posters from this host.
    const allowedHosts = new Set([
      "m.media-amazon.com",
      "images-na.ssl-images-amazon.com",
    ]);

    if (!allowedHosts.has(parsedUrl.hostname)) {
      return res.status(403).json({
        error: "Poster host is not allowed.",
      });
    }

    const response = await fetch(parsedUrl.toString());

    if (!response.ok) {
      return res.status(response.status).end();
    }

    res.setHeader(
      "Content-Type",
      response.headers.get("Content-Type") ||
        "image/jpeg"
    );

    res.setHeader(
      "Cache-Control",
      "public, max-age=86400"
    );

    const buffer = await response.arrayBuffer();

    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error("OMDb IMAGE ERROR:", error);

    res.status(500).end();
  }
});

// ============================================================
// TMDB POSTER PROXY
// ============================================================
//
// Existing frontend URLs such as:
//
// /api/image/w500/abc123.jpg
//
// continue to work.
//

app.get(/^\/api\/image\/([^/]+)\/(.+)$/, async (req, res) => {
  try {
    const size = req.params[0];
    const imagePath = req.params[1];

    const allowedSizes = new Set([
      "w45",
      "w92",
      "w154",
      "w185",
      "w300",
      "w342",
      "w500",
      "w780",
      "w1280",
      "original",
    ]);

    if (!allowedSizes.has(size) || !imagePath) {
      return res.status(400).json({
        error: "Invalid image request.",
      });
    }

    const response = await fetch(
      `${TMDB_IMAGE_URL}/${size}/${imagePath}`
    );

    if (!response.ok) {
      return res.status(response.status).end();
    }

    res.setHeader(
      "Content-Type",
      response.headers.get("Content-Type") ||
        "image/jpeg"
    );

    res.setHeader(
      "Cache-Control",
      "public, max-age=86400"
    );

    const buffer = await response.arrayBuffer();

    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error("TMDB IMAGE ERROR:", error);

    res.status(500).end();
  }
});

// ============================================================
// ROOT
// ============================================================

app.get("/", (req, res) => {
  res.send("Vouch API server is running");
});

// ============================================================
// START SERVER
// ============================================================

app.listen(PORT, () => {
  console.log(
    `Vouch API server running on http://localhost:${PORT}`
  );

  console.log(
    `OMDb: ${hasOMDb() ? "configured" : "NOT configured"}`
  );

  console.log(
    `TMDB: ${hasTMDB() ? "configured" : "NOT configured"}`
  );
});