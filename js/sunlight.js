function getSunPosition(spot, date, time) {
  // 撮影日時を作成
  const shootDateTime = new Date(`${date}T${time}:00`);

  // SunCalc.jsで太陽位置を計算
  const position = SunCalc.getPosition(
    shootDateTime,
    spot.latitude,
    spot.longitude,
  );

  return {
    azimuth: position.azimuth,
    altitude: position.altitude,
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
