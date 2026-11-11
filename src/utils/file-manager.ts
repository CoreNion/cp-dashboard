/// OPFSにファイルを保存するためのユーティリティ
export const saveFile = async (file: File, saveName: string) => {
  const opfsRoot = await navigator.storage.getDirectory();
  const handle = await opfsRoot.getFileHandle(saveName, { create: true });
  const writable = await handle.createWritable();
  await writable.write(file);
  await writable.close();
};

/// OPFSからファイルを削除するためのユーティリティ
export const removeFile = async (fileName: string) => {
  const opfsRoot = await navigator.storage.getDirectory();
  await opfsRoot.removeEntry(fileName);
};

/// OPFSにファイルが存在するかどうかを確認するためのユーティリティ
export const isFileExist = async (fileName: string) => {
  try {
    const opfsRoot = await navigator.storage.getDirectory();
    await opfsRoot.getFileHandle(fileName);
    return true;
  } catch {
    return false;
  }
};

/// OPFSのファイルからURLを生成する (存在しない場合はnull)
export const createFileURL = async (fileName: string) => {
  try {
    const opfsRoot = await navigator.storage.getDirectory();
    const handle = await opfsRoot.getFileHandle(fileName, { create: false });
    return URL.createObjectURL(await handle.getFile());
  } catch (e) {
    console.warn(e);
    return null;
  }
};
