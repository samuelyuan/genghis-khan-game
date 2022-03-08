import { Enemy } from './Enemy.js';
import { Player } from './Player.js';

class SoldierFactory {
  constructor(unitStats, worldY, tileRow) {
    this.unitStats = unitStats;
    // Constants
    this.worldY = worldY;
    this.tileRow = tileRow;
  }

  createPlayerUnit(tile, typeId, level, mapData) {
    return this.initUnit("player", tile, typeId, level, mapData);
  }

  createEnemyUnit(tile, typeId, level, mapData) {
    return this.initUnit("enemy", tile, typeId, level, mapData);
  }

  initUnit(family, tile, typeId, level, mapData) {
    var soldier;
    var maxHitPoints = this.unitStats.getMaxHitPoints(level, typeId, mapData.landType);
    var unitPower = this.unitStats.getUnitPower(level, typeId, mapData.landType);
    var unitData = {
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
      throw new Error("Invalid family name: " + family);
    }
  }
}

export { SoldierFactory }
