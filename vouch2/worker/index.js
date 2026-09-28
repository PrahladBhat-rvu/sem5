const TMDB_BASE_URL = "https://api.themoviedb.org/3";

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

    const movieMatch = url.pathname.match(/^\/api\/movie\/(\d+)$/);

    if (movieMatch) {
      const movieId = movieMatch[1];
      return tmdbRequest(`/movie/${movieId}?append_to_response=credits`, env);
    }

    return new Response(null, { status: 404 });
  },
};
