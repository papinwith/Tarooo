"use strict";
if(location.hash.includes("timerraf"))window.requestAnimationFrame=cb=>setTimeout(()=>cb(performance.now()),33);
// ---------- utils ----------
const $=s=>document.querySelector(s);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function rng32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function hex2rgb(h){h=h.replace('#','');return[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]}
function rgb2hex(r){return'#'+r.map(v=>clamp(Math.round(v),0,255).toString(16).padStart(2,'0')).join('')}
function mix(a,b,t){const A=hex2rgb(a),B=hex2rgb(b);return rgb2hex(A.map((v,i)=>v+(B[i]-v)*t))}
function shade(c,t){return t>=0?mix(c,'#ffffff',t):mix(c,'#000000',-t)}
const f1=n=>Math.round(n*10)/10;
const LEAD='#0b0a12';
const GOLD=['#b07a12','#f2c14e','#ffe8a3'];

// ---------- stained-glass primitives ----------
function P(pts,fill,sw){return`<path d="M${pts.map(p=>f1(p[0])+' '+f1(p[1])).join('L')}Z" fill="${fill}"${sw?` stroke-width="${sw}"`:''}/>`}
function circ(cx,cy,rx,ry=rx,n=24,a0=0){const o=[];for(let i=0;i<n;i++){const a=a0+i/n*Math.PI*2;o.push([cx+Math.cos(a)*rx,cy+Math.sin(a)*ry])}return o}
function fan(cx,cy,pts,k,cols,sw){let s='';const n=pts.length;for(let i=0,j=0;i<n;i+=k,j++){const seg=[[cx,cy]];for(let m=0;m<=k;m++)seg.push(pts[(i+m)%n]);s+=P(seg,cols[j%cols.length],sw)}return s}
function L2(a,b,t){return[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t]}
function poly(pts){const d=[0];for(let i=1;i<pts.length;i++)d.push(d[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]));const T=d[d.length-1];
 return t=>{const x=t*T;let i=1;while(i<d.length-1&&d[i]<x)i++;const u=(x-d[i-1])/((d[i]-d[i-1])||1);return L2(pts[i-1],pts[i],clamp(u,0,1))}}
// split the region between curves A(t) and B(t) into na x nl glass pieces
function grid(A,B,na,nl,colFn,sw,sub=3){let s='';for(let j=0;j<nl;j++)for(let i=0;i<na;i++){const u0=i/na,u1=(i+1)/na,pts=[];
 for(let k=0;k<=sub;k++){const t=(j+k/sub)/nl;pts.push(L2(A(t),B(t),u0))}
 for(let k=sub;k>=0;k--){const t=(j+k/sub)/nl;pts.push(L2(A(t),B(t),u1))}
 s+=P(pts,colFn(i,j),sw)}return s}
function arcF(cx,cy,rx,ry,a0,a1){return t=>{const a=a0+(a1-a0)*t;return[cx+Math.cos(a)*rx,cy+Math.sin(a)*ry]}}
function ring(cx,cy,r1,r2,n,cols,a0=0,a1=Math.PI*2,sw){return grid(arcF(cx,cy,r1,r1,a0,a1),arcF(cx,cy,r2,r2,a0,a1),1,n,(i,j)=>cols[j%cols.length],sw,4)}
function starShape(cx,cy,r1,r2,n,rot,c1,c2,sw){const pts=[];for(let k=0;k<n*2;k++){const a=rot+k*Math.PI/n,r=k%2?r2:r1;pts.push([cx+Math.cos(a)*r,cy+Math.sin(a)*r])}
 let s='';for(let k=0;k<n*2;k++)s+=P([[cx,cy],pts[k],pts[(k+1)%(n*2)]],k%2?c2:c1,sw);return s}
