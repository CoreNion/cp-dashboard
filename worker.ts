import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import 'dayjs/locale/ja';

dayjs.extend(duration);
dayjs.locale("ja");

// タイマーのInterval
let interval: NodeJS.Timeout | null = null;
// タイマーの残り時間 (h:m:s)
let lastTime: number[] = [0, 0, 0];

// 時計更新用のworker
setInterval(() => {
  self.postMessage(dayjs().toDate());
}, 100);

// タイマーの管理用のworker
self.addEventListener('message', (event) => {
  const d = event.data;
  if (typeof d !== "string") return;

  if (d.startsWith("TIMER_START:")) {
    lastTime = d.split(":")[1].split(",").map(v => parseInt(v));
    
    // タイマー用のIntervalを開始
    interval = setInterval(() => {
      // 残り時間を更新
      let duration = dayjs.duration({
        hours: lastTime![0],
        minutes: lastTime![1],
        seconds: lastTime![2]
      }).subtract(1, 'seconds');
      lastTime = duration.format('HH:mm:ss').split(':').map(v => parseInt(v));

      // timerStateを更新
      self.postMessage(lastTime);

      if (duration.asSeconds() <= 0) {
        // タイマー用のIntervalを停止
        clearInterval(interval!);
        interval = null;
      }
    }, 1000);
  } else if (d.startsWith("TIMER_PAUSE")) {
    // タイマー用のIntervalを停止
    clearInterval(interval!);
  } else if (d.startsWith("TIMER_STOP")) {
    // タイマー用のIntervalを停止
    clearInterval(interval!);
    interval = null;
  }
});