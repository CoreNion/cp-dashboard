<script setup lang="ts">
import { useIntervalFn, type Pausable } from '@vueuse/core'
import dayjs from 'dayjs';
import 'dayjs/locale/ja';

// センサーのソース
const sensorSourceState = sensorSource();
// シリアル通信の準備ができているか
const isSerialReady = useState('isSerialReady', () => false);

// 現在の室温
const roomTmpState = roomTmp();
// 現在の湿度
const humidityState = humidity();
// 現在の気圧
const pressureState = pressure();
// ガス抵抗値
const gasState = gas();

// 現在の外気温
const outTmpState = outTmp();

// センサーのインターバル
let sensorInterval: Pausable | null = null;
let serialPort: SerialPort | null = null;

/// シリアルポートに接続
async function connectSerialDevice() {
  // シリアル通信の準備ができていない場合は初期化
  try {
    serialPort = await navigator.serial.requestPort({
      filters: [
        { usbVendorId: 0x2341, usbProductId: 0x0043 },
      ]
    });
    await serialPort.open({ baudRate: 115200 });
  } catch (e) {
    console.error(e);
    return;
  }

  isSerialReady.value = true;
  sensorInterval?.resume();
}

// センサー情報を更新
async function refleshStatus() {
  // 同時実行されないようにIntervalを一時停止
  sensorInterval?.pause();

  // センサーのソース設定を取得
  const sensorSource = localStorage.getItem('sensorSource');
  if (sensorSource == null) {
    // ない場合は初期値のシリアルに設定
    localStorage.setItem('sensorSource', 'serial');
  } else {
    sensorSourceState.value = sensorSource;
  }

  if (sensorSourceState.value === "rpi") {
    // サーバーからセンサー情報を取得
    const { data, error } = await useFetch('/api/sensor');
    if (error.value || data.value?.tmp == null) {
      // エラー・データが無いの場合は停止
      console.error(error.value);

      roomTmpState.value = null;
      pressureState.value = null;
      return;
    }

    roomTmpState.value = data.value?.tmp ?? null;
    pressureState.value = data.value?.pressure ?? null;
  } else if (sensorSourceState.value === "serial" && serialPort != null) {
    // シリアルポートからのデータを読み込み
    const reader = serialPort.readable!.getReader();

    // シリアル通信からのデータを受信するタスク
    const serialTask = new Promise<void>(async (resolve, reject) => {
      // 細切れのデータが来るのでwhile

      let json = '';
      while (true) {
        // 受信待ち
        const { value, done } = await reader.read();
        if (done) {
          reader.releaseLock();
          break;
        }
        json += new TextDecoder().decode(value);

        // 改行コードでJSONの区切りを判定
        if (json.endsWith('\n')) {
          // JSONをパース
          const data = JSON.parse(json);

          // 気温データを更新
          roomTmpState.value = data.temperature;
          // 湿度データを更新
          humidityState.value = data.humidity;
          // 気圧データを更新
          pressureState.value = data.pressure;
          // ガス抵抗値を更新
          gasState.value = data.gas_resistance;

          // 終了
          reader.releaseLock();
          break;
        }
      }

      resolve();
    });

    // Arduinoにセンサー情報の取得をリクエスト
    const writer = serialPort.writable!.getWriter();
    await writer.write(kRawRequest);
    writer.releaseLock();

    // シリアル通信のタスクが終了するまで待機
    await serialTask;
  } else if (!isSerialReady.value) {
    return;
  }

  // Intervalを再開
  sensorInterval?.resume();
}

// クライアントサイドのみで実行
onMounted(async () => {
  // 10秒ごとに温度を更新 (1秒だとシリアル通信が追いつかない?
  await refleshStatus();
  sensorInterval = useIntervalFn(refleshStatus, 10000);
});
</script>

<template>
  <div class="min-w-full stats stats-vertical shadow">
    <div class="stat px-0">
      <div class="stat-title text-[3vw]">室温</div>
      <div v-if="sensorSourceState === 'serial' && !isSerialReady">
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
      <div v-if="sensorSourceState === 'serial' && !isSerialReady">
        <span class="font-bold text-xl">接続設定が必要</span>
      </div>

      <div v-else class="stat-value font-semibold text-[4.6vw]">{{ humidityState != null ? humidityState.toFixed(1) : "-"
      }}
        <IconCSS name="uil:percentage" size="4vw" />
      </div>
    </div>
    <div class="stat px-0 py-1">
      <div class="stat-title text-[3vw]">
        気圧{{ sensorSourceState === 'serial' && !isSerialReady ? '*' : '' }}
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
      
      <AirStatus></AirStatus>

      <settings class="flex-1"></settings>
    </div>
  </div>
</template>