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

// 1秒ごとに現在時刻を更新
useIntervalFn(async () => {
  timeState.value = dayjs().toDate();
}, 1000);

</script>

<template>
  <div class="flex flex-col min-h-screen items-center justify-center gap-3">
    <!-- メイン表示 -->
    <h1 class="countdown max-xl:text-[20vw] text-[15vw] font-bold">
      <span :style="{ '--value': timerState != null ? timerState[0] : dayjs(timeState).hour() }"></span>:
      <span :style="{ '--value': timerState != null ? timerState[1] : dayjs(timeState).minute() }"></span>:
      <span :style="{ '--value': timerState != null ? timerState[2] : dayjs(timeState).second() }"></span>
    </h1>

    <!-- サブ表示 -->
    <h2>
      <div v-if="timerState != null" class="flex flex-row items-center">
        <span class="text-[4vw] mr-3"> {{ dayjs(timeState).format('MM/DD (ddd)') }} </span>
        <div class="text-[7vw] font-mono">
          <span> {{ dayjs(timeState).format("HH:mm:ss") }}</span>
        </div>
      </div>
      <span v-if="timerState == null" class="max-xl:text-[7vw] text-[5vw]"> {{ dayjs(timeState).format('YYYY年 MM月DD日(ddd)') }}</span>
    </h2>
  </div>
</template>
