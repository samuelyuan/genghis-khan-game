import { IMapRenderer } from '../../interfaces/IMapRenderer.js';
import { JsVectorMapAdapter } from '../adapters/JsVectorMapAdapter.js';
import { MockMapAdapter } from '../adapters/MockMapAdapter.js';

export enum MapRendererType {
  JS_VECTOR_MAP = 'js_vector_map',
  MOCK = 'mock'
}

export class MapRendererFactory {
  static createMapRenderer(type: MapRendererType, container: JQuery): IMapRenderer {
    switch (type) {
      case MapRendererType.JS_VECTOR_MAP:
        return new JsVectorMapAdapter(container);
      case MapRendererType.MOCK:
        return new MockMapAdapter();
      default:
        throw new Error(`Unknown map renderer type: ${type}`);
    }
  }

  static createDefaultMapRenderer(container: JQuery): IMapRenderer {
    return this.createMapRenderer(MapRendererType.JS_VECTOR_MAP, container);
  }
}
