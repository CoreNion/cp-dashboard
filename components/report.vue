<script setup lang="ts">
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import 'dayjs/locale/ja';

dayjs.extend(duration);
dayjs.locale("ja");

const djs = dayjs();

// 今月15日
const thisMonthLimit = djs.date(15).hour(0).minute(59).second(59)

// 毎月15日のレポート提出期限
const reportMonthDeadline = dayjs()
  .month(
    // 今月15日を過ぎていたら、次の月の15日にする
    djs.isAfter(thisMonthLimit)
      ? djs.month() + 1 :
      djs.month())
  .date(15)
  .hour(23).minute(59).second(59);

// 毎月15日のレポート提出期限までの残り時間を計算
const reportMonthLimit = reportMonthDeadline.diff(djs, 'millisecond');
const reportMonthLimitDays = dayjs.duration({ milliseconds: reportMonthLimit }).asDays() - 1;
// 赤くするかどうか
const needReportMonthAlert = reportMonthLimitDays > 5;

/* レポート期限の割合を計算 */
// レポート期限の開始日からレポート期限までの時間
const reportTime = reportMonthDeadline.diff(reportMonthDeadline.month(reportMonthDeadline.month() - 1), 'millisecond');
// 消費した日数 / レポート期限までの日数 * 100
const reportRatio = ((reportTime - reportMonthLimit) / reportTime) * 100;
</script>

<template>
  <div class="m-2">
    <h2 class="text-3xl mb-3">レポート日数</h2>
    <ClientOnly>
      <div :class="['radial-progress', 'text-6xl', 'font-bold', needReportMonthAlert ? 'text-info' : 'text-red-600']"
        :style="{ '--value': reportRatio, '--size': '12vw', '--thickness': '1.5vw' }">
        <!-- parseIntはマイナス0対策 -->
        {{ parseInt(reportMonthLimitDays.toFixed()) }}日
      </div>
    </ClientOnly>
  </div>
</template>