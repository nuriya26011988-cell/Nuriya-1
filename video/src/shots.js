/* Video shots in the style of the reference: colour scenes, quick cuts, sound words, white text cards.
   Depends on kit.js (P, G, T, head, tunic, legs, seatedLegs, hand, arm, spear, fire, smoke, rain, cloud, saiga, hoof, hatch, mushroom, vestOutfit, note, arrow, r1, rnd, srand). */
const C={sky1:'#4c5663',sky2:'#8a949d',rock:'#625a53',rockD:'#3d3834',rockL:'#7d746b',cave:'#2b2724',
  ground:'#cfa65b',groundW:'#8e7748',mud:'#6b4c31',grass:'#7f8a3a',water:'#4f80ae',waterL:'#7fa9cf',
  rainD:'#c9d6e2',wall:'#f0d2a2',floor:'#7a5236',sofa:'#8d9db1',blanket:'#f2c230',red:'#d2352b',leo:'#dba545'};
/* CSS animations replace the transform attribute, so a group that has both gets split in two. */
function G(inner,o={}){
  if(o.t&&o.c) return G(G(inner,{c:o.c,st:o.st}),{t:o.t,clip:o.clip,o:o.o});
  return `<g${o.t?` transform="${o.t}"`:''}${o.c?` class="${o.c}"`:''}${o.st?` style="${o.st}"`:''}${o.clip?` clip-path="url(#${o.clip})"`:''}${o.o!=null?` opacity="${o.o}"`:''}>${inner}</g>`}
const SFX_FONT="Caveat, 'PT Sans', cursive";
function sfx(x,y,txt,o={}){return G(`<text x="0" y="0" font-family="${SFX_FONT}" font-weight="700" font-size="${o.size||64}" fill="${o.fill||'#e8eef4'}" stroke="${o.stroke||'#1d2a36'}" stroke-width="${o.sw??8}" paint-order="stroke" text-anchor="middle" letter-spacing="2">${txt}</text>`,{t:`translate(${x},${y}) rotate(${o.rot||0})`,c:o.c||'pop',st:`--w:${o.w||0}s`})}
function big(x,y,txt,o={}){return `<text x="${x}" y="${y}" font-family="${SFX_FONT}" font-weight="700" font-size="${o.size||120}" fill="${o.fill||'#161616'}" text-anchor="${o.anchor||'middle'}" letter-spacing="${o.ls??3}"${o.c?` class="${o.c}"`:''} style="--w:${o.w||0}s">${txt}</text>`}
const vgrad=(id,a,b)=>`<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
const vignette=(op=.55)=>`<defs><radialGradient id="vg" cx="50%" cy="50%" r="75%"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="${op}"/></radialGradient></defs><rect width="1920" height="1080" fill="url(#vg)" pointer-events="none"/>`;
const stormSky=()=>`<defs>${vgrad('sky',C.sky1,C.sky2)}</defs><rect width="1920" height="1080" fill="url(#sky)"/>`+
  cloud(200,60,1.7,'#59636e','drift','--a:50px;--d:9s')+cloud(760,30,2,'#4c5661','drift','--a:-40px;--d:11s')+cloud(1350,70,1.8,'#5a646f','drift','--a:40px;--d:10s')+cloud(1850,40,1.6,'#505a65','drift','--a:-30px;--d:12s');

/* ---------- hero poses ---------- */
const ARMS={
  down:()=>arm('M-52,-288 Q-80,-230 -70,-170')+arm('M52,-288 Q80,-230 70,-170')+hand(-70,-166)+hand(70,-166),
  cross:()=>arm('M-52,-288 Q-20,-212 34,-224')+arm('M52,-288 Q20,-206 -34,-216')+hand(36,-226)+hand(-36,-218),
  spear:()=>arm('M-52,-288 Q-85,-250 -90,-205')+spear(-112,70,-74,-520)+hand(-90,-205)+arm('M52,-288 Q80,-230 70,-170')+hand(70,-166),
  shrug:()=>arm('M-52,-288 Q-110,-250 -150,-272')+arm('M52,-288 Q110,-250 150,-272')+hand(-154,-276)+hand(154,-276),
  point:()=>arm('M-52,-288 Q-80,-230 -70,-170')+hand(-70,-166)+arm('M52,-288 Q120,-300 186,-312')+hand(190,-313),
  up:()=>arm('M-52,-288 Q-80,-230 -70,-170')+hand(-70,-166)+arm('M52,-288 Q110,-320 132,-386')+hand(134,-390)
};
function hero(x,y,s=1,o={}){
  const body=legs()+(o.outfit==='vest'?vestOutfit():tunic())+ARMS[o.arms||'down']()+head(0,-410,105,o.mood||'curious',o.look||[0,0],o.big);
  return G(G(body,{c:o.c||'',st:o.st||''}),{t:`translate(${x},${y}) scale(${o.flip?-s:s},${s})`});
}
function heroSeat(x,y,s=1,o={}){
  const a=o.arms==='knees'?hand(-40,-120)+hand(40,-120)+arm('M-52,-214 Q-70,-160 -40,-124')+arm('M52,-214 Q70,-160 40,-124')
        :o.arms==='open'?arm('M-52,-214 Q-120,-190 -170,-215')+hand(-175,-218)+arm('M52,-214 Q120,-190 170,-215')+hand(175,-218)
        :arm('M-52,-214 Q-80,-150 -40,-110')+hand(-38,-106)+arm('M52,-214 Q80,-150 40,-110')+hand(38,-106);
  return G(G(seatedLegs()+tunic(74)+a+head(0,-330,100,o.mood||'curious',o.look||[0,0],o.big),{c:o.c||'',st:o.st||''}),{t:`translate(${x},${y}) scale(${s})`});
}
function person(x,y,s=1,o={}){ // other people: plain ink stick figures with grey heads
  const hd=`<circle cx="0" cy="-410" r="95" fill="#d8d2c6" stroke="${INK}" stroke-width="8"/>`+`<ellipse cx="-28" cy="-400" rx="7" ry="12" fill="${INK}"/><ellipse cx="28" cy="-400" rx="7" ry="12" fill="${INK}"/>`;
  return G(G(legs()+tunic()+ARMS[o.arms||'down']()+hd,{c:o.c||'',st:o.st||''}),{t:`translate(${x},${y}) scale(${s})`});
}
function leopard(x,y,s=1,o={}){
  const leg=(d)=>P(d,{w:36})+P(d,{s:C.leo,w:24});
  const run=o.run;
  const far=run?leg('M-120,-100 L-200,-30')+leg('M130,-100 L210,-40'):leg('M-110,-100 L-118,0')+leg('M140,-100 L150,0');
  const near=run?leg('M-80,-100 L-30,-10')+leg('M170,-110 L120,-20'):leg('M-70,-100 L-62,0')+leg('M180,-105 L196,0');
  let spots='';srand(o.seed||4);for(let i=0;i<16;i++){const sx=r1(-130+rnd()*300),sy=r1(-160+rnd()*80);spots+=`M${sx},${sy} a10,10 0 1 1 14,4 `}
  const headG=`<circle cx="-200" cy="-168" r="60" fill="${C.leo}" stroke="${INK}" stroke-width="7"/>`+
    `<path d="M-238,-212 L-232,-246 L-208,-224Z M-172,-222 L-160,-252 L-146,-218Z" fill="${C.leo}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`+
    `<ellipse cx="-240" cy="-148" rx="30" ry="22" fill="#f3dfae" stroke="${INK}" stroke-width="5"/><path d="M-262,-160 l14,0 l-7,10Z" fill="${INK}"/>`+
    `<path d="M-232,-190 Q-218,-202 -204,-190 Q-218,-182 -232,-190Z M-188,-192 Q-174,-204 -160,-192 Q-174,-184 -188,-192Z" fill="#e5e14a" stroke="${INK}" stroke-width="3"/>`+
    `<path d="M-219,-196 v12 M-175,-198 v12" stroke="${INK}" stroke-width="4"/>`+
    (o.fangs?`<path d="M-256,-132 l5,18 l5,-18Z M-236,-130 l5,18 l5,-18Z" fill="#fff" stroke="${INK}" stroke-width="3"/>`:'')+
    P('M-210,-140 l-30,6 M-210,-132 l-26,14',{w:2});
  return G(far+P('M200,-150 C260,-200 320,-210 330,-150',{w:30})+P('M200,-150 C260,-200 320,-210 330,-150',{s:C.leo,w:20})+
    `<ellipse cx="20" cy="-130" rx="190" ry="66" fill="${C.leo}" stroke="${INK}" stroke-width="7"/>`+P(spots,{s:'#4b3420',w:5})+near+headG,
    {t:`translate(${x},${y}) scale(${o.flip?-s:s},${s})`});
}
const rockFloor=(y=880,fill=C.rockD)=>`<path d="M0,${y} C400,${y-12} 1000,${y+14} 1920,${y-6} V1080 H0Z" fill="${fill}" stroke="${INK}" stroke-width="6"/>`;
function caveInterior(mouthD,o={}){ // dark cave seen from inside with a rainy opening
  return `<rect width="1920" height="1080" fill="${o.wall||C.rock}"/>`+hatch(90,0,1920,0,1000,'#4b443e',o.seed||5)+
   `<path d="${mouthD}" fill="${o.out||'#6e8193'}"/>`+`<clipPath id="mouth"><path d="${mouthD}"/></clipPath>`+
   G(rain(150,{op:.7,d:.5,col:C.rainD,seed:o.seed||6}),{clip:'mouth'})+
   `<path d="${mouthD}" fill="none" stroke="${INK}" stroke-width="9"/>`;
}

