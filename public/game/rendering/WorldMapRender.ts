import { BattleScreenRender } from './BattleScreenRender.js';
import { MapCountries } from '../core/MapCountries.js';
import { Country } from '../types/types.js';
import { MAP_CONFIG } from '../config/MapConfig.js';
import { GAME_SETTINGS, SCREEN_DIMENSIONS } from '../constants/GameConstants.js';
import { IMapRenderer } from '../interfaces/IMapRenderer.js';
import { MapRendererFactory } from './factories/MapRendererFactory.js';

// Extend jQuery to include modal method
declare global {
  interface JQuery {
    modal(action?: string): JQuery;
  }
}

const canvas = $("#battleScreen");
const ctx = (canvas[0] as HTMLCanvasElement).getContext("2d");
const battleScreenRender = new BattleScreenRender(ctx!);

canvas[0].addEventListener('mousedown', function(e) {
  battleScreenRender.placeNewPlayerUnit(canvas[0] as HTMLCanvasElement, e);
});

canvas[0].addEventListener('mousemove', function(e) {
  battleScreenRender.handleMouseMove(canvas[0] as HTMLCanvasElement, e);
});

canvas[0].addEventListener('mouseleave', function() {
  battleScreenRender.handleMouseLeave();
});

// Unit stats modal event handlers
$("#upgradeUnit").on("click", function() {
  const selectedUnit = $("#unitStatsModal").data("selectedUnit");
  if (selectedUnit) {
    battleScreenRender.upgradeUnit(selectedUnit);
  }
});

$("#sellUnit").on("click", function() {
  const selectedUnit = $("#unitStatsModal").data("selectedUnit");
  if (selectedUnit) {
    const sellValue = battleScreenRender.sellUnit(selectedUnit);
    // Update gold
    self.updateGold(self.gold + sellValue);
    $("#unitStatsModal").modal("hide");
  }
});

// Keyboard shortcuts for unit actions
$(document).on("keydown", function(e) {
  // Only handle shortcuts when unit modal is open
  if ($("#unitStatsModal").hasClass("show")) {
    if (e.key.toLowerCase() === 's') {
      e.preventDefault();
      $("#sellUnit").click();
    } else if (e.key.toLowerCase() === 'u') {
      e.preventDefault();
      $("#upgradeUnit").click();
    }
  }
});

// Clear selection when modal is closed
$("#unitStatsModal").on("hidden.bs.modal", function() {
  battleScreenRender.renderBattle();
});

let selectedCountryEntry: Country | null = null;
let self: WorldMapRender;

export class WorldMapRender {
  private countryData: Country[];
  private mapRenderer: IMapRenderer;
  public gold: number = GAME_SETTINGS.STARTING_GOLD;

  constructor(countryData: Country[]) {
    $("#battle-map").hide();

    self = this;

    this.countryData = countryData;
    this.mapRenderer = MapRendererFactory.createDefaultMapRenderer($('#world-map-container'));
    this.mapRenderer.buildMap(countryData);
    this.setupMapEventHandlers();
    this.updateGold(GAME_SETTINGS.STARTING_GOLD);

    // Audio logic
    const audioButton = $("#audioButton");
    const audio = document.querySelector("audio");
    audioButton.click(function() {
      if (audio && !audio.paused) {
        audio.pause();
        audioButton.text("Enable audio");
      } else if (audio) {
        audio.volume = 0.2;
        audio.play();
        audioButton.text("Disable audio");
      }
    });
  }

  showCountryModalConquered(entry: Country): void {
    const modal = $('#countryModalInvalid');
    modal.find('.modal-title').text(entry.country);
    modal.find('.modal-body').text("This country has already been conquered.");
    modal.modal();
  }

  showCountryModalUnreachable(entry: Country): void {
    const modal = $('#countryModalInvalid');
    modal.find('.modal-title').text(entry.country);
    modal.find('.modal-body').text("This country is not reachable.");
    modal.modal();
  }

  showCountryModalBeforeWar(entry: Country): void {
    const modal = $('#countryModal');
    modal.find('.modal-title').text(entry.country);
    const modalBodyText = "<b>Land:</b> " + entry.land + "<br/>"
    + "<b>Power:</b> " + entry.armyPower.power + "<br/>"
    + "<b>Formations:</b> " + entry.armyPower.numSoldiers;
    modal.find('.modal-body').html(modalBodyText);
    modal.find("#declareWar").on("click", function() {
      $("#world-map").hide();
      selectedCountryEntry = entry;
      self.handleBattleScreen();
    });
    modal.modal();
  }

