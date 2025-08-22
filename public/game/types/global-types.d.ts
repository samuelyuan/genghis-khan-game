// Global type declarations to fix remaining TypeScript errors

// Declare jvm namespace for the map library
declare namespace jvm {
  class Map {
    constructor(options: any);
  }
}

// Extend HTMLCanvasElement to include getContext
declare global {
  interface HTMLCanvasElement {
    getContext(contextId: "2d"): CanvasRenderingContext2D | null;
  }
}

// Extend jQuery to include modal method
declare global {
  interface JQuery {
    modal(action?: string): JQuery;
  }
}

// Declare missing properties for Soldier class
declare module "./types" {
  interface Soldier {
    sFamily: string;
    rivalCastleXLine: number;
    initv: Vector;
    v: Vector;
    unitBeingAttackedBy: any | null;
  }
}

export {};

