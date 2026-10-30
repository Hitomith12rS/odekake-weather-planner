function getWeatherDescription(code) {
  const weatherDescriptions = {
    0: "快晴",
    1: "主に晴れ",
    2: "一部曇り",
    3: "曇り",

    45: "霧",
    48: "着氷性の霧",

    51: "弱い霧雨",
    53: "霧雨",
    55: "強い霧雨",
    56: "弱い着氷性の霧雨",
    57: "強い着氷性の霧雨",

    61: "弱い雨",
    63: "雨",
    65: "強い雨",
    66: "弱い着氷性の雨",
    67: "強い着氷性の雨",

    71: "弱い雪",
    73: "雪",
    75: "強い雪",
    77: "雪の粒",

    80: "弱いにわか雨",
    81: "にわか雨",
    82: "激しいにわか雨",

    85: "弱いにわか雪",
    86: "強いにわか雪",

    95: "雷雨",
    96: "弱い雹を伴う雷雨",
    99: "強い雹を伴う雷雨",
  };

  return weatherDescriptions[code] ?? "不明な天気";
}

async function getCurrentWeather(spot) {
  // 天気情報の表示場所を取得する
  const weatherResult = document.getElementById("weather-result");

  // データの取得中であることを表示する
  weatherResult.textContent = "天気情報を取得中...";

  // APIに渡すパラメータを作成する
  const params = new URLSearchParams({
    latitude: spot.latitude,
    longitude: spot.longitude,
    current: "temperature_2m,weather_code,cloud_cover",
    timezone: "Asia/Tokyo",
  });

  // APIのURLを作成する
  const url = `https://api.open-meteo.com/v1/forecast?${params}`;

  try {
    // APIにリクエストを送る
    const response = await fetch(url);

    // 通信が正常に完了したか確認する
    if (!response.ok) {
      throw new Error("天気データの取得に失敗しました。");
    }

    // JSON形式のデータを取得する
    const data = await response.json();
    const current = data.current;

    // 天気コードを日本語に変換する
    const weather = getWeatherDescription(current.weather_code);

    // 天気情報を画面に表示する
    weatherResult.textContent =
      `天気：${weather}\n` +
      `気温：${current.temperature_2m}℃\n` +
      `雲量：${current.cloud_cover}%`;
  } catch (error) {
    // エラーの詳細をコンソールに表示する
    console.error("天気情報の取得エラー：", error);

    // ユーザー向けのメッセージを表示する
    weatherResult.textContent =
      "天気情報を取得できませんでした。時間をおいて再度お試しください。";
  }
}

console.log(getWeatherDescription(0));
console.log(getWeatherDescription(61));
console.log(getWeatherDescription(95));
console.log(getWeatherDescription(999));
