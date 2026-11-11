import { useSyncExternalStore } from 'react';

/**
 * Reactの外からも読み書きできる小さなストアを作成する
 * @param initial 初期状態
 * @param onChange 状態が変更されたときの処理 (永続化など)
 */
export const createStore = <T>(initial: T, onChange?: (state: T) => void) => {
  let state = initial;
  const listeners = new Set<() => void>();

  const getState = () => state;

  const setState = (updater: (prev: T) => T) => {
    const next = updater(state);
    if (Object.is(next, state)) return;

    state = next;
    onChange?.(state);
    listeners.forEach((listener) => listener());
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  /** 状態の一部を購読する (selectorは同じ状態に対して同じ参照を返すこと) */
  const useStore = <S>(selector: (state: T) => S) => useSyncExternalStore(subscribe, () => selector(state));

  return { getState, setState, subscribe, useStore };
};
