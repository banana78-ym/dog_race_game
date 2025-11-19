// ---------------- 犬画像 ----------------
const selectedDog = localStorage.getItem("selectedDog") || "dog1.png";
const dog = document.getElementById("dog");
dog.src = "dogs/" + selectedDog;

// ---------------- トラック ----------------
const track = document.getElementById("track");
let trackX = 0;
let trackWidth = 0;
let trackSpeed = 6;

// 犬
let dogX = 20;
let dogSpeed = 10;

// 背景停止フラグ
let backgroundStopped = false;

track.onload = () => {
    trackWidth = track.naturalWidth;

    const containerWidth = document.getElementById("raceContainer").clientWidth;

    // 背景のゴール位置（画像端がぴったり画面右に来る位置）
    goalPosition = -(trackWidth - containerWidth);
};

// ---------------- TAPボタン ----------------
const tapButton = document.getElementById("tapButton");
let canTap = false;

tapButton.addEventListener("click", () => {
    if (!canTap) return;

    // 犬は常に動く
    dogX += dogSpeed;
    dog.style.left = dogX + "px";

    // 背景が止まってないならスクロール
    if (!backgroundStopped) {
        trackX -= trackSpeed;

        if (trackX <= goalPosition) {
            trackX = goalPosition;      // 背景を固定する
            backgroundStopped = true;   // 背景停止フラグON
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

    // 犬が画面右側のゴールラインを通過したら
    if (dogRight >= containerWidth - 20) {
        timerRunning = false;
        canTap = false;
        alert("GOAL!! Time: " + time.toFixed(2) + " s");
    }
}

// ---------------- Tap to Start カウントダウン ----------------
const countdown = document.getElementById("countdown");
let screenTapped = false;

document.getElementById("raceContainer").addEventListener("click", () => {
    if (screenTapped) return;
    screenTapped = true;

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
            }, 400);
            clearInterval(interval);
        }
    }, 1000);
});
