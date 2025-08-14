export class Vector {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  clone(): Vector {
    return new Vector(this.x, this.y);
  }

  reset(newX: number, newY: number): void {
    this.x = newX;
    this.y = newY;
  }

  getAngle(): number {
    return this.radiansToDegrees(Math.atan2(this.y, this.x));
  }

  setAngle(angleInDegrees: number): void {
    const length = this.getLength();
    this.x = length * Math.cos(this.degreesToRadians(angleInDegrees));
    this.y = length * Math.sin(this.degreesToRadians(angleInDegrees));
  }

  getLength(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  radiansToDegrees(radians: number): number {
    return radians * 180.0 / Math.PI;
  }

  degreesToRadians(degrees: number): number {
    return degrees * Math.PI / 180.0;
  }

  // Utility methods for vector operations
  add(other: Vector): Vector {
    return new Vector(this.x + other.x, this.y + other.y);
  }

  subtract(other: Vector): Vector {
    return new Vector(this.x - other.x, this.y - other.y);
  }

  multiply(scalar: number): Vector {
    return new Vector(this.x * scalar, this.y * scalar);
  }

  normalize(): Vector {
    const length = this.getLength();
    if (length === 0) return new Vector(0, 0);
    return new Vector(this.x / length, this.y / length);
  }

  distanceTo(other: Vector): number {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

