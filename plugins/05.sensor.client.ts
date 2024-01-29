import { useIntervalFn, type Pausable } from "@vueuse/core";

export default defineNuxtPlugin(async (nuxtApp) => {
  // 10秒ごとに温度を更新 (1秒だとシリアル通信が追いつかない?
  await refleshStatus();
  sensorInterval().value = useIntervalFn(refleshStatus, 10000);
});

// センサー情報を更新
export async function refleshStatus() {
  // センサーのインターバル
  const sensorIntervalState = sensorInterval();
  // センサーのソース
  const sensorSourceState = sensorSource();
  // シリアルポート
  const serialPortState = serialPort();

  // 現在の室温
  const roomTmpState = roomTmp();
  // 現在の湿度
  const humidityState = humidity();
  // 現在の気圧
  const pressureState = pressure();
  // ガス抵抗値
  const gasState = gas();

  // 同時実行されないようにIntervalを一時停止
  sensorIntervalState.value?.pause();

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
  } else if (sensorSourceState.value === "serial" && serialPortState.value != null) {
    // シリアルポートからのデータを読み込み
    const reader = serialPortState.value.readable!.getReader();

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
    const writer = serialPortState.value.writable!.getWriter();
    await writer.write(kRawRequest);
    writer.releaseLock();

    // シリアル通信のタスクが終了するまで待機
    await serialTask;
  } else if (!isSerialReady().value) {
    return;
  }

  // Intervalを再開
  sensorIntervalState.value?.resume();
}