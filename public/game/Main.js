import { WorldMapRender } from './WorldMapRender.js';
import { MapCountries } from './MapCountries.js'

$(function(){
  var mapCountries = new MapCountries();
  var mapRender = new WorldMapRender(mapCountries.countries);
  mapRender.updateMapColors();
});
