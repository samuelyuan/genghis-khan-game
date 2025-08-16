import { Castle } from './Castle.js';
import { Vector } from './Vector.js';
import { Soldier as ISoldier } from './types.js';

// Extended interface for the constructor data
interface SoldierConstructorData {
  xPos: number;
  yPos: number;
  typeId: number;
  level: number;
  unitPower: number;
  maxHitPoints: number;
  worldY: number;
  tileRow: number;
  sFamily?: string;
  rivalCastleXLine?: number;
}

// Type for unit states
type UnitState = "stand" | "walk" | "attack";

// Type for enemy unit distance data
interface EnemyUnitDistance {
  rival: ISoldier;
  dist: number;
  dy: number;
}

class Soldier implements ISoldier {
  // Position and movement
  public xPos: number;
  public yPos: number;
  public rotation: number;
  public speedTimes: number;
  public typeId: number;

  // Leveling system
  public currentLevel: number;
  public maxLevel: number;
  public expRate: number;
  public experiencePerLevel: number;
  public experience: number;
  public expStep: number;
  public expUnit: number;
  public power: number;

  // Gold
  public cost: number;
  public goldRate: number;
  public goldStep: number;

  // Health
  public maxHitPoints: number;
  public hitPoints: number;
  public isDead: boolean;

  // Movement
  public sState: UnitState;
  public F: Vector;
  public standDist: number;
  public hitDist: number;
  public rangeOffset: number;
  public topBorder: number;
  public bottomBorder: number;

  // Attack
  public aim: ISoldier | Castle | null;
  public rivalCastle: Castle | null;
  
  // Additional properties
  public initv: Vector;
  public v: Vector;
  public sFamily: string;
  public rivalCastleXLine: number;
  public unitBeingAttackedBy: ISoldier | null;

  constructor(unitData: SoldierConstructorData) {
    this.xPos = unitData.xPos;
    this.yPos = unitData.yPos;
    this.rotation = 0;
    this.speedTimes = 1;
    this.typeId = unitData.typeId;

    // Leveling system
    this.currentLevel = unitData.level;
    this.maxLevel = 12;
    this.expRate = 1;
    this.experiencePerLevel = 100;
    this.experience = this.currentLevel * this.experiencePerLevel;
    this.expStep = 3;
    this.expUnit = 50;
    this.power = unitData.unitPower;

    // Gold
    this.cost = 0;
    this.goldRate = 0.035;
    this.goldStep = 0.5;

    // Health
    this.maxHitPoints = unitData.maxHitPoints;
    this.hitPoints = this.maxHitPoints;
    this.isDead = false;

    // Movement
    this.sState = "stand";
    this.F = new Vector(0, 0);
    this.standDist = 30;
    this.hitDist = 100;
    this.rangeOffset = 150;

    this.topBorder = unitData.worldY + 15;
    this.bottomBorder = unitData.worldY + (32 * unitData.tileRow);

    // Attack
    this.aim = null;
    this.rivalCastle = null;
    
    // Initialize missing properties
    this.initv = new Vector(0, 0);
    this.v = new Vector(0, 0);
    this.sFamily = unitData.sFamily || "player";
    this.rivalCastleXLine = unitData.rivalCastleXLine || 0;
    this.unitBeingAttackedBy = null;
  }

  public runFrame(rivalUnits: ISoldier[]): void {
    this.checkIsDead();
    this.moveUnit();
    this.getAim(rivalUnits);
    this.checkShouldAttack();
    this.attack();
  }

  public setFighting(isBattleStarted: boolean): void {
    if (isBattleStarted) {
      this.setState("walk");
    }
  }

