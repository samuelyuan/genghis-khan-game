// Type declarations for eurasia-map.js, which registers its data via the
// ambient `jsVectorMap` global declared in ../types/jsvectormap-global.d.ts.

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
