import { Soldier } from './Soldier.js';
import { Vector } from './Vector.js';
import { Castle } from './Castle.js';

import { SoldierConstructorData } from './Soldier.js';

interface UnitData extends SoldierConstructorData {
  playerCastle: Castle;
  enemyCastle: Castle;
}

class Enemy extends Soldier {
  public castle: Castle;

  constructor(unitData: UnitData) {
    super(unitData);
    this.sFamily = "enemy";
    this.v = new Vector(-1, 0);
    this.initv = this.v.clone();
    this.castle = unitData.enemyCastle;
    this.rivalCastle = unitData.playerCastle;
    this.rivalCastleXLine = this.rivalCastle.xLine;
  }
}

export { Enemy };
