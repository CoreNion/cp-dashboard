export default defineNuxtPlugin((nuxtApp) => {
  const worker = useNuxtApp().$worker;

  const timerState = timer();

  worker.addEventListener('message', async (event: MessageEvent<Date | Array<number>>) => {
    const data = event.data;

    if (data instanceof Array) {
      // タイマーの残り時間を受け取ったら、それを用いてタイマーを更新
      timerState.value = data;

      if (timerState.value[0] === 0 && timerState.value[1] === 0 && timerState.value[2] === 0) {
        // タイマーが0になったらチャイムを鳴らす
        const audio = new Audio(timerAlertSource().value);
        audio.volume = 1.0;
        await audio.play();

        // タイマーを停止
        isTimerActive().value = false;
        timerState.value = null;
      }
    }
  });
});