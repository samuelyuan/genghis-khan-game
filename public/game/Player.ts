import { Soldier } from './Soldier.js';
import { Vector } from './Vector.js';
import { Castle } from './Castle.js';

import { SoldierConstructorData } from './Soldier.js';

interface UnitData extends SoldierConstructorData {
  playerCastle: Castle;
  enemyCastle: Castle;
}

class Player extends Soldier {
  public castle: Castle;

  constructor(unitData: UnitData) {
    super(unitData);
    this.sFamily = "player";
    this.v = new Vector(1, 0);
    this.initv = this.v.clone();
    this.castle = unitData.playerCastle;
    this.rivalCastle = unitData.enemyCastle;
    this.rivalCastleXLine = this.rivalCastle.xLine;
  }

  // Castle object will get reset after every battle, but unit doesn't
  public setNewEnemyCastle(castle: Castle): void {
    this.rivalCastle = castle;
  }
}

export { Player };
