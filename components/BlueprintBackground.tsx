import { FluidInkCanvas } from "./FluidInkCanvas";

export function BlueprintBackground() {
  return <div className="blueprint-background" aria-hidden="true"><div className="blueprint-grid" /><FluidInkCanvas /><svg className="blueprint-grain" width="100%" height="100%"><filter id="blueprint-noise"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="1" stitchTiles="stitch" /></filter><rect width="100%" height="100%" filter="url(#blueprint-noise)" /></svg></div>;
}
