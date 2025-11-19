// ---------------- 犬画像 ----------------
const selectedDog = localStorage.getItem("selectedDog") || "dog1.png";
const dog = document.getElementById("dog");
dog.src = "dogs/" + selectedDog;

// ---------------- トラック設定 ----------------
const track = document.getElementById("track");
let trackX = 0;
let trackWidth = 0;
let backgroundStopped = false;

// 犬の位置（画面基準）
let dogX = 0;
let dogSpeed = 12;

// スクロール速度
let trackSpeed = 9;

// ゴール調整（余白なくす）
const GOAL_MARGIN = 340;
let stopPosition = 0;

// トラック画像読み込み後
track.onload = () => {
  trackWidth = track.naturalWidth;
  const containerWidth = document.getElementById("raceContainer").clientWidth;
  stopPosition = -(trackWidth - containerWidth) + GOAL_MARGIN;
};

// ------------- TAP ボタン -------------
const tapButton = document.getElementById("tapButton");
let canTap = false;

tapButton.addEventListener("click", () => {
  if (!canTap) return;

  // 犬は必ず右へ動く
  dogX += dogSpeed;
  dog.style.left = dogX + "px";

  // 背景はゴールラインが見えるまでスクロール
  if (!backgroundStopped) {
    trackX -= trackSpeed;

    if (trackX <= stopPosition) {
      trackX = stopPosition;
      backgroundStopped = true;  // ← 背景だけ止まる
    }

    track.style.left = trackX + "px";
  }

  checkGoal();
});

// ------------- タイマー -------------
let time = 0;
let timerRunning = false;

setInterval(() => {
  if (timerRunning) {
    time += 0.01;
    document.getElementById("timer").textContent = time.toFixed(2) + " s";
  }
}, 10);

// ------------- ゴール判定（超重要：実際の犬の見えている位置で判定）-------------
function checkGoal() {

  const dogRect = dog.getBoundingClientRect();   // ← 実際の犬の画面上の位置
  const containerRect = document.getElementById("raceContainer").getBoundingClientRect();

  const dogRight = dogRect.right;
  const goalX = containerRect.right - 20;   // ← 右端から20px以内でゴール

  if (backgroundStopped && dogRight >= goalX) {
    timerRunning = false;
    canTap = false;
    alert("GOAL!! Time: " + time.toFixed(2) + " s");
  }
}

// ------------- Tap to Start -------------
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


document.getElementById("overlay").addEventListener("click", startCountdown);
document.getElementById("raceContainer").addEventListener("click", startCountdown);
