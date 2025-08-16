import { Castle } from './Castle.js';
import { SoldierFactory } from './SoldierFactory.js';
import { UnitStats } from './UnitStats.js';
import { TerrainType, FormationUnit, Soldier as ISoldier } from './types.js';

// Interface for tile objects
interface Tile {
  x: number;
  y: number;
  centerX: number;
  centerY: number;
  isSet: boolean;
  typeId: number | null;
  role: string | null;
}

// Interface for grid location
interface GridLocation {
  gridX: number;
  gridY: number;
}

// Interface for map data
interface MapData {
  landType: TerrainType;
  playerCastle: Castle;
  enemyCastle: Castle;
}

// Interface for tile object used in unit creation
interface TileObject {
  centerX: number;
  centerY: number;
}

class BattleScreenRender {
  // Canvas context
  private ctx: CanvasRenderingContext2D;

  // Player tiles
  private readonly tileWidth: number = 32;
  private readonly tileRow: number = 9;
  private readonly tileColumn: number = 9;

  // World constants
  private readonly worldX: number = 110;
  private readonly worldY: number = 108;
  private readonly mapWidth: number = 800;
  private readonly enemyCoordOffset: number;
  private speedTimes: number = 1; // Default is 1, max is 4

  // Game state
  private isBattleStarted: boolean = false;
  public isVictory: boolean = false;
  public isGameOver: boolean = false;

  // Game objects
  private playerTiles: Tile[] = [];
  private playerUnits: ISoldier[] = [];
  private enemyUnits: ISoldier[] = [];
  private playerCastle: Castle | null = null;
  private enemyCastle: Castle | null = null;
  private enemyShape: FormationUnit[] | null = null;
  private enemyLevel: number[] | null = null;
  private landType: TerrainType | null = null;
  private occupiedPlayerSquares: string[] = [];

  // Images
  private imageArr: HTMLImageElement[] = [];
  private totalImages: number = 0;
  private loadCounter: number = 0;

  // Game systems
  private unitStats: UnitStats;
  private soldierFactory: SoldierFactory;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.enemyCoordOffset = this.mapWidth - (this.worldX * 2) - (this.tileWidth * this.tileRow);

    this.resetGame();

    // Only load images once
    this.loadAllImages();

