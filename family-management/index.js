const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

const User = require("./models/User");
const Child = require("./models/Child");

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

// EJS
app.set("view engine", "ejs");

// MongoDB connection
mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });


// ======================================================
// POST /users
// Create a new user
// ======================================================

app.post("/users", async (req, res) => {
    try {
        const { firstName, lastName, email, phone } = req.body;

        const user = await User.create({
            firstName,
            lastName,
            email,
            phone
        });

        res.status(201).json({
            message: "User created successfully",
            user: user
        });

    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: "Validation error",
                error: error.message
            });
        }

        res.status(500).json({
            message: "Error creating user",
            error: error.message
        });
    }
});


// ======================================================
// GET /users/:id
// Display user profile with children
// ======================================================

app.get("/users/:id", async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).sendFile(
                __dirname + "/views/404.html"
            );
        }

        const children = await Child.find({
            parentId: userId
        });

        res.render("profile", {
            user: user,
            children: children
        });

    } catch (error) {
        return res.status(404).sendFile(
            __dirname + "/views/404.html"
        );
    }
});


// ======================================================
// POST /users/:id/children
// Create a child for a specific user
// ======================================================

app.post("/users/:id/children", async (req, res) => {
    try {
        const userId = req.params.id;

        // Check parent user exists
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send("User Not Found");
        }

        const {
            firstName,
            lastName,
            age,
            email
        } = req.body;

        const child = await Child.create({
            firstName,
            lastName,
            age,
            email,
            parentId: userId
        });

        res.redirect(`/users/${userId}`);

    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: "Validation error",
                error: error.message
            });
        }

        res.status(500).json({
            message: "Error creating child",
            error: error.message
        });
    }
});


// ======================================================
// GET /users/:id/children
// Get all children belonging to a user
// ======================================================

app.get("/users/:id/children", async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).sendFile(
                __dirname + "/views/404.html"
            );
        }

        const children = await Child.find({
            parentId: userId
        });

        if (children.length === 0) {
            return res.send("No children found for this user.");
        }

        res.json(children);

    } catch (error) {
        return res.status(404).sendFile(
            __dirname + "/views/404.html"
        );
    }
});


// ======================================================
// GET /users/:id/children/add
// Display Add Child form
// ======================================================

app.get("/users/:id/children/add", async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).sendFile(
                __dirname + "/views/404.html"
            );
        }

        res.render("add-child", {
            userId: userId
        });

    } catch (error) {
        return res.status(404).sendFile(
            __dirname + "/views/404.html"
        );
    }
});


// ======================================================
// GET /users/:id/children/:childId
// Display child only if it belongs to requested user
// ======================================================

app.get("/users/:id/children/:childId", async (req, res) => {
    try {
        const userId = req.params.id;
        const childId = req.params.childId;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).sendFile(
                __dirname + "/views/404.html"
            );
        }

        const child = await Child.findOne({
            _id: childId,
            parentId: userId
        });

        if (!child) {
            return res.status(404).send("Child Not Found");
        }

        res.render("child", {
            child: child
        });

    } catch (error) {
        return res.status(404).send("Child Not Found");
    }
});


// ======================================================
// GET /children/:id/edit
// Display child update form
// ======================================================

app.get("/children/:id/edit", async (req, res) => {
    try {
        const childId = req.params.id;

        const child = await Child.findById(childId);

        if (!child) {
            return res.status(404).send("Child Not Found");
        }

        res.render("child", {
            child: child
        });

    } catch (error) {
        return res.status(404).send("Child Not Found");
    }
});


// ======================================================
// PATCH /children/:id
// Update child information
// ======================================================

app.patch("/children/:id", async (req, res) => {
    try {
        const childId = req.params.id;

        const {
            firstName,
            lastName,
            age,
            email
        } = req.body;

        const child = await Child.findByIdAndUpdate(
            childId,
            {
                firstName,
                lastName,
                age,
                email
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!child) {
            return res.status(404).send("Child Not Found");
        }

        res.json({
            message: "Child updated successfully",
            child: child
        });

    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: "Validation error",
                error: error.message
            });
        }

        res.status(500).json({
            message: "Error updating child",
            error: error.message
        });
    }
});


// ======================================================
// DELETE /children/:id
// Delete a child
// ======================================================

app.delete("/children/:id", async (req, res) => {
    try {
        const childId = req.params.id;

        const child = await Child.findByIdAndDelete(childId);

        if (!child) {
            return res.status(404).send("Child Not Found");
        }

        res.json({
            message: "Child deleted successfully",
            child: child
        });

    } catch (error) {
        res.status(500).json({
            message: "Error deleting child",
            error: error.message
        });
    }
});


// ======================================================
// 404 - Unknown route
// ======================================================

app.use((req, res) => {
    res.status(404).sendFile(
        __dirname + "/views/404.html"
    );
});


// ======================================================
// Start server
// ======================================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});