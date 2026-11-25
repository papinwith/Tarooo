
// ---------- palettes ----------
const COMMON={halo:['#c8901e','#f2c14e','#ffe39a'],leaf:['#1f6b4a','#3fa36b'],flowers:['#ff6a3d','#ffb347','#ec4f8c','#9b6bff','#4fd1ff','#ffe066']};
const TH={
 night:{bg:['#120a33','#24186e','#3a3fb0','#4d7fe0','#86c9ff','#dff4ff'],cloak:['#8a1616','#cf3a1e','#ff7a3d'],gown:['#1c2570','#3049b8','#6a8cf0'],arch:['#6a3fd0','#2fb6e8']},
 dawn:{bg:['#2a103d','#5b2a7a','#a2448a','#e8786a','#ffc47a','#fff1c9'],cloak:['#1f6e6a','#2fa39a','#7fe0c8'],gown:['#cfc8f0','#e8e4fb','#ffffff'],arch:['#ff8a4c','#7b4fd8']},
 royal:{bg:['#1a0820','#4a0f2e','#8c1d3a','#c8463a','#f0a050','#ffe3a8'],cloak:['#5a0d1e','#a3172f','#e04848'],gown:['#3c2a8a','#5a48c8','#8e7cf0'],arch:['#e7b53c','#7a2bd0']},
 rose:{bg:['#1c0a2e','#3d1660','#7a2c9a','#c552b0','#f39bd0','#ffe0f2'],cloak:['#2e3fae','#4f6ae0','#8fb0ff'],gown:['#c22f5a','#ea5a80','#ff9ab4'],arch:['#ff6fa8','#4fd1ff']},
 ember:{bg:['#150405','#3d0a0f','#7c1a12','#c0391a','#f07a28','#ffd27a'],cloak:['#2a1040','#4a2070','#7a40b0'],gown:['#9a2a10','#d24a1a','#ff8a3a'],arch:['#ffb347','#a02a8a']},
 forest:{bg:['#04140f','#0b3324','#16604a','#2f9a6e','#8fd8a0','#e8ffe0'],cloak:['#3a2a6e','#5a46a8','#8e7ae0'],gown:['#a0601a','#d8922a','#ffcc5a'],arch:['#ffd35a','#38c1d6']},
 abyss:{bg:['#04060f','#0c1a33','#163a5a','#2a6a80','#6ab0b8','#d0f0ee'],cloak:['#1a1a22','#33333f','#5a5a6e'],gown:['#3a2a6e','#5a48a8','#8e7ad8'],arch:['#8a6ae0','#3fd0c0']},
 sky:{bg:['#0a1040','#1a2e8a','#2a5ec8','#3fa0ec','#9ae0ff','#f4fcff'],cloak:['#1a3a8a','#2a62d0','#6aa6ff'],gown:['#cfd6f8','#e8ecff','#ffffff'],arch:['#ffd35a','#ff6fa8']},
 sea:{bg:['#060c2a','#0e2262','#13509a','#1f8ac0','#6ad0e0','#e0fbff'],cloak:['#6a1f8a','#9a3ac0','#d07af0'],gown:['#c88a10','#f2c14e','#ffe9a3'],arch:['#ffd35a','#ff7aa8']},
 steel:{bg:['#0a0a1e','#1e1e4a','#3a3a80','#6a6ab8','#a8b4e6','#eef0ff'],cloak:['#1e2a5a','#34488e','#6a80c8'],gown:['#a0a8b8','#c8d0dc','#eef2f8'],arch:['#7a5af0','#4fd1ff']},
 earth:{bg:['#08120a','#18301a','#2f5a2a','#6a8a2e','#d0b84a','#fff2c0'],cloak:['#5a2a12','#8a4a1e','#c07a3a'],gown:['#1f6b4a','#2fa36b','#7fe0a0'],arch:['#ffd35a','#5ad18a']},
};
const HAIR={silver:['#8d95ab','#c5ccdb','#eef2fa'],gold:['#a86b1d','#e0a84a','#ffd98a'],brown:['#4a2c18','#7a4a2a','#a8703e'],
 auburn:['#8a3a18','#c4602a','#f09050'],black:['#141420','#2a2a3a','#44445a'],white:['#c8ccd8','#e6e9f0','#ffffff']};
const SKIN={red:['#f28a6a','#d86a4a'],saffron:['#f2b070','#d98c4a'],fair:['#f6dcc8','#e9c3a8'],blue:['#78aef0','#5a8fd8'],gold:['#f2cc6a','#dcae48'],green:['#94d4a4','#70bc88'],white:['#f6f6fd','#dcdcf0'],ash:['#b4c2e0','#94a4c8'],dusk:['#c08e6c','#a07252']};
const mkPal=(theme,hair)=>Object.assign({},COMMON,TH[theme],{hair:HAIR[hair||'silver']});

// ---------- scene parts (art space 272 x 390) ----------
function bgMosaic(W,H,f,p,r){const cols=12,rows=17,cw=W/cols,ch=H/rows,G=[];let s='';
 for(let j=0;j<=rows;j++){G[j]=[];for(let i=0;i<=cols;i++){let x=i*cw,y=j*ch;if(i>0&&i<cols)x+=(r()-.5)*cw*.7;if(j>0&&j<rows)y+=(r()-.5)*ch*.7;G[j][i]=[x,y]}}
 const n=p.bg.length;
 const col=t3=>{const cx=(t3[0][0]+t3[1][0]+t3[2][0])/3,cy=(t3[0][1]+t3[1][1]+t3[2][1])/3;
  const d=Math.hypot(cx-f[0],(cy-f[1])*.85);let t=clamp(1-d/230+(r()-.5)*.24,0,1);let c=p.bg[Math.round(t*(n-1))];
  if(r()<.06)c=mix(c,p.arch[r()<.5?0:1],.45);return mix(c,r()<.5?'#ffffff':'#000000',r()*.07)};
 for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){const a=G[j][i],b=G[j][i+1],c=G[j+1][i+1],d=G[j+1][i];
  const T=r()<.5?[[a,b,c],[a,c,d]]:[[a,b,d],[b,c,d]];for(const t of T)s+=P(t,col(t),1.6)}
 return s}
