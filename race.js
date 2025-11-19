// ---------------- 犬画像 ----------------
const selectedDog = localStorage.getItem("selectedDog") || "dog1.png";
const dog = document.getElementById("dog");
dog.src = "dogs/" + selectedDog;


// ---------------- トラック設定 ----------------
const track = document.getElementById("track");

let trackX = 0;          // 背景の X 位置
let trackWidth = 0;      // 背景画像の横幅
let backgroundStopped = false;

// 犬
let dogX = 0;            // ← 犬は画像の左端からスタート
let dogSpeed = 10;       // 犬の1タップ移動量（少し遅めに調整）

// 背景スクロール速度
let trackSpeed = 6;      

// ★★★ ゴールライン調整値（ここが今回の超重要ポイント） ★★★
// 早く止まる → 値をもっとマイナスへ
// 黒が出る → 値を 0 に近づける
const GOAL_MARGIN = -7S0;

// 計算されるスクロール停止位置
let stopPosition = 0;


// ---------------- トラック画像読み込み後 ----------------
track.onload = () => {
    trackWidth = track.naturalWidth;

    const containerWidth = document.getElementById("raceContainer").clientWidth;

    // ゴールラインが画面右端に来る位置
    stopPosition = -(trackWidth - containerWidth) + GOAL_MARGIN;
};


// ---------------- TAPボタン ----------------
const tapButton = document.getElementById("tapButton");
let canTap = false;

tapButton.addEventListener("click", () => {
    if (!canTap) return;

    // 犬前進（スクロール止まってても動く）
    dogX += dogSpeed;
    dog.style.left = dogX + "px";

    // 背景スクロール（ゴールライン見えるまで止めない）
    if (!backgroundStopped) {
        trackX -= trackSpeed;

        if (trackX <= stopPosition) {
            trackX = stopPosition;
            backgroundStopped = true;   // ← ここで初めてスクロール停止！
        }

        track.style.left = trackX + "px";
    }

    checkGoal();
});


// ---------------- タイマー ----------------
let time = 0;
let timerRunning = false;

// 正しい1/100秒(0.01s)ごとに更新
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

    // 背景が止まった後、犬が画面右端に到達したらゴール
    if (backgroundStopped && dogRight >= containerWidth - 20) {
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

    // オーバーレイ消す
    document.getElementById("overlay").style.display = "none";

    // カウントダウン
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

// overlay と画面どちらタップでもスタート
document.getElementById("overlay").addEventListener("click", startCountdown);
document.getElementById("raceContainer").addEventListener("click", startCountdown);
