
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

function figure(sp,p,r){const hx=136,hy=128,sk='#f6dcc8',sk2='#e9c3a8',H=p.hair,cl=p.cloak,gw=p.gown;let s='';
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

const LAY={1:[[0,0]],2:[[0,-62],[0,62]],3:[[0,-80],[0,0],[0,80]],4:[[-40,-48],[40,-48],[-40,48],[40,48]],
 5:[[-42,-56],[42,-56],[0,0],[-42,56],[42,56]],6:[[-40,-80],[40,-80],[-40,0],[40,0],[-40,80],[40,80]],
 7:[[-40,-84],[40,-84],[0,-42],[-40,0],[40,0],[-40,84],[40,84]],8:[[-40,-90],[40,-90],[0,-45],[-40,0],[40,0],[0,45],[-40,90],[40,90]],
 9:[[-42,-96],[42,-96],[-42,-32],[42,-32],[0,0],[-42,32],[42,32],[-42,96],[42,96]],
 10:[[-42,-100],[42,-100],[0,-66],[-42,-33],[42,-33],[-42,33],[42,33],[0,66],[-42,100],[42,100]]};
function pips(c,p){const sz=c.pips===1?60:c.pips<=3?30:c.pips<=6?26:21;let s='';for(const[dx,dy]of LAY[c.pips])s+=E[c.em](136+dx,214+dy,sz,p);return s}

// mode: "all" = whole picture, "bg" = everything except the subject, "fg" = only the subject (figure / emblem / pips + foot flowers),
// so the 3D carousel can pop the character out of its card. The rng runs identically in every mode, so the layers line up.
function art(c,mode="all"){const p=c.pal,r=rng32(c.seed);let s="",fg="";const fig=c.fig;
 s+=bgMosaic(272,390,fig?[136,128]:[136,212],p,r);
 s+=archDraw(p);
 s+=fig?halo(136,128,46,p):halo(136,214,c.pips>1?100:84,p);
 s+=vines(p,r);
 if(c.top)s+=E[c.top](136,56,16,p);
 if(fig)fg+=figure(fig,p,r);
 else if(c.center)fg+=E[c.center](136,214,c.center==="tower"?70:62,p);
 else if(c.pips)fg+=pips(c,p);
 const ff=footFlowers(p,r);
 const post=pillars()+rosette(34,40,26,p)+rosette(238,40,26,p)+`<rect x="108" y="1" width="56" height="24" rx="5" fill="#120c24" stroke="#c9ced9" stroke-width="2"/>`;
 if(mode==="spirit"){if(fig)return fg; // avatar for cards without a person: a robed figure holding the card's own symbol, its symbols glowing behind
  const hk=["gold","brown","auburn","black","silver","white"][c.seed%6],p2=Object.assign({},p,{hair:HAIR[hk]}),r2=rng32(c.seed+11);
  return `<g opacity=".6">${fg}</g>`+figure({pose:"hold",hold:c.center||c.em,crown:c.seed%3===0},p2,r2)}
 return mode==="fg"?fg:mode==="bg"?s+ff+post:s+fg+ff+post}

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
