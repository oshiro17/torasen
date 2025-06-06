const express  = require("express");
const bcrypt   = require("bcrypt");
const session  = require("express-session");
const pool     = require("./db");
const cors     = require("cors");
const https    = require("https");
const helmet = require("helmet");
const fs       = require("fs");
const path     = require("path");
require("dotenv").config();

const app  = express();
const port = process.env.PORT || 3000;
app.use(helmet());

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// trust first proxy (e.g. when running behind nginx / Docker)
app.set("trust proxy", 1);

// ---------- serve frontend as static files ----------
const frontendPath = path.join(__dirname, "frontend");
app.use(express.static(frontendPath));

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

// ---------- SPA fallback: always return index.html ----------
// app.get("/*", (req, res) => {
//   res.sendFile(path.join(frontendPath, "index.html"));
// });
// 変更前：この行を探す
// 変更後：必ず「/*」にすること
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
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