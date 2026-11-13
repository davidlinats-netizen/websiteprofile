# Fluid background renderer

`webgl-fluid.js` is an MIT-licensed local adaptation of Pavel Dobryakov's WebGL Fluid Simulation, the live reference David approved.

- Upstream: https://github.com/PavelDoGreat/WebGL-Fluid-Simulation
- Revision: `a2d292931f19d9b3b9f564e23e6c32729d2121c3`
- Original `script.js` SHA-256: `291d86de38ea23b8fb63d1879afeea77e9a4556900bbd67e13bc1d5ea007ce4e`
- License and attribution remain at the top of the adapted source.

The simulation uses the upstream advection, pressure, vorticity, shading and bloom shaders. It is not the earlier low-resolution CPU approximation.

## Integration changes

- Factory scoped to one canvas. React owns listeners, animation scheduling, eligibility and cleanup.
- Removed GUI, promotions, analytics, external image requests, random startup splashes and keyboard/touch interactions.
- Blue/cyan palette; transparent compositing over the existing textured blueprint background.
- Dye resolution 1024, velocity resolution 192, output pixel ratio capped at 1.5 and longest backing dimension capped at 2048.
- Generated local dithering texture; no runtime third-party network dependency.
- Native GPU resources tracked and released on resize, initialization failure and unmount. Static fallback for unavailable WebGL/float textures, reduced motion or touch; context loss/restoration handled.
- After 2 seconds without pointer movement, the remaining illumination fades over 1.2 seconds. Rendering only stops/clears after at least 3.5 seconds and computed opacity is effectively zero, so a delayed frame cannot abruptly remove visible brightness. New input smoothly restores illumination over 250ms. Hidden/blurred documents clear immediately.
- `preserveDrawingBuffer` is enabled for deterministic canvas visual/pixel checks. This is a deliberate quality-verification tradeoff, not a measured performance improvement.

## Proof

`tests/blueprint-background.spec.ts` verifies actual GPU ink pixels, backing resolution, evolving trails, idle clearing, unsupported-WebGL fallback, navigation, resize, context loss/restoration, light theme, reduced motion and touch fallback. Local Chrome exercised successfully. Nine focused browser tests, eight unit tests and TypeScript passed on November 5, 2026. Screenshots: `cache/blueprint-fluid-trail.png` and `cache/blueprint-gpu-light.png`.

No universal frame-rate or cross-GPU compatibility claim. Static fallback preserves the site when animation is unavailable. No publication performed.
