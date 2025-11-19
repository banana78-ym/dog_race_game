// ---------------- 犬画像 ----------------
const selectedDog = localStorage.getItem("selectedDog") || "dog1.png";
const dog = document.getElementById("dog");
dog.src = "dogs/" + selectedDog;

// ---------------- トラック ----------------
const track = document.getElementById("track");
let trackX = 0;
let trackWidth = 0;

// スクロール速度（犬を追う）
let trackSpeed = 10;

// 犬
let dogX = 20;
let dogSpeed = 16;

// 背景停止フラグ
let backgroundStopped = false;

// ゴール位置（後から計算）
let goalPosition = 0;

// ★★★★★ ここが今回一番重要な修正ポイント ★★★★★
track.onload = () => {
    trackWidth = track.naturalWidth;

    const containerWidth = document.getElementById("raceContainer").clientWidth;

    // ---- ゴールラインの位置補正 ----
    // あなたの画像右端から「ゴールラインまでの距離 px」
    // ※必要なら後で数字だけ少し調整すれば、必ずピッタリ合う
    const goalLineOffset = 250;

    // ゴールラインが画面右端に見える位置
    goalPosition = -(trackWidth - containerWidth - goalLineOffset);

    console.log("Track width:", trackWidth);
    console.log("Goal stop position:", goalPosition);
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

    // 背景が完全停止（ゴールラインが見えている）
    // ＋ 犬が画面右端に到達したらゴール
    if (backgroundStopped && dogRight >= containerWidth - 5) {
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

    // グレー overlay 消す
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
