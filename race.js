// ---------------- 犬画像 ----------------
const selectedDog = localStorage.getItem("selectedDog") || "dog1.png";
const dog = document.getElementById("dog");
dog.src = "dogs/" + selectedDog;


// ---------------- トラック ----------------
const track = document.getElementById("track");
let trackX = 0;
let trackWidth = 0;

// 犬の位置
let dogX = 0;
let dogSpeed = 10;   // ← 犬スピード（あとで微調整OK）

// スクロール
let trackSpeed = 9;
let backgroundStopped = false;

// ◆ あなたが「完璧だったスクロール停止位置」
const STOP_OFFSET = -105;

// ◆ ゴール判定をもう少し手前にしたいとき変更する
let GOAL_OFFSET = -40;

// 計算される最終的な停止位置
let stopPosition = 0;

track.onload = () => {
    trackWidth = track.naturalWidth;
    const containerWidth = document.getElementById("raceContainer").clientWidth;

    // あなたが「完璧」と言った停止位置の再現
    stopPosition = -(trackWidth - containerWidth) + STOP_OFFSET;
};


// ---------------- TAPボタン ----------------
const tapButton = document.getElementById("tapButton");
let canTap = false;

tapButton.addEventListener("click", () => {
    if (!canTap) return;

    // 犬はスクロールが止まっても走る
    dogX += dogSpeed;
    dog.style.left = dogX + "px";

    // 背景スクロール（ゴールが見えるまで停止しない）
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


// ---------------- タイマー（リアル1秒の正確版） ----------------
let startTime = 0;
let timerRunning = false;

function updateTimer() {
    if (timerRunning) {
        const now = performance.now();
        const elapsed = (now - startTime) / 1000;
        document.getElementById("timer").textContent = elapsed.toFixed(2) + " s";
    }
    requestAnimationFrame(updateTimer);
}

requestAnimationFrame(updateTimer);


// ---------------- ゴール判定 ----------------
function checkGoal() {
    const dogRight = dogX + dog.clientWidth;
    const containerWidth = document.getElementById("raceContainer").clientWidth;

    const goalLine = containerWidth + GOAL_OFFSET;

    if (backgroundStopped && dogRight >= goalLine) {
        timerRunning = false;
        canTap = false;
        alert("GOAL!! Time: " + document.getElementById("timer").textContent);
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
                startTime = performance.now();  // ← 正確なタイマー開始
                timerRunning = true;
            }, 500);
            clearInterval(interval);
        }
    }, 1000);
}

document.getElementById("overlay").addEventListener("click", startCountdown);
document.getElementById("raceContainer").addEventListener("click", startCountdown);
