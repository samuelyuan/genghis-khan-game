import { Enemy } from '../entities/Enemy.js';
import { Player } from '../entities/Player.js';
import { TerrainType } from '../types/types.js';
import { UnitStats } from './UnitStats.js';
import { Castle } from '../entities/Castle.js';

// Define interfaces for the data structures used
interface Tile {
  centerX: number;
  centerY: number;
}

interface MapData {
  landType: TerrainType;
  playerCastle: Castle;
  enemyCastle: Castle;
}

interface UnitData {
  playerCastle: Castle;
  enemyCastle: Castle;
  worldY: number;
  tileRow: number;
  xPos: number;
  yPos: number;
  typeId: number;
  level: number;
  maxHitPoints: number;
  unitPower: number;
}

type UnitFamily = "player" | "enemy";

class SoldierFactory {
  private unitStats: UnitStats;
  private worldY: number;
  private tileRow: number;

  constructor(unitStats: UnitStats, worldY: number, tileRow: number) {
    this.unitStats = unitStats;
    // Constants
    this.worldY = worldY;
    this.tileRow = tileRow;
  }

  createPlayerUnit(tile: Tile, typeId: number, level: number, mapData: MapData): Player {
    return this.initUnit("player", tile, typeId, level, mapData) as Player;
  }

  createEnemyUnit(tile: Tile, typeId: number, level: number, mapData: MapData): Enemy {
    return this.initUnit("enemy", tile, typeId, level, mapData) as Enemy;
  }

  private initUnit(family: UnitFamily, tile: Tile, typeId: number, level: number, mapData: MapData): Player | Enemy {
    const maxHitPoints: number = this.unitStats.getMaxHitPoints(level, typeId, mapData.landType);
    const unitPower: number = this.unitStats.getUnitPower(level, typeId, mapData.landType);
    
    const unitData: UnitData = {
      playerCastle: mapData.playerCastle,
      enemyCastle: mapData.enemyCastle,
      worldY: this.worldY,
      tileRow: this.tileRow,
      xPos: tile.centerX,
      yPos: tile.centerY,
      typeId: typeId,
      level: level,
      maxHitPoints: maxHitPoints,
      unitPower: unitPower
    };

    if (family === "player") {
      return new Player(unitData);
    } else if (family === "enemy") {
      return new Enemy(unitData);
    } else {
      throw new Error(`Invalid family name: ${family}`);
    }
  }
}

export { SoldierFactory };
