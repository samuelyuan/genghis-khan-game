import { Castle } from '../entities/Castle.js';
import { Soldier } from '../entities/Soldier.js';
import { UnitState } from '../types/types.js';
import { selectNearestTarget } from './TargetSelection.js';

export class CombatSystem {
  constructor(private soldier: Soldier) {}

  public attack(): void {
    if (this.soldier.sState !== "attack") {
      return;
    }

    if (this.soldier.aim && this.isSoldierTarget(this.soldier.aim)) {
      (this.soldier.aim as Soldier).loseHitPoints(this.soldier.power);
      this.soldier.addExp(this.soldier.expStep);
    } else if (this.soldier.aim && this.isCastleTarget(this.soldier.aim)) {
      // Attack castle
      (this.soldier.aim as Castle).loseHitPoints(this.soldier.power);
      this.soldier.addExp(this.soldier.expStep);
    }
  }

  public loseHitPoints(power: number): void {
    this.soldier.hitPoints = this.soldier.hitPoints - Math.floor(power);
    if (this.soldier.hitPoints < 0) {
      this.soldier.hitPoints = 0;
    }
    this.checkIsDead();
  }

  public getAim(rivalUnits: Soldier[]): void {
    // Don't look for new targets
    if (this.soldier.aim) {
      if (this.isSoldierTarget(this.soldier.aim)) {
        if (this.soldier.aim.isDead) {
          this.soldier.aim = null;
          this.soldier.sState = "walk";
        } else {
          return;
        }
      }
    }
    
    let enemyUnitsMatchingRival = selectNearestTarget(
      this.soldier.xPos,
      this.soldier.yPos,
      rivalUnits,
      this.soldier.hitDist,
      this.soldier.rangeOffset
    );

    // If current unit is already being attacked, finish fighting with this unit
    if (this.soldier.unitBeingAttackedBy) {
      enemyUnitsMatchingRival = this.soldier.unitBeingAttackedBy;
      this.soldier.sState = "walk";
    }
    
    // No one to fight
    if (!enemyUnitsMatchingRival) {
      return;
    }
    
    enemyUnitsMatchingRival.unitBeingAttackedBy = this.soldier;
    this.soldier.aim = enemyUnitsMatchingRival;
  }

  public checkShouldAttack(): void {
    const target = this.soldier.aim;
    if (!target) {
      return;
    }

    // Already attacking
    if (this.soldier.sState === "attack") {
      return;
    }
    
    // Check if unit is close enough to attack
    const curX = this.soldier.xPos;
    const curY = this.soldier.yPos;
    
    if (this.isSoldierTarget(target)) {
      const rivalX = target.xPos;
      const rivalY = target.yPos;
      const deltaX = rivalX - curX;
      const deltaY = rivalY - curY;
      const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      if (dist <= this.soldier.standDist) {
        this.soldier.sState = "attack";
      }
    } else if (this.isCastleTarget(target)) {
      // For castle targets, check if we're close enough based on x position
      if (this.soldier.sFamily === "player") {
        if (this.soldier.xPos >= this.soldier.rivalCastleXLine - this.soldier.standDist) {
          this.soldier.sState = "attack";
        }
      } else if (this.soldier.sFamily === "enemy") {
        if (this.soldier.xPos <= this.soldier.rivalCastleXLine + this.soldier.standDist) {
          this.soldier.sState = "attack";
        }
      }
    }
  }

  public checkIsDead(): void {
    if (this.soldier.isDead) {
      return;
    }
    if (this.soldier.hitPoints === 0) {
      this.soldier.isDead = true;
      if (this.soldier.aim && this.isSoldierTarget(this.soldier.aim)) {
        this.soldier.aim.unitBeingAttackedBy = null;
        this.soldier.aim.aim = null;
      }
    }
  }

  public isSoldierTarget(target: Soldier | Castle): target is Soldier {
    return 'xPos' in target && 'yPos' in target && !('xLine' in target);
  }

  private isCastleTarget(target: Soldier | Castle): target is Castle {
    return 'xLine' in target;
  }
}
