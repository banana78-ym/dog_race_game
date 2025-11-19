// ==========================
//  犬画像の読み込み
// ==========================
const selectedDog = localStorage.getItem("selectedDog") || "dog1.png";
const dog = document.getElementById("dog");
dog.src = "dogs/" + selectedDog;

// ==========================
//  トラック & コンテナ
// ==========================
const track = document.getElementById("track");
const raceContainer = document.getElementById("raceContainer");

let trackX = 0;              // 背景の left(px)
let trackWidth = 0;          // 画面上でのトラック幅（縮尺後）
let containerWidth = 0;      // 画面幅
let stopPosition = 0;        // スクロールを止める位置（px）
let backgroundStopped = false;

// 犬の位置（画面の左からの距離）
let dogX = 20;               // 画面の一番左から少し右に出してスタート
let dogSpeed = 10;           // 1タップで犬が進む距離

// 背景スクロール速度
let trackSpeed = 7;

// --------------------------
// トラックの幅・停止位置を計算
// --------------------------
function updateTrackMetrics() {
  // CSS 適用後の実際の表示幅
  trackWidth = track.clientWidth || track.naturalWidth;
  containerWidth = raceContainer.clientWidth;

  // 「画像の右端が画面の右端にピッタリ来る」位置
  // → これ以上スクロールすると黒が出るのでここで止める
  stopPosition = containerWidth - trackWidth;
}

// 画像読み込み後
if (track.complete) {
  updateTrackMetrics();
} else {
  track.onload = () => {
    updateTrackMetrics();
  };
}

// 画面回転・サイズ変更時も再計算
window.addEventListener("resize", () => {
  updateTrackMetrics();
  // スクロール位置をリセット（念のため）
  trackX = 0;
  track.style.left = trackX + "px";
  backgroundStopped = false;
});


// ==========================
//  TAP ボタン
// ==========================
const tapButton = document.getElementById("tapButton");
let canTap = false;

tapButton.addEventListener("click", () => {
  if (!canTap) return;

  // 犬は常に右へ進む（背景が止まっても走り続ける）
  dogX += dogSpeed;
  dog.style.left = dogX + "px";

  // 背景スクロール（画像右端が見えるまで）
  if (!backgroundStopped) {
    trackX -= trackSpeed;

    // 画像の右端が画面右端にきたら、それ以上はスクロールしない
    if (trackX <= stopPosition) {
      trackX = stopPosition;
      backgroundStopped = true;  // ← ここから先は背景は完全固定
    }

    track.style.left = trackX + "px";
  }

  checkGoal();
});


// ==========================
//  タイマー（本物の時間ベース）
// ==========================
let time = 0;
let timerRunning = false;
let startTime = null;

// 本物の経過時間で計算（setInterval の誤差対策）
setInterval(() => {
  if (timerRunning && startTime !== null) {
    const now = performance.now();
    time = (now - startTime) / 1000;      // ミリ秒 → 秒
    document.getElementById("timer").textContent = time.toFixed(2) + " s";
  }
}, 50); // 50msごとで十分滑らか & ズレにくい


// ==========================
//  ゴール判定（犬の画像で判定）
// ==========================
function checkGoal() {
  const dogRight = dogX + dog.clientWidth;          // 犬の右端
  const containerW = raceContainer.clientWidth;     // 画面幅

  // 背景が止まっていて、犬の右端が画面右端に届いたらゴール
  if (backgroundStopped && dogRight >= containerW - 10) {
    timerRunning = false;
    canTap = false;
    alert("GOAL!! Time: " + time.toFixed(2) + " s");
  }
}


// ==========================
//  Tap to Start カウントダウン
// ==========================
const countdown = document.getElementById("countdown");
let screenTapped = false;

function startCountdown() {
  if (screenTapped) return;
  screenTapped = true;

  // グレーのモヤを消す
  document.getElementById("overlay").style.display = "none";

  // タイマー初期化
  time = 0;
  startTime = null;
  timerRunning = false;

  // カウントダウン表示
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

        // ここでゲーム開始
        canTap = true;
        startTime = performance.now();
        timerRunning = true;

      }, 500);
      clearInterval(interval);
    }
  }, 1000);
}

// overlay と raceContainer のどこをタップしてもスタート
document.getElementById("overlay").addEventListener("click", startCountdown);
raceContainer.addEventListener("click", startCountdown);
