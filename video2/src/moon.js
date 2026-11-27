/* "Егер сен Айда 24 сағат өмір сүрсең?" — bright flat explainer in the style of the "Егер сен..." reference:
   clean vector scenes, game-like HUD (clock, oxygen, stars, minimap), burned-in subtitles.
   Uses kit.js / shots.js / style.js helpers (P, G, T, head with mouths, hand, arm, big, sfx, vgrad, r1, rnd, srand). */
const M={sky1:'#04060f',sky2:'#1b2142',moon:'#b8b8be',moonD:'#8d8d95',moonL:'#d6d6db',suit:'#f4f6f8',blue:'#2f6fd6',red:'#e5483b',gold:'#ffcf3f'};
const glove=(x,y,r=17)=>`<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r1(r*1.15)}" fill="#9aa3ad" stroke="${INK}" stroke-width="5"/>`;
const limb=d=>P(d,{w:36})+P(d,{s:M.suit,w:25});
/* SMIL rotation around a fixed pivot (in local coords); the renderer seeks it with svg.setCurrentTime */
const rot=(cx,cy,deg,dur,begin=0)=>`<animateTransform attributeName="transform" type="rotate" values="0 ${cx} ${cy};${deg} ${cx} ${cy};0 ${cx} ${cy};${-deg*.5} ${cx} ${cy};0 ${cx} ${cy}" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/>`;
const bobA=(dy,dur,begin=0)=>`<animateTransform attributeName="transform" type="translate" values="0 0;0 ${dy};0 0" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/>`;
function astro(x,y,s=1,o={}){
  const pose=o.pose||'stand', walk=pose==='walk';
  const LL={stand:['M-30,-130 L-36,-12','M30,-130 L36,-12'],walk:['M-30,-130 L-36,-12','M30,-130 L36,-12'],jump:['M-30,-130 L-70,-60 L-52,0','M30,-130 L78,-74 L66,-6'],
            sit:['M-30,-130 L60,-140 L70,-30','M30,-130 L120,-140 L130,-30']}[pose];
  const boot=(d,bx,by)=>pose==='sit'?'':`<ellipse cx="${bx}" cy="${by}" rx="30" ry="14" fill="#6b7480" stroke="${INK}" stroke-width="5"/>`;
  const legL=`<g>${limb(LL[0])}${boot(0,pose==='jump'?-52:-38,pose==='jump'?2:-8)}${walk?rot(-30,-130,22,1.1):''}</g>`;
  const legR=`<g>${limb(LL[1])}${boot(0,pose==='jump'?68:40,pose==='jump'?-4:-8)}${walk?rot(30,-130,-22,1.1):''}</g>`;
  const A={down:['M-62,-290 Q-86,-230 -80,-176',-80,-170,'M62,-290 Q86,-230 80,-176',80,-170,6,6],
           wave:['M-62,-290 Q-86,-230 -80,-176',-80,-170,'M62,-290 Q130,-320 150,-400',152,-406,5,28],
           up:['M-62,-290 Q-130,-330 -150,-410',-152,-416,'M62,-290 Q130,-320 150,-400',152,-406,12,12],
           reach:['M-62,-290 Q-86,-230 -80,-176',-80,-170,'M62,-290 Q150,-290 210,-300',214,-300,6,12],
           radio:['M-62,-290 Q-86,-230 -80,-176',-80,-170,'M62,-290 Q120,-250 70,-350',66,-356,8,5],
           float:['M-62,-290 Q-140,-280 -180,-330',-184,-336,'M62,-290 Q140,-260 190,-230',194,-226,18,18],
           eat:['M-62,-290 Q-60,-200 -10,-250',-6,-254,'M62,-290 Q86,-230 80,-176',80,-170,14,6]}[o.arms||'down'];
  const sw=walk?1.1:1.8;
  const armL=`<g>${limb(A[0])}${glove(A[1],A[2])}${rot(-62,-290,walk?-20:A[6],sw,.2)}</g>`;
  const armR=`<g>${limb(A[3])}${glove(A[4],A[5])}${(o.item||'')}${rot(62,-290,walk?20:A[7],o.arms==='wave'?.9:sw,0)}</g>`;
  const headG=`<g>${head(0,-410,105,o.mood||'happy',o.look||[0,0],o.big)}<circle cx="0" cy="-405" r="142" fill="#bfe3ff" fill-opacity=".18" stroke="#dfe7ee" stroke-width="10"/>${P('M-90,-470 Q-60,-520 0,-528',{s:'#fff',w:9,o:.8})}${rot(0,-300,4,2.6,.4)}</g>`;
  const torso=`<path d="M-68,-318 Q0,-334 68,-318 L74,-128 Q0,-112 -74,-128Z" fill="${M.suit}" stroke="${INK}" stroke-width="7"/>`+
    `<rect x="-36" y="-262" width="72" height="54" rx="10" fill="#dfe4ea" stroke="${INK}" stroke-width="5"/><circle cx="-16" cy="-235" r="8" fill="${M.red}"><animate attributeName="opacity" values="1;.3;1" dur="1s" repeatCount="indefinite"/></circle><circle cx="6" cy="-235" r="8" fill="${M.gold}"/><circle cx="26" cy="-235" r="6" fill="#3fbf6a"><animate attributeName="opacity" values=".3;1;.3" dur="1.4s" repeatCount="indefinite"/></circle>`+
    `<rect x="-62" y="-300" width="30" height="20" rx="3" fill="#00a3c4" stroke="${INK}" stroke-width="3"/><circle cx="-47" cy="-290" r="5" fill="${M.gold}"/>`+P('M-72,-150 H72',{s:M.blue,w:9});
  const upper=`<g><rect x="-86" y="-330" width="172" height="200" rx="26" fill="#c9cfd6" stroke="${INK}" stroke-width="6"/>${torso}${armL}${armR}${headG}${pose==='sit'?'':bobA(walk?-10:-5,walk?.55:2.2)}</g>`;
  return G(G(legL+legR+upper,{c:o.c||'',st:o.st||''}),{t:`translate(${x},${y}) scale(${o.flip?-s:s},${s})`});
}
/* the same hero at home: pyjamas */
function pyjama(x,y,s=1,o={}){
  return G(legs()+`<path d="M-58,-300 Q0,-312 58,-300 L64,-122 L-64,-122Z" fill="#6c7bd9" stroke="${INK}" stroke-width="6"/>`+P('M-58,-260 H58 M-60,-220 H60 M-62,-180 H62 M-63,-140 H63',{s:'#9aa6f0',w:6})+
    `<g>${(ARMS[o.arms||'down'])()}${rot(0,-288,8,.9)}</g><g>${head(0,-410,105,o.mood||'scared',o.look||[0,0],o.big)}${rot(0,-300,6,1.2)}</g>`,{t:`translate(${x},${y}) scale(${s})`});
}
function mom(x,y,s=1){return G(legs()+`<path d="M-58,-300 Q0,-312 58,-300 L96,-110 L-96,-110Z" fill="#d1497b" stroke="${INK}" stroke-width="6"/>`+
  arm('M52,-288 Q110,-330 70,-390')+hand(66,-394)+`<rect x="52" y="-440" width="34" height="62" rx="8" fill="#333" stroke="${INK}" stroke-width="4"/>`+`<g>${arm('M-52,-288 Q-80,-230 -70,-170')+hand(-70,-166)}${rot(-52,-288,-30,1.2)}</g>`+
  `<circle cx="0" cy="-410" r="100" fill="#e9dfd2" stroke="${INK}" stroke-width="8"/><circle cx="0" cy="-525" r="40" fill="#3b2b22" stroke="${INK}" stroke-width="6"/><path d="M-98,-430 Q-90,-520 0,-516 Q90,-520 98,-430 Q60,-480 0,-482 Q-60,-480 -98,-430Z" fill="#3b2b22"/>`+
  `<ellipse cx="-30" cy="-400" rx="8" ry="13" fill="${INK}"/><ellipse cx="30" cy="-400" rx="8" ry="13" fill="${INK}"/>`+P('M-22,-360 Q0,-344 22,-360',{w:6}),{t:`translate(${x},${y}) scale(${s})`})}
