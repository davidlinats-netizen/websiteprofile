"use client";

import Image from "next/image";
import { useEffect, useId, useRef } from "react";
import { containDialogFocus } from "@/lib/dialog-focus";

export function ImagePopup({ source, description, title, width, height, sizes, unoptimized = false }: { source: string; description: string; title: string; width: number; height: number; sizes: string; unoptimized?: boolean }) {
  const titleId = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const previousOverflow = useRef<string | null>(null);

  function restoreScroll() {
    if (previousOverflow.current === null) return;
    document.body.style.overflow = previousOverflow.current;
    previousOverflow.current = null;
  }

  useEffect(() => () => {
    if (previousOverflow.current !== null) document.body.style.overflow = previousOverflow.current;
  }, []);

  function open() {
    if (!dialog.current || dialog.current.open) return;
    dialog.current.showModal();
    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }

  return <>
    <button ref={trigger} type="button" className="workflow-screenshot-trigger" onClick={open} aria-label={`Enlarge ${title === "My n8n workflow" ? "n8n workflow screenshot" : title}`} aria-haspopup="dialog">
      <Image src={source} alt={description} width={width} height={height} unoptimized={unoptimized} sizes={sizes} />
    </button>
    <dialog ref={dialog} className="workflow-image-dialog" aria-labelledby={titleId} onKeyDown={containDialogFocus} onClose={() => { restoreScroll(); trigger.current?.focus({ preventScroll: true }); }} onClick={event => { if (event.target === dialog.current) dialog.current.close(); }}>
      <div className="workflow-image-content">
        <div className="workflow-image-heading"><h2 id={titleId}>{title}</h2><button type="button" className="icon-button" aria-label="Close screenshot" onClick={() => dialog.current?.close()} autoFocus>✕</button></div>
        <Image src={source} alt={description} width={width} height={height} unoptimized={unoptimized} sizes="(max-width: 1000px) 94vw, 950px" />
        {unoptimized && <a className="text-link" href={source} target="_blank" rel="noopener noreferrer">Open original image to zoom ↗</a>}
      </div>
    </dialog>
  </>;
}
