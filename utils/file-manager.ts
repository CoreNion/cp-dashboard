/// OPFSにファイルを保存するためのユーティリティ
export async function saveFile(file: File, saveName: string) {
  // 元のファイル名をstorageに保存
  localStorage.setItem(saveName, file.name);

  // OPFSに保存
  const opfsRoot = await navigator.storage.getDirectory();
  const chimeHandle = await opfsRoot.getFileHandle(saveName, { create: true });
  const writable = await chimeHandle.createWritable();
  await writable.write(file);
  await writable.close();
}

/// OPFSからファイルを削除するためのユーティリティ
export async function removeFile(fileName: string) {
  const opfsRoot = await navigator.storage.getDirectory();
  await opfsRoot.removeEntry(fileName);

  localStorage.removeItem(fileName);
}

/// ファイルからURLを生成するためのユーティリティ
export async function createFileURL(fileName: string) {
  const opfsRoot = await navigator.storage.getDirectory();
  const file = await opfsRoot.getFileHandle(fileName);
  return URL.createObjectURL(await file.getFile());
}

/// OPFSからファイルをダウンロードするためのユーティリティ
export async function downloadFile(fileName: string) {
  const url = await createFileURL(fileName);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

/// OPFSにファイルが存在するかどうかを確認するためのユーティリティ
export async function isFileExist(fileName: string) {
  const opfsRoot = await navigator.storage.getDirectory();
  try {
    await opfsRoot.getFileHandle(fileName);
    return true;
  } catch (e) {
    return false;
  }
}

/// ファイルをURLを通してメモリに保存する
export async function appendFileToState(fileName: string, toState: () => globalThis.Ref) {
  const opfsRoot = await navigator.storage.getDirectory();
  try {
    const verticalBannerHandle = await opfsRoot.getFileHandle(fileName, { create: false });
    const verticalBannerBuffer = await verticalBannerHandle.getFile();
    toState().value = URL.createObjectURL(verticalBannerBuffer);
  } catch (e) {
    console.warn(e);
  }
}