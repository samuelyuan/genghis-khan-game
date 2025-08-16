// Game Data Types
export interface Country {
  isConquered: boolean;
  armyPower: ArmyPower;
  land: TerrainType;
  country: string;
  neighbor: string[];
}

export interface ArmyPower {
  power: number;
  numSoldiers: number;
  shape: FormationUnit[];
  level: number[];
}

export interface FormationUnit {
  typeId: number;
  x: number;
  y: number;
}

export enum TerrainType {
  Plain = "Plain",
  Mountain = "Mountain",
  Forest = "Forest",
  Grassland = "Grassland"
}

// Unit Types
export interface UnitData {
  xPos: number;
  yPos: number;
  typeId: number;
  level: number;
  unitPower: number;
  maxHitPoints: number;
  worldY: number;
  tileRow: number;
}

export interface Soldier {
  xPos: number;
  yPos: number;
  rotation: number;
  speedTimes: number;
  typeId: number;
  currentLevel: number;
  maxLevel: number;
  expRate: number;
  experiencePerLevel: number;
  experience: number;
  expStep: number;
  expUnit: number;
  power: number;
  cost: number;
  goldRate: number;
  goldStep: number;
  maxHitPoints: number;
  hitPoints: number;
  isDead: boolean;
  sState: string;
  F: Vector;
  standDist: number;
  hitDist: number;
  rangeOffset: number;
  topBorder: number;
  bottomBorder: number;
  // Additional properties found by TypeScript
  unitBeingAttackedBy: any | null;
  rivalCastleXLine: number;
  initv: Vector;
  v: Vector;
  sFamily: string; // "player" or "enemy"
  aim: any; // Will be refined later
  rivalCastle: any; // Will be refined later
  // Additional properties used in Soldier.js
  stAttackCastle: (position: number) => void;
  loseHitPoints: (power: number) => void;
  setState: (state: string) => void;
  setExp: (exp: number) => void;
  addExp: (exp: number) => void;
  runFrame: (rivalUnits: Soldier[]) => void;
  setFighting: (isBattleStarted: boolean) => void;
}

export interface Vector {
  x: number;
  y: number;
  getAngle(): number;
  clone(): Vector;
}

// Battle System Types
export interface BattleState {
  isActive: boolean;
  currentCountry: Country | null;
  enemyCountry: Country | null;
  playerUnits: Soldier[];
  enemyUnits: Soldier[];
}

// Game State Types
export interface GameState {
  gold: number;
  selectedCountry: Country | null;
  conqueredCountries: string[];
  currentTurn: number;
}

// Utility Types
export type Coordinate = [number, number];
export type CountryName = string;
