<script setup lang="ts">
import { useIntervalFn } from '@vueuse/core' 

// 現在時刻
const timeState = useState('time', () => new Date(new Date().getTime()));
// 現在の室温
const roomTmpState = useState('roomTemp', () => 0);
// 現在の気圧
const pressureState = useState('pressure', () => 1013);
// 現在の外気温 (WIP)
const outTmpState = useState('outTemp', () => 25);
// 天気
const weatherState = useState('weather', () => '☀️');

// 1秒ごとに現在時刻/温度を更新
useIntervalFn(async () => {
  timeState.value = new Date(new Date().getTime());

  const { data } = await useFetch('/api/tmp');
  roomTmpState.value = data.value?.tmp ?? 0;
}, 1000);

// 毎月15日のレポート提出期限
const reportMonthDeadline = new Date(timeState.value.getFullYear(), timeState.value.getMonth(), 15);
// 毎月15日のレポート提出期限までの残り時間を計算
const reportMonthDeadlineTime = new Date(reportMonthDeadline.getTime() - timeState.value.getTime());

/* レポート期限の割合を計算 */
// レポート期限の開始日
const reportStartMonth = new Date(reportMonthDeadline.getFullYear(), (reportMonthDeadline.getMonth() - 1), 15);
// レポート期限の開始日からレポート期限までの日数
const reportDays = new Date(reportMonthDeadline.getTime() - reportStartMonth.getTime())
// 消費した日数 / レポート期限までの日数 * 100
const reportRatio = ((reportDays.getTime() - reportMonthDeadlineTime.getTime()) / reportDays.getTime()) * 100;
</script>

<template>
  <NuxtLayout>
    <div class="min-h-screen flex flex-row text-center gap-2">
      <div class="flex flex-row justify-between">
        <div class="stats stats-vertical shadow">
          <div class="stat">
            <div class="stat-title text-5xl">室温</div>
            <div class="stat-value text-7xl">{{ roomTmpState.toFixed(1) }} <span class="text-5xl">℃</span></div>
          </div>
          <div class="stat">
            <div class="stat-title text-5xl">気圧</div>
            <div class="stat-value text-7xl">{{ pressureState }}
              <br>
              <span class="text-5xl">hPa</span>
            </div>
          </div>
          <div class="stat">
            <div class="stat-title text-5xl">外気温</div>
            <div class="stat-value text-7xl">{{ outTmpState }} <span class="text-5xl">℃</span></div>
          </div>
          <div class="stat">
            <div class="stat-title text-5xl">天気</div>
            <div class="stat-value text-7xl">{{ weatherState }}</div>
          </div>
        </div>
      </div>

      <div class="grow flex flex-col max-h-max items-center justify-center gap-4">
        <!-- 時間表示 -->
        <h1 class="countdown text-[15vw] font-bold">
          <span :style="{ '--value': timeState.getHours() }"></span>:
          <span :style="{ '--value': timeState.getMinutes() }"></span>:
          <span :style="{ '--value': timeState.getSeconds() }"></span>
        </h1>
        <!-- 日付表示 -->
        <h2 class="countdown text-[4vw]">
          {{ timeState.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            weekday: 'short'
          }) }}
        </h2>
      </div>

      <div class="flex flex-col gap-4 m-2">
        <div>
          <h2 class="text-2xl mb-3">レポート日数</h2>
          <div class="radial-progress text-primary text-4xl"
            :style="{ '--value': reportRatio, '--size': '10vw', '--thickness': '1vw' }">
            {{ reportMonthDeadlineTime.getDate() }}日
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
