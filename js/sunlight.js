function getSunPosition(spot, date, time) {
  // 撮影日時を作成
  const shootDateTime = new Date(`${date}T${time}:00`);

  // SunCalc.jsで太陽位置を計算
  const position = SunCalc.getPosition(
    shootDateTime,
    spot.latitude,
    spot.longitude,
  );

  // ラジアンから度数に変換
  // SunCalcの方位角は南基準なので、北基準・時計回りに変換
  const azimuth = ((position.azimuth * 180) / Math.PI + 180 + 360) % 360;

  const altitude = (position.altitude * 180) / Math.PI;

  return {
    azimuth,
    altitude,
  };
}

function getLightCondition(sunAzimuth, cameraDirection, sunAltitude) {
  // 太陽が地平線より下なら判定しない
  if (sunAltitude <= 0) {
    return "太陽が地平線より下にあるため、判定できません。";
  }

  // 太陽の方角と撮影方向の角度差を計算
  let angleDifference = Math.abs(sunAzimuth - cameraDirection);

  // 360度をまたぐ場合は小さい方の角度差にする
  if (angleDifference > 180) {
    angleDifference = 360 - angleDifference;
  }

  // 角度差によって光の状態を判定
  if (angleDifference <= 45) {
    return "逆光";
  } else if (angleDifference <= 135) {
    return "サイド光";
  } else {
    return "順光";
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
    <p>日の出：${formatTime(times.sunrise)} </p>
    <p>日の入り：${formatTime(times.sunset)}</p>
  `;
}
