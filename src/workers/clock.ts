/* 時計更新用のworker (バックグラウンドのタブでも正確に動作させるため、メインスレッドから分離) */

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  while (true) {
    // 現在時刻を送信
    self.postMessage(new Date());

    // 次に秒が切り替わる瞬間まで待つ
    // 毎回秒の境界に合わせ直すことで、待ち時間の遅延が蓄積しないようにする (+1msは境界の手前で起きるのを防ぐため)
    await sleep(1000 - (Date.now() % 1000) + 1);
  }
})();
