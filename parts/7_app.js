// ---------- two decks: เทพ (data in 4_deities.js) and ไพ่ทาโรต์ 78 ใบ (4_major.js / 5_minorA.js / 6_minorB.js) ----------
// The active deck is chosen per page load: ?deck=tarot | ?deck=deity, otherwise the last one used (localStorage), otherwise เทพ.
const DECKS={deity:{name:"ไพ่เทพ",title:"ไพ่เทพกระจกสีโฮโลแกรม"},tarot:{name:"ไพ่ทาโรต์",title:"ไพ่ทาโรต์กระจกสีโฮโลแกรม"}};
const DECK_ID=(()=>{let q=null;try{q=new URLSearchParams(location.search).get("deck")}catch(_){}
 if(!DECKS[q])try{q=localStorage.getItem("arcana_deck")}catch(_){}
 if(!DECKS[q])q="deity";try{localStorage.setItem("arcana_deck",q)}catch(_){}return q})();
function switchDeck(id){try{localStorage.setItem("arcana_deck",id)}catch(_){}const u=new URL(location.href);u.searchParams.set("deck",id);u.hash="";location.href=u.href}
// tarot grades on the same C/R/SR/UR/SP scale as the deities
const TAROT_SP=new Set([0,21]),TAROT_UR=new Set([1,2,3,4,6,10,13,17,18,19]); // SP: Fool, World · UR: Magician, High Priestess, Empress, Emperor, Lovers, Wheel, Death, Star, Moon, Sun
const tarotRar=i=>{if(i<22)return TAROT_SP.has(i)?4:TAROT_UR.has(i)?3:2;const r=(i-22)%14;return r>=12?2:(r===0||r>=10)?1:0}; // Q/K=SR · Ace/Page/Knight=R · 2–10=C
const RANKS=[["ACE","เอซ","I",1],["TWO","สอง","II",2],["THREE","สาม","III",3],["FOUR","สี่","IV",4],["FIVE","ห้า","V",5],["SIX","หก","VI",6],
 ["SEVEN","เจ็ด","VII",7],["EIGHT","แปด","VIII",8],["NINE","เก้า","IX",9],["TEN","สิบ","X",10],["PAGE","เพจ","P",0],["KNIGHT","อัศวิน","Kn",0],["QUEEN","ราชินี","Q",0],["KING","ราชา","K",0]];
const deck=[];
if(DECK_ID==="tarot"){
 MAJOR.forEach(([en,ro,th,theme,sp,F],i)=>deck.push(Object.assign({deck:"tarot",en,roman:ro,th,cat:0,group:"ไพ่ชุดใหญ่",pal:mkPal(theme,sp.fig&&sp.fig.hair),F:F.split("|"),seed:i*7919+13},sp)));
 SUITS.forEach((su,si)=>RANKS.forEach(([ren,rth,ro,n],ri)=>{
  const c={deck:"tarot",en:`${ren} OF ${su.en}`,roman:ro,th:rth+su.th,cat:1+si,group:"ไพ่ชุดเล็ก · "+su.th,F:su.F[ri].split("|"),seed:(22+si*14+ri)*7919+13,em:su.em,top:su.em};
  if(n)c.pips=n;else{const hair=["gold",null,"auburn","brown"][ri-10];c.fig={pose:"hold",hair,crown:ri>=12,helm:ri===11,hold:su.em}}
  c.pal=mkPal(su.theme,c.fig&&c.fig.hair);deck.push(c)}));
 deck.forEach((c,i)=>c.rar=tarotRar(i));
}else DEITIES.forEach(([en,th,cat,theme,sp,bless,F,rar,no])=>deck.push(Object.assign({deck:"deity",en,roman:toRoman(no),th,cat,group:"เทพ · "+CATS[cat].short,bless,rar,pal:mkPal(theme,sp.fig&&sp.fig.hair),F:F.split("|"),seed:no*7919+13},sp)));
// picker groups: [heading, cat]
const DECK_GROUPS=DECK_ID==="tarot"?[["ไพ่ชุดใหญ่ (Major Arcana)",0]].concat(SUITS.map((su,k)=>["ไพ่ชุดเล็ก · "+su.th,1+k])):CATS.map((c,k)=>[c.th,k]);

