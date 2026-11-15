const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const usersPath = path.join(
  __dirname, "..", "data", "users.json"
);

const SECRET_KEY =
  process.env.JWT_SECRET || "petcare_demo_secret_change_me";

// Register user
router.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must contain at least 6 characters"
      });
    }

    const users = JSON.parse(
      fs.readFileSync(usersPath, "utf8")
    );

    const existingUser = users.find(
      user => user.username === username
    );

    if (existingUser) {
      return res.status(409).json({
        message: "Username already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    users.push({
      id: Date.now(),
      username,
      password: hashedPassword
    });

    fs.writeFileSync(
      usersPath,
      JSON.stringify(users, null, 2)
    );

    res.status(201).json({
      message: "User registered successfully"
    });

  } catch (error) {
    next(error);
  }
});

// Login user
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required"
      });
    }

    const users = JSON.parse(
      fs.readFileSync(usersPath, "utf8")
    );

    const user = users.find(
      item => item.username === username
    );

    if (!user) {
      return res.status(401).json({
        message: "Invalid username or password"
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!validPassword) {
      return res.status(401).json({
        message: "Invalid username or password"
      });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;