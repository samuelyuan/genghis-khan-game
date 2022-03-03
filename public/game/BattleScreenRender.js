import { Castle } from './Castle.js';
import { Enemy } from './Enemy.js';
import { Player } from './Player.js';
import { UnitStats } from './UnitStats.js';

class BattleScreenRender {
  constructor(ctx) {
    const SCREEN_WIDTH = 800;

    this.ctx = ctx;

    // Player tiles
    this.tileWidth = 32;
    this.tileRow = 9;
    this.tileColumn = 9;
    // World constants
    this.worldX = 110;
    this.worldY = 108;
    this.mapWidth = SCREEN_WIDTH;
    this.enemyCoordOffset = SCREEN_WIDTH - (this.worldX * 2) - (this.tileWidth * this.tileRow);
    this.speedTimes = 1; // Default is 1, max is 4

    this.resetGame();

    this.landType = null;

    this.solveId = 0;
    this.maxSolveId = 100;
    this.diceInter = 0;
    this.maxDiceInter = 25;

    this.hitDis = [500, 500, 500, 500, 500];

    // Only load images once
    this.imageArr = [];
    this.totalImages = 0;
    this.loadCounter = 0;
    this.loadAllImages();

    this.unitStats = new UnitStats();
  }

  loadAllImages() {
    var imageNames = ['/img/mongol_base.png', '/img/ground_base.png', '/img/enemy_base.png'];
    this.totalImages = imageNames.length;
    var self = this;
    imageNames.forEach(function(name) {
      var image = new Image();
      image.src = name;
      self.incrementLoadCounter()
      self.imageArr.push(image);
    });
  }

  incrementLoadCounter() {
     this.loadCounter++;
     if(this.loadCounter === this.totalImages) {

     }
  }

  calculateCountryPower(initialPower) {
    var power = initialPower;
    for (var i = 0; i < this.playerUnits.length; i++) {
      var level = this.playerUnits[i].currentLevel;
      var unitTypeId = this.playerUnits[i].typeId;
      var powerFromUnit = this.unitStats.getCountryPower(
        this.unitStats.unitCost[unitTypeId],
        this.unitStats.unitCostUpgradeRate[unitTypeId],
        level
      );
      power += powerFromUnit * 5;
    }
    return power;
  }

  createWorld(countryName, landType) {
    this.landType = landType;
    // Reset at beginning of each battle
    this.playerTiles = [];
    for (var r = 0; r < this.tileRow; r++) {
      for (var c = 0; c < this.tileColumn; c++) {
        var posX = this.tileWidth * c + this.worldX;
        var posY = this.tileWidth * r + this.worldY;
        var centerX = posX + this.tileWidth / 2;
        var centerY = posY + this.tileWidth / 2;
        var tileObj = {
          x: posX,
          y: posY,
          centerX: centerX,
          centerY: centerY,
          isSet: false,
          typeId: null,
          role: null
        };
        this.playerTiles.push(tileObj);
      }
    }

    // Reset position of player units
    if (this.playerUnits.length > 0 && this.occupiedPlayerSquares.length === 0) {
      for (var i = 0; i < this.playerUnits.length; i++) {
        var nextGridLocation = this.findNextEmptyGridLocation();
        // This shouldn't be possible because you can't place more units on the board
        // than there are squares
        if (!nextGridLocation) {
          break;
        }

        this.playerUnits[i].xPos = (nextGridLocation.gridX * this.tileWidth) + this.worldX;
        this.playerUnits[i].yPos = (nextGridLocation.gridY * this.tileWidth) + this.worldY;
        var gridKey = this.getGridKey(nextGridLocation.gridX, nextGridLocation.gridY);
        this.occupiedPlayerSquares.push(gridKey);
      }
    }
  }

  findNextEmptyGridLocation() {
    for (var gridX = this.tileColumn - 1; gridX >= 0; gridX--) {
      for (var gridY = 0; gridY < this.tileRow; gridY++) {
        const key = this.getGridKey(gridX, gridY);
        if (!this.occupiedPlayerSquares.includes(key)) {
          return {
            gridX: gridX,
            gridY: gridY
          }
        }
      }
    }
    return null
  }

  getGridKey(gridX, gridY) {
    return gridX + "," + gridY;
  }

