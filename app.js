const canvas = document.getElementById("myCanvas");
const playerScore = document.querySelector("#myScore2");
const ComputerScore = document.querySelector("#myScore");
const pause = document.getElementById("Pause");
const simpleBtn = document.getElementById("simpleBtn");
const normalBtn = document.getElementById("normalBtn");
const difficultBtn = document.getElementById("difficultBtn");
pause.innerText = "Pause";
normalBtn.style.color = "brown";
normalBtn.style.backgroundColor = "lightgreen";
normalBtn.style.fontWeight = "bold";
const ctx = canvas.getContext("2d");
const radius = 10;
const unit = 10;
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
let isPaused = false; // 新增一個變數來標記遊戲是否暫停
let plate_width = 10;
let plate_height = 100;
let computer_x = 0;
let computer_y = canvas.height / 2 - plate_height / 2;
let player_x = canvas.width - plate_width;
let player_y = canvas.height / 2 - plate_height / 2;
let ball_x = canvas.width / 2;
let ball_y = canvas.height / 2;
let game;
// 設定球的速度
let ball_speed_x = unit * getRandomSign();
let ball_speed_y = unit * getRandomSign();
// 設定玩家速度
let player_speed = 10;
// 設定電腦速度
let computer_speed = 10;

let startGame = false;
let gameStarted = false;

// 設定分數
let player_score = 0;
let computer_score = 0;
playerScore.innerText = `Player Score: ${player_score}`;
ComputerScore.innerText = `Computer Score: ${computer_score}`;

const plobSound = new Audio("./sound/pong.ogg");
const scoreSong = new Audio("./sound/score.ogg");

pause.addEventListener("click", () => {
  if (!game) {
    return;
  }
  if (isPaused) {
    pause.innerText = "Pause"; // 按鈕顯示為「Pause」
    isPaused = false; // 解除暫停
    game = setInterval(draw, 25); // 繼續遊戲
  } else {
    pause.innerText = "Continue"; // 按鈕顯示為「Continue」
    isPaused = true; // 暫停遊戲
    clearInterval(game); // 停止遊戲
  }
});
let difficulty = "normal"; // 預設為 normal
// 三個難度的按鈕
simpleBtn.addEventListener("click", () => {
  difficulty = "simple";
  player_score = 0;
  computer_score = 0;
  playerScore.innerText = `Player Score: ${player_score}`;
  ComputerScore.innerText = `Computer Score: ${computer_score}`;
  normalBtn.style.color = "black";
  normalBtn.style.fontWeight = "none";
  normalBtn.style.backgroundColor = "yellow";
  difficultBtn.style.color = "black";
  difficultBtn.style.fontWeight = "none";
  difficultBtn.style.backgroundColor = "yellow";
  simpleBtn.style.color = "brown";
  simpleBtn.style.backgroundColor = "lightgreen";
  simpleBtn.style.fontWeight = "bold";
});

normalBtn.addEventListener("click", () => {
  difficulty = "normal";
  player_score = 0;
  computer_score = 0;
  playerScore.innerText = `Player Score: ${player_score}`;
  ComputerScore.innerText = `Computer Score: ${computer_score}`;
  normalBtn.style.color = "brown";
  normalBtn.style.backgroundColor = "lightgreen";
  normalBtn.style.fontWeight = "bold";
  difficultBtn.style.color = "black";
  difficultBtn.style.backgroundColor = "yellow";
  difficultBtn.style.fontWeight = "none";
  simpleBtn.style.color = "black";
  simpleBtn.style.backgroundColor = "yellow";
  simpleBtn.style.fontWeight = "none";
});

difficultBtn.addEventListener("click", () => {
  difficulty = "difficult";
  player_score = 0;
  computer_score = 0;
  playerScore.innerText = `Player Score: ${player_score}`;
  ComputerScore.innerText = `Computer Score: ${computer_score}`;
  normalBtn.style.color = "black";
  normalBtn.style.fontWeight = "none";
  normalBtn.style.backgroundColor = "yellow";
  simpleBtn.style.color = "black";
  simpleBtn.style.fontWeight = "none";
  simpleBtn.style.backgroundColor = "yellow";
  difficultBtn.style.color = "brown";
  difficultBtn.style.backgroundColor = "lightgreen";
  difficultBtn.style.fontWeight = "bold";
});

function movePlayer(e) {
  if (e.key == "ArrowUp" && player_y > 0) {
    player_y -= player_speed;
  } else if (e.key == "ArrowDown" && player_y < canvas.height - plate_height) {
    player_y += player_speed;
  }
}
// 監聽鍵盤事件
document.addEventListener("keydown", movePlayer);

function getRandomSign() {
  return Math.random() < 0.5 ? 1 : -1;
}

function initial() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  drawPlayer();
  drawComputer();
}

function drawPlayer() {
  ctx.fillStyle = "white";
  ctx.fillRect(player_x, player_y, plate_width, plate_height);
}

function drawComputer() {
  ctx.fillStyle = "white";
  ctx.fillRect(computer_x, computer_y, plate_width, plate_height);
}

