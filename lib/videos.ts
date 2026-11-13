export const categories = ["Promotional Ads", "Real Estate", "Repurposed Content", "Talking Head", "AI UGC"] as const;
export type Category = (typeof categories)[number];
export type PortfolioVideo = { id: string; title: string; category: Category; contentWarning?: string };
const parasiteContentWarning = "This video contains graphic close-up footage of parasites that some viewers may find disturbing or unsettling. Viewer discretion is advised.";
export const videos: PortfolioVideo[] = [
  { id: "_gAA1AWdWvI", title: "Promotional Ad", category: "Promotional Ads" },
  { id: "CSyAbcsqM3Q", title: "Promotional Ad", category: "Promotional Ads" },
  { id: "gr_U87pLH9Q", title: "E-commerce", category: "Promotional Ads" },
  { id: "0JVjIK7EYg0", title: "Real Estate Edit", category: "Real Estate" },
  { id: "kr5bzVjSgzk", title: "Real Estate Edit", category: "Real Estate" },
  { id: "fdzbUmKXYvg", title: "Real Estate Edit", category: "Real Estate" },
  { id: "onsN84mJ19o", title: "Real Estate Edit", category: "Real Estate" },
  { id: "Te6uDAURpw8", title: "Real Estate Edit", category: "Real Estate" },
  { id: "U26yEgl1RNk", title: "Repurpose Video Edit", category: "Repurposed Content" },
  { id: "0QXx_PiDYVw", title: "Repurpose Video Edit", category: "Repurposed Content" },
  { id: "sCK_U_vcTwc", title: "Repurpose Video Edit", category: "Repurposed Content" },
  { id: "y-OUsCWfcEc", title: "Repurpose Video Edit", category: "Repurposed Content" },
  { id: "chQ9u0oOuYw", title: "Talking Head", category: "Talking Head" },
  { id: "xf1fL1_xJJM", title: "Talking Head", category: "Talking Head" },
  { id: "azH8dobash8", title: "Talking Head", category: "Talking Head" },
  { id: "a1OZ8eJdTI0", title: "UGC AI Edit", category: "AI UGC" },
  { id: "9DseglobOag", title: "UGC AI Edit", category: "AI UGC" },
  { id: "LUX7yAeNL3w", title: "UGC AI Edit", category: "AI UGC" },
  { id: "Va5JbSMhQlg", title: "UGC AI Edit", category: "AI UGC", contentWarning: parasiteContentWarning },
];
export function findVideo(id: string) { return videos.find(video => video.id === id); }
export function validVideoIds(ids: string[]) { return [...new Set(ids)].filter(id => Boolean(findVideo(id))).slice(0, 3); }

// Descriptions identify the format, not an unverified client brief or result.
const formatContext: Record<Category, string> = {
  "Promotional Ads": "A promotional video editing sample for social media.",
  "Real Estate": "A real estate video editing sample.",
  "Repurposed Content": "A short-form content repurposing sample.",
  "Talking Head": "A talking-head video editing sample.",
  "AI UGC": "An AI UGC-style video sample.",
};
export function getVideoContext(video: PortfolioVideo) {
  const number = videos.filter(item => item.category === video.category).findIndex(item => item.id === video.id) + 1;
  return { title: video.title + " " + number, description: formatContext[video.category] };
}
