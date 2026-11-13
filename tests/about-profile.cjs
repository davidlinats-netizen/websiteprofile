const { chromium } = require('@playwright/test');
const assert = require('node:assert/strict');
(async () => {
 const browser = await chromium.launch({ channel: 'msedge', headless: true });
 try {
  const page = await browser.newPage();
  for (const width of [1440, 390]) {
   await page.setViewportSize({ width, height: 1000 });
   await page.goto('http://127.0.0.1:3000/about', { waitUntil: 'networkidle' });
   const photo = page.locator('.about-photo');
   assert.ok((await photo.getAttribute('src')).includes('david-about-black-shirt.webp'), 'Use the supplied new portrait');
   const signature = page.getByRole('img', { name: 'David Linatoc signature', exact: true });
   await signature.waitFor({ state: 'visible', timeout: 3000 });
   await photo.evaluate(i => i.decode());
   await signature.evaluate(async svg => { const image = new Image(); image.src = svg.querySelector("image").getAttribute("href"); await image.decode(); });
   for (const theme of ['dark', 'light']) {
    await page.evaluate(theme => { document.documentElement.dataset.theme = theme; }, theme);
    await signature.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const pic = await photo.boundingBox(), sign = await signature.boundingBox();
    assert.equal(await page.locator('#about-heading').innerText(), 'About Me');
    assert.ok(Math.abs((sign.x + sign.width / 2) - (pic.x + pic.width / 2)) < 1, 'Signature centered under photo');
    assert.ok(sign.y >= pic.y + pic.height, 'Signature below photo');
    assert.ok(sign.width > 100 && sign.x >= 0 && sign.x + sign.width <= width, 'Signature fits viewport');
    assert.ok(Math.abs(sign.width / sign.height - 484 / 161) < 0.05, 'Signature aspect ratio preserved');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    console.log(`PASS ${width} ${theme}: supplied photo loaded, signature loaded, below photo, aspect ratio and no overflow`);
   }
  }
  await page.goto('http://127.0.0.1:3000');
  const portrait = page.locator('.portrait-front img');
  await portrait.waitFor();
  assert.ok(!(await portrait.getAttribute('src')).includes('david-about-black-shirt'), 'Homepage portrait unchanged');
  console.log('PASS: homepage keeps its separate portrait');
 } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
