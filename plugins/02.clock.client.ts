import dayjs from 'dayjs';

export default defineNuxtPlugin((nuxtApp) => {
  const worker = useNuxtApp().$worker;

  // 現在時刻State
  const timeState = time();
  timeState.value = dayjs().toDate();

  // チャイムの有効/無効
  const isChimeEnabledState = isChimeEnabled();
  const isPreChimeEnabledState = isPreChimeEnabled();

  // workerからの時刻を用いて各種処理を行う
  worker.addEventListener('message', async (event: MessageEvent<Date | Array<number>>) => {
    const data = event.data;

    if (data instanceof Date) {
      // 現在時刻を更新
      timeState.value = data;

      if (isChimeEnabledState.value) {
        // 現在のチャイムの鳴動状況を取得
        const userChimeTimesState = userChimeTimes().value;
        const chimePlayedState = chimePlayed().value;
        const preChimePlayedState = preChimePlayed().value;

        // チャイムを鳴らす時間か確認
        const now = dayjs(data);

        // 毎日0時にチャイム鳴動状況をリセット
        if (now.hour() === 0 && now.minute() === 0) {
          chimePlayedState.clear();
          preChimePlayedState.clear();
          userChimeTimesState.forEach((time) => {
            chimePlayedState.set(time, false);
            preChimePlayedState.set(time, false);
          });
        }

        userChimeTimesState.forEach((time) => {
          if (now.format("HH:mm") === time && !chimePlayedState.get(time)) {
            // チャイムを鳴らす
            if (isChimeEnabledState.value) {
              new Audio(chimeSource().value).play();
            }
            chimePlayedState.set(time, true);
          } else if (now.add(1, 'minute').format("HH:mm") === time && !preChimePlayedState.get(time)) {
            // 予鈴を鳴らす
            if (isPreChimeEnabledState.value) {
              new Audio(preChimeSource().value).play();
            }
            preChimePlayedState.set(time, true);
          }
        });
      }
    }
  });
});