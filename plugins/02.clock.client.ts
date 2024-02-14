import dayjs from 'dayjs';

export default defineNuxtPlugin((nuxtApp) => {
  const worker = useNuxtApp().$worker;

  // 現在時刻State
  const timeState = time();
  timeState.value = dayjs().toDate();

  // workerからの時刻を用いて各種処理を行う
  worker.addEventListener('message', async (event: MessageEvent<Date | Array<number>>) => {
    const data = event.data;

    if (data instanceof Date) {
      // 現在時刻を更新
      timeState.value = data;

      // チャイムの有効/無効
      const isChimeEnabledState = isChimeEnabled();
      const isPreChimeEnabledState = isPreChimeEnabled();

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
          userChimeTimesState.forEach((cT) => {
            chimePlayedState.set(cT.time, false);
            preChimePlayedState.set(cT.time, false);
          });
        }

        userChimeTimesState.forEach((cT) => {
          if (now.format("HH:mm") === cT.time && cT.chime && !chimePlayedState.get(cT.time)) {
            // チャイムを鳴らす
            if (isChimeEnabledState.value) {
              new Audio(chimeSource().value).play();
            }
            chimePlayedState.set(cT.time, true);
          } else if (now.add(1, 'minute').format("HH:mm") === dayjs().hour(parseInt(cT.time.split(":")[0])).minute(parseInt(cT.time.split(":")[1])).format("HH:mm") && cT.preChime && !preChimePlayedState.get(cT.time)) {
            // 予鈴を鳴らす
            if (isPreChimeEnabledState.value) {
              new Audio(preChimeSource().value).play();
            }
            preChimePlayedState.set(cT.time, true);
          }
        });
      }
    }
  });
});