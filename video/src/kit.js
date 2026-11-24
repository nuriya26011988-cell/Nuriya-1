
const INK='#161616', FUR='#9b6a3c', FURD='#5e3b1d', SHADE='#dfe6ee', VEST='#7a4e2c';
const r1=v=>Math.round(v*10)/10;
let seed=1; const srand=s=>{seed=s}; const rnd=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646};
const HAND_FONT="Caveat, 'PT Sans', cursive", HEAD_FONT="Unbounded, 'PT Sans', sans-serif";

function P(d,o={}){const dr=o.c&&/\bdraw\b/.test(o.c);
  return `<path d="${d}" fill="${o.f||'none'}" stroke="${o.s||INK}" stroke-width="${o.w??6}" stroke-linecap="round" stroke-linejoin="round"${o.c?` class="${o.c}"`:''}${o.st?` style="${o.st}"`:''}${dr?' pathLength="1"':''}${o.o!=null?` opacity="${o.o}"`:''}/>`}
function G(inner,o={}){return `<g${o.t?` transform="${o.t}"`:''}${o.c?` class="${o.c}"`:''}${o.st?` style="${o.st}"`:''}${o.clip?` clip-path="url(#${o.clip})"`:''}${o.o!=null?` opacity="${o.o}"`:''}>${inner}</g>`}
function T(x,y,txt,o={}){return `<text x="${x}" y="${y}" font-family="${o.font||HAND_FONT}" font-size="${o.size||46}" font-weight="${o.wt||700}" fill="${o.fill||INK}"${o.anchor?` text-anchor="${o.anchor}"`:''}${o.c?` class="${o.c}"`:''}${o.st?` style="${o.st}"`:''}>${txt}</text>`}
function arrow(x1,y1,cx,cy,x2,y2,o={}){const dx=x2-cx,dy=y2-cy,L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L,s=18;
  const h=`M${r1(x2-ux*s-uy*s*.6)},${r1(y2-uy*s+ux*s*.6)} L${x2},${y2} L${r1(x2-ux*s+uy*s*.6)},${r1(y2-uy*s-ux*s*.6)}`;
  return P(`M${x1},${y1} Q${cx},${cy} ${x2},${y2}`,{w:4,...o})+P(h,{w:4,...o})}
function note(x,y,txt,a,w,o={}){return G(T(x,y,txt,o)+(a?arrow(...a,{s:o.fill||INK}):''),{c:'fade',st:`--w:${w}s`})}

