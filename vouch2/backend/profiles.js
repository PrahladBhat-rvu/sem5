
const express = require("express");
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
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

function databaseError(result) {
  return result.message || result.details || result.hint || "Supabase request failed";
}

// GET CURRENT USER PROFILE
router.get("/", requireSupabaseUser, async (req, res) => {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?id=eq.${encodeURIComponent(req.user.id)}&select=*`,
      { headers: headers(req.accessToken) }
    );

    const result = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: databaseError(result),
      });
    }

    if (!result.length) {
      return res.status(404).json({
        success: false,
        error: "Profile not found. Please contact support.",
      });
    }

    return res.json({ success: true, profile: result[0] });
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({ success: false, error: "Could not retrieve profile" });
  }
});

// UPDATE CURRENT USER PROFILE
router.put("/", requireSupabaseUser, async (req, res) => {
  try {
    const allowedFields = ["username", "display_name", "bio", "avatar_url"];
    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        if (typeof req.body[field] !== "string") {
          return res.status(400).json({
            success: false,
            error: `${field} must be text`,
          });
        }
        updates[field] = req.body[field].trim();
      }
    }

    if (!Object.keys(updates).length) {
      return res.status(400).json({
        success: false,
        error: "No supported profile fields provided",
      });
    }

    if (
      updates.username !== undefined &&
      !/^[a-zA-Z0-9_]{3,20}$/.test(updates.username)
    ) {
      return res.status(400).json({
        success: false,
        error: "Username must be 3-20 characters using letters, numbers or underscores",
      });
    }

    if (updates.display_name?.length > 40) {
      return res.status(400).json({
        success: false,
        error: "Display name must be 40 characters or fewer",
      });
    }

    if (updates.bio?.length > 300) {
      return res.status(400).json({
        success: false,
        error: "Bio must be 300 characters or fewer",
      });
    }

    if (updates.avatar_url?.length > 500) {
      return res.status(400).json({
        success: false,
        error: "Avatar URL is too long",
      });
    }

    updates.updated_at = new Date().toISOString();

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?id=eq.${encodeURIComponent(req.user.id)}&select=*`,
      {
        method: "PATCH",
        headers: {
          ...headers(req.accessToken),
          Prefer: "return=representation",
        },
        body: JSON.stringify(updates),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: databaseError(result),
      });
    }

    if (!result.length) {
      return res.status(404).json({
        success: false,
        error: "Profile not found",
      });
    }

    return res.json({
      success: true,
      message: "Profile updated successfully",
      profile: result[0],
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ success: false, error: "Could not update profile" });
  }
});

module.exports = router;
