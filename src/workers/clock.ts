/* 時計更新用のworker (バックグラウンドのタブでも正確に動作させるため、メインスレッドから分離) */

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  // 現在時刻を送信
  self.postMessage(new Date());

  // 1秒ごとに時刻を送信
  // 時刻が1秒進んだタイミングに同期するために、時刻が切り替わった瞬間を待ってからループを開始
  await sleep(1000 - new Date().getMilliseconds());
  while (true) {
    // 現在時刻を送信
    self.postMessage(new Date());

    // 1秒待つ
    await sleep(1000);
  }
})();
