import { BattleScreenRender } from './BattleScreenRender.js';
import { MapCountries } from './MapCountries.js'

var canvas = $("#battleScreen");
var ctx = canvas[0].getContext("2d");
var battleScreenRender = new BattleScreenRender(ctx);
canvas[0].addEventListener('mousedown', function(e) {
  battleScreenRender.placeNewPlayerUnit(canvas[0], e);
});
var selectedCountryEntry = null;
var self;
const interest = 0.1;

class WorldMapRender {
  constructor(countryData) {
    $("#battle-map").hide();

    self = this;

    self.countryData = countryData;
    self.map = self.buildMap(countryData);
    self.updateGold(400);

    // Audio logic
    const audioButton = $("#audioButton");
    const audio = document.querySelector("audio");
    audioButton.click(function() {
      if (audio.paused) {
        audio.volume = 0.2;
        audio.play();
        audioButton.text("Disable audio");
      } else {
        audio.pause();
        audioButton.text("Enable audio");
      }
    });
  }

  showCountryModalConquered(entry) {
    var modal = $('#countryModalInvalid');
    modal.find('.modal-title').text(entry.country);
    modal.find('.modal-body').text("This country has already been conquered.");
    modal.modal();
  }

  showCountryModalUnreachable(entry) {
    var modal = $('#countryModalInvalid');
    modal.find('.modal-title').text(entry.country);
    modal.find('.modal-body').text("This country is not reachable.");
    modal.modal();
  }

  showCountryModalBeforeWar(entry) {
    var modal = $('#countryModal');
    modal.find('.modal-title').text(entry.country);
    var modalBodyText = "<b>Land:</b> " + entry.land + "<br/>"
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

  buildMap(countryData) {
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
      onRegionClick: function (event, code) {
        var conqueredCountryEntries = countryData.filter(entry => entry.isConquered);
        var conqueredCountryNames = conqueredCountryEntries.map(entry => entry.country);
        var reachableCountries = conqueredCountryEntries
          .map(entry => entry.neighbor)
          .flat()
          .filter(countryName => !conqueredCountryNames.includes(countryName));

        countryData.forEach(function(entry) {
          if (code == entry.country) {
            if (entry.isConquered) {
              self.showCountryModalConquered(entry);
              return;
            }
            if (!reachableCountries.includes(entry.country)) {
              self.showCountryModalUnreachable(entry);
              return;
            }
            self.showCountryModalBeforeWar(entry);
          }
        })

      },
      onRegionTipShow: function(event, element, code){
        if (code == "Ocean") {
          event.preventDefault();
        }

        countryData.forEach(function(entry) {
          if (code == entry.country) {
            var text = element.html() + "<br/>"
              + "Land: " + entry.land + "<br/>"
              + "Power: " + entry.armyPower.power + "<br/>"
              + "Formations: " + entry.armyPower.numSoldiers;
            element.html(text);
          }
        })
      },
      onRegionOver: function(event, code) {
        if (code == "Ocean") {
          event.preventDefault();
        }
      }
    });
  }

  updateMapColors() {
    // Overwrite region colors
    this.map.series.regions[0].setValues(this.generateColors());
  }

  generateColors() {
    var colors = {};
    this.overrideCountriesOriginalColor(colors);
    this.changeConqueredCountriesNewColor(colors);
    return colors;
  };

  changeConqueredCountriesNewColor(colors) {
    this.countryData.forEach(function(entry) {
      if (entry.isConquered) {
        colors[entry.country] = "#FF6600";
      }
    });
  }

  overrideCountriesOriginalColor(colors) {
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
    })
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

  handleBattleScreen() {
    $("#battle-map").show();
    $("#world-map").hide();
    var canvas = $("#battleScreen");
    canvas.show();
    var ctx = canvas[0].getContext("2d");

    var selfPower = battleScreenRender.calculateCountryPower(self.gold * 5);
    var enemyPower = selectedCountryEntry.armyPower.power;

    // Modify health bars below battle screen
    $("#itemCurrentCountryName").text("Genghis Khan");
    $("#itemTerrain").text(selectedCountryEntry.land);
    $("#itemEnemyCountryName").text(selectedCountryEntry.country);

    battleScreenRender.createWorld(selectedCountryEntry.country, selectedCountryEntry.land);
    battleScreenRender.createCastles(selfPower, enemyPower);
    battleScreenRender.addEnemies(selectedCountryEntry.armyPower.shape, selectedCountryEntry.armyPower.level);

    battleScreenRender.renderBattle();
  }

  battleWon() {
    $("#battle-map").hide();
    $("#world-map").show();
    var goldBeforeBattle = self.gold;

    selectedCountryEntry.isConquered = true;
    var bonusGold = goldBeforeBattle * interest;
    self.updateGold(self.gold + Math.floor(bonusGold));
    self.updateMapColors();

    battleScreenRender.resetAfterBattle();

    var conqueredWorld = self.countryData.every((country) => country.isConquered);
    if (conqueredWorld) {
      self.resetGame();

      var modal = $('#newGameModal');
      modal.find('.modal-title').text("Victory");
      modal.find('.modal-body').text("You have conquered the entire known world.");
      modal.find("#newGame").on("click", function() {
        $("#battle-map").hide();
        $("#world-map").show();
      });
      modal.modal();
    }
  }

  battleLost() {
    self.resetGame();

    var modal = $('#newGameModal');
    modal.find('.modal-title').text("Game Over");
    modal.find('.modal-body').text("Your empire has been destroyed.");
    modal.find("#newGame").on("click", function() {
      $("#battle-map").hide();
      $("#world-map").show();
    });
    modal.modal();
  }

  resetGame() {
    battleScreenRender.resetGame();
    // Reset game
    for (var i = 0; i < self.countryData.length; i++) {
      if (self.countryData[i].country !== "Mongolia") {
        self.countryData[i].isConquered = false;
      }
    }
    // Reset gold to default value
    self.updateGold(400);
    // Restore map to original
    self.updateMapColors();
  }

  updateGold(gold) {
    self.gold = gold;
    var power = battleScreenRender.calculateCountryPower(self.gold * 5);
    var conqueredCountries = self.countryData.filter((country) => country.isConquered).length;
    var totalCountries = self.countryData.length;
    $("#homeCountryStatus").html("<b>Country:</b> Mongolia"
      + ", <b>Power:</b> " + power
      + ", <b>Gold:</b> " + self.gold
      + ", <b>Conquered:</b> " + conqueredCountries + "/" + totalCountries);
  }

  gameLoop(timestamp) {
    battleScreenRender.runMainLoop()

    var winChance = Math.random();
    if (battleScreenRender.isVictory) {
      self.battleWon();
    } else if (battleScreenRender.isGameOver) {
      self.battleLost();
    } else {
      window.requestAnimationFrame(self.gameLoop.bind(self));
    }
  }
}

$("#buttonFightBattle").click(function() {
  battleScreenRender.initBattle();
  self.gameLoop(0);
});

$("#buttonRetreatBattle").click(function() {
  $("#battle-map").hide();
  $("#world-map").show();

  battleScreenRender.resetAfterBattle();

  // Lose 10% of gold as a penalty
  self.updateGold(Math.floor(self.gold * 0.9));
});

export { WorldMapRender };