function archDraw(p){const cx=136,cy=165,r1=82,r2=94,c=[p.arch[0],shade(p.arch[0],.3),p.arch[1],shade(p.arch[1],.3)];
 let s=ring(cx,cy,r1,r2,14,c,Math.PI,Math.PI*2);
 for(let k=0;k<8;k++){const y0=cy+k*28.5;s+=rect(cx-r2,y0,cx-r1,y0+28.5,c[k%4])+rect(cx+r1,y0,cx+r2,y0+28.5,c[(k+2)%4])}
 return s}
function halo(x,y,r,p){const g=p.halo;return fan(x,y,circ(x,y,r*.74,r*.74,32),2,['#fff6d6','#ffe8a8'],1.4)+ring(x,y,r*.74,r,20,[g[0],g[1],g[2],g[1]],0,Math.PI*2,1.8)}
function vines(p,r){let s='';for(const side of[0,1]){const x0=side?241:31,wv=y=>Math.sin((388-y)/270*9+side)*3;
  s+=grid(t=>[x0-2+wv(388-t*270),388-t*270],t=>[x0+2+wv(388-t*270),388-t*270],1,8,(i,j)=>j%2?p.leaf[0]:p.leaf[1],1.3);
  for(let k=0;k<7;k++){const y=372-k*40,x=x0+wv(y);
   s+=lens(x,y+12,x+(k%2?-14:14),y+3,4.5,p.leaf[1],1.3);
   s+=flower(x,y,10-k*.5,k%2?5:6,p.flowers[(k*2+side)%p.flowers.length],r()*6)}}
 return s}
function pillars(){let s='';for(const[a,b]of[[2,11],[14,21],[251,258],[261,270]]){
  for(let k=0;k<4;k++){const y0=k*97.5;s+=rect(a,y0,b,y0+97.5,k%2?'#16121f':'#1d1828',1.8)+rect(a+1.5,y0+4,a+3.2,y0+93,'#3a3350',.8)}
  s+=rect(a-1.5,0,b+1.5,8,'#2a2438',1.6)+rect(a-1.5,382,b+1.5,390,'#2a2438',1.6)}return s}
function rosette(x,y,r,p){return ring(x,y,r*.78,r,16,[p.arch[0],shade(p.arch[1],-.2),p.arch[1],shade(p.arch[0],-.2)],0,Math.PI*2,1.6)
 +fan(x,y,circ(x,y,r*.78,r*.78,24),3,[shade(p.bg[1],.1),p.bg[2]],1.3)+flower(x,y,r*.74,8,p.flowers[0],0,p.halo[1])+flower(x,y,r*.38,6,p.flowers[2],Math.PI/6,p.halo[2])}
function footFlowers(p,r){let s='';const F=[[-50,8,12],[-28,-2,14],[28,-2,14],[50,8,12],[0,2,16],[-14,14,11],[14,14,11]];
 for(const[dx,dy]of F)s+=lens(136+dx,378+dy,136+dx*1.5,360+dy,5,p.leaf[r()<.5?0:1],1.3);
 F.forEach(([dx,dy,rr],k)=>s+=flower(136+dx,376+dy,rr,k%2?5:6,p.flowers[(k+3)%p.flowers.length],r()*6));return s}
function crown(hx,y,p){const g=p.halo;let s=rect(hx-18,y-6,hx+18,y,g[0],1.5);
 for(let k=0;k<5;k++){const x0=hx-18+k*7.2;s+=P([[x0,y-6],[x0+3.6,y-(k%2?14:19)],[x0+7.2,y-6]],k%2?g[1]:g[2],1.4)}
 return s+P(circ(hx,y-3,2.4,2.4,8),'#e8344e',1)+P(circ(hx-10,y-3,1.8,1.8,8),'#4fd1ff',.9)+P(circ(hx+10,y-3,1.8,1.8,8),'#4fd1ff',.9)}

