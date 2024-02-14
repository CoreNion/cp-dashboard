<script setup lang="ts">
// センサーのソース
const sensorSourceState = sensorSource();
// シリアル通信の準備ができているか
const isSerialReadyState = isSerialReady();

// 現在の室温
const roomTmpState = roomTmp();
// 現在の湿度
const humidityState = humidity();
// 現在の気圧
const pressureState = pressure();

// 現在の外気温
const outTmpState = outTmp();
</script>

<template>
  <div class="min-w-full stats stats-vertical shadow">
    <div class="stat px-0">
      <div class="stat-title text-[3vw]">室温</div>
      <div v-if="sensorSourceState === 'serial' && !isSerialReadyState">
        <span class="font-bold text-xl">接続設定が必要です</span>
        <br>
        <button class="btn btn-primary btn-sm mt-1" @click="connectSerialDevice()">設定する</button>
      </div>

      <div v-else class="stat-value font-semibold text-[4.6vw]">{{ roomTmpState != null ? roomTmpState.toFixed(1) : "-" }}
        <IconCSS name="uil:celsius" size="4vw" />
      </div>
    </div>
    <div class="stat py-1">
      <div class="stat-title text-[3vw]">室内湿度</div>
      <div v-if="sensorSourceState === 'serial' && !isSerialReadyState">
        <span class="font-bold text-xl">接続設定が必要</span>
      </div>

      <div v-else class="stat-value font-semibold text-[4.6vw]">{{ humidityState != null ? humidityState.toFixed(1) : "-"
      }}
        <IconCSS name="uil:percentage" size="4vw" />
      </div>
    </div>
    <div class="stat px-0 py-1">
      <div class="stat-title text-[3vw]">
        気圧{{ sensorSourceState === 'serial' && !isSerialReadyState ? '*' : '' }}
      </div>
      <div class="stat-value font-semibold leading-none flex flex-col">
        <span class="text-[4.6vw]">{{ pressureState != null ? pressureState.toFixed(1) : "-" }}</span>
        <span class="text-[3vw]">hPa</span>
      </div>
    </div>
    <div class="stat py-1">
      <div class="stat-title text-[3vw]">外気温*</div>
      <div class="stat-value font-semibold text-[4.6vw]">{{ outTmpState != null ? outTmpState : "-" }}
        <IconCSS name="uil:celsius" size="4vw" />
      </div>
    </div>

    <div class="stat m-auto gap-2">
      <span>*出典: 気象庁ホームページ</span>
      
      <DynamicModal linkTypeButton btnTitle="センサーの記録">
        <SensorRecord></SensorRecord>
      </DynamicModal>

      <DynamicModal btnTitle="設定">
        <Settings />
      </DynamicModal>
    </div>
  </div>
</template>