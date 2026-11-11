# Campus DashBoard
日付や時計などダッシュボード機能、タイマーやアラームなどの卓上機能を静的なWebアプリにまとめるプロジェクト。

詳細はREADME.mdに記載

## 技術スタック (v2)
- TypeScript 7
- Vite v8
- React v19
- DaisyUI v5
- TailwindCSS v4

(Arudino系の機能は一旦廃止)

## 構成 (v2)
- `src/store/`: 状態管理。`settings.ts`(LocalStorageに保存される設定) / `runtime.ts`(保存されない状態) / `migration.ts`(旧バージョンの設定の移行)
- `src/workers/`: 時計・タイマー・天気のWeb Worker (バックグラウンドのタブでも正しく動作させるため)
- `src/services/`: Workerの起動や音声など、Reactの外で動くロジック
- `src/components/`: UIコンポーネント (`settings/`は設定画面)
- バージョンは`package.json`の`version`で管理し、`__APP_VERSION__`として参照する。設定の形式を変える場合は`migration.ts`に移行処理を追加する
- アイコン(Iconify)を追加した場合は`yarn icons`を実行する

## コマンド
- `yarn dev`: 開発サーバー
- `yarn build`: 型チェック + ビルド

## ルール
Gitでこまめにコミットする。コミット内容はConventional Commitsのルールを適用

### TypeScript / React
- オブジェクト指向は使用せず、関数型プログラミングでコーディングする。
- 関数の定義は基本的に無名関数方式(`const anyFunc = () => {};`)を使用
- useStateは増やしすぎず、関連する項目はできるだけ一つのオブジェクトにまとめる。

## デバッグ
- ブラウザとはPlaywright MCPで接続する
