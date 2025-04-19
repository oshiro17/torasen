const canvas = document.getElementById('game');
const ctx    = canvas.getContext('2d');
// パドル・ボールの初期設定
const paddle1 = { x:10,              y:canvas.height/2 - 50, w:10, h:100, dy:0 };
const paddle2 = { x:canvas.width-20, y:canvas.height/2 - 50, w:10, h:100, dy:0 };
const ball    = { x:canvas.width/2,  y:canvas.height/2,      r:8,  dx:4, dy:4 };
// DOM 要素キャッシュ
const leftScoreEl  = document.getElementById('left-score');
const rightScoreEl = document.getElementById('right-score');
const resultEl     = document.getElementById('result');
// スコアとゲーム状態
let leftScore  = 0;
let rightScore = 0;
let isGameOver = false;
// スコア表示更新
function updateScoreDisplay() {
  leftScoreEl.textContent  = leftScore;
  rightScoreEl.textContent = rightScore;
  if (!isGameOver) {
    if (leftScore >= 10) endGame('左の勝ち！');
    if (rightScore >= 10) endGame('右の勝ち！');
  }
}

// 勝利メッセージ表示
function endGame(msg) {
  isGameOver = true;
  resultEl.textContent   = msg;
  resultEl.style.display = 'block';
}

// ボール初期化
function resetBall() {
  ball.x  = canvas.width / 2;
  ball.y  = canvas.height / 2;
  ball.dx = Math.random() > 0.5 ? 4 : -4;
  ball.dy = (Math.random() * 2 - 1) * 4;
}

// 描画処理
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#fff';
  ctx.fillRect(paddle1.x, paddle1.y, paddle1.w, paddle1.h);
  ctx.fillRect(paddle2.x, paddle2.y, paddle2.w, paddle2.h);

  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
  ctx.fill();
}

// 状態更新
function update() {
  if (isGameOver) return;

  // パドル移動＆制限
  paddle1.y = Math.max(0, Math.min(canvas.height - paddle1.h, paddle1.y + paddle1.dy));
  paddle2.y = Math.max(0, Math.min(canvas.height - paddle2.h, paddle2.y + paddle2.dy));

  // ボール移動
  ball.x += ball.dx;
  ball.y += ball.dy;

  // 上下壁反転
  if (ball.y + ball.r > canvas.height || ball.y - ball.r < 0) {
    ball.dy *= -1;
  }

  // パドル衝突判定
  if (
    ball.x - ball.r < paddle1.x + paddle1.w &&
    ball.y > paddle1.y &&
    ball.y < paddle1.y + paddle1.h
  ) {
    ball.dx *= -1;
  }
  if (
    ball.x + ball.r > paddle2.x &&
    ball.y > paddle2.y &&
    ball.y < paddle2.y + paddle2.h
  ) {
    ball.dx *= -1;
  }

  // 得点判定
  if (ball.x - ball.r < 0) {
    rightScore++;
    updateScoreDisplay();
    resetBall();
  }
  if (ball.x + ball.r > canvas.width) {
    leftScore++;
    updateScoreDisplay();
    resetBall();
  }
}

// メインループ
function loop() {
  update();
  draw();
  if (!isGameOver) requestAnimationFrame(loop);
}

// ゲーム開始＆リセット
document.getElementById('start').addEventListener('click', () => {
  isGameOver  = false;
  resultEl.style.display = 'none';
  leftScore  = 0;
  rightScore = 0;
  updateScoreDisplay();
  resetBall();
  loop();
});

// キー操作
document.addEventListener('keydown', e => {
  switch (e.key.toLowerCase()) {
    case 'arrowup':    paddle2.dy = -5; break;
    case 'arrowdown':  paddle2.dy = +5; break;
    case 'w':          paddle1.dy = -5; break;
    case 's':          paddle1.dy = +5; break;
  }
});
document.addEventListener('keyup', e => {
  if (['arrowup','arrowdown'].includes(e.key.toLowerCase())) paddle1.dy = 0;
  if (['w','s'].includes(e.key.toLowerCase()))                paddle2.dy = 0;
});
