//----------------------------------------------------
// 犬画像
//----------------------------------------------------
const selectedDog = localStorage.getItem("selectedDog") || "dog1.png";
const dog = document.getElementById("dog");
dog.src = "dogs/" + selectedDog;

//----------------------------------------------------
// トラック設定
//----------------------------------------------------
const track = document.getElementById("track");
let trackX = 0;
let trackWidth = 0;
let containerWidth = 0;

// スクロールスピード（背景）
let trackSpeed = 8;  // ← 少し速め

// 犬の進む距離（1タップ）
let dogSpeed = 12;   // ← 少し長め、とあなたが言った通り

// ゴール位置
let goalPosition = 0;

track.onload = () => {
    trackWidth = track.naturalWidth;
    containerWidth = document.getElementById("raceContainer").clientWidth;

    // 📌画像の右端が画面右端に来たときがゴール！！
    goalPosition = -(trackWidth - containerWidth);

    console.log("Track width:", trackWidth);
    console.log("Container width:", containerWidth);
    console.log("Goal position:", goalPosition);
};

//----------------------------------------------------
// 犬の位置
//----------------------------------------------------
let dogX = 20;

// 犬を常に画面左側に表示（見切れ防止）
// → 犬はあまり動かさず、背景を動かす方式に変更
//----------------------------------------------------

//----------------------------------------------------
// TAPボタン
//----------------------------------------------------
const tapButton = document.getElementById("tapButton");
let canTap = false;

// スマホの拡大防止（ダブルタップズーム禁止）
tapButton.addEventListener("touchstart", (e) => {
    e.preventDefault();
}, { passive: false });


tapButton.addEventListener("click", () => {
    if (!canTap) return;

    // 犬は少し右へ動く
    dogX += dogSpeed;
    dog.style.left = dogX + "px";

    // 背景移動
    if (moveTrack()) {
        finishRace();
    }
});

//----------------------------------------------------
// 背景を動かす
//----------------------------------------------------
function moveTrack() {
    // ゴール判定：画像右端が画面右端に来たらゴール
    if (trackX <= goalPosition) {
        trackX = goalPosition;
        track.style.left = trackX + "px";
        return true;
    }

    trackX -= trackSpeed;
    track.style.left = trackX + "px";
    return false;
}

//----------------------------------------------------
// タイマー（1秒＝1秒で正しいカウント）
//----------------------------------------------------
let time = 0;
let timerRunning = false;

setInterval(() => {
    if (timerRunning) {
        time += 0.01;  // ← 100回で1秒、普通の速度
        document.getElementById("timer").textContent = time.toFixed(2) + " s";
    }
}, 10);

//----------------------------------------------------
// ゴール時
//----------------------------------------------------
function finishRace() {
    timerRunning = false;
    canTap = false;

    alert("GOAL!! Time: " + time.toFixed(2) + "s");
}

//----------------------------------------------------
// 画面タップ → カウントダウン開始
//----------------------------------------------------
const countdown = document.getElementById("countdown");
const overlay = document.getElementById("overlay");
const tapText = document.getElementById("tapText");

let screenTapped = false;

document.getElementById("raceContainer").addEventListener("click", () => {
    if (screenTapped) return;
    screenTapped = true;

    // 📌 Tap to Start とグレー背景を消す
    overlay.style.display = "none";
    tapText.style.display = "none";

    // カウントダウン開始
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
