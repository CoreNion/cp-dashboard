import { addCollection, Icon as IconifyIcon, type IconifyJSON } from '@iconify/react';
import icons from '../icons.json';

// 使用するアイコンをバンドルから登録する (オフラインでも表示できるようにするため)。
// アイコンを追加したら `yarn icons` で icons.json を再生成すること。
(icons as unknown as IconifyJSON[]).forEach((collection) => addCollection(collection));

type IconProps = {
  /** Iconifyのアイコン名 (例: "uil:setting") */
  name: string;
  /** アイコンの大きさ (CSSの長さ) */
  size?: string;
  className?: string;
};

/** Iconifyのアイコンを表示する */
export const Icon = ({ name, size, className }: IconProps) => (
  <IconifyIcon icon={name} className={`inline-block ${className ?? ''}`} style={size != null ? { fontSize: size } : undefined} />
);
