// ---------------- 犬画像 ----------------
const selectedDog = localStorage.getItem("selectedDog") || "dog1.png";
const dog = document.getElementById("dog");
dog.src = "dogs/" + selectedDog;

// ---------------- トラック設定 ----------------
const track = document.getElementById("track");
const raceContainer = document.getElementById("raceContainer");

let trackX = 0;              // トラックの左位置
let trackDisplayWidth = 0;   // 画面上でのトラックの横幅（拡大後）
let stopPosition = 0;        // スクロールを止める left の値

// 犬
let dogX = 0;          // 画面の一番左からスタート
let dogSpeed = 12;     // 1タップで進む距離

// スクロール速度
let trackSpeed = 9;

// スクロール停止フラグ
let backgroundStopped = false;

// ---------------- トラックの表示サイズから停止位置を計算 ----------------
window.addEventListener("load", () => {
  // 画面に表示されたときの実際の横幅（px）
  const rect = track.getBoundingClientRect();
  trackDisplayWidth = rect.width;

  const containerWidth = raceContainer.clientWidth;

  // 画像の「右端」が画面の右端にぴったり来たときの left
  //    trackX + trackDisplayWidth = containerWidth
  // →  trackX = containerWidth - trackDisplayWidth
  stopPosition = containerWidth - trackDisplayWidth;  // 必ず 0 以下になる
  console.log("trackDisplayWidth:", trackDisplayWidth,
              "containerWidth:", containerWidth,
              "stopPosition:", stopPosition);
});

// ---------------- TAPボタン ----------------
const tapButton = document.getElementById("tapButton");
let canTap = false;

tapButton.addEventListener("click", () => {
  if (!canTap) return;

  // 犬は常に右へ進む（スクロールが止まっても動き続ける）
  dogX += dogSpeed;
  dog.style.left = dogX + "px";

  // 背景スクロール：ゴールラインが見えるまでは絶対止めない
  if (!backgroundStopped) {
    trackX -= trackSpeed;   // 左にスクロール

    // 画像右端が画面右端に来たら、それ以上スクロールさせない
    if (trackX <= stopPosition) {
      trackX = stopPosition;
      backgroundStopped = true;  // ここでスクロールストップ
    }

    track.style.left = trackX + "px";
  }

  checkGoal();
});

// ---------------- タイマー（実時間で正しくカウント） ----------------
let time = 0;
let timerRunning = false;
let lastTime = null;

function tickTimer() {
  if (timerRunning) {
    const now = performance.now();
    if (lastTime === null) {
      lastTime = now;
    } else {
      const deltaSec = (now - lastTime) / 1000; // 経過秒
      time += deltaSec;
      lastTime = now;
      document.getElementById("timer").textContent = time.toFixed(2) + " s";
    }
  } else {
    lastTime = null;
  }
  requestAnimationFrame(tickTimer);
}
requestAnimationFrame(tickTimer);

// ---------------- ゴール判定 ----------------
function checkGoal() {
  const containerWidth = raceContainer.clientWidth;

  // 犬の右端（画面座標）
  const dogRight = dogX + dog.clientWidth;

  // ゴールライン：画面右端より少し手前でゴールさせる
  const GOAL_MARGIN = 20; // 小さくすると「より右のギリギリ」でゴール
  const goalLine = containerWidth - GOAL_MARGIN;

  // スクロールは止まっていて、犬がゴールラインを超えたらゴール
  if (backgroundStopped && dogRight >= goalLine) {
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

  // グレーのモヤと文字を消す
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
        timerRunning = true;  // この瞬間からタイマー開始
      }, 500);
      clearInterval(interval);
    }
  }, 1000);
}

// 画面タップは overlay だけに反応させる（変な誤作動防止）
document.getElementById("overlay").addEventListener("click", startCountdown);
