// ==========================
//  犬画像
// ==========================
const selectedDog = localStorage.getItem("selectedDog") || "dog1.png";
const dog = document.getElementById("dog");
dog.src = "dogs/" + selectedDog;

// ==========================
//  トラック
// ==========================
const track = document.getElementById("track");
const raceContainer = document.getElementById("raceContainer");

let trackX = 0;
let trackWidth = 0;
let containerWidth = 0;
let stopPosition = 0;
let backgroundStopped = false;

let dogX = 20;
let dogSpeed = 10;

let trackSpeed = 7;

// --------------------------
// トラック幅 + 停止位置計算
// --------------------------
function updateTrackMetrics() {
    trackWidth = track.clientWidth || track.naturalWidth;
    containerWidth = raceContainer.clientWidth;

    // 🔥 いまより 40px だけ遅く止まる（−105px）
    stopPosition = containerWidth - trackWidth - 105;
}

if (track.complete) updateTrackMetrics();
else track.onload = updateTrackMetrics;

window.addEventListener("resize", () => {
    updateTrackMetrics();
    trackX = 0;
    track.style.left = trackX + "px";
    backgroundStopped = false;
});

// ==========================
//  TAPボタン
// ==========================
const tapButton = document.getElementById("tapButton");
let canTap = false;

tapButton.addEventListener("click", () => {
    if (!canTap) return;

    // 犬前進
    dogX += dogSpeed;
    dog.style.left = dogX + "px";

    // 背景スクロール（止まるまでは動く）
    if (!backgroundStopped) {
        trackX -= trackSpeed;

        if (trackX <= stopPosition) {
            trackX = stopPosition;
            backgroundStopped = true;  // ここからは犬だけ動く
        }

        track.style.left = trackX + "px";
    }

    checkGoal();
});

// ==========================
//  タイマー（本物の経過時間）
// ==========================
let time = 0;
let timerRunning = false;
let startTime = null;

setInterval(() => {
    if (timerRunning && startTime !== null) {
        const now = performance.now();
        time = (now - startTime) / 1000;
        document.getElementById("timer").textContent = time.toFixed(2) + " s";
    }
}, 50);

// ==========================
//  ゴール判定（犬の画像）
// ==========================
function checkGoal() {
    const dogRight = dogX + dog.clientWidth;
    const containerW = raceContainer.clientWidth;

    if (backgroundStopped && dogRight >= containerW - 10) {
        timerRunning = false;
        canTap = false;
        alert("GOAL!! Time: " + time.toFixed(2) + " s");
    }
}

// ==========================
// Tap to Start（カウントダウン）
// ==========================
const countdown = document.getElementById("countdown");
let screenTapped = false;

function startCountdown() {
    if (screenTapped) return;
    screenTapped = true;

    document.getElementById("overlay").style.display = "none";

    time = 0;
    startTime = null;
    timerRunning = false;

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
                startTime = performance.now();
                timerRunning = true;
            }, 500);
            clearInterval(interval);
        }
    }, 1000);
}

document.getElementById("overlay").addEventListener("click", startCountdown);
raceContainer.addEventListener("click", startCountdown);
