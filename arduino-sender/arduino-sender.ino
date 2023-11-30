#include <Wire.h>
#include <ArduinoJson.h>

const int TMP36_APIN = 0;

const int MPS2407_OUTPUT_APIN = 1;

void setup()
{
  Serial.begin(115200);
}

void loop()
{
  if (Serial.available())
  {
    String data = Serial.readStringUntil(';');
    if (data == "REQUEST_SENSOR_DATA")
    {
      // 温度測定
      float tmpVoltage = analogRead(TMP36_APIN) * 5.0 / 1024.0;
      float temperature = (tmpVoltage - 0.5) * 100;

      // 気圧測定 (WIP)
      float mps2407OutVoltage = analogRead(MPS2407_OUTPUT_APIN) * 5.0;

      // JSONを生成
      DynamicJsonDocument doc(200);
      doc["temperature"] = temperature;
      doc["mps2407OutVoltage"] = mps2407OutVoltage;

      // JSON出力
      serializeJson(doc, Serial);
      Serial.println();
    }
  }
}