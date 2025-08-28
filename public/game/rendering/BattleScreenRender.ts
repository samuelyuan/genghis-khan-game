import { Castle } from '../entities/Castle.js';
import { SoldierFactory } from '../systems/SoldierFactory.js';
import { UnitStats } from '../systems/UnitStats.js';
import { TerrainType, FormationUnit, Soldier as ISoldier } from '../types/types.js';
import { BattleRenderer } from './BattleRenderer.js';
import { UnitManager } from '../systems/UnitManager.js';
import { BATTLE_CONSTANTS } from '../constants/GameConstants.js';

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

  // World constants
  private readonly mapWidth: number = BATTLE_CONSTANTS.MAP_WIDTH;
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
  private battleRenderer: BattleRenderer;
  private unitManager: UnitManager;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.enemyCoordOffset = this.mapWidth - (BATTLE_CONSTANTS.WORLD_X * 2) - (BATTLE_CONSTANTS.TILE_WIDTH * BATTLE_CONSTANTS.TILE_ROW);

    this.resetGame();

    // Only load images once
    this.loadAllImages();

    this.unitStats = new UnitStats();
    this.soldierFactory = new SoldierFactory(this.unitStats, BATTLE_CONSTANTS.WORLD_Y, BATTLE_CONSTANTS.TILE_ROW);
    this.battleRenderer = new BattleRenderer(ctx);
    this.unitManager = new UnitManager(this.unitStats, this.soldierFactory, this.landType, this.playerCastle, this.enemyCastle);
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
    this.unitManager.updateLandType(landType);
    
    // Reset at beginning of each battle
    this.playerTiles = [];
    
    for (let r = 0; r < BATTLE_CONSTANTS.TILE_ROW; r++) {
      for (let c = 0; c < BATTLE_CONSTANTS.TILE_COLUMN; c++) {
        const posX: number = BATTLE_CONSTANTS.TILE_WIDTH * c + BATTLE_CONSTANTS.WORLD_X;
        const posY: number = BATTLE_CONSTANTS.TILE_WIDTH * r + BATTLE_CONSTANTS.WORLD_Y;
        const centerX: number = posX + BATTLE_CONSTANTS.TILE_WIDTH / 2;
        const centerY: number = posY + BATTLE_CONSTANTS.TILE_WIDTH / 2;
        
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
        const unit = this.playerUnits[i];
        if (!unit) continue;
        
        const nextGridLocation: GridLocation | null = this.findNextEmptyGridLocation();
        // This shouldn't be possible because you can't place more units on the board
        // than there are squares
        if (!nextGridLocation) {
          break;
        }

        unit.xPos = (nextGridLocation.gridX * BATTLE_CONSTANTS.TILE_WIDTH) + BATTLE_CONSTANTS.WORLD_X;
        unit.yPos = (nextGridLocation.gridY * BATTLE_CONSTANTS.TILE_WIDTH) + BATTLE_CONSTANTS.WORLD_Y;
        const gridKey: string = nextGridLocation.gridX + "," + nextGridLocation.gridY;
        this.occupiedPlayerSquares.push(gridKey);
      }
    }
  }

  private findNextEmptyGridLocation(): GridLocation | null {
    return this.unitManager.findNextEmptyGridLocation(this.occupiedPlayerSquares);
  }



  public findUnitAtPosition(x: number, y: number): ISoldier | null {
    return this.unitManager.findUnitAtPosition(x, y, this.playerUnits);
  }

  public getUnitStats(unit: ISoldier): any {
    return this.unitManager.getUnitStats(unit);
  }

  public getUpgradePreview(unit: ISoldier): any {
    return this.unitManager.getUpgradePreview(unit);
  }

  public sellUnit(unit: ISoldier): number {
    const result = this.unitManager.sellUnit(unit, this.playerUnits, this.occupiedPlayerSquares);
    
    // Update the arrays with the results
    this.playerUnits = result.updatedPlayerUnits;
    this.occupiedPlayerSquares = result.updatedOccupiedSquares;
    
    // Clear the specific area where the unit was and redraw everything
    this.renderBattle();
    
    return result.sellValue;
  }

  public showUnitStatsModal(unit: ISoldier): void {
    // Always get fresh stats when showing the modal
    this.updateModalWithUnitStats(unit);
    
    // Store reference to current unit for button actions
    ($ as any)("#unitStatsModal").data("selectedUnit", unit);
    
    // Show the modal
    ($ as any)("#unitStatsModal").modal("show");
  }

  public upgradeUnit(unit: ISoldier): void {
    this.unitManager.upgradeUnit(unit);

    // Update the modal with new stats
    this.updateModalWithUnitStats(unit);
    
    // Re-render to show updated state
    this.battleRenderer.renderPlayerSoldiers(this.playerUnits);
  }

  private updateModalWithUnitStats(unit: ISoldier): void {
    const stats = this.getUnitStats(unit);
    const upgradePreview = this.getUpgradePreview(unit);
    
    // Update modal with current unit stats
    ($ as any)("#unitCost").text(stats.cost);
    ($ as any)("#unitType").text(stats.type);
    ($ as any)("#unitLevel").text(stats.level);
    ($ as any)("#unitPower").text(stats.power);
    ($ as any)("#unitHP").text(stats.hp);
    ($ as any)("#unitExp").text(stats.exp);
    
    // Update upgrade preview
    ($ as any)("#upgradeCost").text(upgradePreview.cost);
    ($ as any)("#upgradeLevel").text(upgradePreview.level);
    ($ as any)("#upgradePower").text(upgradePreview.power);
    ($ as any)("#upgradeHP").text(upgradePreview.hp);
    ($ as any)("#upgradeExp").text(upgradePreview.exp);
  }

  public canAffordUpgrade(upgradeCost: number, playerGold: number): boolean {
    return this.unitManager.canAffordUpgrade(upgradeCost, playerGold);
  }

  public placeNewPlayerUnit(canvas: HTMLCanvasElement, event: MouseEvent): void {
    const result = this.unitManager.placeNewPlayerUnit(
      canvas, 
      event, 
      this.isBattleStarted, 
      this.playerUnits, 
      this.occupiedPlayerSquares
    );

    if (result.unit && result.gridKey) {
      // New unit was placed
      this.playerUnits.push(result.unit);
      this.occupiedPlayerSquares.push(result.gridKey);
      this.battleRenderer.renderPlayerSoldiers(this.playerUnits);
    } else if (result.unit && !result.gridKey) {
      // Existing unit was clicked - show stats modal
      this.showUnitStatsModal(result.unit);
    }
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

  public createCastles(selfPower: number, enemyPower: number): void {
    this.playerCastle = new Castle(selfPower, BATTLE_CONSTANTS.WORLD_X);
    this.enemyCastle = new Castle(enemyPower, this.mapWidth - BATTLE_CONSTANTS.WORLD_X);
    this.unitManager.updateCastles(this.playerCastle, this.enemyCastle);
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
    this.battleRenderer.drawWorld(this.imageArr);
    if (!this.isBattleStarted) {
      this.battleRenderer.drawStagingArea(this.playerTiles);
    }
    this.battleRenderer.renderPlayerSoldiers(this.playerUnits);
    this.battleRenderer.renderEnemySoldiers(this.enemyUnits);
    this.battleRenderer.drawCastleHealth(this.playerCastle!, this.enemyCastle!);
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
