const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const IGDB_BASE_URL = "https://api.igdb.com/v4";

let cachedTwitchToken = null;
let twitchTokenExpiry = 0;

async function getTwitchToken(env) {
  const clientId = env.IGDB_CLIENT_ID;
  const clientSecret = env.IGDB_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("IGDB_CLIENT_ID or IGDB_CLIENT_SECRET is missing.");
  }

  const now = Date.now();
  if (cachedTwitchToken && now < twitchTokenExpiry - 60000) {
    return cachedTwitchToken;
  }

  const tokenUrl = `https://id.twitch.tv/oauth2/token?client_id=${encodeURIComponent(
    clientId
  )}&client_secret=${encodeURIComponent(
    clientSecret
  )}&grant_type=client_credentials`;

  const res = await fetch(tokenUrl, { method: "POST", headers: { Accept: "application/json" } });
  if (!res.ok) {
    throw new Error(`Failed to obtain Twitch token (${res.status})`);
  }
  const data = await res.json();
  cachedTwitchToken = data.access_token;
  twitchTokenExpiry = now + (data.expires_in || 3600) * 1000;
  return cachedTwitchToken;
}

async function igdbRequest(endpoint, query, env) {
  const token = await getTwitchToken(env);
  const res = await fetch(`${IGDB_BASE_URL}/${endpoint}`, {
    method: "POST",
    headers: {
      "Client-ID": env.IGDB_CLIENT_ID,
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json",
      "Content-Type": "text/plain",
    },
    body: query,
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`IGDB error ${res.status}: ${txt}`);
  }
  return await res.json();
}

