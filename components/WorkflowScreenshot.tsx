import { ImagePopup } from "./ImagePopup";

export function WorkflowScreenshot() {
  return <ImagePopup source="/assets/images/ai-news-workflow.png" description="My n8n AI news workflow showing news collection, AI summaries, Discord delivery, Obsidian saving, and weekly and monthly recap branches" title="My n8n workflow" width={950} height={710} sizes="(max-width: 767px) 100vw, 950px" unoptimized />;
}
