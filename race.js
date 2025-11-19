// ---------------- 犬画像 ----------------
const selectedDog = localStorage.getItem("selectedDog") || "dog1.png";
const dog = document.getElementById("dog");
dog.src = "dogs/" + selectedDog;

// ---------------- トラック設定 ----------------
const track = document.getElementById("track");
let trackX = 0;
let trackWidth = 0;
let backgroundStopped = false;

// 犬（左端スタート）
let dogX = 0;
let dogSpeed = 12;

// スクロール速度（今の完璧な速度）
let trackSpeed = 9;

// スクロール停止位置調整（あなたの画像に最適化済み）
const STOP_OFFSET = -48;   // ← ここはもう触らなくてOK！（完璧だった値）

let stopPosition = 0;

// トラック画像読み込み後に幅取得
track.onload = () => {
    trackWidth = track.naturalWidth;
    const containerWidth = document.getElementById("raceContainer").clientWidth;

    stopPosition = -(trackWidth - containerWidth) + STOP_OFFSET;
};


// ---------------- TAPボタン ----------------
const tapButton = document.getElementById("tapButton");
let canTap = false;

tapButton.addEventListener("click", () => {
    if (!canTap) return;

    // 犬を右に進める（スクロール止まっても進む）
    dogX += dogSpeed;
    dog.style.left = dogX + "px";

    // 背景スクロール（ゴールライン見えるまでは止めない）
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

// 正しい 0.01 秒更新（問題なし）
setInterval(() => {
    if (timerRunning) {
        time += 0.01;
        document.getElementById("timer").textContent = time.toFixed(2) + " s";
    }
}, 10);


// ---------------- ゴール判定 ----------------
// ※今回修正したのはここだけ！(-40px 判定)
function checkGoal() {
    const dogRight = dogX + dog.clientWidth;
    const containerWidth = document.getElementById("raceContainer").clientWidth;

    // ★ -20 → -40 に変更（少し早めにゴール）
    if (backgroundStopped && dogRight >= containerWidth - 40) {
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

// overlay & container 両方でスタート可能
document.getElementById("overlay").addEventListener("click", startCountdown);
document.getElementById("raceContainer").addEventListener("click", startCountdown);
