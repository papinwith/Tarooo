
// ---------- cinematic reveals for UR / SP cards: a full-screen scene plays BEFORE the card appears (each card has its own, none repeat) ----------
// play(card,onClimax,onDone): hides nothing itself — the caller hides the card, we call onClimax() at the climax so the card can pop in.
const CINE=(()=>{
 const TAU=Math.PI*2,c01=x=>x<0?0:x>1?1:x,seg=(t,a,b)=>c01((t-a)/(b-a)),eo=p=>1-Math.pow(1-p,3),eio=p=>p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2,lerp=(a,b,t)=>a+(b-a)*t;
 const mkR=a=>()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
 const mix=(a,b,t)=>a.map((v,i)=>Math.round(v+(b[i]-v)*t)).join(',');
 const fade=(t,E,len)=>1-seg(t,E.tc,E.tc+(len||1.2));
 const glow=(g,x,y,r,c,a)=>{if(a<=0||r<=0)return;const q=g.createRadialGradient(x,y,0,x,y,r);q.addColorStop(0,`rgba(${c},${a})`);q.addColorStop(1,`rgba(${c},0)`);g.fillStyle=q;g.fillRect(x-r,y-r,r*2,r*2)};
 const flash=(g,E,t,c,w)=>{const k=1-Math.abs(t-E.tc)/(w||.4);if(k>0){g.fillStyle=`rgba(${c||'255,255,255'},${Math.min(1,k*k*1.15)})`;g.fillRect(0,0,E.W,E.H)}};
 const dim=(g,E,c,a)=>{g.fillStyle=`rgba(${c},${a})`;g.fillRect(0,0,E.W,E.H)};
 const heartP=(g,x,y,s)=>{g.beginPath();g.moveTo(x,y+s*.35);g.bezierCurveTo(x-s*1.1,y-s*.35,x-s*.5,y-s*1.1,x,y-s*.45);g.bezierCurveTo(x+s*.5,y-s*1.1,x+s*1.1,y-s*.35,x,y+s*.35);g.closePath()};
 const ell=(g,x,y,rx,ry,rot)=>{g.beginPath();g.ellipse(x,y,Math.max(.01,rx),Math.max(.01,ry),rot||0,0,TAU)};
 // the card's own character as a flat coloured silhouette (the "spirit" art, tinted)
 function spirit(g,E,col,x,y,sc,a){const im=E.img;if(!im||!im.complete||!im.naturalWidth||a<=0)return;let s=E.sil[col];
  if(!s){s=document.createElement('canvas');s.width=Math.ceil(E.cw);s.height=Math.ceil(E.ch);const q=s.getContext('2d');q.drawImage(im,0,0,s.width,s.height);q.globalCompositeOperation='source-in';q.fillStyle=col;q.fillRect(0,0,s.width,s.height);E.sil[col]=s}
  g.save();g.globalAlpha=Math.min(1,a);g.drawImage(s,x-s.width*sc/2,y-s.height*sc/2,s.width*sc,s.height*sc);g.restore()}

 const FX={};

 // ===== LAKSHMI · a golden coin shower while a giant lotus blooms open =====
 FX.lotus=E=>{const{W,H,cx,cy,tc,R}=E,Rm=Math.min(W,H)*.46,coins=Array.from({length:110},()=>({x:R()*W,t0:R()*2.6,v:H*(.5+R()*.5),r:6+R()*8,ph:R()*TAU,sp:4+R()*6,sw:R()*30}));
  const layers=[{n:8,len:1,w:.30,off:0,c0:'#ff6fa8',c1:'#ffd6e8'},{n:8,len:.84,w:.28,off:TAU/16,c0:'#ff8fba',c1:'#ffe6f0'},{n:12,len:.62,w:.26,off:TAU/24,c0:'#ffc4de',c1:'#fffaf4'}];
  return(g,t)=>{const a=fade(t,E,1.4),u=eo(seg(t,.2,tc-.1));dim(g,E,'40,10,30',.55*Math.min(1,t/.5)*a);
   g.save();g.translate(cx,cy+H*.03);g.globalAlpha=a;glow(g,0,0,Rm*(.4+.7*u),'255,215,130',.75*u);
   layers.forEach((L,li)=>{const len=Rm*L.len*u;if(len<2)return;for(let i=0;i<L.n;i++){g.save();g.rotate(L.off+i*TAU/L.n+(1-u)*1.6*(li%2?-1:1));
     const w=len*L.w*(.35+.65*u),q=g.createLinearGradient(0,0,len,0);q.addColorStop(0,L.c0);q.addColorStop(1,L.c1);g.fillStyle=q;g.strokeStyle='rgba(255,255,255,.65)';g.lineWidth=1.5;
     g.beginPath();g.moveTo(0,0);g.bezierCurveTo(len*.3,-w*1.25,len*.75,-w*.9,len,0);g.bezierCurveTo(len*.75,w*.9,len*.3,w*1.25,0,0);g.fill();g.stroke();g.restore()}});
   g.restore();spirit(g,E,'#ffe9a8',cx,cy,.95,.6*seg(t,1.1,tc)*a);
   for(const c of coins){const tt=t-c.t0;if(tt<0)continue;const y=-20+tt*c.v;if(y>H+20)continue;const x=c.x+Math.sin(tt*2+c.ph)*c.sw,w=Math.abs(Math.cos(c.ph+tt*c.sp));
    g.globalAlpha=Math.min(1,a+.2);ell(g,x,y,c.r*(w*.9+.1),c.r);g.fillStyle='#ffd35a';g.fill();g.strokeStyle='#b8801a';g.lineWidth=1.5;g.stroke();
    ell(g,x,y,c.r*.5*(w*.9+.1),c.r*.5);g.fillStyle='#fff3b8';g.fill();g.globalAlpha=1}
   flash(g,E,t,'255,240,200',.5)}};

 // ===== GANESHA · the obstacle wall: bricks stack up across the screen, crack, then burst apart toward you =====
 FX.wall=E=>{const{W,H,cx,cy,tc,R}=E,bw=Math.max(70,W/14),bh=bw*.5,rows=Math.ceil(H/bh)+1,cols=Math.ceil(W/bw)+2,B=[];
  for(let r=0;r<rows;r++)for(let c=-1;c<cols;c++){const x=c*bw+(r%2?bw/2:0)-bw/2,y=r*bh,mx=x+bw/2-cx,my=y+bh/2-cy,d=Math.hypot(mx,my)||1,sp=300+R()*500;
   B.push({x,y,l:24+R()*12,hue:18+R()*22,t0:(rows-r)/rows*.8+R()*.2,vx:mx/d*sp+(R()-.5)*200,vy:my/d*sp+(R()-.5)*200-220,vr:(R()-.5)*8,sc:.6+R()*1.2})}
  const cr=Array.from({length:8},(_,k)=>{let a=k/8*TAU+R()*.5,x=cx,y=cy;const pts=[[x,y]],L=Math.max(W,H)*.62;for(let d=0;d<L;d+=34){a+=(R()-.5)*.7;x+=Math.cos(a)*34;y+=Math.sin(a)*34;pts.push([x,y])}return pts});
  return(g,t)=>{const post=t>=tc,sh=post?0:seg(t,1,tc)*9;g.translate((Math.random()-.5)*sh,(Math.random()-.5)*sh);
   if(!post)glow(g,cx,cy,Math.max(W,H)*(.2+.6*seg(t,.9,tc)),'255,190,90',.3+.7*seg(t,1,tc));
   for(const b of B){let x=b.x,y=b.y,s=1,rot=0,al=1;
    if(!post){const tt=t-b.t0;if(tt<0)continue;y=b.y-(1-eo(c01(tt/.35)))*H}
    else{const dt=t-tc;x=b.x+b.vx*dt;y=b.y+b.vy*dt+600*dt*dt;s=1+dt*b.sc*1.8;rot=b.vr*dt;al=1-seg(dt,.2,1.3);if(al<=0)continue}
    g.save();g.globalAlpha=al;g.translate(x+bw/2,y+bh/2);g.rotate(rot);g.scale(s,s);g.fillStyle=`hsl(${b.hue},12%,${b.l}%)`;g.fillRect(-bw/2+1,-bh/2+1,bw-2,bh-2);
    g.fillStyle='rgba(255,255,255,.1)';g.fillRect(-bw/2+1,-bh/2+1,bw-2,3);g.restore()}
   if(!post){const p=seg(t,1.3,tc-.1);g.save();g.strokeStyle='#ffd070';g.lineWidth=3;g.shadowColor='#ff8a20';g.shadowBlur=14;
    for(const pts of cr){const n=Math.floor(pts.length*p);if(n<2)continue;g.beginPath();g.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<n;i++)g.lineTo(pts[i][0],pts[i][1]);g.stroke()}g.restore()}
   flash(g,E,t,'255,230,170',.5)}};

 // ===== RADHA · hundreds of tiny hearts spiral in to draw one big heart; it beats three times, then bursts into petals =====
 FX.heart=E=>{const{W,H,cx,cy,tc,R}=E,n=240,S=Math.min(W,H)*.03,hy=cy-H*.02,P=[];
  for(let i=0;i<n;i++){const a=i/n*TAU,x=16*Math.pow(Math.sin(a),3),y=-(13*Math.cos(a)-5*Math.cos(2*a)-2*Math.cos(3*a)-Math.cos(4*a)),sa=R()*TAU,sr=Math.max(W,H)*(.5+R()*.4),oa=R()*TAU;
   P.push({tx:x*S,ty:y*S,sx:Math.cos(sa)*sr,sy:Math.sin(sa)*sr,t0:.1+R()*1.1,sz:5+R()*8,c:R()<.5?'255,111,168':'255,170,205',ox:Math.cos(oa)*(150+R()*450),oy:Math.sin(oa)*(150+R()*450)-120})}
  const pulse=(t,tb)=>t>=tb&&t<tb+.35?Math.sin((t-tb)/.35*Math.PI):0;
  return(g,t)=>{const a=fade(t,E,1.5);dim(g,E,'40,5,30',.5*Math.min(1,t/.5)*a);const bs=1+.1*(pulse(t,1.55)+pulse(t,1.95)+pulse(t,2.3));
   glow(g,cx,hy,Math.min(W,H)*.5*bs,'255,90,150',.6*seg(t,1,1.6)*a);
   for(const p of P){let x,y,al=.95;
    if(t<tc){const f=eo(c01((t-p.t0)/1.1)),ang=(1-f)*2,cs=Math.cos(ang),sn=Math.sin(ang),px=p.sx+(p.tx*bs-p.sx)*f,py=p.sy+(p.ty*bs-p.sy)*f;x=cx+px*cs-py*sn;y=hy+px*sn+py*cs}
    else{const dt=t-tc;x=cx+p.tx*bs+p.ox*dt;y=hy+p.ty*bs+p.oy*dt+380*dt*dt;al=1-seg(dt,0,1.4)}
    if(al<=0)continue;g.fillStyle=`rgba(${p.c},${al})`;heartP(g,x,y,p.sz);g.fill()}
   flash(g,E,t,'255,200,225',.45)}};

 // ===== SHIVA · the third eye: the screen goes dark, a vertical eye slowly opens, fire rings & lightning, then burns the dark away =====
 FX.eye=E=>{const{W,H,cx,tc,R}=E,ey=E.cy-H*.04,Hm=Math.min(H*.38,W*.8),Wm=Hm*.4;let bolts=[],lb=-1;
  return(g,t)=>{const vig=Math.min(1,t/.7),hole=t<tc?0:(t-tc)/1.2*Math.hypot(W,H),q=g.createRadialGradient(cx,ey,hole,cx,ey,hole+Math.max(W,H)*.35);
   q.addColorStop(0,'rgba(6,0,16,0)');q.addColorStop(1,`rgba(6,0,16,${.92*vig})`);g.fillStyle=q;g.fillRect(0,0,W,H);
   if(t<tc+.6){const al=1-seg(t,tc,tc+.6),u=eio(seg(t,.7,2.0)),w=Wm*Math.max(u,.03);g.save();g.globalAlpha=al;
    for(const tr of[1.8,2.05,2.3]){const r=(t-tr)*H*.9;if(r>0&&r<H*.9){g.strokeStyle=`rgba(255,122,42,${1-r/(H*.9)})`;g.lineWidth=5;g.shadowColor='#ff5a1e';g.shadowBlur=20;g.beginPath();g.arc(cx,ey,r,0,TAU);g.stroke()}}
    g.shadowBlur=0;glow(g,cx,ey,Hm*(.5+.5*u),'255,90,30',.55*u);
    if(t>1.9&&t<tc+.2&&t-lb>.06){lb=t;bolts=Array.from({length:6},()=>{let x=cx,y=ey,tx=R()*W,ty=R()<.5?0:H,pts=[[x,y]];for(let k=1;k<=12;k++){const f=k/12;pts.push([lerp(cx,tx,f)+(R()-.5)*70*(1-f*.3),lerp(ey,ty,f)+(R()-.5)*70])}return pts})}
    if(t>1.9&&t<tc+.2){g.strokeStyle='#d8eaff';g.lineWidth=2;g.shadowColor='#7aa8ff';g.shadowBlur=12;for(const b of bolts){g.beginPath();b.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.stroke()}g.shadowBlur=0}
    const eyePath=()=>{g.beginPath();g.moveTo(cx,ey-Hm/2);g.bezierCurveTo(cx-w*1.5,ey-Hm*.2,cx-w*1.5,ey+Hm*.2,cx,ey+Hm/2);g.bezierCurveTo(cx+w*1.5,ey+Hm*.2,cx+w*1.5,ey-Hm*.2,cx,ey-Hm/2);g.closePath()};
    eyePath();const eg=g.createRadialGradient(cx,ey,0,cx,ey,Hm/2);eg.addColorStop(0,'#fff6e0');eg.addColorStop(1,'#ffb070');g.fillStyle=eg;g.fill();
    g.save();eyePath();g.clip();const ig=g.createRadialGradient(cx,ey,0,cx,ey,w*1.1);ig.addColorStop(0,'#ffd23a');ig.addColorStop(.6,'#ff4a1a');ig.addColorStop(1,'#7a0a10');g.fillStyle=ig;g.beginPath();g.arc(cx,ey,w*1.1,0,TAU);g.fill();
    ell(g,cx,ey,Math.max(1,w*.16),w*.62);g.fillStyle='#100408';g.fill();ell(g,cx-w*.25,ey-w*.3,w*.12,w*.1);g.fillStyle='rgba(255,255,255,.85)';g.fill();g.restore();
    eyePath();g.strokeStyle='#ff5a1e';g.lineWidth=4;g.shadowColor='#ff5a1e';g.shadowBlur=30;g.stroke();g.shadowBlur=0;
    g.fillStyle=`rgba(255,232,170,${u})`;g.beginPath();g.arc(cx,ey-Hm/2-34,16,.5,TAU-.5);g.arc(cx+7,ey-Hm/2-34,13,TAU-.5,.5,true);g.fill();g.restore()}
   flash(g,E,t,'255,220,170',.45)}};

 // ===== VISHNU · the Sudarshan chakra spins in from the far distance, the ten avatars light up around it, then it stops and throws a shockwave =====
 FX.chakra=E=>{const{W,H,cx,cy,tc}=E,Rm=Math.min(W,H)*.43,cols=['#7fe0ff','#ffd35a','#9ad8ff','#ffe9a8','#6fb8ff'];
  return(g,t)=>{const a=fade(t,E,1.3),p=eo(seg(t,0,tc-.1));dim(g,E,'5,12,45',.6*Math.min(1,t/.5)*a);
   for(let k=0;k<5;k++){const tr=.2+k*.5,r=(t-tr)*H*.5;if(r>0&&r<H*.85){g.strokeStyle=`rgba(120,210,255,${(1-r/(H*.85))*.6*a})`;g.lineWidth=3;g.beginPath();g.arc(cx,cy,r,0,TAU);g.stroke()}}
   const s=(.05+.95*p)*(t>tc?1+(t-tc)*1.1:1),rot=-(1-p)*(1-p)*22+t*.3;g.save();g.translate(cx,cy);g.scale(s,s);g.globalAlpha=a;glow(g,0,0,Rm*1.35,'80,170,255',.45*p);
   g.save();g.rotate(rot);g.fillStyle='#ffd35a';for(let i=0;i<36;i++){g.save();g.rotate(i*TAU/36);g.beginPath();g.moveTo(Rm,-9);g.lineTo(Rm*1.13,0);g.lineTo(Rm,9);g.fill();g.restore()}
   g.strokeStyle='#ffd35a';g.lineWidth=8;g.beginPath();g.arc(0,0,Rm,0,TAU);g.stroke();g.restore();
   g.save();g.rotate(-rot*1.5);g.setLineDash([14,10]);g.strokeStyle='#7fe0ff';g.lineWidth=5;g.beginPath();g.arc(0,0,Rm*.86,0,TAU);g.stroke();g.restore();
   g.strokeStyle='#ffe9a8';g.lineWidth=3;g.beginPath();g.arc(0,0,Rm*.62,0,TAU);g.stroke();
   g.save();g.rotate(rot*.6);for(let i=0;i<12;i++){g.save();g.rotate(i*TAU/12);g.strokeStyle='#ffd35a';g.lineWidth=6;g.beginPath();g.moveTo(Rm*.2,0);g.lineTo(Rm*.62,0);g.stroke();
    g.fillStyle='rgba(127,224,255,.55)';g.beginPath();g.moveTo(Rm*.62,0);g.quadraticCurveTo(Rm*.74,-Rm*.09,Rm*.84,0);g.quadraticCurveTo(Rm*.74,Rm*.09,Rm*.62,0);g.fill();g.restore()}g.restore();
   const hg=g.createRadialGradient(0,0,0,0,0,Rm*.2);hg.addColorStop(0,'#fff');hg.addColorStop(1,'#ffd35a');g.fillStyle=hg;g.beginPath();g.arc(0,0,Rm*.2,0,TAU);g.fill();
   for(let i=0;i<10;i++){const k=eo(seg(t,.3+i*.17,.6+i*.17));if(k<=0)continue;const an=i*TAU/10+rot*.5,x=Math.cos(an)*Rm*.74,y=Math.sin(an)*Rm*.74;glow(g,x,y,26*k*(1+(1-k)*2),'200,230,255',.9);g.fillStyle=cols[i%5];g.beginPath();g.arc(x,y,7*k,0,TAU);g.fill()}
   g.restore();spirit(g,E,'#bfe8ff',cx,cy,.8,.35*seg(t,1,tc-.3)*a);flash(g,E,t,'200,235,255',.5)}};

 // ===== GANGA · the river falls from the sky, floods the whole screen, then drains away downward =====
 FX.flood=E=>{const{W,H,cx,tc,R}=E,bub=Array.from({length:60},()=>({x:R()*W,y:R()*H,r:3+R()*9,s:40+R()*80,ph:R()*TAU})),lvl=t=>t<tc?H*(1-1.04*eo(seg(t,.5,tc-.05))):-20+(H+60)*eo(seg(t,tc,tc+1.5));
  return(g,t)=>{const y0=lvl(t),s=eo(seg(t,0,.9)),ww=W*(.08+.12*seg(t,.5,tc)),sh=t<tc?Math.min(H*s,y0+30):0;
   if(t<tc&&t<1.6){g.save();const q=g.createLinearGradient(cx-ww/2,0,cx+ww/2,0);q.addColorStop(0,'rgba(120,220,255,.8)');q.addColorStop(.5,'rgba(235,252,255,.95)');q.addColorStop(1,'rgba(120,220,255,.8)');g.fillStyle=q;
    g.beginPath();g.moveTo(cx-ww/2,0);for(let y=0;y<=sh;y+=20)g.lineTo(cx-ww/2+Math.sin(y*.03+t*9)*5,y);for(let y=sh;y>=0;y-=20)g.lineTo(cx+ww/2+Math.sin(y*.03+t*9+2)*5,y);g.fill();
    g.strokeStyle='rgba(255,255,255,.7)';g.lineWidth=2;g.setLineDash([30,24]);g.lineDashOffset=-t*700;for(let k=-2;k<=2;k++){g.beginPath();g.moveTo(cx+k*ww*.2,0);g.lineTo(cx+k*ww*.2,sh);g.stroke()}g.restore();glow(g,cx,sh,ww*1.2,'255,255,255',.6*(1-seg(t,.9,1.6)))}
   if(t>.5){for(let l=2;l>=0;l--){const yy=y0+l*18;g.beginPath();g.moveTo(0,H+4);for(let x=0;x<=W+12;x+=12)g.lineTo(x,yy+Math.sin(x*.012+t*(2+l)+l*2)*(14+l*5));g.lineTo(W,H+4);g.closePath();
     const q=g.createLinearGradient(0,yy-20,0,yy+H);q.addColorStop(0,l?'rgba(70,170,240,.8)':'rgba(140,235,255,.82)');q.addColorStop(1,'rgba(20,90,200,.9)');g.fillStyle=q;g.fill();
     if(!l){g.strokeStyle='rgba(255,255,255,.85)';g.lineWidth=3;g.beginPath();for(let x=0;x<=W+12;x+=12){const y=yy+Math.sin(x*.012+t*2)*14;x?g.lineTo(x,y):g.moveTo(x,y)}g.stroke()}}
    g.strokeStyle='rgba(255,255,255,.55)';g.lineWidth=1.5;for(const b of bub){const y=((b.y-t*b.s)%H+H)%H;if(y>y0+10){g.beginPath();g.arc(b.x+Math.sin(t*2+b.ph)*8,y,b.r,0,TAU);g.stroke()}}}
   if(t>tc)glow(g,cx,lvl(t),W*.5,'220,250,255',.4*(1-seg(t,tc,tc+1.5)))}};

 // ===== VENKATESWARA · the great temple doors slam shut, knock three times, and swing open on a flood of golden light =====
 FX.doors=E=>{const{W,H,cx,cy,tc,R}=E,mot=Array.from({length:70},()=>({a:R()*TAU,sp:200+R()*500,sz:2+R()*4,t0:1+R()*1.5}));
  const door=(g,side,th,off)=>{g.save();if(side>0){g.translate(W,0);g.scale(-1,1)}g.translate(-off,0);const Wd=W/2*Math.cos(th),hf=1-.22*Math.sin(th),it=H*(1-hf)/2;
   const q=g.createLinearGradient(0,0,Wd,0);q.addColorStop(0,'#3f0a16');q.addColorStop(1,'#8a1c2c');g.fillStyle=q;g.beginPath();g.moveTo(0,0);g.lineTo(Wd,it);g.lineTo(Wd,H-it);g.lineTo(0,H);g.closePath();g.fill();
   g.strokeStyle='#e8b84a';g.lineWidth=7;g.stroke();const P=(u,v)=>{const yt=u*it;return[u*Wd,yt+(H-2*yt)*v]};
   g.lineWidth=3;for(const[u0,v0,u1,v1]of[[.5,0,.5,1],[0,.5,1,.5],[0,.25,1,.25],[0,.75,1,.75]]){const a=P(u0,v0),b=P(u1,v1);g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke()}
   for(let i=0;i<4;i++)for(let j=0;j<9;j++){const p=P((i+.5)/4,(j+.5)/9),r=(9-(p[0]/Math.max(1,Wd))*3)*hf;if(r<=.5)continue;g.fillStyle='#ffd35a';g.beginPath();g.arc(p[0],p[1],r,0,TAU);g.fill();g.fillStyle='rgba(255,255,255,.7)';g.beginPath();g.arc(p[0]-r*.3,p[1]-r*.3,r*.35,0,TAU);g.fill()}
   const m=P(.5,.5);g.strokeStyle='#ffe9a0';g.lineWidth=5;g.beginPath();g.ellipse(m[0],m[1],Wd*.3,H*.12*hf,0,0,TAU);g.stroke();g.restore()};
  return(g,t)=>{const a=1-seg(t,tc,tc+.9),slide=(1-eo(seg(t,0,.35)))*W/2,th=t<1?.012*Math.abs(Math.sin(t*30))*seg(t,.4,1):eio(seg(t,1,tc))*1.5,gap=W*(1-Math.cos(th));
   if(t>.3){const sg=.35+.4*Math.abs(Math.sin(t*9));glow(g,cx,cy,H*(.15+.7*seg(t,1,tc)),'255,220,130',sg*Math.min(1,.4+seg(t,1,tc)*2));
    if(gap>1){const q=g.createLinearGradient(cx-gap/2,0,cx+gap/2,0);q.addColorStop(0,'rgba(255,230,150,.55)');q.addColorStop(.5,'rgba(255,252,230,1)');q.addColorStop(1,'rgba(255,230,150,.55)');g.fillStyle=q;g.fillRect(cx-gap/2,0,gap,H);
     g.save();g.globalCompositeOperation='lighter';for(let i=0;i<14;i++){const an=-Math.PI/2+(i-6.5)*.2+Math.sin(t+i)*.02;g.fillStyle=`rgba(255,225,140,${.2*seg(th,0,.8)*a})`;g.beginPath();g.moveTo(cx,cy);g.lineTo(cx+Math.cos(an-.03)*W,cy+Math.sin(an-.03)*W);g.lineTo(cx+Math.cos(an+.03)*W,cy+Math.sin(an+.03)*W);g.fill()}g.restore()}}
   g.save();g.globalAlpha=a;door(g,-1,th,slide);door(g,1,th,slide);g.restore();
   g.save();g.globalCompositeOperation='lighter';for(const m of mot){const dt=t-m.t0;if(dt<0)continue;g.fillStyle=`rgba(255,230,160,${Math.max(0,1-dt/1.6)*a})`;g.beginPath();g.arc(cx+Math.cos(m.a)*m.sp*dt,cy+Math.sin(m.a)*m.sp*dt,m.sz,0,TAU);g.fill()}g.restore();
   flash(g,E,t,'255,244,210',.5)}};

 // ===== SARASWATI · five veena strings are drawn across the screen and plucked, notes float up, then everything collapses into one blazing line of light =====
 FX.strings=E=>{const{W,H,cx,cy,tc,R}=E,N=5,gap=Math.min(H*.09,60),y0=i=>cy+(i-2)*gap,plucks=[1.1,1.5,1.85,2.15],
   notes=Array.from({length:14},()=>({x:W*(.1+R()*.8),i:Math.floor(R()*N),t0:.9+R()*1.3,ph:R()*TAU})),sp=Array.from({length:80},()=>({x:R()*W,v:150+R()*400,s:1.5+R()*3}));
  return(g,t)=>{const a=fade(t,E,1),k=eio(seg(t,tc-.5,tc));dim(g,E,'14,10,50',.6*Math.min(1,t/.5)*a);
   let amp=0;for(const tp of plucks)if(t>=tp)amp+=gap*.55*Math.exp(-(t-tp)*3.2);amp+=gap*1.1*seg(t,tc-.8,tc-.1)*(1-k);
   for(let i=0;i<N;i++){const yy=lerp(y0(i),cy,k),xm=W*eo(seg(t,.05+i*.08,.8+i*.08));g.strokeStyle=`rgba(255,240,200,${.9*(t<tc?1:a)})`;g.lineWidth=2.5;g.shadowColor='#ffd98a';g.shadowBlur=12;g.beginPath();
    for(let x=0;x<=xm;x+=8){const y=yy+amp*Math.sin(x/W*Math.PI*(1+i%2))*Math.sin(t*28+i);x?g.lineTo(x,y):g.moveTo(x,y)}g.stroke();g.shadowBlur=0}
   plucks.forEach((tp,n)=>{const r=(t-tp)*H*.5;if(r>0&&r<H*.5){g.strokeStyle=`rgba(255,235,170,${(1-r/(H*.5))*.6*a})`;g.lineWidth=2;g.beginPath();g.ellipse(W*(n%2?.7:.3),cy,r,r*.5,0,0,TAU);g.stroke()}});
   for(const n of notes){if(t<n.t0)continue;const post=t>tc,x=n.x,y=(post?y0(n.i)-(t-tc)*320:lerp(y0(n.i),cy,k))-(Math.min(t,tc)-n.t0)*20+Math.sin(t*3+n.ph)*6,al=Math.min(1,(t-n.t0)*3)*(post?a:1-k*.6);
    g.globalAlpha=al;glow(g,x,y,26,'255,225,150',.6);g.fillStyle='#fff3d0';ell(g,x,y,9,6.5,-.4);g.fill();g.strokeStyle='#fff3d0';g.lineWidth=2.5;g.beginPath();g.moveTo(x+8,y-2);g.lineTo(x+8,y-30);g.quadraticCurveTo(x+22,y-24,x+16,y-10);g.stroke();g.globalAlpha=1}
   if(k>.2&&t<tc+.3){g.save();g.strokeStyle=`rgba(255,250,225,${Math.min(1,k)})`;g.lineWidth=2+k*5;g.shadowColor='#fff';g.shadowBlur=24;g.beginPath();g.moveTo(0,cy);g.lineTo(W,cy);g.stroke();g.restore()}
   if(t>tc){const dt=t-tc,hh=dt*H*1.6,q=g.createLinearGradient(0,cy-hh,0,cy+hh);q.addColorStop(0,'rgba(255,245,210,0)');q.addColorStop(.5,`rgba(255,250,230,${.8*a})`);q.addColorStop(1,'rgba(255,245,210,0)');g.fillStyle=q;g.fillRect(0,cy-hh,W,hh*2);
    g.globalCompositeOperation='lighter';for(const s of sp){g.fillStyle=`rgba(255,235,170,${a})`;g.beginPath();g.arc(s.x,cy-s.v*dt+300*dt*dt*.3,s.s,0,TAU);g.fill()}g.globalCompositeOperation='source-over'}
   flash(g,E,t,'255,246,215',.4)}};

 // ===== SITA · the ground splits open with golden light and vines + flowers grow out of the crack =====
 FX.vines=E=>{const{W,H,cx,cy,tc,R}=E,crack=[[cx,H+6]];{let x=cx,y=H+6;while(y>cy+H*.12){x+=(R()-.5)*34;y-=28;crack.push([x,y])}}
  const FC=['255,150,190','255,235,240','255,200,120','230,150,255'],V=Array.from({length:9},(_,i)=>{let x=cx+(R()-.5)*W*.1,y=H,an=-Math.PI/2+(i/8-.5)*2.1;const n=Math.floor(46+R()*30),pts=[[x,y]];
   for(let k=1;k<n;k++){an+=Math.sin(k*.3+i)*.07+(R()-.5)*.08;x+=Math.cos(an)*14;y+=Math.sin(an)*14;pts.push([x,y,an])}return{pts,n,c:FC[i%4],t0:.7+i*.08}}),
   pet=Array.from({length:70},()=>{const a=R()*TAU;return{a,v:100+R()*350,r:R()*TAU,c:FC[Math.floor(R()*4)]}});
  return(g,t)=>{const a=fade(t,E,1.3);dim(g,E,'6,30,18',.45*Math.min(1,t/.5)*a);const cp=eo(seg(t,.05,.8));
   if(cp>0){const n=Math.floor(crack.length*cp);if(n>1){g.save();g.globalAlpha=a;g.strokeStyle='#ffe9a0';g.lineWidth=5;g.shadowColor='#ffd35a';g.shadowBlur=18;g.beginPath();g.moveTo(crack[0][0],crack[0][1]);for(let i=1;i<n;i++)g.lineTo(crack[i][0],crack[i][1]);g.stroke();g.restore();glow(g,crack[n-1][0],crack[n-1][1],H*.22,'255,225,140',.8*a)}}
   for(const v of V){const p=eo(seg(t,v.t0,tc-.2)),m=Math.floor(v.n*p);if(m<2)continue;g.save();g.globalAlpha=a;g.lineCap='round';g.strokeStyle='#2f9a55';g.lineWidth=5;g.beginPath();g.moveTo(v.pts[0][0],v.pts[0][1]);for(let i=1;i<m;i++)g.lineTo(v.pts[i][0],v.pts[i][1]);g.stroke();
    g.strokeStyle='#6adb92';g.lineWidth=2;g.stroke();g.fillStyle='#3fc77a';
    for(let i=4;i<m;i+=5){const pt=v.pts[i],s=Math.min(1,(m-i)/6),sd=(i/5)%2?1:-1;g.save();g.translate(pt[0],pt[1]);g.rotate((pt[2]||0)+sd*1.1);ell(g,13*s,0,13*s,5.5*s);g.fill();g.restore()}
    if(p>.97){const b=eo(seg(t,v.t0+(tc-.2-v.t0)*.97,v.t0+(tc-.2-v.t0)*.97+.6)),e=v.pts[m-1];g.translate(e[0],e[1]);for(let k=0;k<5;k++){g.save();g.rotate(k*TAU/5+t*.2);ell(g,16*b,0,16*b,9*b);g.fillStyle=`rgb(${v.c})`;g.fill();g.restore()}g.fillStyle='#ffd35a';g.beginPath();g.arc(0,0,6*b,0,TAU);g.fill()}g.restore()}
   if(t>tc){const dt=t-tc;for(const q of pet){const x=cx+Math.cos(q.a)*q.v*dt,y=cy+Math.sin(q.a)*q.v*dt+240*dt*dt;g.save();g.translate(x,y);g.rotate(q.r+dt*3);g.fillStyle=`rgba(${q.c},${a})`;ell(g,0,0,10,5);g.fill();g.restore()}}
   flash(g,E,t,'255,244,200',.45)}};

 // ===== SURYA · a night sky turns to dawn and a huge sun rises with rotating rays, clouds and lens flare; the screen whites out =====
 FX.sunrise=E=>{const{W,H,cx,cy,tc,R}=E,R0=Math.min(W,H)*.2,cl=Array.from({length:6},()=>({x:R()*W,y:H*(.3+R()*.4),w:W*(.12+R()*.12),s:6+R()*14}));
  return(g,t)=>{const u=seg(t,0,tc),a=fade(t,E,1.3),q=g.createLinearGradient(0,0,0,H);q.addColorStop(0,`rgba(${mix([8,8,38],[255,170,90],Math.pow(u,1.2))},${.92*a})`);q.addColorStop(1,`rgba(${mix([40,12,70],[255,224,150],u)},${.92*a})`);g.fillStyle=q;g.fillRect(0,0,W,H);
   const sy=H+R0*.6-(H+R0*.6-cy)*eo(seg(t,.2,tc)),r=R0*(1+.35*u);g.save();g.globalAlpha=a;glow(g,cx,sy,r*4,'255,190,100',.7);
   g.save();g.globalCompositeOperation='lighter';g.translate(cx,sy);g.rotate(t*.25);for(let i=0;i<24;i++){g.rotate(TAU/24);g.fillStyle='rgba(255,220,140,.14)';g.beginPath();g.moveTo(0,-r*.8);g.lineTo(-r*.12,-Math.max(W,H)*1.5);g.lineTo(r*.12,-Math.max(W,H)*1.5);g.fill()}g.restore();
   for(const c of cl){const x=(c.x+t*c.s)%(W+c.w)-c.w/2;g.fillStyle=`rgba(255,${150+60*u},${110+40*u},.5)`;ell(g,x,c.y,c.w,c.w*.18);g.fill();ell(g,x+c.w*.3,c.y-c.w*.08,c.w*.5,c.w*.16);g.fill()}
   const sg=g.createRadialGradient(cx,sy,0,cx,sy,r);sg.addColorStop(0,'#fff');sg.addColorStop(.55,'#ffd35a');sg.addColorStop(1,'#ff8a3a');g.fillStyle=sg;g.beginPath();g.arc(cx,sy,r,0,TAU);g.fill();
   g.globalCompositeOperation='lighter';for(const[k,rr,cc]of[[.4,30,'120,230,220'],[.7,50,'255,170,90'],[1.1,22,'255,255,200'],[1.5,70,'150,150,255']]){glow(g,cx+(W/2-cx)*k,sy+(H/2-sy)*k,rr,cc,.3*u)}
   g.restore();
   g.save();g.globalAlpha=a;g.fillStyle='#160a2a';for(let L=0;L<2;L++){g.beginPath();g.moveTo(0,H);for(let x=0;x<=W;x+=20)g.lineTo(x,H*(.88+L*.04)+u*H*.25+Math.sin(x*.01+L*2)*H*.03);g.lineTo(W,H);g.fill()}g.restore();
   flash(g,E,t,'255,246,214',.6)}};

 // ===== RAMA · the bow is drawn, a flaming arrow shoots across and shatters the target; a volley of arrows converges and detonates =====
 FX.arrow=E=>{const{W,H,cx,cy,tc,R}=E,bx=W*.12,L=W*.13,tR=Math.min(W,H)*.2,vol=Array.from({length:22},(_,i)=>{const a=i/22*TAU+R()*.2,d=Math.max(W,H)*.75;return{sx:cx+Math.cos(a)*d,sy:cy+Math.sin(a)*d*.8,t0:1.75+i*.04,an:a+Math.PI}}),
   sp=Array.from({length:60},()=>({a:R()*TAU,v:150+R()*500,s:2+R()*3}));
  const arrow=(g,x,y,an,len,ga)=>{g.save();g.translate(x,y);g.rotate(an);g.strokeStyle='#e8c07a';g.lineWidth=4;g.beginPath();g.moveTo(-len,0);g.lineTo(0,0);g.stroke();g.fillStyle='#fff1c0';g.beginPath();g.moveTo(10,0);g.lineTo(-8,-8);g.lineTo(-8,8);g.fill();
   g.fillStyle='#d8283a';g.beginPath();g.moveTo(-len,0);g.lineTo(-len-12,-8);g.lineTo(-len+8,0);g.lineTo(-len-12,8);g.fill();g.restore();
   g.save();g.globalCompositeOperation='lighter';for(let k=0;k<14;k++)glow(g,x-Math.cos(an)*k*len*.07,y-Math.sin(an)*k*len*.07,26*(1-k/16),'255,150,40',ga*(1-k/14));g.restore()};
  return(g,t)=>{const a=fade(t,E,1.2),hit=1.62,sh=t>hit&&t<tc+.3?Math.max(0,1-(t-hit)/1.2)*12:0;g.translate((Math.random()-.5)*sh,(Math.random()-.5)*sh);dim(g,E,'30,8,5',.5*Math.min(1,t/.5)*a);
   if(t<hit){const ra=seg(t,.3,.9);g.strokeStyle=`rgba(255,220,150,${ra})`;g.lineWidth=5;for(const f of[1,.7,.4,.15]){g.beginPath();g.arc(cx,cy,tR*f,0,TAU);g.stroke()}}
   else{const dt=t-hit;g.strokeStyle=`rgba(255,220,150,${Math.max(0,1-dt*1.4)})`;g.lineWidth=5;for(const[i,f]of[1,.7,.4,.15].entries()){const o=dt*(300+i*160),an=i*1.3;g.beginPath();g.arc(cx+Math.cos(an)*o,cy+Math.sin(an)*o,tR*f,an,an+1.2);g.stroke()}
    const r=dt*H*.9;if(r<H*.9){g.strokeStyle=`rgba(255,200,100,${1-r/(H*.9)})`;g.lineWidth=7;g.beginPath();g.arc(cx,cy,r,0,TAU);g.stroke()}}
   if(t<1.62){const pull=70*eo(seg(t,.2,1.2)),fl=seg(t,1.3,hit);g.save();g.globalAlpha=a;g.strokeStyle='#8a5a2a';g.lineWidth=10;g.lineCap='round';const bh=H*.3;g.beginPath();g.moveTo(bx+30,cy-bh);g.quadraticCurveTo(bx-50,cy,bx+30,cy+bh);g.stroke();
    g.strokeStyle='#ffe9b0';g.lineWidth=2;g.beginPath();g.moveTo(bx+30,cy-bh);g.lineTo(bx-pull*(fl>0?0:1),cy);g.lineTo(bx+30,cy+bh);g.stroke();g.restore();
    const tipx=fl>0?lerp(bx+L,cx,fl):bx-pull+L;glow(g,tipx,cy,40+10*Math.sin(t*20),'255,160,40',.8*seg(t,.5,1.3));arrow(g,tipx,cy,0,L,.9)}
   for(const v of vol){const u=seg(t,v.t0,v.t0+.35);if(u<=0||u>=1)continue;const x=lerp(v.sx,cx,u),y=lerp(v.sy,cy,u);arrow(g,x,y,v.an,L*.8,.7*a)}
   if(t>tc){const dt=t-tc;g.save();g.globalCompositeOperation='lighter';for(const s of sp){g.fillStyle=`rgba(255,${160+s.s*20},60,${a})`;g.beginPath();g.arc(cx+Math.cos(s.a)*s.v*dt,cy+Math.sin(s.a)*s.v*dt+200*dt*dt,s.s,0,TAU);g.fill()}g.restore()}
   flash(g,E,t,'255,210,140',.55)}};

 // ===== KRISHNA · a peacock tail fans open feather by feather with shimmering eyes; flute notes spiral around =====
 FX.peacock=E=>{const{W,H,cx,cy,tc,R}=E,N=23,bx=cx,by=cy+H*.2,L0=Math.min(H*.58,W*.7),F=Array.from({length:N},(_,i)=>{const k=(i-(N-1)/2)/((N-1)/2);return{an:k*1.35,len:L0*(.82+.18*Math.cos(k*1.3))*(.95+R()*.1),d:Math.abs(k)*.9}});
  return(g,t)=>{const a=fade(t,E,1.5);dim(g,E,'2,20,40',.55*Math.min(1,t/.5)*a);glow(g,bx,by,H*.6,'30,160,200',.35*a);
   for(const f of F){const o=eo(seg(t,.3+f.d*.4,1.9+f.d*.4)),len=f.len*o;if(len<4)continue;g.save();g.globalAlpha=a;g.translate(bx,by);g.rotate(f.an*o);const w=len*.13,q=g.createLinearGradient(0,0,0,-len);q.addColorStop(0,'rgba(30,160,110,.6)');q.addColorStop(1,'rgba(40,200,200,.55)');
    g.fillStyle=q;g.beginPath();g.moveTo(0,0);g.quadraticCurveTo(-w,-len*.55,0,-len);g.quadraticCurveTo(w,-len*.55,0,0);g.fill();g.strokeStyle='rgba(120,235,200,.55)';g.lineWidth=1;
    for(let k=1;k<14;k++){const y=-len*k/14,ww=w*(1-Math.abs(k/14-.45)*1.2);g.beginPath();g.moveTo(0,y);g.lineTo(-ww,y-len*.04);g.moveTo(0,y);g.lineTo(ww,y-len*.04);g.stroke()}
    g.strokeStyle='#8ad07a';g.lineWidth=2;g.beginPath();g.moveTo(0,0);g.lineTo(0,-len*.9);g.stroke();const r=len*.085*(1+.06*Math.sin(t*5+f.an*4)),ey=-len*.88;
    for(const[rx,ry,c]of[[1.1,1.35,'#d8b040'],[.85,1.05,'#2bb8a0'],[.6,.78,'#1b4fc4'],[.34,.48,'#0b1c70']]){ell(g,0,ey,r*rx,r*ry);g.fillStyle=c;g.fill()}ell(g,-r*.12,ey-r*.2,r*.12,r*.2);g.fillStyle='#bff5ff';g.fill();g.restore()}
   spirit(g,E,'#9fe8ff',cx,cy,.9,.5*seg(t,1.2,tc)*a);
   for(let k=0;k<16;k++){const tt=t-.6-k*.1;if(tt<=0)continue;const an=tt*3+k,rad=40+tt*70,x=cx+Math.cos(an)*rad,y=cy+Math.sin(an)*rad*.6-tt*30;g.globalAlpha=a*Math.min(1,tt*3);glow(g,x,y,22,'150,235,255',.6);g.fillStyle='#e8fbff';ell(g,x,y,7,5,-.4);g.fill();g.strokeStyle='#e8fbff';g.lineWidth=2;g.beginPath();g.moveTo(x+6,y);g.lineTo(x+6,y-22);g.stroke();g.globalAlpha=1}
   flash(g,E,t,'170,240,255',.4)}};

 // ===== DHANVANTARI · a heart-monitor line sweeps across (beats grow stronger, each beat releases a green cross), a healing double-helix climbs, then a final pulse =====
 FX.pulse=E=>{const{W,H,cx,cy,tc,R}=E,Pw=W/4.5,A=H*.18,G=(u,c,w)=>Math.exp(-Math.pow((u-c)/w,2)),ecg=x=>{const u=(x%Pw)/Pw;return-(.12*G(u,.16,.035)-.14*G(u,.30,.012)+G(u,.34,.012)-.25*G(u,.38,.014)+.22*G(u,.62,.05))*A*(.25+.75*x/W)},
   hv=t=>W*1.05*seg(t,.1,1.9),lf=Array.from({length:30},()=>({x:R()*W,s:60+R()*140,r:R()*TAU,z:6+R()*8}));
  return(g,t)=>{const a=fade(t,E,1.2);dim(g,E,'2,26,22',.55*Math.min(1,t/.5)*a);g.strokeStyle=`rgba(80,255,170,${.07*a})`;g.lineWidth=1;for(let x=0;x<W;x+=40){g.beginPath();g.moveTo(x,0);g.lineTo(x,H);g.stroke()}for(let y=0;y<H;y+=40){g.beginPath();g.moveTo(0,y);g.lineTo(W,y);g.stroke()}
   for(const l of lf){const y=H-((t*l.s)%(H+40))+20;g.fillStyle=`rgba(70,210,122,${.6*a})`;g.save();g.translate(l.x+Math.sin(t+l.r)*20,y);g.rotate(l.r+t);ell(g,0,0,l.z,l.z*.4);g.fill();g.restore()}
   const hx=hv(t);g.save();g.lineWidth=3;g.shadowColor='#18e08a';g.shadowBlur=14;g.lineCap='round';for(let x=0;x<hx;x+=6){const al=1-(hx-x)/(W*.55);if(al<.12)continue;g.strokeStyle=`rgba(109,255,176,${al*a})`;g.beginPath();g.moveTo(x,cy+ecg(x));g.lineTo(x+6,cy+ecg(x+6));g.stroke()}g.restore();
   if(hx<W)glow(g,hx,cy+ecg(hx),30,'160,255,210',.9*a);
   for(let k=0;k<5;k++){const xs=k*Pw+.34*Pw,tk=.1+xs/(W*1.05)*1.8;if(t<tk||xs>W)continue;const dt=t-tk,x=xs,y=cy+ecg(xs)-dt*120,s=14*(1+.3*Math.sin(dt*8));g.globalAlpha=Math.max(0,1-dt/1.4)*a;glow(g,x,y,s*2.4,'80,255,170',.5);g.fillStyle='#d6ffe9';g.fillRect(x-s/2,y-s/6,s,s/3);g.fillRect(x-s/6,y-s/2,s/3,s);g.globalAlpha=1}
   const hh=H*eo(seg(t,1.2,tc)),ha=seg(t,1.2,1.7)*a;if(hh>4&&ha>0){for(let j=0;j<=60;j++){const y=H-hh*j/60,ph=j*.35-t*4,f=Math.sin(Math.PI*j/60),x1=cx+Math.sin(ph)*W*.07*f,x2=cx-Math.sin(ph)*W*.07*f,z1=Math.cos(ph),z2=-z1;
     if(j%3===0){g.strokeStyle=`rgba(160,255,220,${.4*ha})`;g.lineWidth=2;g.beginPath();g.moveTo(x1,y);g.lineTo(x2,y);g.stroke()}
     g.fillStyle=`rgba(109,255,176,${ha})`;g.beginPath();g.arc(x1,y,3+3*(z1+1)/2,0,TAU);g.fill();g.fillStyle=`rgba(106,230,255,${ha})`;g.beginPath();g.arc(x2,y,3+3*(z2+1)/2,0,TAU);g.fill()}}
   if(t>tc-.1){const dt=Math.max(0,t-tc),r=dt*H*.9;g.strokeStyle=`rgba(120,255,190,${Math.max(0,1-r/(H*.9))})`;g.lineWidth=8;g.beginPath();g.arc(cx,cy,r,0,TAU);g.stroke();
    const s=H*.2*(1-seg(dt,0,1)),al=1-seg(dt,0,1);g.fillStyle=`rgba(210,255,230,${al})`;g.fillRect(cx-s/2,cy-s/6,s,s/3);g.fillRect(cx-s/6,cy-s/2,s/3,s)}
   flash(g,E,t,'200,255,225',.45)}};

 // =====================================================  TAROT-ONLY SCENES (12) =====================================================
 const starP=(g,x,y,r,rot,n,ir)=>{g.beginPath();for(let k=0;k<n*2;k++){const rr=k%2?r*(ir||.4):r,an=rot+k*Math.PI/n-Math.PI/2;g.lineTo(x+Math.cos(an)*rr,y+Math.sin(an)*rr)}g.closePath()};
 const leaf=(g,x,y,len,wd,rot,col)=>{g.save();g.translate(x,y);g.rotate(rot);g.fillStyle=col;g.beginPath();g.moveTo(0,0);g.quadraticCurveTo(len*.5,-wd,len,0);g.quadraticCurveTo(len*.5,wd,0,0);g.fill();g.restore()};

 // ===== THE FOOL (SP) · a blue-sky free fall: clouds and wind streaks rush upward, the traveller drops in and floats to a soft landing =====
 FX.t_fool=E=>{const{W,H,cx,cy,tc,R}=E,cl=Array.from({length:14},()=>({x:R()*W,y:R()*H,w:W*(.08+R()*.1),s:H*(.5+R()*.9)})),st=Array.from({length:50},()=>({x:R()*W,y:R()*H,s:H*(1+R()*2),l:20+R()*50})),D=t=>Math.min(t,tc-1.2)+Math.max(0,t-(tc-1.2))*.12;
  return(g,t)=>{const a=fade(t,E,1.3),d=D(t),q=g.createLinearGradient(0,0,0,H);q.addColorStop(0,`rgba(80,160,255,${.96*a})`);q.addColorStop(1,`rgba(210,238,255,${.96*a})`);g.fillStyle=q;g.fillRect(0,0,W,H);
   glow(g,W*.82,H*.16,H*.3,'255,230,120',.8*a);g.fillStyle=`rgba(255,236,140,${a})`;g.beginPath();g.arc(W*.82,H*.16,H*.06,0,TAU);g.fill();
   g.strokeStyle=`rgba(255,255,255,${.5*a*(1-seg(t,tc-1.2,tc))})`;g.lineWidth=2;for(const s of st){const y=(((s.y-d*s.s)%(H+100))+H+100)%(H+100)-50;g.beginPath();g.moveTo(s.x,y);g.lineTo(s.x,y+s.l);g.stroke()}
   g.fillStyle=`rgba(255,255,255,${.9*a})`;for(const c of cl){const y=(((c.y-d*c.s)%(H+160))+H+160)%(H+160)-80;ell(g,c.x,y,c.w,c.w*.35);g.fill();ell(g,c.x+c.w*.5,y-c.w*.15,c.w*.6,c.w*.28);g.fill()}
   const sw=1-seg(t,tc-1,tc);spirit(g,E,'#2a2060',cx+Math.sin(t*3)*14*sw,lerp(-E.ch*.6,cy,eo(seg(t,.3,tc-.1)))+Math.sin(t*5)*6*sw,.95,.9*a);
   flash(g,E,t,'255,255,255',.45)}};

 // ===== THE WORLD (SP) · a laurel wreath draws itself leaf by leaf, the four creatures fly in from the corners, a ring of stars turns =====
 FX.t_world=E=>{const{W,H,cx,cy,tc}=E,Rr=Math.min(W,H)*.4,N=46,pos=i=>{const a=-Math.PI/2+i/N*TAU;return[cx+Math.cos(a)*Rr*.85,cy+Math.sin(a)*Rr*1.05,a]},
   cn=[[.1,.12,'255,211,90',-1,-1],[.9,.12,'111,208,255',1,-1],[.1,.88,'255,122,90',-1,1],[.9,.88,'122,224,138',1,1]];
  return(g,t)=>{const a=fade(t,E,1.3);dim(g,E,'8,30,22',.55*Math.min(1,t/.5)*a);glow(g,cx,cy,Rr*(.5+.5*seg(t,.5,tc)),'230,255,200',.5*a);
   const u=eo(seg(t,.2,tc-.3)),n=Math.floor(N*u);g.save();g.globalAlpha=a;
   for(let i=0;i<n;i++){const p=pos(i);for(const sd of[-1,1])leaf(g,p[0],p[1],Rr*.17,Rr*.06,p[2]+Math.PI/2+sd*.9,i%2?'#3fc77a':'#7be09a');if(i%4===0){g.fillStyle='#e8344e';g.beginPath();g.arc(p[0],p[1],5,0,TAU);g.fill()}}
   if(u>.95){g.strokeStyle='#e8344e';g.lineWidth=7;for(const[sy,dr]of[[cy-Rr*1.05-4,-1],[cy+Rr*1.05+4,1]]){g.beginPath();g.moveTo(cx-60,sy+dr*18);g.quadraticCurveTo(cx,sy-dr*8,cx+60,sy+dr*18);g.stroke()}}g.restore();
   cn.forEach((c,i)=>{const p=eo(seg(t,.4+i*.3,1.6+i*.3)),x=lerp(W*c[0],cx+c[3]*Rr*.72,p),y=lerp(H*c[1],cy+c[4]*Rr,p);glow(g,x,y,40,c[2],.9*a);g.fillStyle=`rgb(${c[2]})`;g.beginPath();g.arc(x,y,10,0,TAU);g.fill()});
   g.fillStyle=`rgba(255,250,200,${.8*a})`;for(let k=0;k<60;k++){const an=k/60*TAU+t*.5;g.beginPath();g.arc(cx+Math.cos(an)*Rr*1.2,cy+Math.sin(an)*Rr*1.4,2.2,0,TAU);g.fill()}
   if(t>tc){const r=(t-tc)*H*.8;g.strokeStyle=`rgba(230,255,210,${Math.max(0,1-r/(H*.8))})`;g.lineWidth=6;g.beginPath();g.ellipse(cx,cy,r,r*1.2,0,0,TAU);g.stroke()}
   flash(g,E,t,'225,255,215',.45)}};

 // ===== THE MAGICIAN · a glowing infinity sign is traced in the air, the four suit symbols orbit it, converge, and a pillar of light shoots up and down =====
 FX.t_magic=E=>{const{W,H,cx,tc,R}=E,A=Math.min(W*.3,H*.42),icx=cx,icy=E.cy-H*.02,lem=s=>{const d=1+Math.sin(s)*Math.sin(s);return[icx+A*Math.cos(s)/d,icy+A*.9*Math.sin(s)*Math.cos(s)/d]},
   su=['255,140,50','80,170,255','215,225,255','90,220,130'],sp=Array.from({length:70},()=>({a:R()*TAU,v:150+R()*450,s:1.5+R()*3}));
  const glyph=(g,k,x,y,s)=>{g.save();g.translate(x,y);g.strokeStyle='#fff';g.fillStyle='#fff';g.lineWidth=3;g.lineCap='round';
   if(k===0){g.beginPath();g.moveTo(-s*.6,s*.6);g.lineTo(s*.6,-s*.6);g.stroke();g.beginPath();g.arc(s*.65,-s*.65,s*.2,0,TAU);g.fill()}
   else if(k===1){g.beginPath();g.moveTo(-s*.6,-s*.5);g.lineTo(s*.6,-s*.5);g.lineTo(s*.3,s*.2);g.lineTo(-s*.3,s*.2);g.closePath();g.stroke();g.beginPath();g.moveTo(0,s*.2);g.lineTo(0,s*.65);g.moveTo(-s*.35,s*.65);g.lineTo(s*.35,s*.65);g.stroke()}
   else if(k===2){g.beginPath();g.moveTo(0,-s*.8);g.lineTo(0,s*.5);g.moveTo(-s*.35,s*.1);g.lineTo(s*.35,s*.1);g.stroke();g.beginPath();g.arc(0,s*.65,s*.12,0,TAU);g.fill()}
   else{g.beginPath();g.arc(0,0,s*.55,0,TAU);g.stroke();starP(g,0,0,s*.55,0,5,.4);g.stroke()}g.restore()};
  return(g,t)=>{const a=fade(t,E,1.2);dim(g,E,'20,6,40',.55*Math.min(1,t/.5)*a);const hs=seg(t,.1,1.9)*TAU*2;
   g.save();g.globalCompositeOperation='lighter';for(let k=0;k<110;k++){const s=hs-k*.04;if(s<0)continue;const p=lem(s);g.fillStyle=`rgba(${k%2?'255,215,120':'190,140,255'},${(1-k/110)*a})`;g.beginPath();g.arc(p[0],p[1],6*(1-k/130)+1,0,TAU);g.fill()}g.restore();
   if(t<1.9){const p=lem(hs);glow(g,p[0],p[1],50,'255,235,170',.9)}
   const conv=eio(seg(t,tc-.6,tc));
   for(let i=0;i<4;i++){const p=eo(seg(t,.7+i*.3,1.3+i*.3));if(p<=0)continue;const an=i*TAU/4+t*1.2,rad=A*1.25*(1-conv),x=icx+Math.cos(an)*rad,y=icy+Math.sin(an)*rad*.7-(1-p)*80;g.globalAlpha=p*a;glow(g,x,y,48,su[i],.8);glyph(g,i,x,y,26);g.globalAlpha=1}
   if(t>1.9&&t<tc+.4){const bw=40*(1+Math.sin(t*10)*.1)*(1-seg(t,tc,tc+.4)),q=g.createLinearGradient(0,0,0,H);q.addColorStop(0,'rgba(255,230,160,0)');q.addColorStop(.5,'rgba(255,245,210,.9)');q.addColorStop(1,'rgba(255,230,160,0)');g.fillStyle=q;g.fillRect(icx-bw/2,0,bw,H)}
   if(t>tc){const dt=t-tc;g.save();g.globalCompositeOperation='lighter';for(const s of sp){g.fillStyle=`rgba(255,${200+s.s*15},120,${a})`;g.beginPath();g.arc(icx+Math.cos(s.a)*s.v*dt,icy+Math.sin(s.a)*s.v*dt,s.s,0,TAU);g.fill()}g.restore()}
   flash(g,E,t,'255,240,200',.45)}};

 // ===== THE HIGH PRIESTESS · a black pillar and a white pillar rise, a pomegranate veil sways between them, then parts to reveal moonlight =====
 FX.t_veil=E=>{const{W,H,cx,cy,tc,R}=E,pw=Math.max(60,W*.07),L=W*.2,Rg=W*.8,n=44,pm=Array.from({length:60},()=>({x:L+R()*(Rg-L),y:R()*H,s:R()*TAU}));
  const pillar=(g,x,h,dark)=>{const top=H-h,q=g.createLinearGradient(x,0,x+pw,0);if(dark){q.addColorStop(0,'#0a0912');q.addColorStop(1,'#2a2840')}else{q.addColorStop(0,'#cfd3e6');q.addColorStop(1,'#ffffff')}
   g.fillStyle=q;g.fillRect(x,top,pw,h);g.fillStyle=dark?'#3a3858':'#aab0cc';g.fillRect(x-8,top,pw+16,22);g.fillRect(x-8,H-18,pw+16,18);g.strokeStyle=dark?'rgba(255,255,255,.15)':'rgba(60,60,100,.2)';g.lineWidth=2;for(let k=1;k<4;k++){g.beginPath();g.moveTo(x+pw*k/4,top+22);g.lineTo(x+pw*k/4,H-18);g.stroke()}};
  return(g,t)=>{const a=fade(t,E,1),h=H*eo(seg(t,.1,.9)),open=eio(seg(t,tc-.6,tc+.6));dim(g,E,'6,8,40',.6*Math.min(1,t/.5)*a);glow(g,cx,cy,H*(.3+.5*open),'200,220,255',.7*open*a);
   g.save();const x0=L+pw,x1=Rg-pw,wid=x1-x0,vh=H*seg(t,.5,1.4),va=a*seg(t,.5,1.1);
   for(let i=0;i<n;i++){const u=(i+.5)/n,x=lerp(x0+u*wid,u<.5?x0:x1,open)+Math.sin(t*2+i*.4)*5*(1-open),sw=wid/n*(1-open*.85)+1,q=g.createLinearGradient(0,0,0,H);q.addColorStop(0,'#2a2e7a');q.addColorStop(1,'#5a3a9a');
    g.globalAlpha=va;g.fillStyle=q;g.fillRect(x-sw/2,0,sw+1,vh);g.fillStyle='#e8344e';for(let r=0;r<6;r++)if((i+r)%2===0){g.beginPath();g.arc(x,H*(r+.5)/6+Math.sin(t*2+i*.4)*3,5*(1-open*.8),0,TAU);g.fill()}}
   g.globalAlpha=a;pillar(g,L,h,true);pillar(g,Rg-pw,h,false);g.restore();
   g.fillStyle=`rgba(230,240,255,${.9*a*seg(t,.8,1.4)})`;g.beginPath();g.arc(cx,H*.12,22,.6,TAU-.6);g.arc(cx+9,H*.12,17,TAU-.6,.6,true);g.fill();
   for(const p of pm){g.fillStyle=`rgba(180,210,255,${(.4+.4*Math.sin(t*2+p.s))*a*open})`;g.beginPath();g.arc(p.x+Math.sin(t+p.s)*10,((p.y-t*30)%H+H)%H,2,0,TAU);g.fill()}
   flash(g,E,t,'210,225,255',.4)}};

 // ===== THE EMPRESS · wheat grows and sways in the wind, twelve stars crown in one by one, pomegranate seeds burst out =====
 FX.t_bloom=E=>{const{W,H,cx,cy,tc,R}=E,wh=Array.from({length:80},()=>({x:R()*W,h:H*(.25+R()*.45),d:R()*1.3,ph:R()*TAU,sc:.7+R()*.6})),sd=Array.from({length:80},()=>({a:R()*TAU,v:150+R()*400})),Rr=Math.min(W,H)*.38;
  return(g,t)=>{const a=fade(t,E,1.3),q=g.createLinearGradient(0,0,0,H);q.addColorStop(0,`rgba(20,60,40,${.55*a})`);q.addColorStop(1,`rgba(210,170,60,${.55*a})`);g.fillStyle=q;g.fillRect(0,0,W,H);glow(g,cx,cy,Rr*1.4,'255,170,200',.4*a*seg(t,.5,tc));
   for(let i=0;i<12;i++){const p=eo(seg(t,.4+i*.12,.9+i*.12));if(p<=0)continue;const an=i*TAU/12-Math.PI/2+t*.15,x=cx+Math.cos(an)*Rr*(2-p),y=cy-H*.02+Math.sin(an)*Rr*(2-p)*.85;g.globalAlpha=p*a;glow(g,x,y,30,'255,225,120',.8);g.fillStyle='#ffd35a';starP(g,x,y,13,an,5,.45);g.fill();g.globalAlpha=1}
   g.save();g.globalAlpha=a;g.lineCap='round';for(const s of wh){const p=eo(seg(t,.1+s.d*.5,1.7+s.d*.5)),h=s.h*p;if(h<3)continue;const sw=Math.sin(t*1.8+s.ph)*18*p,tx=s.x+sw,ty=H-h;
    g.strokeStyle='#8aa83a';g.lineWidth=2.5;g.beginPath();g.moveTo(s.x,H);g.quadraticCurveTo(s.x,H-h*.6,tx,ty);g.stroke();g.fillStyle='#e8b83a';for(let k=0;k<6;k++){ell(g,tx+(k%2?3:-3),ty-k*7*s.sc,3.5,7*s.sc,(k%2?.4:-.4)+sw*.01);g.fill()}}g.restore();
   if(t>tc){const dt=t-tc;g.fillStyle=`rgba(232,52,78,${a})`;for(const s of sd){g.beginPath();g.arc(cx+Math.cos(s.a)*s.v*dt,cy+Math.sin(s.a)*s.v*dt+200*dt*dt,4,0,TAU);g.fill()}}
   flash(g,E,t,'255,235,190',.45)}};

 // ===== THE EMPEROR · seven stone columns slam down one after another with dust and screen shake, forming a wall of power that then sinks into the earth =====
 FX.t_throne=E=>{const{W,H,cx,cy,tc,R}=E,n=7,cw=W/n,hs=Array.from({length:n},(_,i)=>H*(.5+.3*(1-Math.abs(i-3)/3))),lt=i=>.2+Math.abs(i-3)*.28,dust=Array.from({length:50},()=>({i:Math.floor(R()*n),dx:(R()-.5)*100,dy:R()*60,s:6+R()*14}));
  return(g,t)=>{const a=fade(t,E,1),sink=eio(seg(t,tc,tc+.9))*H*1.1;let sh=0;for(let i=0;i<n;i++){const d=t-(lt(i)+.3);if(d>0&&d<.3)sh+=(1-d/.3)*9}
   g.translate((Math.random()-.5)*sh,(Math.random()-.5)*sh);dim(g,E,'40,6,6',.5*Math.min(1,t/.5)*a);glow(g,cx,cy-H*.15,H*.6,'255,190,80',.5*seg(t,1,tc)*a);
   for(let i=0;i<n;i++){const T=lt(i);if(t<T)continue;const p=c01((t-T)/.3),yy=(t<T+.3?-hs[i]+H*p*p:H-hs[i])+sink,x=i*cw,q=g.createLinearGradient(x,0,x+cw,0);q.addColorStop(0,'#3a1414');q.addColorStop(.5,'#6a2a22');q.addColorStop(1,'#3a1414');
    g.fillStyle=q;g.fillRect(x+4,yy,cw-8,hs[i]);g.fillStyle='#e8b84a';g.fillRect(x+2,yy,cw-4,16);g.fillRect(x+cw*.45,yy+30,cw*.1,hs[i]*.6);g.strokeStyle='rgba(255,210,120,.5)';g.lineWidth=2;g.strokeRect(x+10,yy+26,cw-20,hs[i]-40)}
   for(const d of dust){const dt=t-(lt(d.i)+.3);if(dt<0||dt>1)continue;g.fillStyle=`rgba(210,190,160,${(1-dt)*.6*a})`;g.beginPath();g.arc(d.i*cw+cw/2+d.dx*dt*2,H-d.dy*dt-10,d.s*(1+dt),0,TAU);g.fill()}
   flash(g,E,t,'255,220,160',.4)}};

 // ===== THE LOVERS · rays pour from heaven, a pair of huge feathered angel wings opens, two spirals of light (pink & blue) twine into one =====
 FX.t_wings=E=>{const{W,H,cx,cy,tc}=E,Rw=Math.min(W*.42,H*.7),NF=15,sy=cy-H*.1;
  return(g,t)=>{const a=fade(t,E,1.4),op=eo(seg(t,.4,tc-.3));dim(g,E,'40,20,60',.4*Math.min(1,t/.5)*a);
   g.save();g.globalCompositeOperation='lighter';for(let i=0;i<16;i++){const an=Math.PI/2+(i-7.5)*.16;g.fillStyle=`rgba(255,235,200,${.14*seg(t,.1,1)*a})`;g.beginPath();g.moveTo(cx,-H*.1);g.lineTo(cx+Math.cos(an-.04)*H*1.6,-H*.1+Math.sin(an-.04)*H*1.6);g.lineTo(cx+Math.cos(an+.04)*H*1.6,-H*.1+Math.sin(an+.04)*H*1.6);g.fill()}g.restore();
   glow(g,cx,sy,Rw*.7,'255,240,230',.5*op*a);
   for(const side of[-1,1])for(let i=NF-1;i>=0;i--){const f=i/(NF-1),an=lerp(-1.5,-1.15+f*2,op),L=Rw*(.45+.55*Math.sin(f*Math.PI*.85+.25));g.save();g.translate(cx+side*18,sy);g.scale(side,1);g.rotate(an);g.globalAlpha=a;
    const q=g.createLinearGradient(0,0,L,0);q.addColorStop(0,'#fff6f2');q.addColorStop(1,i%2?'#ffd0e4':'#d8e6ff');g.fillStyle=q;g.strokeStyle='rgba(255,255,255,.8)';g.lineWidth=1.5;g.beginPath();g.moveTo(0,0);g.quadraticCurveTo(L*.5,-L*.1,L,0);g.quadraticCurveTo(L*.5,L*.1,0,0);g.fill();g.stroke();g.restore()}
   for(let s=0;s<2;s++){g.save();g.globalCompositeOperation='lighter';for(let k=0;k<50;k++){const u=seg(t,.2,tc-.1)-k*.012;if(u<0)continue;const r=(1-eo(u))*W*.35+8,an=(s?Math.PI:0)+u*9;g.fillStyle=`rgba(${s?'140,190,255':'255,150,200'},${(1-k/50)*a})`;g.beginPath();g.arc(cx+Math.cos(an)*r,cy+H*.2-u*H*.25+Math.sin(an)*r*.3,5-k*.07,0,TAU);g.fill()}g.restore()}
   if(t>tc){const dt=t-tc;g.fillStyle=`rgba(255,250,250,${a})`;for(let k=0;k<40;k++){g.save();g.translate(cx+Math.sin(k*7.3)*W*.4,-20+dt*(120+(k%7)*60)+(k*5)%100);g.rotate(k+dt*2);ell(g,0,0,14,4);g.fill();g.restore()}}
   flash(g,E,t,'255,240,245',.45)}};

 // ===== WHEEL OF FORTUNE · a giant ring of 26 tarot backs spins in perspective, slows to a stop, then the cards scatter and tumble away =====
 FX.t_wheel=E=>{const{W,H,cx,cy,tc}=E,M=26,cwid=Math.min(W,H)*.1;
  return(g,t)=>{const a=fade(t,E,1),sp=eo(seg(t,0,.7)),rot=24*(1-Math.pow(1-seg(t,0,tc),3)),Rx=W*.4*sp,Ry=H*.17*sp,sc=t>tc?t-tc:0;dim(g,E,'10,10,40',.55*Math.min(1,t/.5)*a);
   g.save();g.globalCompositeOperation='lighter';g.strokeStyle=`rgba(180,190,255,${.25*(1-seg(t,tc-1,tc))*a})`;g.lineWidth=2;for(let k=0;k<10;k++){g.beginPath();g.ellipse(cx,cy,Rx*(1+k*.06)+.01,Ry*(1+k*.06)+.01,0,0,TAU);g.stroke()}g.restore();
   const cs=[];for(let i=0;i<M;i++){const th=i/M*TAU+rot;cs.push({i,th,z:Math.sin(th)})}cs.sort((p,q)=>p.z-q.z);
   for(const c of cs){const k=.6+.4*(c.z+1)/2,w=cwid*k,h=w*1.67;g.save();g.globalAlpha=a*(.55+.45*(c.z+1)/2);g.translate(cx+Math.cos(c.th)*Rx*(1+sc*1.5),cy+c.z*Ry+sc*sc*260);g.rotate(Math.cos(c.th)*.25+sc*(c.i%2?2:-2));
    const q=g.createLinearGradient(0,-h/2,0,h/2);q.addColorStop(0,'#2a2a7a');q.addColorStop(1,'#14143a');g.fillStyle=q;g.strokeStyle='#e8b84a';g.lineWidth=2.5;g.beginPath();g.rect(-w/2,-h/2,w,h);g.fill();g.stroke();g.fillStyle='#ffd35a';starP(g,0,0,w*.28,0,8,.4);g.fill();g.restore()}
   flash(g,E,t,'210,215,255',.4)}};

 // ===== DEATH · everything goes dark and ravens cross a grey sky; a white scythe-slash cuts the screen diagonally, the two halves slide apart and white-gold butterflies rise =====
 FX.t_death=E=>{const{W,H,tc,R}=E,P0=[W*1.05,-20],P1=[-W*.05,H+20],dx=P1[0]-P0[0],dy=P1[1]-P0[1],ln=Math.hypot(dx,dy),nx=-dy/ln,ny=dx/ln,
   rav=Array.from({length:12},()=>({y:H*(.1+R()*.6),t0:R()*1.6,v:W*(.35+R()*.3),s:.6+R()*.8,ph:R()*TAU,dir:R()<.5?1:-1})),pt=Array.from({length:70},()=>({x:R()*W,s:60+R()*120,ph:R()*TAU,sz:4+R()*6})),
   bf=Array.from({length:50},()=>({x:R()*W,v:80+R()*220,ph:R()*TAU,w:6+R()*8,c:R()<.5?'255,255,255':'255,220,140'}));
  const poly=(g,pts,ox,oy,al)=>{g.fillStyle=`rgba(6,6,14,${al})`;g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p[0]+ox,p[1]+oy):g.moveTo(p[0]+ox,p[1]+oy));g.closePath();g.fill()};
  return(g,t)=>{const s=eo(seg(t,tc,tc+.9))*Math.hypot(W,H),al=.9*Math.min(1,t/.5)*(1-seg(t,tc+.3,tc+1));
   if(al>0){poly(g,[P0,[-300,-300],[-300,H+300],P1],nx*s,ny*s,al);poly(g,[P0,[W+300,-300],[W+300,H+300],P1],-nx*s,-ny*s,al)}
   if(t<tc){g.fillStyle='rgba(150,150,170,.12)';for(let k=0;k<5;k++){ell(g,((t*30*(k+1)+k*300)%(W+400))-200,H*(.2+k*.17),W*.3,H*.06);g.fill()}
    g.strokeStyle='rgba(200,200,215,.8)';g.lineWidth=3;for(const r of rav){const tt=t-r.t0;if(tt<0)continue;const x=r.dir>0?-60+tt*r.v:W+60-tt*r.v,y=r.y+Math.sin(tt*2+r.ph)*20,f=Math.sin(tt*14+r.ph)*10*r.s,w=24*r.s;g.beginPath();g.moveTo(x-w,y-f);g.quadraticCurveTo(x-w*.4,y-f*.2-6*r.s,x,y);g.quadraticCurveTo(x+w*.4,y-f*.2-6*r.s,x+w,y-f);g.stroke()}
    g.fillStyle='rgba(15,15,25,.9)';for(const p of pt){g.save();g.translate(p.x+Math.sin(t+p.ph)*20,((t*p.s+p.x)%(H+40))-20);g.rotate(t+p.ph);ell(g,0,0,p.sz,p.sz*.4);g.fill();g.restore()}}
   const q=seg(t,tc-.45,tc-.15);if(q>0&&t<tc+.5){g.save();g.globalAlpha=1-seg(t,tc+.1,tc+.5);g.strokeStyle='#fff';g.lineWidth=7;g.lineCap='round';g.shadowColor='#cfe0ff';g.shadowBlur=30;g.beginPath();g.moveTo(P0[0],P0[1]);g.lineTo(lerp(P0[0],P1[0],q),lerp(P0[1],P1[1],q));g.stroke();g.restore()}
   if(t>tc){const dt=t-tc;for(const b of bf){const x=b.x+Math.sin(dt*3+b.ph)*30,y=H+30-dt*b.v-dt*dt*20,fl=Math.abs(Math.sin(dt*12+b.ph));g.fillStyle=`rgba(${b.c},${1-seg(dt,.5,1.5)})`;ell(g,x-b.w*.5*fl,y,b.w*fl,b.w*.5,.4);g.fill();ell(g,x+b.w*.5*fl,y,b.w*fl,b.w*.5,-.4);g.fill()}}
   flash(g,E,t,'255,255,255',.3)}};

 // ===== THE STAR · 150 twinkling stars and shooting stars; a big eight-point star descends while a constellation is connected line by line; ripples spread below =====
 FX.t_star=E=>{const{W,H,cx,cy,tc,R}=E,S=Math.min(W,H)*1.1,by=cy-H*.1,sts=Array.from({length:150},()=>({x:R()*W,y:R()*H*.85,r:.8+R()*2,t0:R()*1.6,ph:R()*TAU})),
   P=[[-.34,.1],[-.2,-.22],[0,-.34],[.2,-.2],[.34,.12],[.12,.3],[-.12,.3]].map(p=>[cx+p[0]*S*.5,by+p[1]*S*.5]),sh=Array.from({length:5},(_,i)=>({t0:.4+i*.45,x:W*(.2+R()*.7),y:H*(.05+R()*.3)}));
  return(g,t)=>{const a=fade(t,E,1.3);dim(g,E,'2,6,30',.82*Math.min(1,t/.5)*a);g.fillStyle='#fff';
   for(const s of sts){g.globalAlpha=c01((t-s.t0)*2)*(.5+.5*Math.sin(t*3+s.ph))*a;g.beginPath();g.arc(s.x,s.y,s.r,0,TAU);g.fill()}g.globalAlpha=1;
   for(const s of sh){const dt=t-s.t0;if(dt<0||dt>.7)continue;const x=s.x-dt*W*.5,y=s.y+dt*H*.35,q=g.createLinearGradient(x,y,x+120,y-84);q.addColorStop(0,`rgba(255,255,255,${(1-dt/.7)*a})`);q.addColorStop(1,'rgba(255,255,255,0)');g.strokeStyle=q;g.lineWidth=3;g.beginPath();g.moveTo(x,y);g.lineTo(x+120,y-84);g.stroke()}
   const k=seg(t,.9,tc-.3)*P.length;g.strokeStyle=`rgba(190,210,255,${.7*a})`;g.lineWidth=1.5;g.beginPath();for(let i=0;i<P.length&&i<k;i++){const f=Math.min(1,k-i),p=P[i],n=P[(i+1)%P.length];g.moveTo(p[0],p[1]);g.lineTo(lerp(p[0],n[0],f),lerp(p[1],n[1],f))}g.stroke();
   P.forEach((p,i)=>{if(i<k){glow(g,p[0],p[1],20,'200,220,255',.8*a);g.fillStyle='#fff';g.beginPath();g.arc(p[0],p[1],3,0,TAU);g.fill()}});
   const u=eo(seg(t,.3,tc-.2)),sy=lerp(-60,by,u),R0=Math.min(W,H)*.14*(.4+.6*u);glow(g,cx,sy,R0*3,'255,240,170',.8*a);g.globalAlpha=a;g.fillStyle='#fff6c8';starP(g,cx,sy,R0,t*.3,8,.35);g.fill();g.globalAlpha=1;
   g.strokeStyle=`rgba(160,200,255,${.5*a})`;g.lineWidth=2;for(let r=0;r<4;r++){const rr=(t*90+r*80)%(W*.3);g.globalAlpha=1-rr/(W*.3);g.beginPath();g.ellipse(cx,H*.9,rr+.01,rr*.18+.01,0,0,TAU);g.stroke()}g.globalAlpha=1;
   flash(g,E,t,'255,250,215',.45)}};

 // ===== THE MOON · the moon waxes from nothing to full, a shimmering path of light spreads on the water, dew drops fall, mist drifts =====
 FX.t_moon=E=>{const{W,H,cx,cy,tc,R}=E,Rm=Math.min(W,H)*.2,my=cy-H*.12,dr=Array.from({length:18},()=>({x:R()*W,v:H*(.15+R()*.2),t0:R()*2,s:3+R()*3}));
  return(g,t)=>{const a=fade(t,E,1.3),p=eo(seg(t,.2,tc-.1)),k=1-2*p;dim(g,E,'6,8,40',.75*Math.min(1,t/.5)*a);glow(g,cx,my,Rm*(2+p*1.5),'170,200,255',.5*(.3+.7*p)*a);
   g.save();g.globalAlpha=a;g.fillStyle='#1a2250';g.beginPath();g.arc(cx,my,Rm,0,TAU);g.fill();
   if(p>.02){g.fillStyle='#f4f6ff';g.beginPath();g.moveTo(cx,my-Rm);g.arc(cx,my,Rm,-Math.PI/2,Math.PI/2,false);g.ellipse(cx,my,Math.max(.5,Rm*Math.abs(k)),Rm,0,Math.PI/2,-Math.PI/2,k>0);g.closePath();g.fill()}g.restore();
   for(let j=0;j<14;j++){const y=H*.62+j*H*.025,w=Rm*(.3+j*.12)*(.6+.4*p);g.fillStyle=`rgba(210,225,255,${Math.max(0,.55-j*.03)*p*a})`;for(let m=-3;m<=3;m++)g.fillRect(cx+m*w*.35+Math.sin(t*2+j*1.7+m)*w*.12-w*.12,y,w*.24,3)}
   g.fillStyle=`rgba(150,170,220,${.1*a})`;for(let q=0;q<3;q++){ell(g,((t*20*(q+1)+q*400)%(W+500))-250,H*(.5+q*.1),W*.35,H*.05);g.fill()}
   for(const d of dr){if(t<d.t0)continue;const y=((t-d.t0)*d.v)%H;g.fillStyle=`rgba(255,245,200,${.8*a})`;g.beginPath();g.moveTo(d.x,y-d.s*2.2);g.quadraticCurveTo(d.x+d.s,y,d.x,y+d.s*.6);g.quadraticCurveTo(d.x-d.s,y,d.x,y-d.s*2.2);g.fill()}
   if(t>tc){const r=(t-tc)*H*.7;g.strokeStyle=`rgba(200,220,255,${Math.max(0,1-r/(H*.7))})`;g.lineWidth=5;g.beginPath();g.arc(cx,my,Rm+r,0,TAU);g.stroke()}
   flash(g,E,t,'205,220,255',.45)}};

 // ===== THE SUN · a cheerful sun with alternating straight and wavy rays spins up over a blue sky while giant sunflowers grow and turn their faces to it =====
 FX.t_sun=E=>{const{W,H,cx,tc,R}=E,Rs=Math.min(W,H)*.13,sx0=cx,sy0=H*.2,nF=7,fl=Array.from({length:nF},(_,i)=>({x:W*(.1+.8*i/(nF-1)),h:H*(.3+R()*.3),d:.2+i*.1,r:Math.min(W,H)*(.055+R()*.02)}));
  return(g,t)=>{const a=fade(t,E,1.3),q=g.createLinearGradient(0,0,0,H);q.addColorStop(0,`rgba(70,170,255,${.95*a})`);q.addColorStop(1,`rgba(255,240,170,${.95*a})`);g.fillStyle=q;g.fillRect(0,0,W,H);
   const r=Rs*eo(seg(t,0,1.2));g.save();g.globalAlpha=a;glow(g,sx0,sy0,r*4,'255,230,120',.8);g.translate(sx0,sy0);g.rotate(t*.4);
   for(let i=0;i<16;i++){g.rotate(TAU/16);g.fillStyle=i%2?'#ffb02e':'#ffd23a';g.beginPath();if(i%2){g.moveTo(r*1.1,-r*.12);g.quadraticCurveTo(r*1.4,-r*.2,r*1.55,0);g.quadraticCurveTo(r*1.4,r*.2,r*1.1,r*.12)}else{g.moveTo(r*1.1,-r*.15);g.lineTo(r*1.9,0);g.lineTo(r*1.1,r*.15)}g.fill()}g.restore();
   g.save();g.globalAlpha=a;g.fillStyle='#ffd23a';g.beginPath();g.arc(sx0,sy0,r,0,TAU);g.fill();g.strokeStyle='#e89a1a';g.lineWidth=3;g.stroke();g.fillStyle='#e89a1a';ell(g,sx0-r*.3,sy0-r*.1,r*.07,r*.1);g.fill();ell(g,sx0+r*.3,sy0-r*.1,r*.07,r*.1);g.fill();g.beginPath();g.arc(sx0,sy0+r*.1,r*.35,.25,Math.PI-.25);g.stroke();g.restore();
   g.save();g.globalAlpha=a;for(const f of fl){const p=eo(seg(t,f.d,1.4+f.d)),b=eo(seg(t,.9+f.d,1.8+f.d)),h=f.h*p,hy=H-h;if(h<4)continue;g.strokeStyle='#3a9a3a';g.lineWidth=7;g.beginPath();g.moveTo(f.x,H);g.lineTo(f.x,hy);g.stroke();
    g.save();g.translate(f.x,hy);g.rotate((Math.atan2(sy0-hy,sx0-f.x)-Math.PI/2)*.5);for(let k=0;k<14;k++){g.save();g.rotate(k*TAU/14);ell(g,f.r*.95*b,0,f.r*.55*b,f.r*.2*b);g.fillStyle=k%2?'#ffc21a':'#ffd84a';g.fill();g.restore()}
    g.fillStyle='#5a3418';g.beginPath();g.arc(0,0,f.r*.5*b,0,TAU);g.fill();g.fillStyle='#8a5a2a';for(let k=0;k<10;k++){const rr=f.r*.28*b*Math.sqrt(k/10);g.beginPath();g.arc(Math.cos(k*2.4)*rr,Math.sin(k*2.4)*rr,2,0,TAU);g.fill()}g.restore()}g.restore();
   flash(g,E,t,'255,244,190',.45)}};

 // ----- which card gets which scene -----
 const BY_DEITY={LAKSHMI:'lotus',GANESHA:'wall',RADHA:'heart',SHIVA:'eye',VISHNU:'chakra',GANGA:'flood',VENKATESWARA:'doors',SARASWATI:'strings',SITA:'vines',SURYA:'sunrise',RAMA:'arrow',KRISHNA:'peacock',DHANVANTARI:'pulse'};
 const BY_TAROT={0:'t_fool',21:'t_world',1:'t_magic',2:'t_veil',3:'t_bloom',4:'t_throne',6:'t_wings',10:'t_wheel',13:'t_death',17:'t_star',18:'t_moon',19:'t_sun'};
 const DUR={doors:4.4,wall:4.6,eye:4.6},TC={doors:2.6,wall:2.7,eye:2.6,arrow:2.7,flood:2.6};
 const pick=card=>{if(card.deck==='tarot')return BY_TAROT[deck.indexOf(card)];return BY_DEITY[card.en]};

 let cv=null,g=null,act=null;
 function ensure(){if(cv)return;cv=document.createElement('canvas');cv.id='cine';cv.setAttribute('aria-hidden','true');cv.style.cssText='position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9';document.body.appendChild(cv);g=cv.getContext('2d')}
 function stop(){if(!act)return;const a=act;act=null;removeEventListener('pointerdown',a.skip,true);if(g)g.clearRect(0,0,cv.width,cv.height);a.onDone&&a.onDone()}
 function loop(now){const a=act;if(!a)return;const t=Math.max(0,(now-a.t0)/1000),dpr=a.dpr;g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,a.E.W,a.E.H);
  if(!a.hit&&t>=a.E.tc){a.hit=true;a.onClimax&&a.onClimax()}
  g.save();try{a.draw(g,t)}catch(e){console.warn('cine failed',e);if(!a.hit){a.hit=true;a.onClimax&&a.onClimax()}g.restore();stop();return}g.restore();
  if(t>=a.E.dur)stop();else requestAnimationFrame(loop)}
 // plays the scene for this card; returns false when the card has none (or reduced motion) so the caller can just reveal normally
 function play(card,onClimax,onDone,force){const name=force||pick(card);if(!name||!FX[name]||act||(typeof reduce!=='undefined'&&reduce))return false;ensure();
  const dpr=Math.min(devicePixelRatio||1,2),W=innerWidth,H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;const r=$('#card').getBoundingClientRect(),img=new Image();img.src=svgURL(faceSVG(card,'spirit'));
  const E={W,H,cx:r.left+r.width/2,cy:r.top+r.height/2,cw:r.width,ch:r.height,tc:TC[name]||2.6,dur:DUR[name]||4.4,R:mkR(card.seed||7),img,sil:{}};
  const a=act={E,dpr,draw:FX[name](E),hit:false,onClimax,onDone,t0:performance.now(),skip:()=>{const t=(performance.now()-a.t0)/1000;if(t<E.tc-.1)a.t0-=(E.tc-.1-t)*1000}};
  addEventListener('pointerdown',a.skip,true);requestAnimationFrame(loop);return true}
 const api={play,pick,names:Object.keys(FX),active:()=>!!act,FX};
 // dev: #cine=NAME previews one scene on the current card (e.g. index.html#cine=eye)
 {const m=location.hash.match(/cine=(\w+)/);if(m&&FX[m[1]])setTimeout(()=>{play(deck[0],()=>{},()=>{},m[1])},900)}
 return api})();