/* ---------- Character kit (keeps the channel hero: white round head, bold brows, dot eyes, line limbs) ---------- */
const BROWS={
  curious:[[-.55,-.25,-.35,-.45,-.12,-.24],[.12,-.34,.35,-.52,.55,-.32]],
  focus:[[-.56,-.42,-.32,-.42,-.1,-.22],[.1,-.22,.32,-.42,.56,-.42]],
  worried:[[-.55,-.24,-.33,-.28,-.13,-.46],[.13,-.46,.33,-.28,.55,-.24]],
  happy:[[-.56,-.36,-.34,-.64,-.12,-.42],[.12,-.42,.34,-.64,.56,-.36]],
  calm:[[-.52,-.32,-.33,-.4,-.13,-.33],[.13,-.33,.33,-.4,.52,-.32]],
  scared:[[-.56,-.42,-.33,-.66,-.1,-.52],[.1,-.52,.33,-.66,.56,-.42]]
};
function head(cx,cy,r,mood='curious',look=[0,0],big=false){
  const a1=.349,a2=2.094,x1=r1(cx+r*Math.cos(a1)),y1=r1(cy+r*Math.sin(a1)),x2=r1(cx+r*Math.cos(a2)),y2=r1(cy+r*Math.sin(a2));
  const ex=cx+look[0]*r, ey=cy+.06*r+look[1]*r, ry=r1((big?.15:.12)*r), rx=r1((big?.09:.075)*r);
  const b=BROWS[mood].map(a=>`M${r1(cx+a[0]*r)},${r1(cy+a[1]*r)} Q${r1(cx+a[2]*r)},${r1(cy+a[3]*r)} ${r1(cx+a[4]*r)},${r1(cy+a[5]*r)}`).join(' ');
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff"/>`+
    `<path d="M${x1},${y1} A${r},${r} 0 0 1 ${x2},${y2} Q${r1(cx+.38*r)},${r1(cy+r)} ${x1},${y1}Z" fill="${SHADE}"/>`+
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${INK}" stroke-width="${r1(r*.075)}"/>`+
    `<ellipse class="blink" cx="${r1(ex-.3*r)}" cy="${r1(ey)}" rx="${rx}" ry="${ry}" fill="${INK}"/>`+
    `<ellipse class="blink" cx="${r1(ex+.3*r)}" cy="${r1(ey)}" rx="${rx}" ry="${ry}" fill="${INK}"/>`+
    P(b,{w:r1(r*.085)});
}
const hand=(x,y,r=15)=>`<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r1(r*1.2)}" fill="${INK}"/>`;
const arm=(d,w=9)=>P(d,{w});
const legs=()=>P('M-24,-128 L-34,-6 L-58,-4 M24,-128 L34,-6 L58,-4',{w:10});
const seatedLegs=()=>P('M-30,-70 C-70,-60 -112,-40 -120,-14 C-90,0 -30,-4 34,-8 M30,-70 C70,-60 112,-40 120,-14 C90,0 30,-4 -34,-8',{w:10});
function tunic(dy=0){
  return G(`<path d="M-58,-300 Q0,-312 58,-300 L76,-142 L62,-128 L52,-113 L38,-127 L22,-110 L6,-125 L-10,-108 L-26,-124 L-41,-109 L-55,-126 L-76,-142Z" fill="${FUR}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`+
    P('M-30,-272 l9,10 M18,-252 l9,10 M-42,-206 l9,10 M30,-190 l9,10 M-6,-230 l9,10 M-22,-164 l9,10 M42,-156 l9,10 M2,-282 l9,10',{s:FURD,w:4})+
    P('M-58,-300 Q-20,-262 14,-306',{s:FURD,w:4}),{t:dy?`translate(0,${dy})`:''});
}
function vestOutfit(){
  return `<path d="M-60,-300 Q0,-312 60,-300 L68,-118 L-68,-118Z" fill="#fff" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`+
   `<path d="M-60,-300 L-16,-302 L-22,-205 L-10,-112 L-70,-118Z" fill="${VEST}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`+
   `<path d="M60,-300 L16,-302 L22,-205 L10,-112 L70,-118Z" fill="${VEST}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`+
   `<rect x="24" y="-196" width="36" height="40" rx="4" fill="#8f6038" stroke="${INK}" stroke-width="4"/>`+
   `<rect x="28" y="-214" width="26" height="24" fill="#fff" stroke="${INK}" stroke-width="3"/>`+P('M31,-207 h20 M31,-200 h20',{w:2})+
   `<circle cx="-38" cy="-262" r="10" fill="#b9a27c" stroke="${INK}" stroke-width="4"/>`+
   `<rect x="-58" y="-200" width="24" height="22" fill="#b98a5a" stroke="${INK}" stroke-width="3"/>`+P('M-54,-196 l4,4 M-44,-196 l4,4 M-54,-186 l4,4',{w:2})+
   `<rect x="34" y="-268" width="22" height="18" rx="3" fill="#8f6038" stroke="${INK}" stroke-width="3"/>`;
}
function spear(x1,y1,x2,y2){
  const dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L,px=-uy,py=ux,q=(a,b)=>`${r1(a)},${r1(b)}`;
  return P(`M${x1},${y1} L${x2},${y2}`,{w:13})+P(`M${x1},${y1} L${x2},${y2}`,{s:'#a8743f',w:6})+
   `<path d="M${q(x2+ux*58,y2+uy*58)} L${q(x2+px*17,y2+py*17)} L${q(x2-ux*6,y2-uy*6)} L${q(x2-px*17,y2-py*17)}Z" fill="#8d9096" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`+
   P(`M${q(x2-ux*14+px*8,y2-uy*14+py*8)} L${q(x2-ux*14-px*8,y2-uy*14-py*8)} M${q(x2-ux*24+px*8,y2-uy*24+py*8)} L${q(x2-ux*24-px*8,y2-uy*24-py*8)}`,{w:4});
}
function fire(x,y,s=1,cls='flick'){
  const fl=(sc,col,d,w)=>`<g transform="scale(${sc})"><path class="${cls}" style="--d:${d}s;--w:${w}s" d="M0,-150 C26,-112 62,-78 48,-34 C40,-8 -40,-8 -48,-34 C-62,-78 -24,-104 0,-150Z" fill="${col}" stroke="${INK}" stroke-width="${r1(5/sc)}" stroke-linejoin="round"/></g>`;
  return `<g transform="translate(${x},${y}) scale(${s})">
    <ellipse class="glow" cx="0" cy="-70" rx="240" ry="170" fill="#ffb347" opacity=".3"/>
    <ellipse class="glow" style="--d:1.1s" cx="0" cy="-60" rx="140" ry="105" fill="#ffcf7a" opacity=".35"/>
    ${fl(1,'#f08a24',.55,0)}${fl(.68,'#ffc53d',.45,.1)}${fl(.38,'#fff3c4',.38,.2)}
    <rect x="-88" y="-24" width="176" height="24" rx="12" transform="rotate(-11)" fill="#7a4a26" stroke="${INK}" stroke-width="5"/>
    <rect x="-88" y="-24" width="176" height="24" rx="12" transform="rotate(11)" fill="#8a5630" stroke="${INK}" stroke-width="5"/>
    ${[-118,-62,0,62,118].map(sx=>`<ellipse cx="${sx}" cy="2" rx="28" ry="15" fill="#b7b0a5" stroke="${INK}" stroke-width="5"/>`).join('')}
  </g>`;
}
function smoke(x,y,n=3,col='#8b8f94',w=6){let s='';for(let i=0;i<n;i++)s+=`<path class="rise" style="--d:${2.6+i*.4}s;--w:${r1(i*.9)}s;--x:${(i%2?1:-1)*18}px" d="M${x},${y} c-14,-14 14,-26 0,-40 c-14,-14 14,-26 0,-40" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`;return s}
function rain(n,o={}){
  srand(o.seed||7); const W=o.W||1920, len=o.len||48, DX=300, H=1080, k=len/Math.hypot(DX,H);
  const ddx=r1(-DX*k), ddy=r1(H*k); let d='';
  for(let i=0;i<n;i++){const x=-350+rnd()*(W+700), y=rnd()*H; d+=`M${r1(x)},${r1(y)} l${ddx},${ddy} M${r1(x+DX)},${r1(y-H)} l${ddx},${ddy} `;}
  return `<g class="rain" style="--d:${o.d||.62}s"><path d="${d}" stroke="${o.col||'#5b7083'}" stroke-width="${o.w||3}" stroke-linecap="round" opacity="${o.op||.55}"/></g>`;
}
const CLOUD='M-185,70 C-235,70 -235,0 -185,-10 C-195,-70 -125,-100 -85,-70 C-65,-120 15,-130 45,-80 C85,-120 175,-100 170,-40 C225,-30 230,50 175,60 C175,100 105,110 75,85 C45,120 -35,120 -65,90 C-95,115 -175,110 -185,70Z';
const cloud=(x,y,s,fill='#a8b1ba',c='',st='')=>G(G(`<path d="${CLOUD}" fill="${fill}" stroke="${INK}" stroke-width="${r1(6/s)}"/>`,{t:`translate(${x},${y}) scale(${s})`}),{c,st});
function saiga(){return `<g fill="${INK}"><ellipse cx="0" cy="-46" rx="42" ry="20"/><path d="M-30,-56 L-48,-80 Q-62,-86 -68,-72 L-58,-62 L-40,-48Z"/><circle cx="-66" cy="-70" r="8"/></g>`+
  P('M-50,-82 L-46,-108 M-25,-32 L-27,0 M-12,-32 L-10,0 M18,-32 L16,0 M30,-32 L34,0 M40,-50 l8,10',{w:5});}
const hoof=(c=INK)=>`<path d="M-7,2 C-15,-6 -13,-24 -4,-27 C0,-18 0,-6 -7,2Z M7,2 C15,-6 13,-24 4,-27 C0,-18 0,-6 7,2Z" fill="${c}"/>`;
function tuft(x,y,s=1){return P(`M${x-10*s},${y} l${-5*s},${-18*s} M${x},${y} l0,${-24*s} M${x+10*s},${y} l${6*s},${-17*s}`,{w:3.5,o:.8})}
function hatch(n,x0,x1,y0,y1,col='#8f877b',sd=3){srand(sd);let d='';for(let i=0;i<n;i++){const x=x0+rnd()*(x1-x0),y=y0+rnd()*(y1-y0),l=14+rnd()*26;d+=`M${r1(x)},${r1(y)} l${r1(l)},${r1(l*.35)} `}return P(d,{s:col,w:3,o:.7})}
function mushroom(x,y,s,w,cap='#d9b98c'){return G(G(`<path d="M-10,0 C-12,-20 -8,-34 -8,-40 L8,-40 C8,-34 12,-20 10,0Z" fill="#f4ecdc" stroke="${INK}" stroke-width="4"/><path d="M-38,-36 C-36,-70 36,-70 38,-36 C20,-30 -20,-30 -38,-36Z" fill="${cap}" stroke="${INK}" stroke-width="5"/>`+P('M-20,-50 l4,-6 M2,-58 l2,-6 M18,-48 l4,-6',{w:3,s:'#8a6a44'}),{c:'popb',st:`--w:${w}s`}),{t:`translate(${x},${y}) scale(${s})`})}
const clipRect=(id,x,y,w,h,rx=0)=>`<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"/></clipPath>`;

