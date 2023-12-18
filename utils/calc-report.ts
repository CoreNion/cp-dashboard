import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import 'dayjs/locale/ja';

dayjs.extend(duration);
dayjs.locale("ja");

/**
 * 次のイベント日を取得する (4月/5月は6月15日)
 * @param date 日付
 * @returns 次のイベント日
 */
export function calcNextReportDeadline(date: dayjs.Dayjs = dayjs()) {
  const djs = dayjs(date).date(15).hour(23).minute(59).second(59);

  // 4月/5月は6月15日
  if (djs.month() === 3 || djs.month() === 4) {
    return dayjs(date).month(5);
  } else if (dayjs(date).isAfter(dayjs(djs))) {
    // 今月15日を過ぎていたら、次の月の15日にする
    return djs.month(dayjs(date).month() + 1)
  } else {
    return djs;
  }
}

/**
 * イベントいまでの残り時間(ms)を計算する
 * @param eventDay イベントの日付
 * @param date 日付
 * @returns 残り時間 (ms)
 */
export function calcLimit(eventDay: dayjs.Dayjs, date: dayjs.Dayjs = dayjs()) {
  return eventDay.diff(dayjs(date), 'millisecond');
}
/**
 * イベント日までの残り日数を計算する
 * @param eventDay イベントの日付
 * @param date 日付
 * @returns イベント日までの残り日数
 */
export function calcLimitDays(eventDay: dayjs.Dayjs, date: dayjs.Dayjs = dayjs()) {
  return dayjs.duration({ milliseconds: calcLimit(eventDay, date) }).asDays();
}

/**
 * イベント日接近のアラートを表示するかどうか
 * @param eventDay 次のイベント日
 * @param date 日付
 */
export function needAlert(eventDay: dayjs.Dayjs, date: dayjs.Dayjs = dayjs()) {
  return calcLimitDays(eventDay, date) <= 4;
}

/**
 * イベント日の残り時間の経過割合を計算する
 * @param eventDay 次のイベント日
 * @param date 日付
 * @returns 
 */
export function calcRatio(eventDay: dayjs.Dayjs, date: dayjs.Dayjs = dayjs()) {
  // レポートの期間の全時間を計算する
  const reportMonthStart = dayjs(eventDay).subtract(1, 'month');
  const allReportTime = eventDay.diff(reportMonthStart, 'millisecond');

  return ((allReportTime - calcLimit(eventDay, date)) / allReportTime) * 100;
}