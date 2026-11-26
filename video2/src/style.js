/* Style v2 — closer to the painted reference: sketchy wobbling lines (filter in render.html), dense grass,
   cracked shaded cave rock, layered rain, gradient fire with sparks, shaggy fur, cast shadows.
   Loaded after kit.js and shots.js; overrides their helpers. */
const DEFS2=`<defs>
 <linearGradient id="furG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b07a46"/><stop offset=".6" stop-color="#8d5c31"/><stop offset="1" stop-color="#6a4122"/></linearGradient>
 <radialGradient id="flameO" cx="50%" cy="85%" r="80%"><stop offset="0" stop-color="#ffd24a"/><stop offset=".55" stop-color="#ff8c1a"/><stop offset="1" stop-color="#d9431a"/></radialGradient>
 <radialGradient id="flameI" cx="50%" cy="85%" r="75%"><stop offset="0" stop-color="#fffbe0"/><stop offset=".6" stop-color="#ffe066"/><stop offset="1" stop-color="#ffb020"/></radialGradient>
 <radialGradient id="stoneG" cx="40%" cy="30%" r="80%"><stop offset="0" stop-color="#a8a39b"/><stop offset="1" stop-color="#5c5852"/></radialGradient>
 <radialGradient id="glowG"><stop offset="0" stop-color="#ffb347" stop-opacity=".9"/><stop offset=".45" stop-color="#ff8a2a" stop-opacity=".38"/><stop offset="1" stop-color="#ff8a2a" stop-opacity="0"/></radialGradient>
 <radialGradient id="shadowG"><stop offset="0" stop-color="#000" stop-opacity=".45"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
 <linearGradient id="cloudG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7b8692"/><stop offset="1" stop-color="#3b4450"/></linearGradient>
 <linearGradient id="logG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a5a32"/><stop offset="1" stop-color="#4f3018"/></linearGradient>
</defs>`;
const shadow=(x,y,rx,ry=rx*.22)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${r1(ry)}" fill="url(#shadowG)"/>`;

/* fur tunic: gradient fill, shaggy hem strands */
function tunic(dy=0){
  srand(77);let strands='';for(let i=0;i<46;i++){const x=r1(-62+rnd()*124),y=r1(-290+rnd()*160);strands+=`M${x},${y} l${r1(-3+rnd()*6)},${r1(8+rnd()*10)} `}
  let hem='';for(let x=-74;x<=74;x+=9){hem+=`M${x},-140 l${r1(-4+(x%3))},${18+Math.abs(x%5)*3} `}
  return G(`<path d="M-58,-300 Q0,-312 58,-300 L76,-142 L62,-128 L52,-113 L38,-127 L22,-110 L6,-125 L-10,-108 L-26,-124 L-41,-109 L-55,-126 L-76,-142Z" fill="url(#furG)" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`+
    P(hem,{s:'#5e3b1d',w:5})+P(strands,{s:'#5e3b1d',w:2.5,o:.75})+P('M-58,-300 Q-20,-262 14,-306',{s:'#4e2f15',w:4}),{t:dy?`translate(0,${dy})`:''});
}
/* layered rain: far thin + near longer */
const rain1=rain;
rain=function(n,o={}){
  return rain1(Math.round(n*.9),{...o,len:(o.len||48)*.7,w:(o.w||3)*.6,op:(o.op||.55)*.55,d:(o.d||.62)*1.25,seed:(o.seed||7)+50})+
         rain1(Math.round(n*.55),{...o,len:(o.len||48)*1.25,w:(o.w||3)*.9,op:Math.min(.9,(o.op||.55)*1.1)});
};
/* rock texture: sketchy crack lines + soft blotches (replaces flat hatching) */
function hatch(n,x0,x1,y0,y1,col='#8f877b',sd=3){
  srand(sd);let d='',bl='';
  for(let i=0;i<n;i++){let x=x0+rnd()*(x1-x0),y=y0+rnd()*(y1-y0);d+=`M${r1(x)},${r1(y)} `;const k=2+Math.floor(rnd()*3);
    for(let j=0;j<k;j++){x+=-18+rnd()*46;y+=-10+rnd()*26;d+=`L${r1(x)},${r1(y)} `}}
  for(let i=0;i<Math.round(n/4);i++){bl+=`<ellipse cx="${r1(x0+rnd()*(x1-x0))}" cy="${r1(y0+rnd()*(y1-y0))}" rx="${r1(30+rnd()*90)}" ry="${r1(14+rnd()*40)}" fill="#000" opacity=".07"/>`}
  return bl+P(d,{s:col,w:2.6,o:.85});
}
/* dense grass */
function grass(y0,y1,n,cols=['#b8913f','#d4b261','#9c7a35','#e2c57c'],sd=9){
  srand(sd);const d=cols.map(()=>'');
  for(let i=0;i<n;i++){const y=y0+Math.pow(rnd(),.8)*(y1-y0),k=.4+(y-y0)/(y1-y0)*1.2,x=rnd()*1960-20,h=r1((22+rnd()*30)*k),b=r1((-8+rnd()*16)*k),c=Math.floor(rnd()*cols.length);
    d[c]+=`M${r1(x)},${r1(y)} q${r1(b*.3)},${r1(-h*.6)} ${b},${-h} `}
  return d.map((p,i)=>P(p,{s:cols[i],w:2.6})).join('');
}
function tuft(x,y,s=1){return P(`M${x-10*s},${y} q-2,-10 ${-6*s},${-22*s} M${x},${y} q2,-14 0,${-28*s} M${x+10*s},${y} q2,-10 ${7*s},${-20*s} M${x-4*s},${y} l${-12*s},${-12*s} M${x+4*s},${y} l${12*s},${-10*s}`,{w:3,s:'#6b5a22'})}
/* fire with gradient tongues, embers and sparks */
function fire(x,y,s=1,cls='flick'){
  const tongue=(dx,sc,fill,d,w)=>`<g transform="translate(${dx},0) scale(${sc})"><path class="${cls}" style="--d:${d}s;--w:${w}s" d="M0,-150 C14,-120 50,-96 52,-54 C54,-20 30,-6 0,-6 C-30,-6 -54,-20 -52,-54 C-50,-92 -12,-104 0,-150Z" fill="${fill}" stroke="#7a2a0c" stroke-width="${r1(3/sc)}"/></g>`;
  let sparks='';for(let i=0;i<7;i++)sparks+=`<circle class="rise" style="--d:${r1(1.4+i*.17)}s;--w:${r1(i*.23)}s;--x:${(i%2?1:-1)*(10+i*4)}px" cx="${-30+i*10}" cy="-120" r="${3+i%3}" fill="#ffd36b"/>`;
  return `<g transform="translate(${x},${y}) scale(${s})">
    <ellipse class="glow" cx="0" cy="-60" rx="330" ry="230" fill="url(#glowG)"/>
    ${tongue(-26,.72,'url(#flameO)',.47,.1)}${tongue(28,.66,'url(#flameO)',.43,.25)}${tongue(0,1,'url(#flameO)',.55,0)}${tongue(0,.62,'url(#flameI)',.4,.15)}
    <rect x="-92" y="-26" width="184" height="26" rx="13" transform="rotate(-12)" fill="url(#logG)" stroke="${INK}" stroke-width="4"/>
    <rect x="-92" y="-26" width="184" height="26" rx="13" transform="rotate(12)" fill="url(#logG)" stroke="${INK}" stroke-width="4"/>
    <ellipse class="glow" style="--d:.8s" cx="0" cy="-10" rx="60" ry="12" fill="#ff6a12" opacity=".8"/>
    ${[-128,-80,-30,24,76,124].map((sx,i)=>`<ellipse cx="${sx}" cy="${4+(i%2)*3}" rx="${30-(i%3)*3}" ry="17" fill="url(#stoneG)" stroke="${INK}" stroke-width="4"/>`).join('')}
    ${sparks}
  </g>`;
}
/* better saiga silhouette (Saiga tatarica: humped nose, lyre horns) */
function saiga(){return `<g fill="#4a3a2a" stroke="${INK}" stroke-width="2.5"><path d="M-40,-50 C-38,-68 30,-70 46,-56 C54,-48 50,-32 40,-28 L-30,-28 C-40,-32 -42,-42 -40,-50Z"/>`+
  `<path d="M-34,-56 C-44,-70 -52,-80 -60,-84 C-72,-88 -80,-80 -78,-70 C-76,-64 -66,-60 -56,-58 Z"/><ellipse cx="-74" cy="-72" rx="9" ry="7"/></g>`+
  P('M-56,-86 C-54,-96 -50,-104 -52,-112 M-26,-30 L-30,0 M-14,-30 L-12,0 M22,-30 L18,0 M34,-30 L38,0 M46,-52 l8,8',{w:4.5,s:'#2b2117'});}
/* people get a cast shadow */
const hero1=hero, heroSeat1=heroSeat, person1=person;
hero=(x,y,s=1,o={})=>shadow(x,y+4*s,95*s)+hero1(x,y,s,o);
heroSeat=(x,y,s=1,o={})=>shadow(x,y+4*s,150*s)+heroSeat1(x,y,s,o);
person=(x,y,s=1,o={})=>shadow(x,y+4*s,95*s)+person1(x,y,s,o);
/* cave interior: rock gradient, cracks, darker edges, opening with deep rain sky */
function caveInterior(mouthD,o={}){
  return `<defs><radialGradient id="rockR" cx="50%" cy="60%" r="75%"><stop offset="0" stop-color="${o.wall||'#6e665d'}"/><stop offset="1" stop-color="#2f2a26"/></radialGradient>
    <linearGradient id="outG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d2b44"/><stop offset="1" stop-color="#4b5f7a"/></linearGradient></defs>`+
   `<rect width="1920" height="1080" fill="url(#rockR)"/>`+hatch(140,0,1920,0,1000,'#2a2522',o.seed||5)+
   `<path d="${mouthD}" fill="url(#outG)"/><clipPath id="mouth"><path d="${mouthD}"/></clipPath>`+
   G(rain(170,{op:.8,d:.5,col:'#b9c9da',seed:o.seed||6}),{clip:'mouth'})+
   P(mouthD,{w:10,s:'#1b1815'})+P(mouthD,{w:3,s:'#8a8076',o:.6});
}

/* ---- v3: mouths, natural knees-up sitting, boulder caves ---- */
const head0=head;
const MOUTHS={
  worried:(x,y,r)=>`M${r1(x-.15*r)},${r1(y+.03*r)} Q${r1(x)},${r1(y-.07*r)} ${r1(x+.15*r)},${r1(y+.03*r)}`,
  happy:(x,y,r)=>`M${r1(x-.17*r)},${r1(y-.02*r)} Q${r1(x)},${r1(y+.16*r)} ${r1(x+.17*r)},${r1(y-.02*r)}`,
  calm:(x,y,r)=>`M${r1(x-.12*r)},${r1(y)} Q${r1(x)},${r1(y+.07*r)} ${r1(x+.12*r)},${r1(y)}`,
  focus:(x,y,r)=>`M${r1(x-.12*r)},${r1(y+.01*r)} L${r1(x+.12*r)},${r1(y-.02*r)}`,
  curious:(x,y,r)=>`M${r1(x-.1*r)},${r1(y+.02*r)} Q${r1(x+.04*r)},${r1(y+.05*r)} ${r1(x+.14*r)},${r1(y-.03*r)}`
};
head=function(cx,cy,r,mood='curious',look=[0,0],big=false){
  let h=head0(cx,cy,r,mood,look,big); if(window.NO_MOUTH) return h;
  const x=cx+look[0]*r*.9+.03*r, y=cy+.43*r+look[1]*r*.5;
  if(mood==='scared') return h+`<ellipse cx="${r1(x)}" cy="${r1(y+.02*r)}" rx="${r1(.09*r)}" ry="${r1(.12*r)}" fill="#3b1212" stroke="${INK}" stroke-width="${r1(.05*r)}"/>`;
  return h+P(MOUTHS[mood](x,y,r),{w:r1(.06*r)});
};
/* seated with knees up (like the reference) for the 'knees' pose */
const heroSeat2=heroSeat;
heroSeat=(x,y,s=1,o={})=>{
  if(o.arms!=='knees') return heroSeat2(x,y,s,o);
  const legsUp=P('M-30,-50 L40,-190 L100,-6 L128,-4',{w:12})+P('M20,-50 L104,-178 L166,-8 L194,-6',{w:12});
  const arms=arm('M-52,-214 Q0,-200 44,-186')+arm('M52,-214 Q96,-206 106,-176')+hand(46,-184)+hand(108,-172);
  return shadow(x+40*s,y+4*s,170*s)+G(G(tunic(74)+legsUp+arms+head(0,-330,100,o.mood||'curious',o.look||[0,0],o.big),{c:o.c||'',st:o.st||''}),{t:`translate(${x},${y}) scale(${s})`});
};
/* boulder pile cave: rounded grey stones with light tops and dark gaps */
function blob(cx,cy,rx,ry,sd){srand(sd);const n=9,pts=[];for(let i=0;i<n;i++){const a=i/n*Math.PI*2,k=.82+rnd()*.3;pts.push([cx+Math.cos(a)*rx*k,cy+Math.sin(a)*ry*k])}
  let d=`M${r1((pts[0][0]+pts[1][0])/2)},${r1((pts[0][1]+pts[1][1])/2)}`;for(let i=1;i<=n;i++){const p=pts[i%n],q=pts[(i+1)%n];d+=` Q${r1(p[0])},${r1(p[1])} ${r1((p[0]+q[0])/2)},${r1((p[1]+q[1])/2)}`}return d+'Z'}
function boulderCave(x,y,s=1,sd=1){
  const B=[[-300,-40,170,120],[-120,-250,190,130],[110,-260,180,140],[300,-60,160,130],[-230,-430,150,110],[20,-470,200,120],[260,-410,150,110],[-420,-200,120,140],[440,-230,110,150]];
  let g=`<defs><linearGradient id="bG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b9b8b2"/><stop offset=".6" stop-color="#8d8c86"/><stop offset="1" stop-color="#6a6964"/></linearGradient>
   <radialGradient id="cvG" cx="50%" cy="70%" r="70%"><stop offset="0" stop-color="#3a3632"/><stop offset="1" stop-color="#161412"/></radialGradient></defs>`;
  g+=`<path d="M-470,40 C-480,-300 -300,-560 0,-560 C300,-560 480,-300 470,40Z" fill="#55534f"/>`;
  B.forEach(([bx,by,rx,ry],i)=>{const d=blob(bx,by,rx,ry,sd*31+i);g+=`<path d="${d}" fill="url(#bG)" stroke="${INK}" stroke-width="6"/>`+
    P(`M${bx-rx*.55},${by-ry*.35} q${rx*.4},-${ry*.3} ${rx*.9},-${ry*.05}`,{s:'#d9d8d2',w:7,o:.8})+P(`M${bx-rx*.2},${by+ry*.2} l${rx*.25},${ry*.25} M${bx+rx*.3},${by} l${rx*.15},${ry*.3}`,{s:'#4c4b47',w:3.5})});
  g+=`<path d="M-200,40 C-210,-190 -100,-300 0,-300 C110,-300 210,-190 200,40Z" fill="url(#cvG)" stroke="${INK}" stroke-width="7"/>`;
  g+=`<path d="${blob(-380,10,110,60,sd+7)}" fill="url(#bG)" stroke="${INK}" stroke-width="6"/><path d="${blob(380,20,100,55,sd+8)}" fill="url(#bG)" stroke="${INK}" stroke-width="6"/>`;
  return G(g,{t:`translate(${x},${y}) scale(${s})`});
}

/* ---- v4: redrawn weak shots ---- */
function tree(x,y,s=1,burn=false){
  let g=`<path d="M-30,0 C-26,-120 -40,-220 -20,-330 L20,-330 C40,-220 26,-120 30,0Z" fill="#6b4a2e" stroke="${INK}" stroke-width="6"/>`+P('M-10,-40 v-90 M8,-150 v-120 M-4,-200 l-40,-60 M6,-240 l50,-50',{s:'#4a3220',w:5});
  [[-90,-360,120,90],[60,-400,130,100],[-10,-470,140,100],[110,-300,100,80],[-130,-280,90,70]].forEach(([cx,cy,rx,ry],i)=>{g+=`<path d="${blob(cx,cy,rx,ry,40+i)}" fill="${['#4f6a35','#5d7a3e','#46602f','#56723a','#4a6532'][i]}" stroke="${INK}" stroke-width="6"/>`});
  if(burn) g+=fire(40,-330,.6).replace(/<rect[^>]*\/>/g,'').replace(/<ellipse cx="-?\d+" cy="\d+" rx="\d+" ry="17"[^>]*\/>/g,'');
  return G(g,{t:`translate(${x},${y}) scale(${s})`});
}
function hoofR(c='#2b1c10'){return `<path d="M-6,0 C-20,-8 -22,-40 -8,-52 C-2,-36 0,-14 -6,0Z M6,0 C20,-8 22,-40 8,-52 C2,-36 0,-14 6,0Z" fill="${c}"/><circle cx="-14" cy="16" r="5" fill="${c}"/><circle cx="14" cy="16" r="5" fill="${c}"/>`}
const mudBg=(sd)=>`<defs><radialGradient id="mudG" cx="50%" cy="40%" r="80%"><stop offset="0" stop-color="#8a6442"/><stop offset="1" stop-color="#4c3220"/></radialGradient></defs><rect width="1920" height="1080" fill="url(#mudG)"/>`+hatch(80,0,1920,0,1080,'#3d2817',sd)+
  [[300,300,160,40],[1500,820,220,50],[900,980,140,30]].map(([x,y,rx,ry])=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#9bb8cf" stroke="#2b1c10" stroke-width="5"/><path d="M${x-rx*.5},${y-ry*.2} h${rx*.4}" stroke="#fff" stroke-width="6" opacity=".7"/>`).join('');
SC.washTracks=()=>{let g=mudBg(8);for(let i=0;i<6;i++){g+=G(G(hoofR(),{c:'wash',st:`--w:${r1(.2+i*.4)}s`}),{t:`translate(${260+i*270},${i%2?470:650}) rotate(80) scale(2.6)`})}
  return g+rain(220,{op:.8,d:.42,col:'#c9d6e2',w:4})+sfx(960,220,'ІЗДЕР ЖОҒАЛДЫ',{size:96,fill:'#fff',stroke:'#2b1c10',w:2.2})+vignette(.5)};
SC.mudTracks=()=>{let g=mudBg(51)+`<path d="M0,0 H1920 V120 C1500,150 600,100 0,140Z" fill="#6f8f3a" stroke="${INK}" stroke-width="6"/>`+grass(60,150,500,['#5f7d2e','#7a9a3c','#4c6a24'],5);
  for(let i=0;i<6;i++)g+=G(G(hoofR(),{c:'pop',st:`--w:${r1(.3+i*.3)}s`}),{t:`translate(${250+i*300},${i%2?520:780}) rotate(80) scale(2.8)`});
  return g+sfx(800,300,'АЙНАДАЙ АНЫҚ ІЗ',{size:96,w:2,fill:'#ffe7bf',stroke:'#24170b'})+vignette(.45)};
SC.freeze=()=>{let g=`<defs>${vgrad('fz','#1f3550','#6f93b3')}</defs><rect width="1920" height="1080" fill="url(#fz)"/>`+grass(880,1090,700,['#4a5560','#5c6b78','#3b4652'],3)+
   `<path d="M0,880 C600,870 1300,890 1920,875 V1080 H0Z" fill="#5a6672" opacity=".55"/>`;
  g+=G(hero(760,960,1.05,{mood:'worried',arms:'cross',big:1}),{c:'shiver-hard'});
  g+=P('M700,540 l-6,26 l-6,-26 M760,520 l-6,30 l-6,-30 M820,540 l-6,24 l-6,-24',{s:'#e8f6ff',w:5});
  for(let i=0;i<10;i++){const a=i*Math.PI/5,R=330;g+=`<g class="glow" style="--w:${i*.15}s"><path d="M${r1(760+Math.cos(a)*R)},${r1(560+Math.sin(a)*R)} m-14,0 h28 m-14,-14 v28 m-10,-10 l20,-0 m-10,0" stroke="#e8f4fc" stroke-width="5" fill="none"/></g>`}
  g+=G(G(`<path d="M0,30 C-60,-20 -40,-80 0,-50 C40,-80 60,-20 0,30Z" fill="${C.red}" stroke="${INK}" stroke-width="6"/>`,{c:'heart'}),{t:'translate(1420,440) scale(1.5)'})+
    `<rect x="1180" y="560" width="480" height="180" rx="18" fill="#0f1b26" stroke="${INK}" stroke-width="6"/>`+
    P('M1200,650 H1290 l20,-50 l25,100 l20,-70 l15,20 H1460 l12,-20 l14,30 H1640',{s:'#6cff9a',w:6,c:'draw',st:'--d:3s;--w:.4s'});
  return g+rain(170,{op:.6,d:.5,col:'#e1ecf5'})+sfx(1420,320,'ДЕНЕ МҰЗДАЙДЫ',{size:76,w:1,fill:'#e6f4ff',stroke:'#0f2236'})+vignette(.55)};
SC.mountain=()=>{let g=stormSky()+`<defs>${vgrad('mt1','#7b746c','#4f4943')}${vgrad('mt2','#8d857c','#5e5850')}</defs>`+
   `<path d="M-50,760 L250,430 L420,520 L700,240 L940,470 L1180,300 L1500,560 L1700,420 L1990,700 V900 H-50Z" fill="url(#mt1)" stroke="${INK}" stroke-width="7"/>`+
   P('M700,240 L640,420 L700,520 M1180,300 L1120,470 M250,430 L230,560 M1700,420 L1660,560',{s:'#3e3934',w:5})+P('M700,240 L760,330 M1180,300 L1240,380',{s:'#a8a097',w:5})+hatch(50,0,1920,380,860,'#3a3530',12)+
   `<path d="M-50,860 C300,700 600,760 980,700 C1300,650 1600,740 1990,700 V960 H-50Z" fill="url(#mt2)" stroke="${INK}" stroke-width="7"/>`+
   `<path d="M0,900 C600,880 1300,905 1920,885 V1080 H0Z" fill="${C.groundW}" stroke="${INK}" stroke-width="6"/>`+grass(890,1090,700,['#6e6535','#857a40','#5a5230'],22)+
   boulderCave(420,910,.38,11)+boulderCave(980,915,.45,12)+boulderCave(1520,905,.4,13);
  [[420,690],[980,650],[1520,680]].forEach(([x,y],i)=>g+=`<circle class="pop" style="--w:${.6+i*.4}s" cx="${x}" cy="${y}" r="22" fill="${C.red}" stroke="#fff" stroke-width="5"/>`);
  return g+rain(200,{op:.6,d:.45,col:C.rainD})+vignette(.45)};
SC.river=()=>{let g=stormSky()+`<path d="M0,700 C400,690 800,720 1200,700 C1500,690 1700,710 1920,700 V1080 H0Z" fill="${C.groundW}" stroke="${INK}" stroke-width="6"/>`+grass(690,780,600,['#6e6535','#857a40','#5a5230'],31)+
   `<defs>${vgrad('rv','#5b86ad','#2f5578')}</defs><path d="M0,790 C500,760 1100,800 1920,770 V1080 H0Z" fill="url(#rv)" stroke="${INK}" stroke-width="7"/>`;
  for(let k=0;k<5;k++)g+=G(P(Array.from({length:22},(_,i)=>`M${i*120-120+(k%2)*60},${830+k*50} q30,-18 60,0 t60,0`).join(' '),{s:'#d7e6f2',w:4,o:.8}),{c:'wave',st:`animation-duration:${1.1-k*.12}s`});
  g+=G(`<rect x="-120" y="-16" width="240" height="32" rx="16" fill="url(#logG)" stroke="${INK}" stroke-width="5"/>`+P('M-60,-16 l20,-30 M50,16 l24,26',{w:6,s:'#4f3018'}),{t:'translate(1300,900) rotate(-8)',c:'drift',st:'--a:-500px;--d:6s'});
  g+=tree(1540,720,.7)+hero(420,705,.55,{mood:'scared',arms:'shrug',big:1})+sfx(1100,450,'ӨЗЕН ТАСЫДЫ',{size:96,w:.8});
  return g+rain(200,{op:.65,d:.45,col:C.rainD})+vignette(.45)};
SC.lightning=()=>{let g=stormSky()+`<path d="M0,880 C600,870 1300,890 1920,875 V1080 H0Z" fill="${C.groundW}" stroke="${INK}" stroke-width="6"/>`+grass(870,1090,800,['#6e6535','#857a40','#5a5230'],8)+tree(1210,890,1.05,true);
  g+=`<rect class="flash" style="--w:.6s" width="1920" height="1080" fill="#fff"/>`+P('M1300,0 L1240,150 L1300,160 L1210,330',{s:'#fff6b0',w:16,c:'flash',st:'--w:.6s'});
  return g+hero(560,890,.95,{mood:'scared',arms:'point',big:1,look:[.2,-.05]})+sfx(1500,300,'ЖАРҚ!',{size:120,w:.6,fill:'#fff6b0'})+rain(160,{op:.55,d:.45,col:C.rainD})+vignette(.4)};
SC.fungusTree=()=>`<defs>${vgrad('fg','#55654f','#9aa88c')}</defs><rect width="1920" height="1080" fill="url(#fg)"/>`+tree(200,1000,1.3)+tree(1750,1000,1.2)+
  `<path d="M0,960 C600,950 1300,970 1920,955 V1080 H0Z" fill="#5d5236" stroke="${INK}" stroke-width="6"/>`+grass(950,1090,500,['#4f5a2a','#6a7536'],7)+
  `<rect x="760" y="0" width="360" height="980" fill="#6b4a2e" stroke="${INK}" stroke-width="9"/>`+P('M800,0 V980 M880,100 V900 M1040,0 V700 M960,300 V980',{s:'#4f361f',w:6})+P('M780,700 q20,-40 60,-30 M1100,400 q-30,20 -20,60',{s:'#6f8a3a',w:12})+
  [[1120,380,1.6,0],[1120,560,1.2,.3],[760,700,1.4,.6]].map(([x,y,s,w],i)=>G(G(`<path d="M0,-60 C${i==2?-180:180},-60 ${i==2?-200:200},20 0,30Z" fill="#c9a27a" stroke="${INK}" stroke-width="6"/>`+P(i==2?'M-20,-30 C-90,-30 -120,0 -140,10':'M20,-30 C90,-30 120,0 140,10',{s:'#8a6a44',w:4}),{c:'popb',st:`--w:${w}s`}),{t:`translate(${x},${y}) scale(${s})`})).join('')+
  hero(1460,960,.8,{mood:'curious',arms:'point',look:[-.2,-.1],flip:1})+sfx(560,300,'ҚУ САҢЫРАУҚҰЛАҚ',{size:80,w:1.2})+rain(90,{op:.4,d:.5,col:'#e5ece4'})+vignette(.4);
SC.handsCarve=()=>`<rect width="1920" height="1080" fill="#3b332d"/>`+hatch(60,0,1920,0,1080,'#2a2420',61)+`<ellipse class="glow" cx="1500" cy="900" rx="900" ry="600" fill="url(#glowG)"/>`+
  `<path d="M300,700 L1560,420 L1580,436 L330,740Z" fill="#f4ecd8" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><ellipse cx="380" cy="712" rx="20" ry="8" fill="${INK}" transform="rotate(-13 380 712)"/>`+
  hand(520,690,70)+G(hand(0,0,70)+`<path d="M-50,-90 L60,-110 L40,-30Z" fill="#8d9096" stroke="${INK}" stroke-width="6"/>`,{t:'translate(1100,560)',c:'saw',st:'--x:-180px;--y:40px'})+
  [[1000,580,0],[1060,570,.4],[940,600,.8]].map(([x,y,w])=>`<rect class="fall" style="--w:${w}s;--y:300px" x="${x}" y="${y}" width="22" height="10" fill="#efe6d2" stroke="${INK}" stroke-width="2"/>`).join('')+vignette(.6);
SC.notLike=()=>{const runner=G(legs().replace('M-24,-128 L-34,-6 L-58,-4 M24,-128 L34,-6 L58,-4','M-24,-128 L-80,-40 L-120,-60 M24,-128 L70,-30 L60,10')+tunic()+arm('M-52,-288 Q-110,-300 -140,-360')+hand(-142,-364)+spear(40,-180,240,-330)+arm('M52,-288 Q110,-260 140,-230')+hand(142,-228)+head(0,-410,105,'scared',[.15,0],true),{t:'translate(440,820) scale(.95)'});
  return `<rect width="1920" height="1080" fill="#fff"/>`+P('M960,60 V1020',{w:6,st:'stroke-dasharray:24 18'})+runner+G(G(saiga(),{c:'bob',st:'--d:.35s;--a:-10px'}),{t:'translate(760,800) scale(1.8)'})+
   P('M380,120 l90,90 M470,120 l-90,90',{s:C.red,w:20})+big(480,1000,'БЫЛАЙ ЕМЕС',{size:90})+
   heroSeat(1400,840,.95,{mood:'focus',arms:'open',look:[.1,.15]})+`<path d="M1250,640 L1400,600 L1406,610 L1256,652Z" fill="#f4ecd8" stroke="${INK}" stroke-width="5"/>`+fire(1700,840,.7)+
   P('M1380,150 l40,40 l90,-90',{s:'#3aa64a',w:20})+big(1440,1000,'БЫЛАЙ',{size:90})};
SC.busyCave=()=>caveInterior('M1180,880 C1150,560 1280,260 1560,240 C1820,220 1900,520 1920,880Z',{seed:71})+rockFloor(880,'#4a433d')+
  `<ellipse class="glow" cx="760" cy="800" rx="700" ry="380" fill="url(#glowG)"/>`+fire(900,890,.9)+
  `<path d="M300,960 L760,960 L720,900 L340,900Z" fill="#c9c06e" stroke="${INK}" stroke-width="5"/>`+heroSeat(520,920,1,{mood:'focus',arms:'open',look:[.12,.18]})+
  `<path d="M390,720 L560,680 L566,690 L396,732Z" fill="#f4ecd8" stroke="${INK}" stroke-width="5"/>`+
  G([40,30,20].map(r=>`<ellipse rx="${r*1.6}" ry="${r*.6}" fill="none" stroke="#a07a45" stroke-width="9"/>`).join(''),{t:'translate(1080,920)'})+spear(160,940,420,900)+
  sfx(1550,420,'шар-шар…',{size:60,w:.8})+vignette(.6);
SC.sunnyVs=(f=>()=>f().replace('<rect y="760" width="960" height="320" fill="#cfa65b"/>','<rect y="760" width="960" height="320" fill="#cfa65b"/>'+grass(750,1090,500,['#b8913f','#d4b261','#9c7a35'],17).replace(/M(1\d{3}|9[6-9]\d)/g,'M-999')))(SC.sunnyVs);
SC.chat=()=>caveInterior('M1300,880 C1280,600 1400,380 1600,370 C1800,360 1880,600 1900,880Z',{seed:81})+rockFloor(880,'#4a433d')+
  `<ellipse class="glow" cx="900" cy="820" rx="700" ry="320" fill="url(#glowG)"/>`+fire(940,900,.7)+
  person(520,900,.85,{arms:'cross',c:'bob',st:'--a:-4px;--d:2s'})+hero(760,900,.9,{mood:'happy',arms:'shrug',c:'bob',st:'--a:-6px;--d:1.3s'})+person(1160,900,.85,{arms:'down',c:'bob',st:'--a:-4px;--d:1.7s'})+
  G(`<ellipse cx="0" cy="0" rx="90" ry="60" fill="#fff" stroke="${INK}" stroke-width="6"/>`+T(0,16,'…',{size:70,anchor:'middle'}),{t:'translate(960,300)',c:'pop',st:'--w:.5s'})+
  G(`<ellipse cx="0" cy="0" rx="90" ry="60" fill="#fff" stroke="${INK}" stroke-width="6"/>`+T(0,18,'?!',{size:60,anchor:'middle',fill:C.red}),{t:'translate(560,330)',c:'pop',st:'--w:1.1s'})+vignette(.55);
{const withGrass=()=>s8().replace('<rect width="1920" height="1080" fill="#f4f9fd"/>',`<defs>${vgrad('skyB','#8cc4ea','#e4f2fa')}</defs><rect width="1920" height="1080" fill="url(#skyB)"/>`).replace(/(<path d="M0,872 C400,860 1000,880 1920,862 V1080 H0Z"[^>]*\/>)/,'$1'+grass(855,1090,900,['#7f9a3c','#6a8a30','#98b04c','#5c7a28'],19));
 SC.clearing=withGrass; SC.harvest=withGrass;}
