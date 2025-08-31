import { IMapRenderer } from '../../interfaces/IMapRenderer.js';
import { JVectorMapAdapter } from '../adapters/JVectorMapAdapter.js';
import { MockMapAdapter } from '../adapters/MockMapAdapter.js';

export enum MapRendererType {
  JVECTOR_MAP = 'jvector_map',
  MOCK = 'mock'
}

export class MapRendererFactory {
  static createMapRenderer(type: MapRendererType, container: JQuery): IMapRenderer {
    switch (type) {
      case MapRendererType.JVECTOR_MAP:
        return new JVectorMapAdapter(container);
      case MapRendererType.MOCK:
        return new MockMapAdapter();
      default:
        throw new Error(`Unknown map renderer type: ${type}`);
    }
  }

  static createDefaultMapRenderer(container: JQuery): IMapRenderer {
    return this.createMapRenderer(MapRendererType.JVECTOR_MAP, container);
  }
}