function ComputerMove() {
  // 預測球的未來位置（簡單預測，基於目前球的速度來計算）
  let predictedBallY =
    ball_y +
    ball_speed_y * (Math.abs(ball_x - computer_x) / Math.abs(ball_speed_x));

  // 根據不同的難度來調整電腦的反應速度和預測的精度
  switch (difficulty) {
    case "simple":
      // 簡單模式：電腦僅根據球的當前位置移動，反應速度較慢
      computer_speed = 5;
      player_speed = 10;
      break;

    case "normal":
      // 普通模式：電腦會根據球的預測位置移動，反應速度中等
      computer_speed = 8;
      player_speed = 10;
      predictedBallY += (Math.random() * 2 - 1) * 20; // 小幅度隨機誤差，模擬一些簡單的預測錯誤
      break;

    case "difficult":
      // 困難模式：電腦預測球的運動路徑並精確移動，反應速度很快
      computer_speed = 12;
      player_speed = 12;
      predictedBallY += (Math.random() * 2 - 1) * 10; // 微小的誤差，幾乎完美預測
      break;
  }

  // 根據預測位置調整電腦的移動
  if (predictedBallY < computer_y + plate_height / 2) {
    computer_y -= computer_speed;
  } else if (predictedBallY > computer_y + plate_height / 2) {
    computer_y += computer_speed;
  }

  // 限制電腦的移動範圍，防止移出邊界
  if (computer_y < 0) {
    computer_y = 0;
  } else if (computer_y > canvas.height - plate_height) {
    computer_y = canvas.height - plate_height;
  }
}

function drawBall(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();
}

function hit() {
  const ball = { x: ball_x, y: ball_y, radius: radius };
  const player = {
    x: player_x,
    y: player_y,
    width: plate_width,
    height: plate_height,
  };
  const computer = {
    x: computer_x,
    y: computer_y,
    width: plate_width,
    height: plate_height,
  };

  if (
    circleRectCollision(ball, player) ||
    circleRectCollision(ball, computer)
  ) {
    plobSound.play();
    ball_speed_x *= -1; // 反彈
  } else {
    if (ball_x <= radius) {
      scoreSong.play();
      player_score++;
      playerScore.innerText = `Player Score: ${player_score}`;
      startGame = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      restart();
    } else if (ball_x >= canvas.width - radius) {
      scoreSong.play();
      computer_score++;
      ComputerScore.innerText = `Computer Score: ${computer_score}`;
      startGame = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      restart();
    }
  }
}

function hitBorder() {
  if (ball_y >= canvas.height - radius || ball_y <= radius) {
    ball_speed_y *= -1;
  }

  ball_y += ball_speed_y;
  ball_x += ball_speed_x;
}

function ballMove() {
  hit();
  hitBorder();
}

function circleRectCollision(circle, rect) {
  let closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
  let closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
  let distanceX = circle.x - closestX;
  let distanceY = circle.y - closestY;
  let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
  return distance < circle.radius;
}

function draw() {
  initial();
  ComputerMove(); // 改進的電腦移動
  ballMove();
  drawCenterLine();
  drawBall(ball_x, ball_y);
}

function drawCountdown(text) {
  // 設定文字顏色為白色
  ctx.fillStyle = "white";
  ctx.font = "50px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // 繪製白色文字
  ctx.fillText(text, canvasWidth / 2, canvasHeight / 2);
}

function drawCenterLine() {
  console.log("drawLine");
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;

  const centerX = canvasWidth / 2;
  ctx.beginPath();
  ctx.moveTo(centerX, 0);
  ctx.lineTo(centerX, canvasHeight);
  ctx.stroke();
}

function restart() {
  pause.style.visibility = "hidden";
  clearInterval(game); // 停止遊戲

  // console.log("restart");
  document.removeEventListener("keydown", movePlayer); // 移除鍵盤事件
  computer_x = 0; // 電腦的位置
  computer_y = canvas.height / 2 - plate_height / 2; // 電腦的初始位置
  player_x = canvas.width - plate_width; // 玩家的位置
  player_y = canvas.height / 2 - plate_height / 2; // 玩家初始位置
  ball_x = -100;
  ball_y = -100;
  startGame = false; // 遊戲尚未開始
  initial();
  countdownStart(); // 開始倒數計時
}

function countdownStart() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight); // 清空畫布
  setTimeout(() => {
    initial();
    drawCountdown(3);
  }, 200);

  setTimeout(() => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight); // 清空畫布
    initial();
    drawCountdown(2);
  }, 1000);

  setTimeout(() => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight); // 清空畫布
    initial();
    drawCountdown(1);
  }, 2000);

  setTimeout(() => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight); // 清空畫布
    //初始化球的位置，但不會在倒數期間繪製球
    ball_x = canvas.width / 2;
    ball_y = canvas.height / 2;
    ball_speed_x = unit * getRandomSign();
    ball_speed_y = unit * getRandomSign();
    console.log("startGame");
    game = setInterval(draw, 25); // 開始遊戲，進行繪製
    pause.style.visibility = "visible";
    document.addEventListener("keydown", movePlayer); // 重新啟動鍵盤事件
  }, 3000);
}

restart();
