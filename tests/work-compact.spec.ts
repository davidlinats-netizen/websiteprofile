import { test, expect } from '@playwright/test';

test.use({ channel: 'chrome', reducedMotion: 'reduce' });
for (const width of [964, 1440, 390]) {
  test(`featured card stays compact and notes follow seeking at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('http://127.0.0.1:3210/');
    const card = page.locator('.work-inline-stage');
    await expect(card.getByText('Sea-view property tour', { exact: true })).toBeVisible();
    await expect(card.locator('.work-context-note')).toHaveCount(0);
    const video = card.locator('video');
    await video.evaluate((el: HTMLVideoElement) => { el.preload = 'metadata'; el.load(); });
    await expect.poll(() => video.evaluate((el: HTMLVideoElement) => el.readyState)).toBeGreaterThanOrEqual(1);
    const count = await page.evaluate(async () => {
      const video = document.querySelector('.work-featured-video') as HTMLVideoElement;
      const points = [0, 14, 28, 42, 60, 80];
      for (const point of points) {
        video.currentTime = point;
        video.dispatchEvent(new Event('timeupdate', { bubbles: true }));
        await new Promise(resolve => setTimeout(resolve, 80));
        if (innerWidth >= 768) {
          const media = video.getBoundingClientRect();
          const text = document.querySelector('.work-inline-context')!.getBoundingClientRect();
          if (text.bottom > media.bottom + 1) return point;
        }
      }
      return -1;
    });
    expect(count, 'all chapter copy should fit beside the video').toBe(-1);
    await expect(card.locator('.work-moment-time')).not.toHaveText('00:00 - 00:04');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await card.screenshot({ path: `cache/work-compact-${width}.png` });
  });
}
