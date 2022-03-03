import { ArmyFormation } from './ArmyFormation.js';
import { UnitStats } from './UnitStats.js';

class MapCountries {
  constructor() {
    this.unitStats = new UnitStats();
    this.armyFormations = new ArmyFormation();
    this.countries = this.initCountries();
  }

  initCountries() {
    var allCountries = [];
    allCountries.push({isConquered:false,armyPower:this.getPower(1,this.getRandomNum(0,0)),land:"Plain",country:"China",neighbor:["Korea","Afghanistan","Pakistan","Tajikistan","Kirghizstan","Kazakhstan","Bhutan","India","Nepal","Myanmar","Laos","Vietnam","Japan","Russia","Mongolia"]});
    allCountries.push({isConquered:true,armyPower:this.getPower(1,this.getRandomNum(0,0)),land:"Grassland",country:"Mongolia",neighbor:["Russia","China"]});
    allCountries.push({isConquered:false,armyPower:this.getPower(6,this.getRandomNum(18,2)),land:"Grassland",country:"Russia",neighbor:["Korea","Latvia","Lithuania","Poland","Belarus","Ukraine","Syria","Turkey","Iran","Tajikistan","Kazakhstan","Mongolia","China","Japan"]});
    allCountries.push({isConquered:false,armyPower:this.getPower(2,this.getRandomNum(1,2)),land:"Mountain",country:"Japan",neighbor:["China","Korea"]});
    allCountries.push({isConquered:false,armyPower:this.getPower(1,this.getRandomNum(3,2)),land:"Mountain",country:"Korea",neighbor:["Russia","China","Japan"]});
    allCountries.push({isConquered:false,armyPower:this.getPower(4,this.getRandomNum(5,2)),land:"Mountain",country:"Vietnam",neighbor:["Myanmar","Thailand","Cambodia","Laos","China"]});
    allCountries.push({isConquered:false,armyPower:this.getPower(2,this.getRandomNum(2,2)),land:"Mountain",country:"Laos",neighbor:["Myanmar","Thailand","Cambodia","Vietnam","China"]});
    allCountries.push({isConquered:false,armyPower:this.getPower(1,this.getRandomNum(3,2)),land:"Forest",country:"Cambodia",neighbor:["Thailand","Laos","Vietnam"]});
    allCountries.push({isConquered:false,armyPower:this.getPower(4,this.getRandomNum(5,2)),land:"Grassland",country:"Thailand",neighbor:["Myanmar","Cambodia","Laos","Vietnam"]});
    allCountries.push({isConquered:false,armyPower:this.getPower(5,this.getRandomNum(4,2)),land:"Forest",country:"Myanmar",neighbor:["Bangladesh","India","Thailand","Laos","Vietnam","China"]});
    allCountries.push({isConquered:false,armyPower:this.getPower(4,this.getRandomNum(1,2)),land:"Mountain",country:"Nepal",neighbor:["Bangladesh","India","China"]});
    allCountries.push({isConquered:false,armyPower:this.getPower(6,this.getRandomNum(15,2)),land:"Plain",country:"India",neighbor:["Pakistan","Bhutan","Bangladesh","Nepal","Myanmar","China"]});
    allCountries.push({isConquered:false,armyPower:this.getPower(1,this.getRandomNum(4,2)),land:"Forest",country:"Bangladesh",neighbor:["India","Nepal","Myanmar"]});
    allCountries.push({isConquered:false,armyPower:this.getPower(1,this.getRandomNum(3,2)),land:"Forest",country:"Bhutan",neighbor:["India","China"]});
    allCountries.push({isConquered:false,armyPower:this.getPower(6,this.getRandomNum(15,2)),land:"Grassland",country:"Kazakhstan",neighbor:["Turkmenistan","Tajikistan","Kirghizstan","Uzbekistan","Russia","China"]});
    allCountries.push({isConquered:false,armyPower:this.getPower(5,this.getRandomNum(9,3)),land:"Grassland",country:"Uzbekistan",neighbor:["Turkmenistan","Afghanistan","Tajikistan","Kazakhstan"]});
    allCountries.push({isConquered:false,armyPower:this.getPower(1,this.getRandomNum(8,2)),land:"Grassland",country:"Kirghizstan",neighbor:["Tajikistan","Kazakhstan","China"]});
    allCountries.push({isConquered:false,armyPower:this.getPower(4,this.getRandomNum(4,2)),land:"Grassland",country:"Tajikistan",neighbor:["Afghanistan","Pakistan","Kirghizstan","Uzbekistan","Kazakhstan","China"]});
    allCountries.push({isConquered:false,armyPower:this.getPower(5,this.getRandomNum(10,2)),land:"Mountain",country:"Pakistan",neighbor:["Turkmenistan","Iran","Afghanistan","Tajikistan","India","China"]});
    allCountries.push({isConquered:false,armyPower:this.getPower(3,this.getRandomNum(11,2)),land:"Mountain",country:"Afghanistan",neighbor:["Turkmenistan","Iran","Pakistan","Tajikistan","Uzbekistan","China"]});
    allCountries.push({isConquered:false,armyPower:this.getPower(6,this.getRandomNum(10,2)),land:"Plain",country:"Iran",neighbor:["United Arab Emirates","Kuwait","Oman","Iraq","Turkey","Turkmenistan","Afghanistan","Pakistan","Russia"]});
    allCountries.push({isConquered:false,armyPower:this.getPower(5,this.getRandomNum(11,2)),land:"Mountain",country:"Turkmenistan",neighbor:["Iran","Afghanistan","Pakistan","Uzbekistan","Kazakhstan"]});
    allCountries.push({isConquered:false,armyPower:this.getPower(6,this.getRandomNum(12,2)),land:"Mountain",country:"Turkey",neighbor:["Bulgaria","Greece","Iraq","Syria","Iran","Russia"]});
    allCountries.push({isConquered:false,armyPower:this.getPower(6,this.getRandomNum(12,2)),land:"Mountain",country:"Syria",neighbor:["Jordan","Iraq","Turkey","Russia"]});
    allCountries.push({isConquered:false,armyPower:this.getPower(5,this.getRandomNum(15,2)),land:"Plain",country:"Iraq",neighbor:["Jordan","Kuwait","Saudi Arabia","Syria","Turkey","Iran"]});
    allCountries.push({isConquered:false,armyPower:this.getPower(6,this.getRandomNum(16,2)),land:"Plain",country:"Saudi Arabia",neighbor:["Israel","United Arab Emirates","Jordan","Kuwait","Oman","Yemen","Iraq"]});
    allCountries.push({isConquered:false,armyPower:this.getPower(5,this.getRandomNum(11,2)),land:"Plain",country:"Yemen",neighbor:["Oman","Saudi Arabia"]});
    allCountries.push({isConquered:false,armyPower:this.getPower(6,this.getRandomNum(12,2)),land:"Plain",country:"Oman",neighbor:["United Arab Emirates","Yemen","Saudi Arabia"]});
    allCountries.push({isConquered:false,armyPower:this.getPower(4,this.getRandomNum(10,2)),land:"Plain",country:"Kuwait",neighbor:["Saudi Arabia","Iraq","Iran"]});
    allCountries.push({isConquered:false,armyPower:this.getPower(5,this.getRandomNum(14,2)),land:"Plain",country:"Jordan",neighbor:["Israel","Saudi Arabia","Iraq","Syria"]});
    allCountries.push({isConquered:false,armyPower:this.getPower(5,this.getRandomNum(14,2)),land:"Plain",country:"United Arab Emirates",neighbor:["Oman","Saudi Arabia"]});
    allCountries.push({isConquered:false,armyPower:this.getPower(6,this.getRandomNum(16,2)),land:"Plain",country:"Israel",neighbor:["Jordan","Saudi Arabia"]});
    allCountries.push({isConquered:false,armyPower:this.getPower(6,this.getRandomNum(18,4)),land:"Mountain",country:"Greece",neighbor:["Macedonia","Albania","Bulgaria","Turkey"]});
    allCountries.push({isConquered:false,armyPower:this.getPower(3,this.getRandomNum(12,2)),land:"Mountain",country:"Bulgaria",neighbor:["Serbia","Macedonia","Ukraine","Romania","Greece","Turkey","Russia"]});
    allCountries.push({isConquered:false,armyPower:this.getPower(5,this.getRandomNum(15,2)),land:"Mountain",country:"Romania",neighbor:["Hungary","Serbia","Ukraine","Moldavia","Bulgaria"]});
    allCountries.push({isConquered:false,armyPower:this.getPower(6,this.getRandomNum(12,2)),land:"Mountain",country:"Moldavia",neighbor:["Ukraine","Romania","Russia"]});
    allCountries.push({isConquered:false,armyPower:this.getPower(6,this.getRandomNum(16,2)),land:"Grassland",country:"Ukraine",neighbor:["Hungary","Slovakia","Poland","Belarus","Moldavia","Romania","Bulgaria","Russia"]});
    allCountries.push({isConquered:false,armyPower:this.getPower(5,this.getRandomNum(14,2)),land:"Grassland",country:"Belarus",neighbor:["Latvia","Lithuania","Poland","Ukraine"]});
    allCountries.push({isConquered:false,armyPower:this.getPower(6,this.getRandomNum(9,2)),land:"Forest",country:"Albania",neighbor:["Montenegro","Serbia","Macedonia","Greece"]});
    allCountries.push({isConquered:false,armyPower:this.getPower(5,this.getRandomNum(11,2)),land:"Forest",country:"Macedonia",neighbor:["Serbia","Albania","Bulgaria","Greece"]});
    allCountries.push({isConquered:false,armyPower:this.getPower(6,this.getRandomNum(13,2)),land:"Mountain",country:"Serbia",neighbor:["Montenegro","Bosnia","Croatia","Hungary","Macedonia","Albania","Romania","Bulgaria"]});
    allCountries.push({isConquered:false,armyPower:this.getPower(2,this.getRandomNum(16,2)),land:"Mountain",country:"Poland",neighbor:["Hungary","Slovakia","Czech","Austria","Germany","Lithuania","Belarus","Ukraine","Russia"]});
    allCountries.push({isConquered:false,armyPower:this.getPower(5,this.getRandomNum(12,2)),land:"Mountain",country:"Lithuania",neighbor:["Latvia","Poland","Belarus","Russia"]});
    allCountries.push({isConquered:false,armyPower:this.getPower(6,this.getRandomNum(11,2)),land:"Mountain",country:"Latvia",neighbor:["Lithuania","Belarus","Russia"]});
    allCountries.push({isConquered:false,armyPower:this.getPower(5,this.getRandomNum(16,2)),land:"Mountain",country:"Italy",neighbor:["Swiss","Austria"]});
    allCountries.push({isConquered:false,armyPower:this.getPower(6,this.getRandomNum(18,2)),land:"Plain",country:"Germany",neighbor:["Swiss","France","Czech","Austria","Poland"]});
    allCountries.push({isConquered:false,armyPower:this.getPower(5,this.getRandomNum(12,2)),land:"Mountain",country:"Austria",neighbor:["Swiss","Slovenia","Hungary","Slovakia","Czech","Germany","Italy","Poland"]});
    allCountries.push({isConquered:false,armyPower:this.getPower(5,this.getRandomNum(12,2)),land:"Grassland",country:"Czech",neighbor:["Slovakia","Austria","Germany","Poland"]});
    allCountries.push({isConquered:false,armyPower:this.getPower(4,this.getRandomNum(11,2)),land:"Grassland",country:"Slovakia",neighbor:["Hungary","Czech","Austria","Poland","Ukraine"]});
    allCountries.push({isConquered:false,armyPower:this.getPower(5,this.getRandomNum(14,2)),land:"Grassland",country:"Hungary",neighbor:["Bosnia","Croatia","Slovenia","Slovakia","Austria","Poland","Serbia","Ukraine","Romania"]});
    allCountries.push({isConquered:false,armyPower:this.getPower(4,this.getRandomNum(12,2)),land:"Grassland",country:"Slovenia",neighbor:["Croatia","Hungary","Austria"]});
    allCountries.push({isConquered:false,armyPower:this.getPower(5,this.getRandomNum(11,2)),land:"Mountain",country:"Croatia",neighbor:["Bosnia","Slovenia","Hungary","Serbia"]});
    allCountries.push({isConquered:false,armyPower:this.getPower(6,this.getRandomNum(13,2)),land:"Grassland",country:"Bosnia",neighbor:["Montenegro","Croatia","Hungary","Serbia"]});
    allCountries.push({isConquered:false,armyPower:this.getPower(5,this.getRandomNum(15,2)),land:"Grassland",country:"France",neighbor:["Swiss","Germany"]});
    allCountries.push({isConquered:false,armyPower:this.getPower(5,this.getRandomNum(10,2)),land:"Mountain",country:"Swiss",neighbor:["France","Austria","Germany","Italy"]});
    allCountries.push({isConquered:false,armyPower:this.getPower(5,this.getRandomNum(12,2)),land:"Mountain",country:"Montenegro",neighbor:["Bosnia","Serbia","Albania"]});
    return allCountries;
  }

  getPower(typeId, level) {
    var formationId = Math.ceil(Math.random() * 10) + (typeId - 1) * 10;
    var power = 0;
    var numSoldiers = 6 + (typeId * 2);
    var formationData = this.armyFormations.data["shape" + formationId];
    var levelArr = [];
    for (var i = 0; i < formationData.length; i++) {
      var unitTypeId = formationData[i].typeId;
      var randomOffset = (Math.random() - Math.random()) * 3;
      var weightedLevel = Math.floor((level * this.unitStats.globalHardRate) + randomOffset);
      if (weightedLevel < 0) {
        weightedLevel = 0;
      }
      var powerFromUnit = this.unitStats.getCountryPower(
        this.unitStats.unitCost[unitTypeId],
        this.unitStats.unitCostUpgradeRate[unitTypeId],
        weightedLevel
      );
      levelArr.push(weightedLevel);
      power += (powerFromUnit * 5);
    }

    return {
      power: power,
      numSoldiers: numSoldiers,
      shape: formationData,
      level: levelArr
    };
  }

  getRandomNum(baseNum, num) {
    return baseNum + Math.floor(Math.random() * num);
  }
}

export { MapCountries }
