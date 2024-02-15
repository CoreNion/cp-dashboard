<script setup lang="ts">
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import 'dayjs/locale/ja';

dayjs.extend(duration);
dayjs.locale("ja");

const isTimerActiveState = isTimerActive();

// チャイムの鳴動状態
const isChimeEnabledState = isChimeEnabled();
// 予鈴の鳴動状態
const isPreChimeEnabledState = isPreChimeEnabled();

// タイマー設定用時間 (h:m:s)
const timerSettingState = timerSetting();
</script>

<template>
  <div class="min-w-full flex flex-row flex-wrap justify-center items-center gap-2 ">
    <div class="xl:min-w-full flex flex-col gap-1">
      <label class="label cursor-pointer gap-4">
        <span class="label-text">チャイム</span>
        <input type="checkbox" class="toggle toggle-secondary" v-model="isChimeEnabledState" />
      </label>
      <label class="label cursor-pointer">
        <span class="label-text">予鈴</span>
        <input type="checkbox" class="toggle toggle-secondary" v-model="isPreChimeEnabledState" />
      </label>
    </div>

    <div>
      <h3 class="text-xl font-bold">タイマー設定</h3>

      <div class="flex flex-row items-center m-3">
        <input type="" class="grow w-14 outline-none input input-ghost" placeholder="時間" min="0" max="60"
          :value="timerSettingState[0]" />
        <span class="font-bold mx-2">:</span>
        <input type="" class="grow w-14 outline-none input input-ghost" placeholder="分" min="0" max="60"
          :value="timerSettingState[1]" />
        <span class="font-bold mx-2">:</span>
        <input type="" class="grow w-14 outline-none input input-ghost" placeholder="秒" min="0" max="60"
          :value="timerSettingState[2]" />
      </div>

      <div class="flex flex-col items-center gap-2">
        <div class="flex flex-row gap-2">
          <button class="btn btn-outline btn-secondary max-2xl:btn-sm" @click="addTimerLimit([0, 5, 0])">+5分</button>
          <button class="btn btn-outline btn-secondary max-2xl:btn-sm" @click="addTimerLimit([0, 1, 0])">+1分</button>
          <button class="btn btn-outline btn-secondary max-2xl:btn-sm" @click="addTimerLimit([0, 0, 10])">+10秒</button>
        </div>

        <div class="flex gap-2 justify-center">
          <button class="btn btn-primary max-2xl:btn-sm" @click="isTimerActiveState ? pauseTimer() : startTimer()"> {{
            isTimerActiveState ?
            "一時停止" :
            "スタート" }}</button>
          <button class="btn btn-neutral max-2xl:btn-sm" @click="resetTimer()">clear</button>
        </div>
      </div>
    </div>
  </div>
</template>