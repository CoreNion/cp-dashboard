export default defineNuxtPlugin(async (nuxtApp) => {
  const worker = new Worker(new URL('../workers/weather.ts', import.meta.url), { type: 'module' });

  // localStorageを要求された時用
  worker.onmessage = (event: MessageEvent<string | any>) => {
    const data = event.data;
    if (typeof data === "string") {
      if (data == "GET_STORAGE_KEY") {
        worker.postMessage({
          amedasCode: weatherAmedasCode().value,
          weatherOfficeNumber: weatherOfficeNumber().value,
          weatherAreaNumber: weatherAreaNumber().value,
          isAmedasOnlyTmp: isAmedasOnlyTmp().value,
        });
      }
    } else {
      // 気象情報をUIに反映
      pressure().value = data.pressure;
      outTmp().value = data.outTmp;
      weather().value = data.weather;
    }
  };
  
  return {
    provide: {
      weatherWorker: worker
    }
  }
});
