import {test,expect} from '@playwright/test';
test.use({channel:'chrome',reducedMotion:'reduce'});
for(const width of [1440,390]){
 test(`closing CTA is centered and inquiry still works at ${width}`,async({page})=>{
  await page.setViewportSize({width,height:1000});
  await page.goto('http://127.0.0.1:3210/#contact');
  const section=page.locator('#contact');
  const container=(await section.locator(':scope > .container').boundingBox())!;
  const middle=container.x+container.width/2;
  const heading=section.getByRole('heading',{name:"Let's make it worth watching"});
  await expect(heading).toHaveCSS('text-align','center');
  for(const item of [section.locator('.eyebrow'),heading,section.locator('.contact-description'),section.locator('.contact-actions button')]){
   const box=(await item.boundingBox())!;
   expect(Math.abs(box.x+box.width/2-middle)).toBeLessThan(2);
  }
  await section.screenshot({path:`cache/centered-cta-${width}.png`});
  await section.locator('.contact-actions button').click();
  await expect(page.getByLabel('Your name',{exact:true})).toBeFocused();
  await expect(page.locator('.contact-project-panel')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.getByRole('button',{name:'Close project form'}).click();
  await expect(section.locator('.contact-actions button')).toBeFocused();
 });
}
