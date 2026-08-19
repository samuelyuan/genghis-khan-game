/** Minimal shape a candidate target needs for distance-based selection. */
export interface TargetCandidate {
  isDead: boolean;
  xPos: number;
  yPos: number;
}

interface ScoredCandidate<T> {
  candidate: T;
  dist: number;
  dy: number;
}

/**
 * Picks the attack target for a unit at (currentX, currentY). Eligible
 * candidates are alive and either within melee range (dist < hitDist), or
 * within the ranged band (hitDist < dist < hitDist + rangeOffset) when a
 * melee-range candidate also exists. Among eligible candidates, the smallest
 * vertical offset (dy) wins, ties broken by smallest distance. Null if none
 * are eligible.
 */
export function selectNearestTarget<T extends TargetCandidate>(
  currentX: number,
  currentY: number,
  candidates: T[],
  hitDist: number,
  rangeOffset: number
): T | null {
  const scored: ScoredCandidate<T>[] = candidates
    .filter(candidate => !candidate.isDead)
    .map(candidate => {
      const deltaX = candidate.xPos - currentX;
      const deltaY = candidate.yPos - currentY;
      return {
        candidate,
        dist: Math.sqrt(deltaX * deltaX + deltaY * deltaY),
        dy: Math.abs(deltaY)
      };
    });

  const withinMeleeRange = scored.filter(entry => entry.dist < hitDist);

  let withinRangedBand: ScoredCandidate<T>[] = [];
  if (withinMeleeRange.length > 0) {
    withinRangedBand = scored
      .filter(entry => entry.dist < hitDist + rangeOffset)
      .filter(entry => entry.dist > hitDist);
  }

  const attackable = [...withinMeleeRange, ...withinRangedBand];
  if (attackable.length === 0) {
    return null;
  }

  attackable.sort((a, b) => a.dy - b.dy);
  const closestDy = attackable[0].dy;
  const matchingDy = attackable.filter(entry => entry.dy === closestDy);
  matchingDy.sort((a, b) => a.dist - b.dist);

  return matchingDy.length > 0 ? matchingDy[0].candidate : null;
}
