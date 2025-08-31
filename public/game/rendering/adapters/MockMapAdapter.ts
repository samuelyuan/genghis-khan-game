import { IMapRenderer } from '../../interfaces/IMapRenderer.js';

export class MockMapAdapter implements IMapRenderer {
  private colors: Record<string, string> = {};
  private onRegionClickCallback?: (code: string) => void;
  private isVisible: boolean = false;

  buildMap(countryData: any[]): void {
    console.log('MockMapAdapter: buildMap called with', countryData.length, 'countries');
  }

  updateColors(colors: Record<string, string>): void {
    this.colors = { ...colors };
    console.log('MockMapAdapter: updateColors called with', Object.keys(colors).length, 'colors');
  }

  onRegionClick(callback: (code: string) => void): void {
    this.onRegionClickCallback = callback;
    console.log('MockMapAdapter: onRegionClick callback registered');
  }

  destroy(): void {
    this.colors = {};
    this.onRegionClickCallback = undefined;
    console.log('MockMapAdapter: destroy called');
  }

  show(): void {
    this.isVisible = true;
    console.log('MockMapAdapter: show called');
  }

  hide(): void {
    this.isVisible = false;
    console.log('MockMapAdapter: hide called');
  }

  // Mock methods for testing
  getColors(): Record<string, string> {
    return { ...this.colors };
  }

  isMapVisible(): boolean {
    return this.isVisible;
  }

  simulateRegionClick(code: string): void {
    if (this.onRegionClickCallback) {
      this.onRegionClickCallback(code);
    }
  }
}
