"use client";

import { useEffect, useRef, useState, useId, type ReactNode } from "react";

export function Marquee({ renderItems, paused, direction, className = "", label, controllerRef, speed = 25, pauseOnHover = true }: {
  renderItems: (duplicate: boolean) => ReactNode;
  paused: boolean;
  direction: "left" | "right";
  className?: string;
  label: string;
  speed?: number;
  pauseOnHover?: boolean;
  controllerRef?: React.RefObject<((direction: number) => void) | null>;
}) {
  const descriptionId = useId();
  const viewport = useRef<HTMLDivElement>(null);
  const group = useRef<HTMLDivElement>(null);
  const interaction = useRef(false);
  const drag = useRef<{ id: number; startX: number; scroll: number } | null>(null);
  const dragged = useRef(false);
  const [enhanced, setEnhanced] = useState(false);
  const [copies, setCopies] = useState(1);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnhanced(!media.matches);
    update(); media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    const element = viewport.current;
    const first = group.current;
    if (!element || !first) return;
    const reset = () => {
      const set = first.querySelector<HTMLElement>(".marquee-set");
      if (set && enhanced) setCopies(Math.max(1, Math.ceil(element.clientWidth / set.offsetWidth)));
      if (enhanced) element.scrollLeft = first.offsetWidth;
    };
    reset();
    const observer = new ResizeObserver(reset);
    observer.observe(first);
    observer.observe(element);
    if (controllerRef) controllerRef.current = (step: number) => {
      const width = first.offsetWidth;
      if (enhanced && element.scrollLeft < width * 0.3) element.scrollLeft += width;
      if (enhanced && element.scrollLeft > width * 1.7) element.scrollLeft -= width;
      element.scrollLeft += step * Math.min(element.clientWidth * 0.7, 540);
    };
    return () => { observer.disconnect(); if (controllerRef) controllerRef.current = null; };
  }, [enhanced, controllerRef]);
  useEffect(() => {
    if (!enhanced || paused) return;
    let frame = 0, previous = 0, position = viewport.current?.scrollLeft ?? 0;
    function tick(now: number) {
      const element = viewport.current, first = group.current;
      if (element && first && !interaction.current && !document.hidden) {
        const width = first.offsetWidth;
        if (Math.abs(element.scrollLeft - position) > 2) position = element.scrollLeft;
        position += Math.min(now - (previous || now), 40) * (speed / 1000) * (direction === "left" ? 1 : -1);
        if (position < width * 0.2) position += width;
        if (position > width * 1.8) position -= width;
        element.scrollLeft = position;
      } else if (element) position = element.scrollLeft;
      previous = now;
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [enhanced, paused, direction, speed]);
  function updateInteraction(element: HTMLDivElement) {
    const keyboardFocused = element.matches(":focus-visible") || Boolean(element.querySelector(":focus-visible"));
    interaction.current = Boolean(drag.current) || keyboardFocused || (pauseOnHover && element.matches(":hover"));
  }
  function renderGroup(duplicate: boolean) {
    return Array.from({ length: enhanced ? copies : 1 }, (_, index) => <div className="marquee-set" key={index} aria-hidden={duplicate || index > 0 ? true : undefined}>{renderItems(duplicate || index > 0)}</div>);
  }
  return <div className={`marquee-viewport ${className}`} ref={viewport} role="region" aria-label={label} tabIndex={0} aria-describedby={descriptionId}
    onDragStart={event => event.preventDefault()}
    onPointerDown={event => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      dragged.current = false;
      drag.current = { id: event.pointerId, startX: event.clientX, scroll: event.currentTarget.scrollLeft };
      interaction.current = true;
    }}
    onPointerMove={event => {
      const active = drag.current;
      if (!active || active.id !== event.pointerId) return;
      const delta = event.clientX - active.startX;
      if (!dragged.current && Math.abs(delta) < 6) return;
      dragged.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      event.currentTarget.scrollLeft = active.scroll - delta;
      event.preventDefault();
    }}
    onPointerUp={event => {
      if (drag.current?.id !== event.pointerId) return;
      drag.current = null;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
      updateInteraction(event.currentTarget);
    }}
    onPointerCancel={event => { drag.current = null; dragged.current = false; updateInteraction(event.currentTarget); }}
    onLostPointerCapture={event => { drag.current = null; updateInteraction(event.currentTarget); }}
    onClickCapture={event => { if (dragged.current) { event.preventDefault(); event.stopPropagation(); dragged.current = false; } }}
    onKeyDown={event => {
      if (event.target !== event.currentTarget || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
      event.preventDefault();
      interaction.current = true;
      event.currentTarget.scrollLeft += (event.key === "ArrowRight" ? 1 : -1) * Math.min(event.currentTarget.clientWidth * .7, 540);
    }}
    onPointerEnter={() => { if (pauseOnHover) interaction.current = true; }} onPointerLeave={event => { updateInteraction(event.currentTarget); }}
    onTouchStart={() => { interaction.current = true; }} onTouchEnd={() => { interaction.current = false; }}
    onTouchCancel={() => { interaction.current = false; }}
    onFocusCapture={event => { updateInteraction(event.currentTarget); }} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) interaction.current = Boolean(drag.current) || (pauseOnHover && event.currentTarget.matches(":hover")); }}>
    <span className="sr-only" id={descriptionId}>Drag or swipe to browse. When focused, use the left and right arrow keys.</span>
    <div className="marquee-track">
      {enhanced && <div ref={group} className="marquee-group" aria-hidden="true">{renderGroup(true)}</div>}
      <div ref={enhanced ? undefined : group} className="marquee-group">{renderGroup(false)}</div>
      {enhanced && <div className="marquee-group" aria-hidden="true">{renderGroup(true)}</div>}
    </div>
  </div>;
}

