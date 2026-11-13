import tracking from "./sample-edit-tracks.json";

// Editorial analysis of the supplied 87-second export. Times are rounded chapter
// boundaries, not frame-accurate cuts. Copy makes no unconfirmed ownership claims.
export const featuredBreakdown = {
  src: "/assets/video/sample-edit.mp4",
  poster: "/assets/video/sample-edit.jpg",
  title: "Sample edit",
  format: "Real estate · Vertical tour · 1:27",
  chapters: [
    {
      start: 0, end: 4, title: "Visual hook",
      observation: "A hand directs attention through the tall windows toward the sea. The opening captions emphasize the unblocked view.",
      rationale: "The tour leads with a distinctive property benefit before moving into the presenter introduction. The opening gives the rest of the video a clear visual theme.",
    },
    {
      start: 4, end: 6, title: "Price curiosity",
      observation: "An incomplete dollar amount appears as the cost is introduced.",
      rationale: "The exact number is briefly withheld, creating a question. The next section supplies a price bracket, so this is a short tease rather than a reveal held until the ending.",
    },
    {
      start: 6, end: 10, title: "Positioning and price anchor",
      observation: "Staircase and pool footage accompany the penthouse and CBD description. A large yellow caption introduces a price below $1.8 million.",
      rationale: "Property type, location and price bracket establish the offer quickly. Larger type and yellow emphasis make the price easy to distinguish from supporting captions.",
    },
    {
      start: 10, end: 16, title: "Who the property is for",
      observation: "Window and stairwell coverage supports references to MRT access, own-stay opportunities and investor appeal.",
      rationale: "This positions the tour around potential buyer priorities before listing the individual rooms. These are claims presented in the video, not verified rental-return projections.",
    },
    {
      start: 16, end: 24, title: "Property introduction",
      observation: "Presenter and bedroom coverage introduce two bedrooms, 1,044 square feet and proximity to Tanjong Pagar MRT.",
      rationale: "Concrete specifications give the walkthrough context. Alternating presenter footage with the property lets viewers connect the description to the space.",
    },
    {
      start: 24, end: 30, title: "Living-room demonstration",
      observation: "The presenter enters the living area. Room coverage shows the couch, television and windows, with a reference to a four-to-six-seater couch.",
      rationale: "A furniture example makes the room's use more tangible than a generic description of space. The sequence helps establish how the living area is arranged.",
    },
    {
      start: 30, end: 37, title: "The main selling point",
      observation: "The presenter identifies the key feature, followed by a view shot and captions emphasizing the sea and port outlook.",
      rationale: "Returning to the opening view reinforces the video's main theme. The property coverage gives the feature room to register instead of relying on explanation alone.",
    },
    {
      start: 37, end: 45, title: "First-bedroom benefits",
      observation: "Bedroom shots emphasize king-size-bed capacity and the same sea view.",
      rationale: "The section connects features to practical use. Bold caption keywords direct attention to bed capacity and outlook while the room remains visible.",
    },
    {
      start: 45, end: 49, title: "Making the layout clear",
      observation: "The Jack-and-Jill bathroom is introduced, along with its connection back toward the living area.",
      rationale: "The explanation preserves spatial continuity. Viewers see how the bathroom connects to the home, rather than just an isolated room shot.",
    },
    {
      start: 49, end: 57, title: "Kitchen details as evidence",
      observation: "A wider U-shaped kitchen view gives way to cabinetry, oven, hob and basin details. Captions emphasize storage space.",
      rationale: "Relevant detail shots demonstrate the features as they are discussed. Wider coverage establishes the layout before closer views show the fittings.",
    },
    {
      start: 57, end: 62, title: "The second bedroom",
      observation: "The next room is introduced through presenter, desk and window coverage. The sea-view message returns.",
      rationale: "The walkthrough progresses while connecting another room to the main selling point. The recurring view keeps the tour's theme consistent.",
    },
    {
      start: 62, end: 67, title: "An architectural highlight",
      observation: "Upward framing shows the double-volume ceiling. The presenter suggests a possible loft conversion.",
      rationale: "A change in framing directs attention to vertical space. The conversion is a suggestion in the video, not confirmation of permission or feasibility.",
    },
    {
      start: 67, end: 72, title: "Building toward the reveal",
      observation: "Staircase and upper-level doorway footage lead toward the outdoor area.",
      rationale: "The sequence gives the tour a connected route and prepares the viewer for a different part of the property. The movement builds anticipation for the outdoor space.",
    },
    {
      start: 72, end: 79, title: "The outdoor lifestyle",
      observation: "Deck and presenter footage introduce the barbecue area, followed by movement toward the pool steps.",
      rationale: "The story shifts from interior functions to outdoor use. The route across the deck sets up the final major property highlight.",
    },
    {
      start: 79, end: 84, title: "Pool and view payoff",
      observation: "The swimming pool, glass railing and open sea view take focus.",
      rationale: "The outdoor amenity and recurring view come together in one sequence. This resolves the progression from the opening window view to the rooftop experience.",
    },
    {
      start: 84, end: 87.051, title: "Closing on the offer",
      observation: "The presenter stands beside the pool as a yellow $1,780,000 caption appears, with negotiable underneath.",
      rationale: "The edit ends with specific offer information after showing the property. This is a price close, not an explicit contact call to action.",
    },
  ],
} as const;

export type AnnotationBox = { x: number; y: number; width: number; height: number };

// Manually reviewed bounds, not automated tracking. Never bridge unseen gaps.
export function annotationsAtTime(seconds: number): { phase: "caption" | "safe-zone" | "price" | "none"; boxes: AnnotationBox[] } {
  if (!Number.isFinite(seconds) || seconds < 0) return { phase: "none", boxes: [] };
  const phase = seconds < 5 ? "caption" : seconds < 84 ? "safe-zone" : "price";
  const boxes = tracking.cues.filter(cue => cue.kind === phase && seconds >= cue.start && seconds <= cue.end).map(cue => {
    const index = Math.max(0, cue.keyframes.findLastIndex(frame => frame.time <= seconds));
    const a = cue.keyframes[index];
    const b = cue.keyframes[index + 1] ?? a;
    const fraction = b.time === a.time ? 0 : (seconds - a.time) / (b.time - a.time);
    const lerp = (key: keyof AnnotationBox) => a[key] + (b[key] - a[key]) * fraction;
    return { x: lerp("x"), y: lerp("y"), width: lerp("width"), height: lerp("height") };
  });
  return { phase, boxes };
}

export function chapterAtTime(seconds: number): number {
  if (!Number.isFinite(seconds) || seconds < 0) return 0;
  const index = featuredBreakdown.chapters.findLastIndex(chapter => seconds >= chapter.start);
  return Math.max(0, index);
}
