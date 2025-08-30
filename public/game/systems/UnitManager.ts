import { TerrainType, FormationUnit } from '../types/types.js';
import { Soldier as ISoldier } from '../entities/Soldier.js';
import { UnitStats } from './UnitStats.js';
import { SoldierFactory } from './SoldierFactory.js';
import { Castle } from '../entities/Castle.js';
import { BATTLE_CONSTANTS, UNIT_CONSTANTS, UNIT_SIZES } from '../constants/GameConstants.js';

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
    occupiedPlayerSquares: string[],
    unitTypeId: number = 1
  ): { unit: ISoldier | null; gridKey: string | null; occupiedSquares: string[] } {
    // Don't let player place new units during a battle
    if (isBattleStarted) {
      return { unit: null, gridKey: null, occupiedSquares: [] };
    }

    const rect: DOMRect = canvas.getBoundingClientRect();
    const mouseX: number = event.clientX - rect.left;
    const mouseY: number = event.clientY - rect.top;

    const { gridX, gridY } = this.getGridPositionFromPixel(mouseX, mouseY);

    // Check if there's a unit at this position first
    const existingUnit = this.findUnitAtPosition(gridX, gridY, playerUnits);
    if (existingUnit) {
      // Return existing unit to show stats modal
      return { unit: existingUnit, gridKey: null, occupiedSquares: [] };
    }

    // Get unit size for this unit type
    const unitSize = this.getUnitSize(unitTypeId);
    
    // Check if we can place the unit (including multi-square validation for cavalry)
    const placementResult = this.canPlaceUnit(gridX, gridY, unitSize, occupiedPlayerSquares);
    if (!placementResult.canPlace) {
      return { unit: null, gridKey: null, occupiedSquares: [] };
    }

    // All units should be positioned at the top-left corner of their grid square
    // For cavalry: starts at gridX, spans to gridX+1
    // For other units: starts at gridX
    const centerX: number = gridX * BATTLE_CONSTANTS.TILE_WIDTH + BATTLE_CONSTANTS.WORLD_X;

    const tileObj: TileObject = {
      centerX: centerX,
      centerY: (gridY * BATTLE_CONSTANTS.TILE_WIDTH) + BATTLE_CONSTANTS.WORLD_Y
    };
    
    const typeId: number = unitTypeId;
    const playerLevel: number = 0;
    const mapData: MapData = {
      landType: this.landType!,
      playerCastle: this.playerCastle!,
      enemyCastle: this.enemyCastle!
    };
    
    const playerUnit: ISoldier = this.soldierFactory.createPlayerUnit(tileObj, typeId, playerLevel, mapData);
    return { 
      unit: playerUnit, 
      gridKey: placementResult.primaryKey, 
      occupiedSquares: placementResult.occupiedSquares 
    };
  }

  public sellUnit(
    unit: ISoldier, 
    playerUnits: ISoldier[], 
    occupiedPlayerSquares: string[]
  ): { sellValue: number; updatedPlayerUnits: ISoldier[]; updatedOccupiedSquares: string[] } {
    const sellValue = Math.floor(this.unitStats.unitCost[unit.typeId] * 0.75);
    
    // Get unit size and calculate which squares it occupies
    const unitSize = this.getUnitSize(unit.typeId);
    
    // For cavalry, we need to find the leftmost square it occupies
    const { gridX: unitGridX, gridY: unitGridY } = this.getGridPositionFromPixel(unit.xPos, unit.yPos);
    
    // Remove all squares this unit occupies
    const updatedOccupiedSquares = [...occupiedPlayerSquares];
    for (let x = unitGridX; x < unitGridX + unitSize.width; x++) {
      for (let y = unitGridY; y < unitGridY + unitSize.height; y++) {
        const key = this.getGridKey(x, y);
        const index = updatedOccupiedSquares.indexOf(key);
        if (index > -1) {
          updatedOccupiedSquares.splice(index, 1);
        }
      }
    }
    
    // Remove unit from player units
    const updatedPlayerUnits = [...playerUnits];
    const unitIndex = updatedPlayerUnits.indexOf(unit);
    if (unitIndex > -1) {
      updatedPlayerUnits.splice(unitIndex, 1);
    }
    
    return { sellValue, updatedPlayerUnits, updatedOccupiedSquares };
  }

  public getUnitSize(unitTypeId: number): { width: number; height: number } {
    switch (unitTypeId) {
      case 0: // Cavalry
        return UNIT_SIZES.CAVALRY;
      case 1: // Pike
        return UNIT_SIZES.PIKE;
      case 2: // Sword
        return UNIT_SIZES.SWORD;
      case 3: // Bow
        return UNIT_SIZES.BOW;
      default:
        return UNIT_SIZES.PIKE; // fallback
    }
  }

  public canPlaceUnit(
    gridX: number, 
    gridY: number, 
    unitSize: { width: number; height: number },
    occupiedPlayerSquares: string[]
  ): { canPlace: boolean; primaryKey: string; occupiedSquares: string[] } {
    // Check bounds - ensure cavalry doesn't go outside 9x9 grid
    if (!this.isWithinBounds(gridX, gridY, unitSize)) {
      return { canPlace: false, primaryKey: '', occupiedSquares: [] };
    }

    // Check if all required squares are available
    const requiredSquares: string[] = [];
    for (let x = gridX; x < gridX + unitSize.width; x++) {
      for (let y = gridY; y < gridY + unitSize.height; y++) {
        const key = this.getGridKey(x, y);
        if (occupiedPlayerSquares.includes(key)) {
          return { canPlace: false, primaryKey: '', occupiedSquares: [] };
        }
        requiredSquares.push(key);
      }
    }

    // Primary key is the leftmost square for cavalry, or the single square for others
    const primaryKey = this.getGridKey(gridX, gridY);

    return { canPlace: true, primaryKey, occupiedSquares: requiredSquares };
  }

  public isGridPositionOccupied(gridX: number, gridY: number, occupiedPlayerSquares: string[]): boolean {
    const key = this.getGridKey(gridX, gridY);
    return occupiedPlayerSquares.includes(key);
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
      const unitSize = this.getUnitSize(unit.typeId);
      
      // Calculate the leftmost/topmost grid position of this unit
      const { gridX: unitGridX, gridY: unitGridY } = this.getGridPositionFromPixel(unit.xPos, unit.yPos);
      
      // Check if the clicked position is within this unit's occupied area
      if (x >= unitGridX && x < unitGridX + unitSize.width &&
          y >= unitGridY && y < unitGridY + unitSize.height) {
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

  public findNextEmptyGridLocationForUnit(occupiedPlayerSquares: string[], unitSize: { width: number; height: number }): GridLocation | null {
    // Search from rightmost column to leftmost (same as original)
    for (let gridX = BATTLE_CONSTANTS.TILE_COLUMN - 1; gridX >= 0; gridX--) {
      for (let gridY = 0; gridY < BATTLE_CONSTANTS.TILE_ROW; gridY++) {
        // Check if this location can accommodate the unit size
        const canPlace = this.canPlaceUnitAtLocation(gridX, gridY, unitSize, occupiedPlayerSquares);
        if (canPlace) {
          return {
            gridX: gridX,
            gridY: gridY
          };
        }
      }
    }
    return null;
  }

  private canPlaceUnitAtLocation(gridX: number, gridY: number, unitSize: { width: number; height: number }, occupiedPlayerSquares: string[]): boolean {
    // Check bounds
    if (!this.isWithinBounds(gridX, gridY, unitSize)) {
      return false;
    }
    
    // Check if all required squares are available
    for (let x = gridX; x < gridX + unitSize.width; x++) {
      for (let y = gridY; y < gridY + unitSize.height; y++) {
        const key = this.getGridKey(x, y);
        if (occupiedPlayerSquares.includes(key)) {
          return false;
        }
      }
    }
    
    return true;
  }

  public getGridKey(gridX: number, gridY: number): string {
    return gridX + "," + gridY;
  }

  private getGridPositionFromPixel(xPos: number, yPos: number): { gridX: number; gridY: number } {
    return {
      gridX: Math.floor((xPos - BATTLE_CONSTANTS.WORLD_X) / BATTLE_CONSTANTS.TILE_WIDTH),
      gridY: Math.floor((yPos - BATTLE_CONSTANTS.WORLD_Y) / BATTLE_CONSTANTS.TILE_WIDTH)
    };
  }

  private isWithinBounds(gridX: number, gridY: number, unitSize: { width: number; height: number }): boolean {
    return gridX >= 0 && gridX + unitSize.width <= BATTLE_CONSTANTS.TILE_COLUMN &&
           gridY >= 0 && gridY + unitSize.height <= BATTLE_CONSTANTS.TILE_ROW;
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
        
        // Get unit size to prevent overlapping (especially for cavalry)
        const unitSize = this.getUnitSize(unit.typeId);
        
        // Find a location that can accommodate this unit's size
        const nextGridLocation: GridLocation | null = this.findNextEmptyGridLocationForUnit(updatedOccupiedSquares, unitSize);
        if (!nextGridLocation) {
          break;
        }

        // Place the unit
        unit.xPos = (nextGridLocation.gridX * BATTLE_CONSTANTS.TILE_WIDTH) + BATTLE_CONSTANTS.WORLD_X;
        unit.yPos = (nextGridLocation.gridY * BATTLE_CONSTANTS.TILE_WIDTH) + BATTLE_CONSTANTS.WORLD_Y;
        
        // Reserve all squares this unit occupies
        for (let x = nextGridLocation.gridX; x < nextGridLocation.gridX + unitSize.width; x++) {
          for (let y = nextGridLocation.gridY; y < nextGridLocation.gridY + unitSize.height; y++) {
            const gridKey: string = this.getGridKey(x, y);
            updatedOccupiedSquares.push(gridKey);
          }
        }
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

  public calculateRemainingValidSpace(occupiedSquares: string[]): number {
    let validSpaces = 0;
    
    // Check all possible unit types and sizes
    for (let gridX = 0; gridX < BATTLE_CONSTANTS.TILE_COLUMN - 1; gridX++) {
      for (let gridY = 0; gridY < BATTLE_CONSTANTS.TILE_ROW; gridY++) {
        // Try cavalry first (2x1)
        const canPlaceCavalry = this.canPlaceUnit(gridX, gridY, UNIT_SIZES.CAVALRY, occupiedSquares);
        if (canPlaceCavalry.canPlace) {
          validSpaces += UNIT_SIZES.CAVALRY.width * UNIT_SIZES.CAVALRY.height;
        } else {
          // Try single units (1x1)
          const canPlaceSingle = this.canPlaceUnit(gridX, gridY, UNIT_SIZES.PIKE, occupiedSquares);
          if (canPlaceSingle.canPlace) {
            validSpaces += UNIT_SIZES.PIKE.width * UNIT_SIZES.PIKE.height;
          }
        }
      }
    }
    
    return validSpaces;
  }
}
