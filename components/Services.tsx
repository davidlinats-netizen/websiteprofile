"use client";

import { FilmStrip, Sparkle, UserFocus, HouseLine, ArrowsClockwise, Chats } from "@phosphor-icons/react";
import { services, serviceWorkflows } from "@/lib/site-config";
import { ScrollReveal } from "./ScrollReveal";
const icons = [FilmStrip, Sparkle, UserFocus, HouseLine, ArrowsClockwise, Chats];

export function Services() {
  return <section className="section services-section services-workflow" id="services" aria-labelledby="services-heading"><div className="container services-layout">
    <ScrollReveal className="services-intro">
      <h2 id="services-heading">From footage or script<br />to the final cut</h2>
      <dl className="service-shared-workflows">{serviceWorkflows.map(workflow => <div key={workflow.title}><dt>{workflow.title}</dt><dd>{workflow.description}</dd></div>)}</dl>
    </ScrollReveal>
    <div className="services-grid">{services.map((service, index) => {
      const Icon = icons[index];
      return <ScrollReveal key={service.title} delay={(index % 2) * 70}>
        <article className="service-item">
          <Icon className="service-workflow-icon" size={34} weight="light" aria-hidden="true" />
          <h3>{service.title}</h3><p>{service.description}</p>
        </article>
      </ScrollReveal>;
    })}</div>
  </div></section>;
}
