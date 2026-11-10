const path = require("path");
const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
require("dotenv").config();

const app = express();

const reviewsRouter = require("./reviews");
const authRouter = require("./auth");
const profilesRouter = require("./profiles");
app.use(cors());
app.use(express.json());

app.use("/api/reviews", reviewsRouter);
app.use("/api/auth", authRouter);
app.use("/api/profile", profilesRouter);

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

function isKnownTvShow(idOrSlug) {
  if (!idOrSlug) return false;
  const num = Number(idOrSlug);
  if (!isNaN(num) && KNOWN_TV_IDS.has(num)) return true;
  const clean = String(idOrSlug).toLowerCase();
  if (clean === "the-office" || clean.includes("the-office")) return true;
  return false;
}

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

        // Search OMDb across both movies and TV series
        const response = await omdbRequest({
          s: query,
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

        // Use multi-search to cover movies and series seamlessly
        const response = await tmdbRequest(
          `/search/multi?query=${encodeURIComponent(
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
        const filteredResults = {
          ...data,
          results: (data.results || []).filter(
            (item) => item.media_type === "movie" || item.media_type === "tv"
          ),
        };

        return res.json({
          source: "tmdb",
          results: normalizeTMDBSearchResults(filteredResults),
        });
      } catch (error) {
        console.error("TMDB SEARCH ERROR:", error.message, error.cause || "");
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
// TMDB GENRE MAP & MOVIE DISCOVERY ENDPOINTS
// ============================================================

const TMDB_GENRES = {
  action: 28,
  adventure: 12,
  animation: 16,
  comedy: 35,
  crime: 80,
  documentary: 99,
  drama: 18,
  family: 10751,
  fantasy: 14,
  history: 36,
  horror: 27,
  music: 10402,
  mystery: 9648,
  romance: 10749,
  "sci-fi": 878,
  scifi: 878,
  sciencefiction: 878,
  thriller: 53,
  war: 10752,
  western: 37,
};

// ------------------------------------------------------------
// TRENDING MOVIES
// ------------------------------------------------------------
app.get("/api/movies/trending", async (req, res) => {
  try {
    const timeWindow = req.query.timeWindow === "day" ? "day" : "week";

    if (hasTMDB()) {
      const response = await tmdbRequest(`/trending/movie/${timeWindow}`);

      if (response.ok) {
        const data = await response.json();
        return res.json({
          source: "tmdb",
          results: normalizeTMDBSearchResults(data),
        });
      }
    }

    return res.status(503).json({
      error: "Trending movies unavailable.",
      results: [],
    });
  } catch (error) {
    console.error("TRENDING ERROR:", error);
    res.status(500).json({ error: error.message, results: [] });
  }
});

// ------------------------------------------------------------
// NEW RELEASES / NOW PLAYING
// ------------------------------------------------------------
app.get("/api/movies/new-releases", async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;

    if (hasTMDB()) {
      const response = await tmdbRequest(`/movie/now_playing?language=en-US&page=${page}`);

      if (response.ok) {
        const data = await response.json();
        return res.json({
          source: "tmdb",
          results: normalizeTMDBSearchResults(data),
        });
      }
    }

    return res.status(503).json({
      error: "New releases unavailable.",
      results: [],
    });
  } catch (error) {
    console.error("NEW RELEASES ERROR:", error);
    res.status(500).json({ error: error.message, results: [] });
  }
});

// ------------------------------------------------------------
// DISCOVER MOVIES
// ------------------------------------------------------------
app.get("/api/movies/discover", async (req, res) => {
  try {
    const { genre, sortBy = "popularity.desc", page = 1 } = req.query;

    if (hasTMDB()) {
      const params = new URLSearchParams({
        include_adult: "false",
        include_video: "false",
        language: "en-US",
        page: String(page),
        sort_by: String(sortBy),
      });

      if (genre) {
        const genreId = TMDB_GENRES[genre.toLowerCase()] || genre;
        params.append("with_genres", String(genreId));
      }

      const response = await tmdbRequest(`/discover/movie?${params.toString()}`);

      if (response.ok) {
        const data = await response.json();
        return res.json({
          source: "tmdb",
          results: normalizeTMDBSearchResults(data),
        });
      }
    }

    return res.status(503).json({
      error: "Discover unavailable.",
      results: [],
    });
  } catch (error) {
    console.error("DISCOVER ERROR:", error);
    res.status(500).json({ error: error.message, results: [] });
  }
});

// ------------------------------------------------------------
// CATEGORY MOVIES (for Category.jsx)
// ------------------------------------------------------------
app.get("/api/movies/category/:subcategory", async (req, res) => {
  try {
    const sub = (req.params.subcategory || "").toLowerCase();
    const genreId = TMDB_GENRES[sub];

    if (hasTMDB() && genreId) {
      const response = await tmdbRequest(
        `/discover/movie?with_genres=${genreId}&sort_by=popularity.desc&include_adult=false&language=en-US`
      );

      if (response.ok) {
        const data = await response.json();
        const movies = (data.results || []).map((m) => ({
          id: m.id,
          title: m.title || "Untitled",
          year: m.release_date?.slice(0, 4) || "",
          rating: m.vote_average ? Number(m.vote_average).toFixed(1) : "—",
          image: m.poster_path ? `/api/image/w500${m.poster_path}` : null,
        }));

        return res.json({
          movies,
          totalResults: data.total_results || movies.length,
        });
      }
    }

    return res.status(503).json({
      error: "Category unavailable.",
      movies: [],
      totalResults: 0,
    });
  } catch (error) {
    console.error("CATEGORY ERROR:", error);
    res.status(500).json({ error: error.message, movies: [], totalResults: 0 });
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

app.get(["/api/movie/:id", "/api/tv/:id", "/api/title/:id"], async (req, res) => {
  const movieId = String(req.params.id || "").trim();

  if (!movieId) {
    return res.status(400).json({
      error: "Movie ID is required.",
    });
  }

  // Extract trailing numeric/IMDb ID from slug (e.g. "the-dark-knight-155" -> "155")
  const trailingMatch = movieId.match(/-(\d+|tt\d+)$/i);
  const effectiveId = trailingMatch ? trailingMatch[1] : movieId;
  const wantsTv = req.path.startsWith("/api/tv") || req.query.type === "tv" || isKnownTvShow(effectiveId);

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

  const isIMDbId = /^tt\d+$/i.test(effectiveId);

  if (isIMDbId) {
    // --------------------------------------------------------
    // Try OMDb
    // --------------------------------------------------------

    if (hasOMDb()) {
      try {
        console.log(`OMDb movie request: ${effectiveId}`);

        const response = await omdbRequest({
          i: effectiveId,
          plot: "full",
        });

        const data = await response.json();

        // Successful OMDb response
        if (data.Response === "True") {
          // If TMDB is available, enrich with trailers (videos), credits, and backdrops
          if (hasTMDB()) {
            try {
              let tmdbId = null;
              const findRes = await tmdbRequest(`/find/${encodeURIComponent(data.imdbID || effectiveId)}?external_source=imdb_id`);
              if (findRes.ok) {
                const findJson = await findRes.json();
                if (Array.isArray(findJson.movie_results) && findJson.movie_results.length > 0) {
                  tmdbId = findJson.movie_results[0].id;
                }
              }

              if (!tmdbId && data.Title) {
                const searchRes = await tmdbRequest(`/search/movie?query=${encodeURIComponent(data.Title)}&language=en-US`);
                if (searchRes.ok) {
                  const searchJson = await searchRes.json();
                  if (Array.isArray(searchJson.results) && searchJson.results.length > 0) {
                    tmdbId = searchJson.results[0].id;
                  }
                }
              }

              if (tmdbId) {
                const detailsRes = await tmdbRequest(`/movie/${tmdbId}?append_to_response=credits,videos,recommendations,watch/providers&language=en-US`);
                if (detailsRes.ok) {
                  const tmdbData = await detailsRes.json();
                  return res.json({
                    ...tmdbData,
                    ...data,
                    videos: tmdbData.videos || null,
                    credits: tmdbData.credits || null,
                    watch_providers: tmdbData["watch/providers"] || tmdbData.watch_providers || null,
                    backdrop_path: tmdbData.backdrop_path || null,
                    poster_path: tmdbData.poster_path || null,
                    tmdbID: tmdbData.id,
                    id: data.imdbID || tmdbData.id,
                    source: "omdb+tmdb",
                  });
                }
              }
            } catch (enrichErr) {
              console.warn("Could not enrich OMDb movie with TMDB details:", enrichErr.message);
            }
          }

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

        try {
          const fullRes = await tmdbRequest(
            `/movie/${movie.id}?append_to_response=credits,videos,recommendations,watch/providers&language=en-US`
          );
          if (fullRes.ok) {
            const detailed = await fullRes.json();
            return res.json({
              ...detailed,
              source: "tmdb",
              imdbID: movieId,
              id: detailed.id,
              watch_providers: detailed["watch/providers"] || detailed.watch_providers || null,
            });
          }
        } catch (detailErr) {
          console.warn("TMDB full detail lookup failed:", detailErr.message);
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

  if (/^\d+$/.test(effectiveId)) {
    if (!hasTMDB()) {
      return res.status(500).json({
        error:
          "TMDB_TOKEN is missing from .env. Cannot load numeric TMDB ID.",
      });
    }

    try {
      console.log(`TMDB request: ${effectiveId} (wantsTv: ${wantsTv})`);

      const primaryEndpoint = wantsTv ? "tv" : "movie";
      const fallbackEndpoint = wantsTv ? "movie" : "tv";

      let isTv = wantsTv;
      let response = await tmdbRequest(
        `/${primaryEndpoint}/${encodeURIComponent(
          effectiveId
        )}?append_to_response=credits,videos,recommendations,watch/providers&language=en-US`
      );

      // If not found in primary endpoint, try the other endpoint
      if (!response.ok && response.status === 404) {
        console.log(`TMDB item not found on /${primaryEndpoint}/${effectiveId}, trying /${fallbackEndpoint}...`);
        const fallbackRes = await tmdbRequest(
          `/${fallbackEndpoint}/${encodeURIComponent(
            effectiveId
          )}?append_to_response=credits,videos,recommendations,watch/providers&language=en-US`
        );
        if (fallbackRes.ok) {
          response = fallbackRes;
          isTv = !wantsTv;
        }
      }

      if (!response.ok) {
        const body = await response.text();

        console.error(
          `TMDB item failed: ${response.status}`,
          body
        );

        return res.status(response.status).json({
          error: "Failed to get title details from TMDB.",
        });
      }

      const data = await response.json();

      return res.json({
        ...data,
        title: data.name || data.title || data.original_name || data.original_title,
        release_date: data.first_air_date || data.release_date,
        runtime: Array.isArray(data.episode_run_time) && data.episode_run_time.length > 0
          ? `${data.episode_run_time[0]}m`
          : data.runtime || "45m",
        source: "tmdb",
        media_type: isTv ? "tv" : "movie",
        tmdbID: data.id,
        watch_providers: data["watch/providers"] || data.watch_providers || null,
      });
    } catch (error) {
      console.error(
        `TMDB ITEM ERROR (${effectiveId}):`,
        error.message
      );

      return res.status(500).json({
        error: "Failed to get title details.",
        details: error.message,
      });
    }
  }

  // ==========================================================
  // Slug / Title Search Fallback (e.g. /api/movie/the-dark-knight)
  // ==========================================================
  if (hasTMDB() || hasOMDb()) {
    try {
      const searchTitle = effectiveId.replace(/-/g, " ");
      console.log(`Searching title fallback for slug: "${searchTitle}"`);
      if (hasTMDB()) {
        const searchRes = await tmdbRequest(`/search/multi?query=${encodeURIComponent(searchTitle)}&language=en-US`);
        if (searchRes.ok) {
          const searchData = await searchRes.json();
          if (Array.isArray(searchData.results) && searchData.results.length > 0) {
            const topMatch =
              searchData.results.find((r) => r.media_type === "movie" || r.media_type === "tv") ||
              searchData.results[0];
            const endpoint = topMatch.media_type === "tv" ? "tv" : "movie";
            const detailsRes = await tmdbRequest(`/${endpoint}/${topMatch.id}?append_to_response=credits,videos,recommendations,watch/providers&language=en-US`);
            if (detailsRes.ok) {
              const details = await detailsRes.json();
              return res.json({
                ...details,
                title: details.name || details.title || details.original_name,
                release_date: details.first_air_date || details.release_date,
                runtime: Array.isArray(details.episode_run_time) && details.episode_run_time.length > 0
                  ? `${details.episode_run_time[0]}m`
                  : details.runtime || "45m",
                source: "tmdb",
                media_type: endpoint,
                tmdbID: details.id,
                watch_providers: details["watch/providers"] || details.watch_providers || null,
              });
            }
          }
        }
      }
      if (hasOMDb()) {
        const omdbRes = await omdbRequest({ t: searchTitle, plot: "full" });
        const omdbData = await omdbRes.json();
        if (omdbData.Response === "True") {
          return res.json({
            ...omdbData,
            source: "omdb",
            id: omdbData.imdbID,
          });
        }
      }
    } catch (slugErr) {
      console.error("Slug fallback error:", slugErr);
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
// IGDB / TWITCH OAUTH & GAMING API
// ============================================================

const IGDB_CLIENT_ID = process.env.IGDB_CLIENT_ID;
const IGDB_CLIENT_SECRET = process.env.IGDB_CLIENT_SECRET;
const IGDB_BASE_URL = "https://api.igdb.com/v4";

let igdbToken = null;
let igdbTokenExpiresAt = 0;

async function getIGDBToken() {
  if (!IGDB_CLIENT_ID || !IGDB_CLIENT_SECRET) {
    throw new Error("IGDB credentials missing. Please set IGDB_CLIENT_ID and IGDB_CLIENT_SECRET in .env");
  }

  const now = Date.now();
  if (igdbToken && now < igdbTokenExpiresAt - 60000) {
    return igdbToken;
  }

  const tokenUrl = `https://id.twitch.tv/oauth2/token?client_id=${encodeURIComponent(
    IGDB_CLIENT_ID
  )}&client_secret=${encodeURIComponent(
    IGDB_CLIENT_SECRET
  )}&grant_type=client_credentials`;

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Twitch OAuth failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  igdbToken = data.access_token;
  igdbTokenExpiresAt = now + (data.expires_in || 3600) * 1000;
  return igdbToken;
}

async function igdbRequest(endpoint, bodyQuery) {
  const token = await getIGDBToken();

  const response = await fetch(`${IGDB_BASE_URL}/${endpoint}`, {
    method: "POST",
    headers: {
      "Client-ID": IGDB_CLIENT_ID,
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json",
      "Content-Type": "text/plain",
    },
    body: bodyQuery,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`IGDB query failed (${response.status}): ${errorText}`);
  }

  return await response.json();
}

function formatGameCover(imageId, size = "cover_big") {
  if (!imageId) return null;
  return `https://images.igdb.com/igdb/image/upload/t_${size}/${imageId}.jpg`;
}

