/**
 * 気象庁の地域番号と地域名
 */
export type RegionCodeName = {
  code: string;
  name: string;
};

/**
 * アメダスの情報
 */
export type AmedasInfo = {
  code: string;
  name: string;
  lat: number;
  lon: number;
  onlyTemp: boolean;
};

/** 気象庁のarea.jsonの各階層 (centers, offices, class10s) */
export type AreaTable = Record<string, { name: string; children?: string[] }>;

/** 気象庁のamedastable.json */
export type AmedasTable = Record<string, { kjName: string; lat: [number, number]; lon: [number, number]; elems: string }>;

/**
 * 気象庁の地域番号で親コードから子コードの番号と地域名のリストを取得する
 * @param parentsObj 親要素のオブジェクト (例:centers)
 * @param parentCode 親要素のコード (例:010300[関東地方])
 * @param childrenObj 子要素のオブジェクト (例:offices)
 * @returns 子要素のコードと地域名のリスト (例:[{code: "130000", name: "東京都"}, ...])
 */
export const getWeatherAreaCodes = (parentsObj: AreaTable, parentCode: string, childrenObj: AreaTable): RegionCodeName[] => {
  const childrenCodes = parentsObj[parentCode]?.children ?? [];
  return childrenCodes
    .filter((code) => childrenObj[code] != null)
    .map((code) => ({ code, name: childrenObj[code].name }));
};

/**
 * JSONから指定したアメダスの情報を取得する
 */
export const getAmedasInfo = (amedasObj: AmedasTable, code: string): AmedasInfo | null => {
  const info = amedasObj[code];
  if (info == null) return null;

  return {
    code,
    name: info.kjName,
    lat: info.lat[0] + info.lat[1] / 60,
    lon: info.lon[0] + info.lon[1] / 60,
    onlyTemp: info.elems.charAt(7) !== '1',
  };
};

/**
 * JSONから利用可能なアメダスの情報を取得する
 * @param amedasObj アメダス情報の元オブジェクト
 * @param allowTempOnly 気温のみ観測している地点を含めるか
 */
export const convertAmedasInfos = (amedasObj: AmedasTable, allowTempOnly: boolean = false): AmedasInfo[] =>
  Object.keys(amedasObj)
    // 気温のデータがないアメダスは除外する
    .filter((code) => amedasObj[code].elems.charAt(0) === '1')
    .map((code) => getAmedasInfo(amedasObj, code)!)
    // 気圧のデータがないアメダスは、許可されている場合のみ含める
    .filter((info) => allowTempOnly || !info.onlyTemp);
