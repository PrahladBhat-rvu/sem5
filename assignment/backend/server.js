const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const users = [
  { id: 1, name: "Aarav", email: "aarav@example.com" },
  { id: 2, name: "Diya", email: "diya@example.com" },
  { id: 3, name: "Kabir", email: "kabir@example.com" },
  { id: 4, name: "Anaya", email: "anaya@example.com" },
  { id: 5, name: "Arjun", email: "arjun@example.com" },
  { id: 6, name: "Meera", email: "meera@example.com" }
];

// Route 1: users with even IDs
app.get("/api/users/even", (req, res) => {
  res.json(users.filter((user) => user.id % 2 === 0));
});

// Route 2: users with odd IDs
app.get("/api/users/odd", (req, res) => {
  res.json(users.filter((user) => user.id % 2 !== 0));
});

app.get("/api/users", (req, res) => {
  res.json(users);
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
