
 // ===== continues the X3 closure (build.sh puts this right after 6d_three.js) =====
 // ---------- item 14: she never just stands there — wanders, builds a snowman, throws snowballs at the screen, dances ----------
 const rnd2=(a,b)=>a+Math.random()*(b-a);
 const mCoal=new THREE.MeshBasicMaterial({color:0x1a1420}),mCarrot=toon(0xff8a2a),mStick=toon(0x6b4423),mHatB=toon(0x1e1a2a);
 const handBall=new THREE.Mesh(S(.11,16,12),mWhite);handBall.position.set(0,-.98,.04);handBall.visible=false;arms[1].add(handBall);
 const holdBall=on=>{handBall.visible=on};
 let snowman=null;

 // free floor beside the big card (world x range at depth z): right side always, left side when there is room
 function zoneX(z){const half=L.px*.24,R0=sToW(L.w/2+cw/2+half+8,L.g.pv,z).x,R1=sToW(L.w-half-4,L.g.pv,z).x,
  L0=sToW(half+4,L.g.pv,z).x,L1=sToW(L.w/2-cw/2-half-8,L.g.pv,z).x;return{R:R0<R1?[R0,R1]:[R1,R1],L:L0<L1?[L0,L1]:null}}
 function pickSpot(){const z=rnd2(.3,1.0),Z=zoneX(z),side=Z.L&&Math.random()<.25?Z.L:Z.R;return{x:rnd2(side[0],side[1]),z}}

 function startBehaviour(t){const my=seq;
  const done=()=>{if(my!==seq)return;A.mode='idle';A.act=null;A.nextAct=performance.now()/1000+rnd2(1.2,3)};
  const forced=(location.hash.match(/act=([a-z]+)/)||[])[1]; // test hook: #act=snowman etc.
  if(!forced&&Math.random()<.3){const s=pickSpot();walkTo(s.x,s.z,()=>{if(my!==seq)return;A.mode='idle';A.yawT=rnd2(-.7,.4);A.nextAct=performance.now()/1000+rnd2(.8,2)});return}
  let act=['snowball','snowball','snowman','dance','wave','look','twirl'][Math.floor(Math.random()*7)];
  if(act==='snowman'&&snowman)act='snowball';if(forced)act=forced;
  A.act=act;A.actT=t;A.actDone=done;A.thrown=false;
  if(act==='snowman')buildSnowman()}

 // called from pose() while she is idle
 function idlePose(T,t){T.bob=Math.sin(t*2.2)*.012;T.hy=Math.sin(t*.7)*.22;T.alz=-.12-Math.sin(t*2.2)*.04;T.arz=.12+Math.sin(t*2.2)*.04;
  if(!A.act){if(t>A.nextAct&&CR.state==='none'&&A.hop<0)startBehaviour(t);return}
  const e=t-A.actT,act=A.act;let dur=1.8;
  if(act==='wave'){A.yawT=0;T.arz=2.5+Math.sin(t*14)*.28;T.arx=-.2;T.hy=.25;T.hx=-.08}
  else if(act==='look'){T.hy=Math.sin(e/1.8*Math.PI*2)*.7}
  else if(act==='twirl'){dur=1.1;A.yaw=A.yawT+ease(clamp(e/dur,0,1))*Math.PI*2;T.alz=-1.2;T.arz=1.2;T.bob=Math.sin(e/dur*Math.PI)*.15}
  else if(act==='dance'){dur=2.8;const w=Math.sin(e*7);A.yawT=Math.sin(e*3)*.6;T.bob=Math.abs(w)*.18;T.alz=-1.6-w*.6;T.arz=1.6-Math.sin(e*7+1)*.6;T.lx=w*.3;T.rx=-w*.3;T.hx=Math.sin(e*3.5)*.12}
  else if(act==='snowball'){dur=2.0;A.yawT=0;
   if(e<.6){T.bx=.55;T.bob=-.12;T.arx=-1.0;T.alx=-1.0;T.lx=-.5;T.rx=.3}                                   // scoop up snow
   else if(e<1.15){const q=(e-.6)/.55;holdBall(true);T.arx=1.1*q;T.arz=.3;T.alx=-.6;T.by=-.35*q;T.bx=-.08}    // wind up, ball in hand
   else if(e<1.45){const q=(e-1.15)/.3;T.arx=1.1-2.7*q;T.arz=.2;T.by=-.35+.7*q;T.bx=.25*q;T.alx=.3;if(!A.thrown){A.thrown=true;throwBall()}} // throw!
   else{T.arx=-1.3;T.by=.2;T.bx=.15}}
  else if(act==='snowman'){dur=4.3;
   if(e<3.1){A.yawT=(A.smDir||1)*Math.PI/2;const k=Math.sin(e*9)*.06;T.bx=.4+k;T.bob=-.1;T.alx=T.arx=-1.15-k;T.alz=.2;T.arz=-.2;T.lx=-.45;T.rx=.35} // roll & pat
   else{A.yawT=0;T.alz=-2.5+Math.sin(e*12)*.15;T.arz=2.5-Math.sin(e*12)*.15;T.bob=Math.abs(Math.sin(e*6.5))*.25}}                                 // ta-da!
  if(e>=dur){if(act==='twirl')A.yaw=A.yawT;holdBall(false);const d=A.actDone;A.act=null;d&&d()}}

 // the snowball flies out of the screen at you and splats on the glass
 function throwBall(){holdBall(false);const p0=new V();handBall.getWorldPosition(p0);const r=.11*root.scale.x;
  const b=new THREE.Mesh(S(1,16,12),mWhite);b.scale.setScalar(r);b.position.copy(p0);b.castShadow=true;scene.add(b);
  const sx=rnd2(.28,.72)*L.w,sy=rnd2(.22,.58)*L.h;rc.setFromCamera({x:sx/L.w*2-1,y:-(sy/L.h)*2+1},cam);const p1=cam.position.clone().addScaledVector(rc.ray.direction,1.4);
  tw(650,p=>{b.position.lerpVectors(p0,p1,p*p);b.position.y+=Math.sin(Math.PI*p)*.9;b.rotation.x+=.2},()=>{scene.remove(b);
   const R=$('#stage').getBoundingClientRect();if(typeof FX!=='undefined')FX.splat(R.left+sx,R.top+sy,Math.max(.7,L.px/220))})}

 // a little snowman she builds next to her: bottom, middle, head + carrot nose, coal eyes, red scarf, top hat, stick arms
 function buildSnowman(){let dir=A.x>0?1:-1;const off=1.25*root.scale.x;
  const tryX=A.x+dir*off,v=new V(tryX,L.gy,A.z).project(cam),px=(v.x+1)/2*L.w;if(px>L.w-30||px<30)dir=-dir;A.smDir=dir;
  const before=pickables.length,g=G(),lay=[G(),G(),G()];g.add(...lay);
  mk(S(.55),mWhite,lay[0],[0,.5,0]);
  mk(S(.4),mWhite,lay[1],[0,1.27,0]);mk(S(.05,8,6),mCoal,lay[1],[0,1.38,.38],{outline:false});mk(S(.05,8,6),mCoal,lay[1],[0,1.2,.4],{outline:false});
  mk(new THREE.CylinderGeometry(.025,.03,.6,6),mStick,lay[1],[.55,1.4,0],{rot:[0,0,-1.0]});mk(new THREE.CylinderGeometry(.025,.03,.6,6),mStick,lay[1],[-.55,1.4,0],{rot:[0,0,1.0]});
  mk(S(.3),mWhite,lay[2],[0,1.88,0]);mk(S(.04,8,6),mCoal,lay[2],[-.1,1.95,.26],{outline:false});mk(S(.04,8,6),mCoal,lay[2],[.1,1.95,.26],{outline:false});
  mk(new THREE.ConeGeometry(.05,.32,10),mCarrot,lay[2],[0,1.87,.42],{rot:[Math.PI/2,0,0]});
  mk(new THREE.TorusGeometry(.28,.07,8,24),mRed,lay[2],[0,1.62,0],{rot:[Math.PI/2,0,0]});
  mk(new THREE.CylinderGeometry(.3,.3,.04,20),mHatB,lay[2],[0,2.13,0]);mk(new THREE.CylinderGeometry(.19,.19,.3,20),mHatB,lay[2],[0,2.3,0]);
  pickables.splice(before);
  lay.forEach(l=>l.scale.setScalar(.001));g.position.set(A.x+dir*off,L.gy,A.z);g.scale.setScalar(root.scale.x);g.rotation.y=-dir*.5;scene.add(g);snowman=g;
  lay.forEach((l,i)=>tw(850,p=>{const e=1-Math.pow(1-p,3);l.scale.setScalar(Math.max(.001,e*(1+.15*Math.sin(p*Math.PI))))},null,i*1000+150));
  setTimeout(()=>{tw(1600,p=>{g.scale.y=root.scale.x*(1-p*.95);g.position.y=L.gy},()=>{scene.remove(g);if(snowman===g)snowman=null})},18000)}
