import { Castle } from './Castle.js'
import { Vector } from './Vector.js'

class Soldier {
  constructor(unitData) {
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
  }

  runFrame(rivalUnits) {
    this.checkIsDead();
    this.moveUnit();
    this.getAim(rivalUnits);
    this.checkShouldAttack();
    this.attack();
  }

  setFighting(isBattleStarted) {
    if (isBattleStarted) {
      this.setState("walk");
    }
  }

  moveUnit() {
    // Keep the unit within the top and bottom bounds of the screen
    if (this.yPos < this.topBorder) {
      this.yPos = this.topBorder;
    }
    if (this.yPos > this.bottomBorder) {
      this.yPos = this.bottomBorder;
    }
    // Move unit
    this.xPos = this.xPos + this.F.x;
    this.yPos = this.yPos + this.F.y;
    // Change unit rotation
    var aimTarget = this.aim;
    if (this.isMovingUnit(aimTarget)) {
      var unitXPos = this.xPos;
      var unitYPos = this.yPos;
      var otherXPos = aimTarget.xPos;
      var otherYPos = aimTarget.yPos;
      var rotationDegrees = Math.atan2(otherYPos - unitYPos, otherXPos - unitXPos) * 57.29578;
      var moveSpeed = 0.1 * this.speedTimes;

      var unitRotation = this.rotation;
      var angleDelta = rotationDegrees - unitRotation;
      angleDelta = angleDelta % 360;
      angleDelta = angleDelta % 360 >= 0 ? angleDelta : angleDelta + 360;
      var angleAbs = Math.abs(angleDelta);
      var angleSign = angleAbs / angleDelta;

      if (angleAbs > 1) {
        if (angleAbs > 180) {
          angleAbs = 360 - angleAbs;
          angleSign = -angleSign;
        }
        unitRotation = unitRotation + (angleSign * angleAbs * moveSpeed);
        this.v.setAng(unitRotation);
        this.rotation = unitRotation;
      }

      if (this.aim.sType === "castle") {
        return;
      }

      var xDelta = otherXPos - unitXPos;
      var yDelta = otherYPos - unitYPos;
      var distance = Math.sqrt(xDelta * xDelta + yDelta * yDelta);
      if (distance < this.standDist) {
        return;
      }
    } else {
      if (this.sState != "walk") {
        this.v = this.initv.clone();
        this.sState = "walk";
      }
      var rotationDegrees = this.initv.getAng();
      var unitRotation = this.rotation;
      var moveSpeed = 0.05 * this.speedTimes;
      var angleDelta = rotationDegrees - unitRotation;
      angleDelta = angleDelta % 360;
      angleDelta = angleDelta % 360 >= 0 ? angleDelta : angleDelta + 360;
      var angleAbs = Math.abs(angleDelta);
      angleSign = angleAbs / angleDelta;
      if (angleAbs > 1) {
        if (angleAbs > 180) {
            angleAbs = 360 - angleAbs;
            angleSign = -angleSign;
         }
         unitRotation = unitRotation + angleSign * angleAbs * moveSpeed;
         this.v.setAng(unitRotation);
         this.rotation = unitRotation;
      }
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

  attack() {
    if (this.sState !== "attack") {
      return;
    }

    this.aim.loseHitPoints(this.power);
    this.addExp(this.expStep);
  }

  loseHitPoints(power) {
    this.hitPoints = this.hitPoints - Math.floor(power);
    if (this.hitPoints < 0) {
      this.hitPoints = 0;
    }
    this.checkIsDead();
  }

  isMovingUnit(aimTarget) {
    return aimTarget !== null && aimTarget instanceof Soldier;
  }

  getAim(rivalUnits) {
    // Don't look for new targets
    if (this.aim) {
      if (this.aim instanceof Soldier) {
        if (this.aim.isDead) {
          this.aim = null;
          this.sState = "walk";
        } else {
          return;
        }
      }
    }
    var currentX = this.xPos;
    var currentY = this.yPos;

    var allEnemyUnits = [];
    var enemyUnitsWithinMeleeUnit = [];
    var enemyUnitsWithinRangedUnit = [];
    var enemyUnitsAttack = [];
    var enemyUnitsMatching = [];
    // Get the distance of this unit to all rival units and find the units close enough for attacking
    for (var i = 0; i < rivalUnits.length; i++) {
      var rivalUnit = rivalUnits[i];
      if (rivalUnit.isDead) {
        continue;
      }
      var rivalX = rivalUnit.xPos;
      var rivalY = rivalUnit.yPos;
      var deltaX = rivalX - currentX;
      var deltaY = rivalY - currentY;
      var unitDist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      var deltaYAbs = Math.abs(deltaY);

      var rivalUnitDistance = {
        rival: rivalUnit,
        dist: unitDist,
        dy: deltaYAbs
      };
      allEnemyUnits.push(rivalUnitDistance);
      if (unitDist < this.hitDist) {
        enemyUnitsWithinMeleeUnit.push(rivalUnitDistance);
      }
    }
    // Check if there are any units for ranged units to attack
    // Ranged units can attack over longer distances
    if (enemyUnitsWithinMeleeUnit.length > 0) {
      for (var i = 0; i < allEnemyUnits.length; i++) {
        var currentEnemyUnit = allEnemyUnits[i];
        if (currentEnemyUnit.dist < this.hitDist + this.rangeOffset) {
          if (currentEnemyUnit.dist > this.hitDist) {
            enemyUnitsWithinRangedUnit.push(currentEnemyUnit);
          }
        }
      }
    }
    var candidateEnemyUnits = enemyUnitsWithinMeleeUnit.concat(enemyUnitsWithinRangedUnit);
    for (var i = 0; i < candidateEnemyUnits.length; i++) {
      var currentEnemyUnit = candidateEnemyUnits[i];
      var enemyOfEnemy = currentEnemyUnit.rival;
      enemyUnitsAttack.push(currentEnemyUnit);
    }
    var enemyUnitsAttackCopy = [...enemyUnitsAttack];
    enemyUnitsAttackCopy.sort(function(a, b) {
      return a.dy - b.dy;
    });
    if (enemyUnitsAttackCopy.length === 0) {
      return;
    }
    var expectedDeltaY = enemyUnitsAttackCopy[0].dy;
    for (var i = 0; i < enemyUnitsAttackCopy.length; i++) {
      var currentEnemyUnit = enemyUnitsAttackCopy[i];
      if (currentEnemyUnit.dy === expectedDeltaY) {
        enemyUnitsMatching.push(currentEnemyUnit);
      }
    }
    enemyUnitsMatching.sort(function(a, b) {
      return a.dist - b.dist;
    });
    if (enemyUnitsMatching.length === 0) {
      return;
    }
    var enemyUnitsMatchingRival = enemyUnitsMatching[0].rival;
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

  stAttackCastle(rivalCastleXLine) {
    this.xPos = rivalCastleXLine;
    this.aim = this.rivalCastle;
    this.sState = "attack";
  }

  setState(state) {
    this.sState = state;
    if (state === "walk") {
      this.v = this.initv.clone();
    }
  }

  setExp(exp) {
    this.experience = exp;
    this.currentLevel = Math.floor(this.experience / this.experiencePerLevel);
  }

  addExp(exp) {
    if (this.currentLevel >= this.maxLevel) {
      return;
    }
    this.experience = this.experience + exp * this.expRate;
    this.currentLevel = Math.floor(this.experience / this.experiencePerLevel);
  }

  checkShouldAttack() {
    var target = this.aim;
    if (!target) {
      return;
    }

    // Already attacking
    if (this.sState === "attack") {
      return;
    }
    // Check if unit is close enough to attack
    var curX = this.xPos;
    var curY = this.yPos;
    var rivalX = target.xPos;
    var rivalY = target.yPos;
    var deltaX = rivalX - curX;
    var deltaY = rivalY - curY;
    var dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    if (dist <= this.standDist) {
      this.sState = "attack";
    }
  }

  checkIsDead() {
    if (this.isDead) {
      return;
    }
    if (this.hitPoints === 0) {
      this.isDead = true;
      if (this.aim && this.aim instanceof Soldier) {
        this.aim.unitBeingAttackedBy = null;
        this.aim.aim = null;
      }
    }
  }
}

export { Soldier }