// Tarot figure (the original cloaked half-length figure, used by the tarot deck)
function figureT(sp,p,r){const hx=136,hy=128,sk='#f6dcc8',sk2='#e9c3a8',H=p.hair,cl=p.cloak,gw=p.gown;let s='';
 const mir=a=>a.map(([x,y])=>[2*hx-x,y]);
 // cloak + gown, split along the folds
 const cc=[cl[0],cl[1],cl[2],cl[1]],gc=[gw[0],gw[1],gw[2],gw[1]];
 s+=grid(t=>[hx-26-70*Math.pow(t,.8),hy+40+(392-hy-40)*t],t=>[hx+26+70*Math.pow(t,.8),hy+40+(392-hy-40)*t],8,3,(i,j)=>cc[(i+j)%4]);
 s+=grid(t=>[hx-15-20*t,hy+48+(392-hy-48)*t],t=>[hx+15+20*t,hy+48+(392-hy-48)*t],4,3,(i,j)=>gc[(i+j+1)%4]);
 s+=P([[hx-7,hy+18],[hx+7,hy+18],[hx+8,hy+36],[hx-8,hy+36]],sk2,1.5);
 // shawl
 const s1=[[hx-12,hy+30],[hx,hy+38],[hx-4,hy+66],[hx-26,hy+50]],s2=[[hx-26,hy+50],[hx-4,hy+66],[hx-20,hy+74],[hx-48,hy+62],[hx-42,hy+48]];
 s+=P(s1,cl[2])+P(s2,cl[1])+P(mir(s1),cl[1])+P(mir(s2),cl[2])+P(circ(hx,hy+42,4,4,10),GOLD[1],1.3);
 // back hair
 const hc=[H[0],H[1],H[2],H[1]];
 if(!sp.hood&&!sp.helm){const o=[[hx,hy-36],[hx-20,hy-32],[hx-31,hy-16],[hx-34,hy+8],[hx-37,hy+34],[hx-42,hy+62]],
   n=[[hx,hy-27],[hx-14,hy-24],[hx-21,hy-12],[hx-22,hy+8],[hx-20,hy+30],[hx-16,hy+58]];
  s+=grid(poly(o),poly(n),3,5,(i,j)=>hc[(i+j)%4],1.7)+grid(poly(mir(o)),poly(mir(n)),3,5,(i,j)=>hc[(i+j+1)%4],1.7)}
 // sleeves + hands
 if(sp.pose==='pray'){const sl=[[hx-42,hy+60],[hx-14,hy+92],[hx-12,hy+116],[hx-32,hy+122],[hx-52,hy+92]],cu=[[hx-14,hy+92],[hx-9,hy+96],[hx-8,hy+114],[hx-12,hy+116]];
  s+=P(sl,cl[1])+P(mir(sl),cl[2])+P(cu,gw[2],1.4)+P(mir(cu),gw[2],1.4);
  s+=P([[hx,hy+64],[hx-10,hy+88],[hx-9,hy+110],[hx,hy+112]],sk,1.6)+P([[hx,hy+64],[hx+10,hy+88],[hx+9,hy+110],[hx,hy+112]],sk2,1.6);
 }else{const sl=[[hx-42,hy+60],[hx-16,hy+110],[hx-14,hy+132],[hx-36,hy+136],[hx-54,hy+100]];
  s+=P(sl,cl[1])+P(mir(sl),cl[2]);
  if(sp.hold)s+=E[sp.hold](hx,hy+98,24,p);
  s+=P(circ(hx-11,hy+126,8,7,10),sk,1.5)+P(circ(hx+11,hy+126,8,7,10),sk2,1.5)}
 // hood / helm
 if(sp.hood||sp.helm){const hcol=sp.helm?['#8a90a0','#b8bfcc','#dde2ea']:cl,
   o=[[hx-40,hy+62],[hx-36,hy+20],[hx-30,hy-18],[hx-16,hy-36],[hx,hy-40],[hx+16,hy-36],[hx+30,hy-18],[hx+36,hy+20],[hx+40,hy+62]],
   n=[[hx-20,hy+40],[hx-23,hy+10],[hx-21,hy-12],[hx-12,hy-26],[hx,hy-29],[hx+12,hy-26],[hx+21,hy-12],[hx+23,hy+10],[hx+20,hy+40]];
  s+=P(n,shade(hcol[0],-.4),1.4)+grid(poly(o),poly(n),1,10,(i,j)=>hcol[j%3],1.7);
  if(sp.helm)s+=P([[hx-4,hy-40],[hx+4,hy-40],[hx+14,hy-62],[hx+2,hy-56]],'#e8344e',1.3)}
 // face
 s+=P(circ(hx,hy,20,25,28),sk,1.8);
 s+=line(`M${hx-13} ${hy+1}Q${hx-8} ${hy+5} ${hx-3} ${hy+1}M${hx+3} ${hy+1}Q${hx+8} ${hy+5} ${hx+13} ${hy+1}`,1.6);
 s+=`<path d="M${hx-13} ${hy-5}Q${hx-8} ${hy-8} ${hx-3} ${hy-5}M${hx+3} ${hy-5}Q${hx+8} ${hy-8} ${hx+13} ${hy-5}" fill="none" stroke-width="1" opacity=".55"/>`;
 s+=line(`M${hx} ${hy+3}L${hx-1.5} ${hy+11}L${hx+1.5} ${hy+12}`,1.1)+line(`M${hx-4} ${hy+17}Q${hx} ${hy+19.5} ${hx+4} ${hy+17}`,1.3);
 // fringe
 if(!sp.hood&&!sp.helm){s+=grid(arcF(hx,hy-2,23,30,Math.PI*200/180,Math.PI*340/180),poly([[hx-21,hy-6],[hx-12,hy-12],[hx,hy-10],[hx+12,hy-12],[hx+21,hy-6]]),1,6,(i,j)=>hc[(j+1)%4],1.6)}
 if(sp.crown)s+=crown(hx,hy-26,p);
 return s}
