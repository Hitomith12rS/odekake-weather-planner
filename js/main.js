console.log("おでかけ天気プランナーを起動しました。");

// HTMLから観光スポットの選択欄を取得する
const spotSelect = document.getElementById("spot-select");

// HTMLから天気予報欄を取得する
const weatherResult = document.getElementById("weather-result");

// 登録したスポットを1件ずつ処理する
spots.forEach(function (spot) {
  const option = document.createElement("option");
  option.textContent = spot.name;
  option.value = spot.id;
  spotSelect.appendChild(option);
});

const spotDescription = document.getElementById("spot-description");
const spotCoordinates = document.getElementById("spot-coordinates");

// お気に入り機能のHTML要素を取得
const favoriteButton = document.getElementById("favorite-button");
const favoriteList = document.getElementById("favorite-list");

// お気に入りスポットを保存する配列
let favoriteSpots = [];

// localStorageからお気に入りを読み込む
const savedFavorites = localStorage.getItem("favoriteSpots");

if (savedFavorites) {
  favoriteSpots = JSON.parse(savedFavorites);
}

// お気に入りをlocalStorageに保存する
function saveFavorites() {
  localStorage.setItem("favoriteSpots", JSON.stringify(favoriteSpots));
}

// お気に入り一覧を画面に表示する
function displayFavorites() {
  // 一覧を一度空にする
  favoriteList.innerHTML = "";

  // お気に入りがない場合
  if (favoriteSpots.length === 0) {
    const li = document.createElement("li");
    li.textContent = "お気に入りはまだ登録されていません。";
    favoriteList.appendChild(li);
    return;
  }

  // お気に入りを1件ずつ表示
  favoriteSpots.forEach(function (id) {
    const spot = spots.find(function (spot) {
      return spot.id === id;
    });

    if (!spot) return;

    const li = document.createElement("li");

    // スポット名をボタンとして表示
    const button = document.createElement("button");
    button.textContent = spot.name;
    button.type = "button";

    // クリックするとスポットを選択する
    button.addEventListener("click", function () {
      spotSelect.value = spot.id;

      // スポット選択時の処理を実行
      spotSelect.dispatchEvent(new Event("change"));
    });

    li.appendChild(button);
    favoriteList.appendChild(li);
  });
}

// お気に入り登録ボタンの処理
favoriteButton.addEventListener("click", function () {
  const selectedId = Number(spotSelect.value);

  // スポットが選択されていない場合
  if (!spotSelect.value) {
    alert("お気に入りに登録するスポットを選択してください。");
    return;
  }

  // すでに登録されているか確認
  if (favoriteSpots.includes(selectedId)) {
    // 登録済みならお気に入りから削除
    favoriteSpots = favoriteSpots.filter(function (id) {
      return id !== selectedId;
    });

    // favoriteButton.textContent = "☆ お気に入りに登録";
  } else {
    // 未登録ならお気に入りに追加
    favoriteSpots.push(selectedId);

    // favoriteButton.textContent = "★ お気に入りを解除";
  }

  // localStorageに保存
  saveFavorites();

  //お気に入り一覧更新
  displayFavorites();

  //お気に入りボタン更新
  updateFavoriteButton();
});

// 選択中のスポットに応じてボタン表示を更新する
function updateFavoriteButton() {
  const selectedId = Number(spotSelect.value);

  // スポット未選択の場合
  if (!spotSelect.value) {
    favoriteButton.textContent = "☆ お気に入りに登録";
    favoriteButton.disabled = true;
    return;
  }

  // スポット選択済みの場合
  favoriteButton.disabled = false;

  if (favoriteSpots.includes(selectedId)) {
    favoriteButton.textContent = "★ お気に入りを解除";
  } else {
    favoriteButton.textContent = "☆ お気に入りに登録";
  }
}

// 訪問日・撮影日時の入力欄を取得
const visitDate = document.getElementById("visit-date");
const shootDate = document.getElementById("shoot-date");
const shootTime = document.getElementById("shoot-time");

