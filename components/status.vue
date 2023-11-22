<script setup lang="ts">
import { useIntervalFn, type Pausable } from '@vueuse/core'
import dayjs from 'dayjs';
import 'dayjs/locale/ja';

// 現在の室温
const roomTmpState: Ref<number | null> = useState('roomTemp', () => null);
// 現在の気圧
const pressureState: Ref<number | null> = useState('pressure', () => null);
// 現在の外気温
const outTmpState: Ref<number | null> = useState('outTemp', () => null);
// 天気
const weatherState: Ref<string | null> = useState('weather', () => null);

// 1秒ごとに温度を更新
const refleshStatus = useIntervalFn(async () => {
  const { data, error } = await useFetch('/api/sensor');
  if (error.value) {
    console.error(error.value);
    refleshStatus.pause();

    roomTmpState.value = null;
    pressureState.value = null;
    return;
  }

  roomTmpState.value = data.value?.tmp ?? null;
  pressureState.value = data.value?.pressure ?? null;
}, 1000);

// 10分ごとに天気を更新
async function refleshWeather() {
  const djs = dayjs();

  // アメダスの番号 (44132: 東京)
  const amedasNumber = 44132;
  // office番号 (東京地方)
  const officeNumber = 130000;
  const areaNumber = 130010;

  // 最新のJSONファイル名 (3時間ごとに別ファイル)
  const yymmdd = djs.format('YYYYMMDD');
  const latestJsonName = `${yymmdd}_${(Math.floor(djs.hour() / 3) * 3).toString().padStart(2, "0")}.json`;

  // アメダス/天気予報のデータを取得
  const { data, error } = await useAsyncData(
    'getWeatherData',
    async () => {
      return await Promise.all([
        // アメダスのデータ
        $fetch(`https://www.jma.go.jp/bosai/amedas/data/point/${amedasNumber}/${latestJsonName}`),
        // 天気予報のデータ
        $fetch(`https://www.jma.go.jp/bosai/forecast/data/forecast/${officeNumber}.json`)
      ])
    }
  );
  if (!data.value) {
    console.error(error.value);
    return;
  }

  /* アメダスのデータの処理 */
  const amedasData = Object(data.value[0]);

  // 最後にある最新の気象データを取得
  const latestWeather = Object(Object.values(amedasData).pop());
  outTmpState.value = latestWeather.temp[0];

  /* 天気予報のデータの処理 */
  const forecastData = Array(data.value[1]);

  // 今日の天気を取得
  const todayWeatherCode = Object(forecastData[0])[0].timeSeries[0].areas[0].weatherCodes[0];
  weatherState.value = weather2str(todayWeatherCode);
}
refleshWeather();
useIntervalFn(refleshWeather, 600000);
</script>

<template>
  <div class="min-w-full stats stats-vertical shadow">
    <div class="stat">
      <div class="stat-title text-5xl">室温</div>
      <div class="stat-value text-7xl">{{ roomTmpState != null ? roomTmpState.toFixed(1) : "-" }} <span
          class="text-5xl">℃</span></div>
    </div>
    <div class="stat">
      <div class="stat-title text-5xl">気圧</div>
      <div class="stat-value text-7xl">{{ pressureState != null ? pressureState.toFixed() : "-" }}
        <br>
        <span class="text-5xl">hPa</span>
      </div>
    </div>
    <div class="stat">
      <div class="stat-title text-5xl">外気温</div>
      <div class="stat-value text-7xl">{{ outTmpState != null ? outTmpState : "-" }} <span class="text-5xl">℃</span>
      </div>
    </div>
    <div class="stat">
      <div class="stat-title text-5xl">天気</div>
      <div class="stat-value text-7xl" style="white-space: pre-wrap;">{{ weatherState != null ? weatherState : "-"
      }}</div>
    </div>
  </div>
</template>