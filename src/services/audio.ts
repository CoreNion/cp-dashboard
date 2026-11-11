import { kAudioFiles, kDefaultAudioName } from '../constants.ts';
import { getSettings, updateSettings } from '../store/settings.ts';
import type { AudioKind } from '../types.ts';
import { createFileURL, removeFile, saveFile } from '../utils/file-manager.ts';

/** デフォルト音源のAudioを作成 */
const createDefaultAudio = (kind: AudioKind) => new Audio(`${import.meta.env.BASE_URL}${kAudioFiles[kind]}`);

/** 現在の音源 (iOS対策で、HTMLAudioElementを使い回す) */
const audios: Record<AudioKind, HTMLAudioElement> = {
  alert: createDefaultAudio('alert'),
  chime: createDefaultAudio('chime'),
  preChime: createDefaultAudio('preChime'),
};

/** 音源を再生 */
export const playAudio = async (kind: AudioKind) => {
  const audio = audios[kind];
  audio.volume = 1.0;
  try {
    await audio.play();
  } catch (e) {
    console.warn(e);
  }
};

/** 音源を停止し、先頭に戻す */
export const stopAudio = (kind: AudioKind) => {
  const audio = audios[kind];
  audio.pause();
  audio.currentTime = 0;
};

/**
 * 設定に応じた音源を読み込む。
 * iOS / Safariでは、画面クリック後に読み込む必要がある。
 */
export const loadAudio = async (kind: AudioKind) => {
  if (getSettings().audio[kind] !== kDefaultAudioName) {
    const url = await createFileURL(kAudioFiles[kind]);
    if (url != null) {
      audios[kind] = new Audio(url);
    } else {
      // カスタム音源の実体が見つからない場合は、デフォルトに戻す
      updateSettings('audio', { [kind]: kDefaultAudioName });
    }
  }

  audios[kind].load();
};

/** 全ての音源を読み込む */
export const loadAllAudio = async () => {
  await Promise.all((Object.keys(kAudioFiles) as AudioKind[]).map(loadAudio));
};

/** 音源をユーザーのファイルに変更する */
export const setCustomAudio = async (kind: AudioKind, file: File) => {
  // OPFSにファイルを保存
  await saveFile(file, kAudioFiles[kind]);

  // メモリ上の音源を更新
  audios[kind].pause();
  audios[kind] = new Audio(URL.createObjectURL(file));
  audios[kind].load();

  // ファイル名を更新
  updateSettings('audio', { [kind]: file.name });
};

/** 音源をデフォルトに戻す */
export const resetAudio = async (kind: AudioKind) => {
  // OPFSからファイルを削除
  try {
    await removeFile(kAudioFiles[kind]);
  } catch (e) {
    console.warn(e);
  }

  // 音源/名前を元に戻す
  audios[kind].pause();
  audios[kind] = createDefaultAudio(kind);
  audios[kind].load();
  updateSettings('audio', { [kind]: kDefaultAudioName });
};