/* ---------- scenes ---------- */
const SC={};
SC.title=()=>stormSky()+`<path d="M0,820 C500,800 1200,830 1920,810 V1080 H0Z" fill="${C.groundW}" stroke="${INK}" stroke-width="6"/>`+
  `<path d="M1180,820 C1180,560 1300,430 1460,430 C1620,430 1720,580 1730,820Z" fill="${C.rock}" stroke="${INK}" stroke-width="8"/>`+
  `<path d="M1300,820 C1300,640 1370,560 1450,560 C1540,560 1600,650 1600,820Z" fill="${C.cave}" stroke="${INK}" stroke-width="7"/>`+
  fire(1450,820,.45)+hero(1380,830,.42,{mood:'worried',arms:'cross',c:'shiver'})+
  rain(200,{op:.6,d:.5,col:C.rainD})+
  `<rect x="140" y="250" width="1000" height="330" rx="24" fill="#fff" opacity=".92"/>`+
  big(640,385,'ЖАҢБЫР ЖАУҒАНДА',{size:110})+big(640,520,'ежелгі адамдар не істеді?',{size:84,ls:0,fill:'#8b3c14'})+vignette(.5);

function steppe(o={}){
  srand(11);let tufts='';for(let i=0;i<26;i++){tufts+=tuft(r1(rnd()*1900),r1(890+rnd()*170),1+rnd()*.6)}
  let herd='';[[1236,628,.55,0],[1298,604,.6,.3],[1362,593,.58,.6],[1424,588,.6,.15],[1486,587,.55,.45],[1540,596,.5,.7]]
    .forEach(([x,y,s,w])=>herd+=G(G(saiga(),{c:'bob',st:`--d:.8s;--w:${w}s;--a:-5px`}),{t:`translate(${x},${y}) scale(${s})`}));
  let tr='';for(let i=0;i<9;i++){const t=i/8,x=r1(650+t*540),y=r1(985-t*105+(i%2?13:-13)*(1-t*.5)),s=r1(1.45-t*.75);tr+=G(hoof('#3d2b18'),{t:`translate(${x},${y}) rotate(78) scale(${s})`,c:'fade',st:`--w:${r1(.3+i*.15)}s`})}
  const hunger=G(P('M88,-234 q12,10 0,22 M102,-244 q17,17 0,38 M-88,-234 q-12,10 0,22 M-102,-244 q-17,17 0,38',{w:5}),{c:'shiver'});
  const h=G(legs()+G(arm('M-52,-288 Q-85,-262 -91,-212')+spear(-120,90,-62,-520)+hand(-91,-212)+tunic()+hunger+head(0,-410,105,o.mood||'focus',[.12,.12])+arm('M52,-288 Q102,-240 112,-182')+hand(114,-174),{t:'rotate(18 0 -126)'}),{t:'translate(430,880)'});
  return `<defs>${vgrad('sk','#bcd6e6','#eef4ec')}</defs><rect width="1920" height="1080" fill="url(#sk)"/>`+
   `<circle cx="300" cy="170" r="70" fill="#f6dc7a" opacity=".8"/>`+
   `<path d="M1020,800 C1180,560 1480,540 1700,640 C1800,690 1880,760 1920,790 V900 H1020Z" fill="#b99450" stroke="${INK}" stroke-width="6"/>`+
   G(G(herd,{c:'drift',st:'--a:-34px;--d:14s'}),{})+
   `<path d="M0,862 C300,846 600,876 960,858 C1300,842 1600,868 1920,852 V1080 H0Z" fill="${C.ground}" stroke="${INK}" stroke-width="6"/>`+
   tufts+tr+h+(o.sfx?sfx(560,560,'ШҰРЫЛ-ШҰРЫЛ…',{size:60,fill:'#fff3d6',stroke:'#5a3a1e',rot:-8,w:.6}):'');
}
SC.hungry=()=>steppe({sfx:1});
SC.steppe=()=>steppe();

function storm(o={}){
  let g=stormSky()+`<path d="M0,862 C300,846 600,876 960,858 C1300,842 1600,868 1920,852 V1080 H0Z" fill="${C.groundW}" stroke="${INK}" stroke-width="6"/>`;
  [[520,980,110],[1450,1010,140],[1040,1045,80]].forEach(([x,y,rx],i)=>g+=`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${r1(rx*.2)}" fill="${C.waterL}" stroke="${INK}" stroke-width="4"/><ellipse class="ripple" style="--w:${i*.5}s" cx="${x-20}" cy="${y}" rx="${r1(rx*.35)}" ry="${r1(rx*.08)}" fill="none" stroke="#e8f1f8" stroke-width="3"/>`);
  if(o.flash)g+=`<rect class="flash" width="1920" height="1080" fill="#fff"/>`+P('M1500,0 L1440,160 L1490,170 L1400,360',{s:'#fff6b0',w:12,c:'flash'});
  g+=hero(960,905,1,{mood:'worried',arms:'cross',look:[0,-.12],c:o.hard?'shiver-hard':'shiver'});
  g+=[[120,420,0],[60,560,.6],[160,680,1.1],[90,330,1.5],[300,760,.9]].map(([x,y,w])=>`<path class="gust" style="--w:${w}s;--d:1.4s" d="M${x},${y} q60,-22 120,0 t120,0 q30,-10 22,-34" fill="none" stroke="#dbe6ee" stroke-width="7" stroke-linecap="round"/>`).join('');
  g+=rain(o.n||220,{op:.7,d:.45,col:C.rainD,w:3.5});
  return g+(o.words||'')+vignette(.45);
}
SC.downpour=()=>storm({flash:1,words:sfx(420,300,'ГҮРС!',{size:120,rot:-10,w:.3})+sfx(1500,520,'ШАР-ШАР…',{size:70,rot:6,w:1})});
SC.wind=()=>storm({hard:1,n:280,words:sfx(1400,300,'УУУУУ…',{size:90,rot:-6,w:.2})+sfx(560,640,'дір-дір',{size:58,rot:8,w:.9})});
SC.daynight=()=>{const col=(x,a,b,ico,lab,w)=>G(`<defs>${vgrad('g'+x,a,b)}</defs><rect x="${x}" y="0" width="640" height="1080" fill="url(#g${x})"/>`+ico+
    G(rain(70,{W:640,op:.7,d:.5,col:C.rainD,seed:x+3}),{t:`translate(${x},0)`,clip:'c'+x})+
    `<clipPath id="c${x}"><rect x="${x}" width="640" height="1080"/></clipPath>`+
    `<rect x="${x}" y="880" width="640" height="200" fill="${C.groundW}"/>`+big(x+320,820,lab,{size:96,fill:'#fff'}),{c:'fade',st:`--w:${w}s`});
  return col(0,'#6c7783','#9aa3ab',cloud(320,220,1.3,'#59636e'),'КҮНДІЗ',0)+col(640,'#141b2e','#36415a',`<circle cx="960" cy="230" r="70" fill="#f2efd8" stroke="${INK}" stroke-width="6"/>`+cloud(1010,280,1,'#2e3648'),'ТҮНДЕ',.9)+
    col(1280,'#8e8f9c','#d1b6a8',cloud(1600,220,1.3,'#7a7b88'),'ТАҢЕРТЕҢ',1.8)+P('M640,0 V1080 M1280,0 V1080',{w:10})+P('M0,880 H1920',{w:6})+vignette(.3)};
SC.washTracks=()=>{let g=`<rect width="1920" height="1080" fill="${C.mud}"/>`+hatch(60,0,1920,0,1080,'#5a3e27',8);
  for(let i=0;i<6;i++){const x=260+i*270,y=i%2?460:640;g+=G(G(hoof('#2b1c10'),{c:'wash',st:`--w:${r1(.2+i*.4)}s`}),{t:`translate(${x},${y}) rotate(80) scale(5)`})}
  [[400,560,240],[1300,620,300],[900,820,200]].forEach(([x,y,rx],i)=>g+=`<ellipse class="pop" style="--w:${1+i*.8}s" cx="${x}" cy="${y}" rx="${rx}" ry="${r1(rx*.32)}" fill="${C.water}" opacity=".85"/>`);
  return g+rain(200,{op:.75,d:.42,col:C.rainD,w:4})+sfx(960,240,'ІЗДЕР ЖОҒАЛДЫ',{size:96,fill:'#fff',stroke:'#2b1c10',w:2.2})+vignette(.5)};
SC.slip=()=>{const rocks=[[300,900,300],[800,940,260],[1300,910,320],[1750,950,240]].map(([x,y,r])=>`<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r1(r*.4)}" fill="#7b7c80" stroke="${INK}" stroke-width="7"/><path d="M${x-r*.6},${y-r*.25} q${r*.5},-${r*.15} ${r},0" stroke="#e9f1f8" stroke-width="8" fill="none" opacity=".8" stroke-linecap="round"/>`).join('');
  return stormSky()+rocks+G(hero(0,0,.9,{mood:'scared',arms:'shrug',big:1}),{t:'translate(900,840) rotate(-28)',c:'pop'})+
   P('M780,880 q40,-40 80,0',{s:'#fff',w:6,c:'draw'})+`<circle class="glow" cx="972" cy="830" r="26" fill="${C.red}" opacity=".7"/>`+
   sfx(1250,420,'ТАЙҒАҚ!',{size:110,rot:8,w:.3,fill:'#ffe9a8'})+sfx(980,690,'шық!',{size:60,w:.8})+rain(160,{op:.6,d:.45,col:C.rainD})+vignette(.45)};
SC.ankle=()=>`<rect width="1920" height="1080" fill="#fff"/>`+big(960,300,'ТОБЫҚ ТАЙДЫ',{size:120,c:'fade'})+big(960,470,'=',{size:140,c:'fade',w:.6})+
  big(960,680,'АЖАЛ',{size:200,fill:C.red,c:'pop',w:1.1})+
  G(`<path d="M-60,-40 L-60,140 C-60,170 -40,180 0,180 L120,180 C150,180 150,140 120,130 L40,110 L40,-40Z" fill="#fff" stroke="${INK}" stroke-width="8"/><circle cx="20" cy="110" r="34" fill="${C.red}" opacity=".6"/>`,{t:'translate(400,560)',c:'fade',st:'--w:.4s'})+
  P('M1500,520 l80,80 M1580,520 l-80,80',{s:C.red,w:16,c:'draw',st:'--w:1.4s;--d:.5s'});
