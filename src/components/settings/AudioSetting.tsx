import type { ChangeEvent } from 'react';
import { kDefaultAudioName } from '../../constants.ts';
import { playAudio, resetAudio, setCustomAudio } from '../../services/audio.ts';
import { useSettings } from '../../store/settings.ts';
import type { AudioKind } from '../../types.ts';
import { Icon } from '../Icon.tsx';

type AudioSettingProps = {
  labelText: string;
  kind: AudioKind;
};

/** 音源1種類分の設定 (変更/削除/試聴) */
export const AudioSetting = ({ labelText, kind }: AudioSettingProps) => {
  const fileName = useSettings((s) => s.audio[kind]);

  // 音源変更時の処理
  const onAudioChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await setCustomAudio(kind, file);
  };

  return (
    <div className="setting-row flex-wrap">
      <span className="whitespace-nowrap font-bold">{labelText}</span>
      <div className="flex flex-col items-end gap-1 w-full">
        <input type="file" className="file-input w-full max-w-xs" accept="audio/*" onChange={onAudioChange} aria-label={`${labelText}の音声ファイル`} />
        <div className="flex flex-row items-center gap-2">
          {fileName !== kDefaultAudioName && (
            <button className="btn btn-sm btn-circle btn-outline btn-error" onClick={() => resetAudio(kind)} aria-label="デフォルトの音声に戻す">
              <Icon name="uil:trash-alt" />
            </button>
          )}
          <button className="grow link" onClick={() => playAudio(kind)}>
            {fileName}
          </button>
        </div>
      </div>
    </div>
  );
};
