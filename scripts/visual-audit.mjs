import { chromium } from 'playwright';
import fs from 'node:fs';

const browser = await chromium.launch({headless:true});
const page = await browser.newPage({viewport:{width:1600,height:1000}});
await page.goto('http://127.0.0.1:4173/', {waitUntil:'networkidle'});

const count = await page.locator('.item').count();
const rows=[];
for(let i=0;i<count;i++){
  const item=page.locator('.item').nth(i);
  const name=(await item.locator('b').innerText()).trim();
  await item.click();
  await page.waitForTimeout(30);
  const detailName=(await page.locator('.detail h2').innerText()).trim();
  const stage=page.locator('.stage');
  const visible=await stage.isVisible();
  const box=await stage.boundingBox();
  const fingerprint=await stage.evaluate(el=>{
    const nodes=[el,...el.querySelectorAll('*')];
    return nodes.map(n=>{
      const s=getComputedStyle(n);
      return [n.tagName,n.className,s.animationName,s.animationDuration,s.transform,s.clipPath,s.filter,s.backgroundImage].join('|');
    }).join('\n');
  });
  const hasUnmapped=await stage.locator('.unmapped').count()>0;
  rows.push({index:i,name,detailName,visible,box,fingerprint,hasUnmapped});
}
await browser.close();

const mismatch=rows.filter(r=>r.name!==r.detailName || !r.visible || !r.box || r.box.width<200 || r.box.height<150 || r.hasUnmapped);
const groups=new Map();
for(const r of rows){
  const normalized=r.fingerprint.replace(/matrix\([^)]*\)/g,'matrix').replace(/matrix3d\([^)]*\)/g,'matrix3d');
  if(!groups.has(normalized))groups.set(normalized,[]);
  groups.get(normalized).push(r.name);
}
const duplicateVisuals=[...groups.values()].filter(g=>g.length>1);
const report={count,mismatch,duplicateVisuals};
fs.mkdirSync('audit',{recursive:true});
fs.writeFileSync('audit/visual-audit.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({count,mismatchCount:mismatch.length,duplicateVisualGroupCount:duplicateVisuals.length,duplicateVisuals},null,2));
if(mismatch.length || duplicateVisuals.length) process.exit(1);