function formatGameCard(g) {
  const coverUrl = g.cover?.image_id ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${g.cover.image_id}.jpg` : null;
  return {
    id: g.id,
    name: g.name,
    title: g.name,
    media_type: "game",
    cover: coverUrl,
    image: coverUrl,
    release_date: g.first_release_date ? new Date(g.first_release_date * 1000).toISOString().split("T")[0] : null,
    year: g.first_release_date ? new Date(g.first_release_date * 1000).getFullYear() : null,
    rating: g.rating ? (g.rating / 10).toFixed(1) : (g.total_rating ? (g.total_rating / 10).toFixed(1) : null),
    platforms: Array.isArray(g.platforms) ? g.platforms.map((p) => p.name) : [],
    genres: Array.isArray(g.genres) ? g.genres.map((gen) => gen.name) : [],
    summary: g.summary || "",
    slug: g.slug || String(g.id),
  };
}

async function tmdbRequest(path, env) {
  if (!env.TMDB_TOKEN) {
    return Response.json(
      { error: "TMDB_TOKEN is not configured on the deployed API." },
      { status: 500 }
    );
  }

  const response = await fetch(`${TMDB_BASE_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${env.TMDB_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  const body = await response.text();

  return new Response(body, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("Content-Type") || "application/json",
      "Cache-Control": "public, max-age=300",
    },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return Response.json({
        status: "ok",
        service: "vouch-api",
      });
    }

    const imageMatch = url.pathname.match(/^\/api\/image\/(w45|w92|w154|w185|w300|w342|w500|w780|w1280|original)(\/.*)$/);

    if (imageMatch) {
      const [, size, imagePath] = imageMatch;
      const response = await fetch(`https://image.tmdb.org/t/p/${size}${imagePath}`);

      return new Response(response.body, {
        status: response.status,
        headers: {
          "Content-Type": response.headers.get("Content-Type") || "image/jpeg",
          "Cache-Control": "public, max-age=86400, immutable",
        },
      });
    }

    if (url.pathname === "/api/search/movie") {
      const query = url.searchParams.get("query")?.trim();

      if (!query) {
        return Response.json(
          { error: "Query is required." },
          { status: 400 }
        );
      }

      const params = new URLSearchParams({
        query,
        include_adult: "false",
        language: "en-US",
      });

      return tmdbRequest(`/search/movie?${params.toString()}`, env);
    }

    if (url.pathname === "/api/movies/trending") {
      const timeWindow = url.searchParams.get("timeWindow") === "day" ? "day" : "week";
      return tmdbRequest(`/trending/movie/${timeWindow}`, env);
    }

    if (url.pathname === "/api/movies/new-releases") {
      const page = url.searchParams.get("page") || "1";
      return tmdbRequest(`/movie/now_playing?language=en-US&page=${page}`, env);
    }

    if (url.pathname === "/api/movies/discover") {
      const genre = url.searchParams.get("genre");
      const sortBy = url.searchParams.get("sortBy") || "popularity.desc";
      const page = url.searchParams.get("page") || "1";
      const params = new URLSearchParams({
        include_adult: "false",
        language: "en-US",
        page,
        sort_by: sortBy,
      });
      if (genre) params.append("with_genres", genre);
      return tmdbRequest(`/discover/movie?${params.toString()}`, env);
    }

    const movieMatch = url.pathname.match(/^\/api\/movie\/(\d+)$/);

    if (movieMatch) {
      const movieId = movieMatch[1];
      return tmdbRequest(`/movie/${movieId}?append_to_response=credits`, env);
    }

    if (url.pathname === "/api/search/game") {
      try {
        const q = (url.searchParams.get("q") || url.searchParams.get("query") || "").trim().replace(/["\\]/g, "");
        if (!q) return Response.json({ results: [] });
        const body = `search "${q}"; fields id,name,cover.image_id,first_release_date,rating,total_rating,platforms.name,genres.name,summary,slug; limit 24;`;
        const data = await igdbRequest("games", body, env);
        return Response.json({ results: Array.isArray(data) ? data.map(formatGameCard) : [] });
      } catch (err) {
        return Response.json({ error: err.message }, { status: 500 });
      }
    }

    if (url.pathname === "/api/games/popular") {
      try {
        const body = `fields id,name,cover.image_id,first_release_date,rating,total_rating_count,total_rating,platforms.name,genres.name,summary,slug; sort total_rating_count desc; where total_rating_count > 30 & cover != null; limit 24;`;
        const data = await igdbRequest("games", body, env);
        return Response.json({ results: Array.isArray(data) ? data.map(formatGameCard) : [] });
      } catch (err) {
        return Response.json({ error: err.message }, { status: 500 });
      }
    }

    if (url.pathname === "/api/games/upcoming") {
      try {
        const now = Math.floor(Date.now() / 1000);
        const body = `fields id,name,cover.image_id,first_release_date,platforms.name,genres.name,summary,slug,hypes; where first_release_date > ${now} & cover != null; sort first_release_date asc; limit 24;`;
        const data = await igdbRequest("games", body, env);
        return Response.json({ results: Array.isArray(data) ? data.map(formatGameCard) : [] });
      } catch (err) {
        return Response.json({ error: err.message }, { status: 500 });
      }
    }

    if (url.pathname === "/api/games/trending") {
      try {
        const now = Math.floor(Date.now() / 1000);
        const body = `fields id,name,cover.image_id,first_release_date,rating,total_rating_count,total_rating,hypes,platforms.name,genres.name,summary,slug; where first_release_date < ${now} & hypes != null & cover != null; sort hypes desc; limit 24;`;
        const data = await igdbRequest("games", body, env);
        return Response.json({ results: Array.isArray(data) ? data.map(formatGameCard) : [] });
      } catch (err) {
        return Response.json({ error: err.message }, { status: 500 });
      }
    }

    const gameMatch = url.pathname.match(/^\/api\/game\/(\d+)$/);
    if (gameMatch) {
      try {
        const gameId = gameMatch[1];
        const body = `where id = ${gameId}; fields id,name,summary,storyline,cover.image_id,screenshots.image_id,artworks.image_id,rating,aggregated_rating,genres.name,platforms.name,first_release_date,involved_companies.company.name,involved_companies.developer,involved_companies.publisher,game_modes.name,websites.url,websites.category,slug,videos.video_id;`;
        const data = await igdbRequest("games", body, env);
        if (!Array.isArray(data) || data.length === 0) return Response.json({ error: "Game not found." }, { status: 404 });
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
        const screenshots = Array.isArray(g.screenshots)
          ? g.screenshots.map((s) => ({
              big: `https://images.igdb.com/igdb/image/upload/t_screenshot_big/${s.image_id}.jpg`,
              huge: `https://images.igdb.com/igdb/image/upload/t_1080p/${s.image_id}.jpg`,
            }))
          : [];
        const artworks = Array.isArray(g.artworks)
          ? g.artworks.map((a) => ({ big: `https://images.igdb.com/igdb/image/upload/t_1080p/${a.image_id}.jpg` }))
          : [];
        const result = {
          id: g.id,
          name: g.name,
          title: g.name,
          media_type: "game",
          summary: g.summary || "",
          storyline: g.storyline || "",
          cover: g.cover?.image_id ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${g.cover.image_id}.jpg` : null,
          backdrop: artworks[0]?.big || screenshots[0]?.huge || null,
          screenshots,
          artworks,
          rating: g.rating ? (g.rating / 10).toFixed(1) : null,
          aggregated_rating: g.aggregated_rating ? (g.aggregated_rating / 10).toFixed(1) : null,
          genres: Array.isArray(g.genres) ? g.genres.map((gen) => gen.name) : [],
          platforms: Array.isArray(g.platforms) ? g.platforms.map((p) => p.name) : [],
          release_date: g.first_release_date ? new Date(g.first_release_date * 1000).toISOString().split("T")[0] : null,
          year: g.first_release_date ? new Date(g.first_release_date * 1000).getFullYear() : null,
          developers,
          publishers,
          game_modes: Array.isArray(g.game_modes) ? g.game_modes.map((gm) => gm.name) : [],
          websites: Array.isArray(g.websites) ? g.websites.map((w) => ({ url: w.url, category: "Website" })) : [],
          videos: Array.isArray(g.videos) ? g.videos.map((v) => v.video_id) : [],
          slug: g.slug || String(g.id),
        };
        return Response.json(result);
      } catch (err) {
        return Response.json({ error: err.message }, { status: 500 });
      }
    }

    return new Response(null, { status: 404 });
  },
};
