'use client';

import { useState, useEffect } from 'react';
import { useWindowSize } from '../hooks/useWindowSize';
import Report from '@/components/Report';
import Status from '@/components/Status';
import TimerSetting from '@/components/TimerSetting';
import Settings, { DynamicModal } from '@/components/modals/Settings';
import { useChimeFileName, useChimeSource, usePreChimeFileName, usePreChimeSource } from '@/hooks/chimeHooks';
import { useTimerAlertSource } from '@/hooks/timerHooks';
import { useAlertFileName } from '@/hooks/alertHooks';
import { useBannerSource, useIsBannerVisible, useIsVerticalBanner, useVerticalBannerSource } from '@/hooks/bannerHooks';

export default function Home() {
  const { width } = useWindowSize();
  const [firstClick, setFirstClick] = useState(false);

  // 音源関連のフックをインポート
  const [chimeSourceState, setChimeSourceState] = useChimeSource();
  const [chimeFileNameState] = useChimeFileName();
  const [preChimeSourceState, setPreChimeSourceState] = usePreChimeSource();
  const [preChimeFileNameState] = usePreChimeFileName();
  const [timerAlertSourceState, setTimerAlertSourceState] = useTimerAlertSource();
  const [alertFileNameState] = useAlertFileName();

  // バナー関連のフックをインポート
  const [isBannerVisibleState] = useIsBannerVisible();
  const [bannerSourceState, setBannerSourceState] = useBannerSource();
  const [isVerticalBannerState] = useIsVerticalBanner();
  const [verticalBannerSourceState, setVerticalBannerSourceState] = useVerticalBannerSource();

  useEffect(() => {
    const handleClick = async () => {
      if (!firstClick) {
        try {
          const wakeLock = await navigator.wakeLock.request('screen');
          document.addEventListener('visibilitychange', async () => {
            if (document.visibilityState === 'visible') {
              await navigator.wakeLock.request('screen');
            }
          });
        } catch (e) {
          console.warn(e);
        }

        new Audio("/beep.mp3").play().catch(e => console.warn(e));

        // チャイム音源を読み込む
        if (chimeFileNameState !== 'デフォルトの音声') {
          // TODO: ファイル読み込みロジックを実装
          // 現状はpublicディレクトリからのパスを直接指定
          setChimeSourceState(new Audio('/chime.mp3'));
        } else {
          setChimeSourceState(new Audio('/chime.mp3'));
        }

        // 予鈴音源を読み込む
        if (preChimeFileNameState !== 'デフォルトの音声') {
          // TODO: ファイル読み込みロジックを実装
          setPreChimeSourceState(new Audio('/pre-chime.mp3'));
        } else {
          setPreChimeSourceState(new Audio('/pre-chime.mp3'));
        }

        // アラート音源を読み込む
        if (alertFileNameState !== 'デフォルトの音声') {
          // TODO: ファイル読み込みロジックを実装
          setTimerAlertSourceState(new Audio('/alert.mp3'));
        } else {
          setTimerAlertSourceState(new Audio('/alert.mp3'));
        }

        setFirstClick(true);
      }
    };

    document.body.addEventListener('click', handleClick);

    return () => {
      document.body.removeEventListener('click', handleClick);
    };
  }, [firstClick, chimeFileNameState, preChimeFileNameState, alertFileNameState, setChimeSourceState, setPreChimeSourceState, setTimerAlertSourceState]);

  useEffect(() => {
    // バナー画像を読み込む
    if (isBannerVisibleState) {
      // TODO: ファイル読み込みロジックを実装
      setBannerSourceState('/ogp.png'); // 仮の画像パス
    }

    // 縦バナー画像を読み込む
    if (isVerticalBannerState) {
      // TODO: ファイル読み込みロジックを実装
      setVerticalBannerSourceState('/pwa/sc_mobile.png'); // 仮の画像パス
    }
  }, [isBannerVisibleState, isVerticalBannerState, setBannerSourceState, setVerticalBannerSourceState]);

  return (
    <>
      {!firstClick && (
        <div className="toast toast-top toast-center whitespace-normal z-50 w-full">
          <div className="alert alert-warning">
            <p>
              <span>チャイムやタイマーを正常に動作させるため、1回は画面をクリックしてください。</span>
              <br />
              <span>画面をクリックした後、バックグラウンドで正常に動作させるために、短い効果音が1回再生されます。</span>
            </p>
          </div>
        </div>
      )}

      {width >= 1280 ? (
        <div className="min-h-[100dvh] flex flex-row text-center gap-2">
          <div className="basis-[20.0%] flex flex-row justify-between">
            <Status></Status>
          </div>

          <div className="grow m-auto">
            {/* Clock Component */}
            <div className="w-full h-full bg-gray-300">Clock</div>
          </div>

          <div className="basis-[15.0%] flex flex-col items-end m-3 gap-4">
            <Report></Report>
            <div className="grow m-2 flex flex-col justify-end gap-2">
              <button className="btn btn-neutral" onClick={() => window.location.reload()}>再読み込み</button>
              <TimerSetting></TimerSetting>
              <span>Copyright © 2024 CoreNion</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-[100dvh] min-w-full flex flex-col text-center mb-2">
          <div className="navbar bg-neutral">
            <div className="navbar-start">
              <button className="btn" onClick={() => window.location.reload()}>
                {/* Redo Icon */}
              </button>
            </div>
            <div className="navbar-center">
              <a className="btn btn-ghost text-xl text-neutral-content">Campus Dashboard</a>
            </div>
            <div className="navbar-end">
              <DynamicModal IconName="uil:setting">
                <Settings></Settings>
              </DynamicModal>
            </div>
          </div>
          <div className="grow m-auto">
            {/* Clock Component */}
            <div className="w-full h-full bg-gray-300">Clock</div>
          </div>
          <TimerSetting></TimerSetting>
          <div className="flex flex-row justify-center gap-5 my-3">
            <span>Copyright © 2024 CoreNion</span>
            <a href="https://github.com/CoreNion/cp-dashboard/" className="link">Source Code / Licence</a>
          </div>
        </div>
      )}
    </>
  );
}