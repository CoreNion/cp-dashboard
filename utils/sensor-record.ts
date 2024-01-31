export async function listCsvFiles() {
  const opfsRoot = await navigator.storage.getDirectory();
  const files = opfsRoot.entries();

  const csvFiles = [];
  for await (const [key, value] of files) {
    if (key.endsWith('.csv')) {
      csvFiles.push({ key, value });
    }
  }
  return csvFiles;
}

export async function downloadFile(fileName: string) {
  const opfsRoot = await navigator.storage.getDirectory();
  const file = await opfsRoot.getFileHandle(fileName);

  const url = URL.createObjectURL(await file.getFile());
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}