  private moveUnit(): void {
    // Keep the unit within the top and bottom bounds of the screen
    if (this.yPos < this.topBorder) {
      this.yPos = this.topBorder;
    }
    if (this.yPos > this.bottomBorder) {
      this.yPos = this.bottomBorder;
    }
    
    // Note: Position will be updated later using velocity
    
    // Change unit rotation
    const aimTarget = this.aim;
    if (this.isMovingUnit(aimTarget)) {
      const unitXPos = this.xPos;
      const unitYPos = this.yPos;
      
      if (this.isSoldierTarget(aimTarget)) {
        const otherXPos = aimTarget.xPos;
        const otherYPos = aimTarget.yPos;
        const rotationDegrees = Math.atan2(otherYPos - unitYPos, otherXPos - unitXPos) * 57.29578;
        const moveSpeed = 0.1 * this.speedTimes;
        this.updateUnitRotation(rotationDegrees, moveSpeed);

        const xDelta = otherXPos - unitXPos;
        const yDelta = otherYPos - unitYPos;
        const distance = Math.sqrt(xDelta * xDelta + yDelta * yDelta);
        if (distance < this.standDist) {
          return;
        }
      }
      // If it's a castle target, we don't need to check distance or rotation
    } else {
      if (this.sState !== "walk") {
        this.v = this.initv.clone();
        this.sState = "walk";
      }
      const rotationDegrees = this.initv.getAngle();
      const moveSpeed = 0.05 * this.speedTimes;
      this.updateUnitRotation(rotationDegrees, moveSpeed);
    }

    this.xPos = this.xPos + this.v.x * this.speedTimes;
    this.yPos = this.yPos + this.v.y * this.speedTimes;

    // Check if player is close enough to the opponent's castle
    if (this.sFamily === "player") {
      if (this.xPos > this.rivalCastleXLine - this.standDist) {
        this.stAttackCastle(this.rivalCastleXLine - this.standDist);
      }
    } else if (this.sFamily === "enemy") {
      if (this.xPos < this.rivalCastleXLine + this.standDist) {
        this.stAttackCastle(this.rivalCastleXLine + this.standDist);
      }
    }
  }

  private updateUnitRotation(rotationDegrees: number, moveSpeed: number): void {
    let unitRotation = this.rotation;
    let angleDelta = rotationDegrees - unitRotation;
    angleDelta = angleDelta % 360;
    angleDelta = angleDelta % 360 >= 0 ? angleDelta : angleDelta + 360;
    let angleAbs = Math.abs(angleDelta);
    let angleSign = angleAbs / angleDelta;
    
    if (angleAbs > 1) {
      if (angleAbs > 180) {
        angleAbs = 360 - angleAbs;
        angleSign = -angleSign;
      }
      unitRotation = unitRotation + (angleSign * angleAbs * moveSpeed);
      this.v.setAngle(unitRotation);
      this.rotation = unitRotation;
    }
  }

  private attack(): void {
    if (this.sState !== "attack") {
      return;
    }

    if (this.aim && this.isSoldierTarget(this.aim)) {
      (this.aim as ISoldier).loseHitPoints(this.power);
      this.addExp(this.expStep);
    } else if (this.aim && this.isCastleTarget(this.aim)) {
      // Attack castle
      (this.aim as Castle).loseHitPoints(this.power);
      this.addExp(this.expStep);
    }
  }

  public loseHitPoints(power: number): void {
    this.hitPoints = this.hitPoints - Math.floor(power);
    if (this.hitPoints < 0) {
      this.hitPoints = 0;
    }
    this.checkIsDead();
  }

  private isMovingUnit(aimTarget: ISoldier | Castle | null): boolean {
    return aimTarget !== null && this.isSoldierTarget(aimTarget);
  }

  private isSoldierTarget(target: ISoldier | Castle): target is ISoldier {
    return 'xPos' in target && 'yPos' in target && !('xLine' in target);
  }

  private isCastleTarget(target: ISoldier | Castle): target is Castle {
    return 'xLine' in target;
  }

