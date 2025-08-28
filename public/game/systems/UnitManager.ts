import { TerrainType, FormationUnit, Soldier as ISoldier } from '../types/types.js';
import { UnitStats } from './UnitStats.js';
import { SoldierFactory } from './SoldierFactory.js';
import { Castle } from '../entities/Castle.js';
import { BATTLE_CONSTANTS, UNIT_CONSTANTS } from '../constants/GameConstants.js';

// Interface for tile objects
interface Tile {
  x: number;
  y: number;
  centerX: number;
  centerY: number;
  isSet: boolean;
  typeId: number | null;
  role: string | null;
}

// Interface for grid location
interface GridLocation {
  gridX: number;
  gridY: number;
}

// Interface for map data
interface MapData {
  landType: TerrainType;
  playerCastle: Castle;
  enemyCastle: Castle;
}

// Interface for tile object used in unit creation
interface TileObject {
  centerX: number;
  centerY: number;
}

export class UnitManager {

  constructor(
    private unitStats: UnitStats,
    private soldierFactory: SoldierFactory,
    private landType: TerrainType | null,
    private playerCastle: Castle | null,
    private enemyCastle: Castle | null
  ) {}

  public placeNewPlayerUnit(
    canvas: HTMLCanvasElement, 
    event: MouseEvent, 
    isBattleStarted: boolean,
    playerUnits: ISoldier[],
    occupiedPlayerSquares: string[]
  ): { unit: ISoldier | null; gridKey: string | null } {
    // Don't let player place new units during a battle
    if (isBattleStarted) {
      return { unit: null, gridKey: null };
    }

    const rect: DOMRect = canvas.getBoundingClientRect();
    const mouseX: number = event.clientX - rect.left;
    const mouseY: number = event.clientY - rect.top;

    const gridX: number = Math.floor((mouseX - BATTLE_CONSTANTS.WORLD_X) / BATTLE_CONSTANTS.TILE_WIDTH);
    const gridY: number = Math.floor((mouseY - BATTLE_CONSTANTS.WORLD_Y) / BATTLE_CONSTANTS.TILE_WIDTH);

    // Check if there's a unit at this position first
    const existingUnit = this.findUnitAtPosition(gridX, gridY, playerUnits);
    if (existingUnit) {
      // Return existing unit to show stats modal
      return { unit: existingUnit, gridKey: null };
    }

    const key: string = this.getGridKey(gridX, gridY);
    if (occupiedPlayerSquares.includes(key)) {
      // This shouldn't happen now since we check for units first, but keeping as fallback
      return { unit: null, gridKey: null };
    }
    
    if (gridX < 0 || gridX >= BATTLE_CONSTANTS.TILE_COLUMN) {
      return { unit: null, gridKey: null };
    }
    if (gridY < 0 || gridY >= BATTLE_CONSTANTS.TILE_ROW) {
      return { unit: null, gridKey: null };
    }

    const tileObj: TileObject = {
      centerX: (gridX * BATTLE_CONSTANTS.TILE_WIDTH) + BATTLE_CONSTANTS.WORLD_X,
      centerY: (gridY * BATTLE_CONSTANTS.TILE_WIDTH) + BATTLE_CONSTANTS.WORLD_Y
    };
    
    const typeId: number = 1;
    const playerLevel: number = 0;
    const mapData: MapData = {
      landType: this.landType!,
      playerCastle: this.playerCastle!,
      enemyCastle: this.enemyCastle!
    };
    
    const playerUnit: ISoldier = this.soldierFactory.createPlayerUnit(tileObj, typeId, playerLevel, mapData);
    return { unit: playerUnit, gridKey: key };
  }

  public sellUnit(
    unit: ISoldier, 
    playerUnits: ISoldier[], 
    occupiedPlayerSquares: string[]
  ): { sellValue: number; updatedPlayerUnits: ISoldier[]; updatedOccupiedSquares: string[] } {
    const sellValue = Math.floor(this.unitStats.unitCost[unit.typeId] * 0.75);
    
    // Remove unit from occupied squares
    const unitGridX = Math.floor((unit.xPos - BATTLE_CONSTANTS.WORLD_X) / BATTLE_CONSTANTS.TILE_WIDTH);
    const unitGridY = Math.floor((unit.yPos - BATTLE_CONSTANTS.WORLD_Y) / BATTLE_CONSTANTS.TILE_WIDTH);
    const key = this.getGridKey(unitGridX, unitGridY);
    
    const updatedOccupiedSquares = [...occupiedPlayerSquares];
    const index = updatedOccupiedSquares.indexOf(key);
    if (index > -1) {
      updatedOccupiedSquares.splice(index, 1);
    }
    
    // Remove unit from player units
    const updatedPlayerUnits = [...playerUnits];
    const unitIndex = updatedPlayerUnits.indexOf(unit);
    if (unitIndex > -1) {
      updatedPlayerUnits.splice(unitIndex, 1);
    }
    
    return { sellValue, updatedPlayerUnits, updatedOccupiedSquares };
  }

