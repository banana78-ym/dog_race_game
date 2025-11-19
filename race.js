// ---------------- 犬画像 ----------------
const selectedDog = localStorage.getItem("selectedDog") || "dog1.png";
const dog = document.getElementById("dog");
dog.src = "dogs/" + selectedDog;

// ---------------- トラック設定 ----------------
const track = document.getElementById("track");
let trackX = 0;

// 画像の「表示されている横幅」（拡大後のサイズ）
let trackDisplayWidth = 0;

// 犬
let dogX = 0;          // 画面左からスタート
let dogSpeed = 12;     // 1タップごとの犬の進み量

// スクロール速度
let trackSpeed = 9;

// ★ スクロール停止位置調整（ここは「完璧だった」感覚に近づける用）★
const STOP_OFFSET = -105;   // スクロールをどれだけ手前で止めるか

// ★ ゴール判定位置（犬がどこまで来たらGOALにするか）★
const GOAL_OFFSET = -50;    // マイナスを大きくすると「少し手前」でゴール

// 実際にスクロールを止める left 値
let stopPosition = 0;

// ---------------- 表示サイズを使ってスクロール停止位置を計算 ----------------
window.addEventListener("load", () => {
    const container = document.getElementById("raceContainer");
    const containerWidth = container.clientWidth;

    // 画面上で実際に見えているサイズ（拡大後のwidth）
    const rect = track.getBoundingClientRect();
    trackDisplayWidth = rect.width;

    // 画像の右端が画面右端にくる位置 ＋ 少し手前にするための STOP_OFFSET
    stopPosition = -(trackDisplayWidth - containerWidth) + STOP_OFFSET;
    console.log("displayWidth:", trackDisplayWidth, "containerWidth:", containerWidth, "stopPosition:", stopPosition);
});

// ---------------- TAPボタン ----------------
const tapButton = document.getElementById("tapButton");
let canTap = false;
let backgroundStopped = false;

tapButton.addEventListener("click", () => {
    if (!canTap) return;

    // 犬を右に動かす（スクロール止まっても動き続ける）
    dogX += dogSpeed;
    dog.style.left = dogX + "px";

    // 背景スクロール（stopPosition までは動かす）
    if (!backgroundStopped) {
        trackX -= trackSpeed;

        if (trackX <= stopPosition) {
            trackX = stopPosition;
            backgroundStopped = true; // ここからは犬だけ動く
        }

        track.style.left = trackX + "px";
    }

    checkGoal();
});

// ---------------- タイマー（実時間ベースで正確に） ----------------
let time = 0;
let timerRunning = false;
let lastTime = null;

function tickTimer() {
    if (timerRunning) {
        const now = performance.now();
        if (lastTime === null) {
            lastTime = now;
        } else {
            const deltaSec = (now - lastTime) / 1000; // 経過秒
            time += deltaSec;
            lastTime = now;
            document.getElementById("timer").textContent = time.toFixed(2) + " s";
        }
    } else {
        lastTime = null;
    }
    requestAnimationFrame(tickTimer);
}
requestAnimationFrame(tickTimer);

// ---------------- ゴール判定 ----------------
function checkGoal() {
    const containerWidth = document.getElementById("raceContainer").clientWidth;

    // 犬の右端（画面座標）
    const dogRight = dogX + dog.clientWidth;

    // ゴールライン：画面右端より少し手前（GOAL_OFFSET分だけ左）
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

    // グレー画面と文字を消す
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
                timerRunning = true;  // ★ ここでタイマースタート
            }, 500);
            clearInterval(interval);
        }
    }, 1000);
}

// 画面タップは overlay だけにして、変な二重反応を防ぐ
document.getElementById("overlay").addEventListener("click", startCountdown);

