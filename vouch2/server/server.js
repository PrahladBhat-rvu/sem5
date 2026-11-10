const app = require("../backend/server");

// If executed directly (e.g. `cd server && node server.js`), start the server
if (require.main === module && !process.env.VERCEL && !process.env.NOW_REGION) {
  if (typeof app.startServer === "function") {
    app.startServer();
  }
}

module.exports = app;