function lens(x1,y1,x2,y2,w,col,sw=1.4){const dx=x2-x1,dy=y2-y1,l=Math.hypot(dx,dy)||1,nx=-dy/l*w,ny=dx/l*w,a=[[x1,y1]],b=[[x1,y1]];
 for(let k=1;k<6;k++){const t=k/6,q=Math.sin(Math.PI*t);a.push([x1+dx*t+nx*q,y1+dy*t+ny*q]);b.push([x1+dx*t-nx*q,y1+dy*t-ny*q])}
 a.push([x2,y2]);b.push([x2,y2]);return P(a,col,sw)+P(b,shade(col,-.18),sw)}
function rect(x1,y1,x2,y2,c,sw){return P([[x1,y1],[x2,y1],[x2,y2],[x1,y2]],c,sw)}
function rot(pts,a,cx,cy){const c=Math.cos(a),s=Math.sin(a);return pts.map(([x,y])=>[cx+x*c-y*s,cy+x*s+y*c])}
function flower(x,y,r,n,col,ro=0,center='#ffd35a'){let s='';const c2=shade(col,.25),h=Math.PI/n*.92;
 for(let k=0;k<n;k++){const a=ro+k*Math.PI*2/n,pt=(ang,rr)=>[x+Math.cos(ang)*r*rr,y+Math.sin(ang)*r*rr];
  s+=P([pt(a,.25),pt(a-h,.62),pt(a-h*.45,.98),pt(a,1.06),pt(a+h*.45,.98),pt(a+h,.62)],k%2?c2:col,1.4)}
 return s+P(circ(x,y,r*.34,r*.34,10),center,1.4)}
function triF(x,y,v){const m=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2];const pts=[v[0],m(v[0],v[1]),v[1],m(v[1],v[2]),v[2],m(v[2],v[0])];
 return fan(x,y,pts,1,['#fff6c8',GOLD[1],'#ffe39a',GOLD[2],'#ffd35a',GOLD[0]],1.5)}
const line=(d,w=1.4)=>`<path d="${d}" fill="none" stroke-width="${w}"/>`;

