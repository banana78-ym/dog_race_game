// ---------------- 犬画像 ----------------
const selectedDog = localStorage.getItem("selectedDog") || "dog1.png";
const dog = document.getElementById("dog");
dog.src = "dogs/" + selectedDog;

// ---------------- トラック設定 ----------------
const track = document.getElementById("track");
let trackX = 0;                    // トラックの左位置（スクロール用）
let trackWidth = 0;                // トラック画像の実幅
let trackSpeed = 5;                // スクロール速度
let goalPosition = 0;              // ゴール位置
let containerWidth = 0;

// 犬の位置は常に固定！画面から見切れさせない
let dogX = 40;   
dog.style.left = dogX + "px";

track.onload = () => {
    trackWidth = track.naturalWidth;
    containerWidth = document.getElementById("raceContainer").clientWidth;

    // ゴール位置 = 画面右端にゴールラインが見える位置
    goalPosition = containerWidth - trackWidth;

    console.log("Track width:", trackWidth);
    console.log("Goal position:", goalPosition);
};

// ---------------- TAPボタン ----------------
const tapButton = document.getElementById("tapButton");
let canTap = false;

// ---------------- タイマー ----------------
let time = 0;
let timerRunning = false;

setInterval(() => {
    if (timerRunning) {
        time += 0.01;
        document.getElementById("timer").textContent = time.toFixed(2) + " s";
    }
}, 10);

// ---------------- 背景スクロール＋ゴール判定 ----------------
function moveTrack() {
    // すでにゴールに到達していたら、スクロール止める
    if (trackX <= goalPosition) {
        trackX = goalPosition;
        track.style.left = trackX + "px";
        return true; // ゴール到達
    }

    // スクロールする
    trackX -= trackSpeed;
    track.style.left = trackX + "px";
    return false;
}

function checkGoal() {
    if (moveTrack() === true) {
        alert("GOAL!! Time: " + time.toFixed(2) + "s");
        canTap = false;
        timerRunning = false;
    }
}

// ---------------- TAP ボタンで進む ----------------
tapButton.addEventListener("click", () => {
    if (!canTap) return;

    checkGoal();
});

// ---------------- カウントダウン ----------------
const overlay = document.getElementById("overlay");
const tapText = document.getElementById("tapText");
const countdown = document.getElementById("countdown");
let screenTapped = false;

document.getElementById("raceContainer").addEventListener("click", () => {
    if (screenTapped) return;
    screenTapped = true;

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
                timerRunning = true;
            }, 500);
            clearInterval(interval);
        }
    }, 1000);
});
