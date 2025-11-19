// ---------------- 犬画像 ----------------
const selectedDog = localStorage.getItem("selectedDog") || "dog1.png";
const dog = document.getElementById("dog");
dog.src = "dogs/" + selectedDog;

// 犬の初期位置（絶対左から）
let dogX = 20;

// ---------------- トラック ----------------
const track = document.getElementById("track");
let trackX = 0;
let trackWidth = 0;
let backgroundStopped = false;

let trackSpeed = 10;
let dogSpeed = 14;

let goalPosition = 0;

track.onload = () => {
    const containerWidth = document.getElementById("raceContainer").clientWidth;
    trackWidth = track.naturalWidth;

    // ★画像の右端が画面右にちょうど来る位置（絶対正しい計算）
    goalPosition = -(trackWidth - containerWidth);
};


// ---------------- TAPボタン ----------------
const tapButton = document.getElementById("tapButton");
let canTap = false;

tapButton.addEventListener("click", () => {
    if (!canTap) return;

    // 犬は常に走る（左から右へ）
    dogX += dogSpeed;
    dog.style.left = dogX + "px";

    // 背景スクロールはゴールラインが見えるまで止めない
    if (!backgroundStopped) {
        trackX -= trackSpeed;

        if (trackX <= goalPosition) {
            trackX = goalPosition;      // ゴールラインが見えた
            backgroundStopped = true;   // ★やっと止めてOK
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
    const containerWidth = document.getElementById("raceContainer").clientWidth;
    const dogRight = dogX + dog.clientWidth;

    // ★背景が止まり、犬が画面右端に来たらゴール
    if (backgroundStopped && dogRight >= containerWidth - 20) {
        canTap = false;
        timerRunning = false;
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
