import { useIntervalFn, type Pausable } from "@vueuse/core";
import dayjs from "dayjs";

export default defineNuxtPlugin(async (nuxtApp) => {
  // 10秒ごとに温度を更新 (1秒だとシリアル通信が追いつかない?
  await refleshStatus();
  sensorInterval().value = useIntervalFn(refleshStatus, 10000);
});

// センサー情報を更新
export async function refleshStatus() {
  if (isSensorRecording().value === false) return;

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
  
  if (sensorSourceState.value === "serial" && serialPortState.value != null) {
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
  } else {
    return;
  }

  // センサー情報の記録を更新
  const now = dayjs();
  // CSVに書き込み
  try {
    const opfsRoot = await navigator.storage.getDirectory();
    const csvHandle = await opfsRoot.getFileHandle(`sensor_${now.format("YYYYMMDD")}.csv`, { create: true });

    const readable = await csvHandle.getFile();
    const writable = await csvHandle.createWritable({ keepExistingData: true });

    // 現在時刻,室温,湿度,気圧,ガス抵抗値
    const line = `${now.format("HH:mm:ss")},${roomTmpState.value},${humidityState.value},${pressureState.value},${gasState.value}\n`;
    // CSVの末尾に追記
    await writable.write({ type: 'write', data: line, position: readable.size })

    await writable.close();
  } catch (e) {
    console.error("センサー記録用のCSVの書き込みに失敗しました");
    console.error(e);
  }

  // Intervalを再開
  sensorIntervalState.value?.resume();
}