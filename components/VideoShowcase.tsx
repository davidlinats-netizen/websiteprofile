"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "@phosphor-icons/react";
import { categories, videos, getVideoContext, type Category, type PortfolioVideo } from "@/lib/videos";
import { chapterAtTime, featuredBreakdown } from "@/lib/video-breakdown";
import { usePortfolio } from "./PortfolioProvider";
import { Marquee } from "./Marquee";

function clock(seconds: number) { return String(Math.floor(seconds / 60)).padStart(2, "0") + ":" + String(Math.floor(seconds % 60)).padStart(2, "0"); }

function VideoCard({ video, duplicate, selected, onSelect }: { video: PortfolioVideo; duplicate: boolean; selected: boolean; onSelect: (id: string) => void }) {
  const context = getVideoContext(video);
  return <a className="video-card work-selectable-card" tabIndex={duplicate ? -1 : 0} aria-current={selected ? "true" : undefined} href={"https://youtube.com/shorts/" + video.id} onClick={event => { if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return; event.preventDefault(); onSelect(video.id); }}>
    <span className="sr-only">Select video: </span>
    <div className="video-thumbnail">
      <Image src={"/assets/posters/" + video.id + ".jpg"} alt="" fill sizes="(max-width: 767px) 72vw, 300px" />
      {video.contentWarning && <div className="video-content-warning"><strong>Content warning</strong><p>{video.contentWarning}</p></div>}
      <span className="play-indicator" aria-hidden="true"><Play size={22} weight="fill" /></span>
    </div>
    <div className="video-caption"><h3>{context.title}</h3><p className="video-context">{context.description}</p></div>
  </a>;
}

export function VideoShowcase() {
  const [motionPaused, setMotionPaused] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [category, setCategory] = useState<Category | "All">("All");
  const [activeChapter, setActiveChapter] = useState(0);
  const [mediaError, setMediaError] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const localVideo = useRef<HTMLVideoElement>(null);
  const { videoId, openVideo } = usePortfolio();
  const filtered = category === "All" ? videos : videos.filter(video => video.category === category);
  const chapter = featuredBreakdown.chapters[activeChapter];
  useEffect(() => { if (videoId) localVideo.current?.pause(); }, [videoId]);
  function select(id: string) {
    localVideo.current?.pause();
    openVideo(id);
  }
  const galleryPaused = motionPaused || playing || Boolean(videoId);
  return <section id="work" className="section work-section" aria-labelledby="work-heading">
    <div className="container">
      <div className="section-title-row"><div><h2 id="work-heading">Small screen.<br />Big impression.</h2></div><p className="work-introduction">Watch the featured tour, then browse more samples below.</p></div>
      <div ref={stage} className="work-inline-stage" aria-labelledby="selected-work-title">
        <div className="work-inline-media">
          <>
            <video ref={localVideo} className="work-featured-video" controls controlsList="nodownload noplaybackrate" disablePictureInPicture playsInline preload="none" poster={featuredBreakdown.poster} src={featuredBreakdown.src} aria-label="Sea-view property tour, featured real-estate editing sample" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} onTimeUpdate={event => setActiveChapter(chapterAtTime(event.currentTarget.currentTime))} onSeeked={event => setActiveChapter(chapterAtTime(event.currentTarget.currentTime))} onError={() => { setMediaError(true); setPlaying(false); }} />
            {mediaError && <p className="work-player-error" role="alert">The tour could not load. Try reloading, or <a href={featuredBreakdown.src}>open the video file</a>.</p>}
          </>
        </div>
        <div className="work-inline-context">
          <p className="work-sample-format">Featured real estate sample / 1:27</p>
          <h3 ref={heading} tabIndex={-1} id="selected-work-title">Sea-view property tour</h3>
          <>
            <p className="work-sample-summary">A vertical property tour that moves from a sea-view opening through the rooms to a rooftop reveal.</p>
            <div className="work-observation"><h4>What to notice</h4><ul><li>The view establishes a visual hook before the presenter introduction.</li><li>Room footage and captions support the spoken walkthrough.</li><li>The rooftop sequence brings the tour back to its opening sea-view theme.</li></ul></div>
            <div className="work-current-moment"><p className="work-moment-time">{clock(chapter.start)} - {clock(chapter.end)}</p><h4>{chapter.title}</h4><p>{chapter.observation}</p></div>
          </>
        </div>
      </div>
    </div>
    <div className="gallery-shell container work-inline-gallery">
      <div className="work-toolbar"><div className="category-filters" role="group" aria-label="Filter videos by category">{(["All", ...categories] as const).map(item => <button key={item} className="filter-button" aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div></div>

      <Marquee key={category} direction="right" speed={55} pauseOnHover={false} paused={galleryPaused} label="Video samples" className="video-marquee" renderItems={duplicate => filtered.map(video => <VideoCard key={video.id} video={video} duplicate={duplicate} selected={video.id === videoId} onSelect={select} />)} />
      <div className="work-footer"><button className="gallery-motion-toggle" disabled={playing} aria-pressed={galleryPaused} onClick={() => setMotionPaused(value => !value)}>{motionPaused ? <Play size={18} aria-hidden="true" /> : <Pause size={18} aria-hidden="true" />}{playing ? "Paused during playback" : motionPaused ? "Resume scrolling" : "Pause scrolling"}</button><p className="gallery-browse-hint">{playing ? "Scrolling pauses during playback." : "Drag or swipe, then select a sample to watch."}</p></div>
    </div>
  </section>;
}
