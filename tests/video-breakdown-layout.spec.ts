import { test, expect } from "@playwright/test";

test.use({ channel: "chrome", reducedMotion: "reduce" });

for (const viewport of [{ width: 1280, height: 800 }, { width: 1440, height: 900 }]) {
  test(`audio selector and all spectra sit beside the video at ${viewport.width}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("http://127.0.0.1:3210/#behind-the-edit");
    const section = page.locator("#behind-the-edit");
    await expect(section.locator("canvas")).toHaveCount(3);
    await expect.poll(() => section.locator("video").evaluate((el: HTMLVideoElement) => el.readyState)).toBeGreaterThanOrEqual(1);
    await section.locator("video").evaluate((el: HTMLVideoElement) => { el.currentTime = 2; });
    await expect.poll(async () => Number(await section.locator("canvas").first().getAttribute("data-peak"))).toBeGreaterThan(0);
    await section.locator("video").evaluate(el => el.scrollIntoView({ block: "start" }));
    const video = (await section.locator("video").boundingBox())!;
    for (const control of [section.getByLabel("Listen to"), ...await section.locator("canvas").all()]) {
      const box = (await control.boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(video.x + video.width);
      expect(box.y).toBeGreaterThanOrEqual(video.y);
      expect(box.y + box.height).toBeLessThanOrEqual(video.y + video.height);
      expect(box.y + box.height).toBeLessThanOrEqual(viewport.height);
    }
    await page.screenshot({ path: `cache/video-analysis/eon-shenton/layout-${viewport.width}.png` });
  });
}

test("mobile keeps full-width video then adjacent audio before explanations without overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://127.0.0.1:3210/#behind-the-edit");
  const section = page.locator("#behind-the-edit");
  await expect(section.locator("canvas")).toHaveCount(3);
  const video = (await section.locator("video").boundingBox())!;
  const audio = (await section.locator(".breakdown-audio").boundingBox())!;
  const explanation = (await section.locator(".breakdown-explanation").boundingBox())!;
  expect(video.width).toBeGreaterThan(280);
  expect(audio.y).toBeGreaterThanOrEqual(video.y + video.height);
  expect(audio.y).toBeLessThan(video.y + video.height + 250);
  expect(explanation.y).toBeGreaterThanOrEqual(audio.y + audio.height);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await section.screenshot({ path: "cache/video-analysis/eon-shenton/layout-mobile.png" });
});