    this.unitStats = new UnitStats();
    this.soldierFactory = new SoldierFactory(this.unitStats, this.worldY, this.tileRow);
  }

  private loadAllImages(): void {
    const imageNames: string[] = ['/img/mongol_base.png', '/img/ground_base.png', '/img/enemy_base.png'];
    this.totalImages = imageNames.length;
    
    imageNames.forEach((name: string) => {
      const image = new Image();
      image.src = name;
      this.incrementLoadCounter();
      this.imageArr.push(image);
    });
  }

  private incrementLoadCounter(): void {
    this.loadCounter++;
    if (this.loadCounter === this.totalImages) {
      // All images loaded
    }
  }

  public calculateCountryPower(initialPower: number): number {
    let power: number = initialPower;
    for (let i = 0; i < this.playerUnits.length; i++) {
      const level: number = this.playerUnits[i].currentLevel;
      const unitTypeId: number = this.playerUnits[i].typeId;
      const powerFromUnit: number = this.unitStats.getCountryPower(
        this.unitStats.unitCost[unitTypeId],
        this.unitStats.unitCostUpgradeRate[unitTypeId],
        level
      );
      power += powerFromUnit * 5;
    }
    return power;
  }

  public createWorld(countryName: string, landType: TerrainType): void {
    this.landType = landType;
    // Reset at beginning of each battle
    this.playerTiles = [];
    
    for (let r = 0; r < this.tileRow; r++) {
      for (let c = 0; c < this.tileColumn; c++) {
        const posX: number = this.tileWidth * c + this.worldX;
        const posY: number = this.tileWidth * r + this.worldY;
        const centerX: number = posX + this.tileWidth / 2;
        const centerY: number = posY + this.tileWidth / 2;
        
        const tileObj: Tile = {
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
      for (let i = 0; i < this.playerUnits.length; i++) {
        const nextGridLocation: GridLocation | null = this.findNextEmptyGridLocation();
        // This shouldn't be possible because you can't place more units on the board
        // than there are squares
        if (!nextGridLocation) {
          break;
        }

        this.playerUnits[i].xPos = (nextGridLocation.gridX * this.tileWidth) + this.worldX;
        this.playerUnits[i].yPos = (nextGridLocation.gridY * this.tileWidth) + this.worldY;
        const gridKey: string = this.getGridKey(nextGridLocation.gridX, nextGridLocation.gridY);
        this.occupiedPlayerSquares.push(gridKey);
      }
    }
  }

  private findNextEmptyGridLocation(): GridLocation | null {
    for (let gridX = this.tileColumn - 1; gridX >= 0; gridX--) {
      for (let gridY = 0; gridY < this.tileRow; gridY++) {
        const key: string = this.getGridKey(gridX, gridY);
        if (!this.occupiedPlayerSquares.includes(key)) {
          return {
            gridX: gridX,
            gridY: gridY
          };
        }
      }
    }
    return null;
  }

  private getGridKey(gridX: number, gridY: number): string {
    return gridX + "," + gridY;
  }

  public drawWorld(): void {
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

  public drawStagingArea(): void {
    for (let i = 0; i < this.playerTiles.length; i++) {
      const tileObj: Tile = this.playerTiles[i];
      // Display grid for player to place units
      this.ctx.fillStyle = "#6E9E0D";
      this.ctx.fillRect(tileObj.x, tileObj.y, this.tileWidth-2, this.tileWidth-2);
    }
  }

  public placeNewPlayerUnit(canvas: HTMLCanvasElement, event: MouseEvent): void {
    // Don't let player place new units during a battle
    if (this.isBattleStarted) {
      return;
    }

    const rect: DOMRect = canvas.getBoundingClientRect();
    const mouseX: number = event.clientX - rect.left;
    const mouseY: number = event.clientY - rect.top;

    const gridX: number = Math.floor((mouseX - this.worldX) / this.tileWidth);
    const gridY: number = Math.floor((mouseY - this.worldY) / this.tileWidth);

    const key: string = this.getGridKey(gridX, gridY);
    if (this.occupiedPlayerSquares.includes(key)) {
      // Upgrade the existing unit
      for (let i = 0; i < this.playerUnits.length; i++) {
        const tileObj: TileObject = {
          centerX: (gridX * this.tileWidth) + this.worldX,
          centerY: (gridY * this.tileWidth) + this.worldY
        };
        if (this.playerUnits[i].xPos === tileObj.centerX
          && this.playerUnits[i].yPos === tileObj.centerY) {
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

    const tileObj: TileObject = {
      centerX: (gridX * this.tileWidth) + this.worldX,
      centerY: (gridY * this.tileWidth) + this.worldY
    };
    
    const typeId: number = 1;
    const playerLevel: number = 0;
    const mapData: MapData = {
      landType: this.landType!,
      playerCastle: this.playerCastle!,
      enemyCastle: this.enemyCastle!
    };
    
    const playerUnit: ISoldier = this.soldierFactory.createPlayerUnit(tileObj, typeId, playerLevel, mapData);
    this.playerUnits.push(playerUnit);
    this.occupiedPlayerSquares.push(key);
    this.renderPlayerSoldiers();
  }

  public addEnemies(enemyShape: FormationUnit[], enemyLevel: number[]): void {
    this.enemyShape = enemyShape;
    this.enemyLevel = enemyLevel;
    this.enemyUnits = [];
    
    for (let i = 0; i < this.enemyShape.length; i++) {
      const typeId: number = this.enemyShape[i].typeId;
      if (typeId !== null) {
        const tileObj: TileObject = {
          centerX: this.enemyShape[i].x + this.enemyCoordOffset,
          centerY: this.enemyShape[i].y
        };
        const mapData: MapData = {
          landType: this.landType!,
          playerCastle: this.playerCastle!,
          enemyCastle: this.enemyCastle!
        };
        const enemyUnit: ISoldier = this.soldierFactory.createEnemyUnit(tileObj, typeId, this.enemyLevel[i], mapData);
        this.enemyUnits.push(enemyUnit);
      }
    }
  }

  public renderPlayerSoldiers(): void {
    for (let i = 0; i < this.playerUnits.length; i++) {
      const soldier: ISoldier = this.playerUnits[i];
      const xStart: number = soldier.xPos;
      const yStart: number = soldier.yPos;
      this.renderSoldier(soldier, xStart, yStart, "#FF5100");
    }
  }

  public renderEnemySoldiers(): void {
    for (let i = 0; i < this.enemyUnits.length; i++) {
      const soldier: ISoldier = this.enemyUnits[i];
      const xStart: number = soldier.xPos - this.tileWidth / 2;
      const yStart: number = soldier.yPos - this.tileWidth / 2;
      this.renderSoldier(soldier, xStart, yStart, "#0051FF");
    }
  }

  private renderSoldier(soldier: ISoldier, xStart: number, yStart: number, color: string): void {
    // Colored rectangle
    this.ctx.fillStyle = color;
    this.ctx.fillRect(xStart, yStart, this.tileWidth * (soldier.hitPoints / soldier.maxHitPoints), this.tileWidth);
    // Outline
    this.ctx.font = "16px Arial";
    this.ctx.fillStyle = "#000000";
    this.ctx.strokeRect(xStart, yStart, this.tileWidth, this.tileWidth);
    // Text to identify unit type
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.fillText(soldier.currentLevel.toString(), xStart + 8, yStart + 20);
  }

  public createCastles(selfPower: number, enemyPower: number): void {
    this.playerCastle = new Castle(selfPower, this.worldX);
    this.enemyCastle = new Castle(enemyPower, this.mapWidth - this.worldX);
  }

  public drawCastleHealth(): void {
    const healthBarPixelWidth: number = 100;
    const playerCastleHealthPercent: number = healthBarPixelWidth * (this.playerCastle!.hitPoints / this.playerCastle!.maxHitPoints);
    const enemyCastleHealthPercent: number = healthBarPixelWidth * (this.enemyCastle!.hitPoints / this.enemyCastle!.maxHitPoints);
    
    // Using jQuery for DOM manipulation (as in original code)
    ($ as any)("#itemCurrentCountryHealth").css("width", playerCastleHealthPercent + "px");
    ($ as any)("#itemEnemyCountryHealth").css("width", enemyCastleHealthPercent + "px");
  }

  public setCountryNames(playerCountryName: string, enemyCountryName: string): void {
    ($ as any)("#itemCurrentCountryName").text(playerCountryName);
    ($ as any)("#itemEnemyCountryName").text(enemyCountryName);
  }

  public setTerrainInfo(landType: TerrainType): void {
    ($ as any)("#itemTerrain").html("<p><b>Terrain:</b> " + landType + "</p>");
  }

  public initBattle(): void {
    this.isBattleStarted = true;
    this.isVictory = false;
    this.isGameOver = false;

    const updatedPlayerUnits: ISoldier[] = [];
    for (let i = 0; i < this.playerUnits.length; i++) {
      // this.playerUnits[i].setNewEnemyCastle(this.enemyCastle);
      const unit: ISoldier = this.playerUnits[i];
      const tileObj: TileObject = {
        centerX: unit.xPos,
        centerY: unit.yPos
      };
      const mapData: MapData = {
        landType: this.landType!,
        playerCastle: this.playerCastle!,
        enemyCastle: this.enemyCastle!
      };
      const updatedUnit: ISoldier = this.soldierFactory.createPlayerUnit(tileObj, unit.typeId, unit.currentLevel, mapData);
      updatedPlayerUnits.push(updatedUnit);
    }
    this.playerUnits = updatedPlayerUnits;

    const allSoldiers: ISoldier[] = this.playerUnits.concat(this.enemyUnits);
    for (let i = 0; i < allSoldiers.length; i++) {
      if (allSoldiers[i].sState === "stand") {
        allSoldiers[i].setFighting(this.isBattleStarted);
      }
    }
  }

  public resetGame(): void {
    // Only reset player units at the beginning of a new game
    // Don't reset after every battle because the units will be carried over
    this.playerUnits = [];

    this.resetAfterBattle();
  }

  public resetAfterBattle(): void {
    this.isBattleStarted = false;
    this.isVictory = false;
    this.isGameOver = false;

    this.playerTiles = [];
    this.playerCastle = null;
    this.enemyCastle = null;
    this.enemyShape = null;
    this.enemyLevel = null;
    this.landType = null;

    this.enemyUnits = [];

    this.occupiedPlayerSquares = [];

    // Heal all units
    for (let i = 0; i < this.playerUnits.length; i++) {
      this.playerUnits[i].hitPoints = this.playerUnits[i].maxHitPoints;
    }
  }

  public checkVictory(): void {
    if (!this.isBattleStarted) {
      return;
    }
    if (this.playerCastle!.hitPoints === 0) {
      this.isGameOver = true;
    } else if (this.enemyCastle!.hitPoints === 0) {
      this.isVictory = true;
    }
  }

  public renderBattle(): void {
    this.drawWorld();
    if (!this.isBattleStarted) {
      this.drawStagingArea();
    }
    this.renderPlayerSoldiers();
    this.renderEnemySoldiers();
    this.drawCastleHealth();
  }

  public runMainLoop(): void {
    this.ctx.clearRect(0, 0, 800, 600);
    const allSoldiers: ISoldier[] = this.playerUnits.concat(this.enemyUnits);
    
    for (let i = 0; i < allSoldiers.length; i++) {
      let rivalUnits: ISoldier[];
      if (allSoldiers[i].sFamily === "player") {
        rivalUnits = this.enemyUnits;
      } else if (allSoldiers[i].sFamily === "enemy") {
        rivalUnits = this.playerUnits;
      } else {
        continue; // Skip if family is neither player nor enemy
      }
      allSoldiers[i].runFrame(rivalUnits);
    }

    // Remove dead units
    this.playerUnits = this.playerUnits.filter(unit => !unit.isDead);
    this.enemyUnits = this.enemyUnits.filter(unit => !unit.isDead);

    this.renderBattle();
    this.checkVictory();
  }

  // Getters for external access
  public getIsBattleStarted(): boolean {
    return this.isBattleStarted;
  }

  public getIsVictory(): boolean {
    return this.isVictory;
  }

  public getIsGameOver(): boolean {
    return this.isGameOver;
  }

  public getPlayerUnits(): ISoldier[] {
    return this.playerUnits;
  }

  public getEnemyUnits(): ISoldier[] {
    return this.enemyUnits;
  }
}

export { BattleScreenRender };
export type { Tile, GridLocation, MapData, TileObject };