  private setupMapEventHandlers(): void {
    this.mapRenderer.onRegionClick((code: string) => {
      const conqueredCountryEntries = this.countryData.filter(entry => entry.isConquered);
      const conqueredCountryNames = conqueredCountryEntries.map(entry => entry.country);
      const reachableCountries = conqueredCountryEntries
        .map(entry => entry.neighbor)
        .flat()
        .filter(countryName => !conqueredCountryNames.includes(code));

      const clickedCountry = this.countryData.find(entry => entry.country === code);
      if (!clickedCountry) return;

      if (clickedCountry.isConquered) {
        this.showCountryModalConquered(clickedCountry);
      } else if (!reachableCountries.includes(code)) {
        this.showCountryModalUnreachable(clickedCountry);
      } else {
        this.showCountryModalBeforeWar(clickedCountry);
      }
    });
  }

  public updateGold(amount: number): void {
    this.gold = amount;
    const power = battleScreenRender.calculateCountryPower(this.gold * 5);
    const conqueredCountries = this.countryData.filter((country) => country.isConquered).length;
    const totalCountries = this.countryData.length;
    $("#homeCountryStatus").html(`<b>Country:</b> Mongolia, <b>Power:</b> ${power}, <b>Gold:</b> ${this.gold}, <b>Conquered:</b> ${conqueredCountries}/${totalCountries}`);
  }

  public updateMapColors(): void {
    // Overwrite region colors
    this.mapRenderer.updateColors(this.generateColors());
  }

  private generateColors(): Record<string, string> {
    const colors: Record<string, string> = {};
    this.overrideCountriesOriginalColor(colors);
    this.changeConqueredCountriesNewColor(colors);
    return colors;
  }

  private changeConqueredCountriesNewColor(colors: Record<string, string>): void {
    this.countryData.forEach(function(entry) {
      if (entry.isConquered) {
        colors[entry.country] = MAP_CONFIG.COLORS.CONQUERED;
      }
    });
  }

  private overrideCountriesOriginalColor(colors: Record<string, string>): void {
    // colors["Ocean"] = "#0051BB";
    colors["Ocean"] = MAP_CONFIG.COLORS.OCEAN;
    // Not in the scope of the game
    MAP_CONFIG.NEUTRAL_COUNTRIES.forEach(function(countryName) {
      colors[countryName] = MAP_CONFIG.COLORS.NEUTRAL;
    });
    // Set country colors from MAP_CONFIG
    Object.entries(MAP_CONFIG.COUNTRY_COLORS).forEach(([countryName, color]) => {
      colors[countryName] = color;
    });
  }

  private handleBattleScreen(): void {
    $("#battle-map").show();
    this.mapRenderer.updateColors(this.generateColors());
    
    if (selectedCountryEntry) {
      this.startBattle(selectedCountryEntry);
    }
  }

  private startBattle(countryEntry: Country): void {
    // Battle logic implementation
    console.log("Starting battle with", countryEntry.country);
    
    // Initialize the battle world and castles
    const selfPower = this.gold * 5; // Calculate player power based on gold
    const enemyPower = countryEntry.armyPower.power;
    
    // Create the world and castles
    battleScreenRender.createWorld(countryEntry.country, countryEntry.land);
    battleScreenRender.createCastles(selfPower, enemyPower);
    
    // Create enemy units using the country's army formation
    battleScreenRender.addEnemies(countryEntry.armyPower.shape, countryEntry.armyPower.level);
    
    // Set the country names for the health bars
    battleScreenRender.setCountryNames("Mongolia", countryEntry.country);
    
    // Set the terrain information
    battleScreenRender.setTerrainInfo(countryEntry.land);
    
    // Generate unit type selector
    this.generateUnitTypeSelector();
    
    // Now render the battle
    battleScreenRender.renderBattle();
  }

