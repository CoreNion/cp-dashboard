import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import 'dayjs/locale/ja';

dayjs.extend(duration);
dayjs.locale("ja");

// タイマーの状態
let timerEnabled: boolean = false;
// タイマーの残り時間 (h:m:s)
let lastTime: number[] = [0, 0, 0];

/* 
  setIntervalを使用すると、nuxtが読み込まれてしまうため、setTimeout/loopを使用
  https://github.com/nuxt/nuxt/blob/v3.10.2/packages/nuxt/src/app/compat/interval.ts
*/
// 時計更新用のworker
(async () => {
  // 現在時刻を送信
  self.postMessage(new Date());

  // 1秒ごとに時刻を送信
  // 時刻が1秒進んだタイミングに同期するために、時刻が切り替わった瞬間を待ってからループを開始
  await new Promise(resolve => setTimeout(resolve, 1000 - new Date().getMilliseconds()));
  while (true) {
    // 現在時刻を送信
    self.postMessage(new Date());

    // 1秒待つ
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
})();

// タイマーの管理用のworker
self.addEventListener('message', async (event) => {
  const d = event.data;
  if (typeof d !== "string") return;

  if (d.startsWith("TIMER_START:")) {
    // タイマーの残り時間を設定
    lastTime = d.split(":")[1].split(",").map(v => parseInt(v));

    // タイマー用のループを開始
    timerEnabled = true;
    while (timerEnabled) {
      // 1秒待つ
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 残り時間を更新
      let duration = dayjs.duration({
        hours: lastTime![0],
        minutes: lastTime![1],
        seconds: lastTime![2]
      }).subtract(1, 'seconds');
      lastTime = duration.format('HH:mm:ss').split(':').map(v => parseInt(v));

      if (duration.asSeconds() <= 0) {
        // タイマー用のIntervalを停止
        timerEnabled = false;
        lastTime = [0, 0, 0];
      }

      // timerStateを更新
      self.postMessage(lastTime);
    }
  } else if (d.startsWith("TIMER_PAUSE")) {
    // タイマー用のIntervalを停止
    timerEnabled = false;
  } else if (d.startsWith("TIMER_STOP")) {
    // タイマー用のIntervalを停止
    timerEnabled = false;
    lastTime = [0, 0, 0];
  }
});