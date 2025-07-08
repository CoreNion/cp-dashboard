'use client';

import { useState, useEffect, useCallback } from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import 'dayjs/locale/ja';

dayjs.extend(duration);
dayjs.locale("ja");

import { useIsTimerActive, useTimerSetting } from '@/hooks/timerHooks';
import { useIsChimeEnabled, useIsPreChimeEnabled } from '@/hooks/chimeHooks';

const addTimerLimit = (time: [number, number, number]) => {
  console.log('addTimerLimit', time);
  // TODO: タイマー追加ロジック
};
const startTimer = () => {
  console.log('startTimer');
  // TODO: タイマー開始ロジック
};
const pauseTimer = () => {
  console.log('pauseTimer');
  // TODO: タイマー一時停止ロジック
};
const resetTimer = () => {
  console.log('resetTimer');
  // TODO: タイマーリセットロジック
};

export default function TimerSetting() {
  const [isTimerActiveState, setIsTimerActiveState] = useIsTimerActive();
  const [isChimeEnabledState, setIsChimeEnabledState] = useIsChimeEnabled();
  const [isPreChimeEnabledState, setIsPreChimeEnabledState] = useIsPreChimeEnabled();
  const [timerSettingState, setTimerSettingState] = useTimerSetting();

  const handleTimerInputChange = (index: number, value: string) => {
    const newTimerSetting = [...timerSettingState];
    newTimerSetting[index] = parseInt(value) || 0;
    setTimerSettingState(newTimerSetting as [number, number, number]);
  };

  return (
    <div className="min-w-full flex flex-row flex-wrap justify-center items-center gap-2">
      <div className="2xl:min-w-full flex flex-col gap-1">
        <label className="label cursor-pointer gap-4">
          <span className="label-text">チャイム</span>
          <input
            type="checkbox"
            className="toggle toggle-secondary"
            checked={isChimeEnabledState}
            onChange={() => setIsChimeEnabledState(!isChimeEnabledState)}
          />
        </label>
        <label className="label cursor-pointer">
          <span className="label-text">予鈴</span>
          <input
            type="checkbox"
            className="toggle toggle-secondary"
            checked={isPreChimeEnabledState}
            onChange={() => setIsPreChimeEnabledState(!isPreChimeEnabledState)}
          />
        </label>
      </div>

      <div>
        <h3 className="text-xl font-bold">タイマー設定</h3>

        <div className="flex flex-row items-center">
          <input
            type="number"
            className="grow w-14 outline-none input input-ghost"
            placeholder="時間"
            min="0"
            max="60"
            value={timerSettingState[0]}
            onChange={(e) => handleTimerInputChange(0, e.target.value)}
          />
          <span className="font-bold mx-2">:</span>
          <input
            type="number"
            className="grow w-14 outline-none input input-ghost"
            placeholder="分"
            min="0"
            max="60"
            value={timerSettingState[1]}
            onChange={(e) => handleTimerInputChange(1, e.target.value)}
          />
          <span className="font-bold mx-2">:</span>
          <input
            type="number"
            className="grow w-14 outline-none input input-ghost"
            placeholder="秒"
            min="0"
            max="60"
            value={timerSettingState[2]}
            onChange={(e) => handleTimerInputChange(2, e.target.value)}
          />
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-row gap-2">
            <button className="btn btn-outline btn-secondary max-2xl:btn-sm" onClick={() => addTimerLimit([0, 5, 0])}>+5分</button>
            <button className="btn btn-outline btn-secondary max-2xl:btn-sm" onClick={() => addTimerLimit([0, 1, 0])}>+1分</button>
            <button className="btn btn-outline btn-secondary max-2xl:btn-sm" onClick={() => addTimerLimit([0, 0, 10])}>+10秒</button>
          </div>

          <div className="flex gap-2 justify-center">
            <button
              className="btn btn-primary max-2xl:btn-sm"
              onClick={() => (isTimerActiveState ? pauseTimer() : startTimer())}
            >
              {isTimerActiveState ? "一時停止" : "スタート"}
            </button>
            <button className="btn btn-neutral max-2xl:btn-sm" onClick={resetTimer}>clear</button>
          </div>
        </div>
      </div>
    </div>
  );
}
