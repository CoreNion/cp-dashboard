import { updateRuntime } from '../store/runtime.ts';
import { getSettings } from '../store/settings.ts';
import type { WeatherRequestSettings, WeatherResult } from '../workers/weather.ts';

let worker: Worker | null = null;

/** 天気用のworkerを起動する */
export const startWeather = () => {
  worker = new Worker(new URL('../workers/weather.ts', import.meta.url), { type: 'module' });

  worker.addEventListener('message', (event: MessageEvent<string | WeatherResult>) => {
    const data = event.data;

    if (typeof data === 'string') {
      // workerから設定を要求されたら、現在の設定を返す
      if (data === 'GET_STORAGE_KEY') {
        const { amedasCode, office, area, onlyTemp } = getSettings().weather;
        const settings: WeatherRequestSettings = {
          amedasCode,
          weatherOfficeNumber: office,
          weatherAreaNumber: area,
          isAmedasOnlyTmp: onlyTemp,
        };
        worker?.postMessage(settings);
      }
    } else {
      // 気象情報をUIに反映
      updateRuntime({ weather: { icon: data.weather, outTmp: data.outTmp, pressure: data.pressure } });
    }
  });
};

/** 天気を今すぐ更新する */
export const refreshWeather = () => {
  worker?.postMessage('REFLESH_WEATHER');
};