  private getAim(rivalUnits: ISoldier[]): void {
    // Don't look for new targets
    if (this.aim) {
      if (this.isSoldierTarget(this.aim)) {
        if (this.aim.isDead) {
          this.aim = null;
          this.sState = "walk";
        } else {
          return;
        }
      }
    }
    
    const currentX = this.xPos;
    const currentY = this.yPos;

    const allEnemyUnits: EnemyUnitDistance[] = rivalUnits
      .filter(rivalUnit => !rivalUnit.isDead)
      .map((rivalUnit: ISoldier) => {
        const rivalX = rivalUnit.xPos;
        const rivalY = rivalUnit.yPos;
        const deltaX = rivalX - currentX;
        const deltaY = rivalY - currentY;
        const unitDist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const deltaYAbs = Math.abs(deltaY);

        // Get the distance of this unit to all rival units and find the units close enough for attacking
        const rivalUnitDistance: EnemyUnitDistance = {
          rival: rivalUnit,
          dist: unitDist,
          dy: deltaYAbs
        };
        return rivalUnitDistance;
      });
      
    const enemyUnitsWithinMeleeUnit = allEnemyUnits.filter(rivalUnitDistance => rivalUnitDistance.dist < this.hitDist);
    
    // Check if there are any units for ranged units to attack
    // Ranged units can attack over longer distances
    let enemyUnitsWithinRangedUnit: EnemyUnitDistance[] = [];
    if (enemyUnitsWithinMeleeUnit.length > 0) {
      enemyUnitsWithinRangedUnit = allEnemyUnits
        .filter(enemyUnit => enemyUnit.dist < this.hitDist + this.rangeOffset)
        .filter(enemyUnit => enemyUnit.dist > this.hitDist);
    }
    
    const candidateEnemyUnits = enemyUnitsWithinMeleeUnit.concat(enemyUnitsWithinRangedUnit);
    const enemyUnitsAttack = [...candidateEnemyUnits];
    
    enemyUnitsAttack.sort((a: EnemyUnitDistance, b: EnemyUnitDistance) => {
      return a.dy - b.dy;
    });
    
    if (enemyUnitsAttack.length === 0) {
      return;
    }
    
    const expectedDeltaY = enemyUnitsAttack[0].dy;
    const enemyUnitsMatching = enemyUnitsAttack.filter(unit => unit.dy === expectedDeltaY);
    
    enemyUnitsMatching.sort((a: EnemyUnitDistance, b: EnemyUnitDistance) => {
      return a.dist - b.dist;
    });
    
    if (enemyUnitsMatching.length === 0) {
      return;
    }
    
    let enemyUnitsMatchingRival = enemyUnitsMatching[0].rival;
    
    // If current unit is already being attacked, finish fighting with this unit
    if (this.unitBeingAttackedBy) {
      enemyUnitsMatchingRival = this.unitBeingAttackedBy;
      this.sState = "walk";
    }
    
    // No one to fight
    if (!enemyUnitsMatchingRival) {
      return;
    }
    
    enemyUnitsMatchingRival.unitBeingAttackedBy = this;
    this.aim = enemyUnitsMatchingRival;
  }

  public stAttackCastle(rivalCastleXLine: number): void {
    this.xPos = rivalCastleXLine;
    this.aim = this.rivalCastle;
    this.sState = "attack";
  }

  public setState(state: UnitState): void {
    this.sState = state;
    if (state === "walk") {
      this.v = this.initv.clone();
    }
  }

  public setExp(exp: number): void {
    this.experience = exp;
    this.currentLevel = Math.floor(this.experience / this.experiencePerLevel);
  }

  public addExp(exp: number): void {
    if (this.currentLevel >= this.maxLevel) {
      return;
    }
    this.experience = this.experience + exp * this.expRate;
    this.currentLevel = Math.floor(this.experience / this.experiencePerLevel);
  }

  private checkShouldAttack(): void {
    const target = this.aim;
    if (!target) {
      return;
    }

    // Already attacking
    if (this.sState === "attack") {
      return;
    }
    
    // Check if unit is close enough to attack
    const curX = this.xPos;
    const curY = this.yPos;
    
    if (this.isSoldierTarget(target)) {
      const rivalX = target.xPos;
      const rivalY = target.yPos;
      const deltaX = rivalX - curX;
      const deltaY = rivalY - curY;
      const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      if (dist <= this.standDist) {
        this.sState = "attack";
      }
    } else if (this.isCastleTarget(target)) {
      // For castle targets, check if we're close enough based on x position
      if (this.sFamily === "player") {
        if (this.xPos >= this.rivalCastleXLine - this.standDist) {
          this.sState = "attack";
        }
      } else if (this.sFamily === "enemy") {
        if (this.xPos <= this.rivalCastleXLine + this.standDist) {
          this.sState = "attack";
        }
      }
    }
  }

  private checkIsDead(): void {
    if (this.isDead) {
      return;
    }
    if (this.hitPoints === 0) {
      this.isDead = true;
      if (this.aim && this.isSoldierTarget(this.aim)) {
        this.aim.unitBeingAttackedBy = null;
        this.aim.aim = null;
      }
    }
  }
}

export { Soldier };
export type { SoldierConstructorData, UnitState, EnemyUnitDistance };
