/* タイマーの管理用のworker */

// 動作中のタイマーの終了時刻 (ms)
let endAt: number | null = null;
// 一時停止中の残り時間 (ms)
let pausedRemaining: number | null = null;
// 開始/停止のたびに増える番号 (古いループを確実に終了させるために使用)
let generation = 0;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 秒数を配列の時間 (h:m:s) に変換
const seconds2ArrayTime = (seconds: number) => [Math.floor(seconds / 3600), Math.floor((seconds % 3600) / 60), seconds % 60];

/**
 * 残り時間からタイマーを動かす。
 * 1秒ずつ減らすのではなく終了時刻から残り時間を計算するため、待ち時間の遅延が蓄積しない
 */
const runTimer = async (remainingMs: number) => {
  const current = ++generation;
  const end = Date.now() + remainingMs;
  endAt = end;
  pausedRemaining = null;

  let lastSeconds = Math.ceil(remainingMs / 1000);
  while (true) {
    // 残り秒数の表示が次に変わる時刻まで待つ
    const left = end - Date.now();
    await sleep(Math.max(left - (Math.ceil(left / 1000) - 1) * 1000, 0));

    // 待っている間に一時停止/リセット/再スタートされていたら終了
    if (current !== generation) return;

    const seconds = Math.max(Math.ceil((end - Date.now()) / 1000), 0);
    if (seconds === lastSeconds) continue;
    lastSeconds = seconds;

    // メインスレッドに残り時間を通知
    self.postMessage(seconds2ArrayTime(seconds));

    if (seconds <= 0) {
      // タイマーを停止
      endAt = null;
      return;
    }
  }
};

self.addEventListener('message', (event: MessageEvent<unknown>) => {
  const d = event.data;
  if (typeof d !== 'string') return;

  if (d.startsWith('TIMER_START:')) {
    // 指定された時間 (h,m,s) からタイマーを開始
    const [hours, minutes, seconds] = d
      .split(':')[1]
      .split(',')
      .map((v) => parseInt(v));
    runTimer((hours * 3600 + minutes * 60 + seconds) * 1000);
  } else if (d.startsWith('TIMER_RESUME')) {
    // 一時停止した時点の残り時間から再開
    if (pausedRemaining !== null) runTimer(pausedRemaining);
  } else if (d.startsWith('TIMER_PAUSE')) {
    // タイマーを一時停止 (1秒未満の経過分も保持する)
    if (endAt !== null) {
      generation++;
      pausedRemaining = Math.max(endAt - Date.now(), 0);
      endAt = null;
    }
  } else if (d.startsWith('TIMER_STOP')) {
    // タイマーを停止
    generation++;
    endAt = null;
    pausedRemaining = null;
  }
});