// ---------- DOM ----------
const stage=$('#stage'),cardEl=$('#card'),floatEl=$('#float'),front=$('#front'),artImg=$('#art'),numEl=$('#numeral'),nameEl=$('#name'),
 fortBox=$('#fortune'),ftext=$('#ftext'),info=$('#info'),hint=$('#hint'),sweep=$('#sweep'),beam=$('#beam'),live=$('#live'),toastEl=$('#toast');
const RM=matchMedia('(prefers-reduced-motion: reduce)');let reduce=RM.matches;
(RM.addEventListener?RM.addEventListener.bind(RM,'change'):RM.addListener.bind(RM))(e=>reduce=e.matches);
const svgURL=s=>'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s);
const cache=new Map();
function faceURL(i){if(!cache.has(i))cache.set(i,svgURL(faceSVG(deck[i])));return cache.get(i)}
$('#backImg').src=svgURL(backSVG());

// twinkling 4-point stars (flash when the light band passes)
const TW=[[22,18],[78,26],[30,58],[70,66],[52,38],[84,78],[16,80]].map(([x,y])=>{const el=document.createElement('i');el.className='tw';
 el.style.left=x+'%';el.style.top=y+'%';$('#twinkles').appendChild(el);return{el,d:x*.6+y*.4}});

let cw=280;
function layout(){const w=stage.clientWidth,h=stage.clientHeight;cw=Math.max(140,Math.min(w*.74,h*.9*.6,380));
 document.documentElement.style.setProperty('--cw',cw+'px');document.documentElement.style.setProperty('--ch',cw*5/3+'px');fitName();fitFortune();if(X3)X3.layout(w,h)}
function fit(el,start,maxW){let fs=start,n=0;el.style.fontSize=fs+'px';while(el.offsetWidth>maxW&&fs>6&&n++<80){fs*=.96;el.style.fontSize=fs+'px'}return fs}
const fitName=()=>fit(nameEl,cw*.05,nameEl.parentNode.clientWidth);
const fitFortune=()=>fit(ftext,Math.min(cw*.06,fortBox.clientHeight/1.75),fortBox.clientWidth);

let cur=2,revealed=false,locked=false,spinning=null,lastText='';const lastF={};
function applyCard(i){cur=i;const c=deck[i];artImg.src=faceURL(i);numEl.textContent=c.roman;nameEl.textContent=c.en;
 info.textContent=(c.deck==="tarot"?(c.roman&&!c.fig||i<22?c.roman+' · ':'')+c.th+' — '+c.group:c.roman+' · '+c.th+' — '+c.bless);cardEl.setAttribute('aria-label',`ไพ่ ${c.th} (${c.en}) แตะเพื่อเปิดคำทำนาย`);fitName()}
function pickF(i){const F=deck[i].F;let k,n=0;do{k=Math.floor(Math.random()*F.length)}while(n++<50&&(k===lastF[i]||F[k]===lastText));lastF[i]=k;lastText=F[k];return F[k]}
function setHint(){hint.textContent=!revealed?'แตะไพ่เพื่อเปิดคำทำนาย':(locked||useSpread())&&!locked?'แตะไพ่ = คำทำนายใหม่ · 🔮 = จั่วใบใหม่ (ใบนี้เข้ากอง)':locked?'แตะอีกครั้ง เพื่อรับคำทำนายใหม่จากไพ่ใบนี้':'แตะอีกครั้ง เพื่อสุ่มไพ่ใบใหม่จากสำรับ'}
const fire=el=>{el.classList.remove('go');void el.offsetWidth;el.classList.add('go')};
function showFortune(t){fortBox.classList.add('lit');ftext.textContent=t;fitFortune();ftext.classList.remove('show');void ftext.offsetWidth;ftext.classList.add('show');live.textContent=deck[cur].th+': '+t}

let holo=.25,holoT=.25,spinDeg=0,lastInteract=0,lastPulse=0;
function tap(){if(spinning||busy||CINE.active())return;lastInteract=performance.now();let next=cur;
 if(revealed&&!locked&&!useSpread()){do{next=Math.floor(Math.random()*deck.length)}while(next===cur)}
 const o={to:next,text:pickF(next),reveal:true};
 // 3D: น้องหวานจิบิ walks over and swipes the card; the card spins at the moment her hand hits it
 if(X3){busy=true;hint.innerHTML="น้องหวานกำลังไปปัดไพ่<span class=\"dots\"></span>";X3.swipeCard(()=>{busy=false;startSpin(o)});return}
 startSpin(o)}
