// ---------------- 犬画像 ----------------
const selectedDog = localStorage.getItem("selectedDog") || "dog1.png";
const dog = document.getElementById("dog");
dog.src = "dogs/" + selectedDog;

// ---------------- トラック設定 ----------------
const track = document.getElementById("track");
const raceContainer = document.getElementById("raceContainer");

let trackX = 0;
let trackWidth = 1919;   // ← onload が壊れても絶対この値を使う
let stopPosition = 0;
let backgroundStopped = false;

// 犬
let dogX = 0;
let dogSpeed = 9;

// スクロール速度
let trackSpeed = 9;

// ★ 完璧に決まっていた停止位置
const STOP_OFFSET = -105;

// ★ ゴール判定だけ調整
const GOAL_OFFSET = -40;

// -------------- 安全なロード処理（絶対に計算される） --------------
function calculateStopPosition() {
    const containerWidth = raceContainer.clientWidth;
    stopPosition = -(trackWidth - containerWidth) + STOP_OFFSET;
}

// onload が発火するなら使う
track.onload = () => {
    calculateStopPosition();
};

// 万が一 onload が動かなくても1秒後に強制実行
setTimeout(() => {
    if (stopPosition === 0) calculateStopPosition();
}, 1000);


// ---------------- TAPボタン ----------------
const tapButton = document.getElementById("tapButton");
let canTap = false;

tapButton.addEventListener("click", () => {
    if (!canTap) return;

    dogX += dogSpeed;
    dog.style.left = dogX + "px";

    // 背景スクロール
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


// ---------------- タイマー（絶対に1つだけ動くように保護） ----------------
let time = 0;
let timerRunning = false;

let timerStarted = false;
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
