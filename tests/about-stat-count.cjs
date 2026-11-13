const { chromium } = require('@playwright/test');
const assert = require('node:assert/strict');
(async () => {
 const browser = await chromium.launch({ channel: 'msedge', headless: true });
 try {
  for (const width of [1440, 390]) {
   const page = await browser.newPage({ viewport: { width, height: 500 }, reducedMotion: 'no-preference' });
   await page.goto('http://127.0.0.1:3000/about', { waitUntil: 'networkidle' });
   const stats = page.locator('.about-stats');
   const counters = stats.locator('[data-count-to]');
   assert.equal(await counters.count(), 2, 'Animate totals, not the start year');
   await page.waitForFunction(() => document.querySelector('.about-stats').dataset.phase === 'waiting');
   await stats.scrollIntoViewIfNeeded();
   await page.waitForFunction(() => document.querySelector('.about-stats').dataset.phase === 'running');
   await page.waitForTimeout(300);
   const intermediate = await counters.evaluateAll(nodes => nodes.map(n => Number(n.textContent.replaceAll(',', ''))));
   assert.ok(intermediate[0] > 0 && intermediate[0] < 200, 'Video count progresses');
   assert.ok(intermediate[1] > 0 && intermediate[1] < 3000, 'Hour count progresses');
   assert.equal(await stats.locator('dd').nth(1).innerText(), '48 hrs');
   assert.equal(await stats.locator('.about-stat-accessible').allTextContents().then(a => a.join('|')), '200+|~3,000 hrs', 'Accessible totals never count aloud');
   await page.waitForFunction(() => document.querySelector('.about-stats').dataset.phase === 'complete');
   assert.deepEqual(await counters.allTextContents(), ['200', '3,000']);
   assert.ok(await stats.locator('dd').evaluateAll(nodes => nodes.every(n => Number(getComputedStyle(n).fontWeight) >= 700)));
   await page.evaluate(() => scrollTo(0,0));
   await stats.scrollIntoViewIfNeeded();
   assert.equal(await stats.getAttribute('data-phase'), 'complete', 'No replay on scrolling');
   await page.emulateMedia({ reducedMotion: 'reduce' });
   await page.reload({ waitUntil: 'networkidle' });
   assert.equal(await stats.getAttribute('data-phase'), 'complete');
   assert.deepEqual(await counters.allTextContents(), ['200', '3,000']);
   assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
   console.log(`PASS ${width}: bolder type, real intermediate counts, exact final values, fixed date, accessible totals, once-only, reduced motion`);
   await page.close();
  }
  const page = await browser.newPage({ viewport: { width: 390, height: 500 }, reducedMotion: 'no-preference' });
  await page.goto('http://127.0.0.1:3000/about', { waitUntil: 'networkidle' });
  await page.locator('.about-stats').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector('.about-stats').dataset.phase === 'running');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForFunction(() => document.querySelector('.about-stats').dataset.phase === 'complete');
  assert.deepEqual(await page.locator('[data-count-to]').allTextContents(), ['200', '3,000']);
  await page.getByRole('link', { name: 'Back to portfolio' }).click();
  await page.waitForURL('http://127.0.0.1:3000/');
  await page.close();
  const plain = await browser.newPage({ javaScriptEnabled: false });
  await plain.goto('http://127.0.0.1:3000/about', { waitUntil: 'networkidle' });
  assert.deepEqual(await plain.locator('[data-count-to]').allTextContents(), ['200', '3,000']);
  console.log('PASS: reduced motion changed mid-count, route unmount, no-JavaScript final-value fallback');
  await plain.close();
 } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
