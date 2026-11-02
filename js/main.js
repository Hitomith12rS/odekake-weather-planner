console.log("おでかけ天気プランナーを起動しました。");

// HTMLから観光スポットの選択欄を取得する
const spotSelect = document.getElementById("spot-select");

// 登録したスポットを1件ずつ処理する
spots.forEach(function (spot) {
  const option = document.createElement("option");
  option.textContent = spot.name;
  option.value = spot.id;
  spotSelect.appendChild(option);
});

const spotDescription = document.getElementById("spot-description");
const spotCoordinates = document.getElementById("spot-coordinates");

// 撮影日時の入力欄を取得
const shootDate = document.getElementById("shoot-date");
const shootTime = document.getElementById("shoot-time");

// 撮影日の初期値を今日に設定
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0");
const day = String(today.getDate()).padStart(2, "0");

shootDate.value = `${year}-${month}-${day}`;

// 撮影方向の入力欄を取得
const cameraDirection = document.getElementById("camera-direction");

// 太陽位置の表示欄を取得
const sunResult = document.getElementById("sun-result");

const lightConditionElement = document.getElementById("light-condition");

// 方位角から方角の名前を取得する
function getCompassDirection(degrees) {
  const directions = ["北", "北東", "東", "南東", "南", "南西", "西", "北西"];

  const index = Math.round(degrees / 45) % 8;

  return directions[index];
}

// 撮影コンディションの表示を初期化
function resetSunResult(message) {
  lightConditionElement.className = "light-condition-unavailable";

  sunResult.textContent = message;
}

// 太陽位置を画面に表示する
function updateSunPosition() {
  // 選択されたスポットを取得
  const selectedId = Number(spotSelect.value);

  const selectedSpot = spots.find(function (spot) {
    return spot.id === selectedId;
  });

  // スポットが未選択の場合
  if (!selectedSpot) {
    resetSunResult("撮影スポットを選択してください。");
    return;
  }

  // 撮影日が未入力の場合
  if (!shootDate.value) {
    resetSunResult("撮影日を選択してください。");
    return;
  }

  // 撮影時刻が未入力の場合
  if (!shootTime.value) {
    resetSunResult("撮影時刻を選択してください。");
    return;
  }

  // 撮影時刻が未入力の場合
  if (!shootTime.value) {
    sunResult.textContent = "撮影時刻を選択してください。";
    return;
  }

  // 太陽位置を計算
  const sunPosition = getSunPosition(
    selectedSpot,
    shootDate.value,
    shootTime.value,
  );

  // 方角を取得
  const direction = getCompassDirection(sunPosition.azimuth);

  // 小数第1位まで表示
  const azimuth = sunPosition.azimuth.toFixed(1);
  const altitude = sunPosition.altitude.toFixed(1);

  // 太陽位置を表示
  let result =
    `太陽の方角：${direction}（${azimuth}°）\n` + `太陽の高度：${altitude}°`;

  // 太陽が地平線より下にある場合
  if (sunPosition.altitude <= 0) {
    result += "\n太陽は地平線より下にあります。";
  }

  // 撮影方向を取得
  const selectedDirection = Number(cameraDirection.value);

  // 光の状態を判定
  const lightCondition = getLightCondition(
    sunPosition.azimuth,
    selectedDirection,
    sunPosition.altitude,
  );

  // 光の状態を表示
  if (sunPosition.altitude <= 0) {
    lightConditionElement.className = "light-condition-unavailable";
    sunResult.textContent = lightCondition;
  } else {
    lightConditionElement.className = `light-condition-${lightCondition}`;

    sunResult.textContent =
      `光の状態：${lightCondition}\n` +
      `太陽の方角：${direction}（${azimuth}°）\n` +
      `太陽の高度：${altitude}°`;
  }
}

// スポットの選択が変更されたときに実行する
spotSelect.addEventListener("change", function () {
  const selectedId = Number(spotSelect.value);

  const selectedSpot = spots.find(function (spot) {
    return spot.id === selectedId;
  });

  if (!selectedSpot) {
    spotDescription.textContent = "スポットを選択してください。";
    spotCoordinates.textContent = "緯度・経度：未選択";
    sunResult.textContent = "撮影スポットと日時を選択してください。";
    return;
  }

  spotDescription.textContent = selectedSpot.description;

  spotCoordinates.textContent = `緯度：${selectedSpot.latitude}、経度：${selectedSpot.longitude}`;

  // 天気情報を取得
  getCurrentWeather(selectedSpot);

  // 太陽位置を更新
  updateSunPosition();
});

// 撮影日が変更されたときに実行する
shootDate.addEventListener("change", updateSunPosition);

// 撮影時刻が変更されたときに実行する
shootTime.addEventListener("change", updateSunPosition);

// 撮影方向が変更されたときに実行する
cameraDirection.addEventListener("change", updateSunPosition);
