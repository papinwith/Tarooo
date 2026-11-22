
// ---------- Christmas night: garland lights, snowy hills & trees (SVG built to the real screen size) ----------
function buildXmas(){const W=innerWidth,H=innerHeight,r=rng32(2512);
 // garland swags with glowing bulbs
 const swags=Math.max(2,Math.ceil(W/340)),sw=W/swags,BC=['#ff4d5e','#ffd35a','#4fe08a','#5ab8ff','#ff7ad9'];let g='',b='',k=0;
 for(let s=0;s<swags;s++){const x0=s*sw,x1=x0+sw,sag=11+r()*5;g+=`<path d="M${f1(x0)} 4Q${f1(x0+sw/2)} ${f1(4+sag*2)} ${f1(x1)} 4" fill="none" stroke="#1d3a2c" stroke-width="2.2"/>`;
  for(let t=.1;t<.95;t+=.16){const x=(1-t)*(1-t)*x0+2*(1-t)*t*(x0+sw/2)+t*t*x1,y=(1-t)*(1-t)*4+2*(1-t)*t*(4+sag*2)+t*t*4,c=BC[k++%BC.length],d=(r()*2.4).toFixed(2);
   b+=`<g class="bulb" style="animation-delay:-${d}s"><circle cx="${f1(x)}" cy="${f1(y+9)}" r="11" fill="${c}" opacity=".35" filter="url(#bl)"/><rect x="${f1(x-2.5)}" y="${f1(y)}" width="5" height="4" fill="#8a8f9c"/><ellipse cx="${f1(x)}" cy="${f1(y+9)}" rx="4.3" ry="6.2" fill="${c}"/></g>`}}
 const lights=`<svg class="lights" viewBox="0 0 ${W} 80" width="${W}" height="80"><defs><filter id="bl" x="-1" y="-1" width="3" height="3"><feGaussianBlur stdDeviation="4"/></filter></defs>${g}${b}</svg>`;
 // hills + pine trees
 const hh=Math.min(H*.26,230),hill=(base,amp,ph)=>{let d=`M0 ${hh}`;for(let x=0;x<=W;x+=W/24)d+=`L${f1(x)} ${f1(base+Math.sin(x/W*Math.PI*2+ph)*amp)}`;return d+`L${W} ${hh}Z`};
 let trees='';const tree=(x,base,h,big)=>{const w=h*.46;let s='';
  for(let l=0;l<3;l++){const ty=base-h+l*h*.28,bw=w*(.55+l*.25),by=ty+h*.42;
   s+=`<path d="M${f1(x)} ${f1(ty)}L${f1(x+bw)} ${f1(by)}L${f1(x-bw)} ${f1(by)}Z" fill="${big?['#0f4a3a','#13604a','#177256'][l]:'#0b1c26'}"/>`;
   s+=`<path d="M${f1(x-bw)} ${f1(by)}L${f1(x+bw)} ${f1(by)}" stroke="#e6eeff" stroke-opacity="${big?.8:.45}" stroke-width="${big?3:2}" stroke-linecap="round"/>`}
  s+=`<rect x="${f1(x-h*.04)}" y="${f1(base-h*.1)}" width="${f1(h*.08)}" height="${f1(h*.12)}" fill="#2a1a10"/>`;
  if(big){for(let i=0;i<9;i++){const yy=base-h*.82+i*h*.075,xx=x+(r()-.5)*w*(.3+i*.09);s+=`<circle class="bulb" style="animation-delay:-${(r()*2.4).toFixed(2)}s" cx="${f1(xx)}" cy="${f1(yy)}" r="${f1(h*.022+1)}" fill="${BC[i%5]}"/>`}
   s+=`<path d="${starPath(x,base-h-h*.04,h*.08,h*.035,5,-Math.PI/2)}" fill="#ffd35a" filter="url(#gl)"/>`}
  return s};
 const n=Math.max(4,Math.round(W/130));for(let i=0;i<n;i++){const x=(i+.5)/n*W+(r()-.5)*40,h=hh*(.32+r()*.25);trees+=tree(x,hh*.62+Math.sin(x/W*Math.PI*2+1)*hh*.06,h,false)}
 const bh=hh*.78;trees+=tree(W*.07,hh*.8,bh,true)+tree(W*.93,hh*.8,bh*.92,true);
 const hills=`<svg class="hills" viewBox="0 0 ${W} ${f1(hh)}" width="${W}" height="${f1(hh)}"><defs><filter id="gl" x="-1" y="-1" width="3" height="3"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<linearGradient id="sn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b9c6ee"/><stop offset="1" stop-color="#4a5690"/></linearGradient></defs>
<path d="${hill(hh*.5,hh*.08,0)}" fill="#1b2352"/><path d="${hill(hh*.5,hh*.08,0)}" fill="none" stroke="#dfe8ff" stroke-opacity=".35" stroke-width="3"/>
${trees}<path d="${hill(hh*.78,hh*.06,2)}" fill="url(#sn)" opacity=".55"/></svg>`;
 $('#xmas').innerHTML=lights+hills}

// ---------- falling snow (canvas) ----------
const cv=$('#dust'),cx=cv.getContext('2d');let parts=[];
function initDust(){const d=Math.min(devicePixelRatio||1,2);cv.width=innerWidth*d;cv.height=innerHeight*d;cx.setTransform(d,0,0,d,0,0);
 const n=clamp(Math.round(innerWidth*innerHeight/5500),60,260);
 parts=Array.from({length:n},()=>{const z=Math.random();return{x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:.8+z*2.6,vy:.25+z*.95,sw:.3+Math.random()*.8,ph:Math.random()*6.28,sp:.5+Math.random(),a:.45+z*.5}})}
function drawDust(t){cx.clearRect(0,0,innerWidth,innerHeight);const wind=Math.sin(t*.00013)*.25*(reduce?.4:1);
 for(const p of parts){if(true){p.y+=p.vy*(reduce?.6:1);p.x+=Math.sin(t*.001*p.sp+p.ph)*p.sw*.5+wind;
   if(p.y>innerHeight+6){p.y=-6;p.x=Math.random()*innerWidth}if(p.x<-6)p.x=innerWidth+6;else if(p.x>innerWidth+6)p.x=-6}
  if(p.r>2.4){cx.fillStyle=`rgba(255,255,255,${(p.a*.25).toFixed(2)})`;cx.beginPath();cx.arc(p.x,p.y,p.r*1.9,0,6.283);cx.fill()}
  cx.fillStyle=`rgba(255,255,255,${p.a.toFixed(2)})`;cx.beginPath();cx.arc(p.x,p.y,p.r,0,6.283);cx.fill()}}

