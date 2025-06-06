const express  = require("express");
const bcrypt   = require("bcrypt");
const session  = require("express-session");
const pool     = require("./db");
const cors     = require("cors");
const https    = require("https");
const helmet = require("helmet");
const fs       = require("fs");
require("dotenv").config();

const app  = express();
const port = process.env.PORT || 3000;
app.use(helmet());

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(session({
//   secret: process.env.SESSION_SECRET || "dev-secret",
//   resave: false,
//   saveUninitialized: false,   // 推奨
//   cookie: {
//     secure: true,             // ← https 前提
//     httpOnly: true,
//     sameSite: "lax",
//     maxAge: 1000 * 60 * 60    // 1h
//   }
// }));
const secret = process.env.SESSION_SECRET;
if (!secret) {
  console.error("SESSION_SECRET is not set in .env!");
  process.exit(1);        // 起動を止める
}

app.use(session({
  secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    httpOnly: true,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60
  }
}));
/* ----- バリデーション関数 ----- */
function isValidInput(str) {
  return typeof str === "string" && str.length >= 3 && !/[<>"'`;]/.test(str);
}

/* ----- ルート ----- */
// Register
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!isValidInput(username) || !isValidInput(password)) {
    return res.status(400).send("Invalid input.");
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2)",
      [username, hash]
    );
    res.status(201).send("User registered!");
  } catch {
    res.status(400).send("Username already exists.");
  }
});

// Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!isValidInput(username) || !isValidInput(password)) {
    return res.status(400).send("Invalid input.");
  }
  try {
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    const user = rows[0];
    if (!user) return res.status(401).send("User not found");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).send("Wrong password");

    req.session.userId = user.id;
    res.send("Logged in!");
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Server error");
  }
});

/* ----- HTTPS サーバー ----- */
const server = https.createServer(
  {
    key:  fs.readFileSync("key.pem"),
    cert: fs.readFileSync("cert.pem")
  },
  app
);

server.listen(port, () =>
  console.log(`HTTPS server on https://localhost:${port}`)
);