function stars(n=140,sd=3,h=1080){srand(sd);let g='';for(let i=0;i<n;i++){const r=r1(.8+rnd()*2.4);g+=`<circle class="${i%5?'':'glow'}" style="--d:${r1(1+rnd()*2)}s" cx="${r1(rnd()*1920)}" cy="${r1(rnd()*h)}" r="${r}" fill="#fff" opacity="${r1(.4+rnd()*.6)}"/>`}return g}
const space=(sd)=>`<defs>${vgrad('spc',M.sky1,M.sky2)}</defs><rect width="1920" height="1080" fill="url(#spc)"/>`+stars(170,sd);
function earth(x,y,r){return G(`<defs><radialGradient id="eG" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="#7fd0ff"/><stop offset=".6" stop-color="#2a7bd6"/><stop offset="1" stop-color="#123a7a"/></radialGradient></defs>`+
  `<circle r="${r*1.08}" fill="#5fb6ff" opacity=".18"/><circle r="${r}" fill="url(#eG)" stroke="${INK}" stroke-width="${r1(r*.04)}"/>`+
  `<clipPath id="ec${r}"><circle r="${r*.97}"/></clipPath><g clip-path="url(#ec${r})"><g>${[0,1].map(k=>`<g transform="translate(${k*2*r},0)"><path d="${blob(-r*.3,-r*.2,r*.32,r*.22,5)}" fill="#3fae5a"/><path d="${blob(r*.35,r*.25,r*.28,r*.2,6)}" fill="#c9a65a"/><path d="${blob(-r*.05,r*.5,r*.2,r*.12,7)}" fill="#3fae5a"/><path d="${blob(-r*.95,r*.1,r*.25,r*.3,8)}" fill="#3fae5a"/></g>`).join('')}<animateTransform attributeName="transform" type="translate" values="0 0;${-2*r} 0" dur="24s" repeatCount="indefinite"/></g>`+
  `<g>${P(`M${-r*.8},${-r*.45} q${r*.4},${-r*.15} ${r*.8},0 M${-r*.2},${r*.05} q${r*.4},-${r*.12} ${r*.9},${r*.05} M${-r*.7},${r*.6} q${r*.3},-${r*.1} ${r*.6},0`,{s:'#fff',w:r1(r*.07),o:.85})}<animateTransform attributeName="transform" type="translate" values="${r*.5} 0;${-r*.5} 0" dur="12s" repeatCount="indefinite"/></g></g>`+
  `<path d="M${r*.2},${-r*.98} A${r},${r} 0 0 1 ${r*.2},${r*.98} A${r*.9},${r} 0 0 0 ${r*.2},${-r*.98}Z" fill="#000" opacity=".35"/>`,{t:`translate(${x},${y})`})}
function moonGround(y=760,sd=4){srand(sd);let cr='';for(let i=0;i<14;i++){const cx=r1(rnd()*1920),cy=r1(y+40+Math.pow(rnd(),.8)*(1080-y-40)),rx=r1(30+rnd()*120*((cy-y)/300+.3)),ry=r1(rx*.28);
  cr+=`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${M.moonD}" stroke="#5e5e66" stroke-width="3"/><path d="M${cx-rx},${cy} A${rx},${ry} 0 0 0 ${cx+rx},${cy}" fill="none" stroke="${M.moonL}" stroke-width="5"/>`}
  return `<defs>${vgrad('mg',M.moonL,M.moonD)}</defs><path d="M0,${y} C400,${y-30} 900,${y+20} 1300,${y-10} C1600,${y-25} 1800,${y+10} 1920,${y} V1080 H0Z" fill="url(#mg)" stroke="${INK}" stroke-width="6"/>`+cr;}
