import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { getRuntime, updateTimer } from '../store/runtime.ts';
import { playAudio, stopAudio } from './audio.ts';

dayjs.extend(duration);

let worker: Worker | null = null;

/** タイマー用のworkerを起動する */
export const startTimerWorker = () => {
  worker = new Worker(new URL('../workers/timer.ts', import.meta.url), { type: 'module' });

  worker.addEventListener('message', (event: MessageEvent<number[]>) => {
    const remaining = event.data;
    if (!Array.isArray(remaining)) return;

    if (remaining.every((v) => v === 0)) {
      // タイマーが0になったらアラートを鳴らし、タイマーを停止
      playAudio('alert');
      updateTimer({ active: false, remaining: null });
    } else {
      // タイマーの残り時間を更新
      updateTimer({ remaining });
    }
  });
};

// 配列の時間をdurationに変換
const arrayTime2Duration = (time: number[]) =>
  dayjs.duration({
    hours: time[0],
    minutes: time[1],
    seconds: time[2],
  });

// durationを配列の時間に変換
const duration2ArrayTime = (d: duration.Duration) => [Math.floor(d.asHours()), d.minutes(), d.seconds()];

// タイマーの開始
export const startTimer = () => {
  const { remaining, setting } = getRuntime().timer;

  // 一時停止からの再開でなければ、設定時間から開始
  const time = remaining ?? setting;
  if (time.every((v) => v === 0)) return;

  // 再開の場合は、workerが保持している残り時間 (1秒未満を含む) から続ける
  worker?.postMessage(remaining != null ? 'TIMER_RESUME' : 'TIMER_START:' + time.join(','));
  updateTimer({ active: true, remaining: time });
};

// タイマーの一時停止
export const pauseTimer = () => {
  worker?.postMessage('TIMER_PAUSE');
  updateTimer({ active: false });
};

// タイマーのリセット
export const resetTimer = () => {
  worker?.postMessage('TIMER_STOP');
  updateTimer({ active: false, remaining: null, setting: [0, 0, 0] });

  stopAudio('alert');
};

// タイマーの設定時間を増やす
export const addTimerLimit = (addtime: number[]) => {
  const { setting } = getRuntime().timer;
  updateTimer({ setting: duration2ArrayTime(arrayTime2Duration(setting).add(arrayTime2Duration(addtime))) });
};
