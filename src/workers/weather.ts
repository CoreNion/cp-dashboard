/* 気象情報の取得用のworker */

import dayjs from 'dayjs';
import { w2s } from '../utils/weather-icon.ts';

/** メインスレッドから受け取る天気設定 */
export type WeatherRequestSettings = {
  amedasCode: string;
  weatherOfficeNumber: string;
  weatherAreaNumber: string;
  isAmedasOnlyTmp: boolean;
};

/** メインスレッドへ送る気象情報 */
export type WeatherResult = {
  outTmp: number | null;
  pressure: number | null;
  weather: string | null;
};

type ForecastArea = { area: { code: string }; weatherCodes: string[] };

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** メインスレッドから現在の天気設定を取得する */
const requestSettings = () =>
  new Promise<WeatherRequestSettings>((resolve) => {
    self.onmessage = (event: MessageEvent<WeatherRequestSettings>) => {
      self.onmessage = onMessage;
      resolve(event.data);
    };
    self.postMessage('GET_STORAGE_KEY');
  });

const fetchJson = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status}: ${url}`);
  return res.json();
};

const refleshWeather = async () => {
  const settings = await requestSettings();

  // 最新の気象データの時刻を取得
  const latestTimeFetch = await fetch('https://www.jma.go.jp/bosai/amedas/data/latest_time.txt');
  const latestTime = dayjs(await latestTimeFetch.text());
  // 最新のJSONファイル名 (3時間ごとに別ファイル)
  const latestJsonName = `${latestTime.format('YYYYMMDD')}_${(Math.floor(latestTime.hour() / 3) * 3).toString().padStart(2, '0')}.json`;

  // アメダス/天気予報のデータを取得
  const [amedasData, forecastData] = await Promise.all([
    fetchJson(`https://www.jma.go.jp/bosai/amedas/data/point/${settings.amedasCode}/${latestJsonName}`),
    fetchJson(`https://www.jma.go.jp/bosai/forecast/data/forecast/${settings.weatherOfficeNumber}.json`),
  ]);

  /* アメダスのデータの処理 */

  // 最後にある最新の気象データを取得
  const latestWeather = Object(Object.values(amedasData).pop());
  // 気温を取得
  const outTmp: number | null = latestWeather.temp?.[0] ?? null;
  // 気圧を取得
  const pressure: number | null = settings.isAmedasOnlyTmp ? null : (latestWeather.pressure?.[0] ?? null);

  /* 天気予報のデータの処理 */

  // 今日の天気から、設定されている地域のものを取得
  const todayForecast: ForecastArea[] = forecastData[0].timeSeries[0].areas;
  const areaForecast = todayForecast.find((value) => value.area.code == settings.weatherAreaNumber) ?? todayForecast[0];
  const weather = areaForecast != null ? w2s(areaForecast.weatherCodes[0]) : null;

  const result: WeatherResult = { outTmp, pressure, weather };
  self.postMessage(result);
};

/** 通信エラーなどで更新ループが止まらないようにする */
const safeRefleshWeather = async () => {
  try {
    await refleshWeather();
  } catch (e) {
    console.error('気象情報の取得に失敗しました', e);
  }
};

const onMessage = async (event: MessageEvent<unknown>) => {
  if (event.data === 'REFLESH_WEATHER') {
    await safeRefleshWeather();
  }
};
self.onmessage = onMessage;

(async () => {
  // 10分ごとに天気を更新
  await safeRefleshWeather();
  while (true) {
    await sleep(600000);
    await safeRefleshWeather();
  }
})();