SC.river=()=>{let g=stormSky()+`<path d="M0,700 C400,690 800,720 1200,700 C1500,690 1700,710 1920,700 V1080 H0Z" fill="${C.groundW}" stroke="${INK}" stroke-width="6"/>`+
   `<path d="M0,790 C500,760 1100,800 1920,770 V1080 H0Z" fill="${C.water}" stroke="${INK}" stroke-width="7"/>`;
  for(let k=0;k<4;k++)g+=G(P(Array.from({length:22},(_,i)=>`M${i*120-120+(k%2)*60},${830+k*60} q30,-18 60,0 t60,0`).join(' '),{s:'#d7e6f2',w:5}),{c:'wave',st:`animation-duration:${1.2-k*.15}s`});
  g+=G(`<path d="M0,790 C500,760 1100,800 1920,770 V700 C1400,690 800,720 0,700Z" fill="${C.water}" opacity=".7"/>`,{c:'fade',st:'--w:1s;--d:3s'});
  g+=`<rect x="1500" y="560" width="26" height="160" fill="#6b4a2e" stroke="${INK}" stroke-width="5"/><path d="M1440,600 L1513,420 L1586,600Z" fill="#4f6a35" stroke="${INK}" stroke-width="6"/>`;
  g+=hero(420,700,.55,{mood:'scared',arms:'shrug',big:1})+sfx(1100,450,'ӨЗЕН ТАСЫДЫ',{size:96,w:.8});
  return g+rain(200,{op:.65,d:.45,col:C.rainD})+vignette(.45)};
SC.dyingFire=()=>caveInterior('M1500,0 C1560,200 1700,260 1920,240 V0Z')+rockFloor(860)+
  `<ellipse class="glow" cx="960" cy="820" rx="520" ry="260" fill="#ffb347" opacity=".25"/>`+G(fire(960,880,1.5),{c:'dying'})+smoke(960,700,4,'#9aa0a6',9)+
  heroSeat(1380,900,.95,{mood:'worried',arms:'knees',look:[-.15,.1],c:'shiver'})+sfx(620,420,'тыс-с-с…',{size:70,w:2.5,fill:'#ffd9a8',stroke:'#3d2a1a'})+vignette(.7);
SC.trapped=()=>caveInterior('M900,880 C860,560 1000,240 1320,220 C1640,200 1820,520 1840,880Z',{seed:9})+rockFloor(880)+
  heroSeat(640,900,1,{mood:'worried',arms:'knees',look:[.18,0]})+
  sfx(1360,520,'тырс-тырс',{size:64,w:.5})+sfx(1500,700,'шар-шар…',{size:60,w:1.1})+
  `<rect x="300" y="110" width="760" height="150" rx="20" fill="#fff" opacity=".93" class="fade" style="--w:1.4s"/>`+big(680,222,'ҚАМАУДА',{size:120,c:'fade',w:1.4})+vignette(.6);

function room(o={}){
  let g=`<rect width="1920" height="1080" fill="${C.wall}"/><rect y="860" width="1920" height="220" fill="${C.floor}"/>`+P('M0,860 H1920',{w:6})+
   `<rect x="180" y="150" width="520" height="420" fill="#56677d"/>`+G(rain(60,{W:600,op:.7,d:.55,col:'#d3dfea',seed:2}),{t:'translate(160,0)',clip:'win'})+
   `<clipPath id="win"><rect x="180" y="150" width="520" height="420"/></clipPath><rect x="180" y="150" width="520" height="420" fill="none" stroke="${INK}" stroke-width="10"/>`+P('M440,150 V570',{w:8})+
   `<rect x="1450" y="190" width="300" height="200" rx="10" fill="#2f3f55" stroke="${INK}" stroke-width="9"/><rect class="glow" x="1468" y="208" width="264" height="164" fill="#7fb1d9" opacity=".5"/>`+
   `<rect x="1060" y="300" width="150" height="16" fill="#8b5a32" stroke="${INK}" stroke-width="5"/><rect x="1080" y="230" width="22" height="70" fill="#c8553d" stroke="${INK}" stroke-width="4"/><rect x="1104" y="240" width="22" height="60" fill="#3f7fb3" stroke="${INK}" stroke-width="4"/><rect x="1128" y="236" width="22" height="64" fill="#5a8f4f" stroke="${INK}" stroke-width="4"/>`+
   `<rect x="560" y="560" width="760" height="200" rx="44" fill="${C.sofa}" stroke="${INK}" stroke-width="8"/><rect x="530" y="720" width="820" height="130" rx="34" fill="#9eadc0" stroke="${INK}" stroke-width="8"/>`+
   `<rect x="490" y="640" width="110" height="230" rx="44" fill="${C.sofa}" stroke="${INK}" stroke-width="8"/><rect x="1280" y="640" width="110" height="230" rx="44" fill="${C.sofa}" stroke="${INK}" stroke-width="8"/>`+
   `<rect x="1430" y="740" width="200" height="22" fill="#8b5a32" stroke="${INK}" stroke-width="6"/>`+P('M1450,762 V860 M1610,762 V860',{w:8})+
   `<rect x="1490" y="680" width="56" height="60" rx="8" fill="#9a6a3c" stroke="${INK}" stroke-width="6"/>`;
  if(o.sleep){
    g+=`<path d="M620,720 C700,640 1000,640 1240,700 L1260,800 L620,800Z" fill="${C.blanket}" stroke="${INK}" stroke-width="8"/>`+
     `<circle cx="680" cy="640" r="95" fill="#fff" stroke="${INK}" stroke-width="7"/>`+P('M630,650 q15,12 30,0 M700,650 q15,12 30,0 M620,600 q22,-14 44,-4 M696,596 q22,-10 44,4',{w:7})+
     sfx(820,470,'ҚОР-Р-Р…',{size:90,w:.6,fill:'#fff',stroke:'#3a4b62'})+sfx(450,640,'тырс-тырс',{size:56,w:1.2});
  } else {
    g+=`<path d="M870,590 Q960,566 1050,590 L1080,800 L840,800Z" fill="#c8553d" stroke="${INK}" stroke-width="7"/>`+
     `<path d="M840,620 C780,700 780,800 810,840 L1110,840 C1130,780 1110,690 1070,640 C1020,700 910,710 840,620Z" fill="${C.blanket}" stroke="${INK}" stroke-width="7"/>`+
     smoke(990,600,3,'#9aa0a6',6)+`<rect x="962" y="606" width="58" height="66" rx="8" fill="#fff" stroke="${INK}" stroke-width="6"/>`+P('M1020,620 q26,4 0,32',{w:6})+hand(956,654)+hand(1024,658)+
     head(960,480,100,'calm',[.05,0]);
  }
  return g;
}
SC.room=()=>room();
SC.sleep=()=>room({sleep:1});
SC.threeDangers=()=>`<rect width="1920" height="1080" fill="#fff"/>`+big(960,230,'50 000 ЖЫЛ БҰРЫН',{size:130,c:'fade'})+big(960,360,'3 өлім қаупі',{size:90,fill:C.red,c:'fade',w:.6})+
  [['СУЫҚ','❄',560,1],['СУ ТАСҚЫНЫ','≈',960,1.4],['ЖЫРТҚЫШТАР','',1360,1.8]].map(([t,ic,x,w],i)=>G(`<circle cx="${x}" cy="620" r="130" fill="${['#dcebf7','#d3e4f2','#f6dcd6'][i]}" stroke="${INK}" stroke-width="8"/>`+
   (i==0?P(`M${x},540 V700 M${x-70},580 L${x+70},660 M${x-70},660 L${x+70},580`,{s:'#2f78b7',w:12}):i==1?P(`M${x-80},600 q20,-20 40,0 t40,0 t40,0 t40,0 M${x-80},650 q20,-20 40,0 t40,0 t40,0 t40,0`,{s:C.water,w:12}):
   `<path d="M${x-60},590 Q${x-30},560 ${x},590 Q${x-30},610 ${x-60},590Z M${x},590 Q${x+30},560 ${x+60},590 Q${x+30},610 ${x},590Z" fill="${C.red}"/>`)+
   big(x,840,t,{size:56}),{c:'pop',st:`--w:${w}s`})).join('');
SC.dryWet=()=>`<rect width="1920" height="1080" fill="#fff"/>`+P('M960,60 V1020',{w:6,st:'stroke-dasharray:24 18'})+
  big(480,160,'ҚҰРҒАҚ',{size:96})+big(1440,160,'СУ',{size:96,fill:'#2f78b7'})+
  hero(480,880,.9,{mood:'calm',arms:'down'})+P('M600,520 l60,-40',{s:C.red,w:8})+big(480,1000,'1×',{size:110})+
  hero(1440,880,.9,{mood:'worried',arms:'cross',c:'shiver-hard'})+
  [[-1,-1],[1,-1],[-1,0],[1,0],[-1,1],[1,1],[0,-1.4]].map(([a,b],i)=>arrow(1440+a*110,520+b*120,1440+a*150,520+b*150,1440+a*200,520+b*190,{s:C.red,w:8,c:'draw',st:`--w:${.8+i*.1}s;--d:.4s`})).join('')+
  [[1380,400],[1500,420],[1330,600],[1560,640]].map(([x,y],i)=>`<path class="fall" style="--w:${i*.3}s;--x:0px;--y:120px" d="M${x},${y} q-10,20 0,26 q10,-6 0,-26Z" fill="#3f87c2"/>`).join('')+
  big(1440,1000,'25×',{size:130,fill:C.red,c:'pop',w:1.4});
SC.freeze=()=>{let g=`<defs>${vgrad('fz','#2f4a66','#8fb2cc')}</defs><rect width="1920" height="1080" fill="url(#fz)"/>`+rain(150,{op:.6,d:.5,col:'#e1ecf5'});
  g+=G(hero(760,950,1.05,{mood:'worried',arms:'cross',big:1}),{c:'shiver-hard'})+`<rect x="560" y="300" width="400" height="660" fill="#8fc3ec" opacity=".25" class="fade" style="--w:1s;--d:3s"/>`;
  for(let i=0;i<8;i++){const a=i*Math.PI/4;g+=P(`M${r1(760+Math.cos(a)*300)},${r1(560+Math.sin(a)*300)} l${r1(Math.cos(a)*40)},${r1(Math.sin(a)*40)}`,{s:'#e8f4fc',w:6,c:'glow'})}
  g+=G(`<path d="M0,30 C-60,-20 -40,-80 0,-50 C40,-80 60,-20 0,30Z" fill="${C.red}" stroke="${INK}" stroke-width="6"/>`,{t:'translate(1400,520) scale(2.4)',c:'heart'})+
    P('M1180,760 H1290 l20,-40 l25,80 l20,-60 l15,20 H1620',{s:'#fff',w:7,c:'draw',st:'--d:3s;--w:.4s'});
  return g+vignette(.5)};
