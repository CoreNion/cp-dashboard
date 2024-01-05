<script setup lang="ts">
import { useIntervalFn } from '@vueuse/core'
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import 'dayjs/locale/ja';

dayjs.extend(duration);
dayjs.locale("ja");

// 現在時刻
const timeState = time();
// タイマーの残り時間
const timerState = timer();

// チャイムの有効/無効
const isChimeEnabledState = isChimeEnabled();
const isPreChimeEnabledState = isPreChimeEnabled();

let chimePlayed = false;
let preChimePlayed = false;

onMounted(() => {
  // 予定時刻を過ぎたチャイム数を計算 (全数 - 過ぎてないチャイムの数)
  let chimeCount = chimeTimes.length - chimeTimes.filter((chimeTime) => {
    const chime = dayjs().hour(chimeTime[0]).minute(chimeTime[1]).second(0).millisecond(0);
    return chime.diff(dayjs()) > 0;
  }).length;
  // 予定時刻を過ぎた予鈴数を計算 (全数 - 過ぎてない予鈴の数)
  let preChimeCount = preChimeTimes.length - preChimeTimes.filter((preChimeTime) => {
    const preChime = dayjs().hour(preChimeTime[0]).minute(preChimeTime[1]).second(0).millisecond(0);
    return preChime.diff(dayjs()) > 0;
  }).length;

  // 500msごとに現在時刻を更新
  useIntervalFn(async () => {
    const now = dayjs();
    timeState.value = now.toDate();

    // チャイムを鳴らす時間か確認 (最後のチャイムの時間を過ぎたらならさない)
    if (!(chimeCount === chimeTimes.length)) {
      const chime = now.hour(chimeTimes[chimeCount][0]).minute(chimeTimes[chimeCount][1]).second(0).millisecond(0);
      if (chime.diff(now) <= 0 && isChimeEnabledState.value) {
        if (!chimePlayed) {
          // カウントを増やし、チャイムを鳴らす
          chimePlayed = true;
          chimeCount++;

          const audio = new Audio(chimeSource().value);
          audio.volume = 1.0;
          await audio.play();
        }
      } else {
        // 予定時間外はフラグをリセット
        chimePlayed = false;
      }
    } else if (now.hour(chimeTimes[0][0]).minute(chimeTimes[0][1]).second(0).millisecond(0).diff(now) >= 0) {
      // 日付が変わり、最初のチャイムの時間前になったらカウントをリセット
      chimeCount = 0;
    }

    // 予鈴を鳴らす時間か確認
    if (!(preChimeCount === preChimeTimes.length)) {
      const preChime = now.hour(preChimeTimes[preChimeCount][0]).minute(preChimeTimes[preChimeCount][1]).second(0).millisecond(0);
      if (preChime.diff(now) <= 0 && isPreChimeEnabledState.value) {
        if (!preChimePlayed) {
          // カウントを増やし、予鈴を鳴らす
          preChimePlayed = true;
          preChimeCount++;

          const audio = new Audio(preChimeSource().value);
          audio.volume = 1.0;
          await audio.play();
        }
      } else if (now.hour(preChimeTimes[0][0]).minute(preChimeTimes[0][1]).second(0).millisecond(0).diff(now) >= 0) {
        // 日付が変わり、最初のチャイムの時間前になったらカウントをリセット
        preChimeCount = 0;
      }
    }
  }, 100);
})

</script>

<template>
  <div class="flex flex-col xl:min-h-screen items-center justify-center gap-3">
    <!-- メイン表示 -->
    <ClientOnly>
      <h1 class="countdown text-[18vw] xl:text-[12.2vw] 2xl:text-[13vw] font-bold">
        <span :style="{ '--value': timerState != null ? timerState[0] : dayjs(timeState).hour() }"></span>:
        <span :style="{ '--value': timerState != null ? timerState[1] : dayjs(timeState).minute() }"></span>:
        <span :style="{ '--value': timerState != null ? timerState[2] : dayjs(timeState).second() }"></span>
      </h1>
    </ClientOnly>

    <!-- サブ表示 -->
    <ClientOnly>
      <h2>
        <div v-if="timerState != null" class="flex flex-row items-center">
          <span class="max-md:text-[6vw] text-[3.5vw] mr-3"> {{ dayjs(timeState).format('MM/DD (ddd)') }} </span>
          <div class="max-md:text-[12vw] text-[6vw] font-mono">
            <span> {{ dayjs(timeState).format("HH:mm:ss") }}</span>
          </div>
        </div>
        <span v-if="timerState == null" class="text-[7vw] xl:text-[4.5vw]">
          {{ dayjs(timeState).format('YYYY年MM月DD日(ddd)') }}
        </span>
      </h2>
    </ClientOnly>
  </div>
</template>
