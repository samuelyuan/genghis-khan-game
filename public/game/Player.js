import { Soldier } from './Soldier.js';
import { Vector } from './Vector.js'

class Player extends Soldier {
  constructor(unitData) {
    super(unitData);
    this.sFamily = "player";
    this.v = new Vector(1, 0);
    this.initv = this.v.clone();
    this.castle = unitData.playerCastle;
    this.rivalCastle = unitData.enemyCastle;
    this.rivalCastleXLine = this.rivalCastle.xLine;
  }

  // Castle object will get reset after every battle, but unit doesn't
  setNewEnemyCastle(castle) {
    this.rivalCastle = castle;
  }
}

export { Player }
