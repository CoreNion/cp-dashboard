'use client';

import { useState } from 'react';
import useLocalStorage from 'use-local-storage';

// バナー関連のカスタムフックをまとめたファイル

export const useBannerSource = () => {
  const [bannerSource, setBannerSource] = useState<string | null>(null);
  return [bannerSource, setBannerSource] as const;
};

export const useIsBannerVisible = () => {
  const [isBannerVisible, setIsBannerVisible] = useLocalStorage<boolean>('isBannerVisible', false);
  return [isBannerVisible, setIsBannerVisible] as const;
};

export const useIsVerticalBanner = () => {
  const [isVerticalBanner, setIsVerticalBanner] = useLocalStorage<boolean>('isVerticalBanner', false);
  return [isVerticalBanner, setIsVerticalBanner] as const;
};

export const useVerticalBannerSource = () => {
  const [verticalBannerSource, setVerticalBannerSource] = useState<string | null>(null);
  return [verticalBannerSource, setVerticalBannerSource] as const;
};
