const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');
const rules = document.getElementById('rules');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let score = 0;

const brickRowCount = 9;
const brickColumnCount = 5;

const ballProps = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  speed: 4,
  dx: 4,
  dy: -4,
};

const paddleProps = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0,
};

const brickProps = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true
};

const bricks = [];

for (let i = 0; i < brickRowCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickColumnCount; j++) {
    const x = i * (brickProps.w + brickProps.padding) + brickProps.offsetX;
    const y = j * (brickProps.h + brickProps.padding) + brickProps.offsetY;
    bricks[i][j] = { x, y, ...brickProps };
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ballProps.x, ballProps.y, ballProps.size, 0, Math.PI * 2);
  ctx.fillStyle = '#0095dd';
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleProps.x, paddleProps.y, paddleProps.w, paddleProps.h);
  ctx.fillStyle = '#0095dd';
  ctx.fill();
  ctx.closePath();
}

function drawScore() {
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

function drawBricks() {
  bricks.forEach(column => {
    column.forEach(brick => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? '#0095dd' : 'transparent';
      ctx.fill();
      ctx.closePath();
    });
  });
}

function movePaddle() {
  paddleProps.x += paddleProps.dx;

  if (paddleProps.x + paddleProps.w > canvas.width) {
    paddleProps.x = canvas.width - paddleProps.w;
  }

  if (paddleProps.x < 0) paddleProps.x = 0;
}

function moveBall() {
  ballProps.x += ballProps.dx;
  ballProps.y += ballProps.dy;

  // Wall collision (right/left)
  if (ballProps.x + ballProps.size > canvas.width || ballProps.x - ballProps.size < 0) {
    ballProps.dx *= -1; // ballProps.dx = ballProps.dx * -1
  }

  // Wall collision (top/bottom)
  if (ballProps.y + ballProps.size > canvas.height || ballProps.y - ballProps.size < 0) {
    ballProps.dy *= -1;
  }

  if (
    ballProps.x - ballProps.size > paddleProps.x &&
    ballProps.x + ballProps.size < paddleProps.x + paddleProps.w &&
    ballProps.y + ballProps.size > paddleProps.y
  ) {
    ballProps.dy = -ballProps.speed;
  }

  bricks.forEach(column => {
    column.forEach(brick => {
      if (brick.visible) {
        if (
          ballProps.x - ballProps.size > brick.x &&
          ballProps.x + ballProps.size < brick.x + brick.w &&
          ballProps.y + ballProps.size > brick.y &&
          ballProps.y - ballProps.size < brick.y + brick.h
        ) {
          ballProps.dy *= -1;
          brick.visible = false;
        }
      }
    });
  });
}

function keyDown(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    paddleProps.dx = paddleProps.speed;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    paddleProps.dx = -paddleProps.speed;
  }
}

function keyup(e) {
  if (
    e.key === 'Right' ||
    e.key === 'ArrowRight' ||
    e.key === 'Left' ||
    e.key === 'ArrowLeft'
  ) {
    paddleProps.dx = 0;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBall();
  drawPaddle();
  drawScore();
  drawBricks();
}

function update() {
  movePaddle();
  moveBall();
  draw();
  requestAnimationFrame(update);
}

update();


document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyup);

rulesBtn.addEventListener('click', () => {
  rules.classList.add('show');
});

closeBtn.addEventListener('click', () => {
  rules.classList.remove('show');
});
