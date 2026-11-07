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

// 訪問予定日の天気予報を取得する
async function getWeatherForecast(spot, date) {
  const weatherResult = document.getElementById("weather-result");

  // 入力チェック
  if (!date) {
    weatherResult.textContent = "訪問予定日を選択してください。";
    return;
  }

  // 取得中の表示
  weatherResult.textContent = "天気予報を取得中...";

  // APIに渡すパラメータを作成
  const params = new URLSearchParams({
    latitude: spot.latitude,
    longitude: spot.longitude,
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
    timezone: "Asia/Tokyo",
    forecast_days: "16",
  });

  const url = `https://api.open-meteo.com/v1/forecast?${params}`;

  try {
    // APIにリクエストを送る
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("天気予報の取得に失敗しました。");
    }

    // JSON形式のデータを取得
    const data = await response.json();

    // 指定した日付のデータ位置を探す
    const dateIndex = data.daily.time.indexOf(date);

    // 指定日が予報データに含まれていない場合
    if (dateIndex === -1) {
      weatherResult.textContent =
        "指定日の天気予報は取得できません。現在から16日以内の日付を選択してください。";
      return;
    }

    // 指定日の天気情報を取得
    const weather = getWeatherDescription(data.daily.weather_code[dateIndex]);

    const maxTemperature = data.daily.temperature_2m_max[dateIndex];

    const minTemperature = data.daily.temperature_2m_min[dateIndex];

    const precipitationProbability =
      data.daily.precipitation_probability_max[dateIndex];

    // 天気予報を画面に表示
    weatherResult.textContent =
      `天気：${weather}\n` +
      `最高気温：${maxTemperature}℃\n` +
      `最低気温：${minTemperature}℃\n` +
      `降水確率：${precipitationProbability ?? "不明"}%`;
  } catch (error) {
    console.error("天気予報の取得エラー：", error);

    weatherResult.textContent =
      "天気予報を取得できませんでした。時間をおいて再度お試しください。";
  }
}