SC.mountain=()=>stormSky()+`<path d="M0,900 L300,520 L520,640 L860,260 L1180,620 L1420,420 L1920,860 V1080 H0Z" fill="#6f6860" stroke="${INK}" stroke-width="8"/>`+
  hatch(40,200,1700,420,860,'#544e48',12)+[[480,880,90],[980,890,120],[1500,880,100]].map(([x,y,r])=>`<path d="M${x-r},${y} C${x-r},${y-r*1.3} ${x+r},${y-r*1.3} ${x+r},${y}Z" fill="${C.cave}" stroke="${INK}" stroke-width="7"/>`).join('')+
  `<path d="M0,880 C600,870 1300,890 1920,875 V1080 H0Z" fill="${C.groundW}" stroke="${INK}" stroke-width="6"/>`+
  [[480,880],[980,890],[1500,880]].map(([x,y],i)=>`<circle class="pop" style="--w:${.6+i*.4}s" cx="${x}" cy="${y-170}" r="22" fill="${C.red}" stroke="#fff" stroke-width="5"/>`).join('')+
  rain(180,{op:.6,d:.45,col:C.rainD})+vignette(.4);
SC.flood=()=>{const caveD='M520,1000 C520,560 720,380 960,380 C1220,380 1400,560 1400,1000Z';
  return stormSky()+`<path d="M0,500 C300,380 700,230 1920,260 V1080 H0Z" fill="#6f6860" stroke="${INK}" stroke-width="8"/>`+hatch(30,100,1800,320,700,'#544e48',3)+
   P('M80,470 C260,430 420,470 600,420 C700,390 760,380 820,400',{s:C.waterL,w:22,c:'flow'})+P('M1840,300 C1700,360 1560,380 1380,450',{s:C.waterL,w:18,c:'flow'})+
   `<path d="${caveD}" fill="${C.cave}" stroke="${INK}" stroke-width="9"/><clipPath id="cv"><path d="${caveD}"/></clipPath>`+
   G(heroSeat(960,960,.9,{mood:'scared',arms:'open',big:1})+G(`<path d="M400,1300 V960 ${Array.from({length:12},()=>'q40,-22 80,0').join(' ')} V1300Z" fill="${C.water}" opacity=".92" stroke="${INK}" stroke-width="6"/>`,{c:'flood',st:'animation-delay:.2s;animation-duration:3.2s'}),{clip:'cv'})+
   sfx(1500,700,'СЕЛ!',{size:120,w:1.6,rot:6})+rain(200,{op:.6,d:.45,col:C.rainD})+vignette(.45)};
SC.dig=()=>{let g=`<rect width="1920" height="1080" fill="#fff"/>`+big(960,140,'АРХЕОЛОГТАР ТАПҚАН',{size:92,c:'fade'});
  [['#c9a77a',260],['#a9825a',420],['#8a6544',600],['#6e4f33',800]].forEach(([c,y],i)=>g+=`<rect x="160" y="${y}" width="1600" height="${i==3?220:y==260?160:180}" fill="${c}"/>`);
  g+=`<rect x="160" y="260" width="1600" height="760" fill="none" stroke="${INK}" stroke-width="8"/>`+`<path d="M700,1000 C700,700 820,560 960,560 C1100,560 1220,700 1220,1000Z" fill="#5a4330" stroke="${INK}" stroke-width="6"/>`+
   G(`<path d="M720,1000 C760,860 860,800 960,820 C1080,800 1180,880 1200,1000Z" fill="#7a5a3a"/>`+P('M800,940 q40,-20 80,0 M900,960 l60,-10 M1040,950 l50,10',{s:'#efe6d2',w:10})+
     `<circle cx="1000" cy="900" r="34" fill="#efe6d2" stroke="${INK}" stroke-width="4"/>`,{c:'fade',st:'--w:1s'})+
   G(`<rect x="1350" y="250" width="26" height="200" rx="8" fill="#a8743f" stroke="${INK}" stroke-width="5" transform="rotate(30 1363 350)"/><path d="M1290,420 l60,40 l-30,40 l-60,-40Z" fill="#8d9096" stroke="${INK}" stroke-width="5"/>`,{c:'bob',st:'--a:-14px;--d:.7s'})+
   T(300,1000,'лай қабаты',{size:44,fill:'#fff',c:'fade',st:'--w:1.6s'});
  return g};
SC.leopardRun=()=>stormSky()+`<path d="M0,862 C300,846 600,876 960,858 C1300,842 1600,868 1920,852 V1080 H0Z" fill="${C.groundW}" stroke="${INK}" stroke-width="6"/>`+
  `<path d="M60,862 C60,560 200,420 380,420 C560,420 640,600 660,862Z" fill="${C.rock}" stroke="${INK}" stroke-width="8"/><path d="M150,862 C150,700 240,620 360,620 C480,620 540,720 550,862Z" fill="${C.cave}" stroke="${INK}" stroke-width="7"/>`+
  G(G(leopard(0,900,1.1,{run:1}),{c:'bob',st:'--a:-22px;--d:.35s'}),{c:'runin'})+
  arrow(1500,700,1100,640,760,700,{s:'#fff',w:8,c:'draw',st:'--w:1s'})+sfx(1300,420,'АҢДАР ДА ҚАШАДЫ',{size:76,w:1.6})+rain(200,{op:.6,d:.45,col:C.rainD})+vignette(.45);
