<script setup lang="ts">
// センサー情報を表示するかどうか
const sensorVisible = isSensorInfoVisible();

// 設定されているフォントサイズオフセット
const fontSizeOffset = fontSize();
// 種類名の文字サイズ
const valueNameSize = ref(`${6 * fontSizeOffset.value}vh`);
// 値のフォントサイズ
const valueSize = ref(`${8.5 * fontSizeOffset.value}vh`);

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

watch(fontSizeOffset, (newVal) => {
  valueNameSize.value = `${7 * newVal}vh`;
  valueSize.value = `${9.5 * newVal}vh`;
});
</script>

<template>
  <div class="min-w-full stats stats-vertical shadow">
    <!-- 室温 -->
    <div v-if="sensorVisible" class="stat px-0">
      <div class="stat-title value-name">室温</div>
      <div v-if="sensorSourceState === 'serial' && !isSerialReadyState">
        <span class="font-bold text-xl">接続設定が必要です</span>
        <br>
        <button class="btn btn-primary btn-sm mt-1" @click="connectSerialDevice()">接続する</button>
        <button class="btn btn-error btn-sm mt-1 ml-1" @click="sensorVisible = false">非表示にする</button>
      </div>

      <div v-else class="stat-value font-semibold value">{{ roomTmpState != null ? roomTmpState.toFixed(1) : "-" }}
        <Icon name="uil:celsius" :size="valueNameSize" />
      </div>
    </div>

    <!-- 室内湿度 -->
    <div v-if="sensorVisible" class="stat py-1">
      <div class="stat-title value-name">室内湿度</div>
      <div v-if="sensorSourceState === 'serial' && !isSerialReadyState">
        <span class="font-bold text-xl">接続設定が必要</span>
      </div>

      <div v-else class="stat-value font-semibold value">{{ humidityState != null ? humidityState.toFixed(1) : "-"
      }}
        <Icon name="uil:percentage" :size="valueNameSize" />
      </div>
    </div>

    <!-- 気圧 -->
    <div class="stat px-0 py-1">
      <div class="stat-title value-name">
        気圧{{ sensorSourceState === 'serial' && !isSerialReadyState ? '*' : '' }}
      </div>
      <div class="stat-value font-semibold leading-none flex flex-col">
        <span class="value">{{ pressureState != null ? pressureState.toFixed() : "-" }}</span>
        <span class="value-name">hPa</span>
      </div>
    </div>

    <!-- 外気温 -->
    <div class="stat py-1">
      <div class="stat-title value-name">外気温*</div>
      <div class="stat-value font-semibold value flex flex-row items-center justify-center">
        <span>{{ outTmpState != null ? outTmpState : "-" }}</span>
        <Icon name="uil:celsius" :size="valueSize" />
      </div>
    </div>


    <div v-if="!sensorVisible" class="stat px-5">
      <div class="max-2xl:hidden">
        <GeneralSetting></GeneralSetting>
      </div>
    </div>

    <div class="stat m-auto gap-2">
      <span>*出典: 気象庁ホームページ</span>

      <DynamicModal btnTitle="設定">
        <Settings />
      </DynamicModal>
    </div>
  </div>
</template>

<style>
.value-name {
  font-size: v-bind(valueNameSize);
}

.value {
  font-size: v-bind(valueSize);
}
</style>