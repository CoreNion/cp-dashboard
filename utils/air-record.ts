export async function downloadCsvFile() {
  const opfsRoot = await navigator.storage.getDirectory();
  const file = await opfsRoot.getFileHandle('gas.csv', { create: true });

  const url =  URL.createObjectURL(await file.getFile());
  const a = document.createElement('a');
  a.href = url;
  a.download = 'gas.csv';
  a.click();
  URL.revokeObjectURL(url);
}