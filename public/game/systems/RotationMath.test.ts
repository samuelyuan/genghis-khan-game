import { describe, it, expect } from 'vitest';
import { computeRotationStep, RotationThresholds } from './RotationMath.js';

const THRESHOLDS: RotationThresholds = {
  angleThreshold: 1,
  angleWrapThreshold: 180,
  fullCircle: 360
};

describe('computeRotationStep', () => {
  it('reports no change when already facing the target angle', () => {
    const result = computeRotationStep(45, 45, 0.1, THRESHOLDS);
    expect(result.changed).toBe(false);
    expect(result.newRotation).toBe(45);
  });

  it('reports no change when within the angle threshold', () => {
    const result = computeRotationStep(45, 45.5, 0.1, THRESHOLDS);
    expect(result.changed).toBe(false);
  });

  it('turns toward a target ahead of current rotation, scaled by moveSpeed', () => {
    const result = computeRotationStep(0, 90, 0.5, THRESHOLDS);
    expect(result.changed).toBe(true);
    expect(result.newRotation).toBeCloseTo(45); // delta(90) * moveSpeed(0.5)
  });

  it('always turns the short way around when the delta exceeds the wrap threshold', () => {
    // short way from 0 to 270 is -90, not +270
    const result = computeRotationStep(0, 270, 1, THRESHOLDS);
    expect(result.changed).toBe(true);
    expect(((result.newRotation % 360) + 360) % 360).toBeCloseTo(270);
  });

  it('normalizes negative target angles the same as their 0-360 equivalent', () => {
    const a = computeRotationStep(0, -90, 1, THRESHOLDS);
    const b = computeRotationStep(0, 270, 1, THRESHOLDS);
    expect(((a.newRotation % 360) + 360) % 360).toBeCloseTo(((b.newRotation % 360) + 360) % 360);
  });

  it('moves the full remaining delta when moveSpeed is 1 (reaches target in one step)', () => {
    const result = computeRotationStep(10, 40, 1, THRESHOLDS);
    expect(result.newRotation).toBeCloseTo(40);
  });

  it('moves only a fraction of the delta for moveSpeed < 1', () => {
    const result = computeRotationStep(0, 40, 0.25, THRESHOLDS);
    expect(result.newRotation).toBeCloseTo(10);
  });
});
