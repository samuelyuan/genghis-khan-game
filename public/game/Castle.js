class Castle {
  constructor(hitPoints, xLine) {
    this.maxHitPoints = hitPoints;
    this.hitPoints = this.maxHitPoints;
    this.sType = "castle";
    this.xOffset = 0;
    this.xLine = xLine;
  }

  loseHitPoints(power) {
    this.hitPoints = this.hitPoints - power;
    if (this.hitPoints < 0) {
      this.hitPoints = 0;
    }
  }
}

export { Castle }
