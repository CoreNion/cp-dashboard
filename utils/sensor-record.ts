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

/**
 * CSVの記録から指定されたデータを取得する
 * @param params データの種類
 * @returns Map<時刻, データ>
 */
export async function getSensorRecords(params:string) {
  const opfsRoot = await navigator.storage.getDirectory();
  const files = opfsRoot.entries();

  const records = [];
  for await (const [key, value] of files) {
    if (key.endsWith('.csv')) {
      const dayMap = new Map<string, number>();

      const fileHandle = await opfsRoot.getFileHandle(key);
      const file = await fileHandle.getFile();
      const text = await file.text();

      const lines = text.split('\n');
      for (const line of lines) {
        const data = line.split(',');

        if (params === '気温') dayMap.set(data[0], Number(data[1]));
        else if (params === '湿度') dayMap.set(data[0], Number(data[2]));
        else if (params === '気圧') dayMap.set(data[0], Number(data[3]));
        else if (params === 'ガス抵抗値') dayMap.set(data[0], Number(data[4]));
      }

      records.push({ date: file.name, value: dayMap });
    }
  }
  return records;
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