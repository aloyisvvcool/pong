const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

const paddleWidth = 10;
const paddleHeight = 100;
const ballRadius = 6;
let botSpeed = 4;

let userScore = 0;
let botScore = 0;
const userScoreElement = document.getElementById('userScore');
const botScoreElement = document.getElementById('botScore');
const currentDifficultyElement = document.getElementById('currentDifficulty');

function updateScore() {
    userScoreElement.textContent = userScore;
    botScoreElement.textContent = botScore;
  }

const user = {
  x: 10,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  color: 'white',
};

const bot = {
  x: canvas.width - (paddleWidth + 10),
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  color: 'white',
};

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: ballRadius,
  speed: 5,
  velocityX: 5,
  velocityY: 5,
  color: 'white',
};

function drawRect(x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

function drawCircle(x, y, radius, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2, false);
  ctx.closePath();
  ctx.fill();
}

function draw() {
  drawRect(0, 0, canvas.width, canvas.height, 'black');
  drawRect(user.x, user.y, user.width, user.height, user.color);
  drawRect(bot.x, bot.y, bot.width, bot.height, bot.color);
  drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

canvas.addEventListener('mousemove', (event) => {
  const rect = canvas.getBoundingClientRect();
  user.y = event.clientY - rect.top - user.height / 2;
});

function collision(ball, paddle) {
  return (
    ball.x < paddle.x + paddle.width &&
    ball.x + ball.radius > paddle.x &&
    ball.y < paddle.y + paddle.height &&
    ball.y + ball.radius > paddle.y
  );
}

function update() {
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.velocityY = -ball.velocityY;
  }

  let paddle = bot;
  if (ball.x < canvas.width / 2) {
    paddle = user;
  }

  if (collision(ball, paddle)) {
    let angle = (ball.y - (paddle.y + paddle.height / 2)) / (paddle.height / 2);
    let direction = ball.x < canvas.width / 2 ? 1 : -1;
    ball.velocityX = direction * ball.speed * Math.cos(angle * Math.PI / 4);
    ball.velocityY = ball.speed * Math.sin(angle * Math.PI / 4);

    ball.speed += 0.1;
  }

  if (ball.x - ball.radius < 0) {
    botScore++;
    updateScore();
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 5;
    ball.velocityX = -ball.velocityX;
  } else if (ball.x + ball.radius > canvas.width) {
    userScore++;
    updateScore();
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 5;
    ball.velocityX = -ball.velocityX;
  }

  bot.y += (ball.y - (bot.y + bot.height / 2)) * botSpeed;
}

function gameLoop() {
  draw();
  update();
  requestAnimationFrame(gameLoop);
}

gameLoop();
document.getElementById('easy').addEventListener('click', () => {
    botSpeed = 0.1;
    currentDifficultyElement.textContent = 'Easy';
});

document.getElementById('medium').addEventListener('click', () => {
    botSpeed = 0.3;
    currentDifficultyElement.textContent = 'Medium';
});
  
document.getElementById('hard').addEventListener('click', () => {
    botSpeed = 0.6;
    currentDifficultyElement.textContent = 'Hard';
});

document.getElementById('resetBotPosition').addEventListener('click', () => {
    bot.y = user.y;
});