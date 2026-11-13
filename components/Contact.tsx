"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { X } from "@phosphor-icons/react";
import { WhatsAppButton } from "./WhatsAppButton";
import { ScrollReveal } from "./ScrollReveal";
import { siteConfig } from "@/lib/site-config";
import { createWhatsAppInquiry } from "@/lib/whatsapp-inquiry";

export function Contact() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [project, setProject] = useState("");
  const [message, setMessage] = useState("");
  const nameInput = useRef<HTMLInputElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (open) nameInput.current?.focus(); }, [open]);
  function close() { setOpen(false); trigger.current?.focus({ preventScroll: true }); }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const details = event.currentTarget.elements.namedItem("message") as HTMLTextAreaElement;
    details.setCustomValidity(message.trim().length < 10 ? "Add at least 10 characters describing your project." : "");
    if (!event.currentTarget.reportValidity()) return;
    window.location.assign(createWhatsAppInquiry({ name, project, message }, siteConfig.whatsapp));
  }
  return <section id="contact" className="section contact-section" aria-labelledby="contact-heading"><div className="container">
    <div className={open ? "contact-layout is-open" : "contact-layout"}>
      <ScrollReveal className="contact-intro"><p className="eyebrow">Have something in mind?</p><h2 id="contact-heading"><span>Let&apos;s make it</span><span>worth watching</span></h2><p className="contact-description">Tell me about your idea, your footage, and what you want to create.</p><div className="contact-actions"><WhatsAppButton buttonRef={trigger} expanded={open} onOpen={() => setOpen(true)} /></div></ScrollReveal>
      <div id="project-inquiry" className="contact-project-panel" role="region" aria-labelledby="inquiry-heading" hidden={!open} onKeyDown={event => { if (event.key === "Escape") { event.stopPropagation(); close(); } }}>
        <div className="inquiry-heading-row"><h3 id="inquiry-heading">Tell me about your project</h3><button type="button" className="icon-button inquiry-close" aria-label="Close project form" onClick={close}><X size={22} aria-hidden="true" /></button></div>
        <p className="inquiry-description" id="inquiry-description">Fill in the details here. Then review and send your message in WhatsApp.</p>
        <form onSubmit={submit} aria-describedby="inquiry-description">
          <label htmlFor="inquiry-name">Your name</label>
          <input ref={nameInput} id="inquiry-name" name="name" autoComplete="name" required maxLength={80} pattern={".*\\S.*"} title="Enter your name." value={name} onChange={event => setName(event.target.value)} />
          <label htmlFor="inquiry-project">What do you need?</label>
          <select id="inquiry-project" name="project" required value={project} onChange={event => setProject(event.target.value)}><option value="" disabled>Select a service</option><option>Short-form video editing</option><option>Product or AI video ads</option><option>AI UGC editing</option><option>Real estate video editing</option><option>Content repurposing</option><option>Talking-head video editing</option><option>Something else</option></select>
          <label htmlFor="inquiry-message">Project details</label>
          <textarea id="inquiry-message" name="message" required minLength={10} maxLength={2000} rows={5} placeholder="What are you creating? Include the number of videos, your timeline, or a reference link." value={message} onChange={event => { event.target.setCustomValidity(""); setMessage(event.target.value); }} />
          <p className="inquiry-note">Continuing opens WhatsApp in this tab with your message ready to review. You choose when to send it.</p>
          <div className="inquiry-actions"><button className="button whatsapp-button" type="submit">Continue in WhatsApp</button><button className="inquiry-cancel" type="button" onClick={close}>Cancel</button></div>
        </form>
      </div>
    </div>
    <footer className="site-footer"><a href="#home" className="wordmark" aria-label="DAVID home">DAVID</a><span><small className="footer-copyright">&copy; 2026 David Linatoc. All rights reserved.</small></span></footer>
  </div></section>;
}
