const canvas = document.getElementById('game');
const ctx    = canvas.getContext('2d');

const paddle1 = { x: 10,               y: canvas.height/2 - 50, w: 10, h: 100, dy: 0 };
const paddle2 = { x: canvas.width - 20, y: canvas.height/2 - 50, w: 10, h: 100, dy: 0 };
const ball    = { x: canvas.width/2,   y: canvas.height/2,      r: 8, dx: 4, dy: 4 };

// 追加：ゲームオーバー管理用
let gameOver = false;
let loser    = '';  // 'left' or 'right'

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // パドル
  ctx.fillRect(paddle1.x, paddle1.y, paddle1.w, paddle1.h);
  ctx.fillRect(paddle2.x, paddle2.y, paddle2.w, paddle2.h);
  // ボール
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI*2);
  ctx.fill();

  // 追加：ゲームオーバー時のメッセージ表示
  if (gameOver) {
    ctx.font = '48px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'red';
    const msg = loser === 'left' ? '左の負け！' : '右の負け！';
    ctx.fillText(msg, canvas.width/2, canvas.height/2);
  }
}

function update() {
  if (gameOver) return;  // ゲームオーバーなら動かさない

  // パドル移動
  paddle1.y += paddle1.dy;
  paddle1.y = Math.max(0, Math.min(canvas.height - paddle1.h, paddle1.y));
  paddle2.y += paddle2.dy;
  paddle2.y = Math.max(0, Math.min(canvas.height - paddle2.h, paddle2.y));

  // ボール移動
  ball.x += ball.dx;
  ball.y += ball.dy;

  // 壁との跳ね返り（上下）
  if (ball.y + ball.r > canvas.height || ball.y - ball.r < 0) {
    ball.dy *= -1;
  }

  // 左パドルとの当たり判定
  if (
    ball.x - ball.r < paddle1.x + paddle1.w &&
    ball.y > paddle1.y &&
    ball.y < paddle1.y + paddle1.h
  ) {
    ball.dx *= -1;
  }
  // 右パドルとの当たり判定
  if (
    ball.x + ball.r > paddle2.x &&
    ball.y > paddle2.y &&
    ball.y < paddle2.y + paddle2.h
  ) {
    ball.dx *= -1;
  }

  // 追加：左右の端まで行ったらゲームオーバー
  if (ball.x - ball.r < 0) {
    gameOver = true;
    loser    = 'left';
  }
  if (ball.x + ball.r > canvas.width) {
    gameOver = true;
    loser    = 'right';
  }
}

function loop() {
  update();
  draw();
  if (!gameOver) requestAnimationFrame(loop);
}

// スタートボタンでリセットして開始する例
document.getElementById('start').addEventListener('click', () => {
  // 初期化
  gameOver = false;
  loser    = '';
  ball.x = canvas.width/2;
  ball.y = canvas.height/2;
  // ボールの方向をランダムに
  ball.dx = Math.random() > 0.5 ? 4 : -4;
  ball.dy = (Math.random() * 2 - 1) * 4;
  loop();
});

// キー入力
document.addEventListener('keydown', e => {
  switch (e.key) {
    case 'ArrowUp':    paddle1.dy = -5; break;
    case 'ArrowDown':  paddle1.dy = +5; break;
    case 'w': case 'W': paddle2.dy = -5; break;
    case 's': case 'S': paddle2.dy = +5; break;
  }
});
document.addEventListener('keyup', e => {
  if (['ArrowUp','ArrowDown'].includes(e.key)) paddle1.dy = 0;
  if (['w','W','s','S'].includes(e.key))       paddle2.dy = 0;
});
