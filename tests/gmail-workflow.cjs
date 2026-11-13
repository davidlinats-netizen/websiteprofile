const { chromium } = require('@playwright/test');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage();
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('http://127.0.0.1:3000/about', { waitUntil: 'networkidle' });
      assert.equal(await page.locator('.about-automation figure').count(), 2);
      const trigger = page.getByRole('button', { name: 'Enlarge Gmail to WhatsApp automation' });
      await trigger.click();
      const dialog = page.getByRole('dialog', { name: 'Gmail to WhatsApp automation' });
      await dialog.waitFor({ state: 'visible' });
      const image = dialog.locator('img');
      await image.evaluate(i => i.decode());
      const dimensions = await image.evaluate(i => ({ w: i.naturalWidth, h: i.naturalHeight, src: i.currentSrc }));
      assert.equal(dimensions.w, 1661);
      assert.equal(dimensions.h, 692);
      assert.ok(dimensions.src.endsWith('/assets/images/gmail-whatsapp-workflow.png'));
      const original = dialog.getByRole('link', { name: 'Open original image to zoom' });
      assert.equal(await original.getAttribute('href'), '/assets/images/gmail-whatsapp-workflow.png');
      assert.equal(await original.getAttribute('target'), '_blank');
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      const box = await dialog.boundingBox();
      assert.ok(box.x >= 0 && box.x + box.width <= width + 1);
      await page.screenshot({ path: `.verification/gmail-workflow-${width}.png` });
      await page.keyboard.press('Escape');
      await dialog.waitFor({ state: 'hidden' });
      assert.equal(await trigger.evaluate(t => t === document.activeElement), true);
      console.log(`PASS ${width}: both examples, original 1661x692 PNG, enlarge, full-size link, no overflow, Escape, focus restored`);
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
