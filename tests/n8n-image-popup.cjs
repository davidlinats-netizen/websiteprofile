const { chromium } = require('@playwright/test');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage();
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('http://127.0.0.1:3000/about', { waitUntil: 'networkidle' });
      const trigger = page.locator('.about-automation').getByRole('button', { name: 'Enlarge n8n workflow screenshot' });
      await trigger.click({ timeout: 4000 });
      const dialog = page.getByRole('dialog', { name: 'My n8n workflow' });
      await dialog.waitFor({ state: 'visible' });
      await dialog.locator('img').evaluate(i => i.decode());
      assert.equal(page.url(), 'http://127.0.0.1:3000/about');
      assert.equal(page.context().pages().length, 1);
      assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden');
      assert.equal(await dialog.evaluate(d => d.contains(document.activeElement)), true);
      await page.keyboard.press('Tab');
      assert.equal(await dialog.evaluate(d => d.contains(document.activeElement)), true);
      const box = await dialog.boundingBox();
      assert.ok(box.x >= 0 && box.x + box.width <= width + 1);
      await page.keyboard.press('Escape');
      await dialog.waitFor({ state: 'hidden' });
      assert.equal(await trigger.evaluate(t => t === document.activeElement), true);
      await page.waitForFunction(() => document.body.style.overflow !== 'hidden');
      assert.notEqual(await page.evaluate(() => document.body.style.overflow), 'hidden');
      await trigger.click();
      await dialog.getByRole('button', { name: 'Close screenshot' }).click();
      await dialog.waitFor({ state: 'hidden' });
      await trigger.click();
      await page.mouse.click(2, 2);
      await dialog.waitFor({ state: 'hidden' });
      console.log(`PASS ${width}: popup, image, no navigation, focus, scroll lock, Escape, close button, backdrop`);
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