// Deity figure (full body: head, torso, two arms with hands + fingers, two legs with feet).
// sp.male: broad bare-chested male body (dhoti, sash, garland, short hair) · otherwise the female sari/gown body.
// sp.pose: hold | pray | bless (right palm raised) | warrior (weapon raised) | bow (archer) | flute | sit (cross-legged on a lotus)
// sp.lean: tilt in degrees · sp.hold/hs: emblem held · sp.hold2/hs2: emblem in the other raised hand · sp.extra: extra arms
// sp.headEmb: replaces the head with an emblem (Ganesha) · sp.belly · sp.aura/auraS: emblem glowing behind the head · sp.cw: cape width
function figure(sp,p,r){const hx=136,hy=128,[sk,sk2]=SKIN[sp.skin||'fair'],H=p.hair,cl=p.cloak,gw=p.gown,male=!!sp.male,pose=sp.pose||'hold',sit=pose==='sit';let s='';
 const mir=a=>a.map(([x,y])=>[2*hx-x,y]),bot=hy+212;
 const cc=[cl[0],cl[1],cl[2],cl[1]],gc=[gw[0],gw[1],gw[2],gw[1]],hc=[H[0],H[1],H[2],H[1]];
 const seg=(a,b,w1,w2,c)=>{const dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,nx=-dy/l,ny=dx/l;
  return P([[a[0]+nx*w1,a[1]+ny*w1],[b[0]+nx*w2,b[1]+ny*w2],[b[0]-nx*w2,b[1]-ny*w2],[a[0]-nx*w1,a[1]-ny*w1]],c,1.5)};
 // a hand: palm + 4 fingers + thumb. open = fingers spread out (blessing / raised); otherwise a loose grip
 const hand=(hd,el,c,open)=>{const dx=hd[0]-el[0],dy=hd[1]-el[1],l=Math.hypot(dx,dy)||1,ux=dx/l,uy=dy/l,nx=-uy,ny=ux;
  let o=P(circ(hd[0],hd[1],7.5,7,10),c,1.4);
  for(let k=-1.5;k<=1.5;k++){const b=[hd[0]+ux*5+nx*k*3.6,hd[1]+uy*5+ny*k*3.6],len=open?11:6,t=[b[0]+ux*len+nx*k*(open?2:.4),b[1]+uy*len+ny*k*(open?2:.4)];o+=lens(b[0],b[1],t[0],t[1],1.7,c,1.1)}
  return o+lens(hd[0]+nx*5,hd[1]+ny*5,hd[0]+nx*10+ux*7,hd[1]+ny*10+uy*7,2,c,1.1)};
 if(sp.aura)s+=E[sp.aura](hx,hy,sp.auraS||58,p);
 if(sp.flank)s+=E[sp.flank](hx-78,hy+150,30,p,1)+E[sp.flank](hx+78,hy+150,30,p,-1);
 if(sp.cobra)for(const k of[-2,2,-1,1,0])s+=P(circ(hx+k*17,hy-32+Math.abs(k)*9,12,17,12),Math.abs(k)%2?'#2fa39a':'#3fb8a8',1.6)+P(circ(hx+k*17,hy-32+Math.abs(k)*9+4,4,6,8),'#f6f1d0',1)+P(circ(hx+k*17-2,hy-34+Math.abs(k)*9,1.2,1.2,5),'#1a1030',.8)+P(circ(hx+k*17+2,hy-34+Math.abs(k)*9,1.2,1.2,5),'#1a1030',.8);
 // ----- back cloak / cape -----
 const cw=sp.cw!==undefined?sp.cw:(male?.62:1);
 s+=grid(t=>[hx-26-70*cw*Math.pow(t,.8),hy+40+(bot-hy-40)*t],t=>[hx+26+70*cw*Math.pow(t,.8),hy+40+(bot-hy-40)*t],8,3,(i,j)=>cc[(i+j)%4]);
 // ----- standing: two legs with anklets and feet (drawn first; the hem of the garment overlaps their tops) -----
 if(!sit){const top=hy+170,an=hy+224;
  for(const d of[-1,1]){const x0=hx+d*17,c=d<0?sk:sk2;
   s+=P([[x0-9.5,top],[x0+9.5,top],[x0+6.5,an],[x0-6.5,an]],c,1.6)+rect(x0-7.6,an-9,x0+7.6,an-4,GOLD[1],1.3)
    +P(circ(x0+d*5,an+8,13,6.5,10),c,1.6)+P(circ(x0+d*15,an+8.5,2.6,2.6,6),shade(c,-.08),1)+P(circ(x0+d*10,an+11,2.4,2.4,6),shade(c,-.08),1)}}
 // ----- lower garment -----
 if(male){const end=sit?bot:hy+178;s+=grid(t=>[hx-24-(sit?26:13)*t,hy+96+(end-hy-96)*t],t=>[hx+24+(sit?26:13)*t,hy+96+(end-hy-96)*t],4,3,(i,j)=>gc[(i+j+1)%4])}
 else{const end=sit?bot:hy+198;s+=grid(t=>[hx-15-(sit?20:30)*t,hy+48+(end-hy-48)*t],t=>[hx+15+(sit?20:30)*t,hy+48+(end-hy-48)*t],4,3,(i,j)=>gc[(i+j+1)%4])}
 // ----- seated: crossed legs on a lotus seat -----
 if(sit){const lp=['#ff9ac4','#ff6fa8','#ffc4de'];
  for(let k=-3;k<=3;k++)s+=lens(hx+k*8,hy+240,hx+k*36,hy+222+Math.abs(k)*6,11,lp[Math.abs(k)%3],1.3);
  const th=[[hx,hy+176],[hx-42,hy+166],[hx-86,hy+196],[hx-74,hy+218],[hx-20,hy+216]];
  s+=P(th,gc[1],1.6)+P(mir(th),gc[2],1.6)+P(circ(hx-26,hy+212,13,7,10),sk,1.4)+P(circ(hx+26,hy+212,13,7,10),sk2,1.4)
   +P(circ(hx-40,hy+210,2.6,2.6,6),shade(sk,-.08),1)+P(circ(hx+40,hy+210,2.6,2.6,6),shade(sk2,-.08),1)}
 // ----- torso -----
 if(male){const tor=[[hx-34,hy+38],[hx+34,hy+38],[hx+26,hy+100],[hx-26,hy+100]];
  s+=P([[hx-6,hy+16],[hx+6,hy+16],[hx+8,hy+40],[hx-8,hy+40]],sk2,1.5)+P(tor,sk,1.7)+P([[hx,hy+38],[hx+34,hy+38],[hx+26,hy+100],[hx,hy+100]],sk2,1.4);
  if(sp.belly)s+=P(circ(hx,hy+80,38,31,18),sk,1.7)+P([[hx,hy+49],[hx+14,hy+52],[hx+30,hy+68],[hx+36,hy+86],[hx+26,hy+104],[hx,hy+111]],sk2,1.4)+P(circ(hx,hy+84,2.6,2.6,6),shade(sk,-.18),1);
  else s+=line(`M${hx-18} ${hy+56}Q${hx-8} ${hy+64} ${hx-1} ${hy+58}M${hx+18} ${hy+56}Q${hx+8} ${hy+64} ${hx+1} ${hy+58}`,1.1);
  s+=P([[hx-34,hy+38],[hx-18,hy+38],[hx+30,hy+100],[hx+12,hy+100]],cl[2],1.5)+rect(hx-26,hy+96,hx+26,hy+105,GOLD[1],1.5);
  for(let k=0;k<7;k++){const a=Math.PI*.12+k*Math.PI*.76/6;s+=P(circ(hx+Math.cos(a)*-20,hy+34+Math.sin(a)*18,3.2,3.2,7),p.flowers[k%p.flowers.length],1)}
 }else{s+=P([[hx-7,hy+18],[hx+7,hy+18],[hx+8,hy+36],[hx-8,hy+36]],sk2,1.5);
  const s1=[[hx-12,hy+30],[hx,hy+38],[hx-4,hy+66],[hx-26,hy+50]],s2=[[hx-26,hy+50],[hx-4,hy+66],[hx-20,hy+74],[hx-48,hy+62],[hx-42,hy+48]];
  s+=P(s1,cl[2])+P(s2,cl[1])+P(mir(s1),cl[1])+P(mir(s2),cl[2])+P(circ(hx,hy+42,4,4,10),GOLD[1],1.3)}
 // ----- back hair (women only) -----
 if(!male&&!sp.hood&&!sp.helm&&!sp.headEmb){const o=[[hx,hy-36],[hx-20,hy-32],[hx-31,hy-16],[hx-34,hy+8],[hx-37,hy+34],[hx-42,hy+62]],
   n=[[hx,hy-27],[hx-14,hy-24],[hx-21,hy-12],[hx-22,hy+8],[hx-20,hy+30],[hx-16,hy+58]];
  s+=grid(poly(o),poly(n),3,5,(i,j)=>hc[(i+j)%4],1.7)+grid(poly(mir(o)),poly(mir(n)),3,5,(i,j)=>hc[(i+j+1)%4],1.7)}
 // ----- extra arms (multi-armed deities) -----
 if(sp.extra)sp.extra.forEach((nm,k)=>{const sd=k%2?1:-1,row=k>>1,ex=hx+sd*(66+row*8),ey=hy+84-row*52,ac=male?(sd<0?sk:sk2):cl[1+(k%2)],hd=[ex,ey+10];
  s+=P([[hx+sd*30,hy+52],[hx+sd*42,hy+66],[ex+sd*7,ey+14],[ex-sd*7,ey+14]],ac,1.4);
  if(E[nm])s+=E[nm](ex,ey-12,20,p);
  s+=hand(hd,[hx+sd*40,hy+66],sd<0?sk:sk2,true)});
 // ----- arms, hands, held emblems by pose -----
 const hs=sp.hs||24;
 const PO={hold:{L:[[hx-48,hy+96],[hx-11,hy+124]],R:[[hx+48,hy+96],[hx+11,hy+124]],e:[hx,hy+98]},
  pray:{L:[[hx-42,hy+100],[hx-4,hy+94]],R:[[hx+42,hy+100],[hx+4,hy+94]],pray:1},
  bless:{L:[[hx-48,hy+96],[hx-14,hy+124]],R:[[hx+54,hy+92],[hx+56,hy+54]],e:[hx-6,hy+100],palm:'R'},
  warrior:{L:[[hx-54,hy+88],[hx-62,hy+64]],R:[[hx+56,hy+88],[hx+62,hy+62]],palm:'L',w1:[hx+62,hy+62-hs*.2],w2:[hx-62,hy+62-(sp.hs2||26)*.2]},
  bow:{L:[[hx-54,hy+78],[hx-67,hy+78]],R:[[hx+40,hy+68],[hx-2,hy+76]],b:[hx-60,hy+78]},
  flute:{L:[[hx-52,hy+84],[hx-14,hy+38]],R:[[hx+52,hy+78],[hx+20,hy+22]],f:[hx+2,hy+24]},
  sit:{L:[[hx-50,hy+104],[hx-14,hy+172]],R:[[hx+50,hy+104],[hx+14,hy+172]],e:[hx,hy+150]}}[pose]||{};
 const limb=(sd,el,hd)=>{const sh=[hx+sd*32,hy+50],wu=male?10:12,wf=male?8:10,ac=male?(sd<0?sk:sk2):(sd<0?cl[1]:cl[2]),skn=sd<0?sk:sk2;
  let o=seg(sh,el,wu+2,wu,ac)+P(circ(el[0],el[1],wu,wu,10),ac,1.4);
  if(male)o+=seg(el,hd,wu,wf-1,skn)+seg(L2(sh,el,.45),L2(sh,el,.62),wu+.8,wu+.4,GOLD[1])+seg(L2(el,hd,.8),L2(el,hd,.9),wf-.6,wf-.8,GOLD[1]);
  else o+=seg(el,L2(el,hd,.5),wu,wf,ac)+seg(L2(el,hd,.5),hd,wf-2.5,wf-3.5,skn)+seg(L2(el,hd,.78),L2(el,hd,.88),wf-3,wf-3.4,GOLD[1]);
  return o};
 s+=limb(-1,...PO.L)+limb(1,...PO.R);
 if(PO.e&&sp.hold)s+=E[sp.hold](PO.e[0],PO.e[1],hs,p);
 if(PO.w1&&sp.hold)s+=E[sp.hold](PO.w1[0],PO.w1[1],hs,p);
 if(PO.w1&&sp.hold2)s+=E[sp.hold2](PO.w2[0],PO.w2[1],sp.hs2||26,p);
 if(PO.b&&sp.hold)s+=E[sp.hold](PO.b[0],PO.b[1],hs,p);
 if(PO.f&&sp.hold)s+=E[sp.hold](PO.f[0],PO.f[1],hs,p);
 if(PO.pray){const f=(x,c)=>lens(hx+x,hy+84,hx+x*1.1,hy+68,2.2,c,1.1);
  s+=P([[hx,hy+78],[hx-9,hy+94],[hx,hy+110],[hx+9,hy+94]],sk,1.6)+f(-4,sk)+f(-1.5,sk)+f(1.5,sk2)+f(4,sk2)}
 else{s+=hand(PO.L[1],PO.L[0],sk,PO.palm==='L')+hand(PO.R[1],PO.R[0],sk2,PO.palm==='R')}
 // ----- hood / helm -----
 if(sp.hood||sp.helm){const hcol=sp.helm?['#8a90a0','#b8bfcc','#dde2ea']:cl,
   o=[[hx-40,hy+62],[hx-36,hy+20],[hx-30,hy-18],[hx-16,hy-36],[hx,hy-40],[hx+16,hy-36],[hx+30,hy-18],[hx+36,hy+20],[hx+40,hy+62]],
   n=[[hx-20,hy+40],[hx-23,hy+10],[hx-21,hy-12],[hx-12,hy-26],[hx,hy-29],[hx+12,hy-26],[hx+21,hy-12],[hx+23,hy+10],[hx+20,hy+40]];
  s+=P(n,shade(hcol[0],-.4),1.4)+grid(poly(o),poly(n),1,10,(i,j)=>hcol[j%3],1.7);
  if(sp.helm)s+=P([[hx-4,hy-40],[hx+4,hy-40],[hx+14,hy-62],[hx+2,hy-56]],'#e8344e',1.3)}
 // ----- head -----
 if(sp.headEmb)s+=E[sp.headEmb](hx,hy+10,40,p);
 else{
  if(male&&!sp.hood&&!sp.helm){const sd2=[[hx-21,hy-14],[hx-25,hy+4],[hx-21,hy+12],[hx-18,hy-4]];s+=P(sd2,hc[1],1.5)+P(mir(sd2),hc[2],1.5);
   if(!sp.crown&&!sp.jata)s+=P(circ(hx,hy-38,9,10,10),hc[1],1.6)}
  if(sp.heads)for(const d of[-1,1])s+=P(circ(hx+d*25,hy-2,14,21,14),d<0?sk:sk2,1.6)+line(`M${hx+d*25-8} ${hy-4}Q${hx+d*25-4} ${hy-1} ${hx+d*25} ${hy-4}`,1.2)+line(`M${hx+d*25+1} ${hy-4}Q${hx+d*25+5} ${hy-1} ${hx+d*25+9} ${hy-4}`,1.2)+P([[hx+d*25-9,hy+10],[hx+d*25+9,hy+10],[hx+d*25,hy+30]],H[2],1.3);
  s+=P(circ(hx,hy,male?21:20,25,28),sk,1.8);
  if(sp.beard)s+=P([[hx-15,hy+12],[hx-9,hy+20],[hx,hy+22],[hx+9,hy+20],[hx+15,hy+12],[hx+8,hy+40],[hx,hy+48],[hx-8,hy+40]],H[2],1.5);
  s+=line(`M${hx-13} ${hy+1}Q${hx-8} ${hy+5} ${hx-3} ${hy+1}M${hx+3} ${hy+1}Q${hx+8} ${hy+5} ${hx+13} ${hy+1}`,1.6);
  s+=`<path d="M${hx-13} ${hy-5}Q${hx-8} ${hy-8} ${hx-3} ${hy-5}M${hx+3} ${hy-5}Q${hx+8} ${hy-8} ${hx+13} ${hy-5}" fill="none" stroke-width="${male?1.9:1}" opacity="${male?.9:.55}"/>`;
  s+=line(`M${hx} ${hy+3}L${hx-1.5} ${hy+11}L${hx+1.5} ${hy+12}`,1.1)+line(`M${hx-4} ${hy+17}Q${hx} ${hy+19.5} ${hx+4} ${hy+17}`,1.3);
  if(male&&!sp.beard)s+=line(`M${hx-8} ${hy+14}Q${hx-4} ${hy+11} ${hx} ${hy+13}Q${hx+4} ${hy+11} ${hx+8} ${hy+14}`,1.9);
  if(sp.dot||sp.tilak)s+=P(circ(hx,hy-11,2.3,2.3,8),'#e8344e',1);
  if(sp.tilak)s+=rect(hx-6,hy-21,hx-4.4,hy-9,'#fff6e0',1)+rect(hx+4.4,hy-21,hx+6,hy-9,'#fff6e0',1);
  if(!sp.hood&&!sp.helm){s+=grid(arcF(hx,hy-2,23,30,Math.PI*200/180,Math.PI*340/180),poly([[hx-21,hy-6],[hx-12,hy-12],[hx,hy-10],[hx+12,hy-12],[hx+21,hy-6]]),1,6,(i,j)=>hc[(j+1)%4],1.6)}
  if(sp.crown)s+=crown(hx,hy-26,p);
  if(sp.jata)s+=P(circ(hx,hy-44,13,17,14),H[1],1.6)+P(circ(hx,hy-44,6,9,10),H[2],1.2)+E.moon(hx+9,hy-62,8);
  if(sp.peacock)s+=lens(hx+2,hy-32,hx+16,hy-68,5,'#2fa36b',1.2)+P(circ(hx+16,hy-68,3.6,3.6,8),'#38c1d6',1)+P(circ(hx+16,hy-68,1.5,1.5,6),'#2a1a70',.8)}
 return sp.lean?`<g transform="rotate(${sp.lean} ${hx} 392)">${s}</g>`:s}

