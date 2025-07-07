// 時刻表示の効果
export const kClockEffects = ['自動 (端末に最適化)', 'シンプル', 'アニメーション'] as const;
export type ClockEffectType = typeof kClockEffects[number];

export function addChimeTime(time: string) {
  // チャイムの鳴動時刻を追加
  const userChimeTimesState = userChimeTimes();
  userChimeTimesState.value = sortChimeTimes([...userChimeTimesState.value, { time: time, chime: true, preChime: false }]);

  // チャイム鳴動状況を更新
  const chimePlayedState = chimePlayed()
  chimePlayedState.value.set(time, false);
  const preChimePlayedState = preChimePlayed()
  preChimePlayedState.value.set(time, false);
}

export function removeChimeTime(time: string) {
  // チャイムの鳴動時刻を削除
  const userChimeTimesState = userChimeTimes();
  userChimeTimesState.value = sortChimeTimes(userChimeTimesState.value.filter((t) => t.time !== time));

  // チャイム鳴動状況を更新
  const chimePlayedState = chimePlayed()
  chimePlayedState.value.delete(time);
  const preChimePlayedState = preChimePlayed()
  preChimePlayedState.value.delete(time);
}

export function changeChimeTime(oldTime: ChimeTime, newTime: ChimeTime) {
  // チャイムの鳴動時刻を変更
  const userChimeTimesState = userChimeTimes();
  userChimeTimesState.value = sortChimeTimes(userChimeTimesState.value.map((t) => t.time === oldTime.time ? newTime : t));

  // チャイム鳴動状況を更新
  const chimePlayedState = chimePlayed();
  chimePlayedState.value.set(newTime.time, chimePlayedState.value.get(oldTime.time)!);
  chimePlayedState.value.delete(oldTime.time);
  const preChimePlayedState = preChimePlayed()
  preChimePlayedState.value.set(newTime.time, preChimePlayedState.value.get(oldTime.time)!);
  preChimePlayedState.value.delete(oldTime.time);
}

/// チャイムの鳴動時刻を昇順でソート
function sortChimeTimes(times: ChimeTime[]) {
  return times.sort((a, b) => {
    if (a.time < b.time) {
      return -1;
    } else if (a.time > b.time) {
      return 1;
    } else {
      return 0;
    }
  });
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
  type: CountdownDateType;
}

export type CountdownDateType = "yearly" | "once";