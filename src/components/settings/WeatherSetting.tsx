import type { FeatureCollection } from 'geojson';
import { Map as MapLibreMap, NavigationControl, Popup, type GeoJSONSource } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef, useState } from 'react';
import { refreshWeather } from '../../services/weather.ts';
import { getSettings, updateSettings, useSettings } from '../../store/settings.ts';
import { convertAmedasInfos, getAmedasInfo, getWeatherAreaCodes, type AmedasInfo, type AmedasTable, type AreaTable } from '../../utils/weather-code.ts';

/** 気象庁から取得する地域/アメダスの一覧 */
type WeatherTables = {
  centers: AreaTable;
  offices: AreaTable;
  class10s: AreaTable;
  amedas: AmedasTable;
};

/** アメダスの地点を表示し始めるズームレベル */
const kMarkerMinZoom = 7;

const kAmedasSource = 'amedas';

/** アメダスの一覧をGeoJSONに変換する */
const toGeoJSON = (infos: AmedasInfo[], selectedCode: string): FeatureCollection => ({
  type: 'FeatureCollection',
  features: infos.map((info) => ({
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [info.lon, info.lat] },
    properties: { code: info.code, name: info.name, onlyTemp: info.onlyTemp, selected: info.code === selectedCode },
  })),
});

/** アメダスの地点を設定し、天気を更新する */
const setAmedasLocation = (code: string, name: string) => {
  updateSettings('weather', { amedasCode: code, amedasName: name });
  refreshWeather();
};

/** 地点をクリックしたときのポップアップの中身を作成する */
const createPopupContent = (info: Pick<AmedasInfo, 'code' | 'name' | 'onlyTemp'>, onSet: () => void) => {
  const root = document.createElement('div');
  root.className = 'text-black text-center';

  const text = document.createElement('p');
  text.className = 'mb-1';
  text.append(info.name, document.createElement('br'), info.onlyTemp ? '(外気温のみ)' : '(気温/気圧)');

  const button = document.createElement('button');
  button.className = 'btn btn-xs';
  button.textContent = '設定';
  button.addEventListener('click', () => {
    setAmedasLocation(info.code, `${info.name} ${info.onlyTemp ? '(外気温のみ)' : ''}`.trim());
    onSet();
  });

  root.append(text, button);
  return root;
};

/** アメダスの地点を選択する地図 */
const AmedasMap = ({ amedas }: { amedas: AmedasTable }) => {
  const { onlyTemp, amedasCode } = useSettings((s) => s.weather);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  // さらなるズームが必要か
  const [needMoreZoom, setNeedMoreZoom] = useState(true);

  // 地図を作成
  useEffect(() => {
    if (containerRef.current == null) return;

    const map = new MapLibreMap({
      container: containerRef.current,
      center: [137.2736, 32.59285],
      zoom: 3,
      maxZoom: 16,
      style: {
        version: 8,
        sources: {
          gsi: {
            type: 'raster',
            tiles: ['https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png'],
            tileSize: 256,
            maxzoom: 18,
            attribution: "<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>",
          },
        },
        layers: [{ id: 'gsi', type: 'raster', source: 'gsi' }],
      },
    });
    mapRef.current = map;

    map.addControl(new NavigationControl({ showCompass: false }));
    // 回転は不要なので無効化
    map.dragRotate.disable();
    map.touchZoomRotate.disableRotation();

    map.on('load', () => {
      const weather = getSettings().weather;
      map.addSource(kAmedasSource, {
        type: 'geojson',
        data: toGeoJSON(convertAmedasInfos(amedas, weather.onlyTemp), weather.amedasCode),
      });
      map.addLayer({
        id: kAmedasSource,
        type: 'circle',
        source: kAmedasSource,
        minzoom: kMarkerMinZoom,
        paint: {
          'circle-radius': 8,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
          // 選択中: 赤 / 外気温のみ: 橙 / 気温と気圧: 青
          'circle-color': ['case', ['get', 'selected'], '#dc2626', ['get', 'onlyTemp'], '#d97706', '#1e40af'],
        },
      });
    });

    map.on('zoom', () => setNeedMoreZoom(map.getZoom() < kMarkerMinZoom));

    // 地点をクリックしたらポップアップを表示
    map.on('click', kAmedasSource, (e) => {
      const feature = e.features?.[0];
      if (feature == null || feature.geometry.type !== 'Point') return;

      const props = feature.properties as { code: string; name: string; onlyTemp: boolean };
      const popup = new Popup({ closeButton: false });
      popup
        .setLngLat(feature.geometry.coordinates as [number, number])
        .setDOMContent(createPopupContent(props, () => popup.remove()))
        .addTo(map);
    });
    map.on('mouseenter', kAmedasSource, () => (map.getCanvas().style.cursor = 'pointer'));
    map.on('mouseleave', kAmedasSource, () => (map.getCanvas().style.cursor = ''));

    return () => {
      mapRef.current = null;
      map.remove();
    };
  }, [amedas]);

  // 設定が変わったら、表示する地点を更新
  useEffect(() => {
    const source = mapRef.current?.getSource<GeoJSONSource>(kAmedasSource);
    source?.setData(toGeoJSON(convertAmedasInfos(amedas, onlyTemp), amedasCode));
  }, [amedas, onlyTemp, amedasCode]);

  return (
    <div className="min-w-full">
      <p className="text-error font-bold min-h-6">{needMoreZoom ? '地点を表示するには、もう少しズームしてください。' : ''}</p>
      <div ref={containerRef} className="w-full h-[400px] rounded-box overflow-hidden"></div>
    </div>
  );
};

