import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.tsx';
import './index.css';
import { startApp } from './services/init.ts';

// 設定の読み込み(旧バージョンからの移行を含む)はストアの作成時に行われる
startApp();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
