const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1920,height:1080}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///home/user/Nuriya-1/video2/src/render.html');await p.waitForTimeout(1500);
const res=await p.evaluate(()=>{
  const HUD=[[30,26,300,138,'сағат'],[1490,30,1870,165,'оттегі/жұлдыз'],[28,820,232,1042,'карта']];
  const SUB=[300,925,1620,1062];
  const vis=el=>{let o=1;for(let e=el;e&&e.tagName!=='svg';e=e.parentElement){o*=+getComputedStyle(e).opacity;if(getComputedStyle(e).display==='none')return 0}return o};
  const box=el=>{const r=el.getBoundingClientRect();return [r.left,r.top,r.right,r.bottom]};
  const inter=(a,b,pad=4)=>{const w=Math.min(a[2],b[2])-Math.max(a[0],b[0])-pad,h=Math.min(a[3],b[3])-Math.max(a[1],b[1])-pad;return w>0&&h>0?w*h:0};
  const area=a=>(a[2]-a[0])*(a[3]-a[1]);
  const out={};const sh=TIMELINE.shots;
  sh.forEach((s,i)=>{
    const issues=new Set();const N=Math.max(6,Math.round((s.end-s.start)*3));
    for(let k=0;k<N;k++){const t=s.start+(s.end-s.start)*(k+.5)/N;renderAt(t);
      const hasSub=TIMELINE.cues.some(c=>c.a<=t&&t<=c.b);
      const txt=[...document.querySelectorAll('[data-k=txt]')].filter(e=>!e.parentElement.closest('[data-k=txt]')&&vis(e)>.3).map(e=>({e,b:box(e),n:(e.textContent||'').trim().slice(0,24)}));
      const hero=[...document.querySelectorAll('[data-k=hero]')].filter(e=>vis(e)>.3).map(e=>({e,b:box(e)}));
      const hud=s.clock?(s.o2?HUD:[HUD[0]]):[];
      for(const a of txt){
        const fullyOut=a.b[2]<=0||a.b[0]>=1920||a.b[3]<=0||a.b[1]>=1080; if(fullyOut) continue;
        if(a.b[0]<0||a.b[1]<0||a.b[2]>1920||a.b[3]>1080) issues.add(`«${a.n}» экраннан шығып тұр`);
        for(const h of hud) if(inter(a.b,h)) issues.add(`«${a.n}» ${h[4]} белгісінің үстінде`);
        if(hasSub&&inter(a.b,SUB)) issues.add(`«${a.n}» субтитрге тиіп тұр`);
        for(const h of hero) if(inter(a.b,h.b,10)>area(a.b)*.08) issues.add(`«${a.n}» кейіпкердің үстінде`);
      }
      for(let x=0;x<txt.length;x++)for(let y=x+1;y<txt.length;y++) if(inter(txt[x].b,txt[y].b)) issues.add(`«${txt[x].n}» мен «${txt[y].n}» қабаттасып тұр`);
      for(const h of hero){const hb=h.b,ar=area(hb),inA=Math.max(0,Math.min(hb[2],1920)-Math.max(hb[0],0))*Math.max(0,Math.min(hb[3],1080)-Math.max(hb[1],0));
        if(inA<=0){} else if(hb[1]<-5) issues.add('кейіпкердің басы кадрдан шығып тұр'); else if(inA<ar*.6) issues.add('кейіпкер жартылай көрінеді');
        for(const g of hud) if(inter(hb,g,10)>area(g)*.15) issues.add(`кейіпкер ${g[4]} белгісінің астында`);}
    }
    if(issues.size) out[i+1+' '+s.scene+' «'+s.anchor+'»']=[...issues];
  });return out;});
console.log(JSON.stringify(res,null,1));console.log(errs.join('\n'));await b.close();})();
