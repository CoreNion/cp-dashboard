import { kDefaultFontFamily, kWideScreenWidth } from '../constants.ts';
import type { Runtime } from '../types.ts';
import { createStore } from './create-store.ts';

/** 保存されないアプリの状態のストア */
export const runtimeStore = createStore<Runtime>({
  ready: false,
  firstClicked: false,
  width: typeof window === 'undefined' ? kWideScreenWidth : window.innerWidth,
  time: new Date(),
  timer: {
    active: false,
    remaining: null,
    setting: [0, 0, 0],
  },
  weather: {
    icon: null,
    outTmp: null,
    pressure: null,
  },
  fontFamily: kDefaultFontFamily,
  bannerUrl: null,
  verticalBannerUrl: null,
});

export const useRuntime = runtimeStore.useStore;

/** Reactの外から現在の状態を取得する */
export const getRuntime = runtimeStore.getState;

/** 状態の一部を更新する */
export const updateRuntime = (patch: Partial<Runtime>) => {
  runtimeStore.setState((prev) => ({ ...prev, ...patch }));
};

/** タイマーの状態の一部を更新する */
export const updateTimer = (patch: Partial<Runtime['timer']>) => {
  runtimeStore.setState((prev) => ({ ...prev, timer: { ...prev.timer, ...patch } }));
};
