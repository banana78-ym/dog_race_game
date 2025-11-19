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
let dogSpeed = 9;  // ← 少し遅く（あなたの希望どおり）

// スクロール速度
let trackSpeed = 9;

// ★★★★★ 絶対に変えないスクロール停止位置 ★★★★★
const STOP_OFFSET = -105;

// ★ ゴール判定を少し左に寄せる（あなたの希望）
const GOAL_OFFSET = -40;

// 計算されたスクロール停止位置
let stopPosition = 0;
let backgroundStopped = false;

track.onload = () => {
    const containerWidth = raceContainer.clientWidth;

    // ★ 画像本来の横幅（1919px）を強制使用してブレを0にする
    trackWidth = 1919;

    // ★ 1時間前にあなたが「完璧」と言った停止位置の計算式
    stopPosition = -(trackWidth - containerWidth) + STOP_OFFSET;
};

// ---------------- TAPボタン ----------------
const tapButton = document.getElementById("tapButton");
let canTap = false;

tapButton.addEventListener("click", () => {
    if (!canTap) return;

    // 犬は常に進む（スクロール停止後も）
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

// 0.01秒更新（正常版）
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
        alert("GOAL!! Time: " + time.toFixed(2) + " s");
    }
}

// ---------------- カウントダウン ----------------
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

