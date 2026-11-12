import type { FeatureCollection } from 'geojson';
import { setWorkerUrl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';
import { useEffect, useMemo, useState } from 'react';
import { Layer, Map as MapView, NavigationControl, Popup, Source, type LayerProps, type MapLayerMouseEvent } from 'react-map-gl/maplibre';
import { refreshWeather } from '../../services/weather.ts';
import { updateSettings, useSettings } from '../../store/settings.ts';
import { convertAmedasInfos, getAmedasInfo, getWeatherAreaCodes, type AmedasInfo, type AmedasTable, type AreaTable } from '../../utils/weather-code.ts';

// MapLibreのworkerを、Viteが配信するURLから読み込むようにする (開発サーバーの事前バンドルでは自動解決できないため)
setWorkerUrl(maplibreWorkerUrl);

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

/** 地図上の地点の情報 */
type AmedasPoint = Pick<AmedasInfo, 'code' | 'name' | 'onlyTemp' | 'lon' | 'lat'>;

/** アメダスの地点のレイヤー */
const kAmedasLayer: LayerProps = {
  id: kAmedasSource,
  type: 'circle',
  minzoom: kMarkerMinZoom,
  paint: {
    'circle-radius': 8,
    'circle-stroke-width': 2,
    'circle-stroke-color': '#ffffff',
    // 選択中: 赤 / 外気温のみ: 橙 / 気温と気圧: 青
    'circle-color': ['case', ['get', 'selected'], '#dc2626', ['get', 'onlyTemp'], '#d97706', '#1e40af'],
  },
};

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

/** アメダスの地点を選択する地図 */
const AmedasMap = ({ amedas }: { amedas: AmedasTable }) => {
  const { onlyTemp, amedasCode } = useSettings((s) => s.weather);
  const [state, setState] = useState<{ needMoreZoom: boolean; hovering: boolean; popup: AmedasPoint | null }>({
    needMoreZoom: true,
    hovering: false,
    popup: null,
  });

  const data = useMemo(() => toGeoJSON(convertAmedasInfos(amedas, onlyTemp), amedasCode), [amedas, onlyTemp, amedasCode]);

  /** 地点をクリックしたらポップアップを表示 (地点以外なら閉じる) */
  const onClick = (e: MapLayerMouseEvent) => {
    const feature = e.features?.[0];
    if (feature == null || feature.geometry.type !== 'Point') {
      setState((prev) => ({ ...prev, popup: null }));
      return;
    }

    const props = feature.properties as Pick<AmedasInfo, 'code' | 'name' | 'onlyTemp'>;
    const [lon, lat] = feature.geometry.coordinates;
    setState((prev) => ({ ...prev, popup: { code: props.code, name: props.name, onlyTemp: props.onlyTemp, lon, lat } }));
  };

  const { popup } = state;

  return (
    <div className="min-w-full">
      <p className="text-error font-bold min-h-6">{state.needMoreZoom ? '地点を表示するには、もう少しズームしてください。' : ''}</p>
      <div className="rounded-box overflow-hidden">
        <MapView
          initialViewState={{ longitude: 138.9434, latitude: 38.2120, zoom: 4 }}
          minZoom={4}
          mapStyle="https://gsi-cyberjapan.github.io/gsivectortile-mapbox-gl-js/pale.json"
          style={{ width: '100%', height: 400 }}
          onLoad={(e) => e.target.touchZoomRotate.disableRotation()}
          interactiveLayerIds={[kAmedasSource]}
          cursor={state.hovering ? 'pointer' : ''}
          onMouseEnter={() => setState((prev) => ({ ...prev, hovering: true }))}
          onMouseLeave={() => setState((prev) => ({ ...prev, hovering: false }))}
          onZoom={(e) => {
            const needMoreZoom = e.viewState.zoom < kMarkerMinZoom;
            setState((prev) => (prev.needMoreZoom === needMoreZoom ? prev : { ...prev, needMoreZoom }));
          }}
          onClick={onClick}
        >
          <NavigationControl showCompass={false} />
          <Source id={kAmedasSource} type="geojson" data={data}>
            <Layer {...kAmedasLayer} />
          </Source>
          {popup != null && (
            <Popup
              longitude={popup.lon}
              latitude={popup.lat}
              closeButton={false}
              closeOnClick={false}
              onClose={() => setState((prev) => ({ ...prev, popup: null }))}
            >
              <div className="text-black text-center">
                <p className="mb-1">
                  {popup.name}
                  <br />
                  {popup.onlyTemp ? '(外気温のみ)' : '(気温/気圧)'}
                </p>
                <button
                  className="btn btn-xs"
                  onClick={() => {
                    setAmedasLocation(popup.code, `${popup.name} ${popup.onlyTemp ? '(外気温のみ)' : ''}`.trim());
                    setState((prev) => ({ ...prev, popup: null }));
                  }}
                >
                  設定
                </button>
              </div>
            </Popup>
          )}
        </MapView>
      </div>
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
