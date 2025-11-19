// ---------------- 犬画像 ----------------
const selectedDog = localStorage.getItem("selectedDog") || "dog1.png";
const dog = document.getElementById("dog");
dog.src = "dogs/" + selectedDog;

// 犬の初期位置（画面左から 20px）
let dogX = 20;

// ---------------- トラック ----------------
const track = document.getElementById("track");
let trackX = 0;
let trackWidth = 0;

// 速度
let trackSpeed = 10;
let dogSpeed = 14;

// フラグ
let backgroundStopped = false;

// ゴール位置（後で確定）
let goalPosition = 0;

track.onload = () => {
    trackWidth = track.naturalWidth;

    const containerWidth = document.getElementById("raceContainer").clientWidth;

    // ★ 画像の本当の端が画面に出る位置（絶対に間違えない公式）
    goalPosition = -(trackWidth - containerWidth);

    console.log("trackWidth:", trackWidth);
    console.log("containerWidth:", containerWidth);
    console.log("goalPosition:", goalPosition);
};


// ---------------- TAPボタン ----------------
const tapButton = document.getElementById("tapButton");
let canTap = false;

tapButton.addEventListener("click", () => {
    if (!canTap) return;

    const containerWidth = document.getElementById("raceContainer").clientWidth;

    // 犬の右端位置を算出
    const dogRight = dogX + dog.clientWidth;

    // ★ 犬が画面右端の 70% 以上に行き過ぎないように制御する
    if (dogRight < containerWidth * 0.7) {
        dogX += dogSpeed;
        dog.style.left = dogX + "px";
    }

    // 背景スクロール（ゴールラインが画面に見えるまで）
    if (!backgroundStopped) {
        trackX -= trackSpeed;

        if (trackX <= goalPosition) {
            trackX = goalPosition;
            backgroundStopped = true; // ここで初めて止まる
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

    // ★ ゴールラインが見えていて、犬が画面右端に届いたらゴール
    if (backgroundStopped && dogRight >= containerWidth - 20) {
        canTap = false;
        timerRunning = false;
        alert("GOAL!! Time: " + time.toFixed(2) + " s");
    }
}


// ---------------- Tap to Start カウントダウン ----------------
const countdown = document.getElementById("countdown");
let screenTapped = false;

function startCountdown() {
    if (screenTapped) return;
    screenTapped = true;

    document.getElementById("overlay").style.display = "none"; // グレー消す

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
