// ---------------- 犬画像 ----------------
const selectedDog = localStorage.getItem("selectedDog") || "dog1.png";
const dog = document.getElementById("dog");
dog.src = "dogs/" + selectedDog;

// 犬は画面中央に固定
dog.style.left = "50%";
dog.style.transform = "translateX(-50%)";


// ---------------- トラック設定 ----------------
const track = document.getElementById("track");
let trackX = 0;
let trackWidth = 0;
let trackSpeed = 12;       // 背景スクロールの速さ（調整可）

let backgroundStopped = false;
let goalPosition = 0;


track.onload = () => {
    trackWidth = track.naturalWidth; // ★ ここが1919px になる
    const containerWidth = document.getElementById("raceContainer").clientWidth;

    // ★ ゴールライン（画像右端）が画面右端に来た位置
    goalPosition = -(trackWidth - containerWidth);

    console.log("trackWidth:", trackWidth);
    console.log("goalPosition:", goalPosition);
};


// ---------------- TAPボタン ----------------
const tapButton = document.getElementById("tapButton");
let canTap = false;


// ---------------- 犬の動き（中央固定なのでXは固定） ----------------
tapButton.addEventListener("click", () => {
    if (!canTap) return;

    // 背景スクロール（ゴールラインが見えるまで）
    if (!backgroundStopped) {
        trackX -= trackSpeed;

        if (trackX <= goalPosition) {
            trackX = goalPosition;      // ★ ゴールラインが見える位置でピタッと停止
            backgroundStopped = true;   // ★ ここで止める
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
        time += 0.01;                      // ★ 1秒 = 1秒でちゃんと進む
        document.getElementById("timer").textContent = time.toFixed(2) + " s";
    }
}, 10);


// ---------------- ゴール判定 ----------------
function checkGoal() {

    // ★ 背景が完全に止まっている（ゴールラインが見えている）
    if (backgroundStopped) {
        alert("GOAL!! Time: " + time.toFixed(2) + " s");
        timerRunning = false;
        canTap = false;
    }
}


// ---------------- Tap to Start カウントダウン ----------------
const countdown = document.getElementById("countdown");
let screenTapped = false;

function startCountdown() {
    if (screenTapped) return;
    screenTapped = true;

    // overlay削除
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


// overlay と container どちらでもスタート
document.getElementById("overlay").addEventListener("click", startCountdown);
document.getElementById("raceContainer").addEventListener("click", startCountdown);
