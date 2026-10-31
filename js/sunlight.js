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
