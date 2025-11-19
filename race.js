// ---------------- 犬画像 ----------------
const selectedDog = localStorage.getItem("selectedDog") || "dog1.png";
const dog = document.getElementById("dog");
dog.src = "dogs/" + selectedDog;

// ---------------- トラック設定 ----------------
const track = document.getElementById("track");
let trackX = 0;
let trackWidth = 0;
let backgroundStopped = false;

// 犬
let dogX = 0;           
let dogSpeed = 10;       // ← ここで犬の進む量調整可能（速すぎるなら 8 にする）

// スクロール速度
let trackSpeed = 7;

// 実際に計算される停止位置
let stopPosition = 0;

track.onload = () => {

    trackWidth = track.naturalWidth;
    const containerWidth = document.getElementById("raceContainer").clientWidth;

    // 画像右端が画面右にピッタリ来る理想の計算式（ズレなし）
    stopPosition = -(trackWidth - containerWidth);

    console.log("STOP POSITION:", stopPosition);
};


// ---------------- TAPボタン ----------------
const tapButton = document.getElementById("tapButton");
let canTap = false;

tapButton.addEventListener("click", () => {
    if (!canTap) return;

    // 犬は常に走る
    dogX += dogSpeed;
    dog.style.left = dogX + "px";

    // 背景は「ゴールラインが見えるまで」スクロール
    if (!backgroundStopped) {
        trackX -= trackSpeed;

        if (trackX <= stopPosition) {
            trackX = stopPosition;     // ← 正確に停止位置で止まる
            backgroundStopped = true;  // ← ここからは犬だけ動く
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

    // ゴールラインが見えている（= backgroundStopped が true）
    // 犬が画面右ギリギリに触れたら GOAL
    if (backgroundStopped && dogRight >= containerWidth - 15) {
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
