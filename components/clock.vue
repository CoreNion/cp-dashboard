<script setup lang="ts">
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import 'dayjs/locale/ja';

dayjs.extend(duration);
dayjs.locale("ja");

// 現在時刻
const timeState = time();
// タイマーの残り時間
const timerState = timer();

// 天気
const weatherState = weather();
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
          <IconCSS :name="weatherState != null ? weatherState : 'system-uicons:cloud-disconnect'"
            class="stat-value m-auto leading-none" size="6vw" />*
        </span>
      </h2>
    </ClientOnly>
  </div>
</template>
