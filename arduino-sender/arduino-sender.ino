#include <Wire.h>
#include <ArduinoJson.h>

const int TMP36_APIN = 0;

// -OutPutと接続
const int MPS2407_MOUTPUT_APIN = 1;
// +OutPutと接続
const int MPS2407_POUTPUT_APIN = 2;

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
      // TMP36 温度測定
      // データシート: https://www.analog.com/media/jp/technical-documentation/data-sheets/TMP35_36_37_jp.pdf
      float tmpVoltage = analogRead(TMP36_APIN) * 5.0 / 1023.0;
      // 気温 = (温度センサーの出力電圧 - オフセット電圧 500mv) * 100
      float temperature = (tmpVoltage - 0.5) * 100;

      // MPS2407 気圧測定 (WIP)
      // データシート: https://akizukidenshi.com/download/ds/metrodyne/MPS-2400series.pdf
      // ホイートストンブリッジ回路が使われている模様、二つの出力電圧の差分(スパン電圧)から、気圧を算出する

      // -Outputの電圧 (面倒なのでmvに変換)
      float mps2407MOutVoltage = analogRead(MPS2407_MOUTPUT_APIN) * 5.0 / 1023.0 * 1000;
      // +Outputの電圧 (mvに変換)
      float mps2407POutVoltage = analogRead(MPS2407_POUTPUT_APIN) * 5.0 / 1023.0 * 1000;
      // 気圧 = (P-Outputの電圧 - M-Outputの電圧) / 0.174 (推測、WIP)
      // Arduinoのアナログ入力の分解能が低すぎて、気圧の算出がうまくいかない模様
      float pressure = (mps2407POutVoltage - mps2407MOutVoltage) / 0.174;

      // JSONを生成
      DynamicJsonDocument doc(200);
      doc["temperature"] = temperature;
      doc["mps2407MOutVoltage"] = mps2407MOutVoltage;
      doc["mps2407POutVoltage"] = mps2407POutVoltage;
      doc["pressure"] = pressure;

      // JSON出力
      serializeJson(doc, Serial);
      Serial.println();
    }
  }
}