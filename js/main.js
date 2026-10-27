console.log("おでかけ天気プランナーを起動しました。");

// HTMLから観光スポットの選択欄を取得する
const spotSelect = document.getElementById("spot-select");

// 登録したスポットを1件ずつ処理する
spots.forEach(function (spot) {
  // 選択肢を新しく作る
  const option = document.createElement("option");

  // 画面に表示する文字を設定する
  option.textContent = spot.name;

  // 選択されたときに使う値を設定する
  option.value = spot.id;

  // 選択欄に追加する
  spotSelect.appendChild(option);
});

const spotDescription = document.getElementById("spot-description");
const spotCoordinates = document.getElementById("spot-coordinates");

// スポットの選択が変更されたときに実行する
spotSelect.addEventListener("change", function () {
  // 選択されたIDを取得する
  const selectedId = Number(spotSelect.value);

  // IDが一致するスポットを探す
  const selectedSpot = spots.find(function (spot) {
    return spot.id === selectedId;
  });

  // 未選択の場合
  if (!selectedSpot) {
    spotDescription.textContent = "スポットを選択してください。";
    spotCoordinates.textContent = "緯度・経度：未選択";
    return;
  }

  // 選択したスポットの説明を表示する
  spotDescription.textContent = selectedSpot.description;

  // 選択したスポットの緯度・経度を表示する
  spotCoordinates.textContent = `緯度：${selectedSpot.latitude}、経度：${selectedSpot.longitude}`;
});
