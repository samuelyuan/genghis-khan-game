import { IMapRenderer } from '../../interfaces/IMapRenderer.js';
import { MAP_CONFIG } from '../../config/MapConfig.js';

// Declare jVectorMap namespace
declare namespace jvm {
  class Map {
    constructor(options: any);
    series: {
      regions: Array<{
        setValues: (values: any) => void;
      }>;
    };
  }
}

export class JVectorMapAdapter implements IMapRenderer {
  private map: jvm.Map | null = null;
  private container: JQuery;
  private onRegionClickCallback?: (code: string) => void;

  constructor(container: JQuery) {
    this.container = container;
  }

  buildMap(countryData: any[]): void {
    this.map = new jvm.Map({
      map: MAP_CONFIG.MAP_DATA,
      container: this.container,
      series: {
        regions: [{
          attribute: 'fill',
          stroke: MAP_CONFIG.COLORS.BORDER,
          "stroke-width": 1
        }]
      },
      regionStyle: {
        initial: MAP_CONFIG.STYLES.REGION.INITIAL
      },
      markerStyle: {
        initial: MAP_CONFIG.STYLES.MARKER.INITIAL
      },
      markers: MAP_CONFIG.MARKERS,
      onRegionClick: (event: any, code: string) => {
        if (this.onRegionClickCallback) {
          this.onRegionClickCallback(code);
        }
      }
    });
  }

  updateColors(colors: Record<string, string>): void {
    if (this.map) {
      this.map.series.regions[0].setValues(colors);
    }
  }

  onRegionClick(callback: (code: string) => void): void {
    this.onRegionClickCallback = callback;
  }

  destroy(): void {
    if (this.map) {
      // jVectorMap doesn't have a built-in destroy method, but we can clean up
      this.map = null;
      this.onRegionClickCallback = undefined;
    }
  }

  show(): void {
    this.container.show();
  }

  hide(): void {
    this.container.hide();
  }
}