function lander(x,y,s=1){return G(P('M-140,0 L-90,-120 M140,0 L90,-120 M-60,0 L-40,-110 M60,0 L40,-110',{w:10,s:'#8a8f96'})+`<ellipse cx="-140" cy="0" rx="30" ry="8" fill="#8a8f96" stroke="${INK}" stroke-width="4"/><ellipse cx="140" cy="0" rx="30" ry="8" fill="#8a8f96" stroke="${INK}" stroke-width="4"/>`+
  `<path d="M-130,-110 L130,-110 L110,-200 L-110,-200Z" fill="#d9a63a" stroke="${INK}" stroke-width="7"/>`+P('M-120,-140 H120 M-115,-170 H115',{s:'#b07f22',w:5})+
  `<path d="M-90,-200 L-70,-330 L70,-330 L90,-200Z" fill="#e7eaee" stroke="${INK}" stroke-width="7"/><rect x="-34" y="-300" width="68" height="60" rx="8" fill="#2a3550" stroke="${INK}" stroke-width="5"/>`+
  P('M100,-200 L100,-20 M120,-200 L120,-20 M100,-160 H120 M100,-120 H120 M100,-80 H120 M100,-40 H120',{w:5,s:'#6b7480'})+`<path d="M-20,-330 V-390" stroke="${INK}" stroke-width="5"/><path d="M-20,-390 l50,12 l-50,12Z" fill="#00a3c4" stroke="${INK}" stroke-width="4"><animate attributeName="d" values="M-20,-390 l50,12 l-50,12Z;M-20,-390 l46,4 l-46,20Z;M-20,-390 l50,12 l-50,12Z" dur="1.2s" repeatCount="indefinite"/></path>`,{t:`translate(${x},${y}) scale(${s})`})}
function rocket(x,y,s=1,flame=false){return G((flame?`<g class="flick" style="--d:.15s"><path d="M-60,0 C-70,120 -20,230 0,300 C20,230 70,120 60,0Z" fill="url(#flameO)"/><path d="M-30,0 C-36,80 -10,150 0,190 C10,150 36,80 30,0Z" fill="url(#flameI)"/></g>`:'')+
  `<path d="M-70,0 L-140,60 L-140,-90 L-70,-160Z M70,0 L140,60 L140,-90 L70,-160Z" fill="${M.red}" stroke="${INK}" stroke-width="7"/>`+
  `<rect x="-70" y="-620" width="140" height="620" rx="20" fill="#f4f6f8" stroke="${INK}" stroke-width="8"/>`+P('M-70,-120 H70 M-70,-460 H70',{s:M.red,w:18})+
  `<circle cx="0" cy="-380" r="32" fill="#7fc4ff" stroke="${INK}" stroke-width="7"/><path d="M-70,-600 Q0,-820 70,-600Z" fill="${M.red}" stroke="${INK}" stroke-width="8"/>`+
  `<rect x="-26" y="-300" width="52" height="140" rx="6" fill="#00a3c4" stroke="${INK}" stroke-width="4"/><circle cx="0" cy="-245" r="16" fill="${M.gold}"/>`,{t:`translate(${x},${y}) scale(${s})`})}
function capsuleBg(){return `<defs><radialGradient id="cap" cx="50%" cy="50%" r="70%"><stop offset="0" stop-color="#e7ebf0"/><stop offset="1" stop-color="#9aa4b0"/></radialGradient></defs><rect width="1920" height="1080" fill="url(#cap)"/>`+
  P('M0,180 H1920 M0,900 H1920 M300,0 V1080 M1620,0 V1080',{s:'#8a94a0',w:6})+[[160,300],[160,500],[1760,300],[1760,500],[160,700],[1760,700]].map(([x,y])=>`<rect x="${x-60}" y="${y-40}" width="120" height="80" rx="10" fill="#2a3550" stroke="${INK}" stroke-width="5"/><circle cx="${x-25}" cy="${y}" r="9" fill="#3fbf6a" class="glow"/><circle cx="${x+5}" cy="${y}" r="9" fill="${M.gold}"/><circle cx="${x+35}" cy="${y}" r="9" fill="${M.red}" class="glow" style="--d:.7s"/>`).join('')}
function porthole(x,y,r,inner){return `<clipPath id="ph${x}"><circle cx="${x}" cy="${y}" r="${r}"/></clipPath><circle cx="${x}" cy="${y}" r="${r+26}" fill="#6b7480" stroke="${INK}" stroke-width="7"/>`+G(inner,{clip:'ph'+x})+`<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${INK}" stroke-width="8"/>`+[0,1,2,3,4,5,6,7].map(i=>{const a=i*Math.PI/4;return `<circle cx="${r1(x+Math.cos(a)*(r+13))}" cy="${r1(y+Math.sin(a)*(r+13))}" r="6" fill="#c9cfd6"/>`}).join('')}
let label=(x,y,txt,col='#fff',bg=M.red,rot=-3,w=0)=>G(`<g transform="rotate(${rot} ${x} ${y})"><rect x="${x-txt.length*17-24}" y="${y-48}" width="${txt.length*34+48}" height="70" rx="12" fill="${bg}" stroke="${INK}" stroke-width="5"/><text x="${x}" y="${y+4}" font-family="Montserrat, 'Arial Black', sans-serif" font-weight="900" font-size="44" fill="${col}" text-anchor="middle">${txt}</text></g>`,{c:'pop',st:`--w:${w}s`});
let bigT=(x,y,txt,size,fill,w=0,anchor='middle')=>`<text class="pop" style="--w:${w}s" x="${x}" y="${y}" font-family="Montserrat, 'Arial Black', sans-serif" font-weight="900" font-size="${size}" fill="${fill}" stroke="#000" stroke-width="${r1(size*.12)}" paint-order="stroke" text-anchor="${anchor}">${txt}</text>`;

