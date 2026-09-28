const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

// ======================================
// MONGODB CONNECTION
// ======================================

const MONGO_URI =
    "mongodb+srv://admin:admin@cluster0.sksj0dl.mongodb.net/db0?retryWrites=true&w=majority";

mongoose
    .connect(MONGO_URI)
    .then(async () => {
        console.log("=================================");
        console.log("MongoDB Connected");
        console.log("Database:", mongoose.connection.name);
        console.log("Host:", mongoose.connection.host);
        console.log("=================================");

        // Show collections
        const collections = await mongoose.connection.db
            .listCollections()
            .toArray();

        console.log(
            "Collections:",
            collections.map((c) => c.name)
        );
    })
    .catch((err) => {
        console.error("MongoDB connection error:");
        console.error(err);
    });

// ======================================
// USER SCHEMA
// ======================================

const userSchema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true
        },

        lastname: {
            type: String,
            required: true
        },

        phone: {
            type: Number,
            required: true
        }
    },
    {
        collection: "Users"
    }
);

const User = mongoose.model("User", userSchema);

// ======================================
// HOME
// ======================================

app.get("/", (req, res) => {
    res.json({
        message: "Server is running"
    });
});

// ======================================
// GET ALL USERS
// ======================================

app.get("/users", async (req, res) => {
    try {
        const users = await User.find({});

        console.log("Users found:", users);

        res.json(users);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
});

// ======================================
// CREATE USER
// ======================================

app.post("/users", async (req, res) => {
    try {
        console.log("Received:", req.body);

        const user = await User.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            phone: req.body.phone
        });

        console.log("Created:", user);

        res.status(201).json(user);
    } catch (error) {
        console.error(error);

        res.status(400).json({
            error: error.message
        });
    }
});

// ======================================
// TEST CREATE USER
// ======================================

app.get("/create-test-user", async (req, res) => {
    try {
        const user = await User.create({
            firstname: "Rahul",
            lastname: "Sharma",
            phone: 9876543210
        });

        res.json({
            message: "User created successfully",
            user: user
        });
    } catch (error) {
        console.error(error);

        res.status(400).json({
            error: error.message
        });
    }
});

// ======================================
// RAW MONGODB TEST
// ======================================

app.get("/debug-users", async (req, res) => {
    try {
        const collection = mongoose.connection.db.collection("Users");

        const users = await collection.find({}).toArray();

        res.json({
            database: mongoose.connection.name,
            collection: "Users",
            count: users.length,
            users: users
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
});

// ======================================
// SERVER
// ======================================

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});