import { describe, it, expect } from 'vitest';
import { Vector } from './Vector.js';

describe('Vector', () => {
  it('clone() returns a separate equal instance', () => {
    const v = new Vector(3, 4);
    const c = v.clone();
    expect(c).not.toBe(v);
    expect(c.x).toBe(3);
    expect(c.y).toBe(4);
  });

  it('reset() overwrites x/y in place', () => {
    const v = new Vector(1, 1);
    v.reset(5, -2);
    expect(v.x).toBe(5);
    expect(v.y).toBe(-2);
  });

  it('getLength() computes the Euclidean norm', () => {
    expect(new Vector(3, 4).getLength()).toBe(5);
    expect(new Vector(0, 0).getLength()).toBe(0);
  });

  it('getAngle() returns degrees, matching atan2 semantics', () => {
    expect(new Vector(1, 0).getAngle()).toBeCloseTo(0);
    expect(new Vector(0, 1).getAngle()).toBeCloseTo(90);
    expect(new Vector(-1, 0).getAngle()).toBeCloseTo(180);
    expect(new Vector(0, -1).getAngle()).toBeCloseTo(-90);
  });

  it('setAngle() preserves length while rotating to the given angle', () => {
    const v = new Vector(5, 0);
    v.setAngle(90);
    expect(v.getLength()).toBeCloseTo(5);
    expect(v.x).toBeCloseTo(0);
    expect(v.y).toBeCloseTo(5);
  });

  it('degrees/radians conversions round-trip', () => {
    const v = new Vector(0, 0);
    const deg = 123.45;
    expect(v.radiansToDegrees(v.degreesToRadians(deg))).toBeCloseTo(deg);
  });

  it('add()/subtract() are inverses and return new instances', () => {
    const a = new Vector(1, 2);
    const b = new Vector(3, -1);
    const sum = a.add(b);
    expect(sum).not.toBe(a);
    expect(sum.x).toBe(4);
    expect(sum.y).toBe(1);
    const back = sum.subtract(b);
    expect(back.x).toBe(a.x);
    expect(back.y).toBe(a.y);
  });

  it('multiply() scales both components', () => {
    const v = new Vector(2, -3).multiply(2.5);
    expect(v.x).toBe(5);
    expect(v.y).toBe(-7.5);
  });

  it('normalize() produces a unit vector in the same direction', () => {
    const v = new Vector(3, 4).normalize();
    expect(v.getLength()).toBeCloseTo(1);
    expect(v.x).toBeCloseTo(0.6);
    expect(v.y).toBeCloseTo(0.8);
  });

  it('normalize() of the zero vector returns zero instead of NaN', () => {
    const v = new Vector(0, 0).normalize();
    expect(v.x).toBe(0);
    expect(v.y).toBe(0);
  });

  it('distanceTo() computes distance between two points', () => {
    const a = new Vector(0, 0);
    const b = new Vector(3, 4);
    expect(a.distanceTo(b)).toBe(5);
    expect(b.distanceTo(a)).toBe(5);
  });
});
