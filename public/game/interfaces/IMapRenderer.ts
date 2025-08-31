export interface IMapRenderer {
  buildMap(countryData: any[]): void;
  updateColors(colors: Record<string, string>): void;
  onRegionClick(callback: (code: string) => void): void;
  destroy(): void;
  show(): void;
  hide(): void;
}
