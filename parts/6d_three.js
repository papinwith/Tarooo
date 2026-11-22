
// ---------- 3D layer (Three.js r149): น้องหวานจิบิ with joints + action animations, and a real 3D rainbow card wheel ----------
const X3=(()=>{
 if(typeof THREE==='undefined')return null;
 const cvs=$('#three3d'),tag=$('#chibiTag');let R3;
 try{R3=new THREE.WebGLRenderer({canvas:cvs,alpha:true,antialias:true})}catch(e){cvs.remove();tag.remove();return null}
 THREE.ColorManagement.legacyMode=false;
 R3.setPixelRatio(Math.min(devicePixelRatio||1,2));R3.outputEncoding=THREE.sRGBEncoding;R3.toneMapping=THREE.ACESFilmicToneMapping;R3.toneMappingExposure=1.05;
 R3.shadowMap.enabled=true;R3.shadowMap.type=THREE.PCFSoftShadowMap;R3.localClippingEnabled=true;
 const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(28,1,.1,200),TILT=8*Math.PI/180,V=THREE.Vector3;
 scene.add(new THREE.HemisphereLight(0xe0d8ff,0x241a50,1.0));
 const sun=new THREE.DirectionalLight(0xfff0e0,1.5);sun.position.set(-3,7,7);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.radius=5;sun.shadow.bias=-.0005;scene.add(sun,sun.target);
 const rim=new THREE.DirectionalLight(0x9fd8ff,.9);rim.position.set(4,3,-6);scene.add(rim);
 const pink=new THREE.PointLight(0xff9ad9,0,10);scene.add(pink);
 const ground=new THREE.Mesh(new THREE.PlaneGeometry(80,40),new THREE.ShadowMaterial({opacity:.35}));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);
 const clip=new THREE.Plane(new V(0,1,0),0);

 // ---------- materials & helpers ----------
 const gm=new THREE.DataTexture(new Uint8Array([110,185,255]),3,1,THREE.RedFormat);gm.minFilter=gm.magFilter=THREE.NearestFilter;gm.needsUpdate=true;
 const toon=(c,o)=>new THREE.MeshToonMaterial(Object.assign({color:c,gradientMap:gm},o||{}));
 const OUT=new THREE.MeshBasicMaterial({color:0x2a1830,side:THREE.BackSide});
 function hull(geo,th){const g=geo.clone(),p=g.attributes.position,n=g.attributes.normal;for(let i=0;i<p.count;i++)p.setXYZ(i,p.getX(i)+n.getX(i)*th,p.getY(i)+n.getY(i)*th,p.getZ(i)+n.getZ(i)*th);return g}
 const pickables=[];
 function mk(geo,mat,parent,pos,o){o=o||{};const m=new THREE.Mesh(geo,mat);if(pos)m.position.set(pos[0],pos[1],pos[2]);if(o.rot)m.rotation.set(o.rot[0],o.rot[1],o.rot[2]);
  if(o.scale)m.scale.set(o.scale[0],o.scale[1],o.scale[2]);m.castShadow=o.shadow!==false;parent.add(m);pickables.push(m);
  if(o.outline!==false)m.add(new THREE.Mesh(hull(geo,o.ow||.014),OUT));return m}
 const S=(r,w,h)=>new THREE.SphereGeometry(r,w||28,h||20),G=()=>new THREE.Group();

 // ---------- หวาน (≈3.5 units tall incl. hat, +Z = her front): a 21-year-old young woman, same anime face as before ----------
 const mSkin=toon(0xffe2d2),mHair=toon(0x3e1e10),mHair2=toon(0x52291a),mWhite=toon(0xfbf7f2),mLace=toon(0xf1e9e0),mRed=toon(0xd8283a),
  mGold=toon(0xe9bd52,{emissive:0x3a2800}),mShoe=toon(0xc0302a),mEye=new THREE.MeshBasicMaterial({color:0x2b1a2e}),mIris=new THREE.MeshBasicMaterial({color:0x6a3a24}),
  mShine=new THREE.MeshBasicMaterial({color:0xffffff}),mBlush=new THREE.MeshBasicMaterial({color:0xff7f9a,transparent:true,opacity:.45,depthWrite:false}),mLip=new THREE.MeshBasicMaterial({color:0xb0444e});
 const root=G(),body=G();scene.add(root);root.add(body);
 const DZ=.78; // the dress/bodice is flattened front-to-back
 // long legs (hip pivot at 1.55)
 const legs=[-1,1].map(s=>{const p=G();p.position.set(s*.1,1.55,0);body.add(p);
  mk(new THREE.CapsuleGeometry(.08,1.2,10,20),mSkin,p,[0,-.66,0],{ow:.01});mk(S(.085,24,18),mShoe,p,[0,-1.44,.07],{scale:[1,.7,1.75],ow:.01});return p});
 // fitted dress: bodice -> waist -> flared knee-length skirt
 const dressPts=[[0,.98],[.6,.98],[.64,1.02],[.61,1.1],[.52,1.34],[.42,1.6],[.32,1.86],[.235,2.04],[.255,2.16],[.295,2.3],[.28,2.4],[.2,2.48],[0,2.5]].map(p=>new THREE.Vector2(p[0],p[1]));
 mk(new THREE.LatheGeometry(dressPts,72),mWhite,body,[0,0,0],{scale:[1,1,DZ],ow:.012});
 mk(new THREE.TorusGeometry(.625,.03,10,72),mLace,body,[0,1.0,0],{rot:[Math.PI/2,0,0],scale:[1,DZ,1],outline:false});
 for(let i=0;i<28;i++){const a=i/28*Math.PI*2;mk(S(.036,10,8),mLace,body,[Math.sin(a)*.63,.98,Math.cos(a)*.63*DZ],{outline:false})}
 mk(new THREE.TorusGeometry(.245,.026,10,48),mGold,body,[0,2.04,0],{rot:[Math.PI/2,0,0],scale:[1,DZ,1],outline:false});
 mk(S(.04),mGold,body,[0,2.04,.245*DZ+.01],{outline:false});
 // slender arms (shoulder pivot), small puff sleeves
 const arms=[-1,1].map(s=>{mk(S(.1,24,18),mWhite,body,[s*.3,2.4,0],{scale:[1,.9,.95]});const p=G();p.position.set(s*.32,2.38,0);body.add(p);
  mk(new THREE.CapsuleGeometry(.05,.86,8,16),mSkin,p,[0,-.5,0],{ow:.01});mk(S(.055,20,16),mSkin,p,[0,-.98,.01],{scale:[.9,1.2,.75],ow:.008});p.rotation.z=s*.12;return p});
 mk(new THREE.CylinderGeometry(.055,.065,.2,20),mSkin,body,[0,2.55,0],{outline:false});
 // head: same face as before, just smaller relative to the body
 const head=G();head.position.set(0,2.52,0);head.scale.setScalar(.6);body.add(head);
 const HC=[0,.48,0];
 mk(S(.52,48,36),mSkin,head,HC,{scale:[.94,1,.96],ow:.012});
 // hair: smooth crown, soft side-swept fringe, and one smooth wavy sheet falling down the back (no separate strings)
 mk(new THREE.SphereGeometry(.56,48,28,0,Math.PI*2,0,1.5),mHair,head,HC,{rot:[-.38,0,0],ow:.012});
 [-.3,-.12,.06,.24].forEach((x,i)=>{const y=.2-Math.abs(x)*.25,z=Math.sqrt(Math.max(.02,.3-x*x-y*y));mk(S(.16,24,18),i%2?mHair2:mHair,head,[x,HC[1]+y,z-.04],{scale:[1.25,.7,.5],rot:[0,x*1.3,-.35]})});
 {const nu=56,nv=40,A0=2.45,LEN=2.15,pos=[],ind=[];
  for(let j=0;j<=nv;j++){const v=j/nv;for(let i=0;i<=nu;i++){const u=i/nu,a=-A0+2*A0*u,edge=Math.pow(Math.abs(a)/A0,3);
   const r=.53+.12*Math.min(1,v*3)+.07*v+.03*Math.sin(v*9+a*1.5)*v-edge*.05,y=HC[1]+.36-LEN*v+edge*.25*v,curl=v>.9?(v-.9)*1.2:0;
   pos.push(Math.sin(a)*(r-curl),y,-Math.cos(a)*(r-curl)*.92+edge*.1)}}
  for(let j=0;j<nv;j++)for(let i=0;i<nu;i++){const a=j*(nu+1)+i,b=a+nu+1;ind.push(a,b,a+1,b,b+1,a+1)}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(ind);g.computeVertexNormals();
  const hm=mHair.clone();hm.side=THREE.DoubleSide;mk(g,hm,head,[0,0,0],{outline:false})}
 // face
 for(const s of[-1,1]){const e=mk(S(.1),mEye,head,[s*.19,HC[1]+.02,.465],{scale:[.72,1,.35],outline:false,shadow:false});
  mk(S(.07),mIris,e,[0,-.035,.06],{scale:[1,.8,.6],outline:false,shadow:false});
  mk(S(.03),mShine,e,[-.035,.045,.09],{outline:false,shadow:false});mk(S(.016),mShine,e,[.03,-.04,.09],{outline:false,shadow:false});
  mk(new THREE.CircleGeometry(.075,20),mBlush,head,[s*.3,HC[1]-.11,.43],{rot:[0,s*.55,0],scale:[1,.6,1],outline:false,shadow:false})}
 mk(new THREE.TorusGeometry(.05,.012,8,16,Math.PI),mLip,head,[0,HC[1]-.15,.5],{rot:[0,0,Math.PI],outline:false,shadow:false});
 // santa hat
 const hat=G();hat.position.set(0,HC[1]+.36,-.05);hat.rotation.set(-.3,0,-.12);head.add(hat);
 mk(new THREE.TorusGeometry(.47,.09,20,48),mWhite,hat,[0,0,0],{rot:[Math.PI/2,0,0]});
 const cone=mk(new THREE.ConeGeometry(.45,.8,40),mRed,hat,[.05,.4,-.03],{rot:[-.25,0,-.25]});
 mk(S(.13),mWhite,cone,[0,.42,0]);

 // ---------- the 3D rainbow card wheel ----------
 const wheel=G(),ring=G();wheel.add(ring);wheel.visible=false;scene.add(wheel);
 let backTex=null,cardMats=null,freeMats=null;
 let loading=0;const loadBack=()=>{if(loading++)return;const im=new Image();im.onload=()=>{const c=document.createElement('canvas');c.width=360;c.height=600;c.getContext('2d').drawImage(im,0,0,360,600);
  backTex=new THREE.CanvasTexture(c);backTex.encoding=THREE.sRGBEncoding;backTex.anisotropy=4;
  const edge=o=>new THREE.MeshStandardMaterial(Object.assign({color:0xd5d9e2,metalness:.35,roughness:.35},o)),face=o=>new THREE.MeshStandardMaterial(Object.assign({map:backTex,roughness:.45,metalness:.1},o));
  const e1=edge({clippingPlanes:[clip]}),f1=face({clippingPlanes:[clip]}),e2=edge(),f2=face();cardMats=[e1,e1,e1,e1,f1,f1];freeMats=[e2,e2,e2,e2,f2,f2]};im.src=$('#backImg').src};
 const RB=[0xff4650,0xffa032,0xffe646,0x50dc82,0x46a0ff,0x7a5cff,0xc070ff];

 // ---------- layout: map stage pixels onto the world ----------
 const L={w:1,h:1,gy:0,homeX:2,homeZ:.6,s:1,g:null},rc=new THREE.Raycaster(),pl=new THREE.Plane();
 function sToW(x,y,z){rc.setFromCamera({x:x/L.w*2-1,y:-(y/L.h)*2+1},cam);pl.set(new V(0,0,1),-z);return rc.ray.intersectPlane(pl,new V())||new V()}
 function layout(w,h){loadBack();L.w=w;L.h=h;R3.setSize(w,h,false);cam.aspect=w/h;const D=(h/200)/Math.tan(14*Math.PI/180);
  cam.position.set(0,D*Math.sin(TILT),D*Math.cos(TILT));cam.lookAt(0,0,0);cam.updateProjectionMatrix();cam.updateMatrixWorld();
  L.g=arcGeom();L.gy=sToW(w/2,L.g.pv,0).y;ground.position.y=L.gy;clip.constant=-L.gy;
  const ch=cw*5/3,side=(w-cw)/2,px=clamp(Math.min(ch*.55,(side-6)*2.3),95,330);L.px=px;L.s=px/100/3.4;root.scale.setScalar(L.s);
  const sx=Math.min(w-px*.26-4,w/2+cw/2+Math.max(side/2,px*.2+6));L.homeX=sToW(sx,L.g.pv,L.homeZ).x;
  if(A.mode==='idle'){A.x=L.homeX;A.z=L.homeZ}
  const sc=sun.shadow.camera,e=w/180;sc.left=-e;sc.right=e;sc.top=e;sc.bottom=-e;sc.near=.5;sc.far=40;sc.updateProjectionMatrix();
  tag.classList.toggle('small',px<160)}

 // ---------- action state machine ----------
 const A={mode:'idle',x:2,z:.6,yaw:0,yawT:-.35,ph:0,act:null,actT:0,nextAct:0,hop:-1,walk:null};
 const J={lx:0,rx:0,alx:0,aly:0,alz:-.12,arx:0,ary:0,arz:.12,bx:0,by:0,hy:0,hx:0,bob:0};
 arms.forEach(a=>a.rotation.order='YXZ'); // so a Y turn sweeps the reaching arm sideways (the swipe)
 let seq=0;const goHome=(delay)=>{const my=++seq;setTimeout(()=>{if(my!==seq)return;walkTo(L.homeX,L.homeZ,()=>{if(my!==seq)return;A.mode='idle';A.yawT=-.35;A.nextAct=performance.now()/1000+3})},delay)};
 // swipe: wind up (arm out to the side) -> sweep across -> follow through. side=+1 right arm, -1 left arm. onHit fires at contact.
 function swipe(side,onHit,onEnd){A.act=null;A.mode='swipe';A.sw={t0:performance.now(),dur:780,side,hit:false,onHit,onEnd}}
 const tws=[];const tw=(dur,fn,done,delay)=>tws.push({t0:performance.now()+(delay||0),dur,fn,done});
 const ease=p=>p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;
 function walkTo(x,z,cb){const d=Math.hypot(x-A.x,z-A.z);A.walk={sx:A.x,sz:A.z,x,z,t0:performance.now(),dur:clamp(d/(L.s*3.4)*520,350,1400),cb};A.mode='walk'}
 const pickRay=new THREE.Raycaster();
 $('#stage').addEventListener('pointerdown',e=>{const r=$('#stage').getBoundingClientRect();pickRay.setFromCamera({x:(e.clientX-r.left)/r.width*2-1,y:-((e.clientY-r.top)/r.height)*2+1},cam);
  if(A.mode==='idle'&&A.hop<0&&pickRay.intersectObjects(pickables,false).length){A.hop=performance.now();e.stopPropagation()}},true);

 function pose(t,dt){const T={lx:0,rx:0,alx:0,aly:0,alz:-.12,arx:0,ary:0,arz:.12,bx:0,by:0,hy:0,hx:0,bob:0};
  const m=A.mode;let kk=12;if(A.act!=='snowball'&&handBall.visible)holdBall(false);
  if(m==='swipe'){const S=A.sw,p=clamp((performance.now()-S.t0)/S.dur,0,1),s=S.side,R=s>0;let ax,ay,by,lean;
   if(p<.38){const q=ease(p/.38);ax=-.9*q;ay=1.25*q;by=.4*q;lean=-.05*q}
   else if(p<.6){const q=(p-.38)/.22;ax=-.9-.55*q;ay=1.25-2.45*q;by=.4-.95*q;lean=.25*q}
   else{const q=ease((p-.6)/.4);ax=-1.45+1.0*q;ay=-1.2+.9*q;by=-.55+.45*q;lean=.25-.2*q}
   if(R){T.arx=ax;T.ary=ay;T.arz=.1;T.alx=.35;T.alz=-.25}else{T.alx=ax;T.aly=-ay;T.alz=-.1;T.arx=.35;T.arz=.25}
   T.by=by*s;T.bx=lean;T.lx=R?-.35:.3;T.rx=R?.3:-.35;T.hy=-by*s*.5;kk=p>.38&&p<.6?30:14;
   if(!S.hit&&p>=.5){S.hit=true;S.onHit&&S.onHit()}
   if(p>=1){A.mode='stand';const e=S.onEnd;S.onEnd=null;e&&e()}}
  if(m==='idle')idlePose(T,t);
  else if(m==='walk'){A.ph+=dt*10;const s=Math.sin(A.ph);T.lx=s*.6;T.rx=-s*.6;T.alx=-s*.55;T.arx=s*.55;T.bob=Math.abs(Math.cos(A.ph))*.07;T.bx=.1}
  else if(m==='push'){const e=Math.sin(t*11)*.06;T.bx=.32+e;T.alx=T.arx=-1.45-e;T.alz=.18;T.arz=-.18;T.lx=-.5;T.rx=.4}
  else if(m==='watch'){T.alx=T.arx=-1.05;T.alz=.35+Math.sin(t*16)*.22;T.arz=-.35-Math.sin(t*16)*.22;T.bob=Math.abs(Math.sin(t*7))*.06;T.hy=-.2}
  else if(m==='cheer'){T.alz=-2.6+Math.sin(t*12)*.15;T.arz=2.6-Math.sin(t*12)*.15;T.bob=Math.abs(Math.sin(t*6.5))*.32;T.hx=-.12}
  if(A.hop>=0){const p=(performance.now()-A.hop)/750;if(p>=1){A.hop=-1}else{T.bob+=Math.sin(Math.PI*p)*.55;T.alz=-2.2;T.arz=2.2;T.lx=-.4;T.rx=-.4;A.spin=Math.PI*2*ease(p)}}
  if(A.hop<0)A.spin=0;
  const k=Math.min(1,dt*kk);for(const n in T)J[n]+=(T[n]-J[n])*k;
  legs[0].rotation.x=J.lx;legs[1].rotation.x=J.rx;arms[0].rotation.set(J.alx,J.aly,J.alz);arms[1].rotation.set(J.arx,J.ary,J.arz);
  body.rotation.set(J.bx,J.by,0);body.position.y=J.bob;head.rotation.set(J.hx,J.hy,0)}

 // ---------- tap on the tarot card: walk to its right edge and swipe it ----------
 function swipeCard(onHit){if(!L.g){onHit();return}A.act=null;A.hop=-1;seq++;
  const sx=(cw/100)*.24,sz=1.0; // in front of the card, a little right of centre
  const doIt=()=>{A.yawT=Math.PI+.5;setTimeout(()=>swipe(1,onHit,()=>{A.mode="cheer";A.yawT=0;goHome(900)}),170)};
  if(Math.hypot(sx-A.x,sz-A.z)<.05&&A.mode!=="walk"){doIt()}else walkTo(sx,sz,doIt)}

 let last=0;
 function tick(now){const dt=Math.min(.05,last?(now-last)/1000:0),t=now/1000;last=now;
  for(let i=tws.length-1;i>=0;i--){const w=tws[i];if(now<w.t0)continue;const p=clamp((now-w.t0)/w.dur,0,1);w.fn(p);if(p>=1){tws.splice(i,1);w.done&&w.done()}}
  if(A.mode==='walk'&&A.walk){const W=A.walk,p=clamp((now-W.t0)/W.dur,0,1);A.x=W.sx+(W.x-W.sx)*p;A.z=W.sz+(W.z-W.sz)*p;
   if(Math.abs(W.x-W.sx)>.01)A.yawT=W.x>W.sx?Math.PI/2:-Math.PI/2;if(p>=1){A.walk=null;A.mode='stand';W.cb&&W.cb()}}
  if(!(A.mode==='idle'&&A.act==='twirl')){const d=((A.yawT-A.yaw+Math.PI)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)-Math.PI;A.yaw+=d*Math.min(1,dt*9)}
  pose(t,dt);if(SCAN)SCAN.update();
  // feet stay on the card-bottom line on screen even when she steps toward the camera (otherwise she sinks out of view)
  const fy=A.z>L.homeZ+.05?Math.max(L.gy,sToW(L.w/2,L.g.pv-6,A.z).y):L.gy;
  root.position.set(A.x,fy,A.z);root.rotation.y=A.yaw+(A.spin||0);
  { // keep her apparent size the same when she walks toward the camera (perspective would make her look huge)
   const D=cam.position.length();root.scale.setScalar(L.s*clamp((D-A.z)/(D-L.homeZ),.55,1.2))}
  sun.position.set(A.x-3,L.gy+7,7);sun.target.position.set(A.x,L.gy,0);
  if(CR.update)CR.update(t,dt);R3.render(scene,cam);
  const v=new V(A.x,L.gy-.02,A.z).project(cam);const tw2=tag.offsetWidth/2+2;tag.style.left=clamp((v.x+1)/2*L.w,tw2,L.w-tw2).toFixed(1)+'px';tag.style.top=((1-v.y)/2*L.h).toFixed(1)+'px';tag.style.opacity=A.mode==='idle'?'1':'0'}


