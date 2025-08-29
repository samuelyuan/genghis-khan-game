import { Castle } from '../entities/Castle.js';
import { TerrainType, FormationUnit } from '../types/types.js';
import { Soldier as ISoldier } from '../entities/Soldier.js';
import { BATTLE_CONSTANTS, COLORS, UI_CONSTANTS, UNIT_CONSTANTS } from '../constants/GameConstants.js';

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

export class BattleRenderer {

  constructor(private ctx: CanvasRenderingContext2D) {}

  public drawWorld(imageArr: HTMLImageElement[]): void {
    this.ctx.fillStyle = COLORS.WORLD_BACKGROUND;

    this.ctx.drawImage(imageArr[0], 0, 104);
    this.ctx.drawImage(imageArr[1], 100, 104, 530, 297);
    this.ctx.drawImage(imageArr[2], 630, 104);

    // top border
    this.ctx.fillRect(0, 0, BATTLE_CONSTANTS.SCREEN_WIDTH, BATTLE_CONSTANTS.WORLD_Y);
    // bottom border
    this.ctx.fillRect(0, BATTLE_CONSTANTS.WORLD_Y + (BATTLE_CONSTANTS.TILE_ROW * BATTLE_CONSTANTS.TILE_WIDTH), BATTLE_CONSTANTS.SCREEN_WIDTH, BATTLE_CONSTANTS.SCREEN_HEIGHT);

    // Health bar region
    this.ctx.fillStyle = COLORS.HEALTH_BAR_BACKGROUND;
    this.ctx.fillRect(6, 406, 415-6, 424-406);

    this.ctx.beginPath();
    this.ctx.rect(0, 0, BATTLE_CONSTANTS.SCREEN_WIDTH, BATTLE_CONSTANTS.SCREEN_HEIGHT);
    this.ctx.stroke();
  }

  public drawStagingArea(playerTiles: Tile[]): void {
    for (let i = 0; i < playerTiles.length; i++) {
      const tileObj: Tile = playerTiles[i];
      // Display grid for player to place units
      this.ctx.fillStyle = COLORS.STAGING_AREA;
      this.ctx.fillRect(tileObj.x, tileObj.y, BATTLE_CONSTANTS.TILE_WIDTH-2, BATTLE_CONSTANTS.TILE_WIDTH-2);
    }
  }

  public renderSoldier(soldier: ISoldier, xStart: number, yStart: number, color: string): void {
    // Colored rectangle
    this.ctx.fillStyle = color;
    this.ctx.fillRect(xStart, yStart, BATTLE_CONSTANTS.TILE_WIDTH * (soldier.hitPoints / soldier.maxHitPoints), BATTLE_CONSTANTS.TILE_WIDTH);
    
    // Outline - simple black border for all units
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = COLORS.UNIT_OUTLINE;
    this.ctx.strokeRect(xStart, yStart, BATTLE_CONSTANTS.TILE_WIDTH, BATTLE_CONSTANTS.TILE_WIDTH);
    
    // Unit type abbreviation in center with background circle for better visibility
    
    // Draw background circle for unit type
    this.ctx.fillStyle = UNIT_CONSTANTS.UNIT_TYPE_COLORS[soldier.typeId];
    this.ctx.beginPath();
    this.ctx.arc(xStart + BATTLE_CONSTANTS.TILE_WIDTH / 2, yStart + BATTLE_CONSTANTS.TILE_WIDTH / 2, UI_CONSTANTS.UNIT_CIRCLE_RADIUS, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.strokeStyle = COLORS.UNIT_OUTLINE;
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
    
    // Unit type letter in center
    this.ctx.font = `bold ${UI_CONSTANTS.UNIT_FONT_SIZE}px Arial`;
    this.ctx.fillStyle = COLORS.UNIT_TEXT;
    this.ctx.textAlign = "center";
    this.ctx.fillText(UNIT_CONSTANTS.UNIT_TYPE_ABBR[soldier.typeId], xStart + BATTLE_CONSTANTS.TILE_WIDTH / 2, yStart + BATTLE_CONSTANTS.TILE_WIDTH / 2 + 4);
    
    // Level in top left corner
    this.ctx.font = `bold ${UI_CONSTANTS.UNIT_LEVEL_FONT_SIZE}px Arial`;
    this.ctx.fillStyle = COLORS.UNIT_TEXT;
    this.ctx.textAlign = "left";
    this.ctx.fillText(soldier.currentLevel.toString(), xStart + 4, yStart + 13);
    
    // Reset text alignment and line width
    this.ctx.textAlign = "left";
    this.ctx.lineWidth = 1;
  }

  public renderPlayerSoldiers(playerUnits: ISoldier[]): void {
    for (let i = 0; i < playerUnits.length; i++) {
      const soldier: ISoldier = playerUnits[i];
      const xStart: number = soldier.xPos;
      const yStart: number = soldier.yPos;
      this.renderSoldier(soldier, xStart, yStart, "#FF5100");
    }
  }

  public renderEnemySoldiers(enemyUnits: ISoldier[]): void {
    for (let i = 0; i < enemyUnits.length; i++) {
      const soldier: ISoldier = enemyUnits[i];
      const xStart: number = soldier.xPos - BATTLE_CONSTANTS.TILE_WIDTH / 2;
      const yStart: number = soldier.yPos - BATTLE_CONSTANTS.TILE_WIDTH / 2;
      this.renderSoldier(soldier, xStart, yStart, COLORS.ENEMY_UNIT);
    }
  }

  public drawCastleHealth(playerCastle: Castle, enemyCastle: Castle): void {
    const playerCastleHealthPercent: number = UI_CONSTANTS.HEALTH_BAR_PIXEL_WIDTH * (playerCastle.hitPoints / playerCastle.maxHitPoints);
    const enemyCastleHealthPercent: number = UI_CONSTANTS.HEALTH_BAR_PIXEL_WIDTH * (enemyCastle.hitPoints / enemyCastle.maxHitPoints);
    
    // Using jQuery for DOM manipulation (as in original code)
    ($ as any)("#itemCurrentCountryHealth").css("width", playerCastleHealthPercent + "px");
    ($ as any)("#itemEnemyCountryHealth").css("width", enemyCastleHealthPercent + "px");
  }
}
