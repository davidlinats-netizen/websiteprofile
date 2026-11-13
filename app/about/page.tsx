
import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { About } from "@/components/About";
import { BlueprintBackground } from "@/components/BlueprintBackground";

export const metadata: Metadata = { title: "About David | DAVID", description: "Meet David, a video editor and AI-content creator working on social videos and AI-powered ads." };

export default function AboutPage() {
  return <><BlueprintBackground /><Header isAboutPage /><main id="main" className="about-page">
    <div className="container"><Link className="text-link about-back" href="/">Back to portfolio</Link></div>
    <About />
    <footer className="container site-footer"><Link className="wordmark" href="/" aria-label="DAVID home">DAVID</Link><span>&copy; 2026 David Linatoc. All rights reserved.</span></footer>
  </main></>;
}
