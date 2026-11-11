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

## ルール
Gitでこまめにコミットする。コミット内容はConventional Commitsのルールを適用

### TypeScript / React
- オブジェクト指向は使用せず、関数型プログラミングでコーディングする。
- 関数の定義は基本的に無名関数方式(`const anyFunc = () => {};`)を使用
- useStateは増やしすぎず、関連する項目はできるだけ一つのオブジェクトにまとめる。

## デバッグ
- ブラウザとはPlaywright MCPで接続する
