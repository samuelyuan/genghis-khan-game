import { ArmyFormation } from './ArmyFormation.js';
import { UnitStats } from './UnitStats.js';
import { Country, ArmyPower, TerrainType } from './types.js';

export class MapCountries {
  private unitStats: UnitStats;
  private armyFormations: ArmyFormation;
  public countries: Country[];

  constructor() {
    this.unitStats = new UnitStats();
    this.armyFormations = new ArmyFormation();
    this.countries = this.initCountries();
  }

  private initCountries(): Country[] {
    const allCountries: Country[] = [];
    
    // Helper function to create country data
    const createCountry = (
      isConquered: boolean,
      typeId: number,
      level: number,
      land: TerrainType,
      country: string,
      neighbor: string[]
    ): Country => ({
      isConquered,
      armyPower: this.getPower(typeId, level),
      land,
      country,
      neighbor
    });

    // Initialize all countries with proper typing
    allCountries.push(createCountry(false, 1, this.getRandomNum(0, 0), TerrainType.Plain, "China", ["Korea", "Afghanistan", "Pakistan", "Tajikistan", "Kirghizstan", "Kazakhstan", "Bhutan", "India", "Nepal", "Myanmar", "Laos", "Vietnam", "Japan", "Russia", "Mongolia"]));
    allCountries.push(createCountry(true, 1, this.getRandomNum(0, 0), TerrainType.Grassland, "Mongolia", ["Russia", "China"]));
    allCountries.push(createCountry(false, 6, this.getRandomNum(18, 2), TerrainType.Grassland, "Russia", ["Korea", "Latvia", "Lithuania", "Poland", "Belarus", "Ukraine", "Syria", "Turkey", "Iran", "Tajikistan", "Kazakhstan", "Mongolia", "China", "Japan"]));
    allCountries.push(createCountry(false, 2, this.getRandomNum(1, 2), TerrainType.Mountain, "Japan", ["China", "Korea"]));
    allCountries.push(createCountry(false, 1, this.getRandomNum(3, 2), TerrainType.Mountain, "Korea", ["Russia", "China", "Japan"]));
    allCountries.push(createCountry(false, 4, this.getRandomNum(5, 2), TerrainType.Mountain, "Vietnam", ["Myanmar", "Thailand", "Cambodia", "Laos", "China"]));
    allCountries.push(createCountry(false, 2, this.getRandomNum(2, 2), TerrainType.Mountain, "Laos", ["Myanmar", "Thailand", "Cambodia", "Vietnam", "China"]));
    allCountries.push(createCountry(false, 1, this.getRandomNum(3, 2), TerrainType.Forest, "Cambodia", ["Thailand", "Laos", "Vietnam"]));
    allCountries.push(createCountry(false, 4, this.getRandomNum(5, 2), TerrainType.Grassland, "Thailand", ["Myanmar", "Cambodia", "Laos", "Vietnam"]));
    allCountries.push(createCountry(false, 5, this.getRandomNum(4, 2), TerrainType.Forest, "Myanmar", ["Bangladesh", "India", "Thailand", "Laos", "Vietnam", "China"]));
    allCountries.push(createCountry(false, 4, this.getRandomNum(1, 2), TerrainType.Mountain, "Nepal", ["Bangladesh", "India", "China"]));
    allCountries.push(createCountry(false, 6, this.getRandomNum(15, 2), TerrainType.Plain, "India", ["Pakistan", "Bhutan", "Bangladesh", "Nepal", "Myanmar", "China"]));
    allCountries.push(createCountry(false, 1, this.getRandomNum(4, 2), TerrainType.Forest, "Bangladesh", ["India", "Nepal", "Myanmar"]));
    allCountries.push(createCountry(false, 1, this.getRandomNum(3, 2), TerrainType.Forest, "Bhutan", ["India", "China"]));
    allCountries.push(createCountry(false, 6, this.getRandomNum(15, 2), TerrainType.Grassland, "Kazakhstan", ["Turkmenistan", "Tajikistan", "Kirghizstan", "Uzbekistan", "Russia", "China"]));
    allCountries.push(createCountry(false, 5, this.getRandomNum(9, 3), TerrainType.Grassland, "Uzbekistan", ["Turkmenistan", "Afghanistan", "Tajikistan", "Kazakhstan"]));
    allCountries.push(createCountry(false, 1, this.getRandomNum(8, 2), TerrainType.Grassland, "Kirghizstan", ["Tajikistan", "Kazakhstan", "China"]));
    allCountries.push(createCountry(false, 4, this.getRandomNum(4, 2), TerrainType.Grassland, "Tajikistan", ["Afghanistan", "Pakistan", "Kirghizstan", "Uzbekistan", "Kazakhstan", "China"]));
    allCountries.push(createCountry(false, 5, this.getRandomNum(10, 2), TerrainType.Mountain, "Pakistan", ["Turkmenistan", "Iran", "Afghanistan", "Tajikistan", "India", "China"]));
    allCountries.push(createCountry(false, 3, this.getRandomNum(11, 2), TerrainType.Mountain, "Afghanistan", ["Turkmenistan", "Iran", "Pakistan", "Tajikistan", "Uzbekistan", "China"]));
    allCountries.push(createCountry(false, 6, this.getRandomNum(10, 2), TerrainType.Plain, "Iran", ["United Arab Emirates", "Kuwait", "Oman", "Iraq", "Turkey", "Turkmenistan", "Afghanistan", "Pakistan", "Russia"]));
    allCountries.push(createCountry(false, 5, this.getRandomNum(11, 2), TerrainType.Mountain, "Turkmenistan", ["Iran", "Afghanistan", "Pakistan", "Uzbekistan", "Kazakhstan"]));
    allCountries.push(createCountry(false, 6, this.getRandomNum(12, 2), TerrainType.Mountain, "Turkey", ["Bulgaria", "Greece", "Iraq", "Syria", "Iran", "Russia"]));
    allCountries.push(createCountry(false, 6, this.getRandomNum(12, 2), TerrainType.Mountain, "Syria", ["Jordan", "Iraq", "Turkey", "Russia"]));
    allCountries.push(createCountry(false, 5, this.getRandomNum(15, 2), TerrainType.Plain, "Iraq", ["Jordan", "Kuwait", "Saudi Arabia", "Syria", "Turkey", "Iran"]));
    allCountries.push(createCountry(false, 6, this.getRandomNum(16, 2), TerrainType.Plain, "Saudi Arabia", ["Israel", "United Arab Emirates", "Jordan", "Kuwait", "Oman", "Yemen", "Iraq"]));
    allCountries.push(createCountry(false, 5, this.getRandomNum(11, 2), TerrainType.Plain, "Yemen", ["Oman", "Saudi Arabia"]));
    allCountries.push(createCountry(false, 6, this.getRandomNum(12, 2), TerrainType.Plain, "Oman", ["United Arab Emirates", "Yemen", "Saudi Arabia"]));
    allCountries.push(createCountry(false, 4, this.getRandomNum(10, 2), TerrainType.Plain, "Kuwait", ["Saudi Arabia", "Iraq", "Iran"]));
    allCountries.push(createCountry(false, 5, this.getRandomNum(14, 2), TerrainType.Plain, "Jordan", ["Israel", "Saudi Arabia", "Iraq", "Syria"]));
    allCountries.push(createCountry(false, 5, this.getRandomNum(14, 2), TerrainType.Plain, "United Arab Emirates", ["Oman", "Saudi Arabia"]));
    allCountries.push(createCountry(false, 6, this.getRandomNum(16, 2), TerrainType.Plain, "Israel", ["Jordan", "Saudi Arabia"]));
    allCountries.push(createCountry(false, 6, this.getRandomNum(18, 4), TerrainType.Mountain, "Greece", ["Macedonia", "Albania", "Bulgaria", "Turkey"]));
    allCountries.push(createCountry(false, 3, this.getRandomNum(12, 2), TerrainType.Mountain, "Bulgaria", ["Serbia", "Macedonia", "Ukraine", "Romania", "Greece", "Turkey", "Russia"]));
    allCountries.push(createCountry(false, 5, this.getRandomNum(15, 2), TerrainType.Mountain, "Romania", ["Hungary", "Serbia", "Ukraine", "Moldavia", "Bulgaria"]));
    allCountries.push(createCountry(false, 6, this.getRandomNum(12, 2), TerrainType.Mountain, "Moldavia", ["Ukraine", "Romania", "Russia"]));
    allCountries.push(createCountry(false, 6, this.getRandomNum(16, 2), TerrainType.Grassland, "Ukraine", ["Hungary", "Slovakia", "Poland", "Belarus", "Moldavia", "Romania", "Bulgaria", "Russia"]));
    allCountries.push(createCountry(false, 5, this.getRandomNum(14, 2), TerrainType.Grassland, "Belarus", ["Latvia", "Lithuania", "Poland", "Ukraine"]));
    allCountries.push(createCountry(false, 6, this.getRandomNum(9, 2), TerrainType.Forest, "Albania", ["Montenegro", "Serbia", "Macedonia", "Greece"]));
    allCountries.push(createCountry(false, 5, this.getRandomNum(11, 2), TerrainType.Forest, "Macedonia", ["Serbia", "Albania", "Bulgaria", "Greece"]));
    allCountries.push(createCountry(false, 6, this.getRandomNum(13, 2), TerrainType.Mountain, "Serbia", ["Montenegro", "Bosnia", "Croatia", "Hungary", "Macedonia", "Albania", "Romania", "Bulgaria"]));
    allCountries.push(createCountry(false, 2, this.getRandomNum(16, 2), TerrainType.Mountain, "Poland", ["Hungary", "Slovakia", "Czech", "Austria", "Germany", "Lithuania", "Belarus", "Ukraine", "Russia"]));
    allCountries.push(createCountry(false, 5, this.getRandomNum(12, 2), TerrainType.Mountain, "Lithuania", ["Latvia", "Poland", "Belarus", "Russia"]));
    allCountries.push(createCountry(false, 6, this.getRandomNum(11, 2), TerrainType.Mountain, "Latvia", ["Lithuania", "Belarus", "Russia"]));
    allCountries.push(createCountry(false, 5, this.getRandomNum(16, 2), TerrainType.Mountain, "Italy", ["Swiss", "Austria"]));
    allCountries.push(createCountry(false, 6, this.getRandomNum(18, 2), TerrainType.Plain, "Germany", ["Swiss", "France", "Czech", "Austria", "Poland"]));
    allCountries.push(createCountry(false, 5, this.getRandomNum(12, 2), TerrainType.Mountain, "Austria", ["Swiss", "Slovenia", "Hungary", "Slovakia", "Czech", "Germany", "Italy", "Poland"]));
    allCountries.push(createCountry(false, 5, this.getRandomNum(12, 2), TerrainType.Grassland, "Czech", ["Slovakia", "Austria", "Germany", "Poland"]));
    allCountries.push(createCountry(false, 4, this.getRandomNum(11, 2), TerrainType.Grassland, "Slovakia", ["Hungary", "Czech", "Austria", "Poland", "Ukraine"]));
    allCountries.push(createCountry(false, 5, this.getRandomNum(14, 2), TerrainType.Grassland, "Hungary", ["Bosnia", "Croatia", "Slovenia", "Slovakia", "Austria", "Poland", "Serbia", "Ukraine", "Romania"]));
    allCountries.push(createCountry(false, 4, this.getRandomNum(12, 2), TerrainType.Grassland, "Slovenia", ["Croatia", "Hungary", "Austria"]));
    allCountries.push(createCountry(false, 5, this.getRandomNum(11, 2), TerrainType.Mountain, "Croatia", ["Bosnia", "Slovenia", "Hungary", "Serbia"]));
    allCountries.push(createCountry(false, 6, this.getRandomNum(13, 2), TerrainType.Grassland, "Bosnia", ["Montenegro", "Croatia", "Hungary", "Serbia"]));
    allCountries.push(createCountry(false, 5, this.getRandomNum(15, 2), TerrainType.Grassland, "France", ["Swiss", "Germany"]));
    allCountries.push(createCountry(false, 5, this.getRandomNum(10, 2), TerrainType.Mountain, "Swiss", ["France", "Austria", "Germany", "Italy"]));
    allCountries.push(createCountry(false, 5, this.getRandomNum(12, 2), TerrainType.Mountain, "Montenegro", ["Bosnia", "Serbia", "Albania"]));
    
    return allCountries;
  }