const sun=(x,y,r)=>`<defs><radialGradient id="sunG"><stop offset=".45" stop-color="#fff9e0"/><stop offset=".55" stop-color="#fff9e0" stop-opacity=".35"/><stop offset="1" stop-color="#fff9e0" stop-opacity="0"/></radialGradient></defs><circle cx="${x}" cy="${y}" r="${r*2}" fill="url(#sunG)"/>`;
const S2={};
S2.title=()=>space(1)+earth(1660,470,150)+moonGround(700,1)+lander(1450,800,.9)+astro(700,950,.85,{arms:'wave',mood:'happy',c:'bob',st:'--d:1.6s;--a:-18px'})+
  bigT(960,190,'ЕГЕР СЕН АЙДА',110,'#fff',.2)+bigT(960,330,'24 САҒАТ ӨМІР СҮРСЕҢ?',96,M.gold,.6);
S2.bedroom=()=>`<defs>${vgrad('br','#272c78','#3d3f9e')}</defs><rect width="1920" height="1080" fill="url(#br)"/><rect y="860" width="1920" height="220" fill="#232563"/>`+
  `<rect x="1280" y="150" width="420" height="340" rx="10" fill="#0d1236" stroke="#16184a" stroke-width="16"/>`+G(stars(40,9,340),{t:'translate(1280,150) scale(.22,1)'})+`<circle cx="1560" cy="260" r="56" fill="#f4f1dc"/>`+P('M1490,150 V490 M1280,320 H1700',{s:'#16184a',w:14})+
  `<rect x="260" y="640" width="760" height="230" rx="30" fill="#5a4bb8" stroke="${INK}" stroke-width="7"/><rect x="230" y="560" width="120" height="310" rx="24" fill="#6c5cd0" stroke="${INK}" stroke-width="7"/><rect x="300" y="610" width="240" height="70" rx="30" fill="#e9e6ff" stroke="${INK}" stroke-width="6"/>`+
  `<circle cx="1100" cy="620" r="60" fill="#fff" stroke="${INK}" stroke-width="7"/>`+P('M1100,620 V585 M1100,620 L1126,632',{w:7})+`<rect x="1080" y="680" width="40" height="190" fill="#8b5a32" stroke="${INK}" stroke-width="5"/>`+T(1100,540,'06:00',{size:56,anchor:'middle',fill:'#fff',font:"Montserrat, sans-serif"})+
  pyjama(700,880,1,{mood:'scared',arms:'shrug',big:1})+
  G(`<rect x="-200" y="-70" width="400" height="120" rx="24" fill="#fff" stroke="${INK}" stroke-width="6"/><path d="M-40,50 L-70,100 L10,50Z" fill="#fff" stroke="${INK}" stroke-width="6"/>`+T(0,8,'Бүгін Айға ұшасың!',{size:46,anchor:'middle'}),{t:'translate(1000,300)',c:'pop',st:'--w:.6s'})+sfx(420,340,'ДЫҢ-ДЫҢ!',{size:70,rot:-8,w:.2});
S2.temps=()=>`<rect width="1920" height="1080" fill="#fff"/>`+
  [[560,'+120°C',M.red,'#ffd7cf',.3],[1360,'−170°C','#2f78b7','#d6e9fb',1.1]].map(([x,t,c,bg,w])=>G(`<rect x="${x-280}" y="190" width="560" height="560" rx="40" fill="${bg}" stroke="${INK}" stroke-width="7"/>`+
   `<rect x="${x-34}" y="260" width="68" height="330" rx="34" fill="#fff" stroke="${INK}" stroke-width="7"/><rect x="${x-18}" y="${c===M.red?290:500}" width="36" height="${c===M.red?300:90}" rx="18" fill="${c}"/><circle cx="${x}" cy="630" r="60" fill="${c}" stroke="${INK}" stroke-width="7"/>`+bigT(x,830,t,96,c,w+.2),{c:'pop',st:`--w:${w}s`})).join('')+bigT(960,140,'БІР КҮНДЕ',80,'#ffcf3f');
S2.baikonur=()=>`<defs>${vgrad('bk','#ff9a62','#ffe2a8')}</defs><rect width="1920" height="1080" fill="url(#bk)"/><circle cx="380" cy="700" r="140" fill="#fff3c4" opacity=".9"/>`+
  `<path d="M0,820 C500,800 1300,830 1920,810 V1080 H0Z" fill="#d9b06a" stroke="${INK}" stroke-width="6"/>`+grass(810,1090,600,['#b8913f','#c9a25a','#a07a35'],6)+
  P('M1180,830 V200 M1300,830 V200 M1180,200 H1300 '+Array.from({length:12},(_,i)=>`M1180,${830-i*52} L1300,${830-(i+1)*52} M1300,${830-i*52} L1180,${830-(i+1)*52}`).join(' '),{w:7,s:'#c0392b'})+
  rocket(1000,830,1)+astro(560,880,.9,{arms:'wave',mood:'happy'})+label(720,290,'БАЙҚОҢЫР','#fff',M.blue,-3,.4)+label(1320,360,'1961 · ГАГАРИН',INK,M.gold,3,1.4);
