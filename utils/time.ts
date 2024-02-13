export function addChimeTime(time: string) {
  // チャイムの鳴動時刻を追加
  const userChimeTimesState = userChimeTimes();
  userChimeTimesState.value = [...userChimeTimesState.value, time];

  // チャイム鳴動状況を更新
  const chimePlayedState = chimePlayed()
  chimePlayedState.value.set(time, false);
  const preChimePlayedState = preChimePlayed()
  preChimePlayedState.value.set(time, false);
}

export function removeChimeTime(time: string) {
  // チャイムの鳴動時刻を削除
  const userChimeTimesState = userChimeTimes();
  userChimeTimesState.value = userChimeTimesState.value.filter((t) => t !== time);

  // チャイム鳴動状況を更新
  const chimePlayedState = chimePlayed()
  chimePlayedState.value.delete(time);
  const preChimePlayedState = preChimePlayed()
  preChimePlayedState.value.delete(time);
}

export function changeChimeTime(oldTime: string, newTime: string) {
  // チャイムの鳴動時刻を変更
  const userChimeTimesState = userChimeTimes();
  userChimeTimesState.value = userChimeTimesState.value.map((t) => t === oldTime ? newTime : t);

  // チャイム鳴動状況を更新
  const chimePlayedState = chimePlayed()
  chimePlayedState.value.set(newTime, chimePlayedState.value.get(oldTime)!);
  chimePlayedState.value.delete(oldTime);
  const preChimePlayedState = preChimePlayed()
  preChimePlayedState.value.set(newTime, preChimePlayedState.value.get(oldTime)!);
  preChimePlayedState.value.delete(oldTime);
}