SC.eyes=()=>`<rect width="1920" height="1080" fill="#141210"/>`+
  `<path d="M0,240 C200,220 340,420 360,620 C370,800 330,940 320,1080 L0,1080Z" fill="#56616c"/><clipPath id="mo"><path d="M0,240 C200,220 340,420 360,620 C370,800 330,940 320,1080 L0,1080Z"/></clipPath>`+
  G(rain(50,{W:400,op:.7,d:.5,col:C.rainD}),{clip:'mo'})+
  `<filter id="bl" x="-1" y="-1" width="3" height="3"><feGaussianBlur stdDeviation="14"/></filter>`+
  G(`<ellipse cx="1300" cy="380" rx="44" ry="22" fill="#ff2d20" filter="url(#bl)"/><ellipse cx="1430" cy="380" rx="44" ry="22" fill="#ff2d20" filter="url(#bl)"/>`+
   `<path class="blink" d="M1268,380 Q1300,356 1332,380 Q1300,398 1268,380Z" fill="#ff5a3c"/><path class="blink" d="M1398,380 Q1430,356 1462,380 Q1430,398 1398,380Z" fill="#ff5a3c"/>`,{c:'fade',st:'--w:1.2s;--d:1.6s'})+
  `<g fill="#231f1b">${[[1240,500],[1330,540],[1460,510],[1400,600],[1290,620],[1520,600],[1580,480]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="16"/>`).join('')}</g>`+
  heroSeat(620,1000,1,{mood:'worried',arms:'knees',look:[-.1,0]})+vignette(.6);
function africa(){return `<path d="M260,40 L420,30 L470,110 L540,200 L600,250 L530,300 L480,420 L460,500 L390,610 L320,650 L280,600 L255,470 L235,350 L180,300 L60,275 L10,175 L60,95Z" fill="#e9cf8f" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><ellipse cx="545" cy="500" rx="22" ry="60" transform="rotate(18 545 500)" fill="#e9cf8f" stroke="${INK}" stroke-width="5"/>`}
SC.africa=()=>`<rect width="1920" height="1080" fill="#a9d2ea"/>`+G(africa(),{t:'translate(560,170) scale(1.25)'})+
  G(`<path d="M960,920 C930,870 910,850 910,830 A50,50 0 1 1 1010,830 C1010,850 990,870 960,920Z" fill="${C.red}" stroke="#fff" stroke-width="6"/><circle cx="960" cy="830" r="18" fill="#fff"/>`,{c:'popb',st:'--w:.8s'})+
  G(`<rect x="1050" y="850" width="430" height="80" rx="8" fill="#fff" stroke="${INK}" stroke-width="5"/>`+T(1265,905,'ОҢТҮСТІК АФРИКА',{size:52,anchor:'middle'}),{c:'fade',st:'--w:1.2s'});
SC.skull=()=>`<rect width="1920" height="1080" fill="#fff"/>`+
  G(`<path d="M120,120 C120,-20 380,-60 470,60 C520,130 500,200 470,230 L470,290 L380,300 L360,340 L240,340 L230,290 C150,270 120,210 120,120Z" fill="#efe9dc" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>`+
    `<ellipse cx="380" cy="160" rx="48" ry="44" fill="#3a3430"/><path d="M460,220 l-30,40 l40,0Z" fill="#3a3430"/>`+P('M260,300 v34 M290,300 v34 M320,300 v34 M350,300 v30',{w:4})+
    `<circle cx="170" cy="40" r="14" fill="#1b1b1b"/><circle cx="235" cy="10" r="14" fill="#1b1b1b"/>`,{t:'translate(260,300)'})+
  G(`<path d="M0,120 C60,60 220,40 380,60 L400,120 C300,150 140,170 0,170Z" fill="#d8b24c" stroke="${INK}" stroke-width="8"/>`+
    `<path d="M300,64 L320,-60 L345,60Z M360,60 L380,-40 L398,64Z" fill="#fff8e8" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`,{t:'translate(1180,420)',c:'fade',st:'--w:.8s'})+
  P('M430,310 C800,200 1200,300 1500,370',{s:C.red,w:5,c:'draw',st:'stroke-dasharray:14 12;--w:1.6s'})+P('M495,280 C800,180 1200,260 1560,380',{s:C.red,w:5,c:'draw',st:'--w:1.8s'})+
  T(380,230,'тіс іздері',{size:52,fill:C.red,c:'fade',st:'--w:1.2s'})+big(960,940,'ДӘЛ СӘЙКЕС.',{size:120,c:'pop',w:2.4});
SC.faceoff=()=>caveInterior('M0,0 H600 C500,200 300,260 0,240Z',{seed:13})+rockFloor(900)+
  `<ellipse class="glow" cx="960" cy="800" rx="700" ry="300" fill="#e0b070" opacity=".18"/>`+
  hero(560,920,1,{mood:'scared',arms:'shrug',big:1,c:'shiver'})+leopard(1340,930,1.05,{flip:0,fangs:1})+
  sfx(960,240,'БЕТПЕ-БЕТ!',{size:110,w:.6,fill:'#ffe0a0',stroke:'#2b1c10'})+sfx(1150,640,'ырррр',{size:60,w:1.2})+vignette(.6);
SC.task=()=>`<rect width="1920" height="1080" fill="#fff"/>`+big(960,250,'№1 МІНДЕТ',{size:110,c:'fade'})+fire(960,800,1.4)+big(960,1000,'ОТТЫ ӨШІРМЕУ',{size:110,fill:'#b8460f',c:'pop',w:.8});
SC.matches=()=>`<rect width="1920" height="1080" fill="#fff"/>`+
  G(`<rect x="420" y="520" width="380" height="220" rx="12" fill="#3f7fb3" stroke="${INK}" stroke-width="8"/><rect x="440" y="540" width="340" height="60" fill="#8a5a32"/>`+
   [0,1,2].map(i=>`<rect x="${500+i*60}" y="${380+i*10}" width="14" height="200" fill="#e7c38a" stroke="${INK}" stroke-width="4" transform="rotate(${-10+i*8} ${507+i*60} 580)"/><ellipse cx="${507+i*60}" cy="${382+i*10}" rx="16" ry="20" fill="${C.red}" stroke="${INK}" stroke-width="4" transform="rotate(${-10+i*8} ${507+i*60} 580)"/>`).join(''),{c:'pop',st:'--w:.2s'})+
  G(`<rect x="1150" y="420" width="200" height="320" rx="30" fill="${C.red}" stroke="${INK}" stroke-width="8"/><rect x="1150" y="380" width="200" height="70" rx="10" fill="#c9ccd1" stroke="${INK}" stroke-width="7"/>`+
   `<path class="flick" d="M1250,250 C1270,290 1290,330 1270,370 C1260,385 1240,385 1230,370 C1212,330 1232,290 1250,250Z" fill="#ffc53d" stroke="${INK}" stroke-width="5"/>`,{c:'pop',st:'--w:.6s'})+
  big(960,960,'БІЗ ҮШІН — ҮЙРЕНШІКТІ',{size:96,c:'fade',w:1});
SC.n40=()=>`<rect width="1920" height="1080" fill="#fff"/>`+big(960,420,'40 000 ЖЫЛ БҰРЫН',{size:150,c:'fade'})+big(960,640,'отты жаға алмаған',{size:96,ls:0,fill:C.red,c:'pop',w:.8})+G(`<rect x="-20" y="-120" width="40" height="240" fill="#e7c38a" stroke="${INK}" stroke-width="6"/><ellipse cx="0" cy="-120" rx="34" ry="42" fill="${C.red}" stroke="${INK}" stroke-width="6"/>`,{t:'translate(960,880) rotate(-30)',c:'fade',st:'--w:1.2s'})+P('M860,760 L1060,1000 M1060,760 L860,1000',{s:C.red,w:18,c:'draw',st:'--w:1.6s;--d:.4s'});
SC.lightning=()=>{let g=stormSky()+`<path d="M0,880 C600,870 1300,890 1920,875 V1080 H0Z" fill="${C.groundW}" stroke="${INK}" stroke-width="6"/>`+
   `<rect x="1180" y="560" width="60" height="330" fill="#6b4a2e" stroke="${INK}" stroke-width="7"/><path d="M1040,640 L1210,300 L1380,640Z" fill="#4f6a35" stroke="${INK}" stroke-width="8"/>`;
  g+=`<rect class="flash" style="--w:.6s" width="1920" height="1080" fill="#fff"/>`+P('M1300,0 L1240,150 L1300,160 L1210,330',{s:'#fff6b0',w:16,c:'flash',st:'--w:.6s'});
  g+=G(fire(1210,560,.9).replace(/<rect[^>]*\/>/g,'').replace(/<ellipse cx="-?\d+" cy="2"[^>]*\/>/g,''),{c:'pop',st:'--w:.9s'})+hero(560,890,.95,{mood:'scared',arms:'point',big:1,look:[.2,-.05]})+sfx(1500,300,'ЖАРҚ!',{size:120,w:.6,fill:'#fff6b0'});
  return g+rain(160,{op:.55,d:.45,col:C.rainD})+vignette(.4)};
SC.deadFire=()=>caveInterior('M1400,0 C1460,240 1640,300 1920,280 V0Z',{seed:17})+rockFloor(860)+
  `<path d="M760,900 C800,840 1120,840 1160,900Z" fill="#4a4540" stroke="${INK}" stroke-width="6"/>`+P('M800,880 L1000,850 M880,895 L1100,860 M900,860 L960,900',{s:'#2a2622',w:14})+smoke(960,840,2,'#6c7075',5)+
  P('M840,620 L1080,860 M1080,620 L840,860',{s:C.red,w:26,c:'draw',st:'--w:.8s;--d:.4s'})+
  heroSeat(460,920,1,{mood:'worried',arms:'knees',look:[.2,.1]})+big(1400,560,'БІТТІ.',{size:120,fill:'#fff',c:'fade',w:1.4})+vignette(.6);
SC.fungusTree=()=>`<defs>${vgrad('fg','#6e7a6a','#a9b39d')}</defs><rect width="1920" height="1080" fill="url(#fg)"/>`+
  `<rect x="760" y="0" width="360" height="1080" fill="#6b4a2e" stroke="${INK}" stroke-width="9"/>`+P('M800,0 V1080 M880,100 V900 M1040,0 V700 M960,300 V1080',{s:'#4f361f',w:6})+
  [[1120,380,1.6,0],[1120,560,1.2,.3],[760,700,1.4,.6]].map(([x,y,s,w],i)=>G(G(`<path d="M0,-60 C${i==2?-180:180},-60 ${i==2?-200:200},20 0,30Z" fill="#c9a27a" stroke="${INK}" stroke-width="6"/>`+P(i==2?'M-20,-30 C-90,-30 -120,0 -140,10':'M20,-30 C90,-30 120,0 140,10',{s:'#8a6a44',w:4}),{c:'popb',st:`--w:${w}s`}),{t:`translate(${x},${y}) scale(${s})`})).join('')+
  hero(1500,960,.8,{mood:'curious',arms:'point',look:[-.2,-.1],flip:1})+sfx(560,300,'ҚУ САҢЫРАУҚҰЛАҚ',{size:80,w:1.2})+rain(90,{op:.4,d:.5,col:'#e5ece4'});
SC.ember=()=>`<rect width="1920" height="1080" fill="#2a2420"/>`+`<ellipse class="glow" cx="960" cy="640" rx="520" ry="300" fill="#ff8a2a" opacity=".22"/>`+
  G(`<path d="M-320,0 C-330,-260 330,-260 320,0 C160,40 -160,40 -320,0Z" fill="#c9a27a" stroke="${INK}" stroke-width="9"/>`+P('M-260,-40 C-170,-170 170,-170 260,-40 M-180,-90 C-80,-170 80,-170 180,-90',{s:'#8a6a44',w:6})+
   `<ellipse cx="0" cy="-60" rx="110" ry="50" fill="#3a2a1d" stroke="${INK}" stroke-width="5"/><ellipse class="glow" style="--d:.7s" cx="0" cy="-64" rx="70" ry="30" fill="#ff6a12"/><ellipse class="glow" style="--d:.5s" cx="-20" cy="-66" rx="30" ry="14" fill="#ffd36b"/>`,{t:'translate(960,760)'})+
  smoke(960,680,5,'#a5a9ad',12)+big(960,220,'«ТАБИҒИ ОТТЫҚ»',{size:110,fill:'#ffd9a8',c:'fade',w:.6})+sfx(1460,560,'сағаттап бықсиды',{size:60,w:1.6})+vignette(.6);
SC.shield=()=>{const mouth='M0,180 C140,150 330,230 360,480 C380,650 340,800 300,860 L0,860Z';
  return caveInterior(mouth,{seed:4})+`<ellipse class="glow" cx="1100" cy="760" rx="560" ry="330" fill="#ffb347" opacity=".3"/>`+rockFloor(856,'#4a433d')+
   [[120,420,0],[60,560,.6],[160,680,1.1],[90,330,1.5]].map(([x,y,w])=>`<path class="gust" style="--w:${w}s" d="M${x},${y} q60,-22 120,0 t120,0 q30,-10 22,-34" fill="none" stroke="#c7d3de" stroke-width="7" stroke-linecap="round"/>`).join('')+
   fire(1080,870,1.05,'fight')+
   G(G(`<path d="M1160,485 C1040,420 900,470 850,600 C820,690 840,800 880,855 L935,852 C905,780 905,690 940,630 C990,560 1060,580 1118,610Z" fill="${FUR}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`+P('M900,560 l10,12 M880,660 l10,12 M890,760 l10,12 M960,520 l10,12 M1040,500 l10,12',{s:FURD,w:4}),{c:'billow'}),{c:'raise'})+
   G(legs()+G(arm('M52,-288 Q-20,-380 -120,-430')+hand(-120,-430)+tunic()+head(0,-410,105,'focus',[-.16,.04])+arm('M-52,-288 Q-130,-300 -190,-330')+hand(-190,-330),{t:'rotate(-15 0 -126)'}),{t:'translate(1350,880)'})+
   person(1700,880,.8,{arms:'cross'})+sfx(1640,300,'кезектесіп күзетеміз',{size:56,w:1.4})+vignette(.6)};