S2.launch=()=>`<defs>${vgrad('lc','#5aa7e6','#cfe8fa')}</defs><rect width="1920" height="1080" fill="url(#lc)"/>`+`<path d="M0,900 C500,880 1300,910 1920,890 V1080 H0Z" fill="#d9b06a" stroke="${INK}" stroke-width="6"/>`+
  P('M1240,890 V260 M1360,890 V260 M1240,260 H1360 '+Array.from({length:12},(_,i)=>`M1240,${890-i*52} L1360,${890-(i+1)*52} M1360,${890-i*52} L1240,${890-(i+1)*52}`).join(' '),{w:7,s:'#c0392b'})+
  G(G(rocket(960,880,1,false)+G(`<g class="flick" style="--d:.12s"><path d="M-60,0 C-80,160 -20,300 0,380 C20,300 80,160 60,0Z" fill="url(#flameO)"/><path d="M-30,0 C-40,100 -10,190 0,240 C10,190 40,100 30,0Z" fill="url(#flameI)"/></g>`,{t:'translate(960,880)',c:'fade',st:'--w:5.5s;--d:.2s'}),{c:'shake',st:'--w:5.4s'}),{c:'liftoff2'})+
  [[760,920,0],[1160,930,.3],[900,960,.6],[1040,950,.2],[640,960,.8],[1280,960,.5],[520,980,1],[1400,980,.9]].map(([x,y,w])=>`<circle class="puff" style="--w:${r1(5.5+w)}s" cx="${x}" cy="${y}" r="120" fill="#f1f1f1" stroke="#c9c9c9" stroke-width="5"/>`).join('')+
  smoke(900,880,2,'#e6e6e6',10)+
  [['3',1.9],['2',2.65],['1',4.4]].map(([n,w])=>`<text class="cnt" style="--w:${w}s" x="1600" y="420" font-family="Montserrat, sans-serif" font-weight="900" font-size="260" fill="#fff" stroke="#000" stroke-width="28" paint-order="stroke" text-anchor="middle">${n}</text>`).join('')+
  bigT(1600,420,'ОТ!',200,M.gold,5.6)+sfx(420,320,'ГУУУУ!',{size:100,rot:-6,w:5.8,fill:'#fff3c4',stroke:'#5a2a10'});
S2.gforce=()=>capsuleBg()+G(`<rect x="560" y="420" width="800" height="520" rx="60" fill="#3b4a6b" stroke="${INK}" stroke-width="8"/>`+astro(960,900,1.15,{arms:'down',mood:'scared',big:1}),{c:'shiver-hard'})+
  bigT(1560,520,'3×',220,M.red,.4)+sfx(520,330,'УУУУ!',{size:90,rot:-8,w:.2,fill:'#fff',stroke:'#2a3550'})+vignette(.4);
S2.zeroG=()=>capsuleBg()+porthole(1500,420,170,space(7)+earth(1500,470,120))+
  G(astro(800,820,1,{arms:'float',pose:'jump',mood:'happy'}),{c:'floaty'})+
  [[420,320,0,`<rect x="-10" y="-60" width="20" height="120" rx="6" fill="#2f6fd6" stroke="${INK}" stroke-width="4"/>`],[1140,260,.8,`<rect x="-50" y="-35" width="100" height="70" rx="10" fill="#ffb347" stroke="${INK}" stroke-width="5"/>`],
   [1150,700,.4,`<circle r="22" fill="#7fc4ff" stroke="${INK}" stroke-width="4"/>`],[1250,600,1.2,`<circle r="14" fill="#7fc4ff" stroke="${INK}" stroke-width="4"/>`],[460,700,1.6,`<circle r="18" fill="#7fc4ff" stroke="${INK}" stroke-width="4"/>`]]
   .map(([x,y,w,g])=>G(G(g,{c:'spinfloat',st:`--w:${w}s`}),{t:`translate(${x},${y})`})).join('')+label(960,150,'САЛМАҚСЫЗДЫҚ','#fff',M.blue,-2,.6);
S2.travel=()=>space(11)+G(earth(0,0,200),{t:'translate(300,820)',c:'shrink'})+G(`<circle r="150" fill="${M.moon}" stroke="${INK}" stroke-width="7"/><circle cx="-40" cy="-30" r="34" fill="${M.moonD}"/><circle cx="50" cy="40" r="24" fill="${M.moonD}"/><circle cx="20" cy="-70" r="16" fill="${M.moonD}"/>`,{t:'translate(1560,440)',c:'grow'})+
  P('M480,700 C800,600 1100,520 1400,460',{s:'#fff',w:6,st:'stroke-dasharray:18 16'})+G(G(rocket(0,0,.25,true),{t:'rotate(62)'}),{c:'flyacross'})+
  label(960,200,'384 000 км · 3 КҮН',INK,M.gold,0,.6)+sfx(1000,800,'Қор-р-р… ұйықтап оянғанша',{size:54,w:1.4});
S2.landing=()=>space(2)+earth(1640,380,110)+moonGround(760,2)+lander(700,820,1.1)+G(astro(1080,880,1,{arms:'reach',mood:'happy',pose:'walk',look:[.1,0]}),{c:'stepin'})+label(1000,260,'09:00 · АЙДАСЫҢ!','#fff',M.blue,-3,.4);
S2.blackSky=()=>`<defs>${vgrad('bs','#000','#0e1330')}</defs><rect width="1920" height="1080" fill="url(#bs)"/>`+stars(60,4,700)+sun(420,230,90)+moonGround(780,6)+
  astro(960,900,1,{arms:'up',mood:'curious',look:[-.15,-.2]})+label(1470,420,'АСПАН ҚАП-ҚАРА!','#fff',M.red,3,.8)+sfx(560,620,'аспанды көк',{size:58,w:1.6,fill:'#7fc4ff'})+sfx(560,690,'қылатын — ауа',{size:58,w:1.7,fill:'#7fc4ff'});
