class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  clone() {
    return new Vector(this.x, this.y);
  }

  reset(newX, newY) {
    this.x = newX;
    this.y = newY;
  }

  getAngle() {
    return this.radiansToDegrees(Math.atan2(this.y, this.x));
  }

  setAngle(angleInDegrees) {
    var length = this.getLength();
    this.x = length * Math.cos(this.degreesToRadians(angleInDegrees));
    this.y = length * Math.sin(this.degreesToRadians(angleInDegrees));
  }

  getLength() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  radiansToDegrees(radians) {
    return radians * 180.0 / Math.PI;
  }

  degreesToRadians(degrees) {
    return degrees * Math.PI / 180.0;
  }
}

export { Vector }
