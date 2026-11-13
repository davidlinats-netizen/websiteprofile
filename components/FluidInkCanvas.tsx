"use client";

import { useEffect, useRef } from "react";
import { createFluid, type FluidRenderer } from "@/lib/vendor/webgl-fluid.js";

export function FluidInkCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const allowed = matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let fluid: FluidRenderer | null = null;
    let frame = 0, last = 0, lastInput = 0;
    let pointer: { x: number; y: number } | null = null;
    let failed = false;
    function clear() {
      cancelAnimationFrame(frame); frame = 0; last = 0; pointer = null;
      canvas!.style.opacity = "0";
      fluid?.clear();
      canvas!.dataset.flowing = "false";
    }
    function initialize() {
      if (!allowed.matches || failed || fluid) return;
      try {
        fluid = createFluid(canvas!);
        canvas!.dataset.renderer = "webgl";
      } catch {
        failed = true;
        canvas!.dataset.renderer = "static";
      }
    }
    function draw(now: number) {
      if (!allowed.matches || document.hidden || !fluid) { clear(); return; }
      const dt = last ? Math.min((now - last) / 1000, .032) : .016;
      last = now;
      fluid.tick(dt);
      const idle = now - lastInput;
      if (idle >= 2000) {
        canvas!.style.transitionDuration = "1200ms";
        canvas!.style.opacity = "0";
      }
      // Never clear visible illumination, even after a delayed animation frame.
      if (idle >= 3500 && Number(getComputedStyle(canvas!).opacity) <= .001) clear();
      else frame = requestAnimationFrame(draw);
    }
    function move(event: PointerEvent) {
      if (!allowed.matches || event.pointerType !== "mouse" || document.hidden) return;
      initialize();
      if (!fluid) return;
      const x = event.clientX / innerWidth, y = event.clientY / innerHeight;
      if (pointer && (x !== pointer.x || y !== pointer.y)) {
        fluid.move(x, y, x - pointer.x, y - pointer.y);
        lastInput = performance.now();
        canvas!.style.transitionDuration = "250ms";
        canvas!.style.opacity = "1";
        canvas!.dataset.flowing = "true";
        if (!frame) frame = requestAnimationFrame(draw);
      }
      pointer = { x, y };
    }
    function resize() { clear(); fluid?.resize(); }
    function leave() { pointer = null; }
    function visibility() { if (document.hidden) clear(); }
    function preferenceChanged() {
      clear();
      if (!allowed.matches) { fluid?.dispose(); fluid = null; }
      else initialize();
    }
    function contextLost(event: Event) {
      event.preventDefault(); clear(); fluid?.dispose(); fluid = null;
      failed = true; canvas!.dataset.renderer = "static";
    }
    function contextRestored() { failed = false; initialize(); }
    clear();
    initialize();
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("resize", resize);
    window.addEventListener("blur", clear);
    document.documentElement.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", visibility);
    allowed.addEventListener("change", preferenceChanged);
    canvas.addEventListener("webglcontextlost", contextLost);
    canvas.addEventListener("webglcontextrestored", contextRestored);
    return () => {
      clear(); fluid?.dispose(); fluid = null;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("resize", resize);
      window.removeEventListener("blur", clear);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", visibility);
      allowed.removeEventListener("change", preferenceChanged);
      canvas.removeEventListener("webglcontextlost", contextLost);
      canvas.removeEventListener("webglcontextrestored", contextRestored);
    };
  }, []);
  return <canvas ref={ref} className="blueprint-fluid" aria-hidden="true" />;
}