S2.jump=()=>space(5)+earth(1700,340,90)+moonGround(820,5)+G(astro(760,920,.9,{arms:'up',pose:'jump',mood:'happy'}),{c:'moonjump',st:'--h:-230px'})+
  G(`<rect x="-230" y="-200" width="460" height="400" rx="30" fill="#fff" stroke="${INK}" stroke-width="7"/>`+T(-110,-120,'ЖЕР',{size:56,anchor:'middle',font:"Montserrat, sans-serif"})+T(110,-120,'АЙ',{size:56,anchor:'middle',font:"Montserrat, sans-serif"})+
    bigT(-110,30,'60',110,'#2f78b7',1)+bigT(110,30,'10',110,M.red,1.6)+T(-110,120,'келі',{size:50,anchor:'middle'})+T(110,120,'келі',{size:50,anchor:'middle'})+P('M0,-170 V160',{w:5}),{t:'translate(1460,560)',c:'pop',st:'--w:.6s'})+sfx(1460,290,'УХУУ!',{size:90,w:.4});
S2.silence=()=>space(8)+moonGround(780,8)+G(G(`<path d="${blob(0,0,110,90,3)}" fill="${M.moonD}" stroke="${INK}" stroke-width="7"/>`,{c:'roll'}),{t:'translate(1500,600)'})+
  astro(520,900,.95,{arms:'radio',mood:'worried'})+astro(1000,900,.85,{arms:'down',mood:'curious',flip:1})+
  P('M620,560 q40,-40 80,0 t80,0 t80,0',{s:'#7fc4ff',w:8,c:'glow'})+G(`<circle r="70" fill="#fff" stroke="${INK}" stroke-width="7"/><path d="M-30,-20 h20 l25,-25 v90 l-25,-25 h-20Z" fill="${INK}"/>`+P('M-50,-50 L50,50',{s:M.red,w:12}),{t:'translate(1500,360)',c:'pop',st:'--w:.8s'})+label(960,230,'ДЫБЫС ЖОҚ',INK,M.gold,0,1.2);
S2.earthView=()=>space(9)+G(earth(0,0,320),{t:'translate(1180,380)',c:'bob',st:'--d:6s;--a:-10px'})+moonGround(820,9)+astro(660,930,1,{arms:'up',mood:'happy',look:[.2,-.25]})+label(760,150,'4 ЕСЕ ҮЛКЕН','#fff',M.blue,-2,1);
S2.call=()=>space(12)+moonGround(820,12)+astro(420,920,.9,{arms:'radio',mood:'happy'})+
  `<rect x="980" y="0" width="940" height="1080" fill="#ffe8c7"/><rect x="980" y="780" width="940" height="300" fill="#c99a6a"/>`+P('M980,0 V1080',{w:10})+mom(1450,900,.9)+
  P('M560,420 C760,300 1000,300 1300,420',{s:M.gold,w:10,c:'draw',st:'--d:1.3s;--w:.4s;stroke-dasharray:1'})+label(960,240,'1,3 СЕКУНДТАН СОҢ',INK,M.gold,0,1.6)+T(1450,330,'Жерде',{size:56,anchor:'middle',font:"Montserrat, sans-serif"})+T(420,330,'Айда',{size:56,anchor:'middle',fill:'#fff',font:"Montserrat, sans-serif"});
S2.heat=()=>space(13)+sun(300,200,90)+moonGround(780,13)+`<path d="M960,760 L1920,740 V1080 H960Z" fill="#1d1f2e" opacity=".75"/>`+
  G(astro(0,0,.8,{arms:'down',pose:'walk',mood:'worried'})+`<animateTransform attributeName="transform" type="translate" values="520 900;1400 900" dur="11s" fill="freeze"/>`,{})+label(560,300,'+120°C','#fff',M.red,-3,.4)+label(1380,300,'−100°C','#fff','#2f78b7',3,1)+sfx(560,400,'ЫСТЫҚ!',{size:70,w:.8,fill:'#ffd7cf',stroke:'#5a1a10'})+sfx(1380,400,'АЯЗ!',{size:70,w:1.4,fill:'#d6e9fb',stroke:'#0f2236'});
S2.dust=()=>`<defs>${vgrad('du','#9a9aa2','#6b6b73')}</defs><rect width="1920" height="1080" fill="url(#du)"/>`+(()=>{srand(5);let g='';for(let i=0;i<500;i++)g+=`<circle cx="${r1(rnd()*1920)}" cy="${r1(rnd()*1080)}" r="${r1(1+rnd()*3)}" fill="${rnd()>.5?'#c9c9cf':'#5e5e66'}"/>`;return g})()+
  G(`<path d="M-260,-40 C-260,-200 260,-200 260,-40 L260,60 L-260,60Z" fill="#6b7480" stroke="${INK}" stroke-width="9"/>`+P('M-220,20 H220 M-200,-30 H200',{s:'#4b525c',w:8}),{t:'translate(760,760)'})+
  G(`<circle r="190" fill="#fff" stroke="${INK}" stroke-width="12"/>`+[[-60,-40],[40,30],[-10,80],[70,-60],[-90,50]].map(([x,y])=>`<path d="M${x},${y} l30,-50 l25,40 l-15,35Z" fill="#bfc3cc" stroke="${INK}" stroke-width="4"/>`).join('')+P('M134,134 L250,250',{w:30}),{t:'translate(1420,420)',c:'pop',st:'--w:.6s'})+
  label(1420,700,'ӘЙНЕКТЕЙ ӨТКІР',INK,M.gold,-2,1.2)+sfx(900,250,'атылған мылтықтың иісі',{size:56,w:2});