SC.fire4=()=>`<rect width="1920" height="1080" fill="#fff"/>`+fire(960,680,1.3)+
  [['ЖЫЛУ',480,330,.4],['ЖАРЫҚ',1440,330,.9],['АС',480,860,1.4],['ҚАУІПСІЗДІК',1440,860,1.9]].map(([t,x,y,w])=>G(big(x,y,t,{size:96})+arrow(x+(x<960?150:-150),y-30,(x+960)/2,(y+560)/2-60,x<960?820:1100,y<500?520:640,{s:'#b8460f',w:6}),{c:'pop',st:`--w:${w}s`})).join('');
SC.question=()=>caveInterior('M1180,880 C1150,560 1280,260 1560,240 C1820,220 1900,520 1920,880Z',{seed:21})+rockFloor(880,'#4a433d')+
  `<ellipse class="glow" cx="700" cy="800" rx="520" ry="280" fill="#ffb347" opacity=".3"/>`+fire(880,890,.9)+
  heroSeat(520,900,1,{mood:'curious',arms:'knees',look:[.22,0]})+big(520,420,'?',{size:220,fill:C.red,c:'pop',w:1})+vignette(.6);
SC.idea=()=>`<rect width="1920" height="1080" fill="#fff8e6"/>`+
  G(P(Array.from({length:16},(_,i)=>{const a=i*Math.PI/8;return `M${r1(960+Math.cos(a)*230)},${r1(470+Math.sin(a)*230)} L${r1(960+Math.cos(a)*420)},${r1(470+Math.sin(a)*420)}`}).join(' '),{s:'#f2b630',w:14}),{c:'sunrays'})+
  hero(960,980,1,{mood:'happy',arms:'up',look:[0,-.05]})+big(1170,330,'!',{size:220,fill:C.red,c:'pop',w:.4})+big(960,150,'ӨНЕРТАБЫС УАҚЫТЫ',{size:96,c:'fade',w:.8});
SC.carve=()=>{const s=s5();return s.replace('<rect width="1920" height="1080" fill="#d6cfc3"/>',`<rect width="1920" height="1080" fill="#5c544c"/>`)+vignette(.55)};
SC.needle=()=>`<rect width="1920" height="1080" fill="#fff"/>`+big(960,200,'СҮЙЕК ИНЕ',{size:110,c:'fade'})+
  G(`<path d="M-600,40 L560,-20 L600,0 L560,20 L-600,80 C-640,80 -650,40 -600,40Z" fill="#f4ecd8" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><ellipse cx="-560" cy="60" rx="22" ry="9" fill="${INK}"/>`,{t:'translate(960,560)',c:'pop',st:'--w:.4s'})+
  big(960,820,'тек тыныш отырып жасайсың',{size:72,ls:0,fill:'#8b3c14',c:'fade',w:1.2})+
  [[700,580,0],[900,590,.5],[1200,570,1]].map(([x,y,w])=>`<rect class="fall" style="--w:${w}s;--y:160px" x="${x}" y="${y}" width="16" height="8" fill="#efe6d2" stroke="${INK}" stroke-width="2"/>`).join('');
SC.rope=()=>{const str=(c,ph)=>P(Array.from({length:1},()=>{let d='M200,540';for(let x=200;x<=1720;x+=20)d+=` L${x},${r1(540+Math.sin((x/60)+ph)*36)}`;return d})[0],{s:INK,w:26})+P((()=>{let d='M200,540';for(let x=200;x<=1720;x+=20)d+=` L${x},${r1(540+Math.sin((x/60)+ph)*36)}`;return d})(),{s:c,w:16});
  return `<rect width="1920" height="1080" fill="#5c544c"/>`+`<ellipse class="glow" cx="960" cy="560" rx="900" ry="380" fill="#ffb347" opacity=".18"/>`+
   G(str('#c79a5c',0)+str('#a07a45',Math.PI),{c:'twist'})+hand(200,540,40)+hand(1720,540,40)+
   P('M120,620 C80,700 60,800 100,900 M1800,620 C1840,700 1860,800 1820,900',{s:'#d8b27a',w:8})+
   big(960,240,'ӨСІМДІК ТАЛШЫҒЫ → АРҚАН',{size:92,fill:'#ffe7bf',c:'fade',w:.4})+vignette(.5)};
SC.ropeUses=()=>`<rect width="1920" height="1080" fill="#fff"/>`+big(960,180,'АРҚАН ПАЙДА БОЛҒАН СОҢ',{size:88,c:'fade'})+
  G(P('M-80,-200 C80,-120 80,120 -80,200',{w:12,s:'#7a4a26'})+P('M-80,-200 L-80,200',{w:4})+P('M-140,0 L120,0',{w:7})+`<path d="M120,0 l-30,-14 v28Z" fill="#8d9096" stroke="${INK}" stroke-width="4"/>`+big(0,330,'САДАҚ',{size:70}),{t:'translate(420,560)',c:'pop',st:'--w:.4s'})+
  G(P('M-120,120 C-120,-80 120,-80 120,120',{w:10,s:'#a07a45'})+`<ellipse cx="0" cy="40" rx="90" ry="40" fill="none" stroke="#a07a45" stroke-width="10"/>`+P('M0,-50 V-180',{w:8})+big(0,330,'ТҰЗАҚ',{size:70}),{t:'translate(960,560)',c:'pop',st:'--w:1s'})+
  G(P('M-140,160 L0,-160 L140,160 M-60,160 L0,-160 L60,160',{w:12,s:'#7a4a26'})+P('M-20,-120 l40,20 M-20,-100 l40,20',{s:'#c79a5c',w:8})+big(0,330,'БАСПАНА',{size:70}),{t:'translate(1500,560)',c:'pop',st:'--w:1.6s'});
SC.mat=()=>{let g=`<rect width="1920" height="1080" fill="#5c544c"/><defs><clipPath id="mt"><rect x="160" y="300" width="1600" height="640" rx="30"/></clipPath></defs><rect x="160" y="300" width="1600" height="640" rx="30" fill="#c9c06e"/>`;
  g+=G(P(Array.from({length:40},(_,i)=>`M${100+i*50},940 l320,-640 M${100+i*50},300 l320,640`).join(' '),{s:'#968d3d',w:10}),{clip:'mt'})+`<rect x="160" y="300" width="1600" height="640" rx="30" fill="none" stroke="${INK}" stroke-width="9"/>`;
  srand(31);for(let i=0;i<14;i++){const x=r1(260+rnd()*1400),y=r1(360+rnd()*520),a=r1(rnd()*180);g+=`<path class="fade" style="--w:${r1(i*.15)}s" transform="translate(${x},${y}) rotate(${a}) scale(3)" d="M-16,0 Q0,-12 16,0 Q0,12 -16,0Z" fill="#6f9a4f" stroke="${INK}" stroke-width="1.5"/>`}
  return g+sfx(960,200,'ШӨП ТӨСЕНІШ + ХОШ ИІСТІ ЖАПЫРАҚ',{size:72,w:.6,fill:'#ffe7bf',stroke:'#2b1c10'})+vignette(.45)};
SC.n77=()=>`<rect width="1920" height="1080" fill="#fff"/>`+big(960,500,'77 000',{size:280,c:'pop'})+big(960,650,'ЖЫЛ БҰРЫН',{size:110,c:'fade',w:.5})+big(960,860,'адамдар үйін таза ұстаған',{size:70,ls:0,fill:'#5b6526',c:'fade',w:1.1});
SC.art=()=>`<rect width="1920" height="1080" fill="#2a241f"/>`+`<ellipse class="glow" cx="960" cy="560" rx="1300" ry="800" fill="#d98b3a" opacity=".1"/>`+
  big(960,600,'ӨНЕРДІҢ ТУУЫ',{size:170,fill:'#e7b56d',c:'pop',w:.3})+G(P('M-60,-40 l-30,-90 M-20,-60 l-8,-120 M20,-62 l12,-122 M56,-50 l32,-104 M70,20 l80,-28',{s:'#b53b22',w:34})+`<ellipse cx="0" cy="0" rx="70" ry="78" fill="#b53b22"/>`,{t:'translate(1640,260) rotate(12) scale(.9)',c:'fade',st:'--w:.9s',o:.8});
SC.maps=()=>`<rect width="1920" height="1080" fill="#a9d2ea"/>`+
  G(`<path d="M300,40 L420,90 L480,200 L430,330 L330,380 L200,360 L130,300 L150,190 L60,140 L170,110 L240,60Z" fill="#e9cf8f" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`+
   `<path class="popb" style="--w:.6s" d="M370,300 C350,265 335,250 335,236 A35,35 0 1 1 405,236 C405,250 390,265 370,300Z" fill="${C.red}" stroke="#fff" stroke-width="5"/>`+T(270,470,'ФРАНЦИЯ',{size:60,anchor:'middle',font:SFX_FONT}),{t:'translate(160,220) scale(1.15)'})+
  G(P('M200,100 L270,170 L400,130 M270,170 L255,270 L350,320 M255,270 L200,400',{w:58})+P('M200,100 L270,170 L400,130 M270,170 L255,270 L350,320 M255,270 L200,400',{s:'#e9cf8f',w:44})+
   `<path class="popb" style="--w:1.2s" d="M230,300 C210,265 195,250 195,236 A35,35 0 1 1 265,236 C265,250 250,265 230,300Z" fill="${C.red}" stroke="#fff" stroke-width="5"/>`+T(280,500,'ИНДОНЕЗИЯ',{size:60,anchor:'middle',font:SFX_FONT}),{t:'translate(1080,200) scale(1.15)'})+
  `<rect x="560" y="900" width="800" height="120" rx="14" fill="#fff" stroke="${INK}" stroke-width="6" class="fade" style="--w:1.8s"/>`+big(960,990,'35–45 мың жыл бұрын',{size:80,ls:0,c:'fade',w:1.8});