  public upgradeUnit(unit: ISoldier): void {
    // Increase level by 1
    unit.addExp(unit.expUnit);
    
    // Get the new level stats and actually apply them to the unit
    const nextLevel = unit.currentLevel;
    const newMaxHp = this.unitStats.getMaxHitPoints(nextLevel, unit.typeId, this.landType!);
    const newPower = this.unitStats.getUnitPower(nextLevel, unit.typeId, this.landType!);
    
    // Update the unit's actual stats
    unit.maxHitPoints = newMaxHp;
    unit.hitPoints = newMaxHp; // Heal to full when upgrading
    unit.power = newPower;
  }

  public findUnitAtPosition(x: number, y: number, playerUnits: ISoldier[]): ISoldier | null {
    for (let i = 0; i < playerUnits.length; i++) {
      const unit = playerUnits[i];
      const unitGridX = Math.floor((unit.xPos - BATTLE_CONSTANTS.WORLD_X) / BATTLE_CONSTANTS.TILE_WIDTH);
      const unitGridY = Math.floor((unit.yPos - BATTLE_CONSTANTS.WORLD_Y) / BATTLE_CONSTANTS.TILE_WIDTH);
      
      if (unitGridX === x && unitGridY === y) {
        return unit;
      }
    }
    return null;
  }

  public getUnitStats(unit: ISoldier): any {
    return {
      cost: this.unitStats.unitCost[unit.typeId],
      type: UNIT_CONSTANTS.UNIT_TYPE_NAMES[unit.typeId],
      typeAbbr: UNIT_CONSTANTS.UNIT_TYPE_ABBR[unit.typeId],
      level: unit.currentLevel,
      power: unit.power,
      hp: unit.hitPoints,
      maxHp: unit.maxHitPoints,
      exp: unit.experience,
      expPerLevel: unit.expUnit
    };
  }

  public getUpgradePreview(unit: ISoldier): any {
    const nextLevel = unit.currentLevel + 1;

    const baseCost = this.unitStats.unitCost[unit.typeId];
    const upgradeRate = this.unitStats.unitCostUpgradeRate[unit.typeId];
    const upgradeCost = Math.floor(baseCost * upgradeRate);
    
    // Calculate next level stats using UnitStats methods
    const nextLevelMaxHp = this.unitStats.getMaxHitPoints(nextLevel, unit.typeId, this.landType!);
    const nextLevelPower = this.unitStats.getUnitPower(nextLevel, unit.typeId, this.landType!);
    
    // Calculate experience required for next level (total experience, not just the increment)
    const nextLevelExp = unit.experience + unit.expUnit;
    
    return {
      cost: upgradeCost,
      level: nextLevel,
      power: nextLevelPower,
      hp: nextLevelMaxHp,
      exp: nextLevelExp
    };
  }

  public findNextEmptyGridLocation(occupiedPlayerSquares: string[]): GridLocation | null {
    for (let gridX = BATTLE_CONSTANTS.TILE_COLUMN - 1; gridX >= 0; gridX--) {
      for (let gridY = 0; gridY < BATTLE_CONSTANTS.TILE_ROW; gridY++) {
        const key: string = this.getGridKey(gridX, gridY);
        if (!occupiedPlayerSquares.includes(key)) {
          return {
            gridX: gridX,
            gridY: gridY
          };
        }
      }
    }
    return null;
  }

  private getGridKey(gridX: number, gridY: number): string {
    return gridX + "," + gridY;
  }

  public canAffordUpgrade(upgradeCost: number, playerGold: number): boolean {
    return playerGold >= upgradeCost;
  }

  public updateUnitPositions(
    playerUnits: ISoldier[], 
    occupiedPlayerSquares: string[]
  ): { updatedPlayerUnits: ISoldier[]; updatedOccupiedSquares: string[] } {
    const updatedPlayerUnits = [...playerUnits];
    const updatedOccupiedSquares = [...occupiedPlayerSquares];

    if (updatedPlayerUnits.length > 0 && updatedOccupiedSquares.length === 0) {
      for (let i = 0; i < updatedPlayerUnits.length; i++) {
        const unit = updatedPlayerUnits[i];
        if (!unit) continue;
        
        const nextGridLocation: GridLocation | null = this.findNextEmptyGridLocation(updatedOccupiedSquares);
        // This shouldn't be possible because you can't place more units on the board
        // than there are squares
        if (!nextGridLocation) {
          break;
        }

        unit.xPos = (nextGridLocation.gridX * BATTLE_CONSTANTS.TILE_WIDTH) + BATTLE_CONSTANTS.WORLD_X;
        unit.yPos = (nextGridLocation.gridY * BATTLE_CONSTANTS.TILE_WIDTH) + BATTLE_CONSTANTS.WORLD_Y;
        const gridKey: string = this.getGridKey(nextGridLocation.gridX, nextGridLocation.gridY);
        updatedOccupiedSquares.push(gridKey);
      }
    }

    return { updatedPlayerUnits, updatedOccupiedSquares };
  }

  public updateLandType(landType: TerrainType): void {
    this.landType = landType;
  }

  public updateCastles(playerCastle: Castle, enemyCastle: Castle): void {
    this.playerCastle = playerCastle;
    this.enemyCastle = enemyCastle;
  }
}
