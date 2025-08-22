import { ArmyFormation } from '../systems/ArmyFormation.js';
import { UnitStats } from '../systems/UnitStats.js';
import { Country, ArmyPower, TerrainType } from '../types/types.js';

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
    // Define country data in a clean, readable format
    const countryData = [
      {
        name: "China",
        isConquered: false,
        typeId: 1,
        levelRange: [0, 0],
        terrain: TerrainType.Plain,
        neighbors: ["Korea", "Afghanistan", "Pakistan", "Tajikistan", "Kirghizstan", "Kazakhstan", "Bhutan", "India", "Nepal", "Myanmar", "Laos", "Vietnam", "Japan", "Russia", "Mongolia"]
      },
      {
        name: "Mongolia",
        isConquered: true,
        typeId: 1,
        levelRange: [0, 0],
        terrain: TerrainType.Grassland,
        neighbors: ["Russia", "China"]
      },
      {
        name: "Russia",
        isConquered: false,
        typeId: 6,
        levelRange: [18, 2],
        terrain: TerrainType.Grassland,
        neighbors: ["Korea", "Latvia", "Lithuania", "Poland", "Belarus", "Ukraine", "Syria", "Turkey", "Iran", "Tajikistan", "Kazakhstan", "Mongolia", "China", "Japan"]
      },
      {
        name: "Japan",
        isConquered: false,
        typeId: 2,
        levelRange: [1, 2],
        terrain: TerrainType.Mountain,
        neighbors: ["China", "Korea"]
      },
      {
        name: "Korea",
        isConquered: false,
        typeId: 1,
        levelRange: [3, 2],
        terrain: TerrainType.Mountain,
        neighbors: ["Russia", "China", "Japan"]
      },
      {
        name: "Vietnam",
        isConquered: false,
        typeId: 4,
        levelRange: [5, 2],
        terrain: TerrainType.Mountain,
        neighbors: ["Myanmar", "Thailand", "Cambodia", "Laos", "China"]
      },
      {
        name: "Laos",
        isConquered: false,
        typeId: 2,
        levelRange: [2, 2],
        terrain: TerrainType.Mountain,
        neighbors: ["Myanmar", "Thailand", "Cambodia", "Vietnam", "China"]
      },
      {
        name: "Cambodia",
        isConquered: false,
        typeId: 1,
        levelRange: [3, 2],
        terrain: TerrainType.Forest,
        neighbors: ["Thailand", "Laos", "Vietnam"]
      },
      {
        name: "Thailand",
        isConquered: false,
        typeId: 4,
        levelRange: [5, 2],
        terrain: TerrainType.Grassland,
        neighbors: ["Myanmar", "Cambodia", "Laos", "Vietnam"]
      },
      {
        name: "Myanmar",
        isConquered: false,
        typeId: 5,
        levelRange: [4, 2],
        terrain: TerrainType.Forest,
        neighbors: ["Bangladesh", "India", "Thailand", "Laos", "Vietnam", "China"]
      },
      {
        name: "Nepal",
        isConquered: false,
        typeId: 4,
        levelRange: [1, 2],
        terrain: TerrainType.Mountain,
        neighbors: ["Bangladesh", "India", "China"]
      },
      {
        name: "India",
        isConquered: false,
        typeId: 6,
        levelRange: [15, 2],
        terrain: TerrainType.Plain,
        neighbors: ["Pakistan", "Bhutan", "Bangladesh", "Nepal", "Myanmar", "China"]
      },
      {
        name: "Bangladesh",
        isConquered: false,
        typeId: 1,
        levelRange: [4, 2],
        terrain: TerrainType.Forest,
        neighbors: ["India", "Nepal", "Myanmar"]
      },
      {
        name: "Bhutan",
        isConquered: false,
        typeId: 1,
        levelRange: [3, 2],
        terrain: TerrainType.Forest,
        neighbors: ["India", "China"]
      },
      {
        name: "Kazakhstan",
        isConquered: false,
        typeId: 6,
        levelRange: [15, 2],
        terrain: TerrainType.Grassland,
        neighbors: ["Turkmenistan", "Tajikistan", "Kirghizstan", "Uzbekistan", "Russia", "China"]
      },
      {
        name: "Uzbekistan",
        isConquered: false,
        typeId: 5,
        levelRange: [9, 3],
        terrain: TerrainType.Grassland,
        neighbors: ["Turkmenistan", "Afghanistan", "Tajikistan", "Kazakhstan"]
      },
      {
        name: "Kirghizstan",
        isConquered: false,
        typeId: 1,
        levelRange: [8, 2],
        terrain: TerrainType.Grassland,
        neighbors: ["Tajikistan", "Kazakhstan", "China"]
      },
      {
        name: "Tajikistan",
        isConquered: false,
        typeId: 4,
        levelRange: [4, 2],
        terrain: TerrainType.Grassland,
        neighbors: ["Afghanistan", "Pakistan", "Kirghizstan", "Uzbekistan", "Kazakhstan", "China"]
      },
      {
        name: "Pakistan",
        isConquered: false,
        typeId: 5,
        levelRange: [10, 2],
        terrain: TerrainType.Mountain,
        neighbors: ["Turkmenistan", "Iran", "Afghanistan", "Tajikistan", "India", "China"]
      },
      {
        name: "Afghanistan",
        isConquered: false,
        typeId: 3,
        levelRange: [11, 2],
        terrain: TerrainType.Mountain,
        neighbors: ["Turkmenistan", "Iran", "Pakistan", "Tajikistan", "Uzbekistan", "China"]
      },
      {
        name: "Iran",
        isConquered: false,
        typeId: 6,
        levelRange: [10, 2],
        terrain: TerrainType.Plain,
        neighbors: ["United Arab Emirates", "Kuwait", "Oman", "Iraq", "Turkey", "Turkmenistan", "Afghanistan", "Pakistan", "Russia"]
      },
      {
        name: "Turkmenistan",
        isConquered: false,
        typeId: 5,
        levelRange: [11, 2],
        terrain: TerrainType.Mountain,
        neighbors: ["Iran", "Afghanistan", "Pakistan", "Uzbekistan", "Kazakhstan"]
      },
      {
        name: "Turkey",
        isConquered: false,
        typeId: 6,
        levelRange: [12, 2],
        terrain: TerrainType.Mountain,
        neighbors: ["Bulgaria", "Greece", "Iraq", "Syria", "Iran", "Russia"]
      },
      {
        name: "Syria",
        isConquered: false,
        typeId: 6,
        levelRange: [12, 2],
        terrain: TerrainType.Mountain,
        neighbors: ["Jordan", "Iraq", "Turkey", "Russia"]
      },
      {
        name: "Iraq",
        isConquered: false,
        typeId: 5,
        levelRange: [15, 2],
        terrain: TerrainType.Plain,
        neighbors: ["Jordan", "Kuwait", "Saudi Arabia", "Syria", "Turkey", "Iran"]
      },
      {
        name: "Saudi Arabia",
        isConquered: false,
        typeId: 6,
        levelRange: [16, 2],
        terrain: TerrainType.Plain,
        neighbors: ["Israel", "United Arab Emirates", "Jordan", "Kuwait", "Oman", "Yemen", "Iraq"]
      },
      {
        name: "Yemen",
        isConquered: false,
        typeId: 5,
        levelRange: [11, 2],
        terrain: TerrainType.Plain,
        neighbors: ["Oman", "Saudi Arabia"]
      },
      {
        name: "Oman",
        isConquered: false,
        typeId: 6,
        levelRange: [12, 2],
        terrain: TerrainType.Plain,
        neighbors: ["United Arab Emirates", "Yemen", "Saudi Arabia"]
      },
      {
        name: "Kuwait",
        isConquered: false,
        typeId: 4,
        levelRange: [10, 2],
        terrain: TerrainType.Plain,
        neighbors: ["Saudi Arabia", "Iraq", "Iran"]
      },
      {
        name: "Jordan",
        isConquered: false,
        typeId: 5,
        levelRange: [14, 2],
        terrain: TerrainType.Plain,
        neighbors: ["Israel", "Saudi Arabia", "Iraq", "Syria"]
      },
      {
        name: "United Arab Emirates",
        isConquered: false,
        typeId: 5,
        levelRange: [14, 2],
        terrain: TerrainType.Plain,
        neighbors: ["Oman", "Saudi Arabia"]
      },
      {
        name: "Israel",
        isConquered: false,
        typeId: 6,
        levelRange: [16, 2],
        terrain: TerrainType.Plain,
        neighbors: ["Jordan", "Saudi Arabia"]
      },
      {
        name: "Greece",
        isConquered: false,
        typeId: 6,
        levelRange: [18, 4],
        terrain: TerrainType.Mountain,
        neighbors: ["Macedonia", "Albania", "Bulgaria", "Turkey"]
      },
      {
        name: "Bulgaria",
        isConquered: false,
        typeId: 3,
        levelRange: [12, 2],
        terrain: TerrainType.Mountain,
        neighbors: ["Serbia", "Macedonia", "Ukraine", "Romania", "Greece", "Turkey", "Russia"]
      },
      {
        name: "Romania",
        isConquered: false,
        typeId: 5,
        levelRange: [15, 2],
        terrain: TerrainType.Mountain,
        neighbors: ["Hungary", "Serbia", "Ukraine", "Moldavia", "Bulgaria"]
      },
      {
        name: "Moldavia",
        isConquered: false,
        typeId: 6,
        levelRange: [12, 2],
        terrain: TerrainType.Mountain,
        neighbors: ["Ukraine", "Romania", "Russia"]
      },
      {
        name: "Ukraine",
        isConquered: false,
        typeId: 6,
        levelRange: [16, 2],
        terrain: TerrainType.Grassland,
        neighbors: ["Hungary", "Slovakia", "Poland", "Belarus", "Moldavia", "Romania", "Bulgaria", "Russia"]
      },
      {
        name: "Belarus",
        isConquered: false,
        typeId: 5,
        levelRange: [14, 2],
        terrain: TerrainType.Grassland,
        neighbors: ["Latvia", "Lithuania", "Poland", "Ukraine"]
      },
      {
        name: "Albania",
        isConquered: false,
        typeId: 6,
        levelRange: [9, 2],
        terrain: TerrainType.Forest,
        neighbors: ["Montenegro", "Serbia", "Macedonia", "Greece"]
      },
      {
        name: "Macedonia",
        isConquered: false,
        typeId: 5,
        levelRange: [11, 2],
        terrain: TerrainType.Forest,
        neighbors: ["Serbia", "Albania", "Bulgaria", "Greece"]
      },
      {
        name: "Serbia",
        isConquered: false,
        typeId: 6,
        levelRange: [13, 2],
        terrain: TerrainType.Mountain,
        neighbors: ["Montenegro", "Bosnia", "Croatia", "Hungary", "Macedonia", "Albania", "Romania", "Bulgaria"]
      },
      {
        name: "Poland",
        isConquered: false,
        typeId: 2,
        levelRange: [16, 2],
        terrain: TerrainType.Mountain,
        neighbors: ["Hungary", "Slovakia", "Czech", "Austria", "Germany", "Lithuania", "Belarus", "Ukraine", "Russia"]
      },
      {
        name: "Lithuania",
        isConquered: false,
        typeId: 5,
        levelRange: [12, 2],
        terrain: TerrainType.Mountain,
        neighbors: ["Latvia", "Poland", "Belarus", "Russia"]
      },
      {
        name: "Latvia",
        isConquered: false,
        typeId: 6,
        levelRange: [11, 2],
        terrain: TerrainType.Mountain,
        neighbors: ["Lithuania", "Belarus", "Russia"]
      },
      {
        name: "Italy",
        isConquered: false,
        typeId: 5,
        levelRange: [16, 2],
        terrain: TerrainType.Mountain,
        neighbors: ["Swiss", "Austria"]
      },
      {
        name: "Germany",
        isConquered: false,
        typeId: 6,
        levelRange: [18, 2],
        terrain: TerrainType.Plain,
        neighbors: ["Swiss", "France", "Czech", "Austria", "Poland"]
      },
      {
        name: "Austria",
        isConquered: false,
        typeId: 5,
        levelRange: [12, 2],
        terrain: TerrainType.Mountain,
        neighbors: ["Swiss", "Slovenia", "Hungary", "Slovakia", "Czech", "Germany", "Italy", "Poland"]
      },
      {
        name: "Czech",
        isConquered: false,
        typeId: 5,
        levelRange: [12, 2],
        terrain: TerrainType.Grassland,
        neighbors: ["Slovakia", "Austria", "Germany", "Poland"]
      },
      {
        name: "Slovakia",
        isConquered: false,
        typeId: 4,
        levelRange: [11, 2],
        terrain: TerrainType.Grassland,
        neighbors: ["Hungary", "Czech", "Austria", "Poland", "Ukraine"]
      },
      {
        name: "Hungary",
        isConquered: false,
        typeId: 5,
        levelRange: [14, 2],
        terrain: TerrainType.Grassland,
        neighbors: ["Bosnia", "Croatia", "Slovenia", "Slovakia", "Austria", "Poland", "Serbia", "Ukraine", "Romania"]
      },
      {
        name: "Slovenia",
        isConquered: false,
        typeId: 4,
        levelRange: [12, 2],
        terrain: TerrainType.Grassland,
        neighbors: ["Croatia", "Hungary", "Austria"]
      },
      {
        name: "Croatia",
        isConquered: false,
        typeId: 5,
        levelRange: [11, 2],
        terrain: TerrainType.Mountain,
        neighbors: ["Bosnia", "Slovenia", "Hungary", "Serbia"]
      },
      {
        name: "Bosnia",
        isConquered: false,
        typeId: 6,
        levelRange: [13, 2],
        terrain: TerrainType.Grassland,
        neighbors: ["Montenegro", "Croatia", "Hungary", "Serbia"]
      },
      {
        name: "France",
        isConquered: false,
        typeId: 5,
        levelRange: [15, 2],
        terrain: TerrainType.Mountain,
        neighbors: ["Swiss", "Germany"]
      },
      {
        name: "Swiss",
        isConquered: false,
        typeId: 5,
        levelRange: [10, 2],
        terrain: TerrainType.Mountain,
        neighbors: ["France", "Austria", "Germany", "Italy"]
      },
      {
        name: "Montenegro",
        isConquered: false,
        typeId: 5,
        levelRange: [12, 2],
        terrain: TerrainType.Mountain,
        neighbors: ["Bosnia", "Serbia", "Albania"]
      }
    ];

    return countryData.map(country => ({
      isConquered: country.isConquered,
      armyPower: this.getPower(country.typeId, this.getRandomNum(country.levelRange[0], country.levelRange[1])),
      land: country.terrain,
      country: country.name,
      neighbor: country.neighbors
    }));
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

