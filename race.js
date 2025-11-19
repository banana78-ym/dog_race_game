// ---------------- 犬画像読み込み ----------------
const selectedDog = localStorage.getItem("selectedDog") || "dog1.png";
const dog = document.getElementById("dog");
dog.src = "dogs/" + selectedDog;

// ------------------------------------------------
//  犬は固定位置（中央やや左）
// ------------------------------------------------
let dogX = 80;               // ← 犬の固定位置（スマホの横画面向け）
dog.style.left = dogX + "px";

// ---------------- トラック設定 ----------------
const track = document.getElementById("track");
let trackX = 0;
let trackWidth = 0;
let trackSpeed = 8;

// ゴール判定距離（微調整用）
let goalOffset = 80;   // ← 犬が本物ゴールラインより手前でゴールできる補正

let goalPosition = 0;

track.onload = () => {
    const containerWidth = document.getElementById("raceContainer").clientWidth;

    // 200% 表示だから見えてる横幅 = 実幅の2倍
    trackWidth = containerWidth * 2;

    // ゴール位置（背景がここまで左へ移動したらゴール）
    goalPosition = containerWidth - trackWidth + goalOffset;

    console.log("Goal Position:", goalPosition);
};

// ---------------- TAPボタン ----------------
const tapButton = document.getElementById("tapButton");
let canTap = false;

tapButton.addEventListener("click", (e) => {
    e.preventDefault(); // 連打でもズームしないようにする

    if (!canTap) return;

    // 背景を左へスクロール（犬は動かさない）
    trackX -= trackSpeed;
    track.style.left = trackX + "px";

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

// ---------------- ゴール判定（修正版） ----------------
function checkGoal() {
    if (trackWidth === 0) return;

    // ゴールライン（画像右端）が見えたらスクロール停止
    if (trackX <= goalPosition) {
        track.style.left = goalPosition + "px"; // 完全停止

        alert("GOAL!! Time: " + time.toFixed(2) + "s");

        canTap = false;
        timerRunning = false;
    }
}

// ---------------- 画面タップでカウントダウン開始 ----------------
const countdown = document.getElementById("countdown");
const overlay = document.getElementById("overlay");
let screenTapped = false;

document.getElementById("raceContainer").addEventListener("click", () => {
    if (screenTapped) return;
    screenTapped = true;

    document.getElementById("tapText").style.display = "none";
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
