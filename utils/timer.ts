import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import 'dayjs/locale/ja';

// タイマーの開始
export function startTimer() {
  // タイマーの残り時間を設定
  if (timer().value === null) {
    timer().value = timerSetting().value;
  }

  // useNuxtApp().$workerにタイマー開始をリクエスト
  useNuxtApp().$timerWorker.postMessage("TIMER_START:" + timer().value!.join(","));

  isTimerActive().value = true;
}

// タイマーの一時停止
export function pauseTimer() {
  useNuxtApp().$timerWorker.postMessage("TIMER_PAUSE");
  isTimerActive().value = false;
}

// タイマーのリセット
export function resetTimer() {
  useNuxtApp().$timerWorker.postMessage("TIMER_STOP");

  timer().value = null;
  timerSetting().value = [0, 0, 0];
  isTimerActive().value = false;
}

// タイマーの設定時間を増やす関数
export function addTimerLimit(addtime: Array<number>) {
  timerSetting().value = duration2ArrayTime(arrayTime2Duration(timerSetting().value)
    .add(arrayTime2Duration(addtime)));
}

// 配列の時間をdurationに変換
export function arrayTime2Duration(time: Array<number>) {
  return dayjs.duration({
    hours: time[0],
    minutes: time[1],
    seconds: time[2]
  });
}

// durationを配列の時間に変換
export function duration2ArrayTime(duration: duration.Duration) {
  return duration.format('HH:mm:ss').split(':').map(v => parseInt(v));
}