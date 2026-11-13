import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "./ScrollReveal";
import { WorkflowScreenshot } from "./WorkflowScreenshot";
import { ImagePopup } from "./ImagePopup";
import { AnimatedSignature } from "./AnimatedSignature";
import { AboutStats } from "./AboutStats";
import { siteConfig } from "@/lib/site-config";

export function About() {
  return <section id="about" className="section about-section" aria-labelledby="about-heading">
    <div className="container">
      <div className="about-heading-row">
        <h1 id="about-heading">About Me</h1>
        <Link className="text-link" href="/#work">Explore the video samples</Link>
      </div>
      <div className="about-layout">
        <ScrollReveal className="about-card about-profile">
          <div className="about-profile-visual">
            <span className="about-photo-label">Behind the edits</span>
            <Image className="about-photo" src="/assets/images/david-about-black-shirt.webp" alt="David wearing glasses, a black shirt and white trousers, seated in a lounge" width={1086} height={1448} sizes="(max-width: 899px) min(100vw - 40px, 420px), 400px" />
          </div>
          <div className="about-profile-footer">
            <AnimatedSignature />
            <p>{siteConfig.role}</p>
          </div>
        </ScrollReveal>

        <ScrollReveal className="about-card about-copy">
          <p className="about-eyebrow">Hi, I&apos;m David</p>
          <h2 className="about-intro">I edit videos and create AI-powered ads for brands and creators.</h2>
          <p className="about-summary">I bring footage, scripts and ideas together through clear storytelling, purposeful pacing, and visuals that support the message.</p>
        </ScrollReveal>

        <AboutStats />

        <ScrollReveal className="about-card about-strengths">
          <h2>What I bring to an edit</h2>
          <dl>
            <div><dt><span aria-hidden="true">↗</span>Hooks and pacing</dt><dd>I shape short-form edits around a clear opening and keep each beat connected to the message.</dd></div>
            <div><dt><span aria-hidden="true">◫</span>Captions with purpose</dt><dd>Readable subtitles, styled text, and animated captions help support the speaker and guide attention.</dd></div>
            <div><dt><span aria-hidden="true">✧</span>AI visuals with consistency</dt><dd>For AI ads, I focus on believable visuals, consistent characters, and keeping the product recognizable across shots.</dd></div>
            <div><dt><span aria-hidden="true">≋</span>Different footage, one story</dt><dd>I bring presenter footage, product shots, voiceover, music, and sound effects together into a finished edit.</dd></div>
          </dl>
        </ScrollReveal>

        <ScrollReveal className="about-card about-automation">
          <div className="about-supporting-copy">
            <p className="about-eyebrow">Beyond the timeline</p>
            <h2>Creative work.<br />Smarter workflows.</h2>
            <p>I build n8n workflows for AI news digests and inbox alerts. One summarizes AI and tech news for Discord and Obsidian. Another checks Gmail metadata, uses Groq to classify potential leads, and sends relevant alerts to my WhatsApp.</p>
            <p className="about-enlarge-hint">Select the workflow to enlarge <span aria-hidden="true">↗</span></p>
          </div>
          <div className="about-workflow-examples">
            <figure>
              <WorkflowScreenshot />
              <figcaption className="about-media-caption">AI news digest → Discord &amp; Obsidian</figcaption>
            </figure>
            <figure>
              <ImagePopup source="/assets/images/gmail-whatsapp-workflow.png" description="n8n workflow checking Gmail metadata every 15 minutes, classifying possible leads with Groq, sending relevant WhatsApp alerts, and remembering accepted notifications" title="Gmail to WhatsApp automation" width={1661} height={692} sizes="(max-width: 767px) 100vw, 950px" unoptimized />
              <figcaption className="about-media-caption">Gmail → AI lead classification → WhatsApp alerts</figcaption>
            </figure>
          </div>
        </ScrollReveal>

        <ScrollReveal className="about-card about-artwork">
          <div className="about-supporting-copy">
            <p className="about-eyebrow">Another creative outlet</p>
            <h2>Stories,<br />off the timeline.</h2>
            <p>Digital art, storybook visuals and Canva design.</p>
            <p className="about-enlarge-hint">Select a piece to enlarge <span aria-hidden="true">↗</span></p>
          </div>
          <div className="about-artwork-grid">
            {[
              { file: "pip-missing-rainbow", title: "Pip and the Missing Rainbow", type: "Digital storybook promotion", width: 1122, height: 1402, alt: "Storybook promotional layout featuring Pip the puppy, a colorful garden, and sample pages" },
              { file: "ghost-afraid-to-knock", title: "The Ghost Who Was Afraid to Knock", type: "Storybook cover design", width: 1264, height: 1264, alt: "A shy ghost and a pumpkin carrying lanterns beside a doorway at dusk" },
              { file: "abraham-sarah", title: "Abraham and Sarah’s New Beginning", type: "Storybook promotional design", width: 1055, height: 1491, alt: "Promotional book composition with Abraham and Sarah, a landscape, and illustrated story previews" },
            ].map(art => <figure key={art.file}>
              <ImagePopup source={`/assets/artwork/${art.file}.webp`} description={art.alt} title={art.title} width={art.width} height={art.height} sizes="(max-width: 899px) 25vw, 120px" />
              <figcaption className="about-media-caption"><h3>{art.title}</h3><span>{art.type}</span></figcaption>
            </figure>)}
          </div>
        </ScrollReveal>
      </div>
      <details className="about-details">
        <summary>More about my approach</summary>
        <div className="about-details-content">
          <p>My work includes short-form social content, AI UGC, promotional ads, real estate videos, and talking-head edits. I focus on clear storytelling, purposeful pacing, and visuals that support the message.</p>
          <p>I use video editing and AI tools to bring footage, scripts, and ideas together, with a particular interest in AI ads for direct-to-consumer brands.</p>
          <div className="about-beyond">
            <h3>Beyond the timeline</h3>
            <p>Video editing is my main focus, supported by skills in content strategy, vibe coding, AI automation, and digital art.</p>
            <dl>
              <div><dt>Content strategy</dt><dd>I help shape content ideas, hooks, and messaging around the audience, platform, and purpose of each video.</dd></div>
              <div><dt>Vibe coding</dt><dd>I use AI-assisted coding to build websites and practical tools, turning ideas into working prototypes and refining them through testing.</dd></div>
              <div><dt>AI automation</dt><dd>I explore n8n and AI-powered workflows to connect tools, reduce repetitive tasks, and make creative production easier to manage.</dd></div>
              <div><dt>Digital art &amp; Canva design</dt><dd>I create storybook visuals, cover designs, and promotional graphics using Canva, combining imagery, typography, and layout.</dd></div>
            </dl>
          </div>
        </div>
      </details>
    </div>
  </section>;
}