S2.footprint=()=>`<defs>${vgrad('fp','#a9a9b0','#7a7a82')}</defs><rect width="1920" height="1080" fill="url(#fp)"/>`+(()=>{srand(8);let g='';for(let i=0;i<400;i++)g+=`<circle cx="${r1(rnd()*1920)}" cy="${r1(rnd()*1080)}" r="${r1(1+rnd()*3)}" fill="${rnd()>.5?'#c9c9cf':'#5e5e66'}"/>`;return g})()+
  G(`<path d="M-120,-330 C-40,-360 60,-360 120,-320 C150,-200 150,200 110,330 C40,360 -40,360 -110,330 C-150,200 -150,-200 -120,-330Z" fill="#6b6b73" stroke="#4a4a52" stroke-width="10"/>`+Array.from({length:12},(_,i)=>`<rect x="-100" y="${-300+i*52}" width="200" height="20" rx="8" fill="#55555c"/>`).join(''),{t:'translate(820,560) rotate(-12)',c:'fade',st:'--w:.2s'})+
  label(1300,400,'1969 · АРМСТРОНГ','#fff',M.blue,3,.8)+label(1250,560,'МИЛЛИОНДАҒАН ЖЫЛ ӨШПЕЙДІ',INK,M.gold,-2,1.6);
S2.base=()=>`<defs>${vgrad('bb','#e9eef4','#b9c3cf')}</defs><rect width="1920" height="1080" fill="url(#bb)"/>`+P('M0,860 H1920',{w:6})+`<rect y="860" width="1920" height="220" fill="#8a94a0"/>`+
  `<path d="M200,860 C200,300 1720,300 1720,860" fill="none" stroke="#9aa4b0" stroke-width="14"/>`+porthole(1500,420,140,space(3)+earth(1500,440,90))+
  `<rect x="300" y="620" width="520" height="40" rx="10" fill="#8b5a32" stroke="${INK}" stroke-width="5"/>`+P('M340,660 V860 M780,660 V860',{w:10})+
  astro(960,880,1,{arms:'eat',mood:'happy',item:`<rect x="-30" y="-310" width="40" height="90" rx="10" fill="#ff7a3a" stroke="${INK}" stroke-width="4" transform="rotate(-30 -10 -265)"/>`})+label(960,180,'15:00 · ТҮСКІ АС','#fff',M.blue,-2,.4);
S2.ice=()=>space(14)+moonGround(560,14)+`<ellipse cx="960" cy="820" rx="700" ry="220" fill="#1b1d2b" stroke="${INK}" stroke-width="8"/>`+
  [[760,800],[900,860],[1060,780],[1180,850],[840,900],[1000,900]].map(([x,y],i)=>`<path class="glow" style="--w:${i*.2}s" d="M${x},${y} l20,-60 l20,60 l-20,20Z" fill="#9fe3ff" stroke="#e6faff" stroke-width="4"/>`).join('')+
  label(960,300,'МҰЗ!','#000','#9fe3ff',-2,.4)+G(T(0,0,'мұз → су + оттегі',{size:72,fill:'#fff',anchor:'middle'}),{t:'translate(960,450)',c:'pop',st:'--w:1.2s'});
S2.rover=()=>space(15)+earth(1700,170,80)+moonGround(700,15)+G(G(`<rect x="-220" y="-170" width="440" height="80" rx="16" fill="#e7eaee" stroke="${INK}" stroke-width="7"/><rect x="-200" y="-230" width="400" height="20" fill="#d9a63a" stroke="${INK}" stroke-width="5"/>`+
  [-160,0,160].map(x=>G(`<circle r="56" fill="#3a3f48" stroke="${INK}" stroke-width="7"/>`+P('M-50,0 H50 M0,-50 V50',{s:'#9aa3ad',w:8}),{t:`translate(${x},-40)`,c:'wheel'})).join('')+
  astro(-40,-150,.55,{arms:'reach',mood:'happy'}),{c:'bob',st:'--d:.5s;--a:-8px'}),{t:'translate(800,900)',c:'driveby'})+label(960,180,'17:00 · КРАТЕРЛЕР','#fff',M.blue,-2,.4);
S2.alarm=()=>space(16)+moonGround(780,16)+`<rect class="redflash" width="1920" height="1080" fill="${M.red}"/>`+G(astro(760,920,.9,{arms:'up',pose:'jump',mood:'scared',big:1}),{c:'moonjump',st:'--d:.9s;--h:-170px'})+lander(1600,820,.6)+
  arrow(1000,700,1250,620,1450,700,{s:'#fff',w:10})+label(1380,260,'ОТТЕГІ 30%','#fff',M.red,-2,.2)+sfx(1280,500,'ТЕЗІРЕК!',{size:80,w:.8});
S2.sunStill=()=>space(17)+sun(960,260,100)+moonGround(760,17)+lander(1400,820,.7)+astro(600,900,.95,{arms:'shrug'==='x'?'down':'down',mood:'curious',look:[.1,-.2]})+
  G(`<rect x="-330" y="-90" width="660" height="180" rx="24" fill="#fff" stroke="${INK}" stroke-width="7"/>`+T(0,-12,'Айдағы 1 күн =',{size:58,anchor:'middle',font:"Montserrat, sans-serif"})+T(0,58,'Жердегі 14 күн',{size:58,anchor:'middle',fill:M.red,font:"Montserrat, sans-serif"}),{t:'translate(1360,520)',c:'pop',st:'--w:.8s'});
S2.sleep=()=>`<defs>${vgrad('sl','#1e2350','#2f3576')}</defs><rect width="1920" height="1080" fill="url(#sl)"/>`+porthole(1300,430,230,space(6)+earth(1300,460,150))+
  `<rect x="260" y="700" width="760" height="170" rx="80" fill="#e5483b" stroke="${INK}" stroke-width="8"/>`+`<circle cx="360" cy="690" r="90" fill="#fff" stroke="${INK}" stroke-width="7"/>`+P('M318,690 q14,12 28,0 M374,690 q14,12 28,0 M330,730 q30,16 60,0',{w:6})+
  sfx(1360,800,'ЖЕР — ЕҢ ӘДЕМІ ҮЙ',{size:70,w:1.4,fill:'#fff',stroke:'#1e2350'});
