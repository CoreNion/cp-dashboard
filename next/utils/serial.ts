/// シリアルポートに接続
export async function connectSerialDevice() {
  // シリアル通信の準備ができていない場合は初期化
  try {
    serialPort().value = await navigator.serial.requestPort({
      filters: [
        { usbVendorId: 0x2341, usbProductId: 0x0043 },
      ]
    });
    await serialPort().value?.open({ baudRate: 115200 });
  } catch (e) {
    console.error(e);
    return;
  }

  isSerialReady().value = true;
  sensorInterval().value?.resume();
}