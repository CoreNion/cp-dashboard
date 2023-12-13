<script setup lang="ts">
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import 'dayjs/locale/ja';

dayjs.extend(duration);
dayjs.locale("ja");

const date = useState(() => dayjs().toDate());

// 今月15日
const thisMonthLimit = useState(() => dayjs(date.value).date(15).hour(23).minute(59).second(59).toDate());

// 毎月15日のレポート提出期限
const reportMonthDeadline = useState(() => dayjs()
  .month(
    // 今月15日を過ぎていたら、次の月の15日にする
    dayjs(date.value).isAfter(dayjs(thisMonthLimit.value))
      ? dayjs(date.value).month() + 1 :
      dayjs(date.value).month())
  .date(15)
  .hour(23).minute(59).second(59).toDate());

// 毎月15日のレポート提出期限までの残り時間を計算
const reportMonthLimit = useState(() => dayjs(reportMonthDeadline.value).diff(dayjs(date.value), 'millisecond'));
const reportMonthLimitDays = useState('reportMonthLimitDays', () => dayjs.duration({ milliseconds: reportMonthLimit.value }).asDays() - 1);
// 赤くするかどうか
const needReportMonthAlert = useState('needReportMonthAlert', () => reportMonthLimitDays.value > 5);

/* レポート期限の割合を計算 */
// レポート期限の開始日からレポート期限までの時間
const reportTime = useState(() => {
  const rMDL = dayjs(reportMonthDeadline.value);
 return rMDL.diff(rMDL.month(rMDL.month() - 1), 'millisecond');
});

// 消費した日数 / レポート期限までの日数 * 100
const reportRatio = useState('reportRatio', () => ((reportTime.value - reportMonthLimit.value) / reportTime.value) * 100);

// 10分ごとにレポート期限の割合を更新
onMounted(() => {
  setInterval(() => {
    date.value = dayjs().toDate();
  }, 600000);
});
</script>

<template>
  <div class="m-2">
    <h2 class="text-[2vw] mb-3">レポート日数</h2>
    <ClientOnly>
      <div :class="['radial-progress', 'text-[3vw]', 'font-bold', needReportMonthAlert ? 'text-primary' : 'text-red-600']"
        :style="{ '--value': reportRatio, '--size': '12vw', '--thickness': '1.5vw' }">
        <!-- parseIntはマイナス0対策 -->
        {{ parseInt(reportMonthLimitDays.toFixed()) }}日
      </div>
    </ClientOnly>
  </div>
</template>