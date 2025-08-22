class Castle {
  public maxHitPoints: number;
  public hitPoints: number;
  public sType: string;
  public xOffset: number;
  public xLine: number;

  constructor(hitPoints: number, xLine: number) {
    this.maxHitPoints = hitPoints;
    this.hitPoints = this.maxHitPoints;
    this.sType = "castle";
    this.xOffset = 0;
    this.xLine = xLine;
  }

  public loseHitPoints(power: number): void {
    this.hitPoints = this.hitPoints - power;
    if (this.hitPoints < 0) {
      this.hitPoints = 0;
    }
  }
}

export { Castle };
