import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/ASUS/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(import.meta.dirname,'..');
const catalog=JSON.parse(fs.readFileSync(path.join(root,'assets/catalog.json'),'utf8'));
fs.mkdirSync(path.join(root,'assets/previews'),{recursive:true});fs.mkdirSync(path.join(root,'.qa'),{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1080},deviceScaleFactor:1,reducedMotion:'reduce'});
const checks=[];
for(const item of catalog){const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:4173/'+item.folder+'/index.html',{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:path.join(root,'assets/previews/'+item.folder+'.jpg'),type:'jpeg',quality:86});const desktop=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,images:[...document.images].filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.getAttribute('src'))}));await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(root,'.qa/'+item.folder+'-mobile.jpg'),type:'jpeg',quality:80,fullPage:true});const mobile=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,width:document.documentElement.scrollWidth,offenders:[...document.body.querySelectorAll('*')].filter(e=>e.getBoundingClientRect().right>innerWidth+2&&!['TEMPLATE','SCRIPT'].includes(e.tagName)).slice(0,12).map(e=>e.tagName+'.'+e.className)}));checks.push({id:item.id,desktop,mobile,errors});console.log(item.id,item.brand,JSON.stringify({desktop,mobile,errors}));await page.setViewportSize({width:1440,height:1080});page.removeAllListeners('pageerror');}
await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:path.join(root,'.qa/showroom-desktop.jpg'),type:'jpeg',quality:90});await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(root,'.qa/showroom-mobile.jpg'),type:'jpeg',quality:85,fullPage:true});fs.writeFileSync(path.join(root,'.qa/layout-checks.json'),JSON.stringify(checks,null,2));await browser.close();
