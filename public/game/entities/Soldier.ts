import { Castle } from './Castle.js';
import { Vector } from '../utils/Vector.js';
import { UnitState } from '../types/types.js';
import { SOLDIER_CONSTANTS } from '../constants/SoldierConstants.js';
import { CombatSystem } from '../systems/CombatSystem.js';
import { MovementSystem } from '../systems/MovementSystem.js';

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

// Type for enemy unit distance data
interface EnemyUnitDistance {
  rival: Soldier;
  dist: number;
  dy: number;
}

export class Soldier {
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
  public aim: Soldier | Castle | null;
  public rivalCastle: Castle | null;
  
  // Additional properties
  public initv: Vector;
  public v: Vector;
  public sFamily: string;
  public rivalCastleXLine: number;
  public unitBeingAttackedBy: Soldier | null;

  // Combat system
  public combatSystem: CombatSystem;
  
  // Movement system
  public movementSystem: MovementSystem;

  constructor(unitData: SoldierConstructorData) {
    this.xPos = unitData.xPos;
    this.yPos = unitData.yPos;
    this.rotation = 0;
    this.speedTimes = 1;
    this.typeId = unitData.typeId;

    // Leveling system
    this.currentLevel = unitData.level;
    this.maxLevel = SOLDIER_CONSTANTS.MAX_LEVEL;
    this.expRate = SOLDIER_CONSTANTS.EXPERIENCE_RATE;
    this.experiencePerLevel = SOLDIER_CONSTANTS.EXPERIENCE_PER_LEVEL;
    this.experience = this.currentLevel * this.experiencePerLevel;
    this.expStep = SOLDIER_CONSTANTS.EXPERIENCE_STEP;
    this.expUnit = SOLDIER_CONSTANTS.EXPERIENCE_UNIT;
    this.power = unitData.unitPower;

    // Gold
    this.cost = 0;
    this.goldRate = SOLDIER_CONSTANTS.GOLD_RATE;
    this.goldStep = SOLDIER_CONSTANTS.GOLD_STEP;

    // Health
    this.maxHitPoints = unitData.maxHitPoints;
    this.hitPoints = this.maxHitPoints;
    this.isDead = false;

    // Movement
    this.sState = "stand";
    this.F = new Vector(0, 0);
    this.standDist = SOLDIER_CONSTANTS.STAND_DISTANCE;
    this.hitDist = SOLDIER_CONSTANTS.HIT_DISTANCE;
    this.rangeOffset = SOLDIER_CONSTANTS.RANGE_OFFSET;

    this.topBorder = unitData.worldY + SOLDIER_CONSTANTS.WORLD_Y_OFFSET;
    this.bottomBorder = unitData.worldY + (SOLDIER_CONSTANTS.TILE_ROW_MULTIPLIER * unitData.tileRow);

    // Attack
    this.aim = null;
    this.rivalCastle = null;
    
    // Initialize missing properties
    this.initv = new Vector(0, 0);
    this.v = new Vector(0, 0);
    this.sFamily = unitData.sFamily || "player";
    this.rivalCastleXLine = unitData.rivalCastleXLine || 0;
    this.unitBeingAttackedBy = null;

    // Initialize combat system
    this.combatSystem = new CombatSystem(this);
    
    // Initialize movement system
    this.movementSystem = new MovementSystem(this);
  }

  public runFrame(rivalUnits: Soldier[]): void {
    this.combatSystem.checkIsDead();
    this.movementSystem.moveUnit();
    this.combatSystem.getAim(rivalUnits);
    this.combatSystem.checkShouldAttack();
    this.combatSystem.attack();
  }

  public setFighting(isBattleStarted: boolean): void {
    if (isBattleStarted) {
      this.movementSystem.setState("walk");
    }
  }

  public setExp(exp: number): void {
    this.experience = exp;
    this.currentLevel = Math.floor(this.experience / this.experiencePerLevel);
  }

  public addExp(exp: number): void {
    if (this.currentLevel >= SOLDIER_CONSTANTS.MAX_LEVEL) {
      return;
    }
    this.experience = this.experience + exp * this.expRate;
    this.currentLevel = Math.floor(this.experience / this.experiencePerLevel);
  }

  public loseHitPoints(power: number): void {
    this.combatSystem.loseHitPoints(power);
  }

  public setState(state: UnitState): void {
    this.movementSystem.setState(state);
  }

  public stAttackCastle(rivalCastleXLine: number): void {
    this.movementSystem.stAttackCastle(rivalCastleXLine);
  }
}

export type { SoldierConstructorData };