
 // ===== continues the X3 closure: swap the cartoon chibi for the realistic 3D scan of หวาน (img/wan_fullbody.glb) =====
 // The scan has no skeleton, so it is auto-rigged here: 7 bones, each vertex weighted by height/side (soft blends at joints).
 // The existing action system keeps driving the chibi joints; update() copies those rotations onto the scan's bones.
 // #chibi in the URL keeps the old cartoon model.
 const SCAN=(()=>{if(typeof WAN_GLB==='undefined'||!location.hash.includes('scan'))return null; // scan is opt-in (#scan, and build with SCAN=1)
  try{
   const bin=Uint8Array.from(atob(WAN_GLB),c=>c.charCodeAt(0)),dv=new DataView(bin.buffer),jl=dv.getUint32(12,true);
   const json=JSON.parse(new TextDecoder().decode(bin.subarray(20,20+jl))),bo=20+jl+8;
   const acc=i=>{const a=json.accessors[i],bv=json.bufferViews[a.bufferView],T={5126:Float32Array,5121:Uint8Array,5123:Uint16Array,5125:Uint32Array}[a.componentType],
    n={SCALAR:1,VEC3:3,VEC4:4}[a.type]*a.count,off=bo+(bv.byteOffset||0)+(a.byteOffset||0);return new T(bin.buffer.slice(off,off+n*T.BYTES_PER_ELEMENT))};
   const pr=json.meshes[0].primitives[0],pos=acc(pr.attributes.POSITION),col=acc(pr.attributes.COLOR_0),idx=acc(pr.indices),n=pos.length/3,cs=col.length/n;
   let mnx=1e9,mxx=-1e9,mny=1e9,mxy=-1e9,mnz=1e9,mxz=-1e9;
   for(let i=0;i<n;i++){const x=pos[i*3],y=pos[i*3+1],z=pos[i*3+2];mnx=Math.min(mnx,x);mxx=Math.max(mxx,x);mny=Math.min(mny,y);mxy=Math.max(mxy,y);mnz=Math.min(mnz,z);mxz=Math.max(mxz,z)}
   const HT=3.4,s=HT/(mxy-mny),cx=(mnx+mxx)/2,cz=(mnz+mxz)/2,FR=SCAN_FRONT;
   const ss=(a,b,x)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t)};
   const P=new Float32Array(n*3),C=new Float32Array(n*3),SI=new Uint16Array(n*4),SW=new Float32Array(n*4),w=new Float32Array(7);
   for(let i=0;i<n;i++){const x=(pos[i*3]-cx)*s*FR,y=(pos[i*3+1]-mny)*s,z=(pos[i*3+2]-cz)*s*FR,h=y/HT,ax=Math.abs(x)/HT;
    P[i*3]=x;P[i*3+1]=y;P[i*3+2]=z;for(let k=0;k<3;k++)C[i*3+k]=Math.pow(col[i*cs+k]/255,2.2);
    w.fill(0);const legT=1-ss(.43,.50,h);w[x>=0?5:6]+=legT;let up=1-legT;
    const hd=ss(.80,.85,h)*up;w[2]+=hd;up-=hd;
    const aw=up*ss(.070,.092,ax)*ss(.36,.44,h)*(1-ss(.77,.82,h));w[x>=0?3:4]+=aw;up-=aw;
    const sp=ss(.55,.66,h);w[1]+=up*sp;w[0]+=up*(1-sp);
    const ord=[0,1,2,3,4,5,6].sort((a,b)=>w[b]-w[a]).slice(0,4);let tot=0;ord.forEach(b=>tot+=w[b]);
    ord.forEach((b,k)=>{SI[i*4+k]=b;SW[i*4+k]=w[b]/(tot||1)})}
   const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(P,3));geo.setAttribute('color',new THREE.BufferAttribute(C,3));
   geo.setAttribute('skinIndex',new THREE.Uint16BufferAttribute(SI,4));geo.setAttribute('skinWeight',new THREE.BufferAttribute(SW,4));
   geo.setIndex(new THREE.BufferAttribute(idx,1));geo.computeVertexNormals();
   // bones (positions relative to parent), same layout as the chibi joints
   const mkB=(x,y,z,par)=>{const b=new THREE.Bone();b.position.set(x*HT,y*HT,z*HT);b.rotation.order='YXZ';if(par)par.add(b);return b};
   const hips=mkB(0,.50,0),spine=mkB(0,.12,0,hips),hd=mkB(0,.20,0,spine),armL=mkB(.10,.18,0,spine),armR=mkB(-.10,.18,0,spine),legL=mkB(.045,-.01,0,hips),legR=mkB(-.045,-.01,0,hips);
   const bones=[hips,spine,hd,armL,armR,legL,legR];
   const mesh=new THREE.SkinnedMesh(geo,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.85,metalness:0}));
   mesh.add(hips);mesh.bind(new THREE.Skeleton(bones));mesh.castShadow=true;mesh.frustumCulled=false;root.add(mesh);
   body.visible=false;armL.add(handBall);handBall.position.set(0,-.38*HT,.02*HT); // snowball sits in her right hand (+x side)
   pickables.length=0;pickables.push(mesh);tag.textContent='✨ น้องหวาน ✨';
   return{update(){armL.rotation.copy(arms[1].rotation);armR.rotation.copy(arms[0].rotation);legL.rotation.x=legs[1].rotation.x;legR.rotation.x=legs[0].rotation.x;
    hd.rotation.set(head.rotation.x,head.rotation.y,0);spine.rotation.set(body.rotation.x*.8,body.rotation.y,0);hips.position.y=.50*HT+body.position.y}}
  }catch(e){console.warn('scan model failed, using chibi',e);return null}})();
