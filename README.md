# Campus Dashboard
必要な情報を一目で確認できる、タイマー付きのダッシュボードサイト。

# 特徴/機能
N/S高通学コースでよく使うあの機能を、一つの画面にまとめたサイトです！

- 大きな時計
- タイマー
- N/S高通学コース向け チャイム/予鈴鳴動
- N/S高生向けのレポート期限等の表示
- 情報表示機能
  - センサーからの情報 ([BME680が接続されたArduino](./arduino-sender/arduino-sender.ino)が必要)
    - 室温 
    - 湿度
    - 気圧
  - 気象データからの情報
    - 天気
    - 外気温
    - (気圧)

# カスタマイズ
タイマーやチャイムなどの音源は、設定から自由に変更することが可能です。

また、気象情報の設定地域や気温などのアメダスの観測点も、設定から変更することが可能です。(デフォルトでは、東京地方/東京の気象情報を表示します。)

# その他
## 気象データについて
気象データは、[気象庁のホームページ](https://www.jma.go.jp/bosai/)から取得しています。

このデータは、気象庁が提供している[「気象庁ウェブサービス利用規約」](https://www.jma.go.jp/jma/kishou/info/coment.html)に基づいて利用しています。

## フォントのライセンス
- Inter
  - [SIL Open Font License 1.1](https://scripts.sil.org/OFL)
  - Copyright 2020 The Inter Project Authors (https://github.com/rsms/inter)
- BIZ+UDPGothic
  - [SIL Open Font License 1.1](https://scripts.sil.org/OFL)
  - Copyright 2022 The BIZ UDGothic Project Authors (https://github.com/googlefonts/morisawa-biz-ud-mincho)

## 効果音のライセンス
- OtoLogic (https://otologic.jp): [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/)