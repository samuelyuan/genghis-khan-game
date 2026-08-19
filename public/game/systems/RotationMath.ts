// Pure angle-turn math; operates on plain numbers, no Soldier/Vector dependency.

export interface RotationThresholds {
  /** Below this many degrees of remaining delta, treat rotation as settled. */
  angleThreshold: number;
  /** Beyond this many degrees, it's shorter to turn the other way around. */
  angleWrapThreshold: number;
  /** Degrees in a full turn (360). */
  fullCircle: number;
}

export interface RotationStepResult {
  /** False when the delta was within angleThreshold and nothing should change. */
  changed: boolean;
  /** The unit's new rotation in degrees (only meaningful when changed is true). */
  newRotation: number;
}

/** One turn step toward targetRotationDegrees, scaled by moveSpeed, always via the shorter direction. */
export function computeRotationStep(
  currentRotation: number,
  targetRotationDegrees: number,
  moveSpeed: number,
  thresholds: RotationThresholds
): RotationStepResult {
  let angleDelta = targetRotationDegrees - currentRotation;
  angleDelta = angleDelta % thresholds.fullCircle;
  angleDelta = angleDelta >= 0 ? angleDelta : angleDelta + thresholds.fullCircle;

  let angleAbs = Math.abs(angleDelta);

  if (angleAbs <= thresholds.angleThreshold) {
    return { changed: false, newRotation: currentRotation };
  }

  let angleSign = angleAbs / angleDelta;

  if (angleAbs > thresholds.angleWrapThreshold) {
    angleAbs = thresholds.fullCircle - angleAbs;
    angleSign = -angleSign;
  }

  const newRotation = currentRotation + angleSign * angleAbs * moveSpeed;
  return { changed: true, newRotation };
}
