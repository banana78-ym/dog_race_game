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
    trackWidth = track.naturalWidth;
    console.log("Track width:", trackWidth);

    // ゴール判定を画像幅に合わせる（余白ゼロ）
    const containerWidth = document.getElementById("raceContainer").clientWidth;
    goalPosition = containerWidth - trackWidth;
    console.log("Goal position:", goalPosition);
};

// ---------------- 犬移動 ----------------
let dogX = 20;
let dogSpeed = 5;

// ---------------- TAPボタン ----------------
const tapButton = document.getElementById("tapButton");
let canTap = false;

tapButton.addEventListener("click", () => {
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

// ---------------- ゴール判定 ----------------
function checkGoal() {
    if (trackWidth === 0) return;

    // 画像の実際の幅でゴール判定（scaleX は無視）
    const containerWidth = document.getElementById("raceContainer").clientWidth;
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
let screenTapped = false;

document.getElementById("raceContainer").addEventListener("click", () => {
    if (screenTapped) return;
    screenTapped = true;

    // カウントダウン表示 & TAPボタン表示（押せない）
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
