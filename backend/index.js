// backend/index.js
const express = require("express");
const bcrypt = require("bcrypt");
const session = require("express-session");
const pool = require("./db");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
app.use(cors({
    origin: true,
    credentials: true
  }));
  
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// セッションミドルウェア
app.use(
  session({
    secret: "supersecret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // HTTPSのときtrueにする
  })
);

// 登録
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
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
  if (result.rows.length === 0) return res.status(401).send("No such user");
  const user = result.rows[0];
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).send("Wrong password");
  req.session.userId = user.id;
  res.send("Logged in!");
});

// ログアウト
app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.send("Logged out!");
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});