SC.wall=()=>{const s=s6();return s};
SC.paintings=()=>{const ochre='#c56d26',red='#9e3220';
  const horse='M80,135 C150,105 260,110 325,108 C360,100 378,62 398,38 C412,26 428,34 432,48 L462,96 C464,108 446,114 436,104 C420,96 406,98 398,114 C388,138 380,160 362,176 C320,200 220,205 150,190 C115,182 90,165 80,135Z';
  const bear='M0,120 C10,60 60,30 120,30 C170,20 220,40 250,80 L280,90 L270,110 L240,110 C230,140 230,160 220,180 L200,180 L195,140 C150,150 100,150 60,140 L50,180 L30,180 C25,150 5,140 0,120Z';
  return `<rect width="1920" height="1080" fill="#5a4636"/>`+hatch(120,0,1920,0,1080,'#4a382a',44)+`<ellipse class="glow" cx="960" cy="560" rx="900" ry="460" fill="#ffc06a" opacity=".22"/>`+
   G(`<path d="${horse}" fill="${ochre}" opacity=".85" stroke="#2a1a10" stroke-width="7" class="fade"/>`+P('M352,180 C382,205 412,220 448,232 M330,188 C350,220 360,250 352,284 M150,190 C120,220 90,240 50,252 M172,192 C172,230 182,262 198,294 M82,132 C50,130 30,150 20,188',{s:'#2a1a10',w:9,c:'draw',st:'--w:.4s'}),{t:'translate(120,180) scale(1.3)'})+
   G(`<path d="M40,120 C80,95 200,95 260,110 C285,118 300,140 296,170 C290,200 250,205 200,200 C150,198 90,200 60,180 C40,165 34,140 40,120Z" fill="#d9a441" opacity=".85" stroke="#2a1a10" stroke-width="7" class="fade" style="--w:.9s"/>`+
     P(Array.from({length:17},(_,i)=>{const a=i/16*Math.PI*2,rr=i%2?44:66;return `${i?'L':'M'}${r1(40+Math.cos(a)*rr)},${r1(96+Math.sin(a)*rr)}`}).join(' ')+'Z',{s:'#2a1a10',w:8,f:'#9e5a20',c:'fade',st:'--w:.9s'})+
     P('M80,190 L70,252 M122,198 L126,256 M222,200 L216,256 M262,190 L278,250 M296,150 C330,140 346,110 330,88',{s:'#2a1a10',w:9,c:'draw',st:'--w:1.1s'}),{t:'translate(1050,140) scale(1.35)'})+
   G(`<path d="${bear}" fill="${red}" opacity=".85" stroke="#2a1a10" stroke-width="7"/>`,{t:'translate(680,600) scale(1.6)',c:'fade',st:'--w:1.6s'})+
   T(330,560,'жылқы',{size:56,fill:'#ffe7bf',c:'fade',st:'--w:.6s'})+T(1260,540,'арыстан',{size:56,fill:'#ffe7bf',c:'fade',st:'--w:1.2s'})+T(800,1000,'аю',{size:56,fill:'#ffe7bf',c:'fade',st:'--w:1.8s'})+vignette(.6)};
SC.sunnyVs=()=>`<defs>${vgrad('sn','#7cc0ea','#d8eef9')}</defs><rect width="960" height="1080" fill="url(#sn)"/><circle cx="200" cy="180" r="80" fill="#ffd23f" stroke="${INK}" stroke-width="7"/>`+
  `<rect y="760" width="960" height="320" fill="${C.ground}"/>`+P('M0,760 H960',{w:6})+G(G(saiga(),{c:'bob',st:'--d:.4s;--a:-10px'}),{t:'translate(760,780) scale(1.4)'})+hero(380,800,.8,{arms:'spear',mood:'happy',look:[.2,0]})+
  big(480,1000,'АҢШЫЛЫҚ!',{size:80})+
  `<rect x="960" width="960" height="1080" fill="#1d1916"/><path d="M1200,1080 C1200,760 1320,620 1440,620 C1560,620 1680,760 1680,1080Z" fill="#000" stroke="#3d3632" stroke-width="8"/>`+
  heroSeat(1440,1040,.7,{mood:'worried',arms:'open',look:[0,0]})+big(1440,300,'ТАР ҚУЫСҚА?',{size:84,fill:'#ffe7bf'})+big(1440,470,'ЖОҚ!',{size:120,fill:C.red,c:'pop',w:1.2})+P('M960,0 V1080',{w:10});
SC.paint=()=>s6();
SC.chat=()=>`<defs>${vgrad('ch','#8a949d','#b9c1c7')}</defs><rect width="1920" height="1080" fill="url(#ch)"/>`+caveFrame()+rockFloor(880,'#5b544d')+
  person(560,900,.9,{arms:'cross',c:'bob',st:'--a:-4px;--d:2s'})+hero(960,900,.95,{mood:'happy',arms:'shrug',c:'bob',st:'--a:-6px;--d:1.3s'})+person(1360,900,.9,{arms:'down',c:'bob',st:'--a:-4px;--d:1.7s'})+
  G(`<ellipse cx="0" cy="0" rx="90" ry="60" fill="#fff" stroke="${INK}" stroke-width="6"/>`+T(0,16,'…',{size:70,anchor:'middle'}),{t:'translate(1160,300)',c:'pop',st:'--w:.5s'})+
  G(`<ellipse cx="0" cy="0" rx="90" ry="60" fill="#fff" stroke="${INK}" stroke-width="6"/>`+T(0,18,'?!',{size:60,anchor:'middle',fill:C.red}),{t:'translate(720,330)',c:'pop',st:'--w:1.1s'})+vignette(.45);
function caveFrame(){return `<path d="M0,0 H1920 V1080 H1800 C1800,600 1600,180 960,170 C320,180 120,600 120,1080 H0Z" fill="${C.rock}" stroke="${INK}" stroke-width="8"/>`+hatch(50,0,1920,0,500,'#4b443e',19)}
SC.fireside=()=>{const s=s7();return s.replace('<rect width="1920" height="1080" fill="#fdfaf5"/>',`<rect width="1920" height="1080" fill="#3a3430"/>`).replace('fill="#c9c1b4"',`fill="${C.rock}"`).replace('fill="#ffdca8" opacity=".5"','fill="#ffb347" opacity=".35"').replace('fill="#e8dfd0"','fill="#4a433d"')+vignette(.5)};
SC.lessons=()=>`<rect width="1920" height="1080" fill="#fff"/>`+
  [['ҚАЙ ШӨП УЛЫ?','#f7e7a1',360,-4,.2,P('M0,90 V-10 M0,40 C-50,30 -70,0 -60,-40 C-25,-30 -5,0 0,40',{w:7,s:'#2f6b2f'})],
   ['СУ ҚАЙДА?','#d6e8f7',960,3,1,`<path d="M0,-50 C30,-10 46,20 46,42 C46,70 24,88 0,88 C-24,88 -46,70 -46,42 C-46,20 -30,-10 0,-50Z" fill="#7fb3e0" stroke="${INK}" stroke-width="6"/>`],
   ['АҢДЫ ҚАЛАЙ АУЛАУ?','#f6dcd0',1560,-3,1.8,G(saiga(),{t:'translate(0,80) scale(1.2)'})]]
  .map(([t,c,x,r,w,ic])=>G(`<rect x="-260" y="-300" width="520" height="560" fill="${c}" stroke="${INK}" stroke-width="7"/>`+G(ic,{t:'translate(0,-80) scale(1.5)'})+big(0,180,t,{size:52,ls:1}),{t:`translate(${x},560) rotate(${r})`,c:'pop',st:`--w:${w}s`})).join('');
SC.social=()=>{const pts=[[960,330],[1300,450],[1380,760],[960,880],[540,760],[620,450]];
  return `<rect width="1920" height="1080" fill="#fff"/>`+fire(960,700,1)+
   pts.map(([x,y],i)=>P(pts.filter((_,j)=>j>i).map(([a,b])=>`M${x},${y} L${a},${b}`).join(' '),{s:'#e08a3c',w:5,c:'draw',st:`--w:${r1(.6+i*.2)}s;--d:.8s`,o:.8})).join('')+
   pts.map(([x,y],i)=>G(`<circle r="56" fill="${i==0?'#fff':'#d8d2c6'}" stroke="${INK}" stroke-width="7"/><ellipse cx="-16" cy="4" rx="5" ry="9" fill="${INK}"/><ellipse cx="16" cy="4" rx="5" ry="9" fill="${INK}"/>`,{t:`translate(${x},${y})`,c:'pop',st:`--w:${r1(i*.15)}s`})).join('')+
   G(`<path d="M0,30 C-60,-20 -40,-80 0,-50 C40,-80 60,-20 0,30Z" fill="${C.red}"/>`,{t:'translate(1520,300) scale(1.4)',c:'pop',st:'--w:2s'})+
   big(960,150,'АЛҒАШҚЫ «ӘЛЕУМЕТТІК ЖЕЛІ»',{size:92,c:'fade',w:1.4})};
SC.clearing=()=>{const s=s8();return s};
SC.mudTracks=()=>{let g=`<rect width="1920" height="1080" fill="#7a5638"/>`+hatch(50,0,1920,0,1080,'#65462c',51)+`<rect width="1920" height="140" fill="#6f8f3a"/>`+P('M0,140 H1920',{w:6});
  for(let i=0;i<5;i++){g+=G(G(`<path d="M-60,40 C-130,-20 -110,-150 -30,-170 C0,-110 0,-30 -60,40Z M60,40 C130,-20 110,-150 30,-170 C0,-110 0,-30 60,40Z" fill="#3b2614" stroke="#24170b" stroke-width="8"/>`,{c:'pop',st:`--w:${r1(.3+i*.35)}s`}),{t:`translate(${300+i*340},${i%2?520:780}) rotate(80) scale(1.1)`})}
  g+=`<ellipse cx="1500" cy="300" rx="160" ry="40" fill="#bcdcf2" stroke="${INK}" stroke-width="5"/>`;
  return g+sfx(960,960,'АЙНАДАЙ АНЫҚ ІЗ',{size:96,w:2,fill:'#ffe7bf',stroke:'#24170b'})};