// 今日の日付を取得
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0");
const day = String(today.getDate()).padStart(2, "0");

const todayString = `${year}-${month}-${day}`;

// 訪問日と撮影日の初期値を今日に設定
visitDate.value = todayString;
shootDate.value = todayString;

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

  // 光の状態に応じた説明文
  const lightDescriptions = {
    順光: "被写体の正面から光が当たり、色や形がはっきり写りやすい状態です。",
    逆光: "被写体の後ろから光が当たり、シルエットや光の演出を活かせる状態です。",
    サイド光: "被写体の横から光が当たり、立体感や陰影が出やすい状態です。",
  };

  const lightDescription = lightDescriptions[lightCondition];

  // 光の状態を表示
  if (sunPosition.altitude <= 0) {
    lightConditionElement.className = "light-condition-unavailable";
    sunResult.textContent = lightCondition;
  } else {
    lightConditionElement.className = `light-condition-${lightCondition}`;

    sunResult.textContent =
      `光の状態：${lightCondition}\n` +
      `${lightDescription}\n\n` +
      `太陽の方角：${direction}（${azimuth}°）\n` +
      `太陽の高度：${altitude}°`;
  }
}

// 訪問日の日時から日の出・日の入り時刻を更新する
function updateSunTimes(spot) {
  const sunTimes = document.getElementById("sun-times");

  // スポットまたは訪問日が未選択の場合
  if (!spot || !visitDate.value) {
    sunTimes.innerHTML = `
      <p>日の出：--:--</p>
      <p>日の入り：--:--</p>
    `;
    return;
  }

  // 訪問日をDateオブジェクトに変換
  // 正午を指定して日付のずれを防ぐ
  const date = new Date(`${visitDate.value}T12:00:00`);

  // SunCalcで日の出・日の入りを取得
  const times = SunCalc.getTimes(date, spot.latitude, spot.longitude);

  // 時刻を「時:分」の形式に整える
  function formatTime(date) {
    return date.toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    });
  }

  sunTimes.innerHTML = `
    <p>日の出：${formatTime(times.sunrise)}</p>
    <p>日の入り：${formatTime(times.sunset)}</p>
  `;
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

    // 天気予報を初期表示に戻す
    weatherResult.textContent =
      "スポットと訪問日を選択すると天気情報を確認できます。";

    // 撮影コンディションを初期表示に戻す
    resetSunResult("撮影スポットを選択してください。");

    // 日の出・日の入りを初期表示に戻す
    updateSunTimes(null);

    // お気に入りボタンを未選択状態に更新
    updateFavoriteButton();

    return;
  }

  spotDescription.textContent = selectedSpot.description;

  spotCoordinates.textContent = `緯度：${selectedSpot.latitude}、経度：${selectedSpot.longitude}`;

  // 訪問予定日の天気予報を取得
  getWeatherForecast(selectedSpot, visitDate.value);

  // 日の出・日の入りを更新
  updateSunTimes(selectedSpot);

  // 太陽位置を更新
  updateSunPosition();

  // スポット選択時にボタンを更新
  updateFavoriteButton();
});

// 撮影日が変更されたときに実行する
shootDate.addEventListener("change", updateSunPosition);

// 撮影時刻が変更されたときに実行する
shootTime.addEventListener("change", updateSunPosition);

// 撮影方向が変更されたときに実行する
cameraDirection.addEventListener("change", updateSunPosition);

// 訪問日が変更されたときに天気予報を更新
visitDate.addEventListener("change", function () {
  const selectedId = Number(spotSelect.value);

  const selectedSpot = spots.find(function (spot) {
    return spot.id === selectedId;
  });

  if (selectedSpot) {
    getWeatherForecast(selectedSpot, visitDate.value);
    updateSunTimes(selectedSpot);
  }
});

// ページ読み込み時にお気に入り一覧を表示
displayFavorites();
// 初期表示も更新
updateFavoriteButton();
