// ==================================================
//  犬画像
// ==================================================
const selectedDog = localStorage.getItem("selectedDog") || "dog1.png";
const dog = document.getElementById("dog");
dog.src = "dogs/" + selectedDog;

// ==================================================
//  トラック設定
// ==================================================
const track = document.getElementById("track");
let trackX = 0;
let trackWidth = 0;
let backgroundStopped = false;

// 犬の設定
let dogX = 20;          // 左端より少し右からスタート
let dogSpeed = 9;       // 犬の1タップ移動量（スクロールと同じにする）

// スクロール速度
let trackSpeed = 9;

// ゴールライン調整（右に黒背景が出なくなる位置）
const GOAL_MARGIN = 250;   // ← 必要に応じて 230〜260 で微調整

let stopPosition = 0;

// トラック画像ロード後に幅取得
track.onload = () => {
    trackWidth = track.naturalWidth;
    const containerWidth = document.getElementById("raceContainer").clientWidth;

    // スクロールを止める位置（ここを超えると黒い背景が出る）
    stopPosition = -(trackWidth - containerWidth) + GOAL_MARGIN;
};


// ==================================================
//  TAP ボタン
// ==================================================
const tapButton = document.getElementById("tapButton");
let canTap = false;

tapButton.addEventListener("click", () => {
    if (!canTap) return;

    // 犬は常に右へ進む（背景が止まっても進む）
    dogX += dogSpeed;
    dog.style.left = dogX + "px";

    // 背景スクロール（ゴールライン見えるまで止めない）
    if (!backgroundStopped) {
        trackX -= trackSpeed;

        if (trackX <= stopPosition) {
            trackX = stopPosition;
            backgroundStopped = true;  // ← この後は背景は止まるが犬は止まらない
        }

        track.style.left = trackX + "px";
    }

    checkGoal();
});


// ==================================================
//  タイマー
// ==================================================
let time = 0;
let timerRunning = false;

// 0.01秒ごとに正確に加算
setInterval(() => {
    if (timerRunning) {
        time += 0.01;
        document.getElementById("timer").textContent = time.toFixed(2) + " s";
    }
}, 10);


// ==================================================
//  ゴール判定（犬の画像の右端が画面右に届いたらゴール）
// ==================================================
function checkGoal() {
    const dogRight = dogX + dog.clientWidth;
    const containerWidth = document.getElementById("raceContainer").clientWidth;

    // 背景は止まっている前提で、犬が画面右端に届いたらゴール
    if (backgroundStopped && dogRight >= containerWidth - 20) {
        timerRunning = false;
        canTap = false;
        alert("GOAL!! Time: " + time.toFixed(2) + " s");
    }
}


// ==================================================
//  Tap to Start カウントダウン
// ==================================================
const countdown = document.getElementById("countdown");
let screenTapped = false;

function startCountdown() {
    if (screenTapped) return;
    screenTapped = true;

    // グレー overlay を消す
    document.getElementById("overlay").style.display = "none";

    // カウントダウン表示開始
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


// overlay & container どちらをタップしても開始
document.getElementById("overlay").addEventListener("click", startCountdown);
document.getElementById("raceContainer").addEventListener("click", startCountdown);

// overlay & container 両方でスタート可能
document.getElementById("overlay").addEventListener("click", startCountdown);
document.getElementById("raceContainer").addEventListener("click", startCountdown);
