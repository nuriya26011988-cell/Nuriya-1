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
