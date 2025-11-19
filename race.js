// ---------------- 犬画像 ----------------
const selectedDog = localStorage.getItem("selectedDog") || "dog1.png";
const dog = document.getElementById("dog");
dog.src = "dogs/" + selectedDog;

// ---------------- トラック設定 ----------------
const track = document.getElementById("track");
const raceContainer = document.getElementById("raceContainer");

let trackX = 0;
let trackWidth = 0;

// 犬
let dogX = 0;
let dogSpeed = 9; // ← 少し遅くした（前よりゆっくり）

// スクロール速度
let trackSpeed = 9;

// ★★★★★★ 完璧に決まった停止位置を絶対に使う ★★★★★★
const STOP_OFFSET = -105;

// ゴールを少し手前にする（あなたの希望）
const GOAL_OFFSET = -40;

let stopPosition = 0;
let backgroundStopped = false;

track.onload = () => {
    const containerWidth = raceContainer.clientWidth;

    // 画像本来の幅を強制使用（1919px）
    trackWidth = track.naturalWidth;

    // ゴールラインが見える位置
    stopPosition = -(trackWidth - containerWidth) + STOP_OFFSET;
};


// ---------------- TAPボタン ----------------
const tapButton = document.getElementById("tapButton");
let canTap = false;

tapButton.addEventListener("click", () => {
    if (!canTap) return;

    // 犬を右に動かす（常に動く）
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
    const containerWidth = raceContainer.clientWidth;

    const goalLine = containerWidth + GOAL_OFFSET;

    if (backgroundStopped && dogRight >= goalLine) {
        timerRunning = false;
        canTap = false;
        tapButton.style.display = "none";
        document.getElementById("restartButton").style.display = "block";
        alert("GOAL!! Time: " + time.toFixed(2) + " s");
    }
}


// ---------------- Restart ----------------
document.getElementById("restartButton").addEventListener("click", () => {
    window.location.reload();
});


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
