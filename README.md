# Campus Dashboard
必要な情報を一目で確認できる、タイマー付きのダッシュボードサイト。

<img width="1675" alt="Campus Dashboardのスクリーンショット" src="https://github.com/CoreNion/cp-dashboard/assets/70258493/5c969971-5bf5-4c59-87da-fc8b9bbdb6dc">

# 特徴
大型のスクリーンに映したいあの情報や、あったらあったらいいなと思う機能を、一つの画面にまとめたウェブアプリです！

## 主な機能
- 大きな時計
- タイマー
- 設定時間に応じた、チャイム/予鈴鳴動
- 行事カウントダウン
- 情報表示機能
  - センサーからの情報 (専用のハードウェアが必要 [技術情報](https://github.com/CoreNion/cp-dashboard/wiki/%E6%B8%AC%E5%AE%9A%E3%82%BB%E3%83%B3%E3%82%B5%E3%83%BC%E3%81%AE%E6%8A%80%E8%A1%93%E7%9A%84%E6%83%85%E5%A0%B1)が必要)
    - 室温 
    - 湿度
    - 気圧
  - 気象データからの情報
    - 天気
    - 外気温
    - (気圧)
- 電光掲示板風の文字スクロール
- バナー広告風に画像を表示

## ダッシュボードの柔軟なカスタマイズ
タイマーやチャイムなどの音源は、設定から自由に変更することが可能です。

また、気象情報の設定地域や気温などのアメダスの観測点も、設定から変更することが可能です。(デフォルトでは、東京地方/東京の気象情報を表示します。)

フォントの変更や、テーマの変更も可能です！

## 静的にホスティング可能
このウェブアプリは、情報の取得なども含め、すべての処理をクライアント側で行うことが可能です。

そのため、静的ファイルをホスティングするだけで簡単に導入することができるほか、データ収集は行わないため、プライバシーにも配慮されています。

# その他
詳しい詳細や使い方などは、[Wiki](https://github.com/CoreNion/cp-dashboard/wiki)を参照してください。

## 気象データについて
気象データは、[気象庁のホームページ](https://www.jma.go.jp/bosai/)から取得しています。

このデータは、気象庁が提供している[「気象庁ウェブサービス利用規約」](https://www.jma.go.jp/jma/kishou/info/coment.html)に基づいて利用しています。

## フォントのライセンス
- Inter
  - [SIL Open Font License 1.1](https://scripts.sil.org/OFL)
  - Copyright 2020 The Inter Project Authors (https://github.com/rsms/inter)
- M PLUS Rounded 1c
  - [SIL Open Font License 1.1](https://scripts.sil.org/OFL)

## 効果音のライセンス
- OtoLogic (https://otologic.jp): [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/)