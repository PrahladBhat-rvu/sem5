const express = require("express");

const app = express();

app.set("view engine", "ejs");

// Serve files from the public folder
app.use(express.static("public"));


// =========================
// GAME DATA
// =========================

const games = [
    {
        id: 1,
        title: "Call of Duty: Modern Warfare II",
        poster: "/images/mw2.jpg",
        genre: "First-Person Shooter",
        developer: "Infinity Ward",
        publisher: "Activision",
        releaseYear: 2022,

        platforms: [
            "PC",
            "PlayStation 4",
            "PlayStation 5",
            "Xbox One",
            "Xbox Series X|S"
        ],

        rating: 8.0,

        description:
            "Call of Duty: Modern Warfare II features a globe-spanning campaign, multiplayer combat and cooperative Special Ops missions.",

        modes: [
            "Campaign",
            "Multiplayer",
            "Special Ops"
        ]
    },

    {
        id: 2,
        title: "The Last of Us Part I",
        poster: "/images/tlou.jpg",
        genre: "Action-Adventure",
        developer: "Naughty Dog",
        publisher: "Sony Interactive Entertainment",
        releaseYear: 2022,

        platforms: [
            "PlayStation 5",
            "PC"
        ],

        rating: 9.0,

        description:
            "The Last of Us Part I follows Joel and Ellie as they travel across a post-apocalyptic United States.",

        modes: [
            "Story",
            "Left Behind",
            "Permadeath",
            "Speedrun"
        ]
    },

    {
        id: 3,
        title: "007 First Light",
        poster: "/images/007.jpg",
        genre: "Action-Adventure",
        developer: "IO Interactive",
        publisher: "IO Interactive",
        releaseYear: 2026,

        platforms: [
            "PC",
            "PlayStation 5",
            "Xbox Series X|S"
        ],

        rating: 8.8,

        description:
            "007 First Light is an original James Bond origin story following a young Bond as he earns his place within MI6.",

        modes: [
            "Single Player",
            "Story"
        ]
    }
];


// =========================
// HOME PAGE
// =========================

app.get("/", (req, res) => {

    res.render("index", {
        games: games
    });

});


// =========================
// INDIVIDUAL GAME PAGE
// =========================

app.get("/game/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const game = games.find(game => game.id === id);

    if (!game) {

        return res.status(404).send("Game not found");

    }

    res.render("game", {
        game: game,
        games: games
    });

});


// =========================
// START SERVER
// =========================

app.listen(3000, () => {

    console.log("Server running at http://localhost:3000");

});