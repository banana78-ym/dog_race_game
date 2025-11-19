// ---------------- 犬画像 ----------------
const selectedDog = localStorage.getItem("selectedDog") || "dog1.png";
const dog = document.getElementById("dog");
dog.src = "dogs/" + selectedDog;

// ---------------- トラック & コンテナ ----------------
const track = document.getElementById("track");
const raceContainer = document.getElementById("raceContainer");

let trackX = 0;              // トラックの現在位置（left）
let trackDisplayWidth = 0;   // 画面上でのトラックの横幅（px）
let stopPosition = 0;        // スクロールを止める位置（画像の一番右が画面右に来る位置）
let backgroundStopped = false;

// 犬
let dogX = 0;        // 犬の left(px)
let dogSpeed = 8;    // 1タップで進む量

// スクロール速度
let trackSpeed = 9;

// ---------------- トラックの実際の表示幅を取得 ----------------
window.addEventListener("load", () => {
  const rect = track.getBoundingClientRect();
  trackDisplayWidth = rect.width;  // 画面上での本当の横幅

  const containerWidth = raceContainer.clientWidth;

  // ★ トラックの右端が画面右端にピッタリ来る位置
  //   → ここまでスクロールしたら止める（それまでは絶対止まらない）
  stopPosition = containerWidth - trackDisplayWidth;
});

// ---------------- TAPボタン ----------------
const tapButton = document.getElementById("tapButton");
let canTap = false;

tapButton.addEventListener("click", () => {
  if (!canTap) return;

  // 犬を右に動かす（スクロールが止まっても動き続ける）
  dogX += dogSpeed;
  dog.style.left = dogX + "px";

  // 背景スクロール：画像の「本当の終わり」までは止めない
  if (!backgroundStopped) {
    trackX -= trackSpeed;

    if (trackX <= stopPosition) {
      trackX = stopPosition;      // ここでピタッと止まる
      backgroundStopped = true;   // 以降は犬だけ走る
    }

    track.style.left = trackX + "px";
  }

  checkGoal();
});

// ---------------- タイマー（正確なやつ） ----------------
let time = 0;
let timerRunning = false;
let lastTime = null;

function tickTimer() {
  if (timerRunning) {
    const now = performance.now();
    if (lastTime === null) {
      lastTime = now;
    } else {
      const delta = (now - lastTime) / 1000; // ミリ秒→秒
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

  // ゴールライン ≒ 画面右端のちょい左
  const GOAL_MARGIN = 20;
  const goalLine = containerWidth - GOAL_MARGIN;

  // 背景はもう止まっている前提で、犬の右端がゴールラインを超えたらゴール
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

// ---------------- Tap to Start カウントダウン ----------------
const countdown = document.getElementById("countdown");
let screenTapped = false;

function startCountdown() {
  if (screenTapped) return;
  screenTapped = true;

  // グレーのもや＆文字を消す
  document.getElementById("overlay").style.display = "none";

  // カウントダウン & TAPボタン表示
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

// overlay & container 両方タップでスタート
document.getElementById("overlay").addEventListener("click", startCountdown);
document.getElementById("raceContainer").addEventListener("click", startCountdown);
