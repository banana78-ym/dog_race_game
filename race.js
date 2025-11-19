// ---------------- 犬画像 ----------------
const selectedDog = localStorage.getItem("selectedDog") || "dog1.png";
const dog = document.getElementById("dog");
dog.src = "dogs/" + selectedDog;

// ---------------- トラック ----------------
const track = document.getElementById("track");
let trackX = 0;
let trackWidth = 0;

// ★ ちょっと速く＆タップの進みも少しだけ増やす
let trackSpeed = 10;   // 背景スクロールの速さ
let dogSpeed = 16;     // 1タップで進む距離（前より少しアップ）

// 背景停止フラグ
let backgroundStopped = false;

// ゴール位置
let goalPosition = 0;

track.onload = () => {
    // 画像本来の横幅
    trackWidth = track.naturalWidth;

    const containerWidth = document.getElementById("raceContainer").clientWidth;

    // ★ 今までは「containerWidth - trackWidth」で止めていた
    //    → ゴールラインが見える前に止まっていたので、
    //    → もっと “右端がちゃんと見えるまで” スクロールさせる
    //
    // ここでは余裕をもって「さらに 200px 分だけ多くスクロール」させる
    // （必要ならこの 200 を 250 / 300 などに調整できる）
    goalPosition = containerWidth - trackWidth - 200;

    console.log("trackWidth:", trackWidth);
    console.log("containerWidth:", containerWidth);
    console.log("goalPosition:", goalPosition);
};


// ---------------- TAPボタン ----------------
const tapButton = document.getElementById("tapButton");
let canTap = false;

tapButton.addEventListener("click", () => {
    if (!canTap) return;

    // 犬を右に進める
    let currentLeft = parseFloat(dog.style.left || "20");
    if (isNaN(currentLeft)) currentLeft = 20;
    currentLeft += dogSpeed;
    dog.style.left = currentLeft + "px";

    // 背景スクロール（ゴールラインが見えるまで止めない）
    if (!backgroundStopped) {
        trackX -= trackSpeed;

        // ★ goalPosition をもっと左（マイナス側）にしてあるので
        //    その分だけ長くスクロールする
        if (trackX <= goalPosition) {
            trackX = goalPosition;
            backgroundStopped = true; // ここでようやくスクロール停止
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
        time += 0.01; // 0.01秒ずつ増える（1秒 = 1秒で進む）
        document.getElementById("timer").textContent = time.toFixed(2) + " s";
    }
}, 10);


// ---------------- ゴール判定 ----------------
function checkGoal() {
    const dogRect = dog.getBoundingClientRect();
    const containerRect = document.getElementById("raceContainer").getBoundingClientRect();

    const dogRight = dogRect.right - containerRect.left; // 犬の右端（コンテナ基準）
    const containerWidth = containerRect.width;

    // ★ 背景が止まっていて、犬の右端が画面右端付近まで来たらゴール
    if (backgroundStopped && dogRight >= containerWidth - 10) {
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

    // グレーの overlay と文字を消す
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

// overlay と container 両方でスタート可能にする
document.getElementById("overlay").addEventListener("click", startCountdown);
document.getElementById("raceContainer").addEventListener("click", startCountdown);
