// Import Soldier class for type definitions
import { Soldier } from '../entities/Soldier.js';

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

// Unit States
export type UnitState = "stand" | "walk" | "attack";

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