function formatGameCard(g) {
  return {
    id: g.id,
    name: g.name,
    title: g.name,
    media_type: "game",
    cover: formatGameCover(g.cover?.image_id, "cover_big"),
    cover_small: formatGameCover(g.cover?.image_id, "cover_small"),
    image: formatGameCover(g.cover?.image_id, "cover_big"),
    release_date: g.first_release_date
      ? new Date(g.first_release_date * 1000).toISOString().split("T")[0]
      : null,
    year: g.first_release_date
      ? new Date(g.first_release_date * 1000).getFullYear()
      : null,
    rating: g.rating ? (g.rating / 10).toFixed(1) : (g.total_rating ? (g.total_rating / 10).toFixed(1) : null),
    platforms: Array.isArray(g.platforms) ? g.platforms.map((p) => p.name) : [],
    genres: Array.isArray(g.genres) ? g.genres.map((gen) => gen.name) : [],
    summary: g.summary || "",
    slug: g.slug || String(g.id),
  };
}

// 1. Search games: GET /api/search/game?q=GAME_NAME
app.get("/api/search/game", async (req, res) => {
  try {
    const query = String(req.query.q || req.query.query || "").trim();
    if (!query) {
      return res.json({ results: [] });
    }

    const sanitized = query.replace(/["\\]/g, "");
    const body = `search "${sanitized}"; fields id,name,cover.image_id,first_release_date,rating,total_rating,platforms.name,genres.name,summary,slug; limit 24;`;
    const data = await igdbRequest("games", body);

    res.json({
      results: Array.isArray(data) ? data.map(formatGameCard) : [],
    });
  } catch (error) {
    console.error("IGDB SEARCH ERROR:", error);
    res.status(500).json({ error: error.message || "Failed to search games." });
  }
});

// 2. Popular games: GET /api/games/popular
app.get("/api/games/popular", async (req, res) => {
  try {
    const body = `fields id,name,cover.image_id,first_release_date,rating,total_rating_count,total_rating,platforms.name,genres.name,summary,slug; sort total_rating_count desc; where total_rating_count > 30 & cover != null; limit 24;`;
    const data = await igdbRequest("games", body);
    res.json({
      results: Array.isArray(data) ? data.map(formatGameCard) : [],
    });
  } catch (error) {
    console.error("IGDB POPULAR ERROR:", error);
    res.status(500).json({ error: error.message || "Failed to fetch popular games." });
  }
});

// 3. Upcoming games: GET /api/games/upcoming
app.get("/api/games/upcoming", async (req, res) => {
  try {
    const now = Math.floor(Date.now() / 1000);
    const body = `fields id,name,cover.image_id,first_release_date,platforms.name,genres.name,summary,slug,hypes; where first_release_date > ${now} & cover != null; sort first_release_date asc; limit 24;`;
    const data = await igdbRequest("games", body);
    res.json({
      results: Array.isArray(data) ? data.map(formatGameCard) : [],
    });
  } catch (error) {
    console.error("IGDB UPCOMING ERROR:", error);
    res.status(500).json({ error: error.message || "Failed to fetch upcoming games." });
  }
});

// 4. Trending games: GET /api/games/trending
app.get("/api/games/trending", async (req, res) => {
  try {
    const now = Math.floor(Date.now() / 1000);
    const body = `fields id,name,cover.image_id,first_release_date,rating,total_rating_count,total_rating,hypes,platforms.name,genres.name,summary,slug; where first_release_date < ${now} & hypes != null & cover != null; sort hypes desc; limit 24;`;
    const data = await igdbRequest("games", body);
    res.json({
      results: Array.isArray(data) ? data.map(formatGameCard) : [],
    });
  } catch (error) {
    console.error("IGDB TRENDING ERROR:", error);
    res.status(500).json({ error: error.message || "Failed to fetch trending games." });
  }
});

// 5. Game details: GET /api/game/:id
app.get("/api/game/:id", async (req, res) => {
  try {
    const rawId = String(req.params.id || "").trim();
    const match = rawId.match(/(\d+)$/);
    const gameId = match ? match[1] : rawId;

    if (!gameId || isNaN(Number(gameId))) {
      return res.status(400).json({ error: "Invalid game ID." });
    }

    const body = `where id = ${gameId}; fields id,name,summary,storyline,cover.image_id,screenshots.image_id,artworks.image_id,rating,aggregated_rating,genres.name,platforms.name,first_release_date,involved_companies.company.name,involved_companies.developer,involved_companies.publisher,game_modes.name,websites.url,websites.category,slug,videos.video_id;`;
    const data = await igdbRequest("games", body);

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(404).json({ error: "Game not found." });
    }

    const g = data[0];
    const developers = [];
    const publishers = [];
    if (Array.isArray(g.involved_companies)) {
      for (const comp of g.involved_companies) {
        const name = comp.company?.name;
        if (name) {
          if (comp.developer && !developers.includes(name)) developers.push(name);
          if (comp.publisher && !publishers.includes(name)) publishers.push(name);
        }
      }
    }

    const categoryNames = {
      1: "Official Website",
      2: "Wikia",
      3: "Wikipedia",
      4: "Facebook",
      5: "Twitter / X",
      6: "Twitch",
      8: "Instagram",
      9: "YouTube",
      10: "iPhone / App Store",
      11: "iPad",
      12: "Android / Google Play",
      13: "Steam",
      14: "Reddit",
      15: "Discord",
      16: "Google Plus",
      17: "Tumblr",
      18: "LinkedIn",
      19: "Pinterest",
      20: "SoundCloud",
    };

    const websites = Array.isArray(g.websites)
      ? g.websites.map((w) => ({
          url: w.url,
          category: categoryNames[w.category] || "Website",
        }))
      : [];

    const screenshots = Array.isArray(g.screenshots)
      ? g.screenshots.map((s) => ({
          thumb: `https://images.igdb.com/igdb/image/upload/t_screenshot_med/${s.image_id}.jpg`,
          big: `https://images.igdb.com/igdb/image/upload/t_screenshot_big/${s.image_id}.jpg`,
          huge: `https://images.igdb.com/igdb/image/upload/t_1080p/${s.image_id}.jpg`,
        }))
      : [];

    const artworks = Array.isArray(g.artworks)
      ? g.artworks.map((a) => ({
          big: `https://images.igdb.com/igdb/image/upload/t_1080p/${a.image_id}.jpg`,
        }))
      : [];

    const videos = Array.isArray(g.videos)
      ? g.videos.map((v) => v.video_id)
      : [];

    const result = {
      id: g.id,
      name: g.name,
      title: g.name,
      media_type: "game",
      summary: g.summary || "",
      storyline: g.storyline || "",
      cover: formatGameCover(g.cover?.image_id, "cover_big_2x") || formatGameCover(g.cover?.image_id, "cover_big"),
      cover_small: formatGameCover(g.cover?.image_id, "cover_small"),
      backdrop: artworks[0]?.big || screenshots[0]?.huge || formatGameCover(g.cover?.image_id, "1080p"),
      screenshots,
      artworks,
      rating: g.rating ? (g.rating / 10).toFixed(1) : null,
      aggregated_rating: g.aggregated_rating ? (g.aggregated_rating / 10).toFixed(1) : null,
      genres: Array.isArray(g.genres) ? g.genres.map((gen) => gen.name) : [],
      platforms: Array.isArray(g.platforms) ? g.platforms.map((p) => p.name) : [],
      release_date: g.first_release_date
        ? new Date(g.first_release_date * 1000).toISOString().split("T")[0]
        : null,
      year: g.first_release_date
        ? new Date(g.first_release_date * 1000).getFullYear()
        : null,
      developers,
      publishers,
      game_modes: Array.isArray(g.game_modes) ? g.game_modes.map((gm) => gm.name) : [],
      websites,
      videos,
      slug: g.slug || String(g.id),
    };

    res.json(result);
  } catch (error) {
    console.error("IGDB GAME DETAILS ERROR:", error);
    res.status(500).json({ error: error.message || "Failed to fetch game details." });
  }
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

    // Gracefully handle TMDB paths accidentally routed to OMDb proxy
    if (imageUrl.startsWith("/api/image/")) {
      return res.redirect(imageUrl);
    }
    if (imageUrl.startsWith("/") && !imageUrl.startsWith("//")) {
      return res.redirect(`/api/image/w500${imageUrl}`);
    }

    let parsedUrl;

    try {
      parsedUrl = new URL(imageUrl);
    } catch {
      return res.status(400).json({
        error: "Invalid poster URL.",
      });
    }

    // Gracefully handle full TMDB URLs
    if (parsedUrl.hostname === "image.tmdb.org") {
      const cleanPath = parsedUrl.pathname.replace(/^\/t\/p\/(w\d+|original)?\/?/, "/");
      return res.redirect(`/api/image/w500${cleanPath.startsWith("/") ? cleanPath : "/" + cleanPath}`);
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

// ============================================================
// START SERVER
// ============================================================

function startServer(port = PORT) {
  return app.listen(port, () => {
    console.log(`Vouch API server running on http://localhost:${port}`);
    console.log(`OMDb: ${hasOMDb() ? "configured" : "NOT configured"}`);
    console.log(`TMDB: ${hasTMDB() ? "configured" : "NOT configured"}`);
  });
}

// Start normally during local development (unless running as serverless function on Vercel)
const isVercelServerless = Boolean(process.env.VERCEL || process.env.NOW_REGION);
if (!isVercelServerless && require.main === module) {
  startServer();
}

app.startServer = startServer;
module.exports = app;