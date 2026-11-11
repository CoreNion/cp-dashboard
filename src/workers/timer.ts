/* タイマーの管理用のworker */

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

// タイマーの状態
let timerEnabled: boolean = false;
// タイマーの残り時間 (h:m:s)
let lastTime: number[] | null = null;
// 開始のたびに増える番号 (古いループを確実に終了させるために使用)
let generation = 0;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

self.addEventListener('message', async (event: MessageEvent<unknown>) => {
  const d = event.data;
  if (typeof d !== 'string') return;

  if (d.startsWith('TIMER_START:')) {
    // タイマーの残り時間を設定
    lastTime = d
      .split(':')[1]
      .split(',')
      .map((v) => parseInt(v));

    // タイマー用のループを開始
    timerEnabled = true;
    const current = ++generation;
    while (timerEnabled) {
      // 1秒待つ
      await sleep(1000);

      // 待っている間に再スタートされていたら、新しいループに任せて終了
      if (current !== generation) break;

      // 待っている間に一時停止/リセットされていたら終了
      if (!timerEnabled || lastTime === null) {
        timerEnabled = false;
        break;
      }

      // 残り時間を更新
      const remaining: duration.Duration = dayjs
        .duration({
          hours: lastTime[0],
          minutes: lastTime[1],
          seconds: lastTime[2],
        })
        .subtract(1, 'seconds');
      lastTime = [Math.floor(remaining.asHours()), remaining.minutes(), remaining.seconds()];

      // メインスレッドに残り時間を通知
      self.postMessage(lastTime);

      if (remaining.asSeconds() <= 0) {
        // タイマーを停止
        timerEnabled = false;
        lastTime = null;
        break;
      }
    }
  } else if (d.startsWith('TIMER_PAUSE')) {
    // タイマーを一時停止
    timerEnabled = false;
  } else if (d.startsWith('TIMER_STOP')) {
    // タイマーを停止
    timerEnabled = false;
    lastTime = null;
  }
});
