
 // ===== continues the X3 closure from 6d_three.js (build.sh concatenates the two) =====
 // ---------- the carousel: a few face-up cards standing in a 3D ring over a mirror floor ----------
 // the card turned to the front lets its character pop out of the frame (separate "fg" layer + glow)
 const CR={state:'none',ids:[],cards:[],refl:[],rot:0,rotT:0,y:0,geo:null,onArrive:null,drag:null,reflOn:false};
 const carousel=G();scene.add(carousel);
 const fadeTex=(()=>{const c=document.createElement('canvas');c.width=4;c.height=128;const g=c.getContext('2d'),gr=g.createLinearGradient(0,0,0,128);
  gr.addColorStop(0,'#000');gr.addColorStop(.55,'#000');gr.addColorStop(1,'#fff');g.fillStyle=gr;g.fillRect(0,0,4,128);return new THREE.CanvasTexture(c)})();
 const glowTex=(()=>{const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d'),gr=g.createRadialGradient(64,64,0,64,64,64);
  gr.addColorStop(0,'rgba(255,240,200,1)');gr.addColorStop(.35,'rgba(200,160,255,.55)');gr.addColorStop(1,'rgba(120,80,255,0)');g.fillStyle=gr;g.fillRect(0,0,128,128);return new THREE.CanvasTexture(c)})();
 function svgTex(svg,draw){return new Promise(res=>{const im=new Image();im.onload=()=>{const c=document.createElement('canvas');c.width=420;c.height=700;const g=c.getContext('2d');
  g.drawImage(im,0,0,420,700);if(draw)draw(g);const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.anisotropy=4;res(t)};im.onerror=()=>res(null);
  im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg)})}
 // the SVG card has no text (the DOM card adds it as HTML), so paint the numeral + name onto the texture
 function labelDraw(c){return g=>{const k=420/300;g.textAlign='center';g.textBaseline='middle';g.fillStyle='#eef1f8';g.font=`700 ${Math.round(13*k)}px Cinzel, serif`;
  if(c.roman)g.fillText(c.roman,150*k,27*k);let fs=15;g.font=`700 ${fs*k}px Cinzel, serif`;while(g.measureText(c.en).width>236*k&&fs>8){fs-=.5;g.font=`700 ${fs*k}px Cinzel, serif`}
  g.fillStyle='#f4e7c2';g.shadowColor='rgba(255,210,140,.6)';g.shadowBlur=8;g.fillText(c.en,150*k,427*k)}}
 function crGeom(){const ch=cw*5/3,H=Math.min(ch*.62,L.g.pv-40)/100,W=H*.6;return{H,W,R:W*1.62,cy:L.gy+H/2+.04}}
 function clearCarousel(){carousel.children.slice().forEach(o=>carousel.remove(o));CR.cards=[];CR.refl=[]}
 async function buildCarousel(ids){await(document.fonts?document.fonts.ready:Promise.resolve());
  const G2=CR.geo=crGeom(),n=ids.length,step=Math.PI*2/n;
  const tex=await Promise.all(ids.map(id=>Promise.all([svgTex(faceSVG(deck[id],'bg'),labelDraw(deck[id])),svgTex(faceSVG(deck[id],'spirit'))])));
  clearCarousel();const pg=new THREE.PlaneGeometry(G2.W,G2.H),eg=new THREE.BoxGeometry(G2.W*1.004,G2.H*1.004,.02);
  const silver=new THREE.MeshStandardMaterial({color:0xd5d9e2,metalness:.35,roughness:.35,clippingPlanes:[clip]});
  ids.forEach((id,i)=>{const grp=G(),[bg,fg]=tex[i];
   const edge=new THREE.Mesh(eg,[silver,silver,silver,silver,silver,cardMats[5]]);
   const base=new THREE.Mesh(pg,new THREE.MeshStandardMaterial({map:bg,roughness:.45,metalness:.05,clippingPlanes:[clip]}));base.position.z=.012;
   const glow=new THREE.Mesh(new THREE.PlaneGeometry(G2.W*1.5,G2.W*1.5),new THREE.MeshBasicMaterial({map:glowTex,transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending}));glow.position.set(0,G2.H*.08,.03);
   const pop=new THREE.Mesh(pg,new THREE.MeshStandardMaterial({map:fg,transparent:true,alphaTest:.02,roughness:.5,metalness:0,clippingPlanes:[clip]}));pop.position.z=.02;
   grp.add(edge,base,glow,pop);grp.userData={i,id,a:i*step,pop,glow};edge.castShadow=base.castShadow=pop.castShadow=true;carousel.add(grp);CR.cards.push(grp);
   // mirror image on the floor: same textures, flipped, fading out downwards
   const rg=G(),rmat=t=>new THREE.MeshBasicMaterial({map:t,transparent:true,opacity:.45,alphaMap:fadeTex,depthWrite:false});
   const rb=new THREE.Mesh(pg,rmat(bg)),rp=new THREE.Mesh(pg,rmat(fg));rp.position.z=.02;rg.add(rb,rp);rg.scale.y=-1;rg.userData={rp};carousel.add(rg);CR.refl.push(rg)});
  CR.ids=ids;CR.step=step;CR.rot=CR.rotT=0}
 const frontIdx=()=>((Math.round(-CR.rot/CR.step)%CR.ids.length)+CR.ids.length)%CR.ids.length;
 CR.update=(t,dt)=>{if(!CR.cards.length||CR.state==='none'||CR.state==='building')return;const G2=CR.geo;
  if(!CR.drag&&CR.state==='ready')CR.rot+=(CR.rotT-CR.rot)*Math.min(1,dt*7);
  const fl=L.gy;CR.cards.forEach((g,i)=>{const a=g.userData.a+CR.rot,front=Math.cos(a),x=Math.sin(a)*G2.R,z=front*G2.R-G2.R*.35;
   g.position.set(x,CR.y,z);if(!g.userData.lockRot)g.rotation.set(0,a,0);g.visible=front>-.35;
   const p=g.userData.opening?1:clamp((front-.86)/.14,0,1),e=p*p*(3-2*p),bob=Math.sin(t*2.4)*.03*e;
   g.userData.pop.position.set(0,G2.H*.13*e+bob,.02+G2.W*.42*e);g.userData.pop.scale.setScalar(1+.1*e);g.userData.glow.material.opacity=.85*e;
   const r=CR.refl[i];r.visible=g.visible&&CR.reflOn;r.position.set(x,2*fl-CR.y,z);r.rotation.set(0,g.rotation.y,0);
   r.userData.rp.position.copy(g.userData.pop.position);r.userData.rp.scale.copy(g.userData.pop.scale);r.children.forEach(m=>m.material.opacity=.45*Math.max(0,front))})};

 // drag to browse, tap a side card to bring it forward, tap the front card to open it
 const stg=$('#stage');
 function hitCR(e){const r=stg.getBoundingClientRect();pickRay.setFromCamera({x:(e.clientX-r.left)/r.width*2-1,y:-((e.clientY-r.top)/r.height)*2+1},cam);
  const h=pickRay.intersectObjects(CR.cards.filter(g=>g.visible),true);let o=h.length?h[0].object:null;while(o&&!CR.cards.includes(o))o=o.parent;return o?o.userData.i:-1}
 const perPx=()=>CR.step*1.6/(L.w*.32);
 stg.addEventListener('pointerdown',e=>{if(CR.state!=='ready')return;CR.drag={x:e.clientX,r0:CR.rot,moved:0,lx:e.clientX,v:0,t:performance.now()}});
 stg.addEventListener('pointermove',e=>{const D=CR.drag;if(!D)return;const dx=e.clientX-D.x,now=performance.now();D.moved=Math.max(D.moved,Math.abs(dx));
  D.v=(e.clientX-D.lx)/Math.max(1,now-D.t);D.lx=e.clientX;D.t=now;CR.rot=D.r0+dx*perPx()});
 stg.addEventListener('pointerup',e=>{const D=CR.drag;if(!D)return;CR.drag=null;
  if(D.moved<10){const i=hitCR(e);if(i<0){CR.rotT=Math.round(CR.rot/CR.step)*CR.step;return}
   if(i===frontIdx()){openFront();return}
   const n=CR.ids.length,d=((i-frontIdx()+n/2)%n+n)%n-n/2;CR.rotT=Math.round(CR.rot/CR.step)*CR.step-Math.round(d)*CR.step;return}
  CR.rotT=Math.round((CR.rot+D.v*120*perPx())/CR.step)*CR.step});
 stg.addEventListener('pointercancel',()=>{if(CR.drag){CR.rotT=Math.round(CR.rot/CR.step)*CR.step;CR.drag=null}});
 addEventListener('keydown',e=>{if(CR.state!=='ready')return;if(e.key==='ArrowLeft')CR.rotT+=CR.step;else if(e.key==='ArrowRight')CR.rotT-=CR.step;else if(e.key==='Enter')openFront()});

 // she walks up beside the front card and swipes the ring round; it slows and stops on a random card
 // she stands in front of the front card (between it and the camera), a little right of centre, turned toward it
 // z: in front of the front card AND of its popped-out character (which comes forward by W*.42)
 const frontPos=()=>({x:CR.geo.W*.24,z:CR.geo.R*.65+CR.geo.W*.42+.45});
 function spread(ids,target,onReady,onArrive){if(!cardMats){const iv=setInterval(()=>{if(cardMats){clearInterval(iv);spread(ids,target,onReady,onArrive)}},60);return}
  CR.state='building';CR.onArrive=onArrive;A.act=null;A.hop=-1;seq++;
  buildCarousel(ids).then(()=>{const G2=CR.geo,y1=G2.cy,y0=G2.cy-G2.H*1.1;CR.y=y0;CR.reflOn=false;CR.state='rising';let risen=false,arrived=false;
   tw(600,p=>{CR.y=y0+(y1-y0)*(1-Math.pow(1-p,3))},()=>{CR.reflOn=true;risen=true;go()});
   const fp=frontPos();walkTo(fp.x,fp.z,()=>{arrived=true;go()});
   function go(){if(!risen||!arrived)return;A.yawT=Math.PI+.5;setTimeout(()=>swipe(1,spinIt,()=>{A.mode="watch";A.yawT=Math.PI+.3}),170)}
   function spinIt(){CR.state='spinning';pink.intensity=1;pink.position.set(0,G2.cy,G2.R+1);const n=ids.length,k=target,r0=CR.rot,r1=-(Math.PI*2*2+k*CR.step);
    tw(2600,p=>{CR.rot=r0+(r1-r0)*(1-Math.pow(1-p,3.2))},()=>{CR.rot=CR.rotT=r1;CR.state="ready";pink.intensity=0;onReady&&onReady()})}})}
 // open: she swipes the front card, it turns once and becomes the big hologram card
 function openFront(){if(CR.state!=='ready')return;CR.state='opening';const i=frontIdx(),g=CR.cards[i];seq++;A.act=null;A.hop=-1;
  const doIt=()=>{A.yawT=Math.PI+.5;setTimeout(()=>swipe(1,()=>{g.userData.lockRot=true;g.userData.opening=true;const ry=g.rotation.y;
   tw(700,p=>{g.rotation.y=ry-Math.PI*2*ease(p)},()=>{const cb=CR.onArrive;CR.onArrive=null;cb&&cb(i);A.mode="cheer";A.yawT=0;goHome(450);hideSpread()})},()=>{}),170)};
  const fp=frontPos();if(Math.hypot(fp.x-A.x,fp.z-A.z)<.05&&A.mode!=="walk")doIt();else walkTo(fp.x,fp.z,doIt)}
 function hideSpread(cb){if(CR.state==='none'||!CR.cards.length){CR.state='none';cb&&cb();return}CR.state='leaving';CR.reflOn=false;const y=CR.y,G2=CR.geo;
  tw(500,p=>{CR.y=y-G2.H*1.2*p*p},()=>{clearCarousel();CR.state='none';cb&&cb()})}
 return{layout,tick,swipeCard,spread,hideSpread,pick:()=>openFront(),state:()=>CR.state==='ready'?'ready':CR.state==='none'?'none':'busy'}})();
