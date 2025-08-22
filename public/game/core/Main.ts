import { WorldMapRender } from '../rendering/WorldMapRender.js';
import { MapCountries } from './MapCountries.js';

// jQuery ready function with proper typing
$(function(): void {
  const mapCountries: MapCountries = new MapCountries();
  const mapRender: WorldMapRender = new WorldMapRender(mapCountries.countries);
  mapRender.updateMapColors();
});
