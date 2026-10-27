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