// ---------- emblems (x,y,size,palette) ----------
const E={
 star:(x,y,s)=>starShape(x,y,s,s*.42,8,-Math.PI/2,'#fff6c8','#ffd35a',1.5),
 sun:(x,y,s)=>{let o='';for(let k=0;k<12;k++){const a=k*Math.PI/6-Math.PI/2,d=Math.PI/12;
   o+=P([[x+Math.cos(a-d)*s*.6,y+Math.sin(a-d)*s*.6],[x+Math.cos(a)*s,y+Math.sin(a)*s],[x+Math.cos(a+d)*s*.6,y+Math.sin(a+d)*s*.6]],k%2?'#ff8a3d':'#ffc83a',1.6)}
  o+=fan(x,y,circ(x,y,s*.6,s*.6,24),3,['#ffe066','#ffcc33'],1.5);
  if(s>30)o+=line(`M${f1(x-s*.27)} ${f1(y-s*.05)}q${f1(s*.1)} ${f1(s*.08)} ${f1(s*.2)} 0M${f1(x+s*.07)} ${f1(y-s*.05)}q${f1(s*.1)} ${f1(s*.08)} ${f1(s*.2)} 0M${f1(x-s*.14)} ${f1(y+s*.22)}q${f1(s*.14)} ${f1(s*.12)} ${f1(s*.28)} 0`);
  return o},
 moon:(x,y,s)=>{const a0=Math.PI*.38,a1=Math.PI*1.62;
  const B=t=>{const a=a0+(a1-a0)*t,r=s-s*.6*Math.sin(Math.PI*t);return[x+Math.cos(a)*r,y+Math.sin(a)*r]};
  return grid(arcF(x,y,s,s,a0,a1),B,1,6,(i,j)=>j%2?'#e9eeff':'#fff6d8',1.5)},
 moonfull:(x,y,s)=>fan(x,y,circ(x,y,s,s,32),4,['#d6e2ff','#b4c4f2'],1.6)
  +line(`M${f1(x+s*.05)} ${f1(y-s*.12)}q${f1(s*.12)} ${f1(s*.1)} ${f1(s*.24)} 0M${f1(x+s*.1)} ${f1(y+s*.3)}q${f1(s*.12)} ${f1(s*.06)} ${f1(s*.22)} 0`,1.5)+E.moon(x,y,s),
 wand:(x,y,s)=>{let o=grid(t=>[x-s*.09,y-s*.8+s*1.75*t],t=>[x+s*.09,y-s*.8+s*1.75*t],1,4,(i,j)=>j%2?'#8a5a2a':'#b9823f',1.5,1);
  o+=lens(x,y-s*.55,x-s*.42,y-s*.82,s*.1,'#3fa36b',1.2)+lens(x,y-s*.5,x+s*.4,y-s*.72,s*.1,'#2f8a55',1.2);
  return o+P(circ(x,y-s*.86,s*.13,s*.13,10),'#ffd35a',1.3)},
 cup:(x,y,s)=>{const Lp=[x-s*.62,y-s*.62],Rp=[x+s*.62,y-s*.62];
  let o=grid(t=>L2(Lp,Rp,t),t=>[x-s*.62+s*1.24*t,y-s*.62+s*.78*Math.sin(Math.PI*t)],1,5,(i,j)=>j%2?GOLD[1]:GOLD[2],1.5);
  o+=rect(x-s*.66,y-s*.72,x+s*.66,y-s*.6,'#7fd6ff',1.3);
  o+=rect(x-s*.08,y+s*.15,x+s*.08,y+s*.6,GOLD[0],1.3)+P(circ(x,y+s*.36,s*.13,s*.1,10),GOLD[2],1.2);
  return o+P([[x-s*.18,y+s*.6],[x+s*.18,y+s*.6],[x+s*.45,y+s*.82],[x-s*.45,y+s*.82]],GOLD[1],1.4)},
 sword:(x,y,s)=>{const w=s*.11;let o='';
  o+=P([[x,y-s],[x-w,y-s*.8],[x-w,y-s*.2],[x,y-s*.2]],'#f2f5fb',1.3)+P([[x,y-s],[x+w,y-s*.8],[x+w,y-s*.2],[x,y-s*.2]],'#a9b3c7',1.3);
  o+=rect(x-w,y-s*.2,x,y+s*.45,'#dfe5f0',1.3)+rect(x,y-s*.2,x+w,y+s*.45,'#8f9ab0',1.3);
  o+=rect(x-s*.42,y+s*.45,x+s*.42,y+s*.57,GOLD[1],1.3)+rect(x-s*.06,y+s*.57,x+s*.06,y+s*.86,'#6a3fd0',1.2);
  return o+P(circ(x,y+s*.93,s*.09,s*.09,10),GOLD[2],1.2)},
 pentacle:(x,y,s)=>ring(x,y,s*.8,s,12,[GOLD[0],GOLD[1]],0,Math.PI*2,1.4)+fan(x,y,circ(x,y,s*.8,s*.8,20),4,['#3a2a10','#4a3616'],1.1)
  +starShape(x,y,s*.74,s*.29,5,-Math.PI/2,GOLD[2],GOLD[1],1.3),
 heart:(x,y,s,c1='#e8344e',c2='#ff6f86')=>{const pts=[];for(let k=0;k<32;k++){const t=k/32*Math.PI*2;
  pts.push([x+16*Math.pow(Math.sin(t),3)*s/17,y-(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))*s/17])}return fan(x,y,pts,4,[c1,c2],1.5)},
 twohearts:(x,y,s)=>E.heart(x-s*.42,y+s*.12,s*.62,'#c22f5a','#ff6fa8')+E.heart(x+s*.4,y-s*.1,s*.62,'#e8344e','#ff8a9a')
  +starShape(x,y-s*.78,s*.2,s*.08,4,-Math.PI/2,'#fff6c8','#ffd35a',1.2),
 wheel:(x,y,s,p)=>ring(x,y,s*.8,s,16,[GOLD[1],'#ff8a3d',GOLD[2],'#e8344e'],0,Math.PI*2,1.6)+fan(x,y,circ(x,y,s*.8,s*.8,32),4,[p.arch[0],p.arch[1]],1.6)
  +ring(x,y,s*.18,s*.32,6,[GOLD[2],GOLD[1]],0,Math.PI*2,1.4)+P(circ(x,y,s*.18,s*.18,10),'#fff6c8',1.3),
 scales:(x,y,s)=>{let o=rect(x-s*.05,y-s*.7,x+s*.05,y+s*.75,GOLD[0],1.2)+rect(x-s*.85,y-s*.64,x+s*.85,y-s*.54,GOLD[1],1.2)+P(circ(x,y-s*.78,s*.09,s*.09,10),GOLD[2],1.1);
  for(const d of[-1,1]){const cx=x+d*s*.72,py=y+s*.05;o+=line(`M${f1(cx)} ${f1(y-s*.54)}L${f1(cx-s*.24)} ${f1(py)}M${f1(cx)} ${f1(y-s*.54)}L${f1(cx+s*.24)} ${f1(py)}`,1.1);
   const pts=[];for(let k=0;k<=8;k++){const a=k/8*Math.PI;pts.push([cx+Math.cos(a)*s*.26,py+Math.sin(a)*s*.2])}o+=P(pts,d<0?GOLD[2]:GOLD[1],1.3)}
  return o+P([[x-s*.3,y+s*.75],[x+s*.3,y+s*.75],[x+s*.42,y+s*.88],[x-s*.42,y+s*.88]],GOLD[1],1.3)},
 lion:(x,y,s)=>{let o='';for(let k=0;k<18;k++){const a=k/18*Math.PI*2,d=Math.PI/18;
   o+=P([[x+Math.cos(a-d)*s*.5,y+Math.sin(a-d)*s*.5],[x+Math.cos(a)*s,y+Math.sin(a)*s],[x+Math.cos(a+d)*s*.5,y+Math.sin(a+d)*s*.5]],k%2?'#c0601a':'#f0a030',1.5)}
  o+=ring(x,y,s*.48,s*.66,12,['#e08a2a','#ffb347'],0,Math.PI*2,1.4)+fan(x,y+s*.03,circ(x,y+s*.03,s*.48,s*.5,20),5,['#ffd27a','#f2c14e'],1.4);
  o+=P([[x-s*.26,y-s*.08],[x-s*.1,y-s*.12],[x-s*.12,y-s*.04]],'#2a1a10',1)+P([[x+s*.26,y-s*.08],[x+s*.1,y-s*.12],[x+s*.12,y-s*.04]],'#2a1a10',1);
  o+=P([[x-s*.1,y+s*.12],[x+s*.1,y+s*.12],[x,y+s*.24]],'#8a3a1a',1.1);
  return o+line(`M${f1(x)} ${f1(y+s*.24)}v${f1(s*.08)}M${f1(x-s*.14)} ${f1(y+s*.36)}q${f1(s*.14)} ${f1(s*.06)} ${f1(s*.28)} 0`,1.2)},
 tower:(x,y,s)=>{let o='';const w=s*.36,top=y-s*.6,bot=y+s,st=['#5a5a72','#76768e','#8e8ea6'],rh=(bot-top)/6;
  for(let r=0;r<6;r++){const y0=top+r*rh,xs=x+(r%2?-w*.3:w*.3);o+=rect(x-w,y0,xs,y0+rh,st[r%3],1.4)+rect(xs,y0,x+w,y0+rh,st[(r+1)%3],1.4)}
  for(let c=0;c<3;c++)o+=rect(x-w+c*w*.8,top-s*.16,x-w+c*w*.8+w*.4,top,st[c%3],1.3);
  o+=rect(x-w*.3,y-s*.25,x+w*.3,y+s*.12,'#ffd35a',1.3);
  o+=P([[x-w,y+s*.1],[x-w-s*.28,y-s*.05],[x-w-s*.08,y+s*.02],[x-w-s*.22,y-s*.2],[x-w,y-s*.05]],'#ff7a2a',1.2);
  return o+P([[x+s*.95,y-s*1.05],[x+s*.3,y-s*.62],[x+s*.5,y-s*.58],[x+s*.05,y-s*.25],[x+s*.18,y-s*.5],[x-s*.02,y-s*.54],[x+s*.55,y-s*.98]],'#fff36a',1.3)},
 skull:(x,y,s)=>{const B=['#f1e8d2','#d9ccae'];let o=fan(x,y-s*.15,circ(x,y-s*.15,s*.78,s*.72,24),4,B,1.5);
  o+=P([[x-s*.42,y+s*.4],[x+s*.42,y+s*.4],[x+s*.32,y+s*.78],[x-s*.32,y+s*.78]],B[1],1.5);
  for(let k=1;k<4;k++){const xx=f1(x-s*.32+k*s*.16);o+=line(`M${xx} ${f1(y+s*.5)}V${f1(y+s*.78)}`,1.1)}
  o+=P(circ(x-s*.3,y-s*.05,s*.2,s*.22,12),'#1a1030',1.2)+P(circ(x+s*.3,y-s*.05,s*.2,s*.22,12),'#1a1030',1.2);
  o+=P(circ(x-s*.3,y-s*.05,s*.06,s*.06,8),'#9a7aff',.8)+P(circ(x+s*.3,y-s*.05,s*.06,s*.06,8),'#9a7aff',.8);
  return o+P([[x,y+s*.12],[x-s*.08,y+s*.3],[x+s*.08,y+s*.3]],'#1a1030',1.1)+line(`M${f1(x-s*.36)} ${f1(y+s*.5)}H${f1(x+s*.36)}`,1.1)},
 lantern:(x,y,s)=>{let o=line(`M${f1(x-s*.25)} ${f1(y-s*.62)}Q${f1(x)} ${f1(y-s*1.05)} ${f1(x+s*.25)} ${f1(y-s*.62)}`,2);
  o+=P([[x-s*.42,y-s*.45],[x+s*.42,y-s*.45],[x,y-s*.72]],GOLD[0],1.3);
  o+=grid(t=>[x-s*.36+t*s*.72,y-s*.45],t=>[x-s*.44+t*s*.88,y+s*.55],1,3,(i,j)=>j===1?'#fff2b0':'#ffd86a',1.4,1);
  o+=starShape(x,y+s*.05,s*.3,s*.1,6,-Math.PI/2,'#ffffff','#fff6c8',1);
  return o+P([[x-s*.5,y+s*.55],[x+s*.5,y+s*.55],[x+s*.36,y+s*.72],[x-s*.36,y+s*.72]],GOLD[0],1.3)},
 key:(x,y,s)=>ring(x,y-s*.58,s*.16,s*.36,10,[GOLD[1],GOLD[2]],0,Math.PI*2,1.3)+rect(x-s*.07,y-s*.22,x+s*.07,y+s*.92,GOLD[1],1.3)
  +rect(x+s*.07,y+s*.56,x+s*.32,y+s*.68,GOLD[2],1.2)+rect(x+s*.07,y+s*.78,x+s*.26,y+s*.9,GOLD[2],1.2),
 orb:(x,y,s,p)=>fan(x,y+s*.15,circ(x,y+s*.15,s*.62,s*.62,24),3,[p.arch[0],shade(p.arch[0],.3)],1.4)+rect(x-s*.62,y+s*.08,x+s*.62,y+s*.2,GOLD[1],1.2)
  +rect(x-s*.05,y-s*.95,x+s*.05,y-s*.47,GOLD[1],1.2)+rect(x-s*.2,y-s*.82,x+s*.2,y-s*.72,GOLD[2],1.2),
 shield:(x,y,s,p)=>{const pts=[[x-s*.68,y-s*.78],[x,y-s*.78],[x+s*.68,y-s*.78],[x+s*.68,y-s*.1]];
  for(let k=1;k<8;k++){const t=k/8;pts.push([x+s*.68*(1-t),y-s*.1+s*1.05*Math.sin(t*Math.PI/2)])}pts.push([x,y+s*.95]);
  for(let k=7;k>0;k--){const t=k/8;pts.push([x-s*.68*(1-t),y-s*.1+s*1.05*Math.sin(t*Math.PI/2)])}pts.push([x-s*.68,y-s*.1]);
  return fan(x,y-s*.05,pts,5,[p.arch[0],'#d9dde8',p.arch[1],'#b8bfcc'],1.5)+starShape(x,y-s*.05,s*.3,s*.12,8,-Math.PI/2,'#fff6c8',GOLD[1],1.1)},
 infinity:(x,y,s)=>ring(x-s*.48,y,s*.24,s*.48,10,[GOLD[1],GOLD[2]],0,Math.PI*2,1.3)+ring(x+s*.48,y,s*.24,s*.48,10,[GOLD[2],GOLD[1]],0,Math.PI*2,1.3),
 tri:(x,y,s)=>triF(x,y,[[x,y-s],[x+s*.87,y+s*.5],[x-s*.87,y+s*.5]]),
 trid:(x,y,s)=>triF(x,y,[[x,y+s],[x+s*.87,y-s*.5],[x-s*.87,y-s*.5]])+P(circ(x,y-s*.9,s*.22,s*.22,12),'#fff6c8',1.3),
 devil:(x,y,s)=>ring(x,y,s*.86,s,16,['#2a0a2e','#4a1240'],0,Math.PI*2,1.4)+starShape(x,y+s*.02,s*.84,s*.33,5,Math.PI/2,'#c81e2a','#7a0a14',1.3)
  +P([[x-s*.3,y-s*.7],[x-s*.85,y-s*1.25],[x-s*.62,y-s*.62]],'#efe3c4',1.3)+P([[x+s*.3,y-s*.7],[x+s*.85,y-s*1.25],[x+s*.62,y-s*.62]],'#efe3c4',1.3),
 trumpet:(x,y,s)=>{const R=pts=>rot(pts.map(([u,v])=>[u*s,v*s]),-Math.PI/6,x,y);let o='';
  o+=P(R([[-.5,.06],[.15,.06],[.15,.62],[-.5,.62]]),'#f6f6ff',1.3);
  o+=P(R([[-.22,.06],[-.13,.06],[-.13,.62],[-.22,.62]]),'#d8283a',1)+P(R([[-.5,.28],[.15,.28],[.15,.37],[-.5,.37]]),'#d8283a',1);
  o+=P(R([[-.95,-.06],[.42,-.06],[.42,.06],[-.95,.06]]),GOLD[1],1.3);
  o+=P(R([[.42,-.06],[.98,-.34],[.98,0],[.42,0]]),GOLD[2],1.3)+P(R([[.42,0],[.98,0],[.98,.34],[.42,.06]]),GOLD[1],1.3);
  return o+P(R([[-1.02,-.1],[-.95,-.1],[-.95,.1],[-1.02,.1]]),GOLD[0],1.1)},
 wreath:(x,y,s)=>{let o='';const n=22;for(let k=0;k<n;k++){const a=k/n*Math.PI*2,b=a+Math.PI*2/n*1.1;
   o+=lens(x+Math.cos(a)*s*.78,y+Math.sin(a)*s,x+Math.cos(b)*s*.78,y+Math.sin(b)*s,s*.1,k%2?'#2f8a55':'#4fb070',1.1)}
  o+=P([[x,y+s*.9],[x-s*.22,y+s*1.1],[x-s*.18,y+s*.86]],'#e8344e',1.1)+P([[x,y+s*.9],[x+s*.22,y+s*1.1],[x+s*.18,y+s*.86]],'#e8344e',1.1);
  return o+starShape(x,y,s*.42,s*.16,8,-Math.PI/2,'#fff6c8','#ffd35a',1.2)},
 rose:(x,y,s)=>flower(x,y,s,6,'#fdf3f6',0,'#ffd35a')+flower(x,y,s*.55,5,'#ffd6e4',.6,'#ffcf4a'),
};
