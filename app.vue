<script setup lang="ts">
import { useIntervalFn, type Pausable } from '@vueuse/core'
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import 'dayjs/locale/ja';

dayjs.extend(duration);
dayjs.locale("ja");

// 現在時刻
const timeState = useState('time', () => dayjs().toDate());
// タイマー残り時間 (h:m:s)
const timerState: Ref<Array<number> | null> = useState('timer', () => null);
// タイマー設定用時間 (h:m:s)
const timerSettingState: Ref<Array<number>> = useState('timerSetting', () => [0, 0, 0]);

// 現在の室温
const roomTmpState: Ref<number | null> = useState('roomTemp', () => null);
// 現在の気圧
const pressureState: Ref<number | null> = useState('pressure', () => null);
// 現在の外気温
const outTmpState: Ref<number | null> = useState('outTemp', () => null);
// 天気
const weatherState: Ref<string | null> = useState('weather', () => null);

// タイマーのインターバル
let interval: Pausable | null = null;

// 1秒ごとに現在時刻/温度を更新
useIntervalFn(async () => {
  timeState.value = dayjs().toDate();

  const { data } = await useFetch('/api/sensor');

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

const djs = dayjs();

// 今月15日
const thisMonthLimit = djs.date(15).hour(0).minute(59).second(59)

// 毎月15日のレポート提出期限
const reportMonthDeadline = dayjs()
  .month(
    // 今月15日を過ぎていたら、次の月の15日にする
    djs.isAfter(thisMonthLimit)
      ? djs.month() + 1 :
      djs.month())
  .date(15)
  .hour(23).minute(59).second(59);

// 毎月15日のレポート提出期限までの残り時間を計算
const reportMonthLimit = reportMonthDeadline.diff(djs, 'millisecond');
const reportMonthLimitDays = dayjs.duration({ milliseconds: reportMonthLimit }).asDays() - 1;
// 赤くするかどうか
const needReportMonthAlert = reportMonthLimitDays > 5;

/* レポート期限の割合を計算 */
// レポート期限の開始日からレポート期限までの時間
const reportTime = reportMonthDeadline.diff(reportMonthDeadline.month(reportMonthDeadline.month() - 1), 'millisecond');
// 消費した日数 / レポート期限までの日数 * 100
const reportRatio = ((reportTime - reportMonthLimit) / reportTime) * 100;

// タイマーの開始
function startTimer() {
  // タイマーの音
  const audio = new Audio('./alert.mp3');

  // タイマーの残り時間を設定
  timerState.value = timerSettingState.value;

  // タイマーのインターバルを設定
  interval = useIntervalFn(() => {
    // timerStateをdurationに変換し、1秒減らす
    let duration = dayjs.duration({
      hours: timerState.value![0],
      minutes: timerState.value![1],
      seconds: timerState.value![2]
    }).subtract(1, 'seconds');

    // timerStateを更新
    timerState.value = duration2ArrayTime(duration);

    // 残り時間が0になったらアラームを流して タイマーを止める
    if (duration.seconds() <= 0) {
      interval?.pause();
      timerState.value = null;
      audio.play();
    }
  }, 1000);
}

// タイマーの設定時間を増やす関数
function addTimerLimit(addtime: Array<number>) {
  timerSettingState.value = duration2ArrayTime(arrayTime2Duration(timerSettingState.value)
    .add(arrayTime2Duration(addtime)));
}

// 配列の時間をdurationに変換
function arrayTime2Duration(time: Array<number>) {
  return dayjs.duration({
    hours: time[0],
    minutes: time[1],
    seconds: time[2]
  });
}

// durationを配列の時間に変換
function duration2ArrayTime(duration: duration.Duration) {
  return duration.format('HH:mm:ss').split(':').map(v => parseInt(v));
}
</script>

<template>
  <NuxtLayout>
    <div class="min-h-screen flex flex-row text-center gap-2">
      <div class="basis-1/4 flex flex-row justify-between">
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
      </div>

      <div class="basis-1/2 flex flex-col max-h-max items-center justify-center gap-3">
        <!-- メイン表示 -->
        <h1 class="countdown text-[15vw] font-bold">
          <span :style="{ '--value': timerState != null ? timerState[0] : dayjs(timeState).hour() }"></span>:
          <span :style="{ '--value': timerState != null ? timerState[1] : dayjs(timeState).minute() }"></span>:
          <span :style="{ '--value': timerState != null ? timerState[2] : dayjs(timeState).second() }"></span>
        </h1>

        <!-- サブ表示 -->
        <h2>
          <div v-if="timerState != null" class="flex flex-row items-center">
            <span class="text-[4vw]"> {{ dayjs(timeState).format('MM/DD (ddd)') }}</span>
            <div class="countdown text-[7vw]">
              <span :style="{ '--value': dayjs(timeState).hour() }"></span>:
              <span :style="{ '--value': dayjs(timeState).minute() }"></span>:
              <span :style="{ '--value': dayjs(timeState).second() }"></span>
            </div>
          </div>
          <span v-if="timerState == null" class="text-[5vw]"> {{ dayjs(timeState).format('YYYY年 MM月DD日 (ddd)') }}</span>
        </h2>
      </div>

      <div class="basis-1/4 flex flex-col items-end gap-4">
        <div class="m-2">
          <h2 class="text-2xl mb-3">レポート日数</h2>
          <div :class="['radial-progress', 'text-4xl', needReportMonthAlert ? 'text-primary' : 'text-red-600']"
            :style="{ '--value': reportRatio, '--size': '10vw', '--thickness': '1vw' }">
            <!-- parseIntはマイナス0対策 -->
            {{ parseInt(reportMonthLimitDays.toFixed()) }}日
          </div>
        </div>

        <div class="grow m-2 flex flex-col justify-end items-center gap-2">
          <h3 class="text-xl font-bold">タイマー設定</h3>

          <div class="flex flex-row m-3">
            <input type="number" class="grow w-10 outline-none" placeholder="時間" min="0" max="60"
              :value="timerSettingState[0]" />
            <span class="font-bold mx-2">:</span>
            <input type="number" class="grow w-10 outline-none" placeholder="分" min="0" max="60"
              :value="timerSettingState[1]" />
            <span class="font-bold mx-2">:</span>
            <input type="number" class="grow w-10 outline-none" placeholder="秒" min="0" max="60"
              :value="timerSettingState[2]" />
          </div>

          <div class="flex flex-row gap-2">
            <button class="btn btn-secondary" @click="addTimerLimit([0, 1, 0])">+1分</button>
            <button class="btn btn-secondary" @click="addTimerLimit([0, 0, 10])">+10秒</button>
            <button class="btn btn-secondary" @click="timerSettingState = [0, 0, 0]">clear</button>
          </div>
          <button class="btn btn-primary" @click="startTimer()">スタート</button>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
