'use client';

import { useState, useCallback } from 'react';

// TODO: これらのカスタムフックとユーティリティ関数は後で実装する
const useChimeSource = () => useState<HTMLAudioElement | null>(null);
const useChimeFileName = () => useState('デフォルトの音声');
const usePreChimeSource = () => useState<HTMLAudioElement | null>(null);
const usePreChimeFileName = () => useState('デフォルトの音声');
const useTimerAlertSource = () => useState<HTMLAudioElement | null>(null);
const useAlertFileName = () => useState('デフォルトの音声');
const useIsChimeEnabled = () => useState(true);
const useIsPreChimeEnabled = () => useState(true);

// 仮のファイル操作関数
const saveFile = (file: File, fileName: string) => {
  console.log(`Saving file: ${fileName}`);
  // 実際にはIndexedDBやサーバーに保存するロジック
};
const removeFile = (fileName: string) => {
  console.log(`Removing file: ${fileName}`);
  // 実際にはIndexedDBやサーバーから削除するロジック
};

// TODO: サブコンポーネントは後で移行する
const GeneralSetting = () => <div className="w-full h-full bg-gray-200">GeneralSetting</div>;
const WeatherSetting = () => <div className="w-full h-full bg-gray-200">WeatherSetting</div>;
const SensorRecord = () => <div className="w-full h-full bg-gray-200">SensorRecord</div>;
const ChimeSetting = () => <div className="w-full h-full bg-gray-200">ChimeSetting</div>;
const AdSetting = () => <div className="w-full h-full bg-gray-200">AdSetting</div>;
const CountdownSetting = () => <div className="w-full h-full bg-gray-200">CountdownSetting</div>;

// DynamicModal コンポーネントの仮実装
export const DynamicModal = ({ children, btnTitle, btnWfull, linkTypeButton }: {
  children: React.ReactNode;
  btnTitle: string;
  btnWfull?: boolean;
  linkTypeButton?: boolean;
}) => {
  const buttonClass = `btn ${btnWfull ? 'w-full' : ''} ${linkTypeButton ? 'btn-link' : 'btn-neutral'}`;
  return (
    <button className={buttonClass} onClick={() => console.log(`${btnTitle} clicked`)}>
      {btnTitle}
    </button>
  );
};

interface AudioSettingProps {
  labelText: string;
  fileName: string;
  source: HTMLAudioElement | null;
  onAudioChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeAudio: () => void;
  playAudio: (audio: HTMLAudioElement) => void;
}

const AudioSetting: React.FC<AudioSettingProps> = ({ labelText, fileName, source, onAudioChange, removeAudio, playAudio }) => (
  <div className="py-3">
    <label className="label">
      <span className="label-text">{labelText}</span>
    </label>
    <div className="flex flex-row items-center gap-2">
      <input type="file" accept="audio/*" className="file-input file-input-bordered w-full max-w-xs" onChange={onAudioChange} />
      <button className="btn btn-sm btn-outline" onClick={() => source && playAudio(source)} disabled={!source}>再生</button>
      <button className="btn btn-sm btn-outline btn-error" onClick={removeAudio}>削除</button>
    </div>
    <p className="text-sm text-gray-500 mt-1">現在のファイル: {fileName}</p>
  </div>
);

