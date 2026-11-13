"use client";

import { useEffect, useId, useRef } from "react";

// Hand-traced reveal guides in the supplied SVG's 484 × 161 coordinates.
// These are masks, never replacement lettering: the original SVG remains the artwork.
const strokes = [
  "M66 70 C20 72 25 53 61 35 C103 14 169 6 194 21 C231 43 179 77 139 99 C94 124 18 155 15 144 C10 130 85 99 139 86 C178 75 219 70 254 68",
  "M116 32 C112 52 94 91 80 123",
  "M182 95 C180 89 169 97 165 104 C157 115 177 104 184 98 C179 113 186 109 195 103",
  "M193 95 C193 119 199 106 212 88",
  "M212 96 C198 114 214 109 224 102",
  "M217 86 L215 89",
  "M236 96 C230 88 216 106 223 108 C232 111 247 86 259 62 C250 82 245 95 242 103 C237 114 247 105 254 100",
  "M363 21 C353 53 333 91 311 119 C296 138 281 145 280 139 C280 125 347 119 419 132",
  "M347 96 C334 116 349 107 358 102",
  "M351 86 L349 89",
  "M355 107 C361 97 370 90 371 96 C364 107 367 111 384 102",
  "M398 95 C393 88 376 103 380 107 C383 112 395 102 400 98 C394 115 407 106 412 103",
  "M424 60 C416 78 408 93 407 102 C405 115 421 107 430 100",
  "M408 73 L433 73",
  "M439 96 C429 89 421 109 433 108 C445 107 447 93 439 96",
  "M459 94 C449 89 437 102 445 106 C452 112 464 106 471 101",
] as const;

export function AnimatedSignature() {
  const ref = useRef<SVGSVGElement>(null);
  const id = useId();
  const maskId = `${id}-ink`;
  const smokeId = `${id}-smoke`;

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const art = svg.querySelector<SVGImageElement>(".signature-art")!;
    const traces = Array.from(svg.querySelectorAll<SVGPathElement>(".signature-trace"));
    const wisps = Array.from(svg.querySelectorAll<SVGPathElement>(".signature-smoke path"));
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let started = false;
    let complete = false;
    const observer = window.IntersectionObserver ? new IntersectionObserver(entries => {
      if (started || complete || !entries.some(entry => entry.isIntersecting)) return;
      started = true;
      observer?.disconnect();
      svg.dataset.phase = "running";
      frame = requestAnimationFrame(tick);
    }, { threshold: 0.45 }) : undefined;

    function finish() {
      complete = true;
      cancelAnimationFrame(frame);
      observer?.disconnect();
      art.removeAttribute("mask");
      for (const wisp of wisps) wisp.style.opacity = "0";
      svg!.dataset.phase = "complete";
    }

    if (motion.matches || !window.IntersectionObserver) {
      finish();
      return;
    }

    const lengths = traces.map(path => path.getTotalLength());
    const weight = lengths.reduce((sum, length) => sum + length + 30, 0);
    let cursor = 0;
    const schedule = traces.map((path, index) => {
      const length = lengths[index];
      const duration = (length + 30) / weight * 3100;
      const start = cursor;
      cursor += duration + 18;
      path.dataset.length = String(length);
      path.style.strokeDasharray = String(length);
      path.style.strokeDashoffset = String(length);
      path.style.opacity = "0";
      return { path, length, start, duration };
    });
    art.setAttribute("mask", `url(#${maskId})`);
    svg.dataset.phase = "waiting";

    // A fixed pool of short, curling strands. No background loop or React frame updates.
    const particles = wisps.map(() => ({ born: -10000, x: 0, y: 0, angle: 0, strength: 0 }));
    let particleIndex = 0;
    let lastEmission = -100;
    let previousStroke = -1;
    let epoch: number | undefined;

    function emit(point: DOMPoint, angle: number, now: number, strength: number) {
      const index = particleIndex++ % particles.length;
      particles[index] = { born: now, x: point.x, y: point.y, angle, strength };
    }

    function tick(now: number) {
      if (complete) return;
      epoch ??= now;
      const elapsed = now - epoch;
      let active = -1;
      for (let index = 0; index < schedule.length; index++) {
        const { path, length, start, duration } = schedule[index];
        const progress = Math.min(1, Math.max(0, (elapsed - start) / duration));
        path.style.strokeDashoffset = String(length * (1 - progress));
        path.style.opacity = String(Math.min(1, progress * 6));
        if (progress > 0 && progress < 1) active = index;
      }
      if (active >= 0 && elapsed - lastEmission > 26) {
        const stroke = schedule[active];
        const position = stroke.length * Math.min(1, (elapsed - stroke.start) / stroke.duration);
        const point = stroke.path.getPointAtLength(position);
        const before = stroke.path.getPointAtLength(Math.max(0, position - 2));
        emit(point, Math.atan2(point.y - before.y, point.x - before.x) * 180 / Math.PI, elapsed, 0.32);
        lastEmission = elapsed;
      }
      if (previousStroke >= 0 && previousStroke !== active) {
        const stroke = schedule[previousStroke];
        const point = stroke.path.getPointAtLength(stroke.length);
        // Slightly fuller puff at a pen lift, then the strand drifts away.
        for (let index = 0; index < 3; index++) emit(point, -30 + index * 35, elapsed + index * 25, 0.48);
      }
      previousStroke = active;
      particles.forEach((particle, index) => {
        const age = (elapsed - particle.born) / 720;
        const wisp = wisps[index];
        if (age < 0 || age >= 1) { wisp.style.opacity = "0"; return; }
        const sway = Math.sin(age * 5 + index) * 3.5 * age;
        const x = particle.x + sway;
        const y = particle.y - age * (10 + index % 5);
        const scale = 0.45 + age * 1.5;
        wisp.setAttribute("transform", `translate(${x} ${y}) rotate(${particle.angle * 0.12 - age * 25}) scale(${scale})`);
        wisp.style.opacity = String(particle.strength * Math.min(1, age * 6) * Math.pow(1 - age, 1.5));
      });
      if (elapsed >= cursor + 850) { finish(); return; }
      frame = requestAnimationFrame(tick);
    }

    observer?.observe(svg);

    const reduceMotion = () => { if (motion.matches) finish(); };
    const hide = () => { if (document.hidden && started) finish(); };
    motion.addEventListener("change", reduceMotion);
    document.addEventListener("visibilitychange", hide);
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      motion.removeEventListener("change", reduceMotion);
      document.removeEventListener("visibilitychange", hide);
      art.removeAttribute("mask");
      for (const wisp of wisps) wisp.style.opacity = "0";
    };
  }, [maskId]);

  return <svg ref={ref} className="about-signature" viewBox="0 0 484 161" width="484" height="161" role="img" aria-label="David Linatoc signature" data-phase="static">
    <defs>
      <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="484" height="161">
        <g fill="none" stroke="white" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round">
          {strokes.map((d, index) => <path key={index} className="signature-trace" d={d} />)}
        </g>
      </mask>
      <filter id={smokeId} x="-100%" y="-100%" width="300%" height="300%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="7" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
        <feGaussianBlur stdDeviation="0.7" />
      </filter>
    </defs>
    <image className="signature-art" href="/assets/images/david-signature.svg" width="484" height="161" />
    <g className="signature-smoke" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" filter={`url(#${smokeId})`} aria-hidden="true">
      {Array.from({ length: 28 }, (_, index) => <path key={index} d="M0 1 C-4 -1 4 -4 1 -7 C-2 -10 -3 -7 -1 -5" style={{ opacity: 0 }} />)}
    </g>
  </svg>;
}
