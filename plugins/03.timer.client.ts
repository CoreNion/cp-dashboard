export default defineNuxtPlugin((nuxtApp) => {
  const worker = new Worker(new URL('../workers/timer.ts', import.meta.url), { type: 'module' });

  const timerState = timer();

  worker.addEventListener('message', async (event: MessageEvent<Date | Array<number>>) => {
    const data = event.data;

    if (data instanceof Array) {
      // タイマーの残り時間を受け取ったら、それを用いてタイマーを更新
      timerState.value = data;

      if (timerState.value[0] === 0 && timerState.value[1] === 0 && timerState.value[2] === 0) {
        // タイマーが0になったらチャイムを鳴らす
        timerAlertSource().value.volume = 1.0;
        await timerAlertSource().value.play();

        // タイマーを停止
        isTimerActive().value = false;
        timerState.value = null;
      }
    }
  });

  return {
    provide: {
      timerWorker: worker
    }
  }
});