import dayjs from 'dayjs';
import timezonePlugin from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { kAutoTimezone } from '../constants.ts';

dayjs.extend(utc);
dayjs.extend(timezonePlugin);

/**
 * 設定されたタイムゾーンでの日時を取得する
 * @param value 日時 (文字列の場合は、そのタイムゾーンでの日時として解釈する)
 * @param timezone タイムゾーン (IANA名。kAutoTimezoneの場合は端末の設定)
 */
export const zoned = (value: dayjs.ConfigType, timezone: string) => {
  if (timezone === kAutoTimezone) return dayjs(value);

  try {
    return dayjs.tz(value, timezone);
  } catch {
    // 端末が対応していないタイムゾーンの場合は端末の設定を使用
    return dayjs(value);
  }
};

/** 端末に設定されているタイムゾーン */
export const deviceTimezone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

/** 選択できるタイムゾーンの一覧 */
export const listTimezones = () => ['UTC', ...Intl.supportedValuesOf('timeZone').filter((tz) => tz !== 'UTC')];
