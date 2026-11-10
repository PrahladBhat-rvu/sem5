
const express = require("express");

const router = express.Router();

const SUPABASE_URL = (
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  ""
).replace(/\/+$/, "");

const SUPABASE_KEY =
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY;

const DEMO_AUTH_ENABLED = process.env.DEMO_AUTH === "true";
const DEMO_TOKEN = "demo-jwt-token-rvu-123";

const DEMO_USER = {
  id: "demo-viewer-rvu",
  email: "viewer@vouch.media",
  user_metadata: {
    username: "demo_viewer",
    display_name: "Demo Viewer",
  },
};

async function requireSupabaseUser(req, res, next) {
  try {
    const authorization = req.headers.authorization || "";

    if (!authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Authentication token required",
      });
    }

    const token = authorization.substring(7);

    // Local demonstration authentication
    if (DEMO_AUTH_ENABLED && token === DEMO_TOKEN) {
      req.user = DEMO_USER;
      req.accessToken = token;
      req.isDemoUser = true;
      return next();
    }

    // Real Supabase authentication
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return res.status(503).json({
        success: false,
        error: "Supabase authentication is not configured",
      });
    }

    const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return res.status(401).json({
        success: false,
        error: "Invalid or expired authentication token",
      });
    }

    const user = await response.json();

    if (!user.id) {
      return res.status(401).json({
        success: false,
        error: "Invalid user session",
      });
    }

    req.user = user;
    req.accessToken = token;
    req.isDemoUser = false;

    return next();

  } catch (error) {
    console.error("Authentication error:", error.message);

    return res.status(500).json({
      success: false,
      error: "Authentication verification failed",
    });
  }
}

// GET CURRENT AUTHENTICATED USER
router.get("/me", requireSupabaseUser, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user.id,
      email: req.user.email,
      user_metadata: req.user.user_metadata,
      authentication: req.isDemoUser ? "local-demo" : "supabase",
    },
  });
});

module.exports = router;
module.exports.requireSupabaseUser = requireSupabaseUser;
