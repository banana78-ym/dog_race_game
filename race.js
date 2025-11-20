// ---------------- 犬画像 ----------------
const selectedDog = localStorage.getItem("selectedDog") || "dog1.png";
const dog = document.getElementById("dog");
dog.src = "dogs/" + selectedDog;

// ---------------- トラック設定 ----------------
const track = document.getElementById("track");
let trackX = 0;
let trackWidth = 0;

// 犬（左端スタート）
let dogX = 0;
let dogSpeed = 10;   // ← 走るスピード（あとで調整OK）

// スクロール速度
let trackSpeed = 9;

// ★★★★★ スクロール停止位置（絶対に変えない）★★★★★
const STOP_OFFSET = -105;

// ★ ゴール判定を手前にする（本番調整用）
const GOAL_OFFSET = -60;

// 計算される停止位置
let stopPosition = 0;

// トラック画像読み込み後
track.onload = () => {
    trackWidth = track.naturalWidth;
    const containerWidth = document.getElementById("raceContainer").clientWidth;

    // 完璧だったスクロール停止計算
    stopPosition = -(trackWidth - containerWidth) + STOP_OFFSET;
};


// ---------------- TAPボタン ----------------
const tapButton = document.getElementById("tapButton");
let canTap = false;
let backgroundStopped = false;

tapButton.addEventListener("click", () => {
    if (!canTap) return;

    // 犬は右に動き続ける（スクロール停止後も）
    dogX += dogSpeed;
    dog.style.left = dogX + "px";

    // 背景スクロール（停止位置まで）
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
        time += 0.01; // 正しい1/100秒
        document.getElementById("timer").textContent = time.toFixed(2) + " s";
    }
}, 10);


// ---------------- ゴール判定 ----------------
function checkGoal() {
    const dogRight = dogX + dog.clientWidth;
    const containerWidth = document.getElementById("raceContainer").clientWidth;

    // ゴール判定ライン（少し手前）
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

    // グレー画面消す
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
