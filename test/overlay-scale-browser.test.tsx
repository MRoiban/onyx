import {describe, expect, it} from 'bun:test';
import {mkdtempSync,readFileSync,rmSync,symlinkSync,writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createRequire} from 'node:module';
import {resolveChromium} from './browser';
const require=createRequire(import.meta.url),shell=resolveChromium();
(shell?describe:describe.skip)('Floating UI scale and docked containment',()=>{
 it('scales portalled menus and popovers and clips positioned docked content',async()=>{
  const scratch=mkdtempSync(join(tmpdir(),'onyx-overlay-scale-'));
  try {
   symlinkSync(join(process.cwd(),'node_modules'),join(scratch,'node_modules'));
   const css=await require('postcss')([require('postcss-import'),require('tailwindcss')(require('../tailwind.config.cjs'))]).process(readFileSync('src/styles.css','utf8'),{from:join(process.cwd(),'src/styles.css')});
   writeFileSync(join(scratch,'onyx.css'),css.css);
   const entry=join(scratch,'entry.tsx');
   writeFileSync(entry,`
import * as React from ${JSON.stringify(join(process.cwd(),'node_modules/react'))};
import {createRoot} from ${JSON.stringify(join(process.cwd(),'node_modules/react-dom/client'))};
import {flushSync} from ${JSON.stringify(join(process.cwd(),'node_modules/react-dom'))};
import {ActionMenu} from ${JSON.stringify(join(process.cwd(),'src/components/action-menu'))};
import {Popover,PopoverTrigger,PopoverContent} from ${JSON.stringify(join(process.cwd(),'src/components/popover'))};
import {Panel} from ${JSON.stringify(join(process.cwd(),'src/components/panel'))};
const pause=()=>new Promise(r=>setTimeout(r,200));
function Fixture(){return <>
<ActionMenu open point={{x:300,y:150}} onOpenChange={()=>{}} items={[{id:'one',label:'One',group:'Group',shortcut:'Cmd+1'}]}/>
<Popover open><PopoverTrigger>Anchor</PopoverTrigger><PopoverContent>Popup text</PopoverContent></Popover>
<Panel variant="docked" id="panel" style={{position:'absolute',left:100,top:400,width:100,height:100}}><div id="overflow" style={{position:'absolute',left:-40,top:20,width:80,height:30,background:'red',zIndex:999}}>Content</div></Panel>
</>}
const read=()=>{const menu=document.querySelector('[data-slot="action-menu"]'),item=menu.querySelector('[data-slot="menu-item"]'),popup=document.querySelector('[data-slot="popover-content"]');const m=getComputedStyle(menu),i=getComputedStyle(item),p=getComputedStyle(popup);return {font:m.fontSize,itemFont:i.fontSize,height:i.minHeight,padding:m.paddingTop,minWidth:m.minWidth,popupFont:p.fontSize,popupWidth:p.width,popupPadding:p.paddingTop};};
(async()=>{flushSync(()=>createRoot(document.getElementById('root')).render(<Fixture/>));await pause();const normal=read();document.documentElement.style.setProperty('--onyx-scale-ui','1.5');document.documentElement.style.setProperty('--onyx-scale-type','1.25');await pause();const scaled=read();const outside=document.elementFromPoint(80,435);const inside=document.elementFromPoint(120,435);document.getElementById('results').textContent=JSON.stringify({normal,scaled,outside:outside?.id,inside:inside?.id,isolation:getComputedStyle(document.getElementById('panel')).isolation});})().catch(e=>document.getElementById('results').textContent=JSON.stringify({error:String(e)}));
`);
   const build=await Bun.build({entrypoints:[entry],outdir:scratch,target:'browser'});expect(build.success).toBe(true);
   writeFileSync(join(scratch,'index.html'),'<!doctype html><link rel="stylesheet" href="onyx.css"><style>*,*::before,*::after{animation:none!important;transition:none!important}</style><div id="root"></div><pre id="results"></pre><script src="entry.js"></script>');
   const proc=Bun.spawn([shell!,'--no-sandbox','--allow-file-access-from-files','--virtual-time-budget=4000','--dump-dom',`file://${join(scratch,'index.html')}`],{stdout:'pipe',stderr:'pipe'});
   const [dom,stderr,code]=await Promise.all([new Response(proc.stdout).text(),new Response(proc.stderr).text(),proc.exited]);expect(code).toBe(0);
   const json=dom.match(/<pre id="results"[^>]*>([^<]+)<\/pre>/)?.[1];expect(json,stderr).toBeTruthy();const result=JSON.parse(json!);expect(result.error).toBeUndefined();
   expect(result.normal).toEqual({font:'13px',itemFont:'13px',height:'28px',padding:'4px',minWidth:'220px',popupFont:'13px',popupWidth:'280px',popupPadding:'12px'});
   expect(result.scaled).toEqual({font:'16.25px',itemFont:'16.25px',height:'42px',padding:'6px',minWidth:'330px',popupFont:'16.25px',popupWidth:'420px',popupPadding:'18px'});
   expect(result.outside).not.toBe('overflow');expect(result.inside).toBe('overflow');expect(result.isolation).toBe('isolate');
  } finally {rmSync(scratch,{recursive:true,force:true});}
 },15000);
});
