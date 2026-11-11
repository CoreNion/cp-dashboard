import { Icon as IconifyIcon } from '@iconify/react';

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
