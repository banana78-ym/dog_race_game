// ---------------- 犬画像読み込み ----------------
const selectedDog = localStorage.getItem("selectedDog") || "dog1.png";
const dog = document.getElementById("dog");
dog.src = "dogs/" + selectedDog;

// ---------------- トラック設定 ----------------
const track = document.getElementById("track");
let trackX = 0;
let trackWidth = 0;
let trackSpeed = 5;
let goalPosition = 0;

track.onload = () => {
    // 画面幅（スマホ横画面の幅）
    const containerWidth = document.getElementById("raceContainer").clientWidth;

    // ★ 表示されているトラック画像の横幅（200%表示のため2倍）
    trackWidth = containerWidth * 2;

    // ★ ゴール位置（トラック右端が画面右端に来た瞬間）
    goalPosition = containerWidth - trackWidth;

    console.log("Visible Track Width:", trackWidth);
    console.log("Goal Position:", goalPosition);
};

// ---------------- 犬移動 ----------------
let dogX = 20;
let dogSpeed = 5;

// ---------------- TAPボタン ----------------
const tapButton = document.getElementById("tapButton");
let canTap = false;

tapButton.addEventListener("click", (e) => {
    e.preventDefault(); // ★ 連打時の拡大防止
    if (!canTap) return;

    dogX += dogSpeed;
    dog.style.left = dogX + "px";

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

// ---------------- ゴール判定（修正済） ----------------
function checkGoal() {
    if (trackWidth === 0) return;

    const containerWidth = document.getElementById("raceContainer").clientWidth;

    // ★ ゴール位置をスマホ画面に合わせて再計算
    goalPosition = containerWidth - trackWidth;

    if (trackX <= goalPosition) {
        track.style.left = goalPosition + "px";
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

    // ★「Tap to Start」文字とグレー背景を消す
    document.getElementById("tapText").style.display = "none";
    overlay.style.display = "none";

    // カウントダウン表示（TAPボタンは表示だけするが押せない）
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
                canTap = true;       // TAPボタン押せる
                timerRunning = true; // タイマー開始
            }, 500);
            clearInterval(interval);
        }
    }, 1000);
});
