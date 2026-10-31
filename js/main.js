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

// 太陽位置の表示欄を取得
const sunResult = document.getElementById("sun-result");

// 方位角から方角の名前を取得する
function getCompassDirection(degrees) {
  const directions = ["北", "北東", "東", "南東", "南", "南西", "西", "北西"];

  const index = Math.round(degrees / 45) % 8;

  return directions[index];
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
    sunResult.textContent = "撮影スポットを選択してください。";
    return;
  }

  // 撮影日が未入力の場合
  if (!shootDate.value) {
    sunResult.textContent = "撮影日を選択してください。";
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

  sunResult.textContent = result;
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
