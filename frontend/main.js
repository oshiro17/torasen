// frontend/main.js

const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

const paddleWidth = 10, paddleHeight = 100;
const ballRadius = 8;

const player = {
  x: 0,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  color: "white",
  score: 0,
};

const opponent = {
  x: canvas.width - paddleWidth,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  color: "white",
  score: 0,
};

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: ballRadius,
  speed: 5,
  dx: 5,
  dy: 5,
  color: "white",
};

function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawArc(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.dx *= -1;
  ball.dy = 5 * (Math.random() > 0.5 ? 1 : -1);
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "32px Arial";
  ctx.fillText(player.score, canvas.width / 4, 50);
  ctx.fillText(opponent.score, 3 * canvas.width / 4, 50);
}

function movePaddles() {
  document.addEventListener("keydown", (e) => {
    // W/S for player
    if (e.key === "w" && player.y > 0) player.y -= 20;
    if (e.key === "s" && player.y + player.height < canvas.height) player.y += 20;

    // ↑/↓ for opponent
    if (e.key === "ArrowUp" && opponent.y > 0) opponent.y -= 20;
    if (e.key === "ArrowDown" && opponent.y + opponent.height < canvas.height) opponent.y += 20;
  });
}

function detectCollision(ball, paddle) {
  return (
    ball.x - ball.radius < paddle.x + paddle.width &&
    ball.x + ball.radius > paddle.x &&
    ball.y < paddle.y + paddle.height &&
    ball.y > paddle.y
  );
}

function update() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Wall collision
  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.dy *= -1;
  }

  // Paddle collision
  let currentPlayer = ball.x < canvas.width / 2 ? player : opponent;
  if (detectCollision(ball, currentPlayer)) {
    ball.dx *= -1;
  }

  // Score
  if (ball.x - ball.radius < 0) {
    opponent.score++;
    resetBall();
  }

  if (ball.x + ball.radius > canvas.width) {
    player.score++;
    resetBall();
  }
}

function render() {
  drawRect(0, 0, canvas.width, canvas.height, "#222");
  drawRect(player.x, player.y, player.width, player.height, player.color);
  drawRect(opponent.x, opponent.y, opponent.width, opponent.height, opponent.color);
  drawArc(ball.x, ball.y, ball.radius, ball.color);
  drawScore();
}

function gameLoop() {
  update();
  render();
}
async function register() {
    const username = document.getElementById("reg-username").value;
    const password = document.getElementById("reg-password").value;
    const res = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    alert(await res.text());
  }
  

function isLoggedIn() {
  return !!localStorage.getItem("loggedIn");
}

window.onload = () => {
  if (!isLoggedIn()) {
    canvas.style.display = "none";
  } else {
    canvas.style.display = "block";
    setInterval(gameLoop, 1000 / 60);
  }
};

movePaddles();
// setInterval(gameLoop, 1000 / 60);
async function login() {
    console.log("login() 呼ばれた！");
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;
    
    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });
  
      const text = await res.text();
      console.log("ログイン応答:", text);
      alert(text);
  
      if (res.ok) {
        localStorage.setItem("loggedIn", "true");
        canvas.style.display = "block";
        setInterval(gameLoop, 1000 / 60);
      }
  
    } catch (err) {
      console.error("ログインエラー:", err);
    }
  }