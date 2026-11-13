export const audioStems = [
  { id: "voice", label: "Voice only", title: "Voice", src: "/assets/audio/sample-edit/voice.mp3" },
  { id: "music", label: "BG music only", title: "BG music", src: "/assets/audio/sample-edit/music.mp3" },
  { id: "effects", label: "Sound effects only", title: "Sound effects", src: "/assets/audio/sample-edit/effects.mp3" },
] as const;

export type StemSpectrum = { step: number; duration: number; frames: number[][] };
export function spectrumAtTime(data: StemSpectrum, time: number): number[] {
  if (!Number.isFinite(time) || time < 0 || time >= data.duration) return [];
  return data.frames[Math.floor(time / data.step)] ?? [];
}