  drawWorld() {
    const SCREEN_WIDTH = 800;
    this.ctx.fillStyle = "#657051";

    this.ctx.drawImage(this.imageArr[0], 0, 104);
    this.ctx.drawImage(this.imageArr[1], 100, 104, 530, 297);
    this.ctx.drawImage(this.imageArr[2], 630, 104);

    // top border
    this.ctx.fillRect(0, 0, SCREEN_WIDTH, this.worldY);
    // bottom border
    this.ctx.fillRect(0, this.worldY + (this.tileRow * this.tileWidth), SCREEN_WIDTH, 600);

    // Health bar region
    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(6, 406, 415-6, 424-406);

    this.ctx.beginPath();
    this.ctx.rect(0, 0, SCREEN_WIDTH, 600);
    this.ctx.stroke();
  }

  drawStagingArea() {
    for (var i = 0; i < this.playerTiles.length; i++) {
      var tileObj = this.playerTiles[i];
      // Display grid for player to place units
      this.ctx.fillStyle = "#6E9E0D";
      this.ctx.fillRect(tileObj.x, tileObj.y, this.tileWidth-2, this.tileWidth-2);
    }
  }

  placeNewPlayerUnit(canvas, event) {
    // Don't let player place new units during a battle
    if (this.isBattleStarted) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const gridX = Math.floor((mouseX - this.worldX) / this.tileWidth);
    const gridY = Math.floor((mouseY - this.worldY) / this.tileWidth);

    const key = this.getGridKey(gridX, gridY);
    if (this.occupiedPlayerSquares.includes(key)) {
      // Upgrade the existing unit
      for (var i = 0; i < this.playerUnits.length; i++) {
        var tileObj = {
          centerX: (gridX * this.tileWidth) + this.worldX,
          centerY: (gridY * this.tileWidth) + this.worldY
        };
        if (this.playerUnits[i].xPos == tileObj.centerX
          && this.playerUnits[i].yPos == tileObj.centerY) {
          // Increase level by 1
          this.playerUnits[i].addExp(this.playerUnits[i].experiencePerLevel);
          break;
        }
      }
      this.renderPlayerSoldiers();
      return;
    }
    if (gridX < 0 || gridX >= this.tileColumn) {
      return;
    }
    if (gridY < 0 || gridY >= this.tileRow) {
      return;
    }

    var tileObj = {
      centerX: (gridX * this.tileWidth) + this.worldX,
      centerY: (gridY * this.tileWidth) + this.worldY
    };
    var typeId = 1;
    var playerLevel = 0;
    var playerUnit = this.initUnit("player", tileObj, typeId, playerLevel);
    this.playerUnits.push(playerUnit);
    this.occupiedPlayerSquares.push(key);
    this.renderPlayerSoldiers();
  }

  addEnemies(enemyShape, enemyLevel) {
    this.enemyShape = enemyShape;
    this.enemyLevel = enemyLevel;
    this.enemyUnits = [];
    for (var i = 0; i < this.enemyShape.length; i++) {
      var typeId = this.enemyShape[i].typeId;
      if (typeId != null) {
        var tileObj = {
          centerX: this.enemyShape[i].x + this.enemyCoordOffset,
          centerY: this.enemyShape[i].y
        };
        var enemyUnit = this.initUnit("enemy", tileObj, typeId, this.enemyLevel[i]);
        this.enemyUnits.push(enemyUnit);
      }
    }
  }