function startSpin(o){FX.clearAura();ftext.classList.remove("show");fortBox.classList.remove('lit');const pre=new Image();pre.src=faceURL(o.to);floatEl.classList.remove('idle');
 if(!o.reveal)holoT=.25;
 spin(0,360,1150,()=>applyCard(o.to),()=>finish(o))}
function spin(from,to,dur,onMid,done){spinning={t0:performance.now(),dur,from,to,onMid,done,mid:false}}

// ---------- shuffle button: flip to back -> riffle the deck -> spin-reveal a random card ----------
// ---------- rainbow-arc spinner: card backs on a big circle whose centre sits below, so only the upper half (a rainbow) shows ----------
let busy=false;const arcfx=$('#arcfx'),ringEl=$('#ring'),arcPtr=$('#arcPtr'),shBtn=$('#shuffleBtn');
function arcGeom(){const w=stage.clientWidth,h=stage.clientHeight,ch=cw*5/3,rw=clamp(cw*.3,46,92),rh=rw*5/3;
 const pv=Math.min(h-10,h/2+ch*.42),R=Math.max(60,Math.min(w*.42,pv-rh*.5-30,360));return{w,pv,R,rw,rh}}
function arcSpin(done){const w=stage.clientWidth,h=stage.clientHeight,ch=cw*5/3,rw=clamp(cw*.3,46,92),rh=rw*5/3;
 const pv=Math.min(h-8,h/2+ch*.3),R=Math.max(60,Math.min(w*.42,pv-rh*.5-26,360)),N=clamp(Math.round(Math.PI*2*R/(rw*.98)),14,44),step=360/N;
 Object.entries({'--pv':pv+'px','--R':R,'--rw':rw+'px','--rh':rh+'px'}).forEach(([k,v])=>arcfx.style.setProperty(k,v));
 arcPtr.style.top=(pv-R-rh/2-22)+'px';
 const back=$('#backImg').src;let html='';for(let i=0;i<N;i++)html+=`<div class="rc" style="--a:${i*step}"><img alt="" src="${back}"></div>`;ringEl.innerHTML=html;
 const cards=[...ringEl.children],k=Math.floor(Math.random()*N),end=360*3+((360-k*step)%360),dur=3600,t0=performance.now();let lastTop=-1;
 ringEl.style.transform='rotate(0deg)';arcfx.classList.add('on');
 (function step2(now){const p=clamp((now-t0)/dur,0,1),e=p<.08?.04*Math.pow(p/.08,2):.04+.96*(1-Math.pow((1-p)/.92,3.4)),phi=end*clamp(e,0,1);
  ringEl.style.transform=`rotate(${phi.toFixed(2)}deg)`;
  const top=((Math.round(-phi/step)%N)+N)%N;if(top!==lastTop){if(lastTop>=0)cards[lastTop].classList.remove('top');cards[top].classList.add('top');lastTop=top}
  if(p<1)requestAnimationFrame(step2);else{cards[top].classList.add('chosen');setTimeout(()=>{arcfx.classList.remove('on');done()},650)}})(t0)}
