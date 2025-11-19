// ---------------- 犬画像読み込み ----------------
const selectedDog = localStorage.getItem("selectedDog") || "dog1.png";
const dog = document.getElementById("dog");
dog.src = "dogs/" + selectedDog;

// ---------------- トラック設定 ----------------
const track = document.getElementById("track");
let trackX = 0;
let trackWidth = 0;
let trackSpeed = 5;
let goalPosition = 0;

track.onload = () => {
    trackWidth = track.naturalWidth;

    const containerWidth = document.getElementById("raceContainer").clientWidth;
    goalPosition = containerWidth - trackWidth;
};

// ---------------- 犬移動 ----------------
let dogX = 20;
let dogSpeed = 5;

// ---------------- TAPボタン ----------------
const tapButton = document.getElementById("tapButton");
let canTap = false;

tapButton.addEventListener("click", () => {
    if (!canTap) return;

    dogX += dogSpeed;
    dog.style.left = dogX + "px";

    trackX -= trackSpeed;
    track.style.left = trackX + "px";

    checkGoal();
});

// ---------------- タイマー ----------------
let time = 0;
let timerRunning = false;

setInterval(() => {
    if (timerRunning) {
        time += 0.01;
        document.getElementById("timer").textContent = time.toFixed(2) + " s";
    }
}, 10);

// ---------------- ゴール判定 ----------------
function checkGoal() {
    if (trackWidth === 0) return;

    const containerWidth = document.getElementById("raceContainer").clientWidth;
    goalPosition = containerWidth - trackWidth;

    if (trackX <= goalPosition) {
        track.style.left = goalPosition + "px";
        alert("GOAL!! Time: " + time.toFixed(2) + "s");
        canTap = false;
        timerRunning = false;
    }
}

// ---------------- Tap to Start（overlayクリック） ----------------
const overlay = document.getElementById("overlay");
const countdown = document.getElementById("countdown");
let started = false;

overlay.onclick = () => {
  if (started) return;
  started = true;

  // overlay（グレーと文字）を消す
  overlay.style.display = "none";

  // カウントダウン開始
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
};
