/**
 * 気象庁の地域番号と地域名のクラス
 */
export class regionCodeName {
  code: string;
  name: string;

  constructor(code: string, name: string) {
    this.code = code;
    this.name = name;
  }
}

/**
 * 気象庁の地域番号で親コードから子コードの番号と地域名のリストを取得する
 * @param parentsObj 親要素のオブジェクト (例:centers)
 * @param parentCode 親要素のコード (例:010300[関東地方])
 * @param childrenObj 子要素のオブジェクト (例:offices)
 * @returns 子要素のコードと地域名のリスト (例:{130000: "東京都"}, 140000: "神奈川県", ...])
 */
export function getWeatherAreaCodes(parentsObj:any, parentCode:string, childrenObj:any) {
  // 親要素内の地域のコードを取得する
  const childrenCodes = Object(parentsObj)[parentCode]["children"] as Array<string>;
  return childrenCodes.map((code) => {
    return new regionCodeName(code, Object(childrenObj)[code]["name"]);
  });
}