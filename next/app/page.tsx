'use client';

import { useState, useEffect } from 'react';
import { useWindowSize } from '../hooks/useWindowSize';

export default function Home() {
  const { width } = useWindowSize();
  const [firstClick, setFirstClick] = useState(false);

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

        setFirstClick(true);
      }
    };

    document.body.addEventListener('click', handleClick);

    return () => {
      document.body.removeEventListener('click', handleClick);
    };
  }, [firstClick]);

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
            {/* Status Component */}
            <div className="w-full h-full bg-gray-200">Status</div>
          </div>

          <div className="grow m-auto">
            {/* Clock Component */}
            <div className="w-full h-full bg-gray-300">Clock</div>
          </div>

          <div className="basis-[15.0%] flex flex-col items-end m-3 gap-4">
            {/* Report Component */}
            <div className="w-full h-48 bg-gray-200">Report</div>
            <div className="grow m-2 flex flex-col justify-end gap-2">
              <button className="btn btn-neutral" onClick={() => window.location.reload()}>再読み込み</button>
              {/* TimerSetting Component */}
              <div className="w-full h-12 bg-gray-200">TimerSetting</div>
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
              {/* Settings Component */}
              <div className="w-12 h-12 bg-gray-200">Settings</div>
            </div>
          </div>
          <div className="grow m-auto">
            {/* Clock Component */}
            <div className="w-full h-full bg-gray-300">Clock</div>
          </div>
          {/* TimerSetting Component */}
          <div className="w-full h-12 bg-gray-200">TimerSetting</div>
          <div className="flex flex-row justify-center gap-5 my-3">
            <span>Copyright © 2024 CoreNion</span>
            <a href="https://github.com/CoreNion/cp-dashboard/" className="link">Source Code / Licence</a>
          </div>
        </div>
      )}
    </>
  );
}