SC.harvest=()=>s8();
SC.protein=()=>`<rect width="1920" height="1080" fill="#fff"/>`+
  G(`<ellipse cx="0" cy="0" rx="70" ry="40" fill="#c58a4a" stroke="${INK}" stroke-width="7"/><ellipse cx="-90" cy="0" rx="40" ry="34" fill="#8a5a2e" stroke="${INK}" stroke-width="7"/><ellipse cx="90" cy="0" rx="60" ry="44" fill="#d9a46a" stroke="${INK}" stroke-width="7"/>`+P('M-40,30 l-30,50 M0,36 l0,54 M40,30 l30,50 M-40,-30 l-30,-50 M0,-36 l0,-54 M40,-30 l30,-50 M-120,-20 l-50,-40 M-120,20 l-50,40',{w:7}),{t:'translate(960,420) scale(2)',c:'bob',st:'--a:-8px;--d:.6s'})+
  big(960,800,'АҚУЫЗҒА ӨТЕ БАЙ',{size:120,c:'pop',w:.6})+big(960,920,'термиттер',{size:70,ls:0,fill:'#8b3c14',c:'fade',w:1});
SC.explorer=()=>s9();
SC.three=()=>`<rect width="1920" height="1080" fill="#fff"/>`+[['ОЙЛАНАСЫЗ',300,.2],['ЖАСАЙСЫЗ',540,1],['ҮЙРЕНЕСІЗ',780,1.8]].map(([t,y,w])=>big(960,y,t,{size:150,c:'pop',w})).join('')+
  hero(260,1000,.55,{mood:'happy',arms:'up',outfit:'vest'});
SC.downtime=()=>{const items=[['ҚҰРАЛ',300],['КИІМ',630],['ӘҢГІМЕ',960],['ӨНЕР',1290],['АРҚАН',1620]];
  const icons=[spear(-60,60,40,-60),`<path d="M-50,-60 L50,-60 L70,60 L-70,60Z" fill="${FUR}" stroke="${INK}" stroke-width="6"/>`,`<ellipse cx="0" cy="-10" rx="70" ry="48" fill="#fff" stroke="${INK}" stroke-width="6"/><path d="M-20,30 l-20,40 l40,-30Z" fill="#fff" stroke="${INK}" stroke-width="6"/>`,
    G(`<path d="M80,135 C150,105 260,110 325,108 C360,100 378,62 398,38 C412,26 428,34 432,48 L462,96 C464,108 446,114 436,104 C420,96 406,98 398,114 C388,138 380,160 362,176 C320,200 220,205 150,190 C115,182 90,165 80,135Z" fill="#c56d26" stroke="${INK}" stroke-width="10"/>`,{t:'translate(-130,-60) scale(.55)'}),
    [44,30,16].map(r=>`<ellipse rx="${r*1.5}" ry="${r*.8}" fill="none" stroke="#a07a45" stroke-width="10"/>`).join('')];
  return `<rect width="1920" height="1080" fill="#fff"/>`+items.map(([t,x],i)=>G(G(icons[i],{t:`translate(${x},260)`})+big(x,420,t,{size:56})+P(`M${x},450 L960,700`,{w:5,c:'draw',st:`--w:${r1(1+i*.1)}s;--d:.7s`}),{c:'pop',st:`--w:${r1(i*.2)}s`})).join('')+
   big(960,800,'ЖАҢБЫРЛЫ КҮНДЕР',{size:120,c:'pop',w:1.8})+big(960,940,'өркениеттің бастауы?',{size:72,ls:0,fill:'#8b3c14',c:'fade',w:2.4})};

/* ---------- timeline: each shot starts at the first word of its phrase ---------- */
const Z=(a,b)=>[a,b];
const SHOTS=[
 ['Жаңбыр жауғанда ежелгі','title',Z([0,0,1920],[60,34,1800])],
 ['Көз алдыңызға елестетіп','hungry',Z([60,120,1250],[120,170,1100])],
 ['Бірақ киіктер үйірінің','steppe',Z([700,300,1100],[820,300,1000])],
 ['Кеше ғана ізіне','steppe',Z([380,500,900],[560,560,800])],
 ['Енді тек барып','steppe',Z([0,0,1920],[60,34,1800])],
 ['Бірақ дәл сол сәтте','downpour',Z([0,0,1920],[120,68,1680])],
 ['Жай ғана сіркіреу','wind',Z([300,170,1300],[420,230,1100])],
 ['Ол күні бойы','daynight',Z([0,0,1920],[40,22,1840])],
 ['Енді аңға шығу','washTracks',Z([0,0,1920],[80,45,1760])],
 ['Тайғақ тастарда','slip',Z([100,40,1700],[220,110,1500])],
 ['Ал жабайы табиғатта','ankle',Z([0,0,1920],[40,22,1840])],
 ['Жаныңыздағы өзен','river',Z([0,0,1920],[100,56,1720])],
 ['Ал сізді жылытып','dyingFire',Z([300,170,1400],[500,320,1000])],
 ['Сіздің ішіңіз пысып','trapped',Z([0,0,1920],[80,45,1760])],
 ['Бүгінде жаңбыр жауса','room',Z([0,0,1920],[160,90,1600])],
 ['Біз үшін жаңбыр','sleep',Z([200,100,1500],[300,160,1300])],
 ['Бірақ 50 мың','threeDangers',Z([0,0,1920],[40,22,1840])],
 ['Бірінші қауіп','dryWet',Z([0,0,1920],[30,17,1860])],
 ['Жылы киімсіз','freeze',Z([0,0,1920],[160,90,1600])],
 ['денеңіз мұздап','freeze',Z([1100,300,700],[1180,340,560])],
 ['Екінші қауіп','mountain',Z([0,0,1920],[100,56,1720])],
 ['Нөсер жауғанда таудан','flood',Z([100,60,1700],[300,200,1300])],
 ['Археологтар қазба','dig',Z([0,0,1920],[60,34,1800])],
 ['Үшінші әрі ең','leopardRun',Z([0,0,1920],[100,56,1720])],
 ['Ал олар іздеп','eyes',Z([0,0,1920],[300,120,1400])],
 ['Оңтүстік Африкадағы','africa',Z([0,0,1920],[300,280,1300])],
 ['Адамдардың бас сүйегінде','skull',Z([0,0,1920],[40,22,1840])],
 ['Яғни, жаңбыр адамды','faceoff',Z([0,0,1920],[160,120,1600])],
 ['Осындай сәттегі','task',Z([0,0,1920],[60,34,1800])],
 ['Бізге сіріңке','matches',Z([0,0,1920],[40,22,1840])],
 ['Ал 40 мың','n40',Z([0,0,1920],[60,34,1800])],
 ['Олар тек табиғаттан','lightning',Z([400,100,1400],[300,60,1500])],
 ['Егер от сөніп','deadFire',Z([200,120,1500],[340,200,1240])],
 ['Сондықтан адамдар шоқты','fungusTree',Z([0,0,1920],[160,60,1600])],
 ['Ол саңырауқұлақ ішіне','ember',Z([0,0,1920],[160,90,1600])],
 ['сағаттап бықсып','ember',Z([460,300,1000],[560,380,800])],
 ['Жаңбыр жауғанда адамдар','shield',Z([0,0,1920],[300,200,1400])],
 ['Өйткені от','fire4',Z([0,0,1920],[40,22,1840])],
 ['Жарайды, от жанып','question',Z([0,0,1920],[100,100,1600])],
 ['Міне, адамзат','idea',Z([0,0,1920],[60,34,1800])],
 ['Адамдар қол қусырып','carve',Z([0,0,1920],[300,200,1400])],
 ['Оттың жарығында','carve',Z([500,620,500],[560,660,380])],
 ['Ине жасау','needle',Z([0,0,1920],[60,34,1800])],
 ['Аң қуып жүріп','carve',Z([200,150,1500],[160,120,1600])],
 ['Өсімдік талшықтарын','rope',Z([0,0,1920],[100,56,1720])],
 ['Арқан пайда болған','ropeUses',Z([0,0,1920],[40,22,1840])],
 ['Тіпті үңгірдің','mat',Z([0,0,1920],[100,56,1720])],
 ['77 мың жыл','n77',Z([0,0,1920],[60,34,1800])],
 ['Бұдан да таңғаларлығы','art',Z([0,0,1920],[80,45,1760])],
 ['Франция мен Индонезиядағы','maps',Z([0,0,1920],[40,22,1840])],
 ['Онда арыстандар','paintings',Z([0,0,1920],[160,90,1600])],
 ['Ойлап көріңізші','sunnyVs',Z([0,0,1920],[40,22,1840])],
 ['Мұны тек далаға','paint',Z([0,0,1920],[200,120,1500])],
 ['Яғни, бейнелеу','paintings',Z([600,300,1000],[500,250,1200])],
 ['Сонымен қатар','chat',Z([0,0,1920],[100,56,1720])],
 ['Бір үңгірде','fireside',Z([0,0,1920],[200,140,1500])],
 ['От басында отырып','lessons',Z([0,0,1920],[40,22,1840])],
 ['Түрлі аңыздар','fireside',Z([900,0,1100],[1000,60,960])],
 ['От басы —','social',Z([0,0,1920],[40,22,1840])],
 ['Ал жаңбыр басылғанда','clearing',Z([600,0,1300],[500,0,1420])],
 ['Жаңбыр әрқашан','harvest',Z([0,0,1920],[80,45,1760])],
 ['Нөсерден кейін','mudTracks',Z([0,0,1920],[160,90,1600])],
 ['Қай аңның қашан','mudTracks',Z([500,300,1000],[620,360,800])],
 ['Оның үстіне','harvest',Z([800,360,1100],[860,420,960])],
 ['термиттер','protein',Z([0,0,1920],[40,22,1840])],
 ['Қорытындылай келе','explorer',Z([300,120,1400],[200,60,1600])],
 ['Сыртыңызда нөсер','carve',Z([0,0,1920],[100,56,1720])],
 ['Сіз ойланасыз','three',Z([0,0,1920],[40,22,1840])],
 ['Бәлкім, біздің','downtime',Z([0,0,1920],[60,34,1800])],
];
