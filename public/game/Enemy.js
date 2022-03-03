import { Soldier } from './Soldier.js';
import { Vector } from './Vector.js'

class Enemy extends Soldier {
  constructor(unitData) {
    super(unitData);
    this.sFamily = "enemy";
    this.v = new Vector(-1, 0);
    this.initv = this.v.clone();
    this.castle = unitData.enemyCastle;
    this.rivalCastle = unitData.playerCastle;
    this.rivalCastleXLine = this.rivalCastle.xLine;
  }
}

export { Enemy }
