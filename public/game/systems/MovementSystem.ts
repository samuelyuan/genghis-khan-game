import { Castle } from '../entities/Castle.js';
import { Soldier } from '../entities/Soldier.js';
import { Vector } from '../utils/Vector.js';
import { SOLDIER_CONSTANTS } from '../constants/SoldierConstants.js';
import { UnitState } from '../types/types.js';
import { computeRotationStep } from './RotationMath.js';

export class MovementSystem {
  constructor(private soldier: Soldier) {}

  public moveUnit(): void {
    // Keep the unit within the top and bottom bounds of the screen
    this.enforceBoundaries();
    
    // Change unit rotation
    const aimTarget = this.soldier.aim;
    if (aimTarget && this.isMovingUnit(aimTarget)) {
      this.handleTargetedMovement(aimTarget);
    } else {
      this.handleDefaultMovement();
    }

    // Update position based on velocity
    this.updatePosition();

    // Check if player is close enough to the opponent's castle
    this.checkCastleProximity();
  }

  private enforceBoundaries(): void {
    if (this.soldier.yPos < this.soldier.topBorder) {
      this.soldier.yPos = this.soldier.topBorder;
    }
    if (this.soldier.yPos > this.soldier.bottomBorder) {
      this.soldier.yPos = this.soldier.bottomBorder;
    }
  }

  private handleTargetedMovement(aimTarget: Soldier | Castle): void {
    if (this.soldier.combatSystem.isSoldierTarget(aimTarget)) {
      const otherXPos = (aimTarget as Soldier).xPos;
      const otherYPos = (aimTarget as Soldier).yPos;
      
      // Calculate rotation towards target
      const rotationDegrees = Math.atan2(
        otherYPos - this.soldier.yPos, 
        otherXPos - this.soldier.xPos
      ) * SOLDIER_CONSTANTS.RADIANS_TO_DEGREES;
      
      const moveSpeed = SOLDIER_CONSTANTS.ROTATION_SPEED * this.soldier.speedTimes;
      this.updateUnitRotation(rotationDegrees, moveSpeed);

      // Check distance to target
      const xDelta = otherXPos - this.soldier.xPos;
      const yDelta = otherYPos - this.soldier.yPos;
      const distance = Math.sqrt(xDelta * xDelta + yDelta * yDelta);
      
      if (distance < this.soldier.standDist) {
        return; // Close enough, stop moving
      }
    }
    // If it's a castle target, we don't need to check distance or rotation
  }

  private handleDefaultMovement(): void {
    if (this.soldier.sState !== "walk") {
      this.soldier.v = this.soldier.initv.clone();
      this.soldier.sState = "walk";
    }
    
    const rotationDegrees = this.soldier.initv.getAngle();
    const moveSpeed = SOLDIER_CONSTANTS.WALK_ROTATION_SPEED * this.soldier.speedTimes;
    this.updateUnitRotation(rotationDegrees, moveSpeed);
  }

  private updatePosition(): void {
    this.soldier.xPos = this.soldier.xPos + this.soldier.v.x * this.soldier.speedTimes;
    this.soldier.yPos = this.soldier.yPos + this.soldier.v.y * this.soldier.speedTimes;
  }

  private checkCastleProximity(): void {
    if (this.soldier.sFamily === "player") {
      if (this.soldier.xPos > this.soldier.rivalCastleXLine - this.soldier.standDist) {
        this.soldier.stAttackCastle(this.soldier.rivalCastleXLine - this.soldier.standDist);
      }
    } else if (this.soldier.sFamily === "enemy") {
      if (this.soldier.xPos < this.soldier.rivalCastleXLine + this.soldier.standDist) {
        this.soldier.stAttackCastle(this.soldier.rivalCastleXLine + this.soldier.standDist);
      }
    }
  }

  public updateUnitRotation(rotationDegrees: number, moveSpeed: number): void {
    const step = computeRotationStep(this.soldier.rotation, rotationDegrees, moveSpeed, {
      angleThreshold: SOLDIER_CONSTANTS.ANGLE_THRESHOLD,
      angleWrapThreshold: SOLDIER_CONSTANTS.ANGLE_WRAP_THRESHOLD,
      fullCircle: SOLDIER_CONSTANTS.FULL_CIRCLE
    });

    if (step.changed) {
      this.soldier.v.setAngle(step.newRotation);
      this.soldier.rotation = step.newRotation;
    }
  }

  private isMovingUnit(aimTarget: Soldier | Castle | null): boolean {
    return aimTarget !== null && this.soldier.combatSystem.isSoldierTarget(aimTarget);
  }

  public setState(state: UnitState): void {
    this.soldier.sState = state;
    if (state === "walk") {
      this.soldier.v = this.soldier.initv.clone();
    }
  }

  public stAttackCastle(rivalCastleXLine: number): void {
    this.soldier.xPos = rivalCastleXLine;
    this.soldier.aim = this.soldier.rivalCastle;
    this.soldier.sState = "attack";
  }
}
