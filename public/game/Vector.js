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

  getAng() {
    return Math.atan2(this.y, this.x) * 57.29578;
  }

  setAng(angle) {
    var length = this.getLength();
    this.x = length * Math.cos(angle * 0.017453);
    this.y = length * Math.sin(angle * 0.017453);
  }

  getLength() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
}

export { Vector }
