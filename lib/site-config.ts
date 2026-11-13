export const siteConfig = {
  name: "DAVID",
  role: "Video editor & AI-content creator",
  headline: "Your ideas Worth watching",
  introduction: "I edit short-form videos, product ads, and AI content for brands and creators.",
  calendly: "https://calendly.com/davidlinats/client-s-interview",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_URL?.trim() || "",
} as const;

export const services = [
  {
    "title": "Short-form video editing",
    "description": "Focused, short-form stories for social feeds.",
    "icon": "film"
  },
  {
    "title": "Product video ads",
    "description": "Promotional videos that present a product and its benefits.",
    "icon": "sparkle"
  },
  {
    "title": "AI UGC video creation",
    "description": "Presenter-led ads using generated avatars and visuals.",
    "icon": "user"
  },
  {
    "title": "Real estate video editing",
    "description": "Property walkthroughs that connect rooms, details, and views.",
    "icon": "house"
  },
  {
    "title": "Content repurposing",
    "description": "Standalone highlights cut from longer recordings.",
    "icon": "repeat"
  },
  {
    "title": "Talking-head video editing",
    "description": "Presenter-focused edits that keep the message clear.",
    "icon": "chat"
  }
] as const;

export const serviceWorkflows = [
  {
    "title": "Editing your footage",
    "description": "You send the raw video. I edit the finished piece."
  },
  {
    "title": "Creating AI videos",
    "description": "You send the script. I generate the visuals, presenter or avatar, voiceover, music, and sound effects, then handle the final edit."
  }
] as const;

// Existing owner-supplied logos and approved additions. See public/assets/logos/SOURCES.md.
export const toolLogos = [
  {
    "name": "Adobe Premiere Pro",
    "file": "adobe-premiere-pro.webp",
    "category": "editing"
  },
  {
    "name": "Canva",
    "file": "canva-icon.webp",
    "category": "editing"
  },
  {
    "name": "CapCut",
    "file": "capcut.webp",
    "darkFile": "capcut-light.webp",
    "category": "editing"
  },
  {
    "name": "Gmail",
    "file": "gmail.webp",
    "category": "communication"
  },
  {
    "name": "Google Drive",
    "file": "google-drive.webp",
    "category": "storage"
  },
  {
    "name": "Google Gemini",
    "file": "google-gemini-icon.webp",
    "category": "ai"
  },
  {
    "name": "HeyGen",
    "file": "HeyGen_logo-black.webp",
    "darkFile": "HeyGen_logo-white.webp",
    "category": "ai"
  },
  {
    "name": "Higgsfield",
    "file": "higgsfield.webp",
    "category": "ai"
  },
  {
    "name": "OpenAI",
    "file": "openai.webp",
    "category": "ai"
  },
  {
    "name": "Telegram",
    "file": "telegram.webp",
    "category": "communication"
  },
  {
    "name": "Trello",
    "file": "trello.webp",
    "category": "planning"
  },
  {
    "name": "WhatsApp",
    "file": "whatsapp.webp",
    "category": "communication"
  },
  {
    "name": "Adobe After Effects",
    "file": "adobe-after-effects.svg",
    "category": "editing"
  },
  {
    "name": "ElevenLabs",
    "file": "elevenlabs.svg",
    "darkFile": "elevenlabs-light.svg",
    "category": "ai"
  },
  {
    "name": "Slack",
    "file": "slack.svg",
    "category": "communication"
  },
  {
    "name": "Google Meet",
    "file": "google-meet.svg",
    "category": "communication"
  },
  {
    "name": "Dropbox",
    "file": "dropbox.svg",
    "category": "storage"
  },
  {
    "name": "Frame.io",
    "file": "frame-io.png",
    "category": "storage"
  },
  {
    "name": "Descript",
    "file": "descript.svg",
    "category": "editing"
  },
  {
    "name": "WeTransfer",
    "file": "wetransfer.svg",
    "darkFile": "wetransfer-light.svg",
    "category": "storage"
  },
  {
    "name": "OneDrive",
    "file": "onedrive.svg",
    "category": "storage"
  },
  {
    "name": "Discord",
    "file": "discord.svg",
    "category": "communication"
  },
  {
    "name": "Zoom",
    "file": "zoom.svg",
    "category": "communication"
  },
  {
    "name": "monday.com",
    "file": "monday.svg",
    "category": "planning"
  },
  { "name": "Hubstaff", "file": "hubstaff.png", "category": "planning" },
  { "name": "Claude", "file": "claude-color.webp", "category": "ai" }
] as const;

export const toolCategories = [
  {
    "id": "editing",
    "title": "Editing & design"
  },
  {
    "id": "ai",
    "title": "AI creation"
  },
  {
    "id": "communication",
    "title": "Communication"
  },
  {
    "id": "storage",
    "title": "Storage & delivery"
  },
  {
    "id": "planning",
    "title": "Planning & coordination"
  }
] as const;