  public getPower(typeId: number, level: number): ArmyPower {
    if (typeId < 1 || level < 0) {
      throw new Error(`Invalid parameters: typeId=${typeId}, level=${level}`);
    }

    const formationId = Math.ceil(Math.random() * 10) + (typeId - 1) * 10;
    let power = 0;
    const numSoldiers = 6 + (typeId * 2);
    const formationData = this.armyFormations.data[`shape${formationId}`];
    const levelArr: number[] = [];

    for (let i = 0; i < formationData.length; i++) {
      const unitTypeId = formationData[i].typeId;
      const randomOffset = (Math.random() - Math.random()) * 3;
      let weightedLevel = Math.floor((level * this.unitStats.globalHardRate) + randomOffset);
      
      if (weightedLevel < 0) {
        weightedLevel = 0;
      }
      
      const powerFromUnit = this.unitStats.getCountryPower(
        this.unitStats.unitCost[unitTypeId],
        this.unitStats.unitCostUpgradeRate[unitTypeId],
        weightedLevel
      );
      
      levelArr.push(weightedLevel);
      power += (powerFromUnit * 5);
    }

    return {
      power,
      numSoldiers,
      shape: formationData,
      level: levelArr
    };
  }

  private getRandomNum(baseNum: number, num: number): number {
    return baseNum + Math.floor(Math.random() * num);
  }

  // Helper methods for game logic
  public getConqueredCountries(): Country[] {
    return this.countries.filter(country => country.isConquered);
  }

  public getReachableCountries(): string[] {
    const conqueredCountries = this.getConqueredCountries();
    const conqueredNames = conqueredCountries.map(country => country.country);
    
    return conqueredCountries
      .map(country => country.neighbor)
      .flat()
      .filter(countryName => !conqueredNames.includes(countryName));
  }

  public conquerCountry(countryName: string): void {
    const country = this.countries.find(c => c.country === countryName);
    if (country) {
      country.isConquered = true;
    }
  }

  public getCountryByName(countryName: string): Country | undefined {
    return this.countries.find(country => country.country === countryName);
  }
}

