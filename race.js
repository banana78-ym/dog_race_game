// ---------------- 犬画像 ----------------
const selectedDog = localStorage.getItem("selectedDog") || "dog1.png";
const dog = document.getElementById("dog");
dog.src = "dogs/" + selectedDog;

// ---------------- トラック設定 ----------------
const track = document.getElementById("track");
let trackX = 0;
let trackWidth = 0;
let backgroundStopped = false;

// 犬
let dogX = 0;              // 左端スタート
let dogSpeed = 12;         // 犬の進み具合

// スクロール速度
let trackSpeed = 9;

// ゴール調整
const GOAL_MARGIN = 340;
let stopPosition = 0;

// トラック画像読み込み後
track.onload = () => {
    trackWidth = track.naturalWidth;
    const containerWidth = document.getElementById("raceContainer").clientWidth;

    stopPosition = -(trackWidth - containerWidth) + GOAL_MARGIN;
};

// ---------------- TAPボタン ----------------
const tapButton = document.getElementById("tapButton");
let canTap = false;

tapButton.addEventListener("click", () => {
    if (!canTap) return;

    // 犬は常に動く（スクロールが止まっても止まらない）
    dogX += dogSpeed;
    dog.style.left = dogX + "px";

    // 背景スクロール（ゴールライン見えるまで）
    if (!backgroundStopped) {
        trackX -= trackSpeed;

        if (trackX <= stopPosition) {
            trackX = stopPosition;
            backgroundStopped = true;   // ← 背景だけ止まる
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
        time += 0.01;
        document.getElementById("timer").textContent = time.toFixed(2) + " s";
    }
}, 10);

// ---------------- ゴール判定 ----------------
function checkGoal() {
    const dogRight = dogX + dog.clientWidth; 
    const containerWidth = document.getElementById("raceContainer").clientWidth;

    // 背景停止後 → 犬だけ右に進んでゴール判定
    if (backgroundStopped && dogRight >= containerWidth - 20) {
        timerRunning = false;
        canTap = false;
        alert("GOAL!! Time: " + time.toFixed(2) + " s");
    }
}

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
