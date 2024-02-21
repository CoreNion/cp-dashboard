export function addChimeTime(time: string) {
  // チャイムの鳴動時刻を追加
  const userChimeTimesState = userChimeTimes();
  userChimeTimesState.value = [...userChimeTimesState.value, { time: time, chime: true, preChime: false }];

  // チャイム鳴動状況を更新
  const chimePlayedState = chimePlayed()
  chimePlayedState.value.set(time, false);
  const preChimePlayedState = preChimePlayed()
  preChimePlayedState.value.set(time, false);
}

export function removeChimeTime(time: string) {
  // チャイムの鳴動時刻を削除
  const userChimeTimesState = userChimeTimes();
  userChimeTimesState.value = userChimeTimesState.value.filter((t) => t.time !== time);

  // チャイム鳴動状況を更新
  const chimePlayedState = chimePlayed()
  chimePlayedState.value.delete(time);
  const preChimePlayedState = preChimePlayed()
  preChimePlayedState.value.delete(time);
}

export function changeChimeTime(oldTime: ChimeTime, newTime: ChimeTime) {
  // チャイムの鳴動時刻を変更
  const userChimeTimesState = userChimeTimes();
  userChimeTimesState.value = userChimeTimesState.value.map((t) => t.time === oldTime.time ? newTime : t);

  // チャイム鳴動状況を更新
  const chimePlayedState = chimePlayed();
  chimePlayedState.value.set(newTime.time, chimePlayedState.value.get(oldTime.time)!);
  chimePlayedState.value.delete(oldTime.time);
  const preChimePlayedState = preChimePlayed()
  preChimePlayedState.value.set(newTime.time, preChimePlayedState.value.get(oldTime.time)!);
  preChimePlayedState.value.delete(oldTime.time);
}

export interface ChimeTime {
  time: string;
  chime: boolean;
  preChime: boolean;
}

export interface CountdownData {
  date: string;
  label: string;
  color: string;
  everyYear?: boolean;
  everyMonth?: boolean;
  everyDay?: boolean;
}