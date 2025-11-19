// ---------------- 犬画像 ----------------
const selectedDog = localStorage.getItem("selectedDog") || "dog1.png";
const dog = document.getElementById("dog");
dog.src = "dogs/" + selectedDog;

// ---------------- トラック / コンテナ ----------------
const track = document.getElementById("track");
const raceContainer = document.getElementById("raceContainer");

let trackX = 0;            // トラックの左位置
let trackWidth = 0;        // 画面上でのトラック幅
let containerWidth = 0;    // 画面幅
let backgroundStopped = false; // 背景スクロールが止まったかどうか

// 犬の位置（画面の左からの px）
let dogX = 20;             // 画面一番左から少し右に出してスタート
const dogSpeed = 8;        // 1タップで犬が進む距離

// スクロール速度
const trackSpeed = 7;

// ゴールラインを画面右端にそろえるための微調整
// 必要なら 0 → 10, 20 などに少しずつ増やして調整してOK
const GOAL_MARGIN = 0;

let stopPosition = 0;      // スクロールを止める位置（trackX）

// トラック画像の「実際に表示されている幅」をもとに計算
function setupTrack() {
  trackWidth = track.clientWidth;           // CSS 適用後の幅
  containerWidth = raceContainer.clientWidth;

  // 右端がちょうど画面右に来る位置 + 微調整
  // （trackX がここまで来たらスクロール停止）
  stopPosition = containerWidth - trackWidth + GOAL_MARGIN;
}

// 画像読み込み完了時
track.onload = () => {
  setupTrack();
};

// 画面の向き・サイズが変わったときも再計算
window.addEventListener("resize", () => {
  setupTrack();
  trackX = 0;
  track.style.left = trackX + "px";
});

// ---------------- TAPボタン ----------------
const tapButton = document.getElementById("tapButton");
let canTap = false;

tapButton.addEventListener("click", () => {
  if (!canTap) return;

  // 犬を右に進める（スクロールが止まってもこれは動き続ける）
  dogX += dogSpeed;
  dog.style.left = dogX + "px";

  // 背景は stopPosition までスクロール、それ以降は止まる
  if (!backgroundStopped) {
    trackX -= trackSpeed;

    if (trackX <= stopPosition) {
      trackX = stopPosition;
      backgroundStopped = true;   // ここから先は背景固定
    }

    track.style.left = trackX + "px";
  }

  checkGoal();
});

// ---------------- タイマー ----------------
let time = 0;
let timerRunning = false;

setInterval(() => {
  if (timerRunning) {
    // 0.01 秒ずつカウント（ほぼリアルタイム）
    time += 0.01;
    document.getElementById("timer").textContent = time.toFixed(2) + " s";
  }
}, 10);

// ---------------- ゴール判定 ----------------
function checkGoal() {
  const dogRight = dogX + dog.clientWidth;      // 犬の右端
  const containerWidthNow = raceContainer.clientWidth;

  // 背景が止まったあと、犬の右端が画面右ギリギリを超えたらゴール
  if (backgroundStopped && dogRight >= containerWidthNow - 5) {
    timerRunning = false;
    canTap = false;
    alert("GOAL!! Time: " + time.toFixed(2) + " s");
  }
}

// ---------------- Tap to Start カウントダウン ----------------
const countdown = document.getElementById("countdown");
let screenTapped = false;

function startCountdown() {
  if (screenTapped) return;
  screenTapped = true;

  // グレーのオーバーレイを消す
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

// overlay と 画面 をタップしたらスタート
document.getElementById("overlay").addEventListener("click", startCountdown);
raceContainer.addEventListener("click", startCountdown);
