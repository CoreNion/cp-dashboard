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