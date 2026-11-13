import { test, expect } from '@playwright/test';
test.use({channel:'chrome',reducedMotion:'no-preference'});
const ink = (canvas: HTMLCanvasElement) => {
 const gl=canvas.getContext('webgl2') || canvas.getContext('webgl');
 if(!gl)return 0;
 gl.bindFramebuffer(gl.FRAMEBUFFER,null);
 const d=new Uint8Array(canvas.width*canvas.height*4);
 gl.readPixels(0,0,canvas.width,canvas.height,gl.RGBA,gl.UNSIGNED_BYTE,d);
 let sum=0; for(let i=3;i<d.length;i+=4)sum+=d[i]; return sum;
};
test('blue ink leaves a flowing trail and completely clears after stopping',async({page})=>{
 await page.goto('http://127.0.0.1:3210/');
 const canvas=page.locator('.blueprint-fluid');
 await expect(canvas).toHaveAttribute('data-renderer','webgl');
 expect(await canvas.evaluate((el:HTMLCanvasElement)=>el.width)).toBeGreaterThanOrEqual(1000);
 await expect(canvas).toHaveAttribute('data-flowing','false');
 await page.mouse.move(200,300);
 await page.mouse.move(550,330,{steps:18});
 await page.mouse.move(640,440,{steps:12});
 await page.mouse.move(530,500,{steps:12});
 await expect(canvas).toHaveAttribute('data-flowing','true');
 expect(await canvas.evaluate(ink)).toBeGreaterThan(100);
 await page.screenshot({path:'cache/blueprint-fluid-trail.png'});
 const before=await canvas.evaluate((el: HTMLCanvasElement)=>el.toDataURL());
 await page.waitForTimeout(250);
 expect(await canvas.evaluate((el: HTMLCanvasElement)=>el.toDataURL())).not.toBe(before);
 await expect.poll(()=>canvas.evaluate(ink),{timeout:5000}).toBe(0);
 await page.mouse.move(700,400,{steps:12});
 await expect(canvas).toHaveAttribute('data-flowing','true');
 await page.emulateMedia({reducedMotion:'reduce'});
 await expect(canvas).toHaveAttribute('data-flowing','false');
 expect(await canvas.evaluate(ink)).toBe(0);
});
test('unsupported WebGL leaves static background and working navigation',async({page})=>{
 await page.addInitScript(()=>{
  const original=HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext=function(this:HTMLCanvasElement,type:string,...args:unknown[]){
   if(type==='webgl'||type==='webgl2'||type==='experimental-webgl')return null;
   return Reflect.apply(original,this,[type,...args]);
  } as typeof original;
 });
 await page.goto('http://127.0.0.1:3210/');
 await expect(page.locator('.blueprint-fluid')).toHaveAttribute('data-renderer','static');
 await page.getByRole('navigation',{name:'Main navigation'}).getByRole('link',{name:'About',exact:true}).click();
 await expect(page.getByRole('heading',{name:'About David'})).toBeVisible();
});
test('GPU fluid survives resize, context loss, restoration, and light mode',async({page})=>{
 const errors:string[]=[]; page.on('pageerror',error=>errors.push(error.message));
 await page.goto('http://127.0.0.1:3210/');
 const canvas=page.locator('.blueprint-fluid');
 await expect(canvas).toHaveAttribute('data-renderer','webgl');
 await page.setViewportSize({width:1100,height:850});
 await page.mouse.move(100,200); await page.mouse.move(700,400,{steps:20});
 await expect(canvas).toHaveAttribute('data-flowing','true');
 expect(await canvas.evaluate(ink)).toBeGreaterThan(100);
 await canvas.evaluate((el:HTMLCanvasElement)=>{
  const gl=el.getContext('webgl2')||el.getContext('webgl');
  const extension=gl!.getExtension('WEBGL_lose_context')!;
  (el as HTMLCanvasElement & {testLoss:WEBGL_lose_context}).testLoss=extension;
  extension.loseContext();
 });
 await expect(canvas).toHaveAttribute('data-renderer','static');
 await page.waitForTimeout(100);
 await canvas.evaluate((el:HTMLCanvasElement)=>{
  (el as HTMLCanvasElement & {testLoss:WEBGL_lose_context}).testLoss.restoreContext();
 });
 await expect(canvas).toHaveAttribute('data-renderer','webgl');
 await page.getByRole('button',{name:'Switch to light mode'}).click();
 await expect(page.locator('html')).toHaveAttribute('data-theme','light');
 await page.waitForTimeout(1100); // Let the existing theme reveal finish before visual inspection.
 await page.mouse.move(200,250); await page.mouse.move(500,320,{steps:18});
 await expect(canvas).toHaveAttribute('data-flowing','true');
 await page.screenshot({path:'cache/blueprint-gpu-light.png'});
 expect(errors).toEqual([]);
});
test('touch devices keep the crisp static background',async({browser})=>{
 const context=await browser.newContext({isMobile:true,hasTouch:true,viewport:{width:390,height:844}});
 const page=await context.newPage();
 await page.goto('http://127.0.0.1:3210/about');
 await page.touchscreen.tap(100,250);
 await expect(page.locator('.blueprint-fluid')).not.toHaveAttribute('data-flowing','true');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await context.close();
});
