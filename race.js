// ---------------- 犬画像 ----------------
const selectedDog = localStorage.getItem("selectedDog") || "dog1.png";
const dog = document.getElementById("dog");
dog.src = "dogs/" + selectedDog;

// ---------------- トラック ----------------
const track = document.getElementById("track");
let trackX = 0;
let trackWidth = 0;
let trackSpeed = 12;    // 背景が動く量（必要ならあとで微調整OK）

// 犬の位置
let dogX = 20;          // 左端スタート
let dogSpeed = 10;      // 1タップで進む量（必要ならあとで少し変えてOK）

// 背景のゴール位置（= 画像右端が画面右端に来る位置）
let goalPosition = 0;

track.onload = () => {
  const containerWidth = document.getElementById("raceContainer").clientWidth;

  // 本来の画像の横幅（例：1919px）を取得
  trackWidth = track.naturalWidth;

  // 画像右端がちょうど画面右端に来る位置（負の値）
  goalPosition = containerWidth - trackWidth;
  console.log("trackWidth:", trackWidth, "goalPosition:", goalPosition);
};

// ---------------- TAPボタン ----------------
const tapButton = document.getElementById("tapButton");
let canTap = false;

// ---------------- タイマー（Date.now ベースで正しい秒数を出す） ----------------
let timerRunning = false;
let startTime = 0;

function startTimer() {
  timerRunning = true;
  startTime = Date.now();
  updateTimer();
}

function stopTimer() {
  timerRunning = false;
}

function updateTimer() {
  if (!timerRunning) return;

  const now = Date.now();
  const elapsed = (now - startTime) / 1000; // 秒
  document.getElementById("timer").textContent = elapsed.toFixed(2) + " s";

  requestAnimationFrame(updateTimer); // 画面のリフレッシュごとに更新
}

// ---------------- ゴール判定 ----------------
function checkGoal() {
  if (trackWidth === 0) return;

  const containerWidth = document.getElementById("raceContainer").clientWidth;
  const dogRight = dogX + dog.clientWidth;

  // ① 背景が最後までスクロール済み（ゴールラインが画面に見えている）
  // ② 犬が画面のほぼ右端まで来た
  if (trackX <= goalPosition && dogRight >= containerWidth - 10) {
    stopTimer();
    canTap = false;

    const now = Date.now();
    const elapsed = (now - startTime) / 1000;
    alert("GOAL!! Time: " + elapsed.toFixed(2) + " s");
  }
}

// ---------------- TAP したときの動き ----------------
tapButton.addEventListener("click", () => {
  if (!canTap) return;

  // 犬を右へ
  dogX += dogSpeed;
  dog.style.left = dogX + "px";

  // 背景スクロール：ゴールラインが見えるまで動かす
  if (trackWidth > 0 && trackX > goalPosition) {
    trackX -= trackSpeed;

    if (trackX < goalPosition) {
      trackX = goalPosition; // ぴったり端で止める
    }

    track.style.left = trackX + "px";
  }

  checkGoal();
});

// ---------------- Tap to Start カウントダウン ----------------
const countdown = document.getElementById("countdown");
let screenTapped = false;

function startCountdown() {
  if (screenTapped) return;
  screenTapped = true;

  // グレーの overlay と文字を消す
  document.getElementById("overlay").style.display = "none";

  // カウントダウン表示 & TAPボタン（見せるけどまだ押せない）
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
        canTap = true;      // TAPできるように
        startTimer();       // ここから正確なタイマー開始
      }, 500);

      clearInterval(interval);
    }
  }, 1000);
}

// overlay と container のどこをタップしてもスタート
document.getElementById("overlay").addEventListener("click", startCountdown);
document.getElementById("raceContainer").addEventListener("click", startCountdown);