S2.goHome=()=>space(18)+earth(1650,420,140)+moonGround(760,18)+(()=>{let g='';for(let i=0;i<10;i++)g+=G(`<ellipse rx="34" ry="16" fill="#77777f"/>`+P('M-24,0 H24',{s:'#5e5e66',w:4}),{t:`translate(${300+i*120},${r1(1000-i*22+(i%2?14:-14))}) rotate(-8)`});return g})()+
  G(rocket(0,0,.45,true),{t:'translate(1500,700)',c:'liftoff'})+label(700,300,'06:00 · ҮЙГЕ ҚАЙТУ','#fff',M.blue,-2,.4)+sfx(700,480,'ізің мәңгі қалады',{size:70,w:1.4});
S2.cta=()=>`<defs>${vgrad('ct','#1a1240','#2d1f66')}</defs><rect width="1920" height="1080" fill="url(#ct)"/>`+stars(80,21)+bigT(960,360,'Айда бірінші',110,'#fff',.2)+bigT(960,500,'не істер едің?',110,'#fff',.5)+
  bigT(960,660,'Комментке жаз!',96,M.gold,1)+label(760,800,'ЛАЙК','#fff','#3b5bdb',-2,1.4)+label(1180,800,'ЖАЗЫЛУ','#fff',M.red,2,1.7)+astro(1660,1000,.6,{arms:'wave',mood:'happy'});

/* timeline: [phrase, scene, camFrom, camTo, clock, oxygen%] */
const SHOTS2=[
 ['Егер сен Айда','title',[0,0,1920],[60,34,1800],'',100],
 ['Елестетіп көр','bedroom',[0,0,1920],[160,90,1600],'06:00',0],
 ['Ал ол жерде','temps',[0,0,1920],[40,22,1840],'',0],
 ['Дайынсың ба','title',[300,450,1140],[320,460,1100],'',0],
 ['Сен Байқоңыр','baikonur',[0,0,1920],[160,90,1600],'07:00',0],
 ['Скафандрыңды киіп','baikonur',[380,120,1300],[410,140,1240],'07:00',0],
 ['Кері санақ','launch',[0,0,1920],[60,34,1800],'07:30',0],
 ['денең үш есе','gforce',[0,0,1920],[200,110,1500],'07:31',100],
 ['Бірнеше минуттан','zeroG',[0,0,1920],[100,56,1720],'07:40',100],
 ['Шын өмірде','travel',[0,0,1920],[40,22,1840],'08:00',100],
 ['Сағат тоғыз','landing',[0,0,1920],[160,90,1600],'09:00',98],
 ['Бірінші байқайтының','blackSky',[0,0,1920],[100,56,1720],'09:05',97],
 ['Екінші байқайтының','jump',[0,0,1920],[60,34,1800],'09:15',95],
 ['Сәл ғана секірсең','jump',[300,0,1620],[340,20,1540],'09:20',94],
 ['Үшінші','silence',[0,0,1920],[100,56,1720],'10:00',92],
 ['Досыңмен тек радио','silence',[200,150,1500],[240,170,1420],'10:10',91],
 ['Сағат он бір','earthView',[0,0,1920],[200,60,1500],'11:00',88],
 ['Айдан қарағанда','earthView',[200,0,1720],[240,10,1640],'11:05',87],
 ['Қызығы','earthView',[0,0,1920],[160,90,1600],'11:10',87],
 ['Анаңа хабарласасың','call',[0,0,1920],[40,22,1840],'11:30',86],
 ['Сағат бір','heat',[0,0,1920],[100,56,1720],'13:00',80],
 ['Ал көлеңкеге','heat',[200,40,1600],[260,60,1500],'13:05',79],
 ['Аяғыңның астындағы','dust',[0,0,1920],[60,34,1800],'13:30',78],
 ['Айда болған ғарышкерлер','dust',[380,40,1500],[420,60,1420],'13:35',77],
 ['Артыңа қарашы','footprint',[0,0,1920],[160,90,1600],'14:00',75],
 ['1969 жылы','footprint',[500,100,1400],[560,140,1300],'14:05',74],
 ['Сағат үш','base',[0,0,1920],[100,56,1720],'15:00',100],
 ['Ал суды қайдан','ice',[0,0,1920],[100,56,1720],'15:30',100],
 ['Сол мұздан','ice',[200,180,1500],[260,200,1400],'15:35',100],
 ['Сағат бес','rover',[0,0,1920],[60,34,1800],'17:00',70],
 ['Ай беті кратерге','rover',[0,0,1920],[80,45,1760],'17:30',65],
 ['Кенет экранда','alarm',[0,0,1920],[100,56,1720],'19:40',30],
 ['Секіріп-секіріп','alarm',[160,0,1700],[220,20,1600],'19:50',22],
 ['Үлгердің','sunStill',[0,0,1920],[60,34,1800],'21:00',100],
 ['Өйткені Айдағы','sunStill',[860,260,1000],[920,300,880],'21:05',100],
 ['Ұйықтауға жатасың','sleep',[0,0,1920],[160,90,1600],'23:00',100],
 ['Тек осы жерден','sleep',[900,100,850],[960,140,760],'23:10',100],
 ['Таңғы алты','goHome',[0,0,1920],[100,56,1720],'06:00',100],
 ['Ал сен Айда','cta',[0,0,1920],[40,22,1840],'',100]
];

/* ---- QA tags: every on-screen text and every person is tagged so layout can be checked automatically ---- */
{const tag=(k,f)=>(...a)=>`<g data-k="${k}">${f(...a)}</g>`;
 const _label=label, _bigT=bigT;
 label=tag('txt',_label); bigT=tag('txt',_bigT);
 sfx=tag('txt',sfx); T=tag('txt',T); note=tag('txt',note);
 astro=tag('hero',astro); pyjama=tag('hero',pyjama); mom=tag('hero',mom);}