/** 天気予報の地域と、アメダスの地点の設定 */
export const WeatherSetting = () => {
  const weather = useSettings((s) => s.weather);
  // 気象庁から取得した地域/アメダスの一覧 (読み込み中はnull、失敗時は'error')
  const [tables, setTables] = useState<WeatherTables | 'error' | null>(null);

  useEffect(() => {
    let cancelled = false;

    // エリア情報を取得
    Promise.all([
      fetch('https://www.jma.go.jp/bosai/common/const/area.json').then((res) => res.json()),
      fetch('https://www.jma.go.jp/bosai/amedas/const/amedastable.json').then((res) => res.json()),
    ])
      .then(([areas, amedas]) => {
        if (!cancelled) setTables({ centers: areas.centers, offices: areas.offices, class10s: areas.class10s, amedas });
      })
      .catch((e) => {
        console.error(e);
        if (!cancelled) setTables('error');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const loaded = tables != null && tables !== 'error';

  // 広域地方/地方/地域の選択肢
  const wideRegionOptions = loaded ? Object.entries(tables.centers).map(([code, value]) => ({ code, name: value.name })) : [];
  const localRegionOptions = loaded ? getWeatherAreaCodes(tables.centers, weather.wideRegion, tables.offices) : [];
  const regionOptions = loaded ? getWeatherAreaCodes(tables.offices, weather.office, tables.class10s) : [];

  // 現在の地点が、外気温のみ取得可能な地点か
  const selectedOnlyTemp = loaded ? (getAmedasInfo(tables.amedas, weather.amedasCode)?.onlyTemp ?? false) : false;

  /** 広域地方の変更 (配下の先頭の地方/地域を選択する) */
  const onWideRegionChange = (wideRegion: string) => {
    if (!loaded) return;
    const office = getWeatherAreaCodes(tables.centers, wideRegion, tables.offices)[0]?.code ?? '';
    const area = getWeatherAreaCodes(tables.offices, office, tables.class10s)[0]?.code ?? '';

    updateSettings('weather', { wideRegion, office, area });
    refreshWeather();
  };

  /** 地方の変更 (配下の先頭の地域を選択する) */
  const onOfficeChange = (office: string) => {
    if (!loaded) return;
    const area = getWeatherAreaCodes(tables.offices, office, tables.class10s)[0]?.code ?? '';

    updateSettings('weather', { office, area });
    refreshWeather();
  };

  /** 地域の変更 */
  const onAreaChange = (area: string) => {
    updateSettings('weather', { area });
    refreshWeather();
  };

  /** 外気温のみ利用するかの変更 */
  const onOnlyTempChange = (onlyTemp: boolean) => {
    updateSettings('weather', { onlyTemp });
    refreshWeather();
  };

  return (
    <>
      <h3 className="font-bold text-lg">天気設定</h3>

      <div className="divider"></div>

      <h3 className="font-bold text-lg">予報の地域設定</h3>
      {tables === 'error' && <p className="text-error font-bold">地域情報を取得できませんでした。オフラインの可能性があります。</p>}
      <div className="my-3">
        <label className="setting-row">
          <span className="mx-auto">広域地方</span>
          <select className="select max-w-52 md:max-w-xs" value={weather.wideRegion} onChange={(e) => onWideRegionChange(e.target.value)} disabled={!loaded}>
            {!loaded && <option value={weather.wideRegion}>読み込み中...</option>}
            {wideRegionOptions.map((region) => (
              <option key={region.code} value={region.code}>
                {region.name}
              </option>
            ))}
          </select>
        </label>

        <label className="setting-row">
          <span className="mx-auto text-center">
            都道府県
            <br />
            地方
          </span>
          <select className="select max-w-52 md:max-w-xs" value={weather.office} onChange={(e) => onOfficeChange(e.target.value)} disabled={!loaded}>
            {!loaded && <option value={weather.office}>読み込み中...</option>}
            {localRegionOptions.map((region) => (
              <option key={region.code} value={region.code}>
                {region.name}
              </option>
            ))}
          </select>
        </label>

        <label className="setting-row">
          <span className="mx-auto">地域</span>
          <select className="select max-w-52 md:max-w-xs" value={weather.area} onChange={(e) => onAreaChange(e.target.value)} disabled={!loaded}>
            {!loaded && <option value={weather.area}>読み込み中...</option>}
            {regionOptions.map((region) => (
              <option key={region.code} value={region.code}>
                {region.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="divider"></div>

      <h3 className="font-bold text-lg">アメダスの地点設定</h3>
      {loaded ? (
        <div className="my-3">
          <div className="setting-row">
            <span>現在の設定地点</span>
            <span className="font-bold">{weather.amedasName}</span>
          </div>
          <label className="setting-row">
            <span>
              外気温情報のみ利用する
              <br />
              (気圧は表示されなくなります)
            </span>
            <div
              className="tooltip tooltip-left"
              data-tip={
                selectedOnlyTemp
                  ? 'アメダスの気圧を使用するには、気圧情報を取得できる地点に変更してください。'
                  : '有効にすると、気温のみ取得可能な地点も表示されます。'
              }
            >
              <input
                type="checkbox"
                className="toggle toggle-secondary"
                disabled={selectedOnlyTemp}
                checked={weather.onlyTemp}
                onChange={(e) => onOnlyTempChange(e.target.checked)}
              />
            </div>
          </label>

          <AmedasMap amedas={tables.amedas} />
        </div>
      ) : (
        <div className="skeleton w-full h-96 my-3"></div>
      )}
    </>
  );
};
