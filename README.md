# Campus Dashboard
必要な情報を一目で確認できる、タイマー付きのダッシュボードサイト。

<img width="1675" alt="Campus Dashboardのスクリーンショット" src="https://github.com/CoreNion/cp-dashboard/assets/70258493/5c969971-5bf5-4c59-87da-fc8b9bbdb6dc">

# 特徴
大型スクリーンに映したいあの情報や、ああったらいいなと思う機能を、一つの画面にまとめたWeb Appです！

## 主な機能
- 大きな時計
  - オンライン時は[WebNTP](https://webntp.shogo82148.com/)で端末の時計のずれを補正
  - 表示するタイムゾーンの選択
- タイマー
- 設定時間に応じた、チャイム/予鈴鳴動
- 行事カウントダウン
- 情報表示機能 (気象データからの情報)
  - 天気
  - 外気温
  - 気圧
- 電光掲示板風の文字スクロール
- バナー広告風に画像を表示

## ダッシュボードの柔軟なカスタマイズ
タイマーやチャイムなどの音源は、設定から自由に変更することが可能です。

また、気象情報の設定地域や気温などのアメダスの観測点も、設定から変更することが可能です。(デフォルトでは、東京地方/東京の気象情報を表示します。)

フォントの変更や、テーマの変更も可能です！

時刻設定では、オンライン時刻補正の有効/無効と、時計・チャイム・カウントダウンに使用するタイムゾーンを変更できます。(時刻補正が有効な場合は、時刻の取得のためにWebNTPのサーバーと通信します。)

## 静的にホスティング可能
このウェブアプリは、情報の取得なども含め、すべての処理をクライアント側で行うことが可能です。

そのため、静的ファイルをホスティングするだけで簡単に導入することができるほか、データ収集は行わないため、プライバシーにも配慮されています。

## バージョンについて
v2.0.0より、React + Viteで作り直されました。v1(Nuxt版)で保存された設定や音源などは、初回起動時に自動的に引き継がれます。

なお、v1にあった専用ハードウェア(Arduino)のセンサーから室温・湿度などを取得する機能は、v2では一旦廃止されています。(`arduino-sender/`にスケッチのみ残しています)

# 開発
Node.js 24 / Yarn 4 を使用します。

```sh
yarn install
yarn dev      # 開発サーバーを起動
yarn build    # 型チェックとビルド (dist/ に出力)
yarn preview  # ビルド結果をプレビュー
yarn icons    # 使用するアイコンを追加した際に、バンドルするアイコンを再生成
```

サブディレクトリで公開する場合は、ビルド時に環境変数`BASE_URL`を指定してください。(例: `BASE_URL=/cp-dashboard/ yarn build`)

# その他
詳しい詳細や使い方などは、[Wiki](https://github.com/CoreNion/cp-dashboard/wiki)を参照してください。

## 気象データについて
気象データは、[気象庁のホームページ](https://www.jma.go.jp/bosai/)から取得しています。

このデータは、気象庁が提供している[「気象庁ウェブサービス利用規約」](https://www.jma.go.jp/jma/kishou/info/coment.html)に基づいて利用しています。

地点選択の地図には、[地理院タイル](https://maps.gsi.go.jp/development/ichiran.html)を使用しています。

## フォントのライセンス
- Inter
  - [SIL Open Font License 1.1](https://scripts.sil.org/OFL)
  - Copyright 2020 The Inter Project Authors (https://github.com/rsms/inter)
- M PLUS Rounded 1c
  - [SIL Open Font License 1.1](https://scripts.sil.org/OFL)

## 効果音のライセンス
- OtoLogic (https://otologic.jp): [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/)