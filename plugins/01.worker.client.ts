import DashWorker from '../worker.ts?worker';

export default defineNuxtPlugin((nuxtApp) => {
  const worker = new DashWorker();

  return {
    provide: {
      worker: worker
    }
  }
});