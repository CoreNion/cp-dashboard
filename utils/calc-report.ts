import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import 'dayjs/locale/ja';

dayjs.extend(duration);
dayjs.locale("ja");

/**
 * 次のレポート期限を取得する (4月/5月は6月15日)
 * @param date 日付
 * @returns 次のレポート期限
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
 * レポート期限までの残り時間(ms)を計算する
 * @param nextReportDeadline 次のレポート期限 
 * @param date 日付
 * @returns レポート期限までの残り時間 (ms)
 */
export function calcReportLimit(nextReportDeadline: dayjs.Dayjs, date: dayjs.Dayjs = dayjs()) {
  return nextReportDeadline.diff(dayjs(date), 'millisecond');
}
/**
 * レポート期限までの残り日数を計算する
 * @param nextReportDeadline 次のレポート期限 
 * @param date 日付
 * @returns レポート期限までの残り日数
 */
export function calcReportLimitDays(nextReportDeadline: dayjs.Dayjs, date: dayjs.Dayjs = dayjs()) {
  return dayjs.duration({ milliseconds: calcReportLimit(nextReportDeadline, date) }).asDays();
}

/**
 * レポートのアラートを表示するかどうか
 * @param nextReportDeadline 次のレポート期限
 * @param date 日付
 */
export function needReportAlert(nextReportDeadline: dayjs.Dayjs, date: dayjs.Dayjs = dayjs()) {
  return calcReportLimitDays(nextReportDeadline, date) <= 4;
}

/**
 * レポートの残り時間の経過割合を計算する
 * @param nextReportDeadline 次のレポート期限
 * @param date 日付
 * @returns 
 */
export function calcReportRatio(nextReportDeadline: dayjs.Dayjs, date: dayjs.Dayjs = dayjs()) {
  // レポートの期間の全時間を計算する
  const reportMonthStart = dayjs(nextReportDeadline).subtract(1, 'month');
  const allReportTime = nextReportDeadline.diff(reportMonthStart, 'millisecond');

  return ((allReportTime - calcReportLimit(nextReportDeadline, date)) / allReportTime) * 100;
}