export default function Settings() {
  const [chimeSourceState, setChimeSourceState] = useChimeSource();
  const [chimeFileNameState, setChimeFileNameState] = useChimeFileName();
  const [preChimeSourceState, setPreChimeSourceState] = usePreChimeSource();
  const [preChimeFileNameState, setPreChimeFileNameState] = usePreChimeFileName();
  const [timerAlertSourceState, setTimerAlertSourceState] = useTimerAlertSource();
  const [alertFileNameState, setAlertFileNameState] = useAlertFileName();
  const [isChimeEnabledState, setIsChimeEnabledState] = useIsChimeEnabled();
  const [isPreChimeEnabledState, setIsPreChimeEnabledState] = useIsPreChimeEnabled();

  const onAudioChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>, fileName: string, sourceSetter: React.Dispatch<React.SetStateAction<HTMLAudioElement | null>>, fileNameSetter: React.Dispatch<React.SetStateAction<string>>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    saveFile(file, fileName);
    const audio = new Audio(URL.createObjectURL(file));
    audio.load();
    sourceSetter(audio);
    fileNameSetter(file.name);
  }, []);

  const removeAudio = useCallback((sourceSetter: React.Dispatch<React.SetStateAction<HTMLAudioElement | null>>, fileNameSetter: React.Dispatch<React.SetStateAction<string>>, origFileName: string) => {
    removeFile(fileNameSetter[0]); // fileNameSetterはuseStateのsetterなので、[0]で現在の値を取得
    fileNameSetter('デフォルトの音声');
    const audio = new Audio(`/${origFileName}`); // publicディレクトリからのパス
    audio.load();
    sourceSetter(audio);
  }, []);

  const playAudio = useCallback((audio: HTMLAudioElement) => {
    audio.volume = 1.0;
    audio.play().catch(e => console.warn("Audio play failed:", e));
  }, []);

  const onAlertAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => onAudioChange(e, 'alert.mp3', setTimerAlertSourceState, setAlertFileNameState);
  const removeAlertAudio = () => removeAudio(setTimerAlertSourceState, setAlertFileNameState, "alert.mp3");

  const onChimeAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => onAudioChange(e, 'chime.mp3', setChimeSourceState, setChimeFileNameState);
  const removeChimeAudio = () => removeAudio(setChimeSourceState, setChimeFileNameState, "chime.mp3");

  const onPreChimeAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => onAudioChange(e, 'pre-chime.mp3', setPreChimeSourceState, setPreChimeFileNameState);
  const removePreChimeAudio = () => removeAudio(setPreChimeSourceState, setPreChimeFileNameState, "pre-chime.mp3");

  return (
    <div>
      <h3 className="font-bold text-lg">設定</h3>
      <p className="pt-2">
        <GeneralSetting />
        <DynamicModal btnTitle="天気設定" btnWfull={true}>
          <WeatherSetting />
        </DynamicModal>

        <div className="mt-3">
          <DynamicModal linkTypeButton btnTitle="センサーの記録">
            <SensorRecord />
          </DynamicModal>
        </div>
      </p>

      <div className="divider"></div>

      <h4 className="font-bold">音声設定</h4>
      <p className="py-3">
        <AudioSetting
          labelText="タイマー終了時"
          fileName={alertFileNameState}
          source={timerAlertSourceState}
          onAudioChange={onAlertAudioChange}
          removeAudio={removeAlertAudio}
          playAudio={playAudio}
        />

        <AudioSetting
          labelText="チャイム"
          fileName={chimeFileNameState}
          source={chimeSourceState}
          onAudioChange={onChimeAudioChange}
          removeAudio={removeChimeAudio}
          playAudio={playAudio}
        />

        <AudioSetting
          labelText="予鈴チャイム"
          fileName={preChimeFileNameState}
          source={preChimeSourceState}
          onAudioChange={onPreChimeAudioChange}
          removeAudio={removePreChimeAudio}
          playAudio={playAudio}
        />

        <label className="label cursor-pointer mt-4">
          <span className="label-text">チャイム鳴動状態</span>
          <input type="checkbox" className="toggle toggle-secondary" checked={isChimeEnabledState} onChange={() => setIsChimeEnabledState(!isChimeEnabledState)} />
        </label>
        <label className="label cursor-pointer mt-4">
          <span className="label-text">予鈴鳴動状態</span>
          <input type="checkbox" className="toggle toggle-secondary" checked={isPreChimeEnabledState} onChange={() => setIsPreChimeEnabledState(!isPreChimeEnabledState)} />
        </label>
      </p>
      <DynamicModal btnTitle="チャイム設定" btnWfull={true}>
        <ChimeSetting />
      </DynamicModal>

      <div className="divider"></div>

      <h4 className="font-bold">宣伝機能設定 (大画面のみ)</h4>
      <AdSetting />
      <DynamicModal btnWfull={true} btnTitle="カウントダウン設定">
        <CountdownSetting />
      </DynamicModal>

      <div className="divider"></div>

      <span className="font-light">First Built by CoreNion (N6)</span>
      <br />
      <span className="font-light">Special Thanks to Shibuya CP🫶</span>
      <div className="flex flex-row justify-around mt-3">
        <a href="https://github.com/CoreNion/cp-dashboard/wiki/" className="link">ドキュメント</a>
        <a href="https://github.com/CoreNion/cp-dashboard/" className="link">Source Code</a>
      </div>
    </div>
  );
}
