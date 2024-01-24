/**
 * BME680から気温・湿度・気圧を測定し、JSON形式でシリアル出力するArduinoスケッチ
 * (Adafruit BME680 Libraryを使用)
 * 
 * Arduinoにこのスケッチを書き込んだ後、BME680をI2C接続し、USBでPCに接続するだけで、ダッシュボードで利用できるようになります！
 * 開発時に利用したモジュールキット: AE-BME680 (https://akizukidenshi.com/catalog/g/gK-14469/)
 */

#include <Wire.h>
#include <ArduinoJson.h>
#include <Adafruit_BME680.h>

Adafruit_BME680 bme; // I2C

void setup()
{
  Serial.begin(115200);

  // bme680の初期化
  if (!bme.begin())
  {
    // 初期化失敗時の処理 (シリアル接続後にエラーを表示して終了)
    while (!Serial)
      ;
    Serial.println("[e] Could not find a valid BME680 sensor!");
    while (1);
  }

  // oversampling/filterを設定
  bme.setTemperatureOversampling(BME680_OS_8X);
  bme.setHumidityOversampling(BME680_OS_2X);
  bme.setPressureOversampling(BME680_OS_4X);
  bme.setIIRFilterSize(BME680_FILTER_SIZE_3);
  bme.setGasHeater(320, 150);
}

void loop()
{
  if (Serial.available())
  {
    // シリアルから"REQUEST_SENSOR_DATA;"が送られてきたら、センサーからデータを取得してJSONを出力する
    String data = Serial.readStringUntil(';');
    if (data == "REQUEST_SENSOR_DATA")
    {
      // センサーからデータを取得
      if (!bme.performReading())
      {
        // 取得失敗時の処理 (エラーを表示して終了)
        Serial.println("[e] Failed to perform reading :(");
        return;
      }

      // 温度
      float temperature = bme.temperature;

      // 湿度
      float humidity = bme.humidity;

      // 気圧 (hPa)
      float pressure = bme.pressure / 100.0;

      // ガス抵抗 (kOhms)
      float gas_resistance = bme.gas_resistance / 1000.0;

      // JSONを生成
      DynamicJsonDocument doc(200);
      doc["temperature"] = temperature;
      doc["humidity"] = humidity;
      doc["pressure"] = pressure;
      doc["gas_resistance"] = gas_resistance;

      // JSON出力
      serializeJson(doc, Serial);
      Serial.println();
    }
  }
}