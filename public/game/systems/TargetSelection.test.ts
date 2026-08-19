import { describe, it, expect } from 'vitest';
import { selectNearestTarget, TargetCandidate } from './TargetSelection.js';

function candidate(xPos: number, yPos: number, isDead = false): TargetCandidate {
  return { xPos, yPos, isDead };
}

describe('selectNearestTarget', () => {
  const HIT_DIST = 100;
  const RANGE_OFFSET = 150;

  it('returns null when there are no candidates', () => {
    expect(selectNearestTarget(0, 0, [], HIT_DIST, RANGE_OFFSET)).toBeNull();
  });

  it('returns null when every candidate is out of both melee and ranged reach', () => {
    const far = candidate(1000, 1000);
    expect(selectNearestTarget(0, 0, [far], HIT_DIST, RANGE_OFFSET)).toBeNull();
  });

  it('ignores dead candidates entirely', () => {
    const deadButClose = candidate(10, 0, true);
    expect(selectNearestTarget(0, 0, [deadButClose], HIT_DIST, RANGE_OFFSET)).toBeNull();
  });

  it('picks a single candidate within melee range', () => {
    const target = candidate(50, 0);
    expect(selectNearestTarget(0, 0, [target], HIT_DIST, RANGE_OFFSET)).toBe(target);
  });

  it('prefers the candidate with the smallest vertical offset (dy) over raw distance', () => {
    const aligned = candidate(90, 0); // dist=90, dy=0
    const near = candidate(0, 50); // dist=50, dy=50
    const result = selectNearestTarget(0, 0, [near, aligned], HIT_DIST, RANGE_OFFSET);
    expect(result).toBe(aligned);
  });

  it('breaks ties on equal dy by picking the smallest distance', () => {
    const closer = candidate(30, 0); // dist=30, dy=0
    const farther = candidate(-80, 0); // dist=80, dy=0
    const result = selectNearestTarget(0, 0, [farther, closer], HIT_DIST, RANGE_OFFSET);
    expect(result).toBe(closer);
  });

  it('only considers ranged-band candidates when a melee-range candidate also exists', () => {
    const rangedOnly = candidate(120, 0); // beyond hitDist, within ranged band
    expect(selectNearestTarget(0, 0, [rangedOnly], HIT_DIST, RANGE_OFFSET)).toBeNull();
  });

  it('considers ranged-band candidates once a melee-range candidate exists, still preferring lower dy', () => {
    const melee = candidate(50, 0); // dist=50 (melee), dy=0
    const rangedAligned = candidate(120, 0); // dist=120 (ranged band), dy=0
    const rangedOffAxis = candidate(0, 120); // dist=120 (ranged band), dy=120
    const result = selectNearestTarget(
      0,
      0,
      [melee, rangedAligned, rangedOffAxis],
      HIT_DIST,
      RANGE_OFFSET
    );
    expect(result).toBe(melee); // ties on dy=0; smaller distance wins
  });

  it('excludes a candidate sitting exactly at hitDist (neither < nor > hitDist)', () => {
    const melee = candidate(10, 0);
    const atBoundary = candidate(HIT_DIST, 0); // dist === HIT_DIST exactly
    const result = selectNearestTarget(0, 0, [melee, atBoundary], HIT_DIST, RANGE_OFFSET);
    expect(result).toBe(melee);
  });
});