const LAY={1:[[0,0]],2:[[0,-62],[0,62]],3:[[0,-80],[0,0],[0,80]],4:[[-40,-48],[40,-48],[-40,48],[40,48]],
 5:[[-42,-56],[42,-56],[0,0],[-42,56],[42,56]],6:[[-40,-80],[40,-80],[-40,0],[40,0],[-40,80],[40,80]],
 7:[[-40,-84],[40,-84],[0,-42],[-40,0],[40,0],[-40,84],[40,84]],8:[[-40,-90],[40,-90],[0,-45],[-40,0],[40,0],[0,45],[-40,90],[40,90]],
 9:[[-42,-96],[42,-96],[-42,-32],[42,-32],[0,0],[-42,32],[42,32],[-42,96],[42,96]],
 10:[[-42,-100],[42,-100],[0,-66],[-42,-33],[42,-33],[-42,33],[42,33],[0,66],[-42,100],[42,100]]};
function pips(c,p){const sz=c.pips===1?60:c.pips<=3?30:c.pips<=6?26:21;let s='';for(const[dx,dy]of LAY[c.pips])s+=E[c.em](136+dx,214+dy,sz,p);return s}

// mode: "all" = whole picture, "bg" = everything except the subject, "fg" = only the subject (figure / emblem / pips + foot flowers),
// so the 3D carousel can pop the character out of its card. The rng runs identically in every mode, so the layers line up.
function art(c,mode="all"){const p=c.pal,r=rng32(c.seed);let s="",fg="";const fig=c.fig,tarot=c.deck==="tarot",FIG=tarot?figureT:figure;
 s+=bgMosaic(272,390,fig?[136,128]:[136,212],p,r);
 s+=archDraw(p);
 s+=fig?halo(136,128,46,p):halo(136,214,c.pips>1?100:84,p);
 s+=vines(p,r);
 if(c.top)s+=E[c.top](136,56,16,p);
 if(fig){if(fig.twin){const place=(g,dx,k)=>`<g transform="translate(${dx} 0) translate(136 392) scale(${k}) translate(-136 -392)">${g}</g>`;
   fg+=place(figure(Object.assign({},fig,fig.twin[0]),p,r),-47,.8)+place(figure(Object.assign({},fig,fig.twin[1]),p,r),47,.8)}
  else fg+=FIG(fig,p,r)}
 else if(c.center)fg+=E[c.center](136,214,c.center==="tower"?70:62,p);
 else if(c.pips)fg+=pips(c,p);
 const ff=footFlowers(p,r);
 const post=pillars()+rosette(34,40,26,p)+rosette(238,40,26,p)+`<rect x="108" y="1" width="56" height="24" rx="5" fill="#120c24" stroke="#c9ced9" stroke-width="2"/>`;
 if(mode==="spirit"){if(fig)return fg; // avatar for cards without a person: a robed figure holding the card's own symbol, its symbols glowing behind
  const hk=["gold","brown","auburn","black","silver","white"][c.seed%6],p2=Object.assign({},p,{hair:HAIR[hk]}),r2=rng32(c.seed+11);
  return `<g opacity=".6">${fg}</g>`+FIG({pose:"hold",hold:c.center||c.em,crown:c.seed%3===0},p2,r2)}
 return mode==="fg"?fg:mode==="bg"?s+ff+post:tarot?s+fg+ff+post:s+ff+fg+post}

