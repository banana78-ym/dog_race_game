// ---------------- 犬画像 ----------------
const selectedDog = localStorage.getItem("selectedDog") || "dog1.png";
const dog = document.getElementById("dog");
dog.src = "dogs/" + selectedDog;

// ---------------- トラック設定 ----------------
const track = document.getElementById("track");
const raceContainer = document.getElementById("raceContainer");

let trackX = 0;
let trackDisplayWidth = 0;
let stopPosition = 0;

// 犬
let dogX = 0;
let dogSpeed = 8;

// スクロール速度
let trackSpeed = 9;

// ★★★★★ スクロール停止位置（今回は -50 に調整）★★★★★
const STOP_OFFSET = -50;

let backgroundStopped = false;

// ---------------- トラック実寸幅を取得 ----------------
window.addEventListener("load", () => {
  const rect = track.getBoundingClientRect();
  trackDisplayWidth = rect.width;

  const containerWidth = raceContainer.clientWidth;

  stopPosition = containerWidth - trackDisplayWidth + STOP_OFFSET;
});

// ---------------- TAPボタン ----------------
const tapButton = document.getElementById("tapButton");
let canTap = false;

tapButton.addEventListener("click", () => {
  if (!canTap) return;

  // 犬進む
  dogX += dogSpeed;
  dog.style.left = dogX + "px";

  // 背景スクロール（stopPosition まで）
  if (!backgroundStopped) {
    trackX -= trackSpeed;

    if (trackX <= stopPosition) {
      trackX = stopPosition;
      backgroundStopped = true;
    }

    track.style.left = trackX + "px";
  }

  checkGoal();
});

// ---------------- タイマー（正確版） ----------------
let time = 0;
let timerRunning = false;
let lastTime = null;

function tickTimer() {
  if (timerRunning) {
    const now = performance.now();
    if (lastTime === null) {
      lastTime = now;
    } else {
      const delta = (now - lastTime) / 1000;
      time += delta;
      lastTime = now;
      document.getElementById("timer").textContent = time.toFixed(2) + " s";
    }
  } else {
    lastTime = null;
  }

  requestAnimationFrame(tickTimer);
}
requestAnimationFrame(tickTimer);

// ---------------- Restart ボタン ----------------
const restartButton = document.getElementById("restartButton");

// ---------------- ゴール判定 ----------------
function checkGoal() {
  const containerWidth = raceContainer.clientWidth;
  const dogRight = dogX + dog.clientWidth;

  const GOAL_MARGIN = 20;
  const goalLine = containerWidth - GOAL_MARGIN;

  if (backgroundStopped && dogRight >= goalLine) {
    timerRunning = false;
    canTap = false;

    alert("GOAL!! Time: " + time.toFixed(2) + " s");

    restartButton.style.display = "block";
  }
}

restartButton.addEventListener("click", () => {
  location.reload();
});

// ---------------- Tap to Start ----------------
const countdown = document.getElementById("countdown");
let screenTapped = false;

function startCountdown() {
  if (screenTapped) return;
  screenTapped = true;

  document.getElementById("overlay").style.display = "none";

  countdown.style.display = "block";
  tapButton.style.display = "block";
  canTap = false;

  let count = 3;
  countdown.textContent = count;

  const interval = setInterval(() => {
    count--;
    if (count > 0) {
      countdown.textContent = count;
    } else {
      countdown.textContent = "GO!";
      setTimeout(() => {
        countdown.style.display = "none";
        canTap = true;
        timerRunning = true;
      }, 500);
      clearInterval(interval);
    }
  }, 1000);
}

document.getElementById("overlay").addEventListener("click", startCountdown);
document.getElementById("raceContainer").addEventListener("click", startCountdown);
