// ---------------- 犬画像 ----------------
const selectedDog = localStorage.getItem("selectedDog") || "dog1.png";
const dog = document.getElementById("dog");
dog.src = "dogs/" + selectedDog;

// ---------------- トラック ----------------
const track = document.getElementById("track");
let trackX = 0;
let trackWidth = 0;
let trackSpeed = 8;

// 犬
let dogX = 20;
let dogSpeed = 14;

// 背景停止フラグ
let backgroundStopped = false;

// ゴール位置 (画像端が画面右端に届く位置)
let goalPosition = 0;

track.onload = () => {
    trackWidth = track.naturalWidth;

    const containerWidth = document.getElementById("raceContainer").clientWidth;

    // 画像右端が画面右端に一致した瞬間の位置
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

    // 背景スクロール（ゴールラインが見えるまで）
    if (!backgroundStopped) {
        trackX -= trackSpeed;

        if (trackX <= goalPosition) {
            trackX = goalPosition;
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

    // ゴールラインが画面右に見えている前提
    // 犬がそこを超えたらゴール
    if (backgroundStopped && dogRight >= containerWidth - 10) {
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

    // グレーの overlay と文字を消す
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


// overlay と container 両方でスタート可能にする
document.getElementById("overlay").addEventListener("click", startCountdown);
document.getElementById("raceContainer").addEventListener("click", startCountdown);