/* ---------- Scenes ---------- */
function s1(){
  srand(11); let tufts=''; for(let i=0;i<18;i++){const x=rnd()*1900,y=885+rnd()*170; if(x>280&&x<620&&y<950)continue; tufts+=tuft(r1(x),r1(y),.8+rnd()*.5)}
  let herd=''; [[1236,628,.55,0],[1298,604,.6,.3],[1362,593,.58,.6],[1424,588,.6,.15],[1486,587,.55,.45],[1540,596,.5,.7]]
    .forEach(([x,y,s,w])=>herd+=G(G(saiga(),{c:'bob',st:`--d:.8s;--w:${w}s;--a:-5px`}),{t:`translate(${x},${y}) scale(${s})`}));
  let tr=''; for(let i=0;i<9;i++){const t=i/8,x=r1(650+t*540),y=r1(985-t*105+(i%2?13:-13)*(1-t*.5)),s=r1(1.45-t*.75); tr+=G(hoof(),{t:`translate(${x},${y}) rotate(78) scale(${s})`,c:'fade',st:`--w:${r1(.8+i*.2)}s`})}
  const hunger=G(P('M88,-234 q12,10 0,22 M102,-244 q17,17 0,38 M-88,-234 q-12,10 0,22 M-102,-244 q-17,17 0,38',{w:4.5}),{c:'shiver'})+G(P('M-30,-196 q8,-9 16,0 t16,0 t16,0',{s:FURD,w:4}),{c:'shiver-hard'});
  const hero=G(legs()+G(
      arm('M-52,-288 Q-85,-262 -91,-212')+spear(-120,90,-62,-520)+hand(-91,-212)+tunic()+hunger+
      head(0,-410,105,'focus',[.12,.12])+arm('M52,-288 Q102,-240 112,-182')+hand(114,-174),{t:'rotate(18 0 -126)'}),{t:'translate(430,880)'});
  return `
   ${P('M1020,800 C1180,560 1480,540 1700,640 C1800,690 1880,760 1920,790',{w:5,c:'draw',st:'--d:1.4s'})}
   ${G(hatch(26,1150,1700,640,800,'#b9b2a6',5),{c:'fade',st:'--w:1s'})}
   ${G(G(herd,{c:'drift',st:'--a:-34px;--d:14s'}),{c:'fade',st:'--w:1.2s;--d:1.2s'})}
   ${P('M0,862 C300,846 600,876 960,858 C1300,842 1600,868 1920,852',{w:5,c:'draw',st:'--d:1.2s'})}
   ${P('M80,960 h140 M1260,1000 h220 M1560,940 h120',{w:3,o:.5})}
   ${tufts}${tr}${hero}
   ${note(760,765,'киік ізі',[800,782,850,820,815,905],2.6)}
   ${note(1120,470,'киіктер үйірі',[1240,485,1300,500,1320,550],1.8,{size:40})}
   ${note(110,150,'2 күн бойы нәр татпадық…',null,.4,{size:52})}`;
}

function s2a(){
  srand(21); let tracks=''; for(let i=0;i<7;i++){tracks+=G(hoof('#4b4038'),{t:`translate(${1150+i*80},${r1(955-i*8+(i%2?10:-10))}) rotate(80) scale(1.2)`,c:'wash',st:`--w:${r1(.5+i*.35)}s`})}
  let puddles=''; [[560,980,90],[1450,1010,120],[1040,1045,70]].forEach(([x,y,rx],i)=>{puddles+=`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${r1(rx*.22)}" fill="#b6cbe0" stroke="${INK}" stroke-width="4"/>`+
    `<ellipse class="ripple" style="--w:${i*.5}s" cx="${x-20}" cy="${y}" rx="${r1(rx*.35)}" ry="${r1(rx*.09)}" fill="none" stroke="#4d7aa3" stroke-width="3"/>`});
  let drips=''; [[920,445,0],[1000,450,.5],[960,452,1]].forEach(([x,y,w])=>drips+=`<path class="fall" style="--w:${w}s;--x:0px;--y:90px" d="M${x},${y} q-7,14 0,18 q7,-4 0,-18Z" fill="#4d7aa3"/>`);
  const hero=G(G(legs()+tunic()+arm('M-52,-288 Q-20,-212 34,-224')+arm('M52,-288 Q20,-206 -34,-216')+hand(36,-226)+hand(-36,-218)+head(0,-410,105,'worried',[0,-.12])+
     P('M-150,-470 q-20,-30 0,-60 M150,-470 q20,-30 0,-60',{s:'#4a90c2',w:5,c:'glow'}),{c:'shiver'}),{t:'translate(960,905)'});
  return `<rect width="1920" height="1080" fill="#eaeef2"/>
   <path d="M0,868 C300,852 600,880 960,864 C1300,850 1600,872 1920,858 L1920,1080 L0,1080Z" fill="#d9dcdf" stroke="${INK}" stroke-width="5"/>
   <path d="M1420,1080 C1480,990 1640,940 1920,905 L1920,1080Z" fill="#8fb6d8" stroke="${INK}" stroke-width="5"/>
   ${G(P('M1500,1040 q30,-14 60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0 M1560,990 q30,-14 60,0 t60,0 t60,0 t60,0 t60,0 t60,0',{s:'#3f6f99',w:4}),{c:'wave'})}
   ${note(1890,880,'өзен тасып жатыр',null,2.2,{size:40,fill:'#2f6f9f',anchor:'end'})}
   ${puddles}${tracks}
   ${G(fire(300,900,.8),{c:'dying'})}${smoke(300,780,3,'#7e848a',7)}
   ${note(170,700,'от сөнуге шақ',[260,712,300,740,300,770],2.8,{size:40})}
   ${spear(1050,905,1290,890)}
   ${hero}${drips}
   ${cloud(260,70,1.4,'#9aa4ad','drift','--a:60px;--d:9s')}${cloud(820,40,1.6,'#8e98a2','drift','--a:-50px;--d:11s')}${cloud(1450,80,1.5,'#9aa4ad','drift','--a:40px;--d:10s')}
   ${rain(170,{op:.55,d:.55})}
   ${note(960,300,'Сіз қамауда қалдыңыз',null,4,{size:58,font:HEAD_FONT,wt:700,anchor:'middle'})}`;
}

