// frontend/main.js  — Pong engine (exported for GameView)
const canvas = document.createElement("canvas");
canvas.id = "pong";
canvas.width = 800;
canvas.height = 500;
const ctx = canvas.getContext("2d");

/* ---------- Game State ---------- */
const paddleWidth = 10,
      paddleHeight = 100,
      ballRadius = 8;

const player = {
  x: 0,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  color: "white",
  score: 0
};

const opponent = {
  x: canvas.width - paddleWidth,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  color: "white",
  score: 0
};

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: ballRadius,
  dx: 6,
  dy: 6,
  color: "white"
};

/* ---------- Drawing Helpers ---------- */
function drawRect(x, y, w, h, c) {
  ctx.fillStyle = c;
  ctx.fillRect(x, y, w, h);
}

function drawArc(x, y, r, c) {
  ctx.fillStyle = c;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "32px Arial";
  ctx.fillText(player.score, canvas.width / 4, 40);
  ctx.fillText(opponent.score, (3 * canvas.width) / 4, 40);
}

/* ---------- Mechanics ---------- */
function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.dx *= -1; // 方向反転
  ball.dy = 6 * (Math.random() > 0.5 ? 1 : -1);
}

function detectCollision(b, p) {
  return (
    b.x - b.radius < p.x + p.width &&
    b.x + b.radius > p.x &&
    b.y - b.radius < p.y + p.height &&
    b.y + b.radius > p.y
  );
}

function update() {
  // move ball
  ball.x += ball.dx;
  ball.y += ball.dy;

  // top / bottom wall
  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.dy *= -1;
  }

  // paddle collision
  const target = ball.x < canvas.width / 2 ? player : opponent;
  if (detectCollision(ball, target)) {
    ball.dx *= -1;
  }

  // score check
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
  drawRect(0, 0, canvas.width, canvas.height, "#222"); // background
  drawRect(player.x, player.y, player.width, player.height, player.color);
  drawRect(opponent.x, opponent.y, opponent.width, opponent.height, opponent.color);
  drawArc(ball.x, ball.y, ball.radius, ball.color);
  drawScore();
}

/* ---------- Controls ---------- */
let controlsBound = false;
function bindControls() {
  if (controlsBound) return;
  controlsBound = true;
  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "w":
        if (player.y > 0) player.y -= 22;
        break;
      case "s":
        if (player.y + player.height < canvas.height) player.y += 22;
        break;
      case "ArrowUp":
        if (opponent.y > 0) opponent.y -= 22;
        break;
      case "ArrowDown":
        if (opponent.y + opponent.height < canvas.height) opponent.y += 22;
        break;
    }
  });
}

/* ---------- Game Loop Control ---------- */
let rafId = null;
export function startGame() {
  bindControls();
  cancelAnimationFrame(rafId);
  const loop = () => {
    update();
    render();
    rafId = requestAnimationFrame(loop);
  };
  loop();
}

export function stopGame() {
  if (rafId) cancelAnimationFrame(rafId);
}

export { canvas };