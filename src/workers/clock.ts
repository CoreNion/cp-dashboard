/* 時計更新用のworker */

import dayjs from 'dayjs';
import 'dayjs/locale/ja';

dayjs.locale("ja");

/* 
  setIntervalを使用すると、nuxtが読み込まれてしまうため、setTimeout/loopを使用
  https://github.com/nuxt/nuxt/blob/v3.10.2/packages/nuxt/src/app/compat/interval.ts
*/
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
