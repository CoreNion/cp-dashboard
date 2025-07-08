'use client';

import { useState, useEffect, useCallback } from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import 'dayjs/locale/ja';

dayjs.extend(duration);
dayjs.locale("ja");

// TODO: これらのカスタムフックとユーティリティ関数は後で実装する
interface CountdownData {
  date: string;
  label: string;
  color: string;
  type?: "yearly";
}

const useTime = () => useState(dayjs().toISOString()); // 仮実装
const useWidthScreenSize = () => useState(typeof window !== 'undefined' ? window.innerWidth : 0); // 仮実装
const useCountdownDates = () => useState<CountdownData[]>([]); // 仮実装
const useYearlyCountdownDates = () => useState<CountdownData[]>([]); // 仮実装
const useIsVerticalBanner = () => useState(false); // 仮実装
const useVerticalBannerSource = () => useState<string | null>(null); // 仮実装

const calcLimit = (eventDate: dayjs.Dayjs, currentDay: dayjs.Dayjs) => eventDate.diff(currentDay);
const calcLimitDays = (eventDate: dayjs.Dayjs, currentDay: dayjs.Dayjs) => eventDate.diff(currentDay, 'day', true);
const needAlert = (eventDate: dayjs.Dayjs, currentDay: dayjs.Dayjs) => eventDate.diff(currentDay, 'day') <= 7;
const calcRatio = (eventDate: dayjs.Dayjs, currentDay: dayjs.Dayjs, lastEventDate: dayjs.Dayjs) => {
  const totalDays = eventDate.diff(lastEventDate, 'day', true);
  const remainingDays = eventDate.diff(currentDay, 'day', true);
  return totalDays > 0 ? ((totalDays - remainingDays) / totalDays) * 100 : 0;
};

export default function Report() {
  const [timeState] = useTime();
  const [wSize] = useWidthScreenSize();

  const [countdownName, setCountdownName] = useState('レポート日数');
  const [countdownLimit, setCountdownLimit] = useState(0);
  const [countdownLimitDays, setCountdownLimitDays] = useState(0);
  const [needCountdownAlert, setNeedCountdownAlert] = useState(false);
  const [countdownRatio, setCountdownRatio] = useState(0);

  const [verticalBannerVisible] = useIsVerticalBanner();
  const [verticalBanner] = useVerticalBannerSource();

  const [onceDates] = useCountdownDates();
  const [yearlyCountdownDates] = useYearlyCountdownDates();

  const refleshReportStatus = useCallback((djs: dayjs.Dayjs = dayjs()) => {
    const yearlyDates = yearlyCountdownDates.map<CountdownData>((d) => {
      return {
        date: `${djs.year()}-${d.date}`,
        label: d.label,
        color: d.color,
        type: "yearly",
      };
    });

    const allDates = [...onceDates, ...yearlyDates].sort((a, b) => {
      return dayjs(a.date).isBefore(dayjs(b.date)) ? -1 : 1;
    });

    let nearEvent: CountdownData | null = null;
    let lastEvent: CountdownData | null = null;
    let minFutureDiffTime = Infinity;
    let maxPastDiffTime = -Infinity;

    for (const d of allDates) {
      const eventDate = dayjs(d.date).hour(23).minute(59).second(59);
      const diffTime = eventDate.diff(djs);

      if (diffTime >= 0) {
        if (diffTime < minFutureDiffTime) {
          minFutureDiffTime = diffTime;
          nearEvent = d;
        }
      } else {
        if (diffTime > maxPastDiffTime) {
          maxPastDiffTime = diffTime;
          lastEvent = d;
        }
      }
    }

    if (nearEvent == null) return;

    const nearEventDate = dayjs(nearEvent.date).hour(23).minute(59).second(59);
    const lastEventDate = dayjs(lastEvent ? lastEvent.date : `${djs.year()}-01-01`).hour(23).minute(59).second(59);

    setCountdownName(nearEvent.label + "まで");
    setCountdownLimit(calcLimit(nearEventDate, djs));
    setCountdownLimitDays(calcLimitDays(nearEventDate, djs));
    setNeedCountdownAlert(needAlert(nearEventDate, djs));
    setCountdownRatio(calcRatio(nearEventDate, djs, lastEventDate));
  }, []); // 依存配列は空で、初回のみ作成

  useEffect(() => {
    refleshReportStatus(dayjs(timeState));
    const intervalId = setInterval(() => {
      refleshReportStatus(dayjs(timeState));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeState, refleshReportStatus]);

  return (
    <>
      {!verticalBannerVisible ? (
        <div className="m-2 min-w-full flex flex-col items-end">
          <div className="flex flex-col items-center">
            <h2 className="text-[2vw] max-2xl:text-4xl mb-3 font-medium">{countdownName}</h2>
            <div
              className={`radial-progress ${wSize >= 1536 ? 'text-[4vw]' : 'text-6xl'} font-bold ${needCountdownAlert ? 'text-red-600' : 'text-primary'}`}
              style={{ '--value': countdownRatio, '--size': wSize >= 1536 ? '15vw' : '220px', '--thickness': wSize >= 1536 ? '2vw' : '30px' } as React.CSSProperties}
            >
              {Math.floor(countdownLimitDays)}日
            </div>
            {needCountdownAlert && dayjs.duration(countdownLimit).asHours() >= 24 && (
              <div className="mt-3 flex flex-col items-center">
                <span className="text-[1.6vw]">残り時間</span>
                <div className="countdown text-[2.5vw] font-bold text-red-600">
                  <span style={{ '--value': Math.floor(dayjs.duration(countdownLimit).asHours()) } as React.CSSProperties}></span>:
                  <span style={{ '--value': dayjs.duration(countdownLimit).minutes() } as React.CSSProperties}></span>:
                  <span style={{ '--value': dayjs.duration(countdownLimit).seconds() } as React.CSSProperties}></span>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="m-2">
          {verticalBanner != null && <img className="max-h-[45vh] border" src={verticalBanner} alt="Vertical Banner" />}
        </div>
      )}
    </>
  );
}