// ---------- the reading spread (3D): the shuffled deck face-down in an arc; น้องหวาน swipes it open and you pick a card ----------
const useSpread=()=>!!X3;let order=[],bag=[];const deckLeft=$("#deckLeft");
const showCardEl=()=>{cardEl.style.transition='none';cardEl.style.visibility='';cardEl.style.opacity='1';requestAnimationFrame(()=>cardEl.style.transition='')};
function deal(){FX.clearAura();const end=()=>{busy=false;shBtn.disabled=false;shBtn.classList.remove('busy');stage.classList.remove('shuffling')};
 // draw from the WHOLE deck like a real one: every one of the cards comes up once before the deck is reshuffled
 const shuf=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
 if(!bag.length){if(pileHist&&pileHist.length){pileHist.length=0;renderPile();toast(`🔄 เก็บไพ่ทั้ง ${deck.length} ใบกลับเข้าสำรับ แล้วสับใหม่`)}bag=shuf(deck.map((_,i)=>i));if(bag[bag.length-1]===cur&&bag.length>1)[bag[0],bag[bag.length-1]]=[bag[bag.length-1],bag[0]]}
 const win=bag.pop(),others=shuf(deck.map((_,i)=>i).filter(i=>i!==win));
 // only a handful of cards go on the carousel (not the whole deck)
 const n=stage.clientWidth<600?7:9,ids=others.slice(0,n-1),k=Math.floor(Math.random()*n);ids.splice(k,0,win);
 deckLeft.textContent=`🃏 เหลือในสำรับ ${bag.length}/${deck.length} ใบ`;
 cardEl.style.opacity='0';cardEl.style.visibility='hidden';hint.innerHTML='น้องหวานกำลังหมุนวงไพ่<span class="dots"></span>';
 // item 12: when the ring stops, open the chosen card straight away (no extra tap)
 X3.spread(ids,k,()=>{hint.innerHTML='น้องหวานกำลังเปิดไพ่<span class="dots"></span>';
   setTimeout(()=>X3.pick(),300)},
  slot=>{busy=true;locked=false;spinning=null;spinDeg=0;const idx=ids[slot],o={to:idx,text:pickF(idx),reveal:true,big:true};applyCard(idx);showCardEl();
   finish(o);end()})}
function shuffle(initial){if(spinning||busy||CINE.active())return;lastInteract=performance.now();
 if(useSpread()){if(X3.state()==='ready'){X3.hideSpread(deal);return}if(X3.state()!=='none')return;
  busy=true;locked=false;shBtn.disabled=true;shBtn.classList.add('busy');
  if(initial===true||cardEl.style.visibility==='hidden'){deal();return}
  stage.classList.add('shuffling');ftext.classList.remove('show');fortBox.classList.remove('lit');holoT=.25;floatEl.classList.remove('idle');
  collect(deal);return} // the open card flies into the drawn pile, then the next round starts
 busy=true;locked=false;
 let next;do{next=Math.floor(Math.random()*deck.length)}while(next===cur);const o={to:next,text:pickF(next),reveal:true};
 const end=()=>{busy=false;shBtn.disabled=false;shBtn.classList.remove('busy');stage.classList.remove('shuffling')};
 shBtn.disabled=true;shBtn.classList.add('busy');hint.innerHTML='กำลังสุ่มไพ่<span class="dots"></span>';
 if(reduce){startSpin(o);setTimeout(end,500);return}
 stage.classList.add('shuffling');ftext.classList.remove('show');fortBox.classList.remove('lit');holoT=.25;floatEl.classList.remove('idle');
 let hideT=0;
 const reveal=()=>{clearTimeout(hideT);applyCard(o.to);cardEl.style.transition='none';cardEl.style.visibility='';cardEl.style.opacity='1';
  requestAnimationFrame(()=>cardEl.style.transition='');spin(180,720,1400,null,()=>{finish(o);end()})};
 // fallback without WebGL: the 2D rainbow arc spinner
 spin(0,180,420,null,()=>{cardEl.style.opacity='0';hideT=setTimeout(()=>cardEl.style.visibility='hidden',320);arcSpin(reveal)})}
shBtn.addEventListener('click',()=>shuffle());
function revealNow(o){revealed=true;holoT=1;lastPulse=performance.now();fire(sweep);fire(beam);FX.celebrate(!!o.big);FX.aura(deck[o.to],!!o.big);setTimeout(()=>showFortune(o.text),240)}
function finish(o){if(o.reveal){
  // UR / SP: a full-screen scene of its own plays first; the card appears at its climax (tap anywhere to skip ahead)
  if(deck[o.to].rar>=3){cardEl.style.transition='none';cardEl.style.opacity='0';hint.innerHTML='✦ กำลังจุติ<span class="dots"></span> ✦';
   const ok=CINE.play(deck[o.to],()=>{showCardEl();revealNow(o)},()=>setHint());if(ok)return;showCardEl()}
  revealNow(o)}
 else{revealed=false;floatEl.classList.add('idle')}setHint()}

