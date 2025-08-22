import { FormationUnit } from '../types/types.js';

// Type for army formation data structure
type ArmyFormationsData = {
  [key: string]: FormationUnit[];
};

class ArmyFormation {
  public data: ArmyFormationsData;

  constructor() {
    this.data = this.initArmyFormations();
  }

  private initArmyFormations(): ArmyFormationsData {
    const allArmyFormations: ArmyFormationsData = {};

    // Shape 1 - Basic sword formation
    allArmyFormations["shape1"] = [
      {typeId: 2, x: 190, y: 316},
      {typeId: 2, x: 158, y: 316},
      {typeId: 2, x: 190, y: 284},
      {typeId: 2, x: 158, y: 284},
      {typeId: 2, x: 190, y: 220},
      {typeId: 2, x: 158, y: 220},
      {typeId: 2, x: 190, y: 188},
      {typeId: 2, x: 158, y: 188}
    ];

    // Shape 2 - Sword column formation
    allArmyFormations["shape2"] = [
      {typeId: 2, x: 254, y: 348},
      {typeId: 2, x: 254, y: 316},
      {typeId: 2, x: 222, y: 284},
      {typeId: 2, x: 222, y: 252},
      {typeId: 2, x: 190, y: 252},
      {typeId: 2, x: 222, y: 220},
      {typeId: 2, x: 254, y: 188},
      {typeId: 2, x: 254, y: 156}
    ];

    // Shape 3 - Mixed sword and bow formation
    allArmyFormations["shape3"] = [
      {typeId: 2, x: 222, y: 348},
      {typeId: 3, x: 286, y: 316},
      {typeId: 2, x: 190, y: 284},
      {typeId: 3, x: 286, y: 252},
      {typeId: 2, x: 190, y: 252},
      {typeId: 2, x: 190, y: 220},
      {typeId: 3, x: 286, y: 188},
      {typeId: 2, x: 222, y: 156}
    ];

    // Shape 4 - Mixed formation with cavalry
    allArmyFormations["shape4"] = [
      {typeId: 3, x: 318, y: 348},
      {typeId: 1, x: 222, y: 348},
      {typeId: 1, x: 222, y: 316},
      {typeId: 2, x: 222, y: 252},
      {typeId: 2, x: 190, y: 252},
      {typeId: 1, x: 222, y: 188},
      {typeId: 3, x: 318, y: 156},
      {typeId: 1, x: 222, y: 156}
    ];

    // Shape 5 - Cavalry-heavy formation
    allArmyFormations["shape5"] = [
      {typeId: 3, x: 318, y: 348},
      {typeId: 1, x: 222, y: 316},
      {typeId: 1, x: 222, y: 284},
      {typeId: 1, x: 190, y: 252},
      {typeId: 1, x: 158, y: 252},
      {typeId: 1, x: 222, y: 220},
      {typeId: 1, x: 222, y: 188},
      {typeId: 3, x: 318, y: 156}
    ];

    // Shape 6 - Mixed formation with cavalry and pike
    allArmyFormations["shape6"] = [
      {typeId: 3, x: 286, y: 348},
      {typeId: 2, x: 222, y: 316},
      {typeId: 2, x: 222, y: 284},
      {typeId: 3, x: 286, y: 252},
      {typeId: 0, x: 158, y: 252},
      {typeId: 2, x: 222, y: 220},
      {typeId: 2, x: 222, y: 188},
      {typeId: 3, x: 286, y: 156}
    ];

    // Shape 7 - Complex mixed formation
    allArmyFormations["shape7"] = [
      {typeId: 3, x: 286, y: 348},
      {typeId: 2, x: 158, y: 348},
      {typeId: 2, x: 126, y: 348},
      {typeId: 3, x: 318, y: 316},
      {typeId: 0, x: 318, y: 252},
      {typeId: 3, x: 318, y: 188},
      {typeId: 3, x: 286, y: 156},
      {typeId: 2, x: 158, y: 156},
      {typeId: 2, x: 126, y: 156}
    ];

    // Shape 8 - Cavalry and sword formation
    allArmyFormations["shape8"] = [
      {typeId: 3, x: 254, y: 348},
      {typeId: 0, x: 158, y: 316},
      {typeId: 2, x: 254, y: 252},
      {typeId: 2, x: 222, y: 252},
      {typeId: 2, x: 190, y: 252},
      {typeId: 2, x: 158, y: 252},
      {typeId: 0, x: 158, y: 188},
      {typeId: 3, x: 254, y: 156}
    ];

    // Shape 9 - Sword line formation
    allArmyFormations["shape9"] = [
      {typeId: 2, x: 286, y: 380},
      {typeId: 2, x: 254, y: 380},
      {typeId: 2, x: 222, y: 380},
      {typeId: 2, x: 190, y: 380},
      {typeId: 2, x: 286, y: 124},
      {typeId: 2, x: 254, y: 124},
      {typeId: 2, x: 222, y: 124},
      {typeId: 2, x: 190, y: 124}
    ];

    // Shape 10 - Bow and sword formation
    allArmyFormations["shape10"] = [
      {typeId: 3, x: 254, y: 284},
      {typeId: 2, x: 222, y: 284},
      {typeId: 2, x: 190, y: 284},
      {typeId: 2, x: 222, y: 252},
      {typeId: 2, x: 190, y: 252},
      {typeId: 3, x: 254, y: 220},
      {typeId: 2, x: 222, y: 220},
      {typeId: 2, x: 190, y: 220}
    ];

    // Shape 11 - Sword formation
    allArmyFormations["shape11"] = [
      {typeId: 2, x: 254, y: 316},
      {typeId: 2, x: 222, y: 316},
      {typeId: 2, x: 190, y: 316},
      {typeId: 2, x: 158, y: 316},
      {typeId: 2, x: 254, y: 284},
      {typeId: 2, x: 222, y: 284},
      {typeId: 2, x: 190, y: 284},
      {typeId: 2, x: 158, y: 284}
    ];

    // Shape 12 - Mixed formation
    allArmyFormations["shape12"] = [
      {typeId: 1, x: 286, y: 284},
      {typeId: 2, x: 254, y: 284},
      {typeId: 2, x: 222, y: 284},
      {typeId: 3, x: 318, y: 252},
      {typeId: 1, x: 286, y: 252},
      {typeId: 2, x: 254, y: 252},
      {typeId: 2, x: 222, y: 252},
      {typeId: 1, x: 286, y: 220},
      {typeId: 2, x: 254, y: 220},
      {typeId: 2, x: 222, y: 220}
    ];

    // Shape 13 - Cavalry formation
    allArmyFormations["shape13"] = [
      {typeId: 2, x: 286, y: 348},
      {typeId: 2, x: 286, y: 316},
      {typeId: 2, x: 254, y: 316},
      {typeId: 2, x: 222, y: 284},
      {typeId: 2, x: 222, y: 252},
      {typeId: 2, x: 190, y: 252},
      {typeId: 2, x: 222, y: 220},
      {typeId: 2, x: 286, y: 188},
      {typeId: 2, x: 254, y: 188},
      {typeId: 2, x: 286, y: 156}
    ];

    // Shape 14 - Pike formation
    allArmyFormations["shape14"] = [
      {typeId: 2, x: 222, y: 316},
      {typeId: 2, x: 126, y: 316},
      {typeId: 2, x: 190, y: 284},
      {typeId: 2, x: 158, y: 284},
      {typeId: 3, x: 286, y: 252},
      {typeId: 3, x: 254, y: 252},
      {typeId: 2, x: 190, y: 220},
      {typeId: 2, x: 158, y: 220},
      {typeId: 2, x: 222, y: 188},
      {typeId: 2, x: 126, y: 188}
    ];

    // Shape 15 - Bow formation
    allArmyFormations["shape15"] = [
      {typeId: 3, x: 286, y: 348},
      {typeId: 1, x: 190, y: 348},
      {typeId: 2, x: 222, y: 316},
      {typeId: 2, x: 254, y: 284},
      {typeId: 3, x: 318, y: 252},
      {typeId: 2, x: 254, y: 252},
      {typeId: 2, x: 254, y: 220},
      {typeId: 2, x: 222, y: 188},
      {typeId: 3, x: 286, y: 156},
      {typeId: 2, x: 190, y: 156}
    ];

    // Shape 16 - Mixed cavalry and sword
    allArmyFormations["shape16"] = [
      {typeId: 3, x: 286, y: 348},
      {typeId: 2, x: 190, y: 348},
      {typeId: 2, x: 222, y: 316},
      {typeId: 1, x: 254, y: 284},
      {typeId: 1, x: 286, y: 252},
      {typeId: 0, x: 158, y: 252},
      {typeId: 1, x: 254, y: 220},
      {typeId: 2, x: 222, y: 188},
      {typeId: 3, x: 286, y: 156},
      {typeId: 2, x: 190, y: 156}
    ];

    // Shape 17 - Mixed formation
    allArmyFormations["shape17"] = [
      {typeId: 2, x: 254, y: 316},
      {typeId: 1, x: 190, y: 316},
      {typeId: 2, x: 254, y: 284},
      {typeId: 1, x: 190, y: 284},
      {typeId: 2, x: 222, y: 252},
      {typeId: 0, x: 158, y: 252},
      {typeId: 2, x: 254, y: 220},
      {typeId: 1, x: 190, y: 220},
      {typeId: 2, x: 254, y: 188},
      {typeId: 1, x: 190, y: 188}
    ];

    // Shape 18 - Cavalry and pike
    allArmyFormations["shape18"] = [
      {typeId: 2, x: 190, y: 348},
      {typeId: 1, x: 190, y: 316},
      {typeId: 2, x: 222, y: 284},
      {typeId: 1, x: 190, y: 284},
      {typeId: 2, x: 222, y: 252},
      {typeId: 0, x: 158, y: 252},
      {typeId: 2, x: 222, y: 220},
      {typeId: 1, x: 190, y: 220},
      {typeId: 1, x: 190, y: 188},
      {typeId: 2, x: 190, y: 156}
    ];

    // Shape 19 - Mixed formation
    allArmyFormations["shape19"] = [
      {typeId: 2, x: 158, y: 380},
      {typeId: 2, x: 190, y: 348},
      {typeId: 1, x: 222, y: 316},
      {typeId: 3, x: 286, y: 284},
      {typeId: 3, x: 286, y: 252},
      {typeId: 0, x: 158, y: 252},
      {typeId: 3, x: 286, y: 220},
      {typeId: 1, x: 222, y: 188},
      {typeId: 2, x: 190, y: 156},
      {typeId: 2, x: 158, y: 124}
    ];

    // Shape 20 - Complex mixed formation
    allArmyFormations["shape20"] = [
      {typeId: 3, x: 286, y: 380},
      {typeId: 3, x: 286, y: 348},
      {typeId: 2, x: 222, y: 316},
      {typeId: 2, x: 222, y: 284},
      {typeId: 3, x: 318, y: 252},
      {typeId: 0, x: 158, y: 252},
      {typeId: 2, x: 222, y: 220},
      {typeId: 2, x: 222, y: 188},
      {typeId: 3, x: 286, y: 156},
      {typeId: 3, x: 286, y: 124}
    ];

    // Shape 21 - Complex mixed formation
    allArmyFormations["shape21"] = [
      {typeId: 3, x: 318, y: 380},
      {typeId: 3, x: 286, y: 380},
      {typeId: 2, x: 254, y: 348},
      {typeId: 2, x: 222, y: 316},
      {typeId: 2, x: 350, y: 252},
      {typeId: 2, x: 318, y: 252},
      {typeId: 2, x: 286, y: 252},
      {typeId: 2, x: 254, y: 252},
      {typeId: 2, x: 222, y: 188},
      {typeId: 2, x: 254, y: 156},
      {typeId: 3, x: 318, y: 124},
      {typeId: 3, x: 286, y: 124}
    ];

    // Shape 22 - Mixed formation
    allArmyFormations["shape22"] = [
      {typeId: 3, x: 286, y: 348},
      {typeId: 3, x: 286, y: 316},
      {typeId: 1, x: 222, y: 316},
      {typeId: 1, x: 190, y: 316},
      {typeId: 3, x: 286, y: 284},
      {typeId: 3, x: 286, y: 252},
      {typeId: 2, x: 190, y: 252},
      {typeId: 3, x: 286, y: 220},
      {typeId: 3, x: 286, y: 188},
      {typeId: 1, x: 222, y: 188},
      {typeId: 1, x: 190, y: 188},
      {typeId: 3, x: 286, y: 156}
    ];

    // Shape 23 - Mixed formation
    allArmyFormations["shape23"] = [
      {typeId: 2, x: 254, y: 348},
      {typeId: 2, x: 318, y: 316},
      {typeId: 2, x: 222, y: 316},
      {typeId: 2, x: 286, y: 284},
      {typeId: 2, x: 190, y: 284},
      {typeId: 2, x: 254, y: 252},
      {typeId: 2, x: 158, y: 252},
      {typeId: 2, x: 286, y: 220},
      {typeId: 2, x: 190, y: 220},
      {typeId: 2, x: 318, y: 188},
      {typeId: 2, x: 222, y: 188},
      {typeId: 2, x: 254, y: 156}
    ];

    // Shape 24 - Mixed formation
    allArmyFormations["shape24"] = [
      {typeId: 2, x: 158, y: 348},
      {typeId: 2, x: 286, y: 316},
      {typeId: 2, x: 190, y: 316},
      {typeId: 2, x: 318, y: 284},
      {typeId: 2, x: 222, y: 284},
      {typeId: 2, x: 350, y: 252},
      {typeId: 2, x: 254, y: 252},
      {typeId: 2, x: 318, y: 220},
      {typeId: 2, x: 222, y: 220},
      {typeId: 2, x: 286, y: 188},
      {typeId: 2, x: 190, y: 188},
      {typeId: 2, x: 158, y: 156}
    ];

    // Shape 25 - Sword formation
    allArmyFormations["shape25"] = [
      {typeId: 2, x: 318, y: 348},
      {typeId: 2, x: 286, y: 348},
      {typeId: 2, x: 254, y: 348},
      {typeId: 2, x: 222, y: 348},
      {typeId: 2, x: 318, y: 252},
      {typeId: 2, x: 286, y: 252},
      {typeId: 2, x: 254, y: 252},
      {typeId: 2, x: 222, y: 252},
      {typeId: 2, x: 318, y: 156},
      {typeId: 2, x: 286, y: 156},
      {typeId: 2, x: 254, y: 156},
      {typeId: 2, x: 222, y: 156}
    ];

    // Shape 26 - Mixed formation
    allArmyFormations["shape26"] = [
      {typeId: 2, x: 158, y: 380},
      {typeId: 2, x: 126, y: 380},
      {typeId: 2, x: 190, y: 348},
      {typeId: 3, x: 350, y: 316},
      {typeId: 2, x: 222, y: 316},
      {typeId: 2, x: 254, y: 284},
      {typeId: 0, x: 350, y: 252},
      {typeId: 2, x: 254, y: 220},
      {typeId: 2, x: 222, y: 188},
      {typeId: 2, x: 190, y: 156},
      {typeId: 2, x: 158, y: 124},
      {typeId: 2, x: 126, y: 124}
    ];

    // Shape 27 - Mixed formation
    allArmyFormations["shape27"] = [
      {typeId: 3, x: 350, y: 348},
      {typeId: 0, x: 190, y: 348},
      {typeId: 2, x: 254, y: 316},
      {typeId: 1, x: 222, y: 316},
      {typeId: 3, x: 350, y: 284},
      {typeId: 2, x: 286, y: 284},
      {typeId: 2, x: 254, y: 284},
      {typeId: 2, x: 318, y: 252},
      {typeId: 2, x: 286, y: 252},
      {typeId: 2, x: 350, y: 220},
      {typeId: 2, x: 318, y: 220},
      {typeId: 2, x: 350, y: 188}
    ];

    // Shape 28 - Mixed formation
    allArmyFormations["shape28"] = [
      {typeId: 0, x: 190, y: 348},
      {typeId: 2, x: 254, y: 284},
      {typeId: 2, x: 222, y: 284},
      {typeId: 2, x: 190, y: 284},
      {typeId: 3, x: 318, y: 252},
      {typeId: 2, x: 254, y: 252},
      {typeId: 2, x: 222, y: 252},
      {typeId: 2, x: 190, y: 252},
      {typeId: 2, x: 254, y: 220},
      {typeId: 2, x: 222, y: 220},
      {typeId: 2, x: 190, y: 220},
      {typeId: 0, x: 190, y: 156}
    ];

    // Shape 29 - Mixed formation
    allArmyFormations["shape29"] = [
      {typeId: 2, x: 286, y: 380},
      {typeId: 2, x: 254, y: 380},
      {typeId: 2, x: 222, y: 348},
      {typeId: 3, x: 318, y: 316},
      {typeId: 2, x: 222, y: 316},
      {typeId: 2, x: 254, y: 284},
      {typeId: 2, x: 254, y: 252},
      {typeId: 0, x: 190, y: 252},
      {typeId: 3, x: 318, y: 220},
      {typeId: 2, x: 254, y: 220},
      {typeId: 2, x: 222, y: 188},
      {typeId: 2, x: 222, y: 156},
      {typeId: 2, x: 286, y: 124},
      {typeId: 2, x: 254, y: 124}
    ];

    // Shape 30 - Mixed formation
    allArmyFormations["shape30"] = [
      {typeId: 2, x: 254, y: 380},
      {typeId: 2, x: 222, y: 380},
      {typeId: 2, x: 190, y: 380},
      {typeId: 3, x: 318, y: 348},
      {typeId: 1, x: 190, y: 284},
      {typeId: 3, x: 318, y: 252},
      {typeId: 0, x: 190, y: 252},
      {typeId: 1, x: 190, y: 220},
      {typeId: 3, x: 318, y: 156},
      {typeId: 2, x: 254, y: 124},
      {typeId: 2, x: 222, y: 124},
      {typeId: 2, x: 190, y: 124}
    ];

    // Shape 31 - Mixed formation
    allArmyFormations["shape31"] = [
      {typeId: 2, x: 254, y: 348},
      {typeId: 2, x: 286, y: 316},
      {typeId: 2, x: 254, y: 316},
      {typeId: 2, x: 318, y: 284},
      {typeId: 2, x: 254, y: 284},
      {typeId: 2, x: 350, y: 252},
      {typeId: 2, x: 318, y: 252},
      {typeId: 2, x: 286, y: 252},
      {typeId: 2, x: 254, y: 252},
      {typeId: 2, x: 222, y: 252},
      {typeId: 2, x: 190, y: 252},
      {typeId: 2, x: 254, y: 220},
      {typeId: 2, x: 254, y: 188},
      {typeId: 2, x: 254, y: 156}
    ];

    // Shape 32 - Mixed formation
    allArmyFormations["shape32"] = [
      {typeId: 2, x: 318, y: 380},
      {typeId: 2, x: 286, y: 380},
      {typeId: 3, x: 350, y: 348},
      {typeId: 2, x: 254, y: 348},
      {typeId: 2, x: 222, y: 316},
      {typeId: 2, x: 254, y: 284},
      {typeId: 2, x: 318, y: 252},
      {typeId: 2, x: 286, y: 252},
      {typeId: 2, x: 254, y: 220},
      {typeId: 2, x: 222, y: 188},
      {typeId: 3, x: 350, y: 156},
      {typeId: 2, x: 254, y: 156},
      {typeId: 2, x: 318, y: 124},
      {typeId: 2, x: 286, y: 124}
    ];

    // Shape 33 - Mixed formation
    allArmyFormations["shape33"] = [
      {typeId: 2, x: 254, y: 316},
      {typeId: 2, x: 222, y: 316},
      {typeId: 2, x: 286, y: 284},
      {typeId: 2, x: 222, y: 284},
      {typeId: 2, x: 190, y: 284},
      {typeId: 3, x: 350, y: 252},
      {typeId: 2, x: 318, y: 252},
      {typeId: 2, x: 190, y: 252},
      {typeId: 2, x: 158, y: 252},
      {typeId: 2, x: 286, y: 220},
      {typeId: 2, x: 222, y: 220},
      {typeId: 2, x: 190, y: 220},
      {typeId: 2, x: 254, y: 188},
      {typeId: 2, x: 222, y: 188}
    ];

    // Shape 34 - Mixed formation
    allArmyFormations["shape34"] = [
      {typeId: 2, x: 318, y: 316},
      {typeId: 2, x: 286, y: 316},
      {typeId: 2, x: 254, y: 316},
      {typeId: 2, x: 222, y: 316},
      {typeId: 2, x: 318, y: 284},
      {typeId: 1, x: 222, y: 284},
      {typeId: 2, x: 318, y: 252},
      {typeId: 1, x: 222, y: 252},
      {typeId: 2, x: 318, y: 220},
      {typeId: 1, x: 222, y: 220},
      {typeId: 2, x: 318, y: 188},
      {typeId: 2, x: 286, y: 188},
      {typeId: 2, x: 254, y: 188},
      {typeId: 2, x: 222, y: 188}
    ];

    // Shape 35 - Mixed formation
    allArmyFormations["shape35"] = [
      {typeId: 2, x: 318, y: 348},
      {typeId: 2, x: 286, y: 348},
      {typeId: 2, x: 318, y: 316},
      {typeId: 2, x: 254, y: 316},
      {typeId: 2, x: 318, y: 284},
      {typeId: 2, x: 222, y: 284},
      {typeId: 2, x: 318, y: 252},
      {typeId: 2, x: 190, y: 252},
      {typeId: 2, x: 318, y: 220},
      {typeId: 2, x: 222, y: 220},
      {typeId: 2, x: 318, y: 188},
      {typeId: 2, x: 254, y: 188},
      {typeId: 2, x: 318, y: 156},
      {typeId: 2, x: 286, y: 156}
    ];

    // Shape 36 - Mixed formation
    allArmyFormations["shape36"] = [
      {typeId: 2, x: 350, y: 380},
      {typeId: 2, x: 318, y: 348},
      {typeId: 2, x: 286, y: 316},
      {typeId: 2, x: 222, y: 316},
      {typeId: 2, x: 254, y: 284},
      {typeId: 2, x: 190, y: 284},
      {typeId: 0, x: 350, y: 252},
      {typeId: 0, x: 158, y: 252},
      {typeId: 2, x: 254, y: 220},
      {typeId: 2, x: 190, y: 220},
      {typeId: 2, x: 286, y: 188},
      {typeId: 2, x: 222, y: 188},
      {typeId: 2, x: 318, y: 156},
      {typeId: 2, x: 350, y: 124}
    ];

    // Shape 37 - Mixed formation
    allArmyFormations["shape37"] = [
      {typeId: 1, x: 190, y: 380},
      {typeId: 2, x: 158, y: 380},
      {typeId: 1, x: 222, y: 348},
      {typeId: 2, x: 190, y: 348},
      {typeId: 1, x: 254, y: 316},
      {typeId: 2, x: 222, y: 316},
      {typeId: 1, x: 286, y: 284},
      {typeId: 2, x: 254, y: 284},
      {typeId: 1, x: 318, y: 252},
      {typeId: 2, x: 286, y: 252},
      {typeId: 1, x: 350, y: 220},
      {typeId: 2, x: 318, y: 220},
      {typeId: 2, x: 190, y: 188},
      {typeId: 0, x: 190, y: 156}
    ];

    // Shape 38 - Mixed formation
    allArmyFormations["shape38"] = [
      {typeId: 3, x: 350, y: 316},
      {typeId: 1, x: 286, y: 316},
      {typeId: 2, x: 254, y: 316},
      {typeId: 1, x: 286, y: 284},
      {typeId: 2, x: 254, y: 284},
      {typeId: 3, x: 350, y: 252},
      {typeId: 2, x: 286, y: 252},
      {typeId: 2, x: 254, y: 252},
      {typeId: 0, x: 190, y: 252},
      {typeId: 1, x: 286, y: 220},
      {typeId: 2, x: 254, y: 220},
      {typeId: 3, x: 350, y: 188},
      {typeId: 1, x: 286, y: 188},
      {typeId: 2, x: 254, y: 188}
    ];

    // Shape 39 - Mixed formation
    allArmyFormations["shape39"] = [
      {typeId: 3, x: 318, y: 348},
      {typeId: 2, x: 222, y: 348},
      {typeId: 2, x: 222, y: 316},
      {typeId: 2, x: 222, y: 284},
      {typeId: 3, x: 382, y: 252},
      {typeId: 2, x: 318, y: 252},
      {typeId: 2, x: 286, y: 252},
      {typeId: 2, x: 254, y: 252},
      {typeId: 2, x: 222, y: 252},
      {typeId: 0, x: 158, y: 252},
      {typeId: 2, x: 222, y: 220},
      {typeId: 2, x: 222, y: 188},
      {typeId: 3, x: 318, y: 156},
      {typeId: 2, x: 222, y: 156}
    ];

    // Shape 40 - Mixed formation
    allArmyFormations["shape40"] = [
      {typeId: 2, x: 286, y: 316},
      {typeId: 2, x: 254, y: 316},
      {typeId: 2, x: 222, y: 316},
      {typeId: 2, x: 190, y: 316},
      {typeId: 2, x: 190, y: 284},
      {typeId: 3, x: 318, y: 252},
      {typeId: 2, x: 222, y: 252},
      {typeId: 0, x: 158, y: 252},
      {typeId: 2, x: 254, y: 220},
      {typeId: 2, x: 286, y: 188},
      {typeId: 2, x: 286, y: 156},
      {typeId: 2, x: 254, y: 156},
      {typeId: 2, x: 222, y: 156},
      {typeId: 2, x: 190, y: 156}
    ];

    // Shape 41 - Mixed formation
    allArmyFormations["shape41"] = [
      {typeId: 3, x: 350, y: 348},
      {typeId: 2, x: 190, y: 348},
      {typeId: 2, x: 254, y: 316},
      {typeId: 2, x: 222, y: 316},
      {typeId: 2, x: 286, y: 284},
      {typeId: 2, x: 254, y: 284},
      {typeId: 2, x: 350, y: 252},
      {typeId: 2, x: 318, y: 252},
      {typeId: 2, x: 286, y: 252},
      {typeId: 1, x: 254, y: 252},
      {typeId: 2, x: 286, y: 220},
      {typeId: 2, x: 254, y: 220},
      {typeId: 2, x: 254, y: 188},
      {typeId: 2, x: 222, y: 188},
      {typeId: 3, x: 350, y: 156},
      {typeId: 2, x: 190, y: 156}
    ];

    // Shape 42 - Mixed formation
    allArmyFormations["shape42"] = [
      {typeId: 3, x: 318, y: 316},
      {typeId: 2, x: 286, y: 316},
      {typeId: 2, x: 254, y: 316},
      {typeId: 2, x: 222, y: 316},
      {typeId: 2, x: 190, y: 316},
      {typeId: 2, x: 158, y: 316},
      {typeId: 2, x: 254, y: 284},
      {typeId: 2, x: 222, y: 284},
      {typeId: 2, x: 254, y: 252},
      {typeId: 2, x: 222, y: 252},
      {typeId: 3, x: 318, y: 220},
      {typeId: 2, x: 286, y: 220},
      {typeId: 2, x: 254, y: 220},
      {typeId: 2, x: 222, y: 220},
      {typeId: 2, x: 190, y: 220},
      {typeId: 2, x: 158, y: 220}
    ];

    // Shape 43 - Mixed formation
    allArmyFormations["shape43"] = [
      {typeId: 3, x: 350, y: 348},
      {typeId: 2, x: 318, y: 348},
      {typeId: 3, x: 350, y: 316},
      {typeId: 2, x: 318, y: 316},
      {typeId: 3, x: 350, y: 284},
      {typeId: 2, x: 318, y: 284},
      {typeId: 3, x: 350, y: 252},
      {typeId: 2, x: 318, y: 252},
      {typeId: 3, x: 350, y: 220},
      {typeId: 2, x: 318, y: 220},
      {typeId: 2, x: 286, y: 220},
      {typeId: 2, x: 254, y: 220},
      {typeId: 2, x: 222, y: 220},
      {typeId: 2, x: 190, y: 220},
      {typeId: 1, x: 222, y: 156},
      {typeId: 1, x: 190, y: 156}
    ];

    // Shape 44 - Mixed formation
    allArmyFormations["shape44"] = [
      {typeId: 2, x: 318, y: 316},
      {typeId: 2, x: 286, y: 316},
      {typeId: 2, x: 254, y: 316},
      {typeId: 2, x: 222, y: 316},
      {typeId: 2, x: 190, y: 316},
      {typeId: 2, x: 318, y: 284},
      {typeId: 2, x: 318, y: 252},
      {typeId: 2, x: 286, y: 252},
      {typeId: 2, x: 254, y: 252},
      {typeId: 2, x: 222, y: 252},
      {typeId: 2, x: 318, y: 220},
      {typeId: 2, x: 318, y: 188},
      {typeId: 2, x: 286, y: 188},
      {typeId: 2, x: 254, y: 188},
      {typeId: 2, x: 222, y: 188},
      {typeId: 2, x: 190, y: 188}
    ];

    // Shape 45 - Mixed formation
    allArmyFormations["shape45"] = [
      {typeId: 1, x: 350, y: 348},
      {typeId: 1, x: 318, y: 348},
      {typeId: 1, x: 286, y: 348},
      {typeId: 1, x: 254, y: 348},
      {typeId: 1, x: 222, y: 348},
      {typeId: 1, x: 190, y: 348},
      {typeId: 1, x: 222, y: 316},
      {typeId: 1, x: 190, y: 316},
      {typeId: 3, x: 350, y: 284},
      {typeId: 1, x: 222, y: 284},
      {typeId: 1, x: 254, y: 252},
      {typeId: 1, x: 286, y: 220},
      {typeId: 1, x: 350, y: 188},
      {typeId: 1, x: 318, y: 188},
      {typeId: 1, x: 350, y: 156},
      {typeId: 1, x: 318, y: 156}
    ];

    // Shape 46 - Mixed formation
    allArmyFormations["shape46"] = [
      {typeId: 2, x: 318, y: 380},
      {typeId: 2, x: 286, y: 348},
      {typeId: 2, x: 254, y: 316},
      {typeId: 2, x: 318, y: 284},
      {typeId: 2, x: 286, y: 284},
      {typeId: 2, x: 222, y: 284},
      {typeId: 3, x: 382, y: 252},
      {typeId: 2, x: 318, y: 252},
      {typeId: 2, x: 286, y: 252},
      {typeId: 0, x: 158, y: 252},
      {typeId: 2, x: 318, y: 220},
      {typeId: 2, x: 286, y: 220},
      {typeId: 2, x: 222, y: 220},
      {typeId: 2, x: 254, y: 188},
      {typeId: 2, x: 286, y: 156},
      {typeId: 2, x: 318, y: 124}
    ];

    // Shape 47 - Mixed formation
    allArmyFormations["shape47"] = [
      {typeId: 3, x: 318, y: 348},
      {typeId: 2, x: 254, y: 348},
      {typeId: 2, x: 222, y: 348},
      {typeId: 3, x: 318, y: 316},
      {typeId: 2, x: 254, y: 316},
      {typeId: 2, x: 222, y: 316},
      {typeId: 3, x: 318, y: 284},
      {typeId: 2, x: 254, y: 284},
      {typeId: 2, x: 222, y: 284},
      {typeId: 3, x: 318, y: 252},
      {typeId: 2, x: 254, y: 252},
      {typeId: 2, x: 222, y: 252},
      {typeId: 3, x: 318, y: 220},
      {typeId: 2, x: 254, y: 220},
      {typeId: 2, x: 222, y: 220},
      {typeId: 0, x: 190, y: 156}
    ];

    // Shape 48 - Mixed formation
    allArmyFormations["shape48"] = [
      {typeId: 2, x: 286, y: 348},
      {typeId: 2, x: 254, y: 348},
      {typeId: 2, x: 222, y: 348},
      {typeId: 2, x: 286, y: 316},
      {typeId: 2, x: 254, y: 316},
      {typeId: 2, x: 222, y: 316},
      {typeId: 1, x: 318, y: 284},
      {typeId: 1, x: 318, y: 252},
      {typeId: 0, x: 190, y: 252},
      {typeId: 1, x: 318, y: 220},
      {typeId: 2, x: 286, y: 188},
      {typeId: 2, x: 254, y: 188},
      {typeId: 2, x: 222, y: 188},
      {typeId: 2, x: 286, y: 156},
      {typeId: 2, x: 254, y: 156},
      {typeId: 2, x: 222, y: 156}
    ];

    // Shape 49 - Mixed formation
    allArmyFormations["shape49"] = [
      {typeId: 0, x: 286, y: 380},
      {typeId: 1, x: 318, y: 348},
      {typeId: 2, x: 318, y: 316},
      {typeId: 1, x: 286, y: 316},
      {typeId: 2, x: 286, y: 284},
      {typeId: 2, x: 254, y: 284},
      {typeId: 3, x: 318, y: 252},
      {typeId: 2, x: 254, y: 252},
      {typeId: 2, x: 222, y: 252},
      {typeId: 2, x: 254, y: 220},
      {typeId: 2, x: 222, y: 220},
      {typeId: 2, x: 286, y: 188},
      {typeId: 2, x: 254, y: 188},
      {typeId: 2, x: 318, y: 156},
      {typeId: 2, x: 286, y: 156},
      {typeId: 2, x: 318, y: 124}
    ];

    // Shape 50 - Mixed formation
    allArmyFormations["shape50"] = [
      {typeId: 3, x: 350, y: 348},
      {typeId: 2, x: 286, y: 348},
      {typeId: 2, x: 254, y: 348},
      {typeId: 2, x: 286, y: 316},
      {typeId: 2, x: 254, y: 316},
      {typeId: 2, x: 318, y: 284},
      {typeId: 2, x: 286, y: 284},
      {typeId: 2, x: 254, y: 284},
      {typeId: 2, x: 222, y: 284},
      {typeId: 3, x: 350, y: 252},
      {typeId: 0, x: 158, y: 252},
      {typeId: 2, x: 318, y: 220},
      {typeId: 2, x: 286, y: 220},
      {typeId: 2, x: 254, y: 220},
      {typeId: 2, x: 222, y: 220},
      {typeId: 2, x: 286, y: 188},
      {typeId: 2, x: 254, y: 188},
      {typeId: 3, x: 350, y: 156},
      {typeId: 2, x: 286, y: 156},
      {typeId: 2, x: 254, y: 156}
    ];

    // Shape 51 - Mixed formation
    allArmyFormations["shape51"] = [
      {typeId: 3, x: 350, y: 380},
      {typeId: 3, x: 318, y: 380},
      {typeId: 2, x: 222, y: 380},
      {typeId: 2, x: 190, y: 380},
      {typeId: 2, x: 254, y: 348},
      {typeId: 1, x: 318, y: 316},
      {typeId: 2, x: 286, y: 316},
      {typeId: 2, x: 318, y: 284},
      {typeId: 2, x: 350, y: 252},
      {typeId: 1, x: 318, y: 252},
      {typeId: 2, x: 318, y: 220},
      {typeId: 1, x: 318, y: 188},
      {typeId: 2, x: 286, y: 188},
      {typeId: 2, x: 254, y: 156},
      {typeId: 3, x: 350, y: 124},
      {typeId: 3, x: 318, y: 124},
      {typeId: 2, x: 222, y: 124},
      {typeId: 2, x: 190, y: 124}
    ];

    // Shape 52 - Mixed formation
    allArmyFormations["shape52"] = [
      {typeId: 2, x: 286, y: 380},
      {typeId: 2, x: 254, y: 348},
      {typeId: 2, x: 222, y: 316},
      {typeId: 2, x: 190, y: 284},
      {typeId: 3, x: 382, y: 252},
      {typeId: 3, x: 350, y: 252},
      {typeId: 3, x: 318, y: 252},
      {typeId: 3, x: 286, y: 252},
      {typeId: 3, x: 254, y: 252},
      {typeId: 3, x: 222, y: 252},
      {typeId: 1, x: 190, y: 252},
      {typeId: 2, x: 158, y: 252},
      {typeId: 2, x: 190, y: 220},
      {typeId: 2, x: 222, y: 188},
      {typeId: 2, x: 254, y: 156},
      {typeId: 2, x: 286, y: 124}
    ];

    // Shape 53 - Mixed formation
    allArmyFormations["shape53"] = [
      {typeId: 1, x: 286, y: 348},
      {typeId: 1, x: 254, y: 348},
      {typeId: 1, x: 222, y: 348},
      {typeId: 1, x: 190, y: 348},
      {typeId: 2, x: 286, y: 316},
      {typeId: 2, x: 254, y: 316},
      {typeId: 2, x: 222, y: 316},
      {typeId: 2, x: 190, y: 316},
      {typeId: 3, x: 318, y: 284},
      {typeId: 3, x: 318, y: 220},
      {typeId: 2, x: 286, y: 188},
      {typeId: 2, x: 254, y: 188},
      {typeId: 2, x: 222, y: 188},
      {typeId: 2, x: 190, y: 188},
      {typeId: 1, x: 286, y: 156},
      {typeId: 1, x: 254, y: 156},
      {typeId: 1, x: 222, y: 156},
      {typeId: 1, x: 190, y: 156}
    ];

    // Shape 54 - Mixed formation
    allArmyFormations["shape54"] = [
      {typeId: 2, x: 222, y: 348},
      {typeId: 2, x: 254, y: 316},
      {typeId: 2, x: 222, y: 316},
      {typeId: 3, x: 318, y: 284},
      {typeId: 2, x: 286, y: 284},
      {typeId: 2, x: 254, y: 284},
      {typeId: 2, x: 222, y: 284},
      {typeId: 3, x: 318, y: 252},
      {typeId: 2, x: 286, y: 252},
      {typeId: 2, x: 254, y: 252},
      {typeId: 2, x: 222, y: 252},
      {typeId: 3, x: 318, y: 220},
      {typeId: 2, x: 286, y: 220},
      {typeId: 2, x: 254, y: 220},
      {typeId: 2, x: 222, y: 220},
      {typeId: 2, x: 254, y: 188},
      {typeId: 2, x: 222, y: 188},
      {typeId: 2, x: 222, y: 156}
    ];

    // Shape 55 - Mixed formation
    allArmyFormations["shape55"] = [
      {typeId: 3, x: 286, y: 348},
      {typeId: 2, x: 254, y: 348},
      {typeId: 3, x: 286, y: 316},
      {typeId: 2, x: 254, y: 316},
      {typeId: 2, x: 222, y: 316},
      {typeId: 3, x: 286, y: 284},
      {typeId: 2, x: 254, y: 284},
      {typeId: 2, x: 222, y: 284},
      {typeId: 1, x: 190, y: 284},
      {typeId: 3, x: 286, y: 252},
      {typeId: 2, x: 254, y: 252},
      {typeId: 2, x: 222, y: 252},
      {typeId: 1, x: 190, y: 252},
      {typeId: 3, x: 286, y: 220},
      {typeId: 2, x: 254, y: 220},
      {typeId: 2, x: 222, y: 220},
      {typeId: 3, x: 286, y: 188},
      {typeId: 2, x: 254, y: 188}
    ];

    // Shape 56 - Mixed formation
    allArmyFormations["shape56"] = [
      {typeId: 3, x: 158, y: 380},
      {typeId: 3, x: 382, y: 348},
      {typeId: 2, x: 318, y: 348},
      {typeId: 2, x: 286, y: 348},
      {typeId: 2, x: 254, y: 348},
      {typeId: 2, x: 222, y: 348},
      {typeId: 2, x: 350, y: 252},
      {typeId: 2, x: 318, y: 252},
      {typeId: 2, x: 286, y: 252},
      {typeId: 2, x: 254, y: 252},
      {typeId: 2, x: 222, y: 252},
      {typeId: 0, x: 158, y: 252},
      {typeId: 3, x: 382, y: 156},
      {typeId: 2, x: 318, y: 156},
      {typeId: 2, x: 286, y: 156},
      {typeId: 2, x: 254, y: 156},
      {typeId: 2, x: 222, y: 156},
      {typeId: 3, x: 158, y: 124}
    ];

    // Shape 57 - Mixed formation
    allArmyFormations["shape57"] = [
      {typeId: 1, x: 222, y: 380},
      {typeId: 1, x: 190, y: 380},
      {typeId: 1, x: 222, y: 348},
      {typeId: 1, x: 190, y: 348},
      {typeId: 0, x: 190, y: 316},
      {typeId: 2, x: 318, y: 284},
      {typeId: 2, x: 286, y: 284},
      {typeId: 2, x: 254, y: 284},
      {typeId: 1, x: 222, y: 284},
      {typeId: 1, x: 190, y: 284},
      {typeId: 2, x: 318, y: 252},
      {typeId: 2, x: 286, y: 252},
      {typeId: 2, x: 254, y: 252},
      {typeId: 1, x: 222, y: 252},
      {typeId: 1, x: 190, y: 252},
      {typeId: 3, x: 318, y: 188},
      {typeId: 3, x: 286, y: 188},
      {typeId: 3, x: 254, y: 188}
    ];

    // Shape 58 - Mixed formation
    allArmyFormations["shape58"] = [
      {typeId: 3, x: 254, y: 380},
      {typeId: 3, x: 350, y: 348},
      {typeId: 2, x: 254, y: 348},
      {typeId: 2, x: 222, y: 348},
      {typeId: 2, x: 254, y: 316},
      {typeId: 2, x: 222, y: 316},
      {typeId: 2, x: 254, y: 284},
      {typeId: 2, x: 222, y: 284},
      {typeId: 2, x: 254, y: 252},
      {typeId: 2, x: 222, y: 252},
      {typeId: 3, x: 350, y: 220},
      {typeId: 2, x: 254, y: 220},
      {typeId: 2, x: 222, y: 220},
      {typeId: 3, x: 254, y: 188},
      {typeId: 2, x: 318, y: 156},
      {typeId: 2, x: 286, y: 156},
      {typeId: 2, x: 254, y: 156},
      {typeId: 0, x: 190, y: 156}
    ];

    // Shape 59 - Mixed formation
    allArmyFormations["shape59"] = [
      {typeId: 2, x: 318, y: 348},
      {typeId: 2, x: 286, y: 348},
      {typeId: 2, x: 222, y: 348},
      {typeId: 2, x: 190, y: 348},
      {typeId: 2, x: 318, y: 316},
      {typeId: 2, x: 286, y: 316},
      {typeId: 2, x: 222, y: 316},
      {typeId: 2, x: 190, y: 316},
      {typeId: 3, x: 318, y: 252},
      {typeId: 0, x: 158, y: 252},
      {typeId: 2, x: 318, y: 188},
      {typeId: 2, x: 286, y: 188},
      {typeId: 2, x: 222, y: 188},
      {typeId: 2, x: 190, y: 188},
      {typeId: 2, x: 318, y: 156},
      {typeId: 2, x: 286, y: 156},
      {typeId: 2, x: 222, y: 156},
      {typeId: 2, x: 190, y: 156}
    ];

    // Shape 60 - Mixed formation
    allArmyFormations["shape60"] = [
      {typeId: 3, x: 382, y: 348},
      {typeId: 0, x: 190, y: 348},
      {typeId: 3, x: 382, y: 316},
      {typeId: 2, x: 318, y: 316},
      {typeId: 2, x: 286, y: 316},
      {typeId: 1, x: 190, y: 316},
      {typeId: 2, x: 286, y: 284},
      {typeId: 2, x: 254, y: 284},
      {typeId: 2, x: 254, y: 252},
      {typeId: 2, x: 222, y: 252},
      {typeId: 2, x: 286, y: 220},
      {typeId: 2, x: 254, y: 220},
      {typeId: 3, x: 382, y: 188},
      {typeId: 2, x: 318, y: 188},
      {typeId: 2, x: 286, y: 188},
      {typeId: 1, x: 190, y: 188},
      {typeId: 3, x: 382, y: 156},
      {typeId: 0, x: 190, y: 156}
    ];

    return allArmyFormations;
  }

  // Method to get a specific formation by shape number
  public getFormation(shapeNumber: number): FormationUnit[] | undefined {
    const shapeKey = `shape${shapeNumber}`;
    return this.data[shapeKey];
  }

  // Method to get all available formation shapes
  public getAllFormationShapes(): string[] {
    return Object.keys(this.data);
  }

  // Method to get formation count
  public getFormationCount(): number {
    return Object.keys(this.data).length;
  }

  // Method to validate a formation
  public isValidFormation(formation: FormationUnit[]): boolean {
    if (!formation || formation.length === 0) {
      return false;
    }
    
    return formation.every(unit => 
      unit.typeId >= 0 && unit.typeId <= 4 && 
      unit.x >= 0 && unit.y >= 0
    );
  }
}

export { ArmyFormation };
export type { ArmyFormationsData };
