import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import 'dayjs/locale/ja';

dayjs.extend(duration);
dayjs.locale("ja");

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
export async function getSensorRecords(params:string, maxRecords: number) {
  const opfsRoot = await navigator.storage.getDirectory();
  const files = opfsRoot.entries();

  const records = [];
  let i = 0;
  for await (const [key, value] of files) {
    i += 1;
    if (i > maxRecords) break;

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

      const date = dayjs(file.name.split('.')[0].split('_')[1]).format('MM月DD日');

      records.push({ date: date, value: dayMap });
    }
  }
  return records;
}