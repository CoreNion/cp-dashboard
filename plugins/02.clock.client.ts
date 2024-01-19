import dayjs from 'dayjs';

export default defineNuxtPlugin((nuxtApp) => {
  const worker = useNuxtApp().$worker;

  // 現在時刻State
  const timeState = time();
  timeState.value = dayjs().toDate();

  // チャイムの有効/無効
  const isChimeEnabledState = isChimeEnabled();
  const isPreChimeEnabledState = isPreChimeEnabled();

  let chimePlayed = false;
  let preChimePlayed = false;

  // 読み込み時点で予定時刻を過ぎたチャイム数を計算 (全数 - 過ぎてないチャイムの数)
  let chimeCount = chimeTimes.length - chimeTimes.filter((chimeTime) => {
    const chime = dayjs(timeState.value).hour(chimeTime[0]).minute(chimeTime[1]).second(0).millisecond(0);
    return chime.diff(dayjs()) > 0;
  }).length;
  // 読み込み時点で予定時刻を過ぎた予鈴数を計算 (全数 - 過ぎてない予鈴の数)
  let preChimeCount = preChimeTimes.length - preChimeTimes.filter((preChimeTime) => {
    const preChime = dayjs(timeState.value).hour(preChimeTime[0]).minute(preChimeTime[1]).second(0).millisecond(0);
    return preChime.diff(dayjs()) > 0;
  }).length;

  // workerからの時刻を用いて各種処理を行う
  worker.addEventListener('message', async (event: MessageEvent<Date>) => {
    const date = event.data;
    timeState.value = date;

    const now = dayjs(date);
    // チャイムを鳴らす時間か確認 (最後のチャイムの時間を過ぎたらならさない)
    if (!(chimeCount === chimeTimes.length)) {
      const chime = now.hour(chimeTimes[chimeCount][0]).minute(chimeTimes[chimeCount][1]).second(0).millisecond(0);
      if (chime.diff(now) <= 0 && isChimeEnabledState.value) {
        if (!chimePlayed) {
          // カウントを増やし、チャイムを鳴らす
          chimePlayed = true;
          chimeCount++;

          const audio = new Audio(chimeSource().value);
          audio.volume = 1.0;
          await audio.play();
        }
      } else {
        // 予定時間外はフラグをリセット
        chimePlayed = false;
      }
    } else if (now.hour(chimeTimes[0][0]).minute(chimeTimes[0][1]).second(0).millisecond(0).diff(now) >= 0) {
      // 日付が変わり、最初のチャイムの時間前になったらカウントをリセット
      chimeCount = 0;
    }

    // 予鈴を鳴らす時間か確認
    if (!(preChimeCount === preChimeTimes.length)) {
      const preChime = now.hour(preChimeTimes[preChimeCount][0]).minute(preChimeTimes[preChimeCount][1]).second(0).millisecond(0);
      if (preChime.diff(now) <= 0 && isPreChimeEnabledState.value) {
        if (!preChimePlayed) {
          // カウントを増やし、予鈴を鳴らす
          preChimePlayed = true;
          preChimeCount++;

          const audio = new Audio(preChimeSource().value);
          audio.volume = 1.0;
          await audio.play();
        } else {
          // 予定時間外はフラグをリセット
          preChimePlayed = false;
        }
      } else if (now.hour(preChimeTimes[0][0]).minute(preChimeTimes[0][1]).second(0).millisecond(0).diff(now) >= 0) {
        // 日付が変わり、最初のチャイムの時間前になったらカウントをリセット
        preChimeCount = 0;
      }
    }
  });
});