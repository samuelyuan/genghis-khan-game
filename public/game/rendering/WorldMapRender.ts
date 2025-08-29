import { BattleScreenRender } from './BattleScreenRender.js';
import { MapCountries } from '../core/MapCountries.js';
import { Country } from '../types/types.js';

// Declare jvm namespace for the map library
declare namespace jvm {
  class Map {
    constructor(options: any);
    series: {
      regions: Array<{
        setValues: (values: any) => void;
      }>;
    };
  }
}

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
const interest = 0.1;

export class WorldMapRender {
  private countryData: Country[];
  private map: jvm.Map;
  public gold: number = 400;

  constructor(countryData: Country[]) {
    $("#battle-map").hide();

    self = this;

    this.countryData = countryData;
    this.map = this.buildMap(countryData);
    this.updateGold(400);

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

  private buildMap(countryData: Country[]): jvm.Map {
    return new jvm.Map({
      map: 'eurasia_map',
      container: $('#world-map-container'),
      series: {
        regions: [{
          attribute: 'fill',
          stroke: '#000000',
          "stroke-width": 1
        }]
      },
      regionStyle: {
        initial: {
        fill: "white",
       "fill-opacity": 1,
        }
      },
      markerStyle: {
        initial: {
          fill: '#F8E23B',
          stroke: '#383f47'
        }
      },
      markers: [
         {coords: [300, 95], name: 'Genghis Khan'}
      ],
      onRegionClick: (event: any, code: string) => {
        const conqueredCountryEntries = countryData.filter(entry => entry.isConquered);
        const conqueredCountryNames = conqueredCountryEntries.map(entry => entry.country);
        const reachableCountries = conqueredCountryEntries
          .map(entry => entry.neighbor)
          .flat()
          .filter(countryName => !conqueredCountryNames.includes(countryName));

        const clickedCountry = countryData.find(entry => entry.country === code);
        if (!clickedCountry) return;

        if (clickedCountry.isConquered) {
          this.showCountryModalConquered(clickedCountry);
        } else if (!reachableCountries.includes(code)) {
          this.showCountryModalUnreachable(clickedCountry);
        } else {
          this.showCountryModalBeforeWar(clickedCountry);
        }
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
    this.map.series.regions[0].setValues(this.generateColors());
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
        colors[entry.country] = "#FF6600";
      }
    });
  }

  private overrideCountriesOriginalColor(colors: Record<string, string>): void {
    // colors["Ocean"] = "#0051BB";
    colors["Ocean"] = "#202020";
    // Not in the scope of the game
    const NEUTRAL_COUNTRIES = [
      "Norway", "Sweden", "Finland", "Estonia", "Denmark",
      "Belgium", "United Kingdom", "Ireland", "Spain", "Portugal", "Iceland", "Luxembourg", "Netherlands",
      "Lebanon", "Armenia", "Georgia", "Azerbaijan", "Qatar",
      "Sri Lanka", "Indonesia", "Malaysia", "Papua New Guinea", "Philippines", "Taiwan", "Brunei"
    ];
    NEUTRAL_COUNTRIES.forEach(function(countryName) {
      colors[countryName] = "#CCCCCC";
    });
    colors["Albania"] = "#FFCC00";
    colors["Afghanistan"] = "#99CC66";
    colors["Austria"] = "#336F50";
    colors["Bangladesh"] = "#FD2D95";
    colors["Belarus"] = "#999900";
    colors["Bhutan"] = "#FF99FF";
    colors["Bosnia"] = "#66CC00";
    colors["Bulgaria"] = "#6699CC";
    colors["Cambodia"] = "#FFCC33";
    colors["China"] = "#C18787";
    colors["Croatia"] = "#33CCFF";
    colors["Czech"] = "#FF99FF";
    colors["France"] = "#FFCC00";
    colors["Germany"] = "#666600";
    colors["Greece"] = "#BA4B01";
    colors["Hungary"] = "#FF9999";
    colors["India"] = "#669900";
    colors["Iran"] = "#FF9966";
    colors["Iraq"] = "#669900";
    colors["Israel"] = "#FF9900";
    colors["Italy"] = "#66CC00";
    colors["Japan"] = "#66CC00";
    colors["Jordan"] = "#66FF00";
    colors["Kazakhstan"] = "#66CC00";
    colors["Kirghizstan"] = "#E4FD02";
    colors["Korea"] = "#FFCC66";
    colors["Kuwait"] = "#00CC99";
    colors["Laos"] = "#999966";
    colors["Latvia"] = "#99CC99";
    colors["Lithuania"] = "#66CC00";
    colors["Macedonia"] = "#FF66FF";
    colors["Mongolia"] = "#FF6600";
    colors["Moldavia"] = "#FB7BD6";
    colors["Montenegro"] = "#999900";
    colors["Myanmar"] = "#CCCC99";
    colors["Nepal"] = "#FFCC66";
    colors["Oman"] = "#999900";
    colors["Pakistan"] = "#FFCC00";
    colors["Poland"] = "#99CC99";
    colors["Romania"] = "#FF9966";
    colors["Russia"] = "#006666";
    colors["Saudi Arabia"] = "#CC9999";
    colors["Serbia"] = "#996600";
    colors["Slovakia"] = "#33CC00";
    colors["Slovenia"] = "#FF66FF";
    colors["Syria"] = "#FE6785";
    colors["Swiss"] = "#FF9999";
    colors["Tajikistan"] = "#FF99FF";
    colors["Thailand"] = "#FF99CC";
    colors["Turkey"] = "#78BB77";
    colors["Turkmenistan"] = "#996600";
    colors["Ukraine"] = "#FFCC66";
    colors["United Arab Emirates"] = "#FF9900";
    colors["Uzbekistan"] = "#009999";
    colors["Vietnam"] = "#FF9966";
    colors["Yemen"] = "#996600";
  }

  private handleBattleScreen(): void {
    $("#battle-map").show();
    this.map.series.regions[0].setValues(this.generateColors());
    
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
      
      const unitHtml = `
        <button type="button" class="btn ${buttonClass} btn-sm unit-type-btn" 
                data-unit-type="${unitType.id}" 
                data-toggle="tooltip" 
                data-html="true"
                data-placement="top" 
                title="${tooltipContent}"
                style="border-color: ${unitType.color}; color: ${unitType.color}; min-width: 80px;">
          <span class="badge" style="background-color: ${unitType.color}; color: white;">${unitType.abbr}</span>
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
      const bonusGold = goldBeforeBattle * interest;
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
    this.updateGold(400);
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
  $("#battle-map").hide();
  $("#world-map").show();

  battleScreenRender.resetAfterBattle();
  
  // Clear unit type selector
  $("#unitTypeSelector").empty();

  // Lose 10% of gold as a penalty
  self.updateGold(Math.floor(self.gold * 0.9));
});

