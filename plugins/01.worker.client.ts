export default defineNuxtPlugin((nuxtApp) => {
  const worker = new Worker(new URL('../worker.ts', import.meta.url), { type: 'module' });

  return {
    provide: {
      worker: worker
    }
  }
});