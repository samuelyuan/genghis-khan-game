import { describe, it, expect } from 'vitest';
import { UnitStats, UnitType } from './UnitStats.js';
import { TerrainType } from '../types/types.js';

describe('UnitStats.getLandRate', () => {
  const stats = new UnitStats();

  it('returns [hitPointRate, powerRate] for every unit type on Plain', () => {
    expect(stats.getLandRate('cavalry', TerrainType.Plain)).toEqual([0.1, 0.15]);
    expect(stats.getLandRate('pike', TerrainType.Plain)).toEqual([0.15, 0.2]);
    expect(stats.getLandRate('sword', TerrainType.Plain)).toEqual([-0.05, -0.05]);
    expect(stats.getLandRate('bow', TerrainType.Plain)).toEqual([0.2, 0.1]);
  });

  it('penalizes cavalry heavily on Mountain and Forest', () => {
    expect(stats.getLandRate('cavalry', TerrainType.Mountain)).toEqual([-0.5, -0.4]);
    expect(stats.getLandRate('cavalry', TerrainType.Forest)).toEqual([-0.4, -0.4]);
  });

  it('rewards bow units on Grassland', () => {
    expect(stats.getLandRate('bow', TerrainType.Grassland)).toEqual([0.15, 0.2]);
  });
});

describe('UnitStats.getMaxHitPoints / getUnitPower at level 0', () => {
  // At level 0 the upgrade loop never runs, so the result is just the
  // base stat adjusted by the terrain land-rate modifier.
  const stats = new UnitStats();

  it('applies the terrain hit-point modifier for each unit type on Plain', () => {
    expect(stats.getMaxHitPoints(0, UnitType.Cavalry, TerrainType.Plain)).toBe(330); // 300 * 1.1
    expect(stats.getMaxHitPoints(0, UnitType.Pike, TerrainType.Plain)).toBe(230); // 200 * 1.15
    expect(stats.getMaxHitPoints(0, UnitType.Sword, TerrainType.Plain)).toBe(190); // 200 * 0.95
    expect(stats.getMaxHitPoints(0, UnitType.Bow, TerrainType.Plain)).toBe(120); // 100 * 1.2
  });

  it('applies the terrain power modifier for each unit type on Plain', () => {
    expect(stats.getUnitPower(0, UnitType.Cavalry, TerrainType.Plain)).toBe(23); // 20 * 1.15
    expect(stats.getUnitPower(0, UnitType.Pike, TerrainType.Plain)).toBe(14.4); // 12 * 1.2 (unfloored, no loop ran)
    expect(stats.getUnitPower(0, UnitType.Sword, TerrainType.Plain)).toBe(7.6); // 8 * 0.95
    expect(stats.getUnitPower(0, UnitType.Bow, TerrainType.Plain)).toBe(11); // 10 * 1.1
  });

  it('reflects harsh terrain (Mountain) reducing cavalry stats', () => {
    expect(stats.getMaxHitPoints(0, UnitType.Cavalry, TerrainType.Mountain)).toBe(150); // 300 * 0.5
    expect(stats.getUnitPower(0, UnitType.Cavalry, TerrainType.Mountain)).toBe(12); // 20 * 0.6
  });
});

describe('UnitStats.getMaxHitPoints / getUnitPower at higher levels', () => {
  const stats = new UnitStats();

  it('compounds the per-level upgrade rate, flooring after every iteration', () => {
    // base=330 (300*1.1), rate=0.144, 2 iterations: 330->377->431
    expect(stats.getMaxHitPoints(1, UnitType.Cavalry, TerrainType.Plain)).toBe(431);
  });

  it('produces monotonically increasing hit points as level rises', () => {
    const lvl0 = stats.getMaxHitPoints(0, UnitType.Sword, TerrainType.Grassland);
    const lvl1 = stats.getMaxHitPoints(1, UnitType.Sword, TerrainType.Grassland);
    const lvl2 = stats.getMaxHitPoints(2, UnitType.Sword, TerrainType.Grassland);
    expect(lvl1).toBeGreaterThan(lvl0);
    expect(lvl2).toBeGreaterThan(lvl1);
  });
});

describe('UnitStats.getCountryPower', () => {
  const stats = new UnitStats();

  it('does not apply a terrain modifier (unlike unit hit points/power)', () => {
    // rate=0.144, 2 iterations: 100->114->130
    expect(stats.getCountryPower(100, 0.1, 1)).toBe(130);
  });

  it('clamps the effective rate to minRate (0.05) once it would go non-positive', () => {
    // rate=0 always clamps to minRate=0.05; 2 iterations: 100->105->110
    expect(stats.getCountryPower(100, 0, 1)).toBe(110);
  });

  it('returns the base value unchanged at level 0 (no upgrade iterations)', () => {
    expect(stats.getCountryPower(500, 0.2, 0)).toBe(500);
  });
});
