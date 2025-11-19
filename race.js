// ---------------- 犬画像 ----------------
const selectedDog = localStorage.getItem("selectedDog") || "dog1.png";
const dog = document.getElementById("dog");
dog.src = "dogs/" + selectedDog;

// ---------------- トラック ----------------
const track = document.getElementById("track");
let trackX = 0;
let trackWidth = 0;

// ↓ スクロール速度
let trackSpeed = 10;

// 犬移動量（1タップ）
let dogSpeed = 14;

// 犬の初期位置（画面左）
let dogX = 20;

// ストップフラグ
let backgroundStopped = false;

// 最終停止位置（ゴールが画面に入る位置）
let stopPosition = 0;

track.onload = () => {

    // 描画後の横幅を確実に取得
    trackWidth = track.getBoundingClientRect().width;

    const containerWidth = document.getElementById("raceContainer").clientWidth;

    // ★ ゴールライン位置の調整 ★
    //   あなたのスクショをもとに「ゴールが画面右端にジャストで入る位置」
    //   → 最後のゴール画像の幅を  -240px で合わせる
    const GOAL_MARGIN = 240; // ← ★この数字をいじれば微調整できる（今はベスト値）

    stopPosition = -(trackWidth - containerWidth + GOAL_MARGIN);

    console.log("trackWidth =", trackWidth);
    console.log("stopPosition =", stopPosition);
};

// ---------------- TAPボタン ----------------
tapButton.addEventListener("click", () => {
    if (!canTap) return;

    // 犬は常に右へ（止まらない）
    dogX += dogSpeed;
    dog.style.left = dogX + "px";

    // 背景スクロール（ゴールが画面に映るまで）
    if (!backgroundStopped) {

        trackX -= trackSpeed;

        // ★ ゴールラインが画面に入ったら STOP
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

    // ★背景 STOP 後に、犬が右端に着いたらゴール
    if (backgroundStopped && dogRight >= containerWidth - 10) {
        timerRunning = false;
        canTap = false;
        alert("GOAL!! Time: " + time.toFixed(2) + " s");
    }
}

// ---------------- カウントダウン（変更なし） ----------------
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
