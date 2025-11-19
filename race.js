// ---------------- 犬画像 ----------------
const selectedDog = localStorage.getItem("selectedDog") || "dog1.png";
const dog = document.getElementById("dog");
dog.src = "dogs/" + selectedDog;

// ---------------- トラック設定 ----------------
const track = document.getElementById("track");
const raceContainer = document.getElementById("raceContainer");

let trackX = 0;
let trackWidth = 0;
let stopPosition = 0;
let backgroundStopped = false;

// 犬
let dogX = 0;
let dogSpeed = 9;  // ← 少しだけ遅く（前よりゆっくり）

// スクロール速度
let trackSpeed = 9;

// ★ スクロール停止位置（絶対に変更しない基準値）
const STOP_OFFSET = -105;

// ★ ゴール判定位置（少し手前に）
const GOAL_OFFSET = -40;


// ------------------------------------------------------------
// 画像ロード後に stopPosition が確実に設定されるようにする
// ------------------------------------------------------------
function initTrack() {
    trackWidth = track.naturalWidth;

    // 読み込めてない場合 → 画像読み込み待ち
    if (!trackWidth || trackWidth === 0) {
        setTimeout(initTrack, 50);
        return;
    }

    const containerWidth = raceContainer.clientWidth;

    // ゴールラインがちょうど見える位置
    stopPosition = -(trackWidth - containerWidth) + STOP_OFFSET;
}

track.onload = initTrack;
initTrack(); // 念のため二重で初期化 → これが stopPosition 未設定バグを防ぐ


// ---------------- TAPボタン ----------------
const tapButton = document.getElementById("tapButton");
let canTap = false;

tapButton.addEventListener("click", () => {
    if (!canTap) return;

    // 犬はスクロール停止後も走り続ける
    dogX += dogSpeed;
    dog.style.left = dogX + "px";

    // 背景スクロール（STOP位置まで）
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

// setInterval は1つだけ動かす（タイマーずれ防止）
setInterval(() => {
    if (timerRunning) {
        time += 0.01;
        document.getElementById("timer").textContent = time.toFixed(2) + " s";
    }
}, 10);


// ---------------- ゴール判定 ----------------
function checkGoal() {
    const dogRight = dogX + dog.clientWidth;
    const containerWidth = raceContainer.clientWidth;

    const goalLine = containerWidth + GOAL_OFFSET;

    if (backgroundStopped && dogRight >= goalLine) {
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
