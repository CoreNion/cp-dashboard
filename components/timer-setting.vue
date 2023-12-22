<script setup lang="ts">
import { useIntervalFn, type Pausable } from '@vueuse/core'
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import 'dayjs/locale/ja';

dayjs.extend(duration);
dayjs.locale("ja");

const intervalState = interval();
const isTimerActiveState = isTimerActive();
const timerState = timer();

const chimeStatus = chimeComputed();
const preChimeStatus = preChimeComputed();

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
  const audio = new Audio(timerAlertSource().value);
  audio.volume = 1.0;

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
    if (duration.asSeconds() <= 0) {
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
  <div class="min-w-full flex max-xl:flex-row flex-col justify-center items-center gap-2 max-sm:flex-wrap">
    <div class="2xl:min-w-full flex flex-col gap-1">
      <label class="label cursor-pointer">
        <span class="label-text">チャイム</span>
        <input type="checkbox" class="toggle toggle-secondary" v-model="chimeStatus" />
      </label>
      <label class="label cursor-pointer">
        <span class="label-text">予鈴</span>
        <input type="checkbox" class="toggle toggle-secondary" v-model="preChimeStatus" />
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
    </div>

    <div class="flex flex-col gap-2">
      <div class="flex flex-row gap-2">
        <button class="btn btn-outline btn-secondary" @click="addTimerLimit([0, 5, 0])">+5分</button>
        <button class="btn btn-outline btn-secondary" @click="addTimerLimit([0, 1, 0])">+1分</button>
        <button class="btn btn-outline btn-secondary" @click="addTimerLimit([0, 0, 10])">+10秒</button>
      </div>

      <div class="flex gap-2 justify-center">
        <button class="btn btn-primary" @click="isTimerActiveState ? pauseTimer() : startTimer()"> {{ isTimerActiveState ?
          "一時停止" :
          "スタート" }}</button>
        <button class="btn btn-neutral" @click="resetTimer()">clear</button>
      </div>
    </div>
  </div>
</template>