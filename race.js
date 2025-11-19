// ---------------- 犬画像 ----------------
const selectedDog = localStorage.getItem("selectedDog") || "dog1.png";
const dog = document.getElementById("dog");
dog.src = "dogs/" + selectedDog;

// 犬は左固定
let dogX = 30;
dog.style.left = dogX + "px";

// ---------------- トラック（背景） ----------------
const track = document.getElementById("track");

let trackX = 0;
let trackWidth = 0;
let containerWidth = 0;

let trackSpeed = 14;   // ← 犬より速く背景が動くように
let dogRunSpeed = 12;  // ← 犬の1タップ移動量

let backgroundStopped = false;
let trueGoalX = 0;

// 画像読み込み後に幅取得
track.onload = () => {
    trackWidth = track.naturalWidth;
    containerWidth = document.getElementById("raceContainer").clientWidth;

    // ゴールライン（黒白）が画面右端に来る位置
    trueGoalX = trackWidth - containerWidth;  
};


// ---------------- TAP ----------------
const tapButton = document.getElementById("tapButton");
let canTap = false;

tapButton.addEventListener("click", () => {
    if (!canTap) return;

    // 1) まず背景スクロール（ゴールラインが見えるまで）
    if (!backgroundStopped) {

        trackX -= trackSpeed;

        // ゴールラインが画面に見える位置まで来たら止める
        if (-trackX >= trueGoalX) {
            trackX = -trueGoalX;
            backgroundStopped = true;
        }

        track.style.left = trackX + "px";
    }

    // 2) その後だけ犬を右へ走らせる（画面内で）
    else {
        dogX += dogRunSpeed;
        dog.style.left = dogX + "px";
    }

    checkGoal();
});


// ---------------- タイマー ----------------
let time = 0;
let timerRunning = false;

setInterval(() => {
    if (timerRunning) {
        time += 0.1;
        document.getElementById("timer").textContent = time.toFixed(1) + " s";
    }
}, 100);


// ---------------- ゴール判定 ----------------
function checkGoal() {
    if (!backgroundStopped) return;

    // 犬がゴールラインを通過したらゴール
    if (dogX >= containerWidth - 70) {
        timerRunning = false;
        canTap = false;
        alert("GOAL!!! Time: " + time.toFixed(1) + " s");
    }
}


// ---------------- Tap to Start ----------------
const countdown = document.getElementById("countdown");
let screenTapped = false;

function startCountdown() {
    if (screenTapped) return;
    screenTapped = true;

    // overlayを確実に消す
    const overlay = document.getElementById("overlay");
    overlay.style.display = "none";
    overlay.style.pointerEvents = "none";

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