  initUnit(family, tile, typeId, level) {
    var soldier;
    var maxHitPoints = this.unitStats.getMaxHitPoints(level, typeId, this.landType);
    var unitPower = this.unitStats.getUnitPower(level, typeId, this.landType);
    var unitData = {
      playerCastle: this.playerCastle,
      enemyCastle: this.enemyCastle,
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

  renderPlayerSoldiers() {
    for (var i = 0; i < this.playerUnits.length; i++) {
      var soldier = this.playerUnits[i];
      var xStart = soldier.xPos;
      var yStart = soldier.yPos;
      this.renderSoldier(soldier, xStart, yStart, "#FF5100");
    }
  }

  renderEnemySoldiers() {
    for (var i = 0; i < this.enemyUnits.length; i++) {
      var soldier = this.enemyUnits[i];
      var xStart = soldier.xPos - this.tileWidth / 2;
      var yStart = soldier.yPos - this.tileWidth / 2;
      this.renderSoldier(soldier, xStart, yStart, "#0051FF");
    }
  }

  renderSoldier(soldier, xStart, yStart, color) {
    // Colored rectangle
    this.ctx.fillStyle = color;
    this.ctx.fillRect(xStart, yStart, this.tileWidth * (soldier.hitPoints / soldier.maxHitPoints), this.tileWidth);
    // Outline
    this.ctx.font = "16px Arial";
    this.ctx.fillStyle = "#000000";
    this.ctx.strokeRect(xStart, yStart, this.tileWidth, this.tileWidth);
    // Text to identify unit type
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.fillText(soldier.currentLevel, xStart + 8, yStart + 20);
  }

  createCastles(selfPower, enemyPower) {
    this.playerCastle = new Castle(selfPower, this.worldX);
    this.enemyCastle = new Castle(enemyPower, this.mapWidth - this.worldX);
  }

  drawCastleHealth() {
    var healthBarPixelWidth = 100;
    var playerCastleHealthPercent = healthBarPixelWidth * (this.playerCastle.hitPoints / this.playerCastle.maxHitPoints);
    var enemyCastleHealthPercent = healthBarPixelWidth * (this.enemyCastle.hitPoints / this.enemyCastle.maxHitPoints);
    $("#itemCurrentCountryHealth").css("width", playerCastleHealthPercent + "px");
    $("#itemEnemyCountryHealth").css("width", enemyCastleHealthPercent + "px");
  }

  initBattle() {
    this.isBattleStarted = true;
    this.isVictory = false;
    this.isGameOver = false;

    var updatedPlayerUnits = [];
    for (var i = 0; i < this.playerUnits.length; i++) {
      // this.playerUnits[i].setNewEnemyCastle(this.enemyCastle);
      var unit = this.playerUnits[i];
      var tileObj = {
        centerX: unit.xPos,
        centerY: unit.yPos
      };
      var updatedUnit = this.initUnit("player", tileObj, unit.typeId, unit.currentLevel);
      updatedPlayerUnits.push(updatedUnit);
    }
    this.playerUnits = updatedPlayerUnits;

    var allSoldiers = this.playerUnits.concat(this.enemyUnits);
    for (var i = 0; i < allSoldiers.length; i++) {
      if (allSoldiers[i].sState === "stand") {
        allSoldiers[i].setFighting(this.isBattleStarted);
      }
    }
  }

  resetGame() {
    // Only reset player units at the beginning of a new game
    // Don't reset after every battle because the units will be carried over
    this.playerUnits = [];

    this.resetAfterBattle();
  }

  resetAfterBattle() {
    this.isBattleStarted = false;
    this.isVictory = false;
    this.isGameOver = false;

    this.playerTiles = [];
    this.playerCastle = null;
    this.enemyCastle = null;
    this.enemyShape = null;
    this.enemyLevel = null;

    this.enemyUnits = [];

    this.occupiedPlayerSquares = [];

    // Heal all units
    for (var i = 0; i < this.playerUnits.length; i++) {
      this.playerUnits[i].hitPoints = this.playerUnits[i].maxHitPoints;
    }
  }

  checkVictory() {
    if (!this.isBattleStarted) {
      return;
    }
    if (this.playerCastle.hitPoints === 0) {
      this.isGameOver = true;
    } else if (this.enemyCastle.hitPoints === 0) {
       this.isVictory = true;
    }
  }

  renderBattle() {
    this.drawWorld();
    if (!this.isBattleStarted) {
      this.drawStagingArea();
    }
    this.renderPlayerSoldiers();
    this.renderEnemySoldiers();
    this.drawCastleHealth();
  }

  runMainLoop() {
    this.ctx.clearRect(0, 0, 800, 600);
    var allSoldiers = this.playerUnits.concat(this.enemyUnits);
    for (var i = 0; i < allSoldiers.length; i++) {
      var rivalUnits;
      if (allSoldiers[i].sFamily === "player") {
        rivalUnits = this.enemyUnits;
      } else if (allSoldiers[i].sFamily === "enemy") {
        rivalUnits = this.playerUnits;
      }
      allSoldiers[i].runFrame(rivalUnits);
    }

    // Remove dead units
    this.playerUnits = this.playerUnits.filter(unit => !unit.isDead);
    this.enemyUnits = this.enemyUnits.filter(unit => !unit.isDead);

    this.renderBattle();
    this.checkVictory();
  }
}

export { BattleScreenRender }
