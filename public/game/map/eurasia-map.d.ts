// Type declarations for eurasia-map.js and jQuery vectorMap plugin

declare global {
  interface JQuery {
    vectorMap(options: any): JQuery;
  }
  
  interface JQueryStatic {
    fn: {
      vectorMap: {
        addMap: (mapName: string, mapData: any) => void;
      };
    };
  }
}

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
