// jsvectormap loads as a global <script> (views/index.ejs); no published
// types exist, so this declares only the surface this codebase uses.
declare global {
  interface JsVectorMapData {
    width: number;
    height: number;
    paths: Record<string, { name: string; path: string }>;
  }

  interface JsVectorMapRegion {
    config: { name: string; path: string };
    element: { shape: { setStyle(property: string, value: unknown): void } };
  }

  interface JsVectorMapInstance {
    regions: Record<string, JsVectorMapRegion>;
    destroy(destroyInstance?: boolean): void;
  }

  interface JsVectorMapOptions {
    selector: Element;
    map: string;
    backgroundColor?: string;
    regionStyle?: { initial?: Record<string, unknown> };
    markerStyle?: { initial?: Record<string, unknown> };
    markers?: ReadonlyArray<{ coords: readonly [number, number]; name: string }>;
    onRegionClick?(event: Event, code: string): void;
  }

  const jsVectorMap: {
    new (options: JsVectorMapOptions): JsVectorMapInstance;
    addMap(name: string, data: JsVectorMapData): void;
  };
}

export {};
