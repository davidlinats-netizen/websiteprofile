"use client";

import { useEffect, useRef } from "react";

// Current owner-supplied figures. Editing hours are an estimate, not a tracked minimum.
const stats = [
  { label: "Videos edited", value: 200, suffix: "+" },
  { label: "Avg. turnaround", text: "48 hrs" },
  { label: "Estimated editing time", value: 3000, prefix: "~", unit: "hrs" },
] as const;
const formatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

export function AboutStats() {
  const ref = useRef<HTMLDListElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const targets = Array.from(element.querySelectorAll<HTMLElement>("[data-count-to]")).map(node => ({
      node,
      value: Number(node.dataset.countTo),
    }));
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let epoch = 0;
    let started = false;
    let complete = false;

    function finish() {
      complete = true;
      cancelAnimationFrame(frame);
      observer?.disconnect();
      for (const { node, value } of targets) node.textContent = formatter.format(value);
      element!.dataset.phase = "complete";
    }

    function tick(now: number) {
      if (complete) return;
      const progress = Math.min(1, Math.max(0, (now - epoch) / 1600));
      const eased = 1 - Math.pow(1 - progress, 3);
      for (const { node, value } of targets) {
        const next = formatter.format(Math.round(value * eased));
        if (node.textContent !== next) node.textContent = next;
      }
      if (progress === 1) { finish(); return; }
      frame = requestAnimationFrame(tick);
    }

    const observer = window.IntersectionObserver ? new IntersectionObserver(entries => {
      if (started || complete || !entries.some(entry => entry.isIntersecting)) return;
      started = true;
      observer?.disconnect();
      element.dataset.phase = "running";
      epoch = performance.now();
      frame = requestAnimationFrame(tick);
    }, { threshold: 0.45 }) : undefined;

    // The server-rendered final values remain readable without animation support or JS.
    if (motion.matches || !observer) { finish(); return; }
    for (const { node } of targets) node.textContent = "0";
    element.dataset.phase = "waiting";
    observer.observe(element);

    const reduceMotion = () => { if (motion.matches) finish(); };
    const hide = () => { if (document.hidden && started) finish(); };
    motion.addEventListener("change", reduceMotion);
    document.addEventListener("visibilitychange", hide);
    return () => {
      finish();
      motion.removeEventListener("change", reduceMotion);
      document.removeEventListener("visibilitychange", hide);
    };
  }, []);

  return <dl ref={ref} className="about-stats" aria-label="Editing at a glance" data-phase="static">
    {stats.map(stat => {
      const prefix = "prefix" in stat ? stat.prefix : "";
      const suffix = "suffix" in stat ? stat.suffix : "";
      const unit = "unit" in stat ? stat.unit : "";
      const value = "value" in stat ? formatter.format(stat.value) : stat.text;
      return <div className="about-card about-stat" key={stat.label}>
        <dt>{stat.label}</dt>
        <dd>{"value" in stat ? <>
          <span className="about-stat-accessible">{prefix}{value}{suffix}{unit ? ` ${unit}` : ""}</span>
          <span aria-hidden="true">{prefix}<span className="about-stat-value" data-count-to={stat.value}>{value}</span>{suffix}{unit && <> <span className="about-stat-unit">{unit}</span></>}</span>
        </> : value}</dd>
      </div>;
    })}
  </dl>;
}
