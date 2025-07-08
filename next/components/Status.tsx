'use client';

import { useState, useEffect } from 'react';
import { UilCelsius, UilPercentage } from '@iconscout/react-unicons'; // react-iconsではなく@iconscout/react-uniconsを使用

// TODO: これらのカスタムフックは後で実装する
const useSensorInfoVisible = () => useState(true); // 仮実装
const useFontSize = () => useState(1); // 仮実装
const useSensorSource = () => useState('serial'); // 仮実装
const useIsSerialReady = () => useState(false); // 仮実装
const useRoomTmp = () => useState<number | null>(null); // 仮実装
const useHumidity = () => useState<number | null>(null); // 仮実装
const usePressure = () => useState<number | null>(null); // 仮実装
const useOutTmp = () => useState<number | null>(null); // 仮実装

const connectSerialDevice = () => {
  console.log('Connecting to serial device...');
  // TODO: シリアル接続ロジックを実装
};

// TODO: GeneralSetting, DynamicModal, Settings は後で移行する
const GeneralSetting = () => <div className="w-full h-full bg-gray-200">GeneralSetting</div>;
const DynamicModal = ({ children, btnTitle }: { children: React.ReactNode, btnTitle: string }) => (
  <button className="btn btn-neutral">{btnTitle}</button>
);
const Settings = () => <div className="w-full h-full bg-gray-200">Settings</div>;


export default function Status() {
  const [sensorVisible, setSensorVisible] = useSensorInfoVisible();
  const [fontSizeOffset] = useFontSize();
  const [valueNameSize, setValueNameSize] = useState(`${6 * fontSizeOffset}vh`);
  const [valueSize, setValueSize] = useState(`${8.5 * fontSizeOffset}vh`);

  const [sensorSourceState] = useSensorSource();
  const [isSerialReadyState, setIsSerialReadyState] = useIsSerialReady(); // isSerialReadyStateのsetterも追加

  const [roomTmpState] = useRoomTmp();
  const [humidityState] = useHumidity();
  const [pressureState] = usePressure();
  const [outTmpState] = useOutTmp();

  useEffect(() => {
    setValueNameSize(`${7 * fontSizeOffset}vh`);
    setValueSize(`${9.5 * fontSizeOffset}vh`);
  }, [fontSizeOffset]);

  return (
    <div className="min-w-full stats stats-vertical shadow">
      {/* 室温 */}
      {sensorVisible && (
        <div className="stat px-0">
          <div className="stat-title" style={{ fontSize: valueNameSize }}>室温</div>
          {sensorSourceState === 'serial' && !isSerialReadyState ? (
            <div>
              <span className="font-bold text-xl">接続設定が必要です</span>
              <br />
              <button className="btn btn-primary btn-sm mt-1" onClick={connectSerialDevice}>接続する</button>
              <button className="btn btn-error btn-sm mt-1 ml-1" onClick={() => setSensorVisible(false)}>非表示にする</button>
            </div>
          ) : (
            <div className="stat-value font-semibold" style={{ fontSize: valueSize }}>
              {roomTmpState != null ? roomTmpState.toFixed(1) : "-"}
              <UilCelsius size={valueNameSize} />
            </div>
          )}
        </div>
      )}

      {/* 室内湿度 */}
      {sensorVisible && (
        <div className="stat py-1">
          <div className="stat-title" style={{ fontSize: valueNameSize }}>室内湿度</div>
          {sensorSourceState === 'serial' && !isSerialReadyState ? (
            <div>
              <span className="font-bold text-xl">接続設定が必要</span>
            </div>
          ) : (
            <div className="stat-value font-semibold" style={{ fontSize: valueSize }}>
              {humidityState != null ? humidityState.toFixed(1) : "-"}
              <UilPercentage size={valueNameSize} />
            </div>
          )}
        </div>
      )}

      {/* 気圧 */}
      <div className="stat px-0 py-1">
        <div className="stat-title" style={{ fontSize: valueNameSize }}>
          気圧{sensorSourceState === 'serial' && !isSerialReadyState ? '*' : ''}
        </div>
        <div className="stat-value font-semibold leading-none flex flex-col">
          <span style={{ fontSize: valueSize }}>{pressureState != null ? pressureState.toFixed() : "-"}</span>
          <span style={{ fontSize: valueNameSize }}>hPa</span>
        </div>
      </div>

      {/* 外気温 */}
      <div className="stat py-1">
        <div className="stat-title" style={{ fontSize: valueNameSize }}>外気温*</div>
        <div className="stat-value font-semibold flex flex-row items-center justify-center">
          <span style={{ fontSize: valueSize }}>{outTmpState != null ? outTmpState : "-"}</span>
          <UilCelsius size={valueSize} />
        </div>
      </div>

      {!sensorVisible && (
        <div className="stat px-5">
          <div className="max-2xl:hidden">
            <GeneralSetting></GeneralSetting>
          </div>
        </div>
      )}

      <div className="stat m-auto gap-2">
        <span>*出典: 気象庁ホームページ</span>

        <DynamicModal btnTitle="設定">
          <Settings />
        </DynamicModal>
      </div>
    </div>
  );
}
