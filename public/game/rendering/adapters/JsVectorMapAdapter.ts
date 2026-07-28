import { IMapRenderer } from '../../interfaces/IMapRenderer.js';
import { MAP_CONFIG } from '../../config/MapConfig.js';

export class JsVectorMapAdapter implements IMapRenderer {
  private map: JsVectorMapInstance | null = null;
  private container: JQuery;
  private onRegionClickCallback?: (code: string) => void;

  constructor(container: JQuery) {
    this.container = container;
  }

  buildMap(countryData: any[]): void {
    this.map = new jsVectorMap({
      selector: this.container[0],
      map: MAP_CONFIG.MAP_DATA,
      regionStyle: {
        initial: MAP_CONFIG.STYLES.REGION.INITIAL
      },
      markerStyle: {
        initial: MAP_CONFIG.STYLES.MARKER.INITIAL
      },
      markers: MAP_CONFIG.MARKERS,
      onRegionClick: (event: Event, code: string) => {
        if (this.onRegionClickCallback) {
          this.onRegionClickCallback(code);
        }
      }
    });
  }

  updateColors(colors: Record<string, string>): void {
    if (!this.map) {
      return;
    }
    for (const code in colors) {
      const region = this.map.regions[code];
      if (region) {
        region.element.shape.setStyle('fill', colors[code]);
      }
    }
  }

  onRegionClick(callback: (code: string) => void): void {
    this.onRegionClickCallback = callback;
  }

  destroy(): void {
    if (this.map) {
      this.map.destroy();
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
