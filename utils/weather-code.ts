import { LatLngBounds } from "leaflet";

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

/**
 * アメダスの情報
 */
export class amedasInfo {
  code: string;
  name: string;
  lat: number;
  lon: number;

  constructor(code: string, name: string, lat: number, lon: number) {
    this.code = code;
    this.name = name;
    this.lat = lat;
    this.lon = lon;
  }
}

/**
 * JSONからアメダスの情報を取得する
 * @param amedasObj アメダス情報の元オブジェクト (例:amedas)
 * @returns アメダス情報のリスト (例:[{code: "110000", name: "千代田区", lat: 35.693333333333335, lon: 139.7536111111111}, ...])
 */
export function convertAmedasInfos(amedasObj:any) {
  const amedasInfos: Array<amedasInfo> = [];
  Object.keys(amedasObj).forEach((key) => {
    const info = amedasObj[key];

    // 気温と気圧のデータがないアメダスは除外する
    if (info["elems"].charAt(0) !== "1" && info["elems"].charAt(7) !== "1") return;

    amedasInfos.push(new amedasInfo(key,
      info["kjName"],
      info["lat"][0] + (info["lat"][1] / 60),
      info["lon"][0] + (info["lon"][1] / 60)
    ));
  });
  return amedasInfos;
}

/**
 * 指定されたエリア内のアメダスを取得する
 * @param amedasInfos 全アメダス情報のリスト
 * @param bounds エリアの境界
 * @returns エリア内のアメダス情報のリスト
 */
export function filterByMapArea(amedasInfos: Array<amedasInfo> ,bounds: LatLngBounds) {
  return amedasInfos.filter((value: amedasInfo) => {
    if (bounds.contains([value.lat, value.lon])) {
      return value;
    }
  });
}