## Approved refinement, October 27, 2026

David approved retaining the existing palette, typography, portrait, section order, static services introduction and tools grid. Scope: add a View my work action and concise introduction; add a visible filmstrip pause control and pause on hover; show clear play indicators; improve supporting text size; consolidate duplicate Premiere Pro logos; quiet background particles. The removed video breakdown stays removed. Use David's adopted Website Design Fundamentals; the mobile product-page video is inspiration only. Review locally; do not publish. Earlier proposals and stage status below are historical.

# Website portfolio

## Updated direction proposal, September 30, 2026

Status: awaiting user approval. This proposal supersedes the older blue-accent proposal below. No website implementation is authorized until direction approval, as explicitly requested by the user.

Reading this as: a video editor and AI-content portfolio for prospective clients, with a dark cinematic language, leaning toward an asymmetric motion-led gallery.

- Palette: near-black #0B0C0E, charcoal #17191D, off-white #F4F3EC, secondary gray #B5B7BE, yellow #F5D547. Dark theme throughout; yellow buttons use near-black text.
- Typography: self-hosted Barlow Condensed bold for large display headings, Manrope for body and navigation. Hero headline proposed: "Made to stop the scroll."
- Composition: compact header; left-aligned oversized hero headline beside a prominent video composition; selected-work filmstrip with category filtering; compact services section; tools marquee; contact section. Desktop content width 1360px with 48px gutters; mobile single-column with 20px gutters.
- Media: preserve all 14 supplied YouTube Shorts across Promotional Ads (2), Real Estate (5), Repurposed Content (2), Talking Head (3), and AI UGC (2). Use clickable poster cards and load a video player on demand, with a direct YouTube fallback. Inspect supplied local videos before assigning hero/background roles.
- Shapes: 8px corners for buttons and media; circular player controls only. Space and subtle separators group content.
- Motion: subtle cursor-following yellow light, background parallax, restrained media tilt, staggered reveals, and hover/focus/press feedback on every button. Infinite video and tools marquees are explicitly requested and override the guide's one-marquee default. Pause on hover/focus and provide pause controls; reduced motion renders static alternatives. Preserve native scrolling and cursor.
- Mobile: stacked hero, swipeable work, reachable controls, no hover-only content, reduced background effects.
- Design dials: DESIGN_VARIANCE 8, MOTION_INTENSITY 7, VISUAL_DENSITY 3.
- Content: no invented results, testimonials, biography, or contact details. Owner name and contact destination remain needed. AI UGC is confirmed portfolio content; no live AI service has been specified.

Approval locks this direction for implementation using frontend design skill.md, followed by polish using impeccable.md. The original supplied guides remain unchanged.

## Previous proposal (historical, superseded)

## Purpose and current status

Build a personal portfolio that makes the owner's work, contribution, and contact details easy to understand.

The workspace currently contains the three supplied skill files. No website implementation, personal biography, project assets, or existing brand direction is present.

**Status: Stage 1, awaiting visual-direction approval.** The user confirmed a designer portfolio with a visual, project-led feel. This document is the project brief and stage handoff. Proposed choices below are not approved decisions. Do not begin website implementation until the user approves the direction.

## Working rules

- Use only the skill assigned to the active stage. Do not combine the three skills into one design pass.
- Explicit user requirements and the approved design take precedence over conflicting skill instructions.
- Never overwrite or modify any of the supplied skill files.
- Record approval and requested revisions in this file. Do not treat silence or a draft proposal as approval.
- Keep factual content grounded in user-provided information. Do not invent employers, achievements, project results, testimonials, or contact details.

## Stage 1: Define the visual direction

**Assigned skill:** [taste skill.md](<taste skill.md>)

Portfolio focus: designer portfolio with a visual, project-led feel. Use actual work to shape the composition. Prospective clients and design hiring teams are the proposed audience, pending any further user guidance.

### Candidate direction for review

Design read: Reading this as a designer portfolio for prospective clients and design hiring teams, with a visual, project-led language, leaning toward an asymmetric gallery and restrained sans-serif typography.

The project-led focus is confirmed. The visual choices below remain a proposal for approval.

**Design dials:** `DESIGN_VARIANCE: 7`, `MOTION_INTENSITY: 3`, `VISUAL_DENSITY: 3`. Give imagery prominence through asymmetric composition and generous space, with motion focused on interaction feedback.

### Colors

Use one consistent neutral palette and a blue accent throughout. Support system-selected light and dark appearances with semantic tokens; do not invert individual sections for decoration.

| Role | Light | Dark |
|---|---|---|
| Page background | `#F7F8FA` | `#14171C` |
| Raised surface | `#ECEEF2` | `#20252D` |
| Primary text | `#20242B` | `#F0F2F5` |
| Secondary text | `#535D6B` | `#B2BBC8` |
| Subtle divider | `#D2D8E1` | `#3C4655` |
| Accent | `#2855B8` | `#91B1FA` |

