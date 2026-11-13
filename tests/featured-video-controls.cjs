const { chromium } = require('@playwright/test');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage();
    await page.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle' });
    const video = page.locator('video.work-featured-video');
    assert.equal(await page.locator('.work-video-volume, #featured-video-volume').count(), 0, 'No duplicate external volume slider');
    const controls = await video.evaluate(v => ({ native: v.controls, downloadHidden: v.controlsList.contains('nodownload'), speedHidden: v.controlsList.contains('noplaybackrate'), pipDisabled: v.disablePictureInPicture }));
    assert.equal(controls.native, true, 'Keep native playback controls');
    assert.equal(controls.downloadHidden, true, 'Hide Download');
    assert.equal(controls.speedHidden, true, 'Hide Playback speed');
    assert.equal(controls.pipDisabled, true, 'Disable Picture in picture');
    await video.evaluate(v => v.play());
    await page.waitForTimeout(500);
    assert.equal(await video.evaluate(v => !v.paused && v.currentTime > 0), true, 'Playback still works');
    await video.evaluate(v => { v.pause(); v.currentTime = 12; });
    await page.waitForFunction(() => Math.abs(document.querySelector('video.work-featured-video').currentTime - 12) < 0.5);
    assert.equal(await video.evaluate(v => v.paused), true, 'Pause and seeking still work');
    console.log('PASS: native controls retained; Download/speed/PiP suppressed; play, pause and seek work');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
