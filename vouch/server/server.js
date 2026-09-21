const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const headers = {
  Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
  "Content-Type": "application/json",
};

app.get("/api/search/movie", async (req, res) => {
  try {
    const { query } = req.query;

    console.log("SEARCH:", query);
    console.log("TOKEN EXISTS:", !!process.env.TMDB_TOKEN);

    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&include_adult=false`,
      { headers }
    );

    console.log("TMDB STATUS:", response.status);

    if (!response.ok) {
      const errorText = await response.text();

      console.log("TMDB RESPONSE:", errorText);

      return res.status(response.status).json({
        error: `TMDB request failed: ${response.status}`,
        details: errorText,
      });
    }

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error("TMDB SEARCH ERROR:", error);

    res.status(500).json({
      error: "Failed to search TMDB",
      details: error.message,
    });
  }
});

app.get("/", (req, res) => {
  res.send("Vouch API server is running");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});