import { Suspense, useRef, useState, type ReactNode } from 'react';
import { Icon } from './Icon.tsx';

type DynamicModalProps = {
  /** ボタンではなくリンクとして表示するか */
  linkTypeButton?: boolean;
  btnTitle?: string;
  btnWfull?: boolean;
  iconName?: string;
  /** ボタンに文字がない場合の読み上げ用ラベル */
  ariaLabel?: string;
  children: ReactNode;
};

/** 開いたときにだけ中身を読み込むモーダルと、それを開くボタン */
export const DynamicModal = ({ linkTypeButton, btnTitle, btnWfull, iconName, ariaLabel, children }: DynamicModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  // モーダルの中身の表示状態
  const [loadContents, setLoadContents] = useState(false);

  // モーダルを表示
  const showModal = () => {
    setLoadContents(true);
    dialogRef.current?.showModal();
  };

  // モーダルが閉じられたら、アニメーションが終わるのを待ってから中身を破棄する
  const onClose = () => {
    setTimeout(() => {
      if (!dialogRef.current?.open) setLoadContents(false);
    }, 500);
  };

  return (
    <>
      {linkTypeButton ? (
        <a className="link" onClick={showModal}>
          {btnTitle}
        </a>
      ) : (
        <button className={`btn ${btnWfull ? 'w-full' : ''}`} onClick={showModal} aria-label={ariaLabel ?? btnTitle}>
          {btnTitle != null && <span>{btnTitle} </span>}
          {iconName != null && <Icon name={iconName} size="2.5vh" />}
        </button>
      )}

      <dialog ref={dialogRef} className="modal text-base-content text-left" onClose={onClose}>
        <div className="modal-box modal-h-fix">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" aria-label="閉じる">
              ✕
            </button>
          </form>

          {loadContents ? (
            <Suspense fallback={<div className="skeleton w-full h-32"></div>}>{children}</Suspense>
          ) : (
            <div className="skeleton w-32 h-32"></div>
          )}
        </div>
      </dialog>
    </>
  );
};
