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

// 情報スクロールの有効化
const isInfoScrollEnabledSt = isInfoScrollEnabled();
// 情報スクロールに表示する文字列
const infoScrollTextSt = infoScrollText();

// 天気
const weatherState = weather();

// バナー宣伝画像の表示の切り替え
const bannerVisible = isBannerVisible();
// バナーのソース
const banner = bannerSource();
</script>

<template>
  <div class="flex flex-col xl:min-h-screen items-center justify-center gap-3">
    <!-- メイン表示 -->
    <h1 class="countdown text-[18vw] xl:text-[12.2vw] 2xl:text-[13vw] font-bold">
      <span :style="{ '--value': timerState != null ? timerState[0] : dayjs(timeState).hour() }"></span>:
      <span :style="{ '--value': timerState != null ? timerState[1] : dayjs(timeState).minute() }"></span>:
      <span :style="{ '--value': timerState != null ? timerState[2] : dayjs(timeState).second() }"></span>
    </h1>

    <!-- サブ表示 -->
    <h2>
      <div v-if="timerState != null" class="flex flex-row items-center">
        <span class="max-md:text-[6vw] text-[3.5vw] mr-3"> {{ dayjs(timeState).format('MM/DD (ddd)') }} </span>
        <div class="max-md:text-[12vw] text-[6vw] font-mono">
          <span> {{ dayjs(timeState).format("HH:mm:ss") }}</span>
        </div>
      </div>

      <div v-else-if="isInfoScrollEnabledSt" class="flex flex-row items-center">
        <span class="shrink max-md:text-[6vw] text-[4vw] mr-3 whitespace-nowrap"> {{ dayjs(timeState).format('MM/DD(ddd)')
        }} </span>
        <div class="scrolling-text max-md:text-[11vw] text-[5.3vw] font-bold text-primary border-2">
          <span
            :style="{ 'animation-duration': `${infoScrollTextSt.length <= 10 ? 4 : infoScrollTextSt.length * 0.4}s` }">
            {{ infoScrollTextSt }}</span>
        </div>
      </div>
      <span v-else class="text-[7vw] xl:text-[4.5vw] max-w-full">
        {{ dayjs(timeState).format('YYYY年MM月DD日(ddd)') }}
        <Icon :name="weatherState != null ? weatherState : 'system-uicons:cloud-disconnect'"
          class="stat-value m-auto leading-none" size="6vw" />*
      </span>
    </h2>

    <!-- 上部の宣伝画像エリア -->
    <div v-if="bannerVisible && widthScreenSize().value >= 1280" class="fixed top-0 m-3 z-10">
      <div v-if="banner != null" class="bg-neutral flex flex-row items-center rounded-xl border-4 overflow-hidden">
        <span class="p-2 text-neutral-content text-3xl [writing-mode:vertical-rl]">宣伝</span>
        <img :src="banner!" class="h-[17vh]">
      </div>
    </div>
  </div>
</template>

<style scoped>
.scrolling-text {
  white-space: nowrap;
  overflow: hidden;

  width: 40vw;
}

.scrolling-text span {
  display: inline-block;
  padding-left: 100%;
  animation: scroll 8s linear infinite;
}

@keyframes scroll {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-100%);
  }
}
</style>