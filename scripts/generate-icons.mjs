// ソースコード内で使われているIconifyのアイコンだけを抜き出し、src/icons.json に書き出すスクリプト。
// アイコンをバンドルに含めることで、オフラインでも表示できるようにする。
// 新しいアイコンを使い始めたら `yarn icons` を実行すること。

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { getIcons } from '@iconify/utils';

const require = createRequire(import.meta.url);

/** 対応しているアイコンセット (@iconify-json/* がインストールされているもの) */
const prefixes = ['uil', 'wi', 'system-uicons'];

const srcDir = join(import.meta.dirname, '..', 'src');
const outFile = join(srcDir, 'icons.json');

/** ディレクトリ内のソースファイルを再帰的に列挙する */
const listSourceFiles = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return listSourceFiles(path);
    return /\.tsx?$/.test(entry.name) ? [path] : [];
  });

// ソースコードから "prefix:name" 形式のアイコン名を集める
const pattern = new RegExp(`['"\`](${prefixes.join('|')}):([a-z0-9-]+)['"\`]`, 'g');
const used = listSourceFiles(srcDir)
  .flatMap((file) => [...readFileSync(file, 'utf-8').matchAll(pattern)])
  .reduce((acc, [, prefix, name]) => ({ ...acc, [prefix]: [...new Set([...(acc[prefix] ?? []), name])].sort() }), {});

const collections = Object.entries(used).map(([prefix, names]) => {
  const collection = require(`@iconify-json/${prefix}/icons.json`);
  const subset = getIcons(collection, names);

  const missing = names.filter((name) => subset?.icons[name] == null && subset?.aliases?.[name] == null);
  if (subset == null || missing.length > 0) {
    throw new Error(`アイコンが見つかりません: ${missing.map((name) => `${prefix}:${name}`).join(', ')}`);
  }
  return subset;
});

writeFileSync(outFile, JSON.stringify(collections, null, 2) + '\n');
console.log(`${collections.reduce((acc, c) => acc + Object.keys(c.icons).length, 0)}個のアイコンを ${outFile} に書き出しました`);
