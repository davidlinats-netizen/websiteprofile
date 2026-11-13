"use client";

import { useEffect, useRef, useState } from "react";

type Player = { destroy: () => void; pauseVideo: () => void };
type PlayerAPI = { Player: new (element: HTMLIFrameElement, options: { events: { onReady: () => void; onStateChange: (event: { data: number }) => void; onError: () => void } }) => Player };
type PlayerWindow = Window & { YT?: PlayerAPI; onYouTubeIframeAPIReady?: () => void };
let apiPromise: Promise<PlayerAPI> | null = null;
function loadPlayerAPI() {
  const browser = window as PlayerWindow;
  if (browser.YT?.Player) return Promise.resolve(browser.YT);
  if (apiPromise) return apiPromise;
  apiPromise = new Promise<PlayerAPI>((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Video controls unavailable")), 12000);
    const previous = browser.onYouTubeIframeAPIReady;
    browser.onYouTubeIframeAPIReady = () => {
      previous?.();
      clearTimeout(timeout);
      if (browser.YT) resolve(browser.YT); else reject(new Error("Video controls unavailable"));
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => { clearTimeout(timeout); reject(new Error("Video controls unavailable")); };
    document.head.appendChild(script);
  });
  return apiPromise;
}

export function WorkYouTubePlayer({ videoId, title, onPlayingChange, suspended }: { videoId: string; title: string; onPlayingChange: (playing: boolean) => void; suspended: boolean }) {
  const iframe = useRef<HTMLIFrameElement>(null);
  const player = useRef<Player | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    const frame = iframe.current;
    if (!frame) return;
    const url = new URL(frame.src);
    url.searchParams.set("origin", window.location.origin);
    frame.src = url.toString();
    const timeout = setTimeout(() => { if (active) { setError(true); onPlayingChange(false); } }, 16000);
    void loadPlayerAPI().then(api => {
      if (!active) return;
      player.current = new api.Player(frame, { events: {
        onReady: () => { if (active) { clearTimeout(timeout); setReady(true); } },
        onStateChange: event => { if (active && [0,1,2,5,-1].includes(event.data)) onPlayingChange(event.data === 1); },
        onError: () => { if (active) { clearTimeout(timeout); setError(true); onPlayingChange(false); } },
      } });
    }).catch(() => { if (active) { clearTimeout(timeout); setError(true); } });
    return () => { active = false; clearTimeout(timeout); player.current?.destroy(); player.current = null; onPlayingChange(false); };
  }, [videoId, onPlayingChange]);
  useEffect(() => { if (suspended && ready) player.current?.pauseVideo(); }, [suspended, ready]);
  return <div className="work-embed-shell">
    {!ready && !error && <p className="work-player-message" role="status">Loading video controls...</p>}
    <iframe ref={iframe} title={title} src={"https://www.youtube-nocookie.com/embed/" + videoId + "?autoplay=0&playsinline=1&rel=0&enablejsapi=1"} allow="encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
    {error && <p className="work-player-error" role="alert">This video or its controls could not connect. Try reloading, or use the YouTube link below.</p>}
  </div>;
}