const SILVER=`<linearGradient id="sv" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6f8fc"/><stop offset=".18" stop-color="#a3a9b7"/><stop offset=".35" stop-color="#eceff5"/><stop offset=".52" stop-color="#868c9b"/><stop offset=".7" stop-color="#dde1e9"/><stop offset=".86" stop-color="#9ba1af"/><stop offset="1" stop-color="#f1f3f8"/></linearGradient>`;
const FRAME=`<rect width="300" height="500" rx="18" fill="url(#sv)"/><rect x="6" y="6" width="288" height="488" rx="13" fill="none" stroke="#6b7182" stroke-width="1.2"/><rect x="8.5" y="8.5" width="283" height="483" rx="11" fill="none" stroke="#fff" stroke-opacity=".6"/>`;
function bandMosaic(p,r){let s='';const x0=14,y0=410,w=272,h=78,cols=14,rows=3,cw=w/cols,ch=h/rows,G=[];
 for(let j=0;j<=rows;j++){G[j]=[];for(let i=0;i<=cols;i++){let x=x0+i*cw,y=y0+j*ch;if(i>0&&i<cols)x+=(r()-.5)*cw*.6;if(j>0&&j<rows)y+=(r()-.5)*ch*.5;G[j][i]=[x,y]}}
 const cs=[p.bg[0],p.bg[1],p.bg[2],p.arch[0],p.arch[1]].map((c,i)=>mix(c,'#05040f',[.35,.55,.7,.72,.75][i]));
 for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){const a=G[j][i],b=G[j][i+1],c=G[j+1][i+1],d=G[j+1][i];
  for(const t of(r()<.5?[[a,b,c],[a,c,d]]:[[a,b,d],[b,c,d]]))s+=P(t,cs[Math.floor(r()*cs.length)])}return s}
