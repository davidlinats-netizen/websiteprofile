import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test.use({ channel: "chrome", reducedMotion: "reduce" });
const origin = "http://127.0.0.1:3210";

test("independent real spectra follow playback, pause and bidirectional seeks without extra audio", async ({ page }) => {
  await page.goto(`${origin}/#behind-the-edit`);
  const section = page.locator("#behind-the-edit"), video = section.locator("video");
  const canvases = section.locator("canvas");
  await expect(canvases).toHaveCount(3);
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.readyState)).toBeGreaterThanOrEqual(1);
  await video.evaluate(async (v: HTMLVideoElement) => { v.muted = true; v.currentTime = 2; await v.play(); });
  await expect.poll(async () => Number(await canvases.first().getAttribute("data-peak"))).toBeGreaterThan(0);
  await video.evaluate((v: HTMLVideoElement) => v.pause());
  await expect(canvases.first()).toHaveAttribute("data-playing", "false");
  for (const time of [40, 3]) {
    await video.evaluate((v: HTMLVideoElement, t) => { v.currentTime = t; }, time);
    await expect.poll(async () => Number(await canvases.first().getAttribute("data-time"))).toBe(time);
  }
  const signals = await canvases.evaluateAll(nodes => nodes.map(n => n.getAttribute("data-bins")));
  expect(new Set(signals).size).toBe(3);
  expect(await page.locator("audio").evaluateAll(nodes => nodes.filter(n => !(n as HTMLAudioElement).paused).length)).toBe(0);
  await section.locator(".breakdown-audio").screenshot({ path: "E:/My portfolio/cache/video-analysis/eon-shenton/stem-spectra.png" });
});

test("isolated listening preserves native controls and never mixes the original alongside a stem", async ({ page }) => {
  await page.addInitScript(() => {
    const original = AudioContext.prototype.createGain;
    const gains: GainNode[] = [];
    (window as unknown as { stemGains: GainNode[] }).stemGains = gains;
    AudioContext.prototype.createGain = function () { const node = original.call(this); gains.push(node); return node; };
  });
  await page.goto(`${origin}/#behind-the-edit`);
  const section = page.locator("#behind-the-edit"), video = section.locator("video"), audio = section.locator("audio");
  const select = section.getByLabel("Listen to");
  await expect(select).toHaveValue("original");
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.readyState)).toBeGreaterThanOrEqual(1);
  await video.evaluate(async (v: HTMLVideoElement) => { v.currentTime = 12; v.volume = 0.1; await v.play(); });
  for (const id of ["voice", "music", "effects"]) {
    await select.selectOption(id);
    await expect(audio).toHaveAttribute("src", `/assets/audio/sample-edit/${id}.mp3`);
    await expect.poll(() => audio.evaluate((a: HTMLAudioElement) => a.paused)).toBe(false);
    await expect(video).toHaveAttribute("data-original-gain", "0");
    expect(await page.evaluate(() => (window as unknown as { stemGains: GainNode[] }).stemGains.map(g => g.gain.value))).toEqual([0]);
    expect(await audio.evaluate((a: HTMLAudioElement) => a.readyState)).toBeGreaterThanOrEqual(3);
    await video.evaluate((v: HTMLVideoElement) => { v.pause(); v.currentTime = 40; v.playbackRate = 1.5; v.volume = 0.25; v.muted = true; });
    await expect.poll(() => audio.evaluate((a: HTMLAudioElement) => a.currentTime)).toBeCloseTo(40, 1);
    expect(await audio.evaluate((a: HTMLAudioElement) => ({ paused: a.paused, rate: a.playbackRate, volume: a.volume, muted: a.muted }))).toEqual({ paused: true, rate: 1.5, volume: 0.25, muted: true });
    await video.evaluate(async (v: HTMLVideoElement) => { v.currentTime = 3; v.muted = false; await v.play(); });
    await expect.poll(async () => Math.abs(await audio.evaluate((a: HTMLAudioElement) => a.currentTime) - await video.evaluate((v: HTMLVideoElement) => v.currentTime))).toBeLessThan(0.15);
  }
  await select.selectOption("original");
  await expect(video).toHaveAttribute("data-original-gain", "1");
  expect(await page.evaluate(() => (window as unknown as { stemGains: GainNode[] }).stemGains.map(g => g.gain.value))).toEqual([1]);
  expect(await audio.evaluate((a: HTMLAudioElement) => a.paused)).toBe(true);
  await select.selectOption("voice");
  await video.evaluate(async (v: HTMLVideoElement) => { v.currentTime = v.duration - 0.1; await v.play(); });
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.ended)).toBe(true);
  expect(await audio.evaluate((a: HTMLAudioElement) => a.paused)).toBe(true);
});

test("failed analysis is honest and failed stem never silently restores the mix", async ({ page }) => {
  await page.route("**/assets/audio/sample-edit/spectra.json", r => r.abort());
  await page.route("**/assets/audio/sample-edit/voice.mp3", r => r.abort());
  await page.goto(`${origin}/#behind-the-edit`);
  const section = page.locator("#behind-the-edit");
  await expect(section.getByText(/Stem visualization is unavailable/)).toBeVisible();
  await expect(section.locator("canvas")).toHaveCount(0);
  await section.getByLabel("Listen to").selectOption("voice");
  await expect(section.getByRole("status").filter({ hasText: /Isolated audio/ })).toBeVisible();
  await expect(section.locator("video")).toHaveAttribute("data-original-gain", "0");
  await expect(section.getByLabel("Listen to")).toHaveValue("voice");
});

test("stem UI fits mobile/light mode and has no axe violations", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${origin}/#behind-the-edit`);
  await page.getByRole("button", { name: "Switch to light mode" }).click();
  const section = page.locator("#behind-the-edit");
  await expect(section.locator("canvas")).toHaveCount(3);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect((await new AxeBuilder({ page }).include("#behind-the-edit").analyze()).violations).toEqual([]);
  await section.screenshot({ path: "E:/My portfolio/cache/video-analysis/eon-shenton/stems-mobile.png" });
});


test("play rejection stops isolated playback without silently restoring the mix", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      return this.tagName === "AUDIO" ? Promise.reject(new DOMException("Blocked by policy", "NotAllowedError")) : original.call(this);
    };
  });
  await page.goto(`${origin}/#behind-the-edit`);
  const section = page.locator("#behind-the-edit"), video = section.locator("video");
  await section.getByLabel("Listen to").selectOption("voice");
  await expect.poll(() => section.locator("audio").evaluate((a: HTMLAudioElement) => a.readyState)).toBeGreaterThanOrEqual(3);
  await video.evaluate((v: HTMLVideoElement) => { void v.play().catch(() => {}); });
  await expect(section.getByRole("status").filter({ hasText: /Isolated audio is unavailable/ })).toBeVisible();
  expect(await video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
  await expect(video).toHaveAttribute("data-original-gain", "0");
  await expect(section.getByLabel("Listen to")).toHaveValue("voice");
});
