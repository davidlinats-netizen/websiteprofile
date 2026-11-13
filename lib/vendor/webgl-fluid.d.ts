export type FluidRenderer = {
  move(x: number, y: number, dx: number, dy: number): void;
  tick(dt: number): void;
  resize(): void;
  clear(): void;
  dispose(): void;
};
export function createFluid(canvas: HTMLCanvasElement): FluidRenderer;