function faceSVG(c,mode="all"){const r=rng32(c.seed+5);
 if(mode==="fg"||mode==="spirit")return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 500"><g transform="translate(14 14)" stroke="${LEAD}" stroke-width="2.2" stroke-linejoin="round">${art(c,mode)}</g></svg>`;
 return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 500"><defs>${SILVER}<clipPath id="cw"><rect x="14" y="14" width="272" height="390" rx="6"/></clipPath><clipPath id="cb"><rect x="14" y="410" width="272" height="78" rx="6"/></clipPath></defs>${FRAME}
<g clip-path="url(#cw)"><g transform="translate(14 14)" stroke="${LEAD}" stroke-width="2.2" stroke-linejoin="round">${art(c,mode)}</g></g>
<rect x="14" y="14" width="272" height="390" rx="6" fill="none" stroke="${LEAD}" stroke-width="3.5"/>
<g clip-path="url(#cb)" stroke="#05040a" stroke-width="1.6" stroke-linejoin="round">${bandMosaic(c.pal,r)}</g>
<rect x="14" y="410" width="272" height="78" rx="6" fill="none" stroke="${LEAD}" stroke-width="3.5"/>
<path d="M66 441H140M160 441H234" stroke="#c9ced9" stroke-width=".9" opacity=".75"/><path d="M150 437l4 4-4 4-4-4z" fill="#dfe4ee"/></svg>`}
function starPath(cx,cy,r1,r2,n,ro){let d='';for(let k=0;k<n*2;k++){const a=ro+k*Math.PI/n,rr=k%2?r2:r1;d+=(k?'L':'M')+f1(cx+Math.cos(a)*rr)+' '+f1(cy+Math.sin(a)*rr)}return d+'Z'}
function backSVG(){const r=rng32(99);let st='',dots='';
 const s4=(x,y,s)=>`<path d="M${x} ${y-s}Q${x} ${y} ${x+s} ${y}Q${x} ${y} ${x} ${y+s}Q${x} ${y} ${x-s} ${y}Q${x} ${y} ${x} ${y-s}Z"/>`;
 for(let i=0;i<95;i++){const x=f1(30+r()*240),y=f1(30+r()*440);if(Math.hypot(x-150,y-250)<88)continue;st+=s4(x,y,f1(1.2+r()*r()*6))}
 for(let i=0;i<130;i++)dots+=`<circle cx="${f1(22+r()*256)}" cy="${f1(22+r()*456)}" r="${f1(.4+r()*.8)}"/>`;
 return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 500"><defs>${SILVER}<radialGradient id="bk" cx=".5" cy=".5" r=".7"><stop offset="0" stop-color="#2a2370"/><stop offset=".6" stop-color="#14104a"/><stop offset="1" stop-color="#07061f"/></radialGradient></defs>${FRAME}
<rect x="14" y="14" width="272" height="472" rx="8" fill="url(#bk)" stroke="${LEAD}" stroke-width="3"/>
<rect x="24" y="24" width="252" height="452" rx="5" fill="none" stroke="#c9ced9" stroke-width="1.2"/><rect x="29" y="29" width="242" height="442" rx="3" fill="none" stroke="#c9ced9" stroke-width=".6" stroke-dasharray="2 3"/>
<g fill="#c9d2ff" opacity=".55">${dots}</g><g fill="#e6eaf2">${st}</g>
<g fill="none" stroke="#dfe4ee"><circle cx="150" cy="250" r="80" stroke-width="2"/><circle cx="150" cy="250" r="72" stroke-width=".8" stroke-dasharray="1 3"/><circle cx="150" cy="250" r="30" stroke-width="1"/></g>
<path d="${starPath(150,250,66,24,8,-Math.PI/2)}" fill="url(#sv)" stroke="#5e6474" stroke-width="1.2"/><path d="${starPath(150,250,30,12,8,-Math.PI/2+Math.PI/8)}" fill="#14104a" stroke="#dfe4ee"/>
<circle cx="150" cy="250" r="6" fill="#f1f3f8"/>
<path d="M150 70a26 26 0 1 0 0 52a20 20 0 1 1 0-52z" fill="url(#sv)"/><path d="M150 378a26 26 0 1 1 0 52a20 20 0 1 0 0-52z" fill="url(#sv)"/>
<g fill="url(#sv)"><path d="${starPath(48,48,12,3,4,-Math.PI/2)}"/><path d="${starPath(252,48,12,3,4,-Math.PI/2)}"/><path d="${starPath(48,452,12,3,4,-Math.PI/2)}"/><path d="${starPath(252,452,12,3,4,-Math.PI/2)}"/></g></svg>`}
