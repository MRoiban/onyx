import { describe, expect, it } from 'bun:test';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import { render, act } from '@testing-library/react';
import { Popover, PopoverContent, PopoverArrow } from '../src/components/popover';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuViewport } from '../src/components/navigation-menu';
import { resolveChromium } from './browser';
const require = createRequire(import.meta.url);
const shell=resolveChromium();
const browserDescribe=shell ? describe : describe.skip;
browserDescribe('fix C real Chromium geometry',()=>{
 it('R12 CSS-class constrained Popover subtracts padding, scrolls internally and keeps its arrow outside; NavigationMenu scrolls',async()=>{
  const scratch=mkdtempSync(join(tmpdir(),'onyx-fix2-c-'));
  try {
   render(<><Popover open><PopoverContent className="test-constrained" onOpenAutoFocus={e=>e.preventDefault()}><PopoverArrow/>{Array.from({length:30},(_,i)=><p key={i}>Line {i}</p>)}</PopoverContent></Popover>
   <NavigationMenu value="panel"><NavigationMenuList><NavigationMenuItem value="panel"><NavigationMenuTrigger>Navigation</NavigationMenuTrigger><NavigationMenuContent forceMount>{Array.from({length:30},(_,i)=><p key={i}>Destination {i}</p>)}</NavigationMenuContent></NavigationMenuItem></NavigationMenuList><NavigationMenuViewport forceMount/></NavigationMenu></>);
   await act(async()=>{});
   const content=document.querySelector('[data-slot="popover-content"]')!.outerHTML;
   const nav=document.querySelector('[data-slot="navigation-menu"]')!.outerHTML;
   const css=await require('postcss')([require('postcss-import'),require('tailwindcss')(require('../tailwind.config.cjs'))]).process(readFileSync('src/styles.css','utf8'),{from:join(process.cwd(),'src/styles.css')});
   writeFileSync(join(scratch,'onyx.css'),css.css);
   writeFileSync(join(scratch,'index.html'),`<!doctype html><html data-theme="dark" data-density="compact"><link rel="stylesheet" href="onyx.css"><style>.test-constrained{max-height:calc(var(--onyx-space-10)*3)}.onyx-navigation-content,.onyx-navigation-viewport{max-height:calc(var(--onyx-space-10)*3)}</style>${content}${nav}<pre id="result"></pre><script>setTimeout(()=>{
    const outer=document.querySelector('[data-slot="popover-content"]'),inner=outer.querySelector('[data-slot="popover-scroll"]'),s=getComputedStyle(outer),r=outer.getBoundingClientRect(),i=inner.getBoundingClientRect();inner.scrollTop=80;
    const measure=e=>{e.scrollTop=80;return {client:e.clientHeight,scroll:e.scrollHeight,top:e.scrollTop}};
    document.getElementById('result').textContent=JSON.stringify({height:r.height,limit:parseFloat(s.maxHeight),innerBottom:i.bottom,contentBottom:r.bottom-parseFloat(s.paddingBottom)-parseFloat(s.borderBottomWidth),inner:measure(inner),arrowOutside:!inner.contains(outer.querySelector('[data-slot="popover-arrow"]')),navigation:measure(document.querySelector('[data-slot="navigation-menu-content"]')),viewportOverflow:getComputedStyle(document.querySelector('[data-slot="navigation-menu-viewport"]')).overflow});
   },100)</script></html>`);
   const proc=Bun.spawn([shell!,'--no-sandbox','--allow-file-access-from-files','--virtual-time-budget=1000','--dump-dom',`file://${join(scratch,'index.html')}`],{stdout:'pipe',stderr:'ignore'});
   const dom=await new Response(proc.stdout).text();expect(await proc.exited).toBe(0);
   const result=JSON.parse(dom.match(/<pre id="result">([^<]+)<\/pre>/)![1]!);
   expect(result.height).toBeLessThanOrEqual(result.limit+1);
   expect(result.innerBottom).toBeLessThanOrEqual(result.contentBottom+1);
   expect(result.inner.scroll).toBeGreaterThan(result.inner.client);expect(result.inner.top).toBe(80);
   expect(result.arrowOutside).toBe(true);
   expect(result.navigation.scroll).toBeGreaterThan(result.navigation.client);expect(result.navigation.top).toBe(80);
   expect(result.viewportOverflow).toBe('auto');
  } finally {rmSync(scratch,{recursive:true,force:true});}
 },15000);
});