  private generateUnitTypeSelector(): void {
    const unitTypes = battleScreenRender.getUnitTypeInfo();
    const selector = $("#unitTypeSelector");
    
    // Destroy existing tooltips before clearing
    (selector.find('[data-toggle="tooltip"]') as any).tooltip('dispose');
    selector.empty();
    
    unitTypes.forEach(unitType => {
      const isSelected = unitType.id === battleScreenRender.getSelectedUnitType();
      const buttonClass = isSelected ? 'btn-primary' : 'btn-outline-secondary';
      const selectedIndicator = isSelected ? '✓ ' : '';
      
      // Create tooltip content with detailed stats
      const tooltipContent = `Cost: ${unitType.cost} | HP: ${unitType.hp} | Power: ${unitType.power}<br>${unitType.terrainBonus}`;
      
      // Use sprite images for all unit types now
      let unitIcon = '';
      let spritePath = '';
      
      switch (unitType.id) {
        case 0: // Cavalry
          spritePath = '/img/mongol_cavalry.png';
          break;
        case 1: // Pike
          spritePath = '/img/mongol_pike.png';
          break;
        case 2: // Sword
          spritePath = '/img/mongol_sword.png';
          break;
        case 3: // Bow
          spritePath = '/img/mongol_bow.png';
          break;
        default:
          spritePath = '/img/mongol_pike.png'; // fallback
      }
      
      unitIcon = `<img src="${spritePath}" alt="${unitType.name}" style="width: 20px; height: 20px; margin-right: 5px; vertical-align: middle;">`;
      
      const unitHtml = `
        <button type="button" class="btn ${buttonClass} btn-sm unit-type-btn" 
                data-unit-type="${unitType.id}" 
                data-toggle="tooltip" 
                data-html="true"
                data-placement="top" 
                title="${tooltipContent}"
                style="border-color: ${unitType.color}; color: ${unitType.color}; min-width: 80px;">
          ${unitIcon}
          <strong>${selectedIndicator}${unitType.name}</strong>
        </button>
      `;
      
      selector.append(unitHtml);
    });
    
    // Add click handlers for unit type selection
    $(".unit-type-btn").on("click", function() {
      const unitTypeId = parseInt($(this).data("unit-type"));
      battleScreenRender.setSelectedUnitType(unitTypeId);
      
      // Update button styles and regenerate selector to show new selection
      self.generateUnitTypeSelector();
    });
    
    // Initialize Bootstrap tooltips
    ($('[data-toggle="tooltip"]') as any).tooltip();
  }

  public battleWon(): void {
    $("#battle-map").hide();
    $("#world-map").show();
    const goldBeforeBattle = this.gold;

    if (selectedCountryEntry) {
      selectedCountryEntry.isConquered = true;
      const bonusGold = goldBeforeBattle * GAME_SETTINGS.INTEREST_RATE;
      this.updateGold(this.gold + Math.floor(bonusGold));
      this.updateMapColors();
    }

    // Reset battle screen
    battleScreenRender.resetAfterBattle();
    
    // Clear unit type selector
    $("#unitTypeSelector").empty();

    const conqueredWorld = this.countryData.every((country) => country.isConquered);
    if (conqueredWorld) {
      const modal = $('#newGameModal');
      modal.find('.modal-title').text("Victory");
      modal.find('.modal-body').text("You have conquered the entire known world.");
      modal.find("#newGame").on("click", () => {
        $("#battle-map").hide();
        $("#world-map").show();
        this.resetGame();
      });
      modal.modal();
    }
  }

  public battleLost(): void {
    this.resetGame();

    const modal = $('#newGameModal');
    modal.find('.modal-title').text("Game Over");
    modal.find('.modal-body').text("Your empire has been destroyed.");
    modal.find("#newGame").on("click", () => {
      $("#battle-map").hide();
      $("#world-map").show();
    });
    modal.modal();
  }

  public resetGame(): void {
    battleScreenRender.resetGame();
    // Reset game
    for (let i = 0; i < this.countryData.length; i++) {
      if (this.countryData[i].country !== "Mongolia") {
        this.countryData[i].isConquered = false;
      }
    }
    // Reset gold to default value
    this.updateGold(GAME_SETTINGS.STARTING_GOLD);
    // Restore map to original
    this.updateMapColors();
  }

  public gameLoop(timestamp: number): void {
    battleScreenRender.runMainLoop();

    const winChance = Math.random();
    if (battleScreenRender.isVictory) {
      this.battleWon();
    } else if (battleScreenRender.isGameOver) {
      this.battleLost();
    } else {
      window.requestAnimationFrame(this.gameLoop.bind(this));
    }
  }

  // Additional methods can be added here as needed
}

// Event handlers for battle buttons
$("#buttonFightBattle").click(function() {
  battleScreenRender.initBattle();
  self.gameLoop(0);
});

$("#buttonRetreatBattle").click(function() {
  // Calculate and display the penalty amount
  const penaltyAmount = Math.floor(self.gold * GAME_SETTINGS.RETREAT_PENALTY);
  $("#retreatPenaltyAmount").text(penaltyAmount);
  
  // Show the confirmation modal
  $("#retreatConfirmModal").modal();
});

// Handle confirmed retreat
$("#confirmRetreat").click(function() {
  $("#retreatConfirmModal").modal('hide');
  
  $("#battle-map").hide();
  $("#world-map").show();

  battleScreenRender.resetAfterBattle();
  
  // Clear unit type selector
  $("#unitTypeSelector").empty();

  // Lose gold as a penalty for retreating
  self.updateGold(Math.floor(self.gold * (1 - GAME_SETTINGS.RETREAT_PENALTY)));
});

