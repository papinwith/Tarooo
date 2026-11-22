
 // ===== continues the X3 closure (after 6d_three.js): make the chibi prettier =====
 // softer 4-step toon shading, warmer chestnut hair, pink rim light
 // smooth shading: the toon ramp is sampled with linear filtering, so light blends softly instead of hard bands
 gm.image={data:new Uint8Array([105,150,195,228,250]),width:5,height:1};gm.minFilter=gm.magFilter=THREE.LinearFilter;gm.needsUpdate=true;
 mHair.color.setHex(0x5a2c18);mHair2.color.setHex(0x70391f);mSkin.color.setHex(0xffcfb8);
 const rimP=new THREE.DirectionalLight(0xffb8e8,.7);rimP.position.set(-3,4,-6);scene.add(rimP);
 const nm=o=>Object.assign({outline:false,shadow:false},o||{});

 // anime eyes painted on a canvas: brow, gradient iris, pupil, sparkles, thick upper lash with a little wing
 const eyeTex=(()=>{const c=document.createElement('canvas');c.width=128;c.height=192;const g=c.getContext('2d');
  g.strokeStyle='#4a2414';g.lineWidth=6;g.lineCap='round';g.beginPath();g.moveTo(26,24);g.quadraticCurveTo(64,12,106,34);g.stroke();
  g.save();g.beginPath();g.ellipse(64,120,46,52,0,0,6.283);g.clip();
  g.fillStyle='#fffaf6';g.fillRect(0,60,128,132);
  const ir=g.createLinearGradient(0,70,0,172);ir.addColorStop(0,'#24100a');ir.addColorStop(.45,'#6e341a');ir.addColorStop(.8,'#c27a40');ir.addColorStop(1,'#f0c080');
  g.fillStyle=ir;g.beginPath();g.ellipse(64,122,36,48,0,0,6.283);g.fill();
  g.strokeStyle='#24100a';g.lineWidth=4;g.stroke();
  g.fillStyle='#160806';g.beginPath();g.ellipse(64,116,15,21,0,0,6.283);g.fill();
  g.fillStyle='#ffffff';g.beginPath();g.ellipse(48,98,12,15,-.35,0,6.283);g.fill();g.beginPath();g.arc(82,146,6,0,6.283);g.fill();
  g.fillStyle='rgba(255,230,190,.8)';g.beginPath();g.arc(72,158,3.5,0,6.283);g.fill();g.restore();
  g.fillStyle='#1c0c08';g.beginPath();g.moveTo(12,96);g.quadraticCurveTo(60,42,112,72);g.lineTo(126,60);g.lineTo(118,84);g.quadraticCurveTo(62,60,18,104);g.closePath();g.fill();
  g.strokeStyle='rgba(70,30,20,.55)';g.lineWidth=3;g.beginPath();g.moveTo(42,168);g.quadraticCurveTo(66,176,92,166);g.stroke();
  const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.anisotropy=4;return t})();
 head.children.filter(m=>m.material===mEye).forEach(m=>m.visible=false);
 const mEyeP=new THREE.MeshBasicMaterial({map:eyeTex,transparent:true,side:THREE.DoubleSide,depthWrite:false});
 for(const s of[-1,1]){const e=mk(new THREE.PlaneGeometry(.25,.375),mEyeP,head,[s*.2,HC[1]-.02,.49],nm({rot:[-.08,s*.4,0]}));e.scale.x=-s;e.renderOrder=2}
 mk(S(.012,8,6),new THREE.MeshBasicMaterial({color:0xe8a890}),head,[0,HC[1]-.09,.505],nm());                        // tiny nose
 for(const s of[-1,1])for(let k=0;k<3;k++)mk(new THREE.PlaneGeometry(.008,.04),mLip,head,[s*(.27+k*.035),HC[1]-.11,.45-k*.02],nm({rot:[0,s*.55,.35*s]})); // blush lines

 // hair: shine ring, side locks framing the face
 for(const s of[-1,1]){const pts=[new V(s*.33,HC[1]+.28,.33),new V(s*.40,HC[1]+.02,.33),new V(s*.42,HC[1]-.25,.27),new V(s*.38,HC[1]-.48,.22)];
  mk(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),40,.075,16,false),mHair2,head,[0,0,0],{ow:.008})}

 // dress: Peter-Pan collar + red neck bow, red ribbon around the skirt, gold sparkles, big red bow at the back
 for(const s of[-1,1])mk(S(.11),mWhite,body,[s*.085,2.47,.13],{scale:[1,.32,.85],rot:[0,0,-s*.3]});
 const bow=(x,y,z,k,ry)=>{const g=G();g.position.set(x,y,z);g.rotation.y=ry||0;g.scale.setScalar(k);body.add(g);
  for(const s of[-1,1]){mk(S(.08),mRed,g,[s*.085,0,0],{scale:[1.3,.85,.5],rot:[0,0,s*.25]});mk(new THREE.BoxGeometry(.035,.13,.02),mRed,g,[s*.04,-.1,0],{rot:[0,0,s*.35]})}
  mk(S(.035),mRed,g,[0,0,.02]);return g};
 bow(0,2.44,.19,.85);bow(0,2.04,-.2,1.5,Math.PI);
 mk(new THREE.TorusGeometry(.6,.022,8,72),mRed,body,[0,1.12,0],{rot:[Math.PI/2,0,0],scale:[1,DZ,1],outline:false});
 const mSpark=toon(0xffd35a,{emissive:0x6a4a00});
 const rAt=y=>{for(let i=1;i<dressPts.length;i++){const a=dressPts[i-1],b=dressPts[i];if((y-a.y)*(y-b.y)<=0)return a.x+(b.x-a.x)*(y-a.y)/((b.y-a.y)||1)}return .3};
 for(let i=0;i<16;i++){const a=i*2.39996,y=1.22+(i%4)*.15,r=rAt(y)+.012;mk(new THREE.OctahedronGeometry(.03),mSpark,body,[Math.sin(a)*r,y,Math.cos(a)*r*DZ],nm({rot:[0,a,.6]}))}

 // white socks + Mary-Jane straps
 legs.forEach(p=>{mk(new THREE.CapsuleGeometry(.074,.12,8,16),mWhite,p,[0,-1.3,0],{ow:.008});mk(new THREE.TorusGeometry(.075,.014,6,20,Math.PI),mRed,p,[0,-1.4,.07],nm({rot:[0,Math.PI/2,0]}))});

 // holly on the hat brim
 const mHolly=toon(0x2f9a55);
 for(const s of[-1,1])mk(S(.1),mHolly,hat,[.3+s*.07,.05,.36],{scale:[1,.18,.42],rot:[0,s*.7,0]});
 for(let k=0;k<3;k++)mk(S(.045),mRed,hat,[.3+(k-1)*.045,.1+(k%2)*.03,.4]);
