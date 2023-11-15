import type { EightChannels, McpInterface } from "mcp-spi-adc";

const volts = process.env.PWR_VOLTS ?? 3.3;

let tempSensor: McpInterface | null | undefined = undefined;
let pressureSensor: McpInterface | null | undefined = undefined;

/// MCP3008のインターフェースを開く
async function _openMcpInterface(channel: EightChannels) {
  if (process.platform === "linux") {
    const mcp = await import("mcp-spi-adc");
    return mcp.openMcp3008(channel, { speedHz: 10000 }, (err: string) => {
      if (err) throw err;
    });
  } else {
    return null;
  }
}

/// センサーの値を読み取る
async function _readSendorValue(sensor: McpInterface) {
  try {
    return await new Promise<number | null>((resolve, reject) => {
      sensor.read((err: any, reading: { value: number; }) => {
        if (err) reject(err);

        resolve(reading.value);
      });
    });
  } catch (err_1) {
    console.error(err_1);
    return null;
  }
}

export default defineEventHandler(async (event) => {
  // 初期化されていない場合は初期化
  if (tempSensor === undefined || pressureSensor === undefined) {
    tempSensor = await _openMcpInterface(0);
    pressureSensor = await _openMcpInterface(1);
  }

  if (tempSensor === null || pressureSensor === null) {
    return {
      tmp: null,
      pressure: null
    };
  }

  let tmp = (await _readSendorValue(tempSensor!));
  tmp = tmp ? (tmp * Number(volts) - 0.5) * 100 : null;

  // WIP
  let pressure = await _readSendorValue(pressureSensor!);
  pressure = pressure ? pressure * Number(volts) * 423.6: null;

  return {
    tmp: tmp,
    pressure: pressure
  };
});