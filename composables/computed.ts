/**
 * チャイムの有効/無効設定用のcomputed
 */
export const chimeComputed = () => computed<boolean>(
  {
    get() {
      return isChimeEnabled().value;
    },
    set(value) {
      if (typeof localStorage !== 'undefined')
        localStorage.setItem('isChimeEnabled', JSON.stringify(value));
      isChimeEnabled().value = value;
    }
  }
);

/**
 * 予鈴の有効/無効設定用のcomputed
 */
export const preChimeComputed = () => computed<boolean>(
  {
    get() {
      return isPreChimeEnabled().value;
    },
    set(value) {
      if (typeof localStorage !== 'undefined')
        localStorage.setItem('isPreChimeEnabled', JSON.stringify(value));
      isPreChimeEnabled().value = value;
    }
  }
);