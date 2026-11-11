import type { Settings } from '../types.ts';
import { createStore } from './create-store.ts';
import { kSettingsKey, loadSettings } from './migration.ts';

/** 永続化される設定のストア (変更のたびにLocalStorageへ保存) */
export const settingsStore = createStore<Settings>(loadSettings(), (settings) => {
  try {
    localStorage.setItem(kSettingsKey, JSON.stringify(settings));
  } catch (e) {
    console.error('設定の保存に失敗しました', e);
  }
});

export const useSettings = settingsStore.useStore;

/** Reactの外から現在の設定を取得する */
export const getSettings = settingsStore.getState;

/** 設定の一部を更新する */
export const updateSettings = <K extends Exclude<keyof Settings, 'version'>>(section: K, patch: Partial<Settings[K]>) => {
  settingsStore.setState((prev) => ({ ...prev, [section]: { ...prev[section], ...patch } }));
};