Use accent for meaningful links, focus, and primary actions. Light-mode accent buttons use light text; dark-mode accent buttons use dark text. Verify actual contrast during implementation, including control boundaries and focus indicators; subtle dividers are not sufficient control outlines.

### Typography

- Use self-hosted **Manrope** for headings, body copy, and navigation, with a system sans-serif fallback.
- Use weight 600 for headings and 400 for body copy. Establish hierarchy through size and spacing.
- Proposed desktop headline range: 48–64px; mobile: 34–42px. Adapt to actual copy without clipping or forced line breaks.
- Body: 16–18px with approximately 1.6 line height and a maximum reading width of 65 characters.
- Use sentence case and descriptive headings. Avoid decorative metadata and repeated uppercase labels.

### Layout and imagery

- Constrain the desktop content to 1280px, with 48px side gutters where space permits; use 16–24px gutters on mobile.
- Header: owner's name and concise links to Work, About, and Contact. Keep desktop navigation on one line.
- Opening: a short left-aligned introduction occupying approximately one third of the desktop composition beside one genuine featured project image occupying two thirds. Balance text and imagery so the work and primary action are visible early.
- Work: a wide featured project followed by a two-column selection when enough real projects exist. Place titles and concise contribution summaries below the images.
- About: a compact readable section describing the owner's practice and experience using supplied facts.
- Contact: a clear contact destination and relevant verified profile links.
- Below 768px, stack all content in reading order. Keep navigation usable without hover and avoid horizontal scrolling.
- Use a spacing scale of 4, 8, 12, 16, 24, 32, 48, 64, and 96px. Proposed section gaps are 64–96px on desktop and 40–56px on mobile.
- Use 8px corners for media and controls. Group content with spacing rather than repeated bordered cards or decorative shadows.
- Use actual project screenshots or supplied photography. Mark missing assets explicitly in drafts; never present generated imagery as evidence of completed work.

### Motion and interactions

- Use short, approximately 160–220ms interaction transitions. Restrict animated properties to opacity and transform.
- Keep the page static on initial load. Use native scrolling and direct anchor navigation.
- Provide clear hover, focus, and pressed states. Every interaction must also work with keyboard and touch.
- Respect reduced-motion preferences with instant state changes where needed.
- Use consistent action names: Work for browsing projects and Contact for contacting the owner. Each project opens a real case study or supplied destination.

### Approval gate

Present the palette, type, layout, and motion proposal to the user. Incorporate their revisions before implementation.

- Portfolio focus: confirmed designer portfolio with a visual, project-led feel.
- Primary audience: pending confirmation.
- Direction approval: pending.
- Approved revisions: none recorded.

Approval locks the colors, typography, composition, shape rules, and motion style for the next stages. Website code must not be created before approval.

## Stage 2: Implement the approved direction

**Assigned skill:** [frontend design skill.md](<frontend design skill.md>)

**Entry condition:** Stage 1 approval is recorded.

Read this skill when entering this stage. Implement the approved design without independently choosing a new aesthetic.

- Inspect the project and select an appropriate implementation stack if none exists.
- Translate the approved tokens into shared styles and reusable components.
- Build the header, introduction, project presentation, about section, and contact area using confirmed content.
- Implement responsive layouts, navigation, project links, theme behavior, and interaction states.
- Use semantic structure, descriptive image alternatives, visible keyboard focus, and accessible control names.
- Preserve image aspect ratios and reserve media space to prevent layout shifts.
- Test the build and relevant interactions. Record results and outstanding content needs honestly.
- Hand off the implementation and approved direction to Stage 3. Resolve any necessary departure from that direction with the user first.

**Status:** Not started.

## Stage 3: Review and polish

**Assigned skill:** [impeccable.md](impeccable.md)

**Entry condition:** Stage 2 implementation is ready for review.

Read this skill and its available supporting resources when entering this stage. Review the actual implementation against the approved direction, preserving its identity and structure.

- Fix spacing, alignment, consistency, text wrapping, readability, contrast, focus visibility, and interaction defects.
- Check desktop and mobile, both themes, keyboard use, and reduced motion.
- Verify working destinations, usable touch targets, responsive media, and absence of clipping or horizontal overflow.
- Inspect in one batched review, fix findings together, and use at most one confirmation round, following this skill's bounded review process.
- Ask before major visual or structural changes, such as replacing the palette or typeface, reordering major sections, or changing the navigation model.
- Report completed fixes, verification results, and remaining limitations. Do not claim tests or visual checks that were not run.

**Status:** Not started.

## Content needed before completion

Owner's name and role; intended audience; concise biography; selected projects with actual contribution, screenshots, and destinations; contact details; and any existing brand assets or references. A resume link is optional and must point to a supplied document.

## Completion criteria

The website follows the approved direction, presents accurate supplied content, works across mobile and desktop, supports keyboard and reduced-motion use, has working links, and completes the Stage 3 review. The three original skill files remain unchanged.
