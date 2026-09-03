export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return Response.json({
        status: "ok",
        service: "vouch-api",
      });
    }

    return new Response("Not found", {
      status: 404,
    });
  },
};