// ---------------- トラック ----------------
const track = document.getElementById("track");
let trackX = 0;
let trackWidth = 0;
let trackSpeed = 8;

// 犬
let dogX = 20;
let dogSpeed = 14;

// 背景停止フラグ
let backgroundStopped = false;

// ゴール位置
let goalPosition = 0;

// 背景ロード後に「実際の描画幅」を取得
track.onload = () => {

    // ★ 4枚つないだ最終的な幅を取得（自然幅ではなく描画幅）
    trackWidth = track.scrollWidth;

    const containerWidth = document.getElementById("raceContainer").clientWidth;

    // ★ goal.png の右端が画面右端に来る位置
    goalPosition = -(trackWidth - containerWidth);

    console.log("実測 trackWidth =", trackWidth);
    console.log("containerWidth =", containerWidth);
    console.log("goalPosition =", goalPosition);
};

// ---------------- TAPボタン ----------------
tapButton.addEventListener("click", () => {
    if (!canTap) return;

    // 犬は常に前進（中央固定なら dogX は変更しない）
    dogX += dogSpeed;
    dog.style.left = dogX + "px";

    // 背景スクロール（ゴールまで）
    if (!backgroundStopped) {

        // ★ 犬の動きに合わせず、常に左へスクロールし続ける
        trackX -= trackSpeed;

        // ★ ゴールライン（goal画像の右端）が見えたら STOP
        if (trackX <= goalPosition) {
            trackX = goalPosition;
            backgroundStopped = true;
        }

        track.style.left = trackX + "px";
    }

    checkGoal();
});
