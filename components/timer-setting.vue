<script setup lang="ts">
import { useIntervalFn, type Pausable } from '@vueuse/core'
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import 'dayjs/locale/ja';

dayjs.extend(duration);
dayjs.locale("ja");

const djs = dayjs();

const intervalState = interval();
const isTimerActiveState = isTimerActive();
const timerState = timer();

// タイマー設定用時間 (h:m:s)
const timerSettingState: Ref<number[]> = useState('timerSetting', () => [0, 0, 0]);

// タイマーの開始
function startTimer() {
  // 一時停止されている場合は再開
  if (intervalState.value?.isActive) {
    intervalState.value?.resume();
    isTimerActiveState.value = true;
    return;
  }

  // タイマーの音
  const audio = new Audio('./alert.mp3');

  // タイマーの残り時間を設定
  timerState.value = timerSettingState.value;

  // タイマーのインターバルを設定
  intervalState.value = useIntervalFn(() => {
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
      audio.play();
      resetTimer();
    }
  }, 1000);
  isTimerActiveState.value = true;
}

// タイマーの一時停止
function pauseTimer() {
  intervalState.value?.pause();
  isTimerActiveState.value = false;
}

// タイマーのリセット
function resetTimer() {
  timerState.value = null;
  timerSettingState.value = [0, 0, 0];
  intervalState.value?.pause();
  intervalState.value = null;
  isTimerActiveState.value = false;
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
  <div class="flex flex-col justify-end items-center gap-2">
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
      <button class="btn btn-secondary" @click="addTimerLimit([0, 5, 0])">+5分</button>
      <button class="btn btn-secondary" @click="addTimerLimit([0, 1, 0])">+1分</button>
      <button class="btn btn-secondary" @click="addTimerLimit([0, 0, 10])">+10秒</button>
    </div>
    <div class="flex flex-row gap-2">
      <button class="btn btn-primary" @click="isTimerActiveState ? pauseTimer() : startTimer()"> {{ isTimerActiveState ? "一時停止" :
        "スタート" }}</button>
      <button class="btn btn-secondary" @click="resetTimer()">clear</button>
    </div>
  </div>
</template>