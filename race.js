// ---------------- 犬画像 ----------------
const selectedDog = localStorage.getItem("selectedDog") || "dog1(2).png";
const dog = document.getElementById("dog");
dog.src = "dogs/" + selectedDog;

// ---------------- トラック設定 ----------------
const track = document.getElementById("track");
let trackX = 0;
let trackWidth = 0;

// 犬
let dogX = 0;             // 左端スタート
let dogSpeed = 10;        // 犬の速度（前より少し遅めにしてある）

// スクロール速度（変えない）
let trackSpeed = 9;

// ★ スクロール停止位置（完璧だった値）
const STOP_OFFSET = -105;

// ★ ゴール判定は「画像右端」に合わせる → 画像右端＝画面右端に来た位置
//    （ここだけ動かせばゴールのタイミングだけ変わる）
let goalLine = 0;

// 画像読み込み後に幅を取得してゴールライン計算
track.onload = () => {
    trackWidth = track.naturalWidth;
    const containerWidth = document.getElementById("raceContainer").clientWidth;

    // スクロールが止まる位置（絶対にいじらないと言った値）
    stopPosition = -(trackWidth - containerWidth) + STOP_OFFSET;

    // ★ ゴールラインは「画像の右端 = stopPosition 到達後の画面右端」
    //    → 犬の右端が containerWidth 近くに来たらゴール
    goalLine = containerWidth - 30; // 少し手前に調整したい時は -30 を -20 や -40 に変える
};

// ---------------- TAPボタン ----------------
const tapButton = document.getElementById("tapButton");
let canTap = false;
let backgroundStopped = false;

tapButton.addEventListener("click", () => {
    if (!canTap) return;

    // 犬は常に動く
    dogX += dogSpeed;
    dog.style.left = dogX + "px";

    // 背景スクロール（ゴールライン見えるまでは止めない）
    if (!backgroundStopped) {
        trackX -= trackSpeed;

        // 停止位置に到達した瞬間にスクロール停止
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

// ---------------- ゴール判定（画像右端ぴったり） ----------------
function checkGoal() {
    const dogRight = dogX + dog.clientWidth;

    // スクロール停止後、犬の右端が「goalLine」に触れたらゴール
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
