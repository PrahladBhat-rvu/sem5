
const express = require("express");
const { randomUUID } = require("crypto");
const { requireSupabaseUser } = require("./auth");

const router = express.Router();

const SUPABASE_URL = (
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || ""
).replace(/\/+$/, "");

const SUPABASE_KEY =
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY;

function headers(token) {
  return {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${token || SUPABASE_KEY}`,
    "Content-Type": "application/json",
  };
}

function formatReview(row) {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.profiles?.display_name || row.profiles?.username || "Cinephile",
    movieId: row.movie_id,
    movieTitle: row.movie_title,
    rating: row.rating,
    title: row.title || `${row.rating}-Star Vouch`,
    text: row.review_text,
    likes: 0,
    verified: false,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function attachProfileNames(rows, token) {
  if (!rows.length) return rows;

  const userIds = [...new Set(rows.map((row) => row.user_id).filter(Boolean))];

  if (!userIds.length) return rows;

  const query = new URLSearchParams({
    select: "id,username,display_name",
    id: `in.(${userIds.join(",")})`,
  });

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles?${query}`,
    { headers: headers(token) }
  );

  if (!response.ok) {
    console.error("Could not fetch review authors:", await response.text());
    return rows;
  }

  const profiles = await response.json();
  const profileMap = new Map(profiles.map((profile) => [profile.id, profile]));

  return rows.map((row) => ({
    ...row,
    profiles: profileMap.get(row.user_id) || null,
  }));
}

function databaseError(result) {
  return result.message || result.details || result.hint || "Supabase request failed";
}

// GET REVIEWS (public; optionally filter by movie)
router.get("/", async (req, res) => {
  try {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return res.status(503).json({ success: false, error: "Supabase is not configured" });
    }

    const query = new URLSearchParams({
      select: "*",
      order: "created_at.desc",
    });

    if (req.query.movieId) {
      query.set("movie_id", `eq.${req.query.movieId}`);
    }

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/movie_reviews?${query}`,
      { headers: headers(req.headers.authorization?.replace(/^Bearer /, "")) }
    );

    const result = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: databaseError(result),
      });
    }

    const token = req.headers.authorization?.replace(/^Bearer /, "");
const enrichedRows = await attachProfileNames(result, token);
const reviews = enrichedRows.map(formatReview);

return res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    console.error("Get reviews error:", error);
    return res.status(500).json({ success: false, error: "Could not retrieve reviews" });
  }
});

// GET ONE REVIEW
router.get("/:id", async (req, res) => {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/movie_reviews?id=eq.${encodeURIComponent(req.params.id)}&select=*`,
      { headers: headers(req.headers.authorization?.replace(/^Bearer /, "")) }
    );

    const result = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ success: false, error: databaseError(result) });
    }

    if (!result.length) {
      return res.status(404).json({ success: false, error: "Review not found" });
    }

    return res.json({ success: true, review: formatReview(result[0]) });
  } catch (error) {
    console.error("Get review error:", error);
    return res.status(500).json({ success: false, error: "Could not retrieve review" });
  }
});

// CREATE REVIEW
router.post("/", requireSupabaseUser, async (req, res) => {
  try {
    const { movieId, movieTitle, rating, title, text } = req.body;

    if (!movieId || !movieTitle || !text?.trim()) {
      return res.status(400).json({
        success: false,
        error: "movieId, movieTitle and review text are required",
      });
    }

    const numericRating = Number(rating);
    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        success: false,
        error: "Rating must be an integer between 1 and 5",
      });
    }

    const payload = {
      id: randomUUID(),
      user_id: req.user.id,
      movie_id: String(movieId),
      movie_title: String(movieTitle),
      rating: numericRating,
      title: title?.trim() || `${numericRating}-Star Vouch`,
      review_text: text.trim(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const response = await fetch(`${SUPABASE_URL}/rest/v1/movie_reviews`, {
      method: "POST",
      headers: {
        ...headers(req.accessToken),
        Prefer: "return=representation",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ success: false, error: databaseError(result) });
    }

    const enrichedRows = await attachProfileNames([result[0]], req.accessToken);

return res.status(201).json({
  success: true,
  review: formatReview(enrichedRows[0]),
});
  } catch (error) {
    console.error("Create review error:", error);
    return res.status(500).json({ success: false, error: "Could not create review" });
  }
});

// UPDATE OWN REVIEW
router.put("/:id", requireSupabaseUser, async (req, res) => {
  try {
    const { rating, title, text } = req.body;
    const updates = { updated_at: new Date().toISOString() };

    if (rating !== undefined) {
      const numericRating = Number(rating);
      if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
        return res.status(400).json({ success: false, error: "Rating must be between 1 and 5" });
      }
      updates.rating = numericRating;
    }

    if (title !== undefined) updates.title = String(title).trim();

    if (text !== undefined) {
      if (!String(text).trim()) {
        return res.status(400).json({ success: false, error: "Review text cannot be empty" });
      }
      updates.review_text = String(text).trim();
    }

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/movie_reviews?id=eq.${encodeURIComponent(req.params.id)}&user_id=eq.${req.user.id}&select=*`,
      {
        method: "PATCH",
        headers: { ...headers(req.accessToken), Prefer: "return=representation" },
        body: JSON.stringify(updates),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ success: false, error: databaseError(result) });
    }

    if (!result.length) {
      return res.status(404).json({ success: false, error: "Review not found or not owned by you" });
    }

    return res.json({ success: true, review: formatReview(result[0]) });
  } catch (error) {
    console.error("Update review error:", error);
    return res.status(500).json({ success: false, error: "Could not update review" });
  }
});

// DELETE OWN REVIEW
router.delete("/:id", requireSupabaseUser, async (req, res) => {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/movie_reviews?id=eq.${encodeURIComponent(req.params.id)}&user_id=eq.${req.user.id}`,
      {
        method: "DELETE",
        headers: { ...headers(req.accessToken), Prefer: "return=representation" },
      }
    );

    if (!response.ok) {
      const result = await response.json();
      return res.status(response.status).json({ success: false, error: databaseError(result) });
    }

    const deleted = await response.json();

    if (!deleted.length) {
      return res.status(404).json({ success: false, error: "Review not found or not owned by you" });
    }

    return res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.error("Delete review error:", error);
    return res.status(500).json({ success: false, error: "Could not delete review" });
  }
});

module.exports = router;
