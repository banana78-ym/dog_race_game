// ---------------- 犬画像 ----------------
const selectedDog = localStorage.getItem("selectedDog") || "dog1.png";
const dog = document.getElementById("dog");
dog.src = "dogs/" + selectedDog;

// ---------------- トラック設定 ----------------
const track = document.getElementById("track");
let trackX = 0;
let trackWidth = 0;
let trackSpeed = 7;     // 🔥 1タップで進む距離を少し増やした
let goalPosition = 0;
let containerWidth = 0;

// 犬の位置は固定（見切れ防止）
let dogX = 40;
dog.style.left = dogX + "px";

track.onload = () => {
    trackWidth = track.naturalWidth;
    containerWidth = document.getElementById("raceContainer").clientWidth;

    // 🔥 ゴールラインを画像右端より少し左に設定（50px手前をゴールに）
    goalPosition = containerWidth - trackWidth + 50;
};

// ---------------- タイマー（実測時間ベース） ----------------
let timerRunning = false;
let startTime = 0;

function updateTimer() {
    if (timerRunning) {
        const now = Date.now();
        const elapsed = (now - startTime) / 1000;
        document.getElementById("timer").textContent = elapsed.toFixed(2) + " s";
        requestAnimationFrame(updateTimer); // スムーズで正確
    }
}

// ---------------- 背景スクロール ----------------
function moveTrack() {
    if (trackX <= goalPosition) {
        // ゴールラインに到達
        trackX = goalPosition;
        track.style.left = trackX + "px";
        return true;
    }

    trackX -= trackSpeed;
    track.style.left = trackX + "px";
    return false;
}

function checkGoal() {
    if (moveTrack()) {
        timerRunning = false;
        alert("GOAL!!");
    }
}

// ---------------- TAPボタン ----------------
const tapButton = document.getElementById("tapButton");
let canTap = false;

tapButton.addEventListener("click", () => {
    if (!canTap) return;
    checkGoal();
});

// ---------------- Tap to Start → カウントダウン ----------------
const overlay = document.getElementById("overlay");
const tapText = document.getElementById("tapText");
const countdown = document.getElementById("countdown");

let screenTapped = false;

document.getElementById("raceContainer").addEventListener("click", () => {
    if (screenTapped) return;
    screenTapped = true;

    // オーバーレイ削除
    tapText.style.display = "none";
    overlay.style.display = "none";

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

                // 🔥 タイマーを実測開始！
                startTime = Date.now();
                timerRunning = true;
                updateTimer();

            }, 500);

            clearInterval(interval);
        }
    }, 1000);
});
