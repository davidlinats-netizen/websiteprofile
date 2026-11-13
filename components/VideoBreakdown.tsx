"use client";

import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import { annotationsAtTime, chapterAtTime, featuredBreakdown } from "@/lib/video-breakdown";
import { StemAudio } from "./StemAudio";

export function VideoBreakdown() {
  const [activeChapter, setActiveChapter] = useState(0);
  const [labelsVisible, setLabelsVisible] = useState(false);
  const [mediaError, setMediaError] = useState(false);
  const [time, setTime] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);

  const annotation = annotationsAtTime(time);
  const label = annotation.phase === "safe-zone" ? "Safe zone" : annotation.phase === "caption" ? "Animated caption" : "Price";
  const target = annotation.boxes.at(-1);

  useEffect(() => {
    if (videoRef.current?.error) setMediaError(true);
    let frame = 0;
    function tick() {
      const video = videoRef.current;
      if (video && !video.paused) {
        setTime(video.currentTime);
        setActiveChapter(chapterAtTime(video.currentTime));
      }
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);
  const chapter = featuredBreakdown.chapters[activeChapter];
  const timeLabel = [chapter.start, chapter.end].map(seconds => `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`).join("–");
  function syncChapter(event: SyntheticEvent<HTMLVideoElement>) {
    setTime(event.currentTarget.currentTime);
    setActiveChapter(chapterAtTime(event.currentTarget.currentTime));
  }
  return <section id="behind-the-edit" className="section breakdown-section" aria-labelledby="breakdown-heading">
    <div className="container">
      <div className="section-title-row breakdown-intro">
        <div><p className="eyebrow">One video, unpacked</p><h2 id="breakdown-heading">Behind the edit.</h2></div>
        <p className="breakdown-description">Watch the edit. The story behind each moment appears as it plays.</p>
      </div>
      <div className="breakdown-sample-heading">
        <p className="breakdown-meta">{featuredBreakdown.format}</p>
        <h3>{featuredBreakdown.title}</h3>
      </div>
      <div className="breakdown-layout">
        <div className="breakdown-feature">
          <div className={`breakdown-video-frame ${labelsVisible ? "labels-visible" : ""}`}>
            <video ref={videoRef} src={featuredBreakdown.src} poster={featuredBreakdown.poster} controls playsInline preload="metadata" aria-label="Sample edit video" onTimeUpdate={syncChapter} onSeeking={syncChapter} onSeeked={syncChapter} onEnded={syncChapter} onError={() => setMediaError(true)} />
            <div id="sample-edit-labels" className="breakdown-callouts" role="group" aria-label="Timed edit annotations">
              {(target || annotation.phase === "safe-zone") && <>
                <span className="breakdown-annotation-label"><span>{label}</span><span aria-hidden="true"> ↙</span></span>
                <svg className="breakdown-leader" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                  <line x1="95" y1="0" x2={target ? (target.x + target.width) * 100 : 94} y2={target ? target.y * 100 : 14} />
                </svg>
              </>}
              {annotation.phase === "safe-zone" && <svg className="breakdown-safe-zone" viewBox="0 0 1080 1920" preserveAspectRatio="none" aria-hidden="true">
                <path className="breakdown-reserved" fillRule="evenodd" d="M0 0H1080V1920H0Z M62 266H1015V1151H852V1537H62Z" />
                <path className="breakdown-safe" d="M62 266H1015V1151H852V1537H62Z" />
              </svg>}
              {annotation.boxes.map((box, index) => <span key={index} className={`breakdown-track-box ${annotation.phase === "price" ? "is-price" : ""}`} aria-hidden="true" style={{ left: `${box.x * 100}%`, top: `${box.y * 100}%`, width: `${box.width * 100}%`, height: `${box.height * 100}%` }} />)}
            </div>
          </div>
          <button className="breakdown-label-toggle" type="button" aria-pressed={labelsVisible} aria-controls="sample-edit-labels" onClick={() => setLabelsVisible(value => !value)}>{labelsVisible ? "Hide edit labels" : "Show edit labels"}</button>
          {mediaError && <p className="breakdown-media-error" role="alert">The video could not load. Try reloading, or open the video file directly. <a href={featuredBreakdown.src} target="_blank" rel="noopener noreferrer">Open video file</a></p>}
          <p className="breakdown-feature-note">Hover or tap Show edit labels. Opening caption bounds are manually authored and approximate; the body guide reserves space for platform UI, not a universal platform guarantee.</p>
        </div>
        <div className="breakdown-commentary">
          <StemAudio videoRef={videoRef} />
          <p className="breakdown-commentary-label">As the video plays</p>
          <div className="breakdown-live" aria-live="polite" aria-atomic="true">
            <article className="breakdown-explanation" key={activeChapter}>
              <div className="breakdown-explanation-meta"><span className="breakdown-time">{timeLabel}</span><span>Part {activeChapter + 1} / {featuredBreakdown.chapters.length}</span></div>
              <h3>{chapter.title}</h3>
              <p><strong>On screen</strong>{chapter.observation}</p>
              <p><strong>The editing choice</strong>{chapter.rationale}</p>
            </article>
          </div>
          <p className="breakdown-sync-note">Explanations follow playback and seeking. Chapter boundaries are approximate.</p>
          <p className="breakdown-disclaimer">An editorial breakdown of the finished video, not a claim of measured ad performance. Property details and prices reflect the video, not a current listing.</p>
        </div>
      </div>
    </div>
  </section>;
}
