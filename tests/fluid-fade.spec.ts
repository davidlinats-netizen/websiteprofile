import { test, expect } from '@playwright/test';
test.use({channel:'chrome',reducedMotion:'no-preference'});
for (const theme of ['dark','light']) {
test(`remaining illumination fades before clearing in ${theme} mode and resumes without a jump`, async({page})=>{
 await page.addInitScript(theme=>localStorage.setItem('daviid-theme',theme),theme);
 await page.goto('http://127.0.0.1:3210/');
 await expect(page.locator('html')).toHaveAttribute('data-theme',theme);
 const canvas=page.locator('.blueprint-fluid');
 await expect(canvas).toHaveAttribute('data-renderer','webgl');
 await page.mouse.move(200,300); await page.mouse.move(650,400,{steps:24});
 await expect(canvas).toHaveAttribute('data-flowing','true');
 await expect.poll(()=>canvas.evaluate(el=>Number(getComputedStyle(el).opacity))).toBeGreaterThan(.9);
 const samples=await canvas.evaluate(async(el)=>{
  const result:{opacity:number;flowing:string|undefined}[]=[];
  const start=performance.now();
  while(performance.now()-start<4000){
   result.push({opacity:Number(getComputedStyle(el).opacity),flowing:(el as HTMLElement).dataset.flowing});
   await new Promise(resolve=>setTimeout(resolve,60));
  }
  return result;
 });
 const clearing=samples.findIndex(s=>s.flowing==='false');
 expect(clearing).toBeGreaterThan(0);
 expect(samples[clearing-1].opacity,'remaining illumination must already be invisible before clear').toBeLessThan(.01);
 expect(samples.some(s=>s.flowing==='true'&&s.opacity>.1&&s.opacity<.8),'must visibly fade through intermediate brightness').toBe(true);
 for(let i=1;i<samples.length;i++)expect(samples[i-1].opacity-samples[i].opacity).toBeLessThan(.15);
 await page.mouse.move(660,410); await page.mouse.move(700,450,{steps:6});
 const resumed=await canvas.evaluate(el=>Number(getComputedStyle(el).opacity));
 expect(resumed).toBeLessThan(.9);
 await expect.poll(()=>canvas.evaluate(el=>Number(getComputedStyle(el).opacity))).toBeGreaterThan(.9);
});
}