// ---------- pointer / keyboard ----------
const ptr={on:false,x:.5,y:.5};let down=null;
function setPtr(e){const r=cardEl.getBoundingClientRect();ptr.x=clamp((e.clientX-r.left)/r.width,0,1);ptr.y=clamp((e.clientY-r.top)/r.height,0,1);ptr.on=true;lastInteract=performance.now()}
cardEl.addEventListener('pointermove',setPtr);
cardEl.addEventListener('pointerdown',e=>{setPtr(e);down={x:e.clientX,y:e.clientY,t:performance.now()};try{cardEl.setPointerCapture(e.pointerId)}catch(_){}});
cardEl.addEventListener('pointerup',e=>{if(down&&Math.hypot(e.clientX-down.x,e.clientY-down.y)<14&&performance.now()-down.t<700)tap();down=null;if(e.pointerType!=='mouse')ptr.on=false});
cardEl.addEventListener('pointercancel',()=>{down=null;ptr.on=false});
cardEl.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse')ptr.on=false});
cardEl.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();tap()}});

// ---------- device tilt ----------
const gyro={on:false,rx:0,ry:0,t:0,base:null};
function toast(m){toastEl.textContent=m;toastEl.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>toastEl.classList.remove('on'),2600)}



// ---------- main loop ----------
const R={x:0,y:0};
function frame(now){requestAnimationFrame(frame);let tx=0,ty=0;const t=now/1000;
 if(ptr.on){ty=(ptr.x-.5)*32;tx=-(ptr.y-.5)*28}
 else if(gyro.on&&now-gyro.t<1500){tx=gyro.rx;ty=gyro.ry}
 else if(!reduce){if(revealed&&now-lastInteract>1400){tx=Math.sin(t*.9)*9;ty=Math.cos(t*.69)*14}else if(!revealed){tx=Math.sin(t*.7)*2;ty=Math.cos(t*.5)*3}}
 const k=ptr.on?.16:.06;R.x+=(tx-R.x)*k;R.y+=(ty-R.y)*k;holo+=(holoT-holo)*.045;
 if(spinning&&!spinning.reduce){const S=spinning,p=clamp((now-S.t0)/S.dur,0,1),e=p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2;spinDeg=S.from+(S.to-S.from)*e;
  if(S.onMid&&!S.mid&&spinDeg>=S.from+180){S.mid=true;S.onMid()}
  if(p>=1){spinDeg=S.to%360;spinning=null;S.done&&S.done()}}
 const px=clamp(50+R.y/16*50,0,100),py=clamp(50-R.x/14*50,0,100),bp=50+(px-50)*1.6+(py-50)*.8,st=stage.style;
 st.setProperty('--rx',R.x.toFixed(2));st.setProperty('--ry',R.y.toFixed(2));st.setProperty('--px',px.toFixed(1));st.setProperty('--py',py.toFixed(1));
 st.setProperty('--bp',bp.toFixed(1));st.setProperty('--holo',holo.toFixed(3));st.setProperty('--spin',spinDeg.toFixed(2));
 for(const s of TW){const kk=clamp(1-Math.abs(bp-s.d)/9,0,1)*(.2+holo*.8);s.el.style.opacity=kk.toFixed(2);
  s.el.style.transform=`translate(-50%,-50%) scale(${(.3+kk*.9).toFixed(2)}) rotate(${(kk*40).toFixed(1)}deg)`}
 drawDust(now);if(X3)X3.tick(now);
 // item 14: every 5 s the open card shows off (only while nothing else is happening)
 if(revealed&&!spinning&&!busy&&(!X3||X3.state()==="none")&&now-lastPulse>5000){lastPulse=now;FX.pulse(deck[cur])}}

buildXmas();applyCard(cur);setHint();layout();initDust();
addEventListener("resize",()=>{buildXmas();layout();initDust()});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{fitName();fitFortune()});
requestAnimationFrame(frame);

