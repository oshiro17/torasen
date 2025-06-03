// backend/index.js
const express = require("express");
const bcrypt = require("bcrypt");
const session = require("express-session");
const pool = require("./db");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
// app.use(cors({
//     origin: true,
//     credentials: true
//   }));
  
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: true,
    credentials: true
  }));
  
  app.use(session({
    secret: "supersecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // 本番は true にする
      httpOnly: true // JavaScriptからアクセス不可
    }
  }));
// セッションミドルウェア
// app.use(
//   session({
//     secret: "supersecret",
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false }, // HTTPSのときtrueにする
//   })
// );

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
    await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [username, hash]);
    res.status(201).send("User registered!");
  } catch (e) {
    res.status(400).send("Username already exists.");
  }
});

// ログイン
function isValidInput(str) {
    return typeof str === "string" && str.length >= 3 && !/[<>"'`;]/.test(str);
  }
  
  app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    if (!isValidInput(username) || !isValidInput(password)) {
      return res.status(400).send("Invalid input.");
    }
    const hash = await bcrypt.hash(password, 10);
    try {
      await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [username, hash]);
      res.status(201).send("User registered!");
    } catch (e) {
      res.status(400).send("Username already exists.");
    }
  });
  
  app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    if (!isValidInput(username) || !isValidInput(password)) {
      return res.status(400).send("Invalid input.");
    }

    try {
      const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
      const user = result.rows[0];

      if (!user) {
        console.log("User not found");
        return res.status(401).send("User not found");
      }

      const match = await bcrypt.compare(password, user.password);
      console.log("Password match:", match);

      if (!match) {
        console.log("Wrong password");
        return res.status(401).send("Wrong password");
      }

      req.session.userId = user.id;
      console.log("Login successful for user:", user.username);
      res.send("Logged in!");
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).send("Server error");
    }
  });

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});