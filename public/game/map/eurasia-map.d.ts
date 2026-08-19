// Types for eurasia-map.js; data registers via the ambient `jsVectorMap` global.

// Map data structure
declare const eurasiaMapData: {
  width: number;
  height: number;
  paths: {
    [countryCode: string]: {
      name: string;
      path: string;
    };
  };
};

export = eurasiaMapData;
