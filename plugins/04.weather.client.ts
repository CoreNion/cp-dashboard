import { useIntervalFn } from "@vueuse/core";
import dayjs from "dayjs";

export default defineNuxtPlugin(async (nuxtApp) => {
  await refleshWeather();
  useIntervalFn(refleshWeather, 600000);
});

/**
 * 表示されている天気を更新する
 */
export async function refleshWeather() {
  // センサーのソース
  const sensorSourceState = sensorSource();

  // 現在の気圧
  const pressureState = pressure();
  // 現在の外気温
  const outTmpState = outTmp();
  // 天気
  const weatherState = weather();

  // アメダスの番号
  const amedasCodeState = weatherAmedasCode();
  // office番号 (東京地方)
  const weatherOfficeNumberState = weatherOfficeNumber();

  // 最新の気象データの時刻を取得
  const latestTime = dayjs(await $fetch<string>('https://www.jma.go.jp/bosai/amedas/data/latest_time.txt'));
  // 最新のJSONファイル名 (3時間ごとに別ファイル)
  const latestJsonName = `${latestTime.format("YYYYMMDD")}_${(Math.floor(latestTime.hour() / 3) * 3).toString().padStart(2, "0")}.json`;

  // アメダス/天気予報のデータを取得
  const data = await Promise.all([
    // アメダスのデータ
    $fetch(`https://www.jma.go.jp/bosai/amedas/data/point/${amedasCodeState.value}/${latestJsonName}`),
    // 天気予報のデータ
    $fetch(`https://www.jma.go.jp/bosai/forecast/data/forecast/${weatherOfficeNumberState.value}.json`)
  ]).catch((e) => {
    console.error(e);
    return;
  });

  if (data == null) {
    console.error('data is null');
    return;
  }

  /* アメダスのデータの処理 */
  const amedasData = Object(data[0]);

  // 最後にある最新の気象データを取得
  const latestWeather = Object(Object.values(amedasData).pop());

  outTmpState.value = latestWeather.temp[0];
  if (!isAmedasOnlyTmp().value && (sensorSourceState.value === "serial" && !(isSerialReady().value)))
    pressureState.value = latestWeather.pressure[0];

  /* 天気予報のデータの処理 */
  const forecastData = Array(data[1]);

  // 今日の天気を取得
  const todayForecast = Object(forecastData[0])[0].timeSeries[0].areas as Array<any>;
  // 設定されている地域のインデックスを取得
  const areaIndex = todayForecast.findIndex((value) => value.area.code == weatherAreaNumber().value);
  const todayWeatherCode = todayForecast[areaIndex].weatherCodes[0];

  weatherState.value = weather2str(todayWeatherCode);
}