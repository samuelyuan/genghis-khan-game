class UnitStats {
  constructor() {
    this.globalHardRate = 0.6;
    this.levelUnit = 100;
    this.expUnit = 50;
    this.upDRate = 0.003;
    this.minRate = 0.05;
    this.unitCost = [60, 25, 20, 25, 20];
    this.unitCostUpgradeRate = [0.15, 0.18, 0.18, 0.2];

    this.roleTypes = ["cavalry", "pike", "sword", "bow", "medic"];
    this.hitPoints = [300, 200, 200, 100, 100];
    this.hpUpgradeRates = [0.1, 0.15, 0.1, 0.15];
    this.power = [20, 12, 8, 10, 10];
    this.powerUpRate = [0.15, 0.15, 0.15, 0.2];

    this.cavalryRate = {Plain:0.1, Forest:-0.4, Grassland:0.2, Mountain:-0.5};
    this.pikeRate = {Plain:0.15, Forest:-0.1, Grassland:0.1, Mountain:0.05};
    this.swordRate = {Plain:-0.05, Forest:0.05, Grassland:-0.1, Mountain:0};
    this.bowRate = {Plain:0.2, Forest:-0.15, Grassland:0.15, Mountain:0};
    this.cavalryPowerRate = {Plain:0.15, Forest:-0.4, Grassland:0.3, Mountain:-0.4};
    this.pikePowerRate = {Plain:0.2, Forest:-0.3, Grassland:0.1, Mountain:0.05};
    this.swordPowerRate = {Plain:-0.05, Forest:0.05, Grassland:-0.1, Mountain:0};
    this.bowPowerRate = {Plain:0.1, Forest:-0.25, Grassland:0.2, Mountain:-0.2};
  }

  getMaxHitPoints(level, typeId, landType) {
    var baseNum = this.hitPoints[typeId];
    var rate = this.hpUpgradeRates[typeId];
    return this.getUpgradeNum("hitPoint", baseNum, rate, level, typeId, landType);
  }

  getUnitPower(level, typeId, landType) {
    var baseNum = this.power[typeId];
    var rate = this.powerUpRate[typeId];
    return this.getUpgradeNum("power", baseNum, rate, level, typeId, landType);
  }

  getCountryPower(baseNum, rate, level) {
    return this.getUpgradeNum("country", baseNum, rate, level, "", "");
  }

  getUpgradeNum(valueType, baseNum, rate, level, typeId, landType) {
    if (valueType !== "country") {
      var roleType = this.roleTypes[typeId];
      var landRates = this.getLandRate(roleType, landType);

      if (valueType === "power") {
        baseNum = baseNum + (landRates[1] * baseNum);
      } else if (valueType === "hitPoint") {
        baseNum = baseNum + (landRates[0] * baseNum);
      }
    }
    var newLevel = level * this.levelUnit / this.expUnit;
    var upgradeNum = baseNum;
    for (var i = 0; i < newLevel; i++) {
       upgradeNum = Math.floor(upgradeNum * (1 + this.getUpgradeRate(rate, newLevel)));
    }
    return upgradeNum;
  }

 getUpgradeRate(rate, level) {
   var newRate = rate;
   newRate = newRate * 1.5;
   newRate = newRate - (this.upDRate * level);
   if(newRate < this.minRate){
      newRate = this.minRate;
   }
   return newRate;
}

  // return attack rate and power rate of the unit on land type
  getLandRate(unitType, landType) {
    var rate1, rate2;
    switch (unitType) {
      case "cavalry":
        rate1 = this.cavalryRate[landType];
        rate2 = this.cavalryPowerRate[landType];
        break;
      case "pike":
        rate1 = this.pikeRate[landType];
        rate2 = this.pikePowerRate[landType];
        break;
      case "sword":
        rate1 = this.swordRate[landType];
        rate2 = this.swordPowerRate[landType];
        break;
      case "bow":
        rate1 = this.bowRate[landType];
        rate2 = this.bowPowerRate[landType];
        break;
    }
    return [rate1, rate2];
  }
}

export { UnitStats }
