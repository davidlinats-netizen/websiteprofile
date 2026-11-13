"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { audioStems, spectrumAtTime, type StemSpectrum } from "@/lib/audio-stems";

type Spectra = Record<string, StemSpectrum>;

export function StemAudio({ videoRef }: { videoRef: RefObject<HTMLVideoElement | null> }) {
  const [selected, setSelected] = useState("original");
  const [status, setStatus] = useState("");
  const [spectra, setSpectra] = useState<Spectra | null>(null);
  const [analysisFailed, setAnalysisFailed] = useState(false);
  const spectraRef = useRef<Spectra | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const selectedRef = useRef("original");
  const generation = useRef(0);
  const route = useRef<{ context: AudioContext; source: MediaElementAudioSourceNode; gain: GainNode } | null>(null);
  const failed = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/assets/audio/sample-edit/spectra.json", { signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error("Analysis unavailable"); return response.json(); })
      .then((data: Spectra) => {
        for (const stem of audioStems) {
          const s = data[stem.id];
          if (!s || s.step !== 0.05 || !Number.isFinite(s.duration) || s.duration <= 0 || !Array.isArray(s.frames) || s.frames.length !== Math.ceil(s.duration / s.step) || !s.frames.every(f => Array.isArray(f) && f.length === 24 && f.every(v => Number.isInteger(v) && v >= 0 && v <= 255))) throw new Error("Invalid analysis");
        }
        spectraRef.current = data;
        setSpectra(data);
      })
      .catch(() => { if (!controller.signal.aborted) setAnalysisFailed(true); });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const video = videoRef.current, audio = audioRef.current;
    if (!video || !audio) return;
    let frame = 0;
    let last = 0;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    function fail() {
      failed.current = true;
      video!.pause(); audio!.pause();
      setStatus("Isolated audio is unavailable. Choose Original mix to restore the video sound, or select a stem again to retry.");
    }
    function sync() {
      if (selectedRef.current === "original") return;
      audio!.volume = video!.volume;
      audio!.muted = video!.muted;
      audio!.playbackRate = video!.playbackRate;
      if (audio!.readyState >= 1 && !audio!.seeking && Math.abs(audio!.currentTime - video!.currentTime) > 0.15) audio!.currentTime = video!.currentTime;
    }
    function play() {
      sync();
      if (selectedRef.current === "original") return;
      if (failed.current) { video!.pause(); return; }
      void route.current?.context.resume().catch(fail);
      void audio!.play().catch(error => { if (error.name !== "AbortError" && selectedRef.current !== "original") fail(); });
    }
    function pause() { audio!.pause(); sync(); }
    function seeking() { audio!.pause(); sync(); }
    function seeked() { sync(); if (!video!.paused) play(); }
    function waiting() { audio!.pause(); }
    function audioWaiting() {
      if (selectedRef.current !== "original" && !video!.paused && !video!.seeking && !audio!.seeking) {
        video!.pause();
        setStatus("Isolated audio is buffering. Press Play to continue when ready.");
      }
    }
    function ready() { sync(); if (!failed.current) setStatus(""); }
    const events: [string, () => void][] = [["play", play], ["playing", play], ["pause", pause], ["ended", pause], ["seeking", seeking], ["seeked", seeked], ["ratechange", sync], ["volumechange", sync], ["timeupdate", sync], ["waiting", waiting]];
    events.forEach(([name, fn]) => video.addEventListener(name, fn));
    audio.addEventListener("error", fail);
    audio.addEventListener("waiting", audioWaiting);
    audio.addEventListener("canplay", ready);
    function tick(now: number) {
      if (now - last >= (reducedMotion.matches ? 250 : 50)) {
        last = now;
        sync();
        audioStems.forEach((stem, i) => {
          const canvas = canvasRefs.current[i];
          const data = spectraRef.current;
          if (!canvas || !data) return;
          const bins = spectrumAtTime(data[stem.id], video!.currentTime);
          canvas.dataset.peak = String(Math.max(0, ...bins));
          canvas.dataset.bins = bins.join(",");
          canvas.dataset.time = String(video!.currentTime);
          canvas.dataset.playing = String(!video!.paused && !video!.ended);
          const ctx = canvas.getContext("2d");
          if (!ctx) return;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = ["#f5d547", "#83eea5", "#b9a1ff"][i];
          bins.forEach((value, band) => {
            const height = value / 255 * canvas.height;
            ctx.fillRect(band * 12, canvas.height - height, 9, height);
          });
        });
      }
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      events.forEach(([name, fn]) => video.removeEventListener(name, fn));
      audio.removeEventListener("error", fail);
      audio.removeEventListener("waiting", audioWaiting);
      audio.removeEventListener("canplay", ready);
      audio.pause();
    };
  }, [videoRef]);

  useEffect(() => () => {
    generation.current++;
    if (route.current) { route.current.source.disconnect(); void route.current.context.close(); route.current = null; }
  }, []);

  async function choose(value: string) {
    const video = videoRef.current, audio = audioRef.current;
    if (!video || !audio) return;
    const ticket = ++generation.current;
    const wasPlaying = !video.paused && !video.ended;
    video.pause(); audio.pause();
    selectedRef.current = value;
    setSelected(value);
    failed.current = false;
    setStatus("");
    if (value === "original") {
      if (route.current) route.current.gain.gain.value = 1;
      video.dataset.originalGain = "1";
      audio.removeAttribute("src"); audio.load();
      if (wasPlaying) void video.play().catch(() => setStatus("Press Play to continue with the original mix."));
      return;
    }
    try {
      // A gain gate leaves native video volume/mute controls intact. Only the
      // original route is silenced; one separate audio element plays one stem.
      if (!route.current) {
        const context = new AudioContext();
        const gain = context.createGain();
        gain.gain.value = 0;
        const source = context.createMediaElementSource(video);
        source.connect(gain); gain.connect(context.destination);
        route.current = { context, gain, source };
      }
      route.current.gain.gain.value = 0;
      video.dataset.originalGain = "0";
      await route.current.context.resume();
      if (ticket !== generation.current) return;
      const stem = audioStems.find(s => s.id === value)!;
      setStatus("Loading isolated audio…");
      audio.src = stem.src;
      audio.volume = video.volume; audio.muted = video.muted; audio.playbackRate = video.playbackRate;
      audio.load();
      // Metadata synchronizes position before playback, including paused switches.
      audio.onloadedmetadata = () => {
        if (ticket !== generation.current) return;
        audio.currentTime = video.currentTime;
      };
      audio.oncanplay = () => {
        if (ticket !== generation.current || audio.seeking || audio.readyState < 3) return;
        audio.oncanplay = null;
        if (wasPlaying) void video.play().catch(() => setStatus("Press Play to continue with the selected stem."));
      };
    } catch {
      failed.current = true;
      video.pause(); audio.pause();
      // If Web Audio cannot establish a safe route, keep playback stopped.
      setStatus("Isolated audio could not start. Choose Original mix or try another browser. Playback is paused to avoid playing the wrong audio.");
    }
  }

  return <div className="breakdown-audio">
    <label htmlFor="sample-edit-listen">Listen to</label>
    <select id="sample-edit-listen" value={selected} onChange={event => void choose(event.target.value)} aria-describedby="stem-listening-note">
      <option value="original">Original mix</option>
      {audioStems.map(stem => <option key={stem.id} value={stem.id}>{stem.label}</option>)}
    </select>
    <audio ref={audioRef} preload="metadata" aria-label="Selected isolated audio stem" />
    <p id="stem-listening-note" className="breakdown-feature-note">One audio source at a time. Video controls also control the selected stem.</p>
    {status && <p role="status">{status}</p>}
    {spectra && audioStems.map((stem, i) => <figure key={stem.id} className="breakdown-stem">
      <figcaption>{stem.title}</figcaption>
      <canvas ref={node => { canvasRefs.current[i] = node; }} width={288} height={48} role="img" aria-label={`${stem.title} frequency spectrum at the video position`} />
    </figure>)}
    {analysisFailed ? <p role="status">Stem visualization is unavailable. Listening and video playback are still available.</p> : !spectra && <p role="status">Loading stem visualizations…</p>}
    <p className="breakdown-feature-note">Real exported stems · low → high frequencies · shared level scale. Precomputed every 50 ms, following the video position; paused frames hold still. Reduced motion updates four times per second. MP3 encoding may introduce a small timing offset; not sample-exact sync.</p>
  </div>;
}