function s3(){
  const left=`<rect width="960" height="1080" fill="#fbf3e8"/>
    <rect y="900" width="960" height="180" fill="#efe1cc"/>${P('M0,900 H960',{w:5})}
    <rect x="110" y="150" width="320" height="300" fill="#cfdeeb"/>
    ${G(rain(40,{W:420,op:.6,d:.6}),{clip:'s3w'})}
    <rect x="110" y="150" width="320" height="300" fill="none" stroke="${INK}" stroke-width="8"/>${P('M270,150 V450 M110,300 H430',{w:6})}
    <rect x="96" y="450" width="348" height="18" rx="6" fill="#e0cfb6" stroke="${INK}" stroke-width="5"/>
    <ellipse class="glow" cx="840" cy="470" rx="130" ry="110" fill="#ffe08a" opacity=".45"/>
    ${P('M840,900 V520 M800,900 h80',{w:6})}<path d="M790,520 H890 L866,430 H814Z" fill="#f2c14e" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
    <rect x="150" y="560" width="600" height="180" rx="40" fill="#5f8ca3" stroke="${INK}" stroke-width="7"/>
    <rect x="128" y="700" width="644" height="120" rx="30" fill="#6d9ab1" stroke="${INK}" stroke-width="7"/>
    <rect x="96" y="620" width="96" height="200" rx="40" fill="#5f8ca3" stroke="${INK}" stroke-width="7"/>
    <rect x="708" y="620" width="96" height="200" rx="40" fill="#5f8ca3" stroke="${INK}" stroke-width="7"/>
    ${P('M170,820 l-6,60 M730,820 l6,60',{w:9})}
    <path d="M378,548 Q450,528 522,548 L548,730 L352,730Z" fill="#c8553d" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
    ${P('M372,710 H528 M368,720 H532',{s:'#8f3524',w:3})}
    <clipPath id="s3b"><path d="M340,585 C292,655 292,770 322,812 L612,812 C628,748 608,660 566,612 C522,668 418,676 340,585Z"/></clipPath>
    <path d="M340,585 C292,655 292,770 322,812 L612,812 C628,748 608,660 566,612 C522,668 418,676 340,585Z" fill="#e9c46a"/>
    ${G(P('M280,640 H640 M280,700 H640 M280,760 H640 M360,560 V820 M440,560 V820 M520,560 V820',{s:'#c48d1f',w:8,o:.8}),{clip:'s3b'})}
    <path d="M340,585 C292,655 292,770 322,812 L612,812 C628,748 608,660 566,612 C522,668 418,676 340,585Z" fill="none" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
    ${smoke(486,566,3,'#9aa0a6',5)}
    <rect x="460" y="572" width="54" height="62" rx="8" fill="#fff" stroke="${INK}" stroke-width="6"/>${P('M514,586 q24,4 0,30',{w:6})}
    ${hand(456,618)}${hand(516,622)}
    ${head(450,452,95,'calm',[.05,0])}
    ${T(60,100,'Бүгін',{font:HEAD_FONT,size:46})}`;
  const right=`<rect x="960" width="960" height="1080" fill="#c9c1b4"/>
    ${hatch(60,980,1900,40,840,'#a39a8c',9)}
    <path d="M1460,880 C1450,600 1530,330 1668,320 C1806,312 1882,560 1900,880Z" fill="#e6edf3"/>
    ${G(rain(70,{op:.6,d:.6}),{clip:'s3m'})}
    <path d="M1460,880 C1450,600 1530,330 1668,320 C1806,312 1882,560 1900,880Z" fill="none" stroke="${INK}" stroke-width="7"/>
    <path d="M960,880 H1920 V1080 H960Z" fill="#b5ac9c"/>${P('M960,880 H1920',{w:5})}
    ${[[1120,40,0],[1300,30,.7],[1080,60,1.3]].map(([x,y,w])=>`<path class="fall" style="--w:${w}s;--x:0px;--y:520px;--d:1.8s" d="M${x},${y} q-8,16 0,20 q8,-4 0,-20Z" fill="#4d7aa3"/>`).join('')}
    ${G(`<path d="M1110,640 C1058,720 1040,820 1050,900 L1350,900 C1360,820 1342,720 1290,640 C1250,612 1150,612 1110,640Z" fill="${FUR}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`+
       P('M1110,720 l10,10 M1160,700 l10,10 M1250,720 l10,10 M1300,780 l10,10 M1090,820 l10,10 M1210,830 l10,10',{s:FURD,w:4})+
       hand(1160,668)+hand(1240,668)+head(1200,560,95,'worried',[0,.06]),{c:'shiver'})}
    ${P('M1050,610 q-30,40 0,80 M1015,590 q-42,60 0,120 M1350,610 q30,40 0,80 M1385,590 q42,60 0,120',{s:'#3f87c2',w:6,c:'glow'})}
    ${T(1000,100,'50 000 жыл бұрын',{font:HEAD_FONT,size:46})}`;
  return `<defs>${clipRect('s3L',0,0,960,1080)}${clipRect('s3R',960,0,960,1080)}${clipRect('s3w',110,150,320,300)}
    <clipPath id="s3m"><path d="M1460,880 C1450,600 1530,330 1668,320 C1806,312 1882,560 1900,880Z"/></clipPath></defs>
    ${G(G(left,{clip:'s3L'}),{c:'fade'})}${G(G(right,{clip:'s3R'}),{c:'fade',st:'--w:.9s'})}
    ${P('M960,0 L955,270 L965,540 L954,810 L960,1080',{w:10,c:'draw',st:'--d:.9s'})}`;
}

function s2b(){
  const panel=(i,x,title,sub,inner,delay)=>{const id='s2bp'+i;
    return G(`<rect x="${x}" y="150" width="540" height="820" rx="28" fill="#fff"/>`+
      G(G(inner,{t:`translate(${x},150)`}),{clip:id})+
      `<rect x="${x}" y="150" width="540" height="820" rx="28" fill="none" stroke="${INK}" stroke-width="7"/>`+
      `<rect x="${x+18}" y="168" width="504" height="112" rx="16" fill="#fff" opacity=".92"/>`+
      T(x+36,222,title,{font:HEAD_FONT,size:36})+T(x+36,266,sub,{size:36,fill:'#4a525a'}),{c:'pop',st:`--w:${delay}s`})};
  const cold=rain(60,{W:540,op:.6,d:.5,seed:3})+
    G(G(legs()+tunic()+arm('M-52,-288 Q-20,-212 34,-224')+arm('M52,-288 Q20,-206 -34,-216')+hand(36,-226)+hand(-36,-218)+head(0,-410,105,'worried'),{c:'shiver-hard'}),{t:'translate(320,800) scale(.78)'})+
    P('M110,520 q-34,50 0,100 M80,495 q-50,75 0,150 M430,520 q34,50 0,100 M460,495 q50,75 0,150',{s:'#2f7fc0',w:6,c:'glow',st:'--d:.9s'})+
    T(30,360,'×25',{font:HEAD_FONT,size:76,fill:'#2f78b7'})+
    `<rect x="440" y="320" width="34" height="200" rx="17" fill="#fff" stroke="${INK}" stroke-width="5"/>`+
    `<rect class="drain" x="450" y="350" width="14" height="160" rx="7" fill="#2f78b7"/>`+
    `<circle cx="457" cy="536" r="30" fill="#2f78b7" stroke="${INK}" stroke-width="5"/>`;
  const caveD='M120,820 C120,560 200,470 290,470 C390,470 440,580 440,820Z';
  const flood=`<path d="M0,340 C120,260 250,170 540,200 L540,820 L0,820Z" fill="#e2ddd4" stroke="${INK}" stroke-width="5"/>`+
    hatch(26,40,520,260,460,'#b3ab9e',4)+
    P('M20,352 C90,336 140,386 200,404 C240,418 262,444 282,472',{s:'#4f8fcb',w:11,c:'flow'})+
    P('M520,250 C470,300 420,360 400,470',{s:'#4f8fcb',w:9,c:'flow'})+
    `<path d="${caveD}" fill="#3a352f" stroke="${INK}" stroke-width="6"/>`+
    `<clipPath id="s2bc"><path d="${caveD}"/></clipPath>`+
    G(G(head(0,-330,100,'scared',[0,0],true)+tunic(74)+seatedLegs(),{t:'translate(285,740) scale(.52)'})+
      G(`<path d="M80,1120 V870 q30,-16 60,0 t60,0 t60,0 t60,0 t60,0 t60,0 V1120Z" fill="#4f8fcb" opacity=".9" stroke="${INK}" stroke-width="5"/>`,{c:'flood'}),{clip:'s2bc'})+
    rain(45,{W:540,op:.5,d:.55,seed:5});
  const pred=`<rect width="540" height="820" fill="#1f1c19"/>`+
    `<path d="M0,250 C80,240 140,330 152,480 C158,600 122,720 112,820 L0,820Z" fill="#5c6670"/>`+
    `<clipPath id="s2bm"><path d="M0,250 C80,240 140,330 152,480 C158,600 122,720 112,820 L0,820Z"/></clipPath>`+
    G(rain(16,{W:160,op:.6,d:.55,col:'#c8d3dc',seed:8}),{clip:'s2bm'})+
    `<filter id="s2bf" x="-1" y="-1" width="3" height="3"><feGaussianBlur stdDeviation="9"/></filter>`+
    P('M330,470 C320,420 340,370 380,360 L392,330 L410,358 L440,358 L456,330 L466,362 C500,380 510,430 496,470 C540,480 560,520 540,560',{s:'#3a332c',w:5})+
    `<g fill="#2b2622">${[[350,520],[400,540],[470,520],[430,590],[370,600],[500,600]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="9"/>`).join('')}</g>`+
    G(`<ellipse cx="392" cy="420" rx="22" ry="12" fill="#ff2d20" filter="url(#s2bf)"/><ellipse cx="452" cy="420" rx="22" ry="12" fill="#ff2d20" filter="url(#s2bf)"/>`+
      `<path class="blink" d="M378,420 Q392,408 406,420 Q392,430 378,420Z" fill="#ff5a3c"/><path class="blink" d="M438,420 Q452,408 466,420 Q452,430 438,420Z" fill="#ff5a3c"/>`,{c:'fade',st:'--w:3.6s;--d:1.4s'})+
    G(legs()+tunic()+arm('M-52,-288 Q-80,-230 -70,-170')+arm('M52,-288 Q80,-230 70,-170')+hand(-70,-166)+hand(70,-166)+head(0,-410,105,'worried',[-.05,0]),{t:'translate(210,800) scale(.62)'});
  return `<rect width="1920" height="1080" fill="#eef1f4"/>${rain(110,{op:.3,d:.6,seed:12})}
    <defs>${clipRect('s2bp1',70,150,540,820,28)}${clipRect('s2bp2',690,150,540,820,28)}${clipRect('s2bp3',1310,150,540,820,28)}</defs>
    ${T(960,100,'50 000 жыл бұрын жаңбырдың 3 қаупі',{font:HEAD_FONT,size:44,anchor:'middle',c:'fade'})}
    ${panel(1,70,'1 · Суық','дене 25 есе тез суиды',cold,.4)}
    ${panel(2,690,'2 · Су тасқыны','сел үңгірді басады',flood,1.6)}
    ${panel(3,1310,'3 · Жыртқыштар','қабылан да баспана іздейді',pred,2.8)}`;
}

function s4(){
  const mouth='M0,180 C140,150 330,230 360,480 C380,650 340,800 300,860 L0,860Z';
  let gusts=''; [[120,420,0],[60,560,.6],[160,680,1.1],[90,330,1.5]].forEach(([x,y,w])=>gusts+=`<path class="gust" style="--w:${w}s" d="M${x},${y} q60,-22 120,0 t120,0 q30,-10 22,-34" fill="none" stroke="#6f8aa3" stroke-width="6" stroke-linecap="round"/>`);
  const c=.966,s=-.259; // character leans 15° toward fire
  const hero=G(legs()+G(
     arm('M52,-288 Q-20,-380 -120,-430')+hand(-120,-430)+tunic()+head(0,-410,105,'focus',[-.16,.04])+
     arm('M-52,-288 Q-130,-300 -190,-330')+hand(-190,-330),{t:'rotate(-15 0 -126)'}),{t:'translate(1350,880)'});
  const hideD='M1160,485 C1040,420 900,470 850,600 C820,690 840,800 880,855 L935,852 C905,780 905,690 940,630 C990,560 1060,580 1118,610Z';
  const hide=G(G(`<path d="${hideD}" fill="${FUR}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`+
     P('M900,560 l10,12 M880,660 l10,12 M890,760 l10,12 M960,520 l10,12 M1040,500 l10,12 M920,820 l8,10',{s:FURD,w:4})+
     [[870,560],[855,700],[870,800]].map(([x,y])=>`<path class="fall" style="--w:${(x%3)*.4}s;--x:-8px;--y:70px" d="M${x},${y} q-6,12 0,16 q6,-4 0,-16Z" fill="#4d7aa3"/>`).join(''),{c:'billow'}),{c:'raise'});
  const fungus=G(`<path d="M-80,0 C-84,-70 84,-70 80,0 C40,10 -40,10 -80,0Z" fill="#c9a27a" stroke="${INK}" stroke-width="6"/>`+
     P('M-62,-14 C-40,-46 40,-46 62,-14 M-44,-30 C-20,-50 20,-50 44,-30',{s:'#8a6a44',w:4})+
     `<ellipse class="glow" style="--d:.9s" cx="0" cy="-20" rx="16" ry="9" fill="#ff7a1a"/>`+smoke(0,-34,3,'#8b8f94',6),{t:'translate(1620,870) scale(1.2)'});
  return `<rect width="1920" height="1080" fill="#cfc7ba"/>${hatch(70,380,1900,40,800,'#a99f90',14)}
    <ellipse class="glow" cx="1100" cy="760" rx="560" ry="330" fill="#ffd9a0" opacity=".35"/>
    <path d="${mouth}" fill="#eef3f7"/>${G(rain(70,{op:.6,d:.55,seed:4}),{clip:'s4m'})}
    <path d="${mouth}" fill="none" stroke="${INK}" stroke-width="7"/>
    <path d="M0,860 C400,850 900,872 1920,856 V1080 H0Z" fill="#ddd5c8" stroke="${INK}" stroke-width="5"/>
    <defs><clipPath id="s4m"><path d="${mouth}"/></clipPath></defs>
    ${gusts}
    ${fire(1080,870,1.05,'fight')}
    ${hide}${hero}${fungus}
    ${note(1890,640,'қу саңырауқұлақ — табиғи оттық',[1620,660,1640,720,1630,780],2.2,{size:42,anchor:'end'})}
    ${note(420,330,'жел мен жаңбыр',[450,345,520,400,560,470],1.2,{size:40,fill:'#3d5f7e'})}`;
}

function s5(){
  const matD='M350,965 L1040,965 L985,885 L415,885Z';
  srand(17); let leaves=''; for(let i=0;i<7;i++){const x=r1(440+rnd()*520),y=r1(905+rnd()*45),a=r1(rnd()*160-80);leaves+=`<path transform="translate(${x},${y}) rotate(${a})" d="M-16,0 Q0,-12 16,0 Q0,12 -16,0Z" fill="#6f9a4f" stroke="${INK}" stroke-width="3"/>`}
  let shav=''; [[742,770,0],[728,776,.4],[756,766,.8],[736,772,1.1]].forEach(([x,y,w])=>shav+=`<rect class="fall" style="--w:${w}s;--x:${-6+w*8}px;--y:110px" x="${x}" y="${y}" width="7" height="4" fill="#efe6d2" stroke="${INK}" stroke-width="1.5"/>`);
  const rope=[70,56,42,28].map((rx,i)=>`<ellipse cx="0" cy="${-i*6}" rx="${rx}" ry="${r1(rx*.36)}" fill="none" stroke="${INK}" stroke-width="15"/><ellipse cx="0" cy="${-i*6}" rx="${rx}" ry="${r1(rx*.36)}" fill="none" stroke="#b58a52" stroke-width="8" stroke-dasharray="7 5"/>`).join('')+
    P('M70,0 C110,10 130,30 170,24',{w:15})+P('M70,0 C110,10 130,30 170,24',{s:'#b58a52',w:8});
  const hero=G(seatedLegs()+tunic(74)+head(0,-330,100,'focus',[.14,.22])+
      arm('M-52,-214 Q-90,-140 -38,-108')+hand(-38,-106),{t:'translate(690,900)'})+
    `<path d="M630,806 L816,742 L823,749 L637,813Z" fill="#f4ecd8" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><ellipse cx="646" cy="805" rx="5" ry="2.5" fill="${INK}" transform="rotate(-19 646 805)"/>`+
    shav+
    G(arm('M742,686 Q800,740 770,770')+hand(772,774)+`<path d="M760,752 L792,744 L786,772Z" fill="#8d9096" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`,{c:'carve'})+
    P('M806,500 l28,-16 M812,540 l32,0 M806,580 l28,16',{w:5,c:'glow',st:'--d:1s'});
  return `<rect width="1920" height="1080" fill="#d6cfc3"/>${hatch(70,40,1880,40,780,'#b2a899',21)}
    <ellipse class="glow" cx="1320" cy="780" rx="620" ry="380" fill="#ffd9a0" opacity=".35"/>
    <path d="M0,880 C500,870 1100,888 1920,872 V1080 H0Z" fill="#e2dbcf" stroke="${INK}" stroke-width="5"/>
    <defs><clipPath id="s5mat"><path d="${matD}"/></clipPath></defs>
    <path d="${matD}" fill="#c9c06e"/>
    ${G(P(Array.from({length:30},(_,i)=>`M${330+i*26},965 l60,-80 M${330+i*26},885 l60,80`).join(' '),{s:'#968d3d',w:5}),{clip:'s5mat'})}
    <path d="${matD}" fill="none" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
    ${leaves}${hero}
    ${G(rope,{t:'translate(1080,905)'})}
    ${fire(1420,890,.9)}
    ${note(250,560,'сүйек ине',[300,575,500,640,622,790],1.4,{size:44})}
    ${note(1010,760,'ширатылған арқан',[1100,775,1110,820,1090,860],2.2,{size:42})}
    ${note(140,1040,'шөп төсеніш · 77 000 жыл бұрын',[420,1028,440,990,470,960],3,{size:42})}`;
}

function s6(){
  const ochre='#d98b3a', red='#b53b22';
  const horse=[
    'M80,135 C150,105 260,110 325,108 C360,100 378,62 398,38 C412,26 428,34 432,48 L462,96 C464,108 446,114 436,104 C420,96 406,98 398,114 C388,138 380,160 362,176 C320,200 220,205 150,190 C115,182 90,165 80,135',
    'M330,104 C345,80 360,60 380,44 M342,100 l12,-24 M356,92 l12,-24',
    'M352,180 C382,205 412,220 448,232 M330,188 C350,220 360,250 352,284',
    'M150,190 C120,220 90,240 50,252 M172,192 C172,230 182,262 198,294',
    'M82,132 C50,130 30,150 20,188'];
  const lion=[
    'M40,120 C80,95 200,95 260,110 C285,118 300,140 296,170 C290,200 250,205 200,200 C150,198 90,200 60,180 C40,165 34,140 40,120',
    Array.from({length:17},(_,i)=>{const a=i/16*Math.PI*2,rr=i%2?44:66;return `${i?'L':'M'}${r1(40+Math.cos(a)*rr)},${r1(96+Math.sin(a)*rr)}`}).join(' ')+'Z',
    'M20,96 L-4,110 L20,120 M28,82 l8,2 M10,112 l14,2',
    'M80,190 L70,252 M122,198 L126,256 M222,200 L216,256 M262,190 L278,250',
    'M296,150 C330,140 346,110 330,88'];
  let t=1.0; const drawSet=(arr,col)=>arr.map(d=>{const s=P(d,{s:col,w:9,c:'draw',st:`--d:1.3s;--w:${r1(t)}s`});t+=.9;return s}).join('');
  const H=G(drawSet(horse,ochre),{t:'translate(960,190)'}); const L=G(drawSet(lion,red),{t:'translate(1420,470) scale(1.1)'});
  const handprint=G(`<ellipse cx="0" cy="0" rx="30" ry="34" fill="${red}"/>`+P('M-24,-14 l-14,-40 M-10,-28 l-4,-54 M6,-30 l6,-56 M20,-24 l14,-46 M30,8 l34,-12',{s:red,w:15}),{t:'translate(1760,170) rotate(10)',c:'fade',st:'--w:.6s',o:.75});
  const hero=G(legs()+arm('M-52,-288 Q-120,-350 -110,-430')+tunic()+head(0,-410,105,'focus',[.16,-.06]),{t:'translate(560,960)'})+
    G(`<path d="M420,520 Q450,552 480,520Z" fill="#8d8378" stroke="${INK}" stroke-width="5"/>`+
      `<ellipse class="glow" cx="450" cy="500" rx="60" ry="50" fill="#ffd36b" opacity=".5"/>`+
      `<path class="flick" d="M450,470 C462,486 468,500 460,512 C455,518 445,518 440,512 C432,500 440,486 450,470Z" fill="#ffc53d" stroke="${INK}" stroke-width="3"/>`)+hand(450,532)+
    G(arm('M612,672 Q760,600 900,560')+hand(904,558)+P('M904,558 L936,540',{s:ochre,w:10}),{c:'sway',st:'--r:-4deg;--d:1.3s'});
  return `<defs><radialGradient id="s6g" cx="450" cy="500" r="1250" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ffcf73" stop-opacity=".62"/><stop offset=".45" stop-color="#d49a4c" stop-opacity=".25"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>
    <rect width="1920" height="1080" fill="#211d19"/>
    ${hatch(80,0,1920,0,1000,'#3a332b',31)}
    <rect class="glow" style="--d:1.2s" width="1920" height="1080" fill="url(#s6g)"/>
    <path d="M0,940 C500,930 1200,950 1920,935 V1080 H0Z" fill="#2c2620" stroke="#000" stroke-width="5"/>
    ${handprint}${H}${L}${hero}
    ${T(1880,1030,'35–45 мың жыл бұрын · Франция, Индонезия',{size:40,fill:'#e7b56d',anchor:'end',c:'fade',st:'--w:9s'})}`;
}

function s7(){
  const lis=(x,y,s,w,mir)=>G(G(`<circle cx="0" cy="-150" r="38" fill="${INK}"/><path d="M-40,-108 C-50,-60 -72,-20 -82,0 L82,0 C72,-20 50,-60 40,-108Z" fill="${INK}"/>`,{c:'bob',st:`--d:2.2s;--w:${w}s;--a:-6px`}),{t:`translate(${x},${y}) scale(${mir?-s:s},${s})`});
  const L=[[560,930,.95,0],[700,800,.78,.4],[860,745,.66,.9],[1070,745,.66,.2],[1210,790,.72,.7]];
  const heads=[[560,930-150*.95],[700,800-150*.78],[860,745-150*.66],[1070,745-150*.66],[1210,790-150*.72]];
  const net=heads.map(([x,y],i)=>P(`M1360,620 L${r1(x)},${r1(y)}`,{s:'#d4701f',w:4,c:'draw',st:`--d:.8s;--w:${r1(3.4+i*.25)}s`})).join('')+
    heads.map(([x,y],i)=>`<circle class="pop" style="--w:${r1(4+i*.25)}s" cx="${r1(x)}" cy="${r1(y)}" r="12" fill="#d4701f"/>`).join('');
  const icons=[
    G(saiga(),{t:'scale(1.5) translate(10,40)'}),
    P('M0,60 V-20 M0,20 C-40,10 -60,-20 -50,-50 C-20,-40 -5,-10 0,20 M0,0 C40,-10 60,-40 50,-70 C20,-60 5,-30 0,0',{w:6,s:'#2f6b2f'})+T(60,10,'улы',{size:44,fill:'#b53b22'}),
    `<path d="M0,-70 C30,-30 46,0 46,22 C46,50 24,68 0,68 C-24,68 -46,50 -46,22 C-46,0 -30,-30 0,-70Z" fill="#7fb3e0" stroke="${INK}" stroke-width="6"/>`+T(60,20,'су',{size:46,fill:'#2f6f9f'}),
    spear(-90,60,60,-50)+G(saiga(),{t:'translate(110,60) scale(.7)'}),
    `<circle cx="0" cy="0" r="44" fill="#ffd23f" stroke="${INK}" stroke-width="6"/>`+P('M0,-62 v-22 M0,62 v22 M-62,0 h-22 M62,0 h22 M44,-44 l16,-16 M-44,44 l-16,16 M44,44 l16,16 M-44,-44 l-16,-16',{w:6})+T(80,16,'аңыз',{size:44})
  ].map((g,i)=>G(G(g,{c:'cycle',st:`--w:${i*2}s`}),{t:'translate(1385,250)'})).join('');
  const hero=G(seatedLegs()+tunic(74)+
     G(arm('M52,-214 Q120,-250 150,-330')+hand(152,-334),{c:'gest',st:'transform-origin:0 100%;--r:-24deg'})+
     head(0,-330,100,'happy',[-.16,0])+
     G(arm('M-52,-214 Q-120,-190 -170,-215')+hand(-175,-218),{c:'gest',st:'transform-origin:100% 50%;--r:8deg;--d:1.6s'}),{t:'translate(1360,940) scale(.95)'});
  return `<rect width="1920" height="1080" fill="#fdfaf5"/>
    <path d="M0,0 H1920 V1080 H1800 C1800,600 1600,180 960,170 C320,180 120,600 120,1080 H0Z" fill="#c9c1b4" stroke="${INK}" stroke-width="7"/>
    <ellipse class="glow" cx="960" cy="860" rx="720" ry="330" fill="#ffdca8" opacity=".5"/>
    <path d="M120,1000 C600,980 1300,990 1800,1000 V1080 H120Z" fill="#e8dfd0"/>
    ${L.map(a=>lis(...a)).join('')}
    ${fire(960,930,1.1)}
    ${net}${hero}
    <path d="${CLOUD}" transform="translate(1385,250) scale(1.15)" fill="#fff" stroke="${INK}" stroke-width="5"/>
    <circle cx="1330" cy="480" r="16" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="1352" cy="420" r="24" fill="#fff" stroke="${INK}" stroke-width="5"/>
    ${icons}
    ${note(200,250,'алғашқы «әлеуметтік желі»',null,3.6,{size:52,fill:'#a3530f'})}`;
}

function s8(){
  let rays=''; for(let i=0;i<12;i++){const a=i*Math.PI/6;rays+=`M${r1(Math.cos(a)*95)},${r1(Math.sin(a)*95)} L${r1(Math.cos(a)*140)},${r1(Math.sin(a)*140)} `}
  let tracks=''; for(let i=0;i<9;i++){const t=i/8,x=r1(820+t*700),y=r1(1010-t*90+(i%2?12:-12)),s=r1(1.6-t*.6);tracks+=G(G(hoof('#5a3d22'),{c:'pop',st:`--w:${r1(1.4+i*.18)}s`}),{t:`translate(${x},${y}) rotate(82) scale(${s})`})}
  let termites=''; for(let i=0;i<8;i++)termites+=`<ellipse cx="${1700+i*24}" cy="${r1(1000+(i%2)*8)}" rx="7" ry="4" fill="#6b4a2b"/>`;
  const hero=G(G(legs()+arm('M-52,-288 Q-80,-250 -86,-210')+spear(-110,60,-66,-520)+hand(-86,-210)+tunic()+head(0,-410,105,'happy',[.14,.1])+
     arm('M52,-288 Q100,-300 130,-350')+hand(132,-356),{c:'bob',st:'--d:.9s;--a:-10px'}),{t:'translate(640,905)'});
  return `<rect width="1920" height="1080" fill="#f4f9fd"/>
    ${P('M560,860 A560,560 0 0 1 1680,860',{s:'#e4572e',w:14,c:'draw',o:.35,st:'--d:2s;--w:2s'})}
    ${P('M590,860 A530,530 0 0 1 1650,860',{s:'#ffd23f',w:14,c:'draw',o:.4,st:'--d:2s;--w:2.2s'})}
    ${P('M620,860 A500,500 0 0 1 1620,860',{s:'#3f87c2',w:14,c:'draw',o:.3,st:'--d:2s;--w:2.4s'})}
    <g transform="translate(1600,200)">${G(P(rays,{s:'#e0a800',w:8}),{c:'sunrays'})}<circle r="80" fill="#ffd23f" stroke="${INK}" stroke-width="7"/></g>
    ${cloud(780,150,1.5,'#c3ccd4','partL')}${cloud(1140,170,1.6,'#b8c2cb','partR')}
    <path d="M0,120 C160,100 360,180 420,420 C450,560 440,760 470,880 L0,880Z" fill="#cfc8bc" stroke="${INK}" stroke-width="7"/>
    ${hatch(20,20,380,200,820,'#a99f90',41)}
    <path d="M60,880 C60,620 140,480 250,480 C350,480 400,640 400,880Z" fill="#3a352f" stroke="${INK}" stroke-width="6"/>
    <path d="M0,872 C400,860 1000,880 1920,862 V1080 H0Z" fill="#d8c3a5" stroke="${INK}" stroke-width="5"/>
    <ellipse cx="1180" cy="1040" rx="140" ry="22" fill="#cfe3f3" stroke="${INK}" stroke-width="4"/>${P('M1120,1036 l18,0 M1200,1044 l26,0',{s:'#fff',w:5})}
    ${tracks}
    ${P('M960,900 C980,940 1010,950 1040,940 M990,925 c-10,20 -6,30 6,40',{s:'#7a5232',w:6,c:'draw',st:'--w:2.6s'})}
    ${mushroom(1150,890,1.1,2.4)}${mushroom(1215,905,.8,2.6,'#c8553d')}${mushroom(1640,885,1.2,2.8)}${mushroom(1712,898,.85,3)}${mushroom(1300,875,.7,3.2)}
    <path d="M1800,880 L1840,760 L1880,880Z" fill="#b8865a" stroke="${INK}" stroke-width="5"/>
    ${G(termites,{c:'march'})}
    ${hero}
    ${note(840,820,'анық із',[880,832,900,880,900,940],3.2,{size:42})}
    ${note(1420,780,'саңырауқұлақ',[1500,792,1560,820,1610,850],3.6,{size:42})}
    ${note(1560,1060,'термит = ақуыз',[1740,1040,1760,1020,1780,1010],4,{size:40})}`;
}

function s9(){
  const N=6, R=430; const icons=[
    fire(0,30,.32),
    `<path d="M-40,26 L36,-24 L42,-18 L-34,32Z" fill="#f4ecd8" stroke="${INK}" stroke-width="4"/>`,
    P('M-44,10 C-20,-4 20,-2 34,-6 C40,-20 46,-30 52,-26 L56,-14 M-30,14 l-10,22 M20,10 l10,22 M-44,10 l-10,-6',{s:'#c56d26',w:6}),
    [26,18,10].map(r=>`<ellipse cx="0" cy="0" rx="${r*1.6}" ry="${r*.8}" fill="none" stroke="#a07a45" stroke-width="7"/>`).join(''),
    `<path d="M-46,30 C-46,-10 -20,-36 0,-36 C20,-36 46,-10 46,30Z" fill="#3a352f" stroke="${INK}" stroke-width="5"/>`,
    G(`<path d="M-6,0 C-7,-14 -5,-22 -5,-26 L5,-26 C5,-22 7,-14 6,0Z" fill="#f4ecdc" stroke="${INK}" stroke-width="3"/><path d="M-26,-22 C-24,-46 24,-46 26,-22 C12,-18 -12,-18 -26,-22Z" fill="#d9b98c" stroke="${INK}" stroke-width="4"/>`,{t:'translate(0,20)'})
  ];
  const orbit=`<circle cx="960" cy="540" r="${R}" fill="none" stroke="#8a6a3a" stroke-width="4" stroke-dasharray="14 12"/>`+
    icons.map((ic,i)=>{const a=i*2*Math.PI/N-Math.PI/2,x=r1(960+R*Math.cos(a)),y=r1(540+R*Math.sin(a));
      return G(G(`<circle cx="0" cy="0" r="62" fill="#fff" stroke="${INK}" stroke-width="5"/>`+ic,{c:'counter'}),{t:`translate(${x},${y})`})}).join('');
  let rose=''; for(let i=0;i<8;i++){const a=i*Math.PI/4,l=i%2?150:250,b=a+Math.PI/2;rose+=`M960,540 L${r1(960+Math.cos(b)*26)},${r1(540+Math.sin(b)*26)} L${r1(960+Math.cos(a)*l)},${r1(540+Math.sin(a)*l)}Z `}
  const hero=G(legs()+vestOutfit()+
     `<path d="M-330,-330 L-160,-330 L-150,-140 L-322,-140Z" fill="#e6cf9f" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`+
     `<rect x="-344" y="-350" width="200" height="30" rx="15" fill="#d9bd85" stroke="${INK}" stroke-width="6"/><rect x="-336" y="-152" width="196" height="30" rx="15" fill="#d9bd85" stroke="${INK}" stroke-width="6"/>`+
     P('M-300,-290 h110 M-300,-262 h90 M-300,-234 h120 M-290,-196 l40,-20 l30,14 l40,-26',{s:'#7a5a2e',w:4})+
     arm('M-52,-288 Q-110,-250 -150,-226')+hand(-152,-224)+
     P('M142,-345 L168,-398',{w:16})+`<circle cx="194" cy="-452" r="56" fill="#dfeaf1" fill-opacity=".85" stroke="#4a4a4a" stroke-width="12"/>`+P('M168,-470 q14,-24 40,-26',{s:'#fff',w:7})+
     arm('M52,-288 Q112,-300 140,-342')+hand(142,-346)+
     G(head(0,-410,110,'curious'),{c:'nod'}),{t:'translate(960,1000) scale(1.08)'});
  return `<rect width="1920" height="1080" fill="#fff"/>
    <circle class="fade" cx="960" cy="540" r="470" fill="#f2e2bd"/>
    ${G(`<path d="${rose}" fill="#d9bf86" stroke="#b8955a" stroke-width="3"/>`+P('M560,420 C760,380 1160,380 1360,420 M560,660 C760,700 1160,700 1360,660 M760,140 C700,340 700,740 760,940 M1160,140 C1220,340 1220,740 1160,940',{s:'#c9a96a',w:3}),{c:'fade',st:'--w:.3s',o:.7})}
    ${G(orbit,{c:'orbit'})}
    ${hero}`;
}

