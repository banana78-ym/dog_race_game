// ---------------- 犬画像 ----------------
const selectedDog = localStorage.getItem("selectedDog") || "dog1.png";
const dog = document.getElementById("dog");
dog.src = "dogs/" + selectedDog;

// ---------------- トラック設定 ----------------
const track = document.getElementById("track");
let trackX = 0;
let trackWidth = 0;

// 犬
let dogX = 0;            
let dogSpeed = 12;       

// スクロール速度
let trackSpeed = 9;

// ★★★★★ 絶対に変えないスクロール停止位置オフセット ★★★★★
const STOP_OFFSET = -105;

// ★ ゴール判定を少し手前にする（ここだけを調整）★
const GOAL_OFFSET = -80; // ← ここだけ変更（もっと手前にしたいなら -100 など）

// 計算される最終停止位置
let stopPosition = 0;

track.onload = () => {
    trackWidth = track.naturalWidth;
    const containerWidth = document.getElementById("raceContainer").clientWidth;

    // ★ 完璧だった停止位置計算式（変更禁止）
    stopPosition = -(trackWidth - containerWidth) + STOP_OFFSET;
};

// ---------------- TAPボタン ----------------
const tapButton = document.getElementById("tapButton");
let canTap = false;
let backgroundStopped = false;

tapButton.addEventListener("click", () => {
    if (!canTap) return;

    // 犬を右に動かす（スクロール停止後も動く）
    dogX += dogSpeed;
    dog.style.left = dogX + "px";

    // 背景スクロール（STOP_POSITIONまで）
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

    // ★ ゴール判定を少しだけ手前にする（GOAL_OFFSET を反映）
    const goalLine = containerWidth + GOAL_OFFSET;

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
