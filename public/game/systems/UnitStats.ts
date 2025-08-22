import { TerrainType } from '../types/types.js';

// Unit type constants
export enum UnitType {
  Cavalry = 0,
  Pike = 1,
  Sword = 2,
  Bow = 3
}

export type UnitTypeName = "cavalry" | "pike" | "sword" | "bow";

export type ValueType = "hitPoint" | "power" | "country";

// Interface for land rate modifiers
interface LandRateModifiers {
  [TerrainType.Plain]: number;
  [TerrainType.Forest]: number;
  [TerrainType.Grassland]: number;
  [TerrainType.Mountain]: number;
}

// Interface for the return value of getLandRate
type LandRate = [number, number]; // [hitPointRate, powerRate]

class UnitStats {
  // Constants
  public readonly globalHardRate: number = 0.6;
  public readonly levelUnit: number = 100;
  public readonly expUnit: number = 50;
  public readonly upDRate: number = 0.003;
  public readonly minRate: number = 0.05;

  // Unit costs and upgrade rates
  public readonly unitCost: number[] = [60, 25, 20, 25];
  public readonly unitCostUpgradeRate: number[] = [0.15, 0.18, 0.18, 0.2];

  // Unit type definitions
  public readonly roleTypes: UnitTypeName[] = ["cavalry", "pike", "sword", "bow"];
  public readonly hitPoints: number[] = [300, 200, 200, 100];
  public readonly hpUpgradeRates: number[] = [0.1, 0.15, 0.1, 0.15];
  public readonly power: number[] = [20, 12, 8, 10];
  public readonly powerUpRate: number[] = [0.15, 0.15, 0.15, 0.2];

  // Land rate modifiers for hit points
  private readonly cavalryRate: LandRateModifiers = {
    [TerrainType.Plain]: 0.1,
    [TerrainType.Forest]: -0.4,
    [TerrainType.Grassland]: 0.2,
    [TerrainType.Mountain]: -0.5
  };

  private readonly pikeRate: LandRateModifiers = {
    [TerrainType.Plain]: 0.15,
    [TerrainType.Forest]: -0.1,
    [TerrainType.Grassland]: 0.1,
    [TerrainType.Mountain]: 0.05
  };

  private readonly swordRate: LandRateModifiers = {
    [TerrainType.Plain]: -0.05,
    [TerrainType.Forest]: 0.05,
    [TerrainType.Grassland]: -0.1,
    [TerrainType.Mountain]: 0
  };

  private readonly bowRate: LandRateModifiers = {
    [TerrainType.Plain]: 0.2,
    [TerrainType.Forest]: -0.15,
    [TerrainType.Grassland]: 0.15,
    [TerrainType.Mountain]: 0
  };

  // Land rate modifiers for power
  private readonly cavalryPowerRate: LandRateModifiers = {
    [TerrainType.Plain]: 0.15,
    [TerrainType.Forest]: -0.4,
    [TerrainType.Grassland]: 0.3,
    [TerrainType.Mountain]: -0.4
  };

  private readonly pikePowerRate: LandRateModifiers = {
    [TerrainType.Plain]: 0.2,
    [TerrainType.Forest]: -0.3,
    [TerrainType.Grassland]: 0.1,
    [TerrainType.Mountain]: 0.05
  };

  private readonly swordPowerRate: LandRateModifiers = {
    [TerrainType.Plain]: -0.05,
    [TerrainType.Forest]: 0.05,
    [TerrainType.Grassland]: -0.1,
    [TerrainType.Mountain]: 0
  };

  private readonly bowPowerRate: LandRateModifiers = {
    [TerrainType.Plain]: 0.1,
    [TerrainType.Forest]: -0.25,
    [TerrainType.Grassland]: 0.2,
    [TerrainType.Mountain]: -0.2
  };

  constructor() {
    // Constructor is now empty since all properties are initialized above
  }

  public getMaxHitPoints(level: number, typeId: number, landType: TerrainType): number {
    const baseNum: number = this.hitPoints[typeId];
    const rate: number = this.hpUpgradeRates[typeId];
    return this.getUpgradeNum("hitPoint", baseNum, rate, level, typeId, landType);
  }

  public getUnitPower(level: number, typeId: number, landType: TerrainType): number {
    const baseNum: number = this.power[typeId];
    const rate: number = this.powerUpRate[typeId];
    return this.getUpgradeNum("power", baseNum, rate, level, typeId, landType);
  }

  public getCountryPower(baseNum: number, rate: number, level: number): number {
    return this.getUpgradeNum("country", baseNum, rate, level, 0, TerrainType.Plain);
  }

  private getUpgradeNum(
    valueType: ValueType,
    baseNum: number,
    rate: number,
    level: number,
    typeId: number,
    landType: TerrainType
  ): number {
    if (valueType !== "country") {
      const roleType: UnitTypeName = this.roleTypes[typeId];
      const landRates: LandRate = this.getLandRate(roleType, landType);

      if (valueType === "power") {
        baseNum = baseNum + (landRates[1] * baseNum);
      } else if (valueType === "hitPoint") {
        baseNum = baseNum + (landRates[0] * baseNum);
      }
    }

    const newLevel: number = level * this.levelUnit / this.expUnit;
    let upgradeNum: number = baseNum;
    
    for (let i = 0; i < newLevel; i++) {
      upgradeNum = Math.floor(upgradeNum * (1 + this.getUpgradeRate(rate, newLevel)));
    }
    
    return upgradeNum;
  }

  private getUpgradeRate(rate: number, level: number): number {
    let newRate: number = rate;
    newRate = newRate * 1.5;
    newRate = newRate - (this.upDRate * level);
    
    if (newRate < this.minRate) {
      newRate = this.minRate;
    }
    
    return newRate;
  }

  // Return attack rate and power rate of the unit on land type
  private getLandRate(unitType: UnitTypeName, landType: TerrainType): LandRate {
    let rate1: number, rate2: number;
    
    switch (unitType) {
      case "cavalry":
        rate1 = this.cavalryRate[landType];
        rate2 = this.cavalryPowerRate[landType];
        break;
      case "pike":
        rate1 = this.pikeRate[landType];
        rate2 = this.pikePowerRate[landType];
        break;
      case "sword":
        rate1 = this.swordRate[landType];
        rate2 = this.swordPowerRate[landType];
        break;
      case "bow":
        rate1 = this.bowRate[landType];
        rate2 = this.bowPowerRate[landType];
        break;
      default:
        rate1 = 0;
        rate2 = 0;
        break;
    }
    
    return [rate1, rate2];
  }
}

export { UnitStats };
