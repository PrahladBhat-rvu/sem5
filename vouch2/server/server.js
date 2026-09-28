const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p";

function getHeaders() {
  return {
    Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
    "Content-Type": "application/json",
  };
}

async function tmdbRequest(path) {
  if (!process.env.TMDB_TOKEN) {
    throw new Error("TMDB_TOKEN is missing from .env");
  }

  return fetch(`${TMDB_BASE_URL}${path}`, {
    headers: getHeaders(),
  });
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "vouch-api" });
});

app.get("/api/search/movie", async (req, res) => {
  try {
    const query = String(req.query.query || "").trim();

    if (!query) {
      return res.status(400).json({ error: "Query is required." });
    }

    const response = await tmdbRequest(
      `/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US`
    );

    const body = await response.text();

    res.status(response.status).type("application/json").send(body);
  } catch (error) {
    console.error("TMDB SEARCH ERROR:", error);
    res.status(500).json({
      error: "Failed to search TMDB",
      details: error.message,
    });
  }
});

app.get("/api/movie/:id", async (req, res) => {
  try {
    const movieId = encodeURIComponent(req.params.id);
    const response = await tmdbRequest(
      `/movie/${movieId}?append_to_response=credits&language=en-US`
    );

    const body = await response.text();

    res.status(response.status).type("application/json").send(body);
  } catch (error) {
    console.error("TMDB MOVIE ERROR:", error);
    res.status(500).json({
      error: "Failed to get movie details",
      details: error.message,
    });
  }
});

app.get(/^\/api\/image\/([^/]+)\/(.+)$/, async (req, res) => {
  try {
    const size = req.params[0];
    const imagePath = req.params[1];
    const allowedSizes = new Set([
      "w45", "w92", "w154", "w185", "w300", "w342",
      "w500", "w780", "w1280", "original",
    ]);

    if (!allowedSizes.has(size) || !imagePath) {
      return res.status(400).json({ error: "Invalid image request." });
    }

    const response = await fetch(
      `${TMDB_IMAGE_URL}/${size}/${imagePath}`
    );

    if (!response.ok) {
      return res.status(response.status).end();
    }

    res.setHeader(
      "Content-Type",
      response.headers.get("Content-Type") || "image/jpeg"
    );
    res.setHeader("Cache-Control", "public, max-age=86400");

    response.body.pipeTo(
      new WritableStream({
        write(chunk) {
          res.write(Buffer.from(chunk));
        },
        close() {
          res.end();
        },
        abort() {
          res.end();
        },
      })
    ).catch(() => res.end());
  } catch (error) {
    console.error("TMDB IMAGE ERROR:", error);
    res.status(500).end();
  }
});

app.get("/", (req, res) => {
  res.send("Vouch API server is running");
});

app.listen(PORT, () => {
  console.log(`Vouch API server running on http://localhost:${PORT}`);
});
