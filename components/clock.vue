<script setup lang="ts">
import { useIntervalFn } from '@vueuse/core'
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import 'dayjs/locale/ja';

dayjs.extend(duration);
dayjs.locale("ja");

// 現在時刻
const timeState = useState('time', () => dayjs().toDate());
// タイマーの残り時間
const timerState = timer();

// チャイムの有効/無効
const isChimeEnabledState = isChimeEnabled();

// チャイムを鳴らす時間
const chimeTimes = [
  // 朝礼
  [9, 30],
  // 1限
  [9, 45],
  // 2限
  [10, 35],
  [10, 45],
  // 3限
  [11, 35],
  [11, 45],
  // 4限
  [13, 15],
  [14, 5],
  // 5限
  [14, 15],
  [15, 5],
  // 6限
  [15, 15],
  [16, 5],
  // 学校終了
  [16, 15],
  // 完全下校
  [17, 30],
];

// 予定時刻を過ぎたチャイム数を計算 (全数 - 過ぎてないチャイムの数)
let chimeCount = chimeTimes.length - chimeTimes.filter((chimeTime) => {
  const chime = dayjs().hour(chimeTime[0]).minute(chimeTime[1]).second(0).millisecond(0);
  return chime.diff(dayjs()) > 0;
}).length;

// 100msごとに現在時刻を更新
useIntervalFn(async () => {
  const now = dayjs();
  timeState.value = now.toDate();

  // チャイムを鳴らす時間か確認
  const chime = dayjs().hour(chimeTimes[chimeCount][0]).minute(chimeTimes[chimeCount][1]).second(0).millisecond(0);
  if (chime.diff(now) <= 0 && isChimeEnabledState.value) {
    // カウントを増やし、チャイムを鳴らす
    chimeCount++;
    const audio = new Audio('/alert.mp3');
    audio.play();

    if (chimeCount === chimeTimes.length) {
      // 全てのチャイムが鳴ったらカウントをリセット
      chimeCount = 0;
    }
  }
}, 100);

</script>

<template>
  <div class="flex flex-col 2xl:min-h-screen items-center justify-center gap-3">
    <!-- メイン表示 -->
    <ClientOnly>
      <h1 class="countdown max-md:text-[21.5vw] text-[15vw] font-bold">
        <span :style="{ '--value': timerState != null ? timerState[0] : dayjs(timeState).hour() }"></span>:
        <span :style="{ '--value': timerState != null ? timerState[1] : dayjs(timeState).minute() }"></span>:
        <span :style="{ '--value': timerState != null ? timerState[2] : dayjs(timeState).second() }"></span>
      </h1>
    </ClientOnly>

    <!-- サブ表示 -->
    <ClientOnly>
      <h2>
        <div v-if="timerState != null" class="flex flex-row items-center">
          <span class="max-md:text-[6vw] text-[4vw] mr-3"> {{ dayjs(timeState).format('MM/DD (ddd)') }} </span>
          <div class="max-md:text-[12vw] text-[7vw] font-mono">
            <span> {{ dayjs(timeState).format("HH:mm:ss") }}</span>
          </div>
        </div>
        <span v-if="timerState == null" class="max-md:text-[9vw] text-[5vw]">
          {{ dayjs(timeState).format('YYYY年MM月DD日(ddd)') }}
        </span>
      </h2>
    </ClientOnly>
  </div>
</template>
