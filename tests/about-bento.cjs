const { chromium } = require('@playwright/test');
const assert = require('node:assert/strict');
(async () => {
 const browser = await chromium.launch({ channel: 'msedge', headless: true });
 try {
  for (const width of [1440, 1024, 900, 768, 390, 320]) {
   const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
   const errors = [];
   page.on('pageerror', error => errors.push(error.message));
   await page.goto('http://127.0.0.1:3000/about', { waitUntil: 'networkidle' });
   assert.equal(await page.locator('.about-card').count(), 8, 'Portrait-led bento has eight cards');
   assert.equal(await page.getByRole('heading', { name: 'About Me', exact: true }).count(), 1);
   assert.equal(await page.locator('.about-stats dt').count(), 3);
   assert.equal(await page.locator('.about-stats dd').count(), 3);
   assert.match(await page.locator('.about-stats').innerText(), /Estimated editing time/);
   const profile = await page.locator('.about-profile').boundingBox();
   const intro = await page.locator('.about-copy').boundingBox();
   if (width >= 1024) assert.ok(profile.x + profile.width < intro.x, 'Portrait stays left of introduction');
   if (width < 1024) assert.ok(intro.y >= profile.y + profile.height, 'Narrow layouts stack naturally');
   for (const theme of ['dark', 'light']) {
    await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    for (const card of await page.locator('.about-card').all()) {
     assert.ok(await card.evaluate(e => e.scrollWidth <= e.clientWidth + 1), 'No horizontal overflow inside cards');
    }
   }
   const more = page.getByText('More about my approach', { exact: true });
   await more.click();
   assert.equal(await page.locator('.about-details').getAttribute('open') !== null, true);
   assert.equal(await page.getByRole('heading', { name: 'Beyond the timeline', exact: true }).isVisible(), true);
   assert.ok(await page.getByText('I use AI-assisted coding', { exact: false }).isVisible());
   await more.click();
   assert.equal(await page.locator('.about-artwork-grid > figure').count(), 3, 'Retain all artwork');
   await page.getByRole('link', { name: 'Explore the video samples' }).click();
   await page.waitForURL('http://127.0.0.1:3000/#work');
   assert.deepEqual(errors, []);
   console.log(`PASS ${width}: bento structure, stats semantics, alignment, both themes, no overflow, retained approach details and work navigation`);
   await page.close();
  }
 } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
