
// ---------- reveal effects: Christmas fireworks (item 12) + each card's own aura & spirit (item 13) ----------
const FX=(()=>{const c=$('#fx'),g=c.getContext('2d');let P=[],raf=0,EM=null;
 function size(){const d=Math.min(devicePixelRatio||1,2);c.width=innerWidth*d;c.height=innerHeight*d;g.setTransform(d,0,0,d,0,0)}
 size();addEventListener('resize',size);
 const COL=['#e8344e','#2fa36b','#ffd35a','#ffffff','#ffd35a','#ff8ad9','#c41f31','#3fc77a'];
 const rnd=(a,b)=>a+Math.random()*(b-a),pick=a=>a[Math.floor(Math.random()*a.length)];

 // --- Christmas burst particles: c=confetti, s=star, f=snowflake ---
 function add(x,y,n,s,spread){for(let i=0;i<n;i++){const a=spread?rnd(-Math.PI*.95,-Math.PI*.05):rnd(0,Math.PI*2),v=rnd(3,12)*s,r=Math.random();
  P.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-rnd(1,4)*s,t:r<.5?'c':r<.78?'s':'f',col:pick(COL),w:rnd(5,10)*s,h:rnd(8,15)*s,rot:rnd(0,6.3),vr:rnd(-.25,.25),
   life:1,dec:rnd(.006,.011),g:.17*s,sz:rnd(7,15)*s})}}
 function rain(n,s){for(let i=0;i<n;i++)P.push({x:rnd(0,innerWidth),y:rnd(-innerHeight*.4,-10),vx:rnd(-.6,.6),vy:rnd(1.5,3.5)*s,t:Math.random()<.6?'s':'f',col:Math.random()<.7?'#ffd35a':'#ffffff',
  w:0,h:0,rot:rnd(0,6.3),vr:rnd(-.08,.08),life:1,dec:rnd(.004,.007),g:.02*s,sz:rnd(6,13)*s,slow:1})}

 // --- element aura particles, emitted from around the card for a few seconds ---
 // fire (wands) · water (cups) · air (swords) · earth (pentacles) · star (major arcana, in the card's own colours)
 const ELEM={wand:{k:'fire',a:['#ff7a2a','#ffd35a']},cup:{k:'water',a:['#4fd1ff','#3a7bff']},sword:{k:'air',a:['#d9e0ff','#9b6bff']},pentacle:{k:'earth',a:['#5ad18a','#ffd35a']}};
 function auraOf(card){const e=ELEM[card.em];if(e)return e;return{k:'star',a:[card.pal.arch[0],card.pal.halo[1]]}}
 function spawn(){const R=EM.r,k=EM.k,s=EM.s,cx=R.left+R.width/2,cy=R.top+R.height/2;let x,y;
  const side=Math.random();if(k==='fire'||k==='water'){x=rnd(R.left,R.right);y=R.bottom-rnd(0,R.height*.25)}
  else{const a=rnd(0,Math.PI*2);x=cx+Math.cos(a)*R.width*.62;y=cy+Math.sin(a)*R.height*.55}
  const col=pick(EM.a);
  if(k==='fire')P.push({t:'flame',x:x+rnd(-8,8),y,vx:rnd(-.4,.4),vy:-rnd(1.8,3.6)*s,sz:rnd(10,22)*s,col,life:1,dec:rnd(.014,.024),g:0,rot:rnd(0,6.3),vr:.15});
  else if(k==='water')P.push({t:'bubble',x,y,vx:0,vy:-rnd(.8,2)*s,sz:rnd(4,11)*s,col,life:1,dec:rnd(.006,.012),g:0,rot:rnd(0,6.3),vr:rnd(.04,.09)});
  else if(k==='air'){const a=Math.atan2(y-cy,x-cx);P.push({t:'streak',x,y,cx,cy,ang:a,rad:Math.hypot(x-cx,(y-cy)*R.width/R.height),va:rnd(.025,.05)*(side<.5?1:-1),sz:rnd(1.2,2.6)*s,col,life:1,dec:rnd(.008,.014),px:x,py:y,g:0,vx:0,vy:0,rot:0,vr:0,asp:R.height/R.width})}
  else if(k==='earth')P.push({t:Math.random()<.55?'leaf':'coin',x,y,vx:rnd(-.6,.6),vy:-rnd(.6,1.6)*s,sz:rnd(6,11)*s,col:Math.random()<.55?'#5ad18a':'#ffd35a',life:1,dec:rnd(.006,.01),g:0,rot:rnd(0,6.3),vr:rnd(-.08,.08)});
  else P.push({t:Math.random()<.6?'orb':'s',x,y,vx:rnd(-.5,.5),vy:-rnd(.6,1.8)*s,sz:rnd(4,10)*s,col,life:1,dec:rnd(.007,.013),g:0,rot:rnd(0,6.3),vr:rnd(-.05,.05)})}

 function star(x,y,r,col,a){g.globalAlpha=a*.35;g.fillStyle=col;g.beginPath();g.arc(x,y,r*1.2,0,6.283);g.fill();g.globalAlpha=a;
  g.beginPath();for(let k=0;k<8;k++){const rr=k%2?r*.28:r,an=k*Math.PI/4-Math.PI/2;g.lineTo(x+Math.cos(an)*rr,y+Math.sin(an)*rr)}g.closePath();g.fill()}
 function flake(x,y,r,rot,a){g.globalAlpha=a;g.strokeStyle='#ffffff';g.lineWidth=Math.max(1,r*.14);g.lineCap='round';g.beginPath();
  for(let k=0;k<6;k++){const an=rot+k*Math.PI/3,ex=x+Math.cos(an)*r,ey=y+Math.sin(an)*r;g.moveTo(x,y);g.lineTo(ex,ey);
   const bx=x+Math.cos(an)*r*.55,by=y+Math.sin(an)*r*.55;g.moveTo(bx,by);g.lineTo(bx+Math.cos(an+.7)*r*.3,by+Math.sin(an+.7)*r*.3);g.moveTo(bx,by);g.lineTo(bx+Math.cos(an-.7)*r*.3,by+Math.sin(an-.7)*r*.3)}g.stroke()}
 function glow(x,y,r,col,a){const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,col);gr.addColorStop(1,'rgba(0,0,0,0)');g.globalAlpha=a;g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,6.283);g.fill()}

 function loop(now){g.clearRect(0,0,innerWidth,innerHeight);
  if(EM){if(now<EM.until){for(let i=0;i<EM.rate;i++)spawn()}else EM=null}
  for(let i=P.length-1;i>=0;i--){const p=P[i];p.life-=p.dec;if(p.life<=0||p.y>innerHeight+30){P.splice(i,1);continue}const a=Math.min(1,p.life*1.6);
   if(p.t==='streak'){p.px=p.x;p.py=p.y;p.ang+=p.va;p.rad*=1.004;p.x=p.cx+Math.cos(p.ang)*p.rad;p.y=p.cy+Math.sin(p.ang)*p.rad*p.asp;
    g.globalCompositeOperation='lighter';g.globalAlpha=a;g.strokeStyle=p.col;g.lineWidth=p.sz;g.lineCap='round';g.beginPath();g.moveTo(p.px,p.py);g.lineTo(p.x,p.y);g.stroke();g.globalCompositeOperation='source-over';continue}
   p.vx*=p.slow?1:.985;p.vy=p.vy*(p.slow?1:.985)+p.g;p.x+=p.vx+(p.slow?Math.sin(p.rot)*.4:0);p.y+=p.vy;p.rot+=p.vr;
   if(p.t==='c'){g.save();g.translate(p.x,p.y);g.rotate(p.rot);g.globalAlpha=a;g.fillStyle=p.col;g.fillRect(-p.w/2,-p.h/2,p.w,p.h*Math.abs(Math.cos(p.rot*2))+1);g.restore()}
   else if(p.t==='s')star(p.x,p.y,p.sz*.6*(.7+.3*Math.sin(p.rot*3)),p.col,a);
   else if(p.t==='f')flake(p.x,p.y,p.sz*.55,p.rot,a);
   else if(p.t==='flame'){g.globalCompositeOperation='lighter';p.x+=Math.sin(p.rot*3)*.6;glow(p.x,p.y,p.sz*(.4+.6*p.life),p.life>.55?'#ffe08a':p.col,a*.9);g.globalCompositeOperation='source-over'}
   else if(p.t==='bubble'){p.x+=Math.sin(p.rot)*.7;g.globalAlpha=a*.85;g.strokeStyle=p.col;g.lineWidth=1.4;g.beginPath();g.arc(p.x,p.y,p.sz,0,6.283);g.stroke();
    g.globalAlpha=a*.6;g.fillStyle='#ffffff';g.beginPath();g.arc(p.x-p.sz*.35,p.y-p.sz*.35,p.sz*.22,0,6.283);g.fill()}
   else if(p.t==='leaf'){g.save();g.translate(p.x+Math.sin(p.rot*2)*6,p.y);g.rotate(p.rot);g.globalAlpha=a;g.fillStyle=p.col;g.beginPath();g.ellipse(0,0,p.sz,p.sz*.42,0,0,6.283);g.fill();
    g.strokeStyle='rgba(20,80,40,.7)';g.lineWidth=1;g.beginPath();g.moveTo(-p.sz,0);g.lineTo(p.sz,0);g.stroke();g.restore()}
   else if(p.t==='coin'){g.globalAlpha=a;g.fillStyle=p.col;g.beginPath();g.ellipse(p.x,p.y,p.sz*.8*Math.abs(Math.cos(p.rot*2))+1,p.sz*.8,0,0,6.283);g.fill();
    g.globalAlpha=a*.5;g.fillStyle='#fff6c8';g.beginPath();g.ellipse(p.x,p.y,p.sz*.35*Math.abs(Math.cos(p.rot*2))+.5,p.sz*.35,0,0,6.283);g.fill()}
   else if(p.t==='dot'){g.globalAlpha=a;g.fillStyle='#ffffff';g.beginPath();g.arc(p.x,p.y,p.sz*.35,0,6.283);g.fill()}
   else if(p.t==='blob'){g.globalAlpha=Math.min(.92,a);g.fillStyle='#f4f8ff';g.beginPath();g.arc(p.x,p.y,p.sz*.55,0,6.283);g.fill();
    for(const l of p.lumps){g.beginPath();g.arc(p.x+Math.cos(l.a)*p.sz*l.d,p.y+Math.sin(l.a)*p.sz*l.d,p.sz*l.r,0,6.283);g.fill()}
    g.globalAlpha=Math.min(.5,a);g.fillStyle='#ffffff';g.beginPath();g.arc(p.x-p.sz*.18,p.y-p.sz*.2,p.sz*.2,0,6.283);g.fill()}
   else if(p.t==='orb'){g.globalCompositeOperation='lighter';glow(p.x,p.y,p.sz*1.8,p.col,a);g.globalCompositeOperation='source-over'}}
  g.globalAlpha=1;raf=(P.length||EM)?requestAnimationFrame(loop):0}
 const fire2=(el,cls)=>{if(!el)return;el.classList.remove(cls);void el.offsetWidth;el.classList.add(cls)};
 const go=()=>{if(!raf)raf=requestAnimationFrame(loop)};

 function celebrate(big){const r=$('#card').getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height*.42,s=Math.max(.6,r.width/300);
  add(x,y,big?150:70,s,false);
  if(big){setTimeout(()=>add(r.left-r.width*.15,r.bottom-r.height*.1,60,s*.9,true),220);setTimeout(()=>add(r.right+r.width*.15,r.bottom-r.height*.1,60,s*.9,true),380);rain(70,s)}
  fire2($('#rays'),'go');fire2($('#shock'),'go');fire2($('#front'),'party');
  if(big){fire2($('#xmasBanner'),'go');const xm=$('#xmas');xm.classList.add('party');clearTimeout(celebrate.t);celebrate.t=setTimeout(()=>xm.classList.remove('party'),3000)}
  go()}

 // item 13: the card's aura (colour + element particles) and its spirit — the character rising out of the card
 function aura(card,big){const A=auraOf(card),st=$('#stage');st.style.setProperty('--a1',A.a[0]);st.style.setProperty('--a2',A.a[1]);
  const au=$('#aura');au.classList.add('on');fire2(au,'burst');
  const sp=$('#spirit');sp.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(faceSVG(card,'spirit'));fire2(sp,'go');
  if(location.hash.includes('spiritpeek')){sp.style.animation='none';sp.style.opacity='1';sp.style.transform='translate(-50%,-64%) scale(1.32)'} // test hook: hold the spirit at its peak
  const r=$('#card').getBoundingClientRect();EM={k:A.k,a:A.a,r,s:Math.max(.6,r.width/300),until:performance.now()+(big?3600:2200),rate:A.k==='air'?3:2};go()}
 // item 14: a snowball hits the screen — white splat that slowly slides down + flying snow bits
 function splat(x,y,s){const lumps=Array.from({length:9},()=>({a:rnd(0,6.28),d:rnd(.35,.8),r:rnd(.3,.55)}));
  P.push({t:'blob',x,y,vx:0,vy:.18*s,sz:46*s,lumps,life:1,dec:.0045,g:.004,rot:0,vr:0,slow:1});
  for(let i=0;i<34;i++){const a=rnd(0,6.28),v=rnd(2,8)*s;P.push({t:Math.random()<.5?'f':'dot',x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,sz:rnd(4,10)*s,col:'#ffffff',life:1,dec:rnd(.015,.03),g:.12*s,rot:rnd(0,6.3),vr:.1})}
  go()}
 // item 14: every few seconds the open card shows off — three looks in its own colours / element, taking turns
 let pi=0;
 function pulse(card){const A=auraOf(card),st=$('#stage'),r=$('#card').getBoundingClientRect(),s=Math.max(.6,r.width/300),cx=r.left+r.width/2,cy=r.top+r.height*.45;
  st.style.setProperty('--a1',A.a[0]);st.style.setProperty('--a2',A.a[1]);const au=$('#aura');au.classList.add('on');
  const k=pi++%3;
  {const sp=$('#spirit');sp.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(faceSVG(card,'spirit'));fire2(sp,'go')} // the avatar rises on every pulse
  if(k===0){fire2(au,'burst');EM={k:A.k,a:A.a,r,s,until:performance.now()+1400,rate:2}}
  else if(k===1){fire2($('#sweep'),'go');fire2($('#shock'),'go');
   for(let i=0;i<46;i++){const a=rnd(0,6.28),v=rnd(2,7)*s;P.push({t:'s',x:cx,y:cy,vx:Math.cos(a)*v,vy:Math.sin(a)*v,sz:rnd(7,13)*s,col:pick(A.a.concat('#ffffff')),life:1,dec:rnd(.012,.02),g:.05*s,rot:rnd(0,6.3),vr:.1})}}
  else{fire2($('#rays'),'go');EM={k:A.k,a:A.a,r,s,until:performance.now()+1800,rate:A.k==='air'?4:3};fire2($('#front'),'party')}
  go()}
 function clearAura(){const au=$('#aura');au.classList.remove('on','burst');$('#spirit').classList.remove('go');EM=null}
 return{celebrate,aura,clearAura,splat,pulse}})();
