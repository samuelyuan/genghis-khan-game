// Game Constants - Centralized configuration values
export const BATTLE_CONSTANTS = {
  TILE_WIDTH: 32,
  WORLD_X: 110,
  WORLD_Y: 108,
  TILE_ROW: 9,
  TILE_COLUMN: 9,
  MAP_WIDTH: 800,
  SCREEN_WIDTH: 800,
  SCREEN_HEIGHT: 600
} as const;

export const UNIT_CONSTANTS = {
  UNIT_TYPE_NAMES: ["Cavalry", "Pike", "Sword", "Bow"],
  UNIT_TYPE_ABBR: ["C", "P", "S", "B"],
  UNIT_TYPE_COLORS: ["#8B4513", "#228B22", "#4169E1", "#8B008B"]
} as const;

export const UNIT_SIZES = {
  CAVALRY: { width: 2, height: 1 },
  PIKE: { width: 1, height: 1 },
  SWORD: { width: 1, height: 1 },
  BOW: { width: 1, height: 1 }
} as const;

export const UI_CONSTANTS = {
  HEALTH_BAR_PIXEL_WIDTH: 100,
  UNIT_CIRCLE_RADIUS: 8,
  UNIT_FONT_SIZE: 12,
  UNIT_LEVEL_FONT_SIZE: 11
} as const;

export const COLORS = {
  PLAYER_UNIT: "#FF5100",
  ENEMY_UNIT: "#0051FF",
  STAGING_AREA: "#6E9E0D",
  WORLD_BACKGROUND: "#657051",
  HEALTH_BAR_BACKGROUND: "#000000",
  UNIT_OUTLINE: "#000000",
  UNIT_TEXT: "#FFFFFF"
} as const;