// dev checks: #reveal auto-opens, #test measures every fortune/name fit
{const m=location.hash.match(/card=(\d+)/);if(m&&deck[+m[1]]){applyCard(+m[1]);locked=true}}
if(location.hash.includes('reveal'))setTimeout(tap,300);
if(location.hash.includes('shuffle'))setTimeout(shuffle,300);
// open with the face-down spread (the old single-card start stays for the #test / #card= / #reveal checks)
if(useSpread()&&!/test|card=|reveal|shuffle/.test(location.hash))shuffle(true);
if(location.hash.includes('test'))(document.fonts?document.fonts.ready:Promise.resolve()).then(()=>{
 let min=99,minT='',over=0,nmin=99,nT='';const W=fortBox.clientWidth,H=fortBox.clientHeight;
 for(const c of deck)for(const f of c.F){ftext.textContent=f;const fs=fitFortune();if(ftext.offsetWidth>W||ftext.offsetHeight>H*1.25)over++;if(fs/cw<min){min=fs/cw;minT=f}}
 for(const c of deck){nameEl.textContent=c.en;const fs=fitName();if(fs/cw<nmin){nmin=fs/cw;nT=c.en}}
 let err='';try{deck.forEach((c,i)=>faceSVG(c))}catch(e){err=String(e)}
 document.body.setAttribute('data-test',JSON.stringify({cards:deck.length,fortunes:deck.reduce((a,c)=>a+c.F.length,0),minFortunePx:+(min*300).toFixed(1),minT,over,minNamePx:+(nmin*300).toFixed(1),nT,err,fonts:document.fonts?document.fonts.check('16px Sriracha'):null}));
 applyCard(cur)});
// ---------- drawn pile: every drawn card is collected into a pile (bottom-left) that you can browse ----------
var pileEl=$('#pile'),histEl=$('#hist'),pileHist=[]; // var: deal() may run before this line on first load
function renderPile(){const n=pileHist.length;pileEl.classList.toggle('empty',!n);
 pileEl.querySelector('.pile-stack').innerHTML=pileHist.slice(-4).map((h,i)=>`<img src="${faceURL(h.idx)}" alt="" style="--i:${i};--r:${(h.idx*37)%13-6}deg">`).join('');
 pileEl.querySelector('.pile-n').textContent=n;pileEl.setAttribute('aria-label',`กองไพ่ที่สุ่มแล้ว ${n} ใบ แตะเพื่อดู`)}
function collect(done){if(!revealed||cardEl.style.visibility==='hidden'){done();return}
 const r=cardEl.getBoundingClientRect(),p=pileEl.getBoundingClientRect(),fly=document.createElement('img');
 fly.src=faceURL(cur);fly.className='pile-fly';fly.style.cssText=`left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px`;document.body.appendChild(fly);
 pileHist.push({idx:cur,text:ftext.textContent});FX.clearAura();ftext.classList.remove('show');fortBox.classList.remove('lit');
 cardEl.style.transition='none';cardEl.style.opacity='0';cardEl.style.visibility='hidden';revealed=false;
 requestAnimationFrame(()=>requestAnimationFrame(()=>{fly.style.transform=`translate(${p.left+p.width/2-(r.left+r.width/2)}px,${p.top+p.height/2-(r.top+r.height/2)}px) scale(${p.width/r.width}) rotate(-14deg)`}));
 setTimeout(()=>{fly.remove();renderPile();pileEl.classList.remove('bump');void pileEl.offsetWidth;pileEl.classList.add('bump');done()},720)}
pileEl.addEventListener('click',()=>{if(!pileHist.length)return;
 histEl.querySelector('.hist-h b').textContent=`ไพ่ที่สุ่มแล้ว ${pileHist.length} / ${deck.length} ใบ`;
 histEl.querySelector('.hist-list').innerHTML=pileHist.slice().reverse().map((h,k)=>{const c=deck[h.idx];
  return`<div class="hist-item"><img src="${faceURL(h.idx)}" alt=""><div><b>${pileHist.length-k}. ${c.th}</b><small>${c.en}</small><p>${h.text}</p></div></div>`}).join('');
 histEl.hidden=false});
histEl.addEventListener('click',e=>{if(e.target===histEl||e.target.closest('.hist-close'))histEl.hidden=true});
renderPile();
if(location.hash.includes('again'))setTimeout(()=>shuffle(),9000);
if(location.hash.includes('histopen'))setTimeout(()=>pileEl.click(),11000); // test hook // test hook: second draw -> first card goes to the pile
