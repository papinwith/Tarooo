
// =====================================================================================================
// item 18: TCG model — 5 grades C/R/SR/UR/SP (SR and above are foil), random 5-card packs 49฿, Box, Box set,
//          singles in a shop display case priced at the per-card pack price +10% compounded per tier.
// item 20: the card picker is back.
// item 19: window.exportCardJPG(i, 'front'|'back') renders print-ready JPGs (used by tools/export_cards.cjs).
// Everything here is a simulation (no real payment); the collection is kept in this browser only.
// =====================================================================================================
const RAR=[{k:'C',th:'ธรรมดา',star:'●',col:'#d7dcea'},{k:'R',th:'หายาก',star:'◆',col:'#5fb4ff'},
 {k:'SR',th:'หายากมาก',star:'★',col:'#b58cff',foil:1},{k:'UR',th:'หายากสุดๆ',star:'★★',col:'#ffd35a',foil:1},{k:'SP',th:'พิเศษ',star:'✦',col:'#ff6fd8',foil:1}];
// rarity is set per deity in 4_deities.js
const TIER=[0,1,2,3,4].map(t=>deck.map((_,i)=>i).filter(i=>deck[i].rar===t));
const PACK_PRICE=49,PACK_SIZE=5,PER_CARD=PACK_PRICE/PACK_SIZE,BOX_PACKS=20;
const exactPrice=t=>PER_CARD*Math.pow(1.1,t+1);        // 9.80 × 1.1^(tier+1): +10% compounded per rarity step
const priceOf=t=>Math.ceil(exactPrice(t));              // shelf price rounded up to whole baht
const SET_PRICE=deck.reduce((a,c)=>a+priceOf(c.rar),0);
const baht=n=>n.toLocaleString('th-TH')+'฿';
const thumb=(i,extra='')=>{const t=deck[i].rar,R=RAR[t];return`<div class="tc r${t}" title="${deck[i].th} · ${R.th}"><img src="${faceURL(i)}" alt="${deck[i].th}" loading="lazy"><span class="rb">${R.star} ${R.k}</span>${extra}</div>`};

// ---------- collection (per-viewer, this browser only) ----------
let COL={own:{},spent:0};
try{const s=JSON.parse(localStorage.getItem('arcana_col')||'null');if(s&&s.own)COL=s}catch(_){}
const saveCol=()=>{try{localStorage.setItem('arcana_col',JSON.stringify(COL))}catch(_){}};
const ownedKinds=()=>Object.keys(COL.own).filter(k=>COL.own[k]>0).length;
function addCards(ids,cost){const fresh=new Set();ids.forEach(i=>{if(!COL.own[i])fresh.add(i);COL.own[i]=(COL.own[i]||0)+1});COL.spent+=cost;saveCol();updSpent();return fresh}

// ---------- grade on the big card: badge + foil that gets stronger with each grade ----------
const cbadge=document.createElement('div');cbadge.className='cbadge';front.appendChild(cbadge);
const _applyCard=applyCard;
applyCard=function(i){_applyCard(i);const R=RAR[deck[i].rar];info.textContent+=` · ${R.star} ${R.th}`;
 cbadge.textContent=`${R.star} ${R.k}`;cbadge.style.color=R.col;['r','sr','ur','sp'].forEach((n,k)=>front.classList.toggle('foil-'+n,deck[i].rar===k+1))};
applyCard(cur);

// ---------- overlays ----------
function overlay(id,title){const o=document.createElement('div');o.className='ovl';o.id=id;o.hidden=true;
 o.innerHTML=`<div class="ovl-box"><div class="ovl-h"><b>${title}</b><span class="ovl-sub"></span><button type="button" class="ovl-x">✕ ปิด</button></div><div class="ovl-tabs"></div><div class="ovl-body"></div></div>`;
 document.body.appendChild(o);o.addEventListener('click',e=>{if(e.target===o||e.target.closest('.ovl-x'))o.hidden=true});return o}
const btns=document.querySelector('.btns');
const mkBtn=(txt,fn)=>{const b=document.createElement('button');b.type='button';b.innerHTML=txt;b.addEventListener('click',fn);btns.appendChild(b);return b};

// ---------- item 20: pick any card ----------
const pk=overlay('pickOv','🃏 เลือกไพ่ที่อยากเปิด');
function openPicker(){const groups=CATS.map((c,k)=>[c.th,deck.map((_,i)=>i).filter(i=>deck[i].cat===k)]).filter(g=>g[1].length);
 pk.querySelector('.ovl-sub').textContent='แตะไพ่ 1 ใบ';
 pk.querySelector('.ovl-body').innerHTML=groups.map(([t,ids])=>`<h3>${t}</h3><div class="tgrid">${ids.map(i=>`<button type="button" class="tbtn" data-i="${i}">${thumb(i)}<span class="tn">${deck[i].th}</span></button>`).join('')}</div>`).join('');
 pk.hidden=false}
pk.querySelector('.ovl-body').addEventListener('click',e=>{const b=e.target.closest('.tbtn');if(!b)return;pk.hidden=true;pickCard(+b.dataset.i)});
function pickCard(i){if(busy||spinning||(X3&&X3.state()!=='none'&&X3.state()!=='ready')){toast('รอให้เปิดไพ่ใบนี้เสร็จก่อนนะ');return}
 const go=()=>{const k=bag.indexOf(i);if(k>=0)bag.splice(k,1);deckLeft.textContent=`🃏 เหลือในสำรับ ${bag.length}/${deck.length} ใบ`;busy=true;
  collect(()=>{applyCard(i);showCardEl();finish({to:i,text:pickF(i),reveal:true,big:true});busy=false})};
 if(X3&&X3.state()==='ready')X3.hideSpread(go);else go()}
mkBtn('🃏 เลือกไพ่',openPicker);

// ---------- item 18: the shop ----------
const sh=overlay('shopOv','🛍️ ร้านการ์ด ARCANA');
const TABS=[['pack','🎁 ซองสุ่ม'],['box','📦 Box'],['set','🗃️ Box set'],['single','🏪 ตู้โชว์ปลีก'],['col','📚 คอลเลกชัน']];
sh.querySelector('.ovl-tabs').innerHTML=TABS.map(([k,t])=>`<button type="button" data-tab="${k}">${t}</button>`).join('');
const shBody=sh.querySelector('.ovl-body');let tab='pack',filt=-1;
function updSpent(){sh.querySelector('.ovl-sub').textContent=`ยอดซื้อจำลอง ${baht(COL.spent)} · สะสม ${ownedKinds()}/${deck.length}`}
const rarTable=()=>`<table class="rtab"><tr><th>ระดับ</th><th>ไพ่</th><th>จำนวน</th><th>ราคาปลีก/ใบ</th></tr>${RAR.map((R,t)=>`<tr>
 <td><span class="chip r${t}">${R.star} ${R.k}</span> ${R.th}${R.foil?' · ฟอยล์':''}</td><td>${['เทพองค์รอง','เทพที่คนรู้จัก','เทพเด่น','เทพผู้ยิ่งใหญ่','ที่สุดของหมวด'][t]}</td>
 <td>${TIER[t].length}</td><td><b>${baht(priceOf(t))}</b> <small>(${exactPrice(t).toFixed(2)})</small></td></tr>`).join('')}</table>
 <p class="note">เกรดจัดตามความดังของแต่ละองค์ — ทุกหมวด (ความมั่งคั่ง · สติปัญญา · ความรัก · แสงสว่าง · ความกล้าหาญ · สุขภาพ) มีครบ C / R / SR / UR / SP</p>
 <p class="note">ราคาหน้าซองต่อใบ = 49 ÷ 5 = 9.80฿ · ราคาปลีก = 9.80 × 1.1 ยกกำลัง (ระดับ) — บวก 10% ทบทุกระดับ แล้วปัดขึ้นเป็นบาท</p>`;
function packCards(){const p=[];for(let k=0;k<3;k++)p.push(0);p.push(1);{const q=Math.random();p.push(q<.70?2:q<.94?3:4)} // chase slot: SR 70% · UR 24% · SP 6%
 
 return p.map(t=>TIER[t][Math.floor(Math.random()*TIER[t].length)])}
function render(){sh.querySelectorAll('.ovl-tabs button').forEach(b=>b.classList.toggle('on',b.dataset.tab===tab));updSpent();
 if(tab==='pack')shBody.innerHTML=`<div class="prod"><div class="packart"><span>ARCANA</span><small>BOOSTER · 5 CARDS</small></div><div>
  <h3>ซองสุ่ม 5 ใบ — ${baht(PACK_PRICE)}</h3><p>ในซอง: ● C 3 ใบ · ◆ R 1 ใบ · ช่องลุ้น 1 ใบ (★ SR 70% / ★★ UR 24% / ✦ SP 6%)</p>
  <button type="button" class="buy" data-buy="pack">ซื้อและเปิดซอง ${baht(PACK_PRICE)}</button></div></div>${rarTable()}`;
 else if(tab==='box')shBody.innerHTML=`<div class="prod"><div class="packart box"><span>ARCANA</span><small>BOOSTER BOX · ${BOX_PACKS} PACKS</small></div><div>
  <h3>Box — ${BOX_PACKS} ซอง (${BOX_PACKS*PACK_SIZE} ใบ) ${baht(BOX_PACKS*PACK_PRICE)}</h3><p>เหมือนซื้อ ${BOX_PACKS} ซอง เฉลี่ยได้ ★★ UR / ✦ SP รวม ~${Math.round(BOX_PACKS*.3)} ใบต่อกล่อง</p>
  <button type="button" class="buy" data-buy="box">ซื้อและเปิดทั้งกล่อง ${baht(BOX_PACKS*PACK_PRICE)}</button></div></div>`;
 else if(tab==='set')shBody.innerHTML=`<div class="prod"><div class="packart set"><span>ARCANA</span><small>COMPLETE SET · ${deck.length}</small></div><div>
  <h3>Box set — ครบทั้ง ${deck.length} ใบ ${baht(SET_PRICE)}</h3><p>ได้ทุกใบ 1 ใบ (ใบหายากเป็นฟอยล์) ราคาเท่ากับรวมราคาปลีกทุกใบ</p>
  <button type="button" class="buy" data-buy="set">ซื้อ Box set ${baht(SET_PRICE)}</button></div></div>`;
 else if(tab==='single')shBody.innerHTML=`<div class="chips"><button type="button" data-f="-1" class="${filt<0?'on':''}">ทั้งหมด</button>${RAR.map((R,t)=>`<button type="button" data-f="${t}" class="${filt===t?'on':''}">${R.star} ${R.th}</button>`).join('')}</div>
  <div class="tgrid">${deck.map((c,i)=>filt>=0&&c.rar!==filt?'':`<div class="shelf">${thumb(i)}<span class="tn">${c.th}</span><button type="button" class="buy sm" data-one="${i}">ซื้อ ${baht(priceOf(c.rar))}</button>${COL.own[i]?`<span class="own">มีแล้ว ×${COL.own[i]}</span>`:''}</div>`).join('')}</div>`;
 else shBody.innerHTML=`<p class="note">สะสมแล้ว ${ownedKinds()}/${deck.length} ชนิด · ยอดซื้อจำลอง ${baht(COL.spent)}</p>
  <div class="tgrid">${deck.map((c,i)=>`<div class="shelf ${COL.own[i]?'':'miss'}">${thumb(i)}<span class="tn">${c.th}</span>${COL.own[i]?`<span class="own">×${COL.own[i]}</span>`:''}</div>`).join('')}</div>
  ${ownedKinds()?'<button type="button" class="buy sm ghost" data-reset="1">ล้างคอลเลกชัน</button>':''}`}
sh.querySelector('.ovl-tabs').addEventListener('click',e=>{const b=e.target.closest('button');if(b){tab=b.dataset.tab;render()}});
shBody.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
 if(b.dataset.f!==undefined){filt=+b.dataset.f;render()}
 else if(b.dataset.one!==undefined){const i=+b.dataset.one;addCards([i],priceOf(deck[i].rar));toast(`ซื้อ ${deck[i].th} แล้ว`);render()}
 else if(b.dataset.buy==='pack')openPack();
 else if(b.dataset.buy==='box'){const all=[];for(let k=0;k<BOX_PACKS;k++)all.push(...packCards());showHaul('📦 เปิด Box แล้ว',all,addCards(all,BOX_PACKS*PACK_PRICE))}
 else if(b.dataset.buy==='set'){const all=deck.map((_,i)=>i);showHaul(`🗃️ ได้ Box set ครบ ${deck.length} ใบ`,all,addCards(all,SET_PRICE))}
 else if(b.dataset.reset){COL={own:{},spent:0};saveCol();render()}
 else if(b.dataset.again){openPack()}else if(b.dataset.back){render()}});
function showHaul(title,ids,fresh){const cnt={};ids.forEach(i=>cnt[i]=(cnt[i]||0)+1);const uniq=Object.keys(cnt).map(Number).sort((a,b)=>deck[b].rar-deck[a].rar||a-b);
 const per=[0,1,2,3,4].map(t=>ids.filter(i=>deck[i].rar===t).length);
 shBody.innerHTML=`<h3>${title}</h3><p class="note">${RAR.map((R,t)=>`${R.star} ${R.th} ${per[t]}`).join(' · ')} · ใบใหม่ ${fresh.size} ชนิด</p>
  <div class="tgrid">${uniq.map(i=>`<div class="shelf">${thumb(i,fresh.has(i)?'<span class="new">NEW</span>':'')}<span class="tn">${deck[i].th}${cnt[i]>1?` ×${cnt[i]}`:''}</span></div>`).join('')}</div>
  <button type="button" class="buy" data-back="1">กลับร้าน</button>`}

// pack opening: tap to tear the pack, the 5 cards flip one by one (rare ones last, with foil + glow)
function openPack(){const ids=packCards(),fresh=addCards(ids,PACK_PRICE);
 shBody.innerHTML=`<div class="po"><div class="po-pack"><div class="po-top"></div><span>ARCANA</span><small>แตะเพื่อฉีกซอง</small></div>
  <div class="po-cards">${ids.map((i,k)=>`<div class="pc r${deck[i].rar}" style="--k:${k}"><div class="pc-in"><img class="pc-b" src="${$('#backImg').src}" alt=""><div class="pc-f">${thumb(i,fresh.has(i)?'<span class="new">NEW</span>':'')}</div></div></div>`).join('')}</div>
  <div class="po-msg"></div></div>`;
 const po=shBody.querySelector('.po'),pack=po.querySelector('.po-pack');let opened=false;
 const tear=()=>{if(opened)return;opened=true;po.classList.add('torn');
  po.querySelectorAll('.pc').forEach((el,k)=>setTimeout(()=>{el.classList.add(deck[ids[k]].rar>=2?'pglow':'flipping');setTimeout(()=>el.classList.add('flip'),180)},700+k*520));
  setTimeout(()=>{po.querySelector('.po-msg').innerHTML=`<p>${ids.map(i=>`${RAR[deck[i].rar].star} ${deck[i].th}`).join(' · ')}</p>
   <button type="button" class="buy" data-again="1">เปิดอีกซอง ${baht(PACK_PRICE)}</button> <button type="button" class="buy ghost" data-back="1">กลับร้าน</button>`},700+5*520+300)};
 pack.addEventListener('click',tear);if(location.hash.includes('autotear'))setTimeout(tear,200)}
mkBtn('🛍️ ร้านการ์ด',()=>{sh.hidden=false;render()});

// ---------- item 19: print-ready JPG of a card's front or back ----------
window.exportCardJPG=async function(i,side,W){W=W||750;const H=Math.round(W*5/3),c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');
 const svg=side==='back'?backSVG():faceSVG(deck[i]),im=new Image();
 await new Promise((ok,no)=>{im.onload=ok;im.onerror=no;im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg)});
 g.fillStyle='#0b0820';g.fillRect(0,0,W,H);g.drawImage(im,0,0,W,H);
 if(side!=='back'){if(document.fonts)await document.fonts.ready;const k=W/300,cd=deck[i],R=RAR[cd.rar];g.textAlign='center';g.textBaseline='middle';
  g.fillStyle='#eef1f8';g.font=`700 ${13*k}px Cinzel, serif`;if(cd.roman)g.fillText(cd.roman,150*k,27*k);
  let fs=15;const nf=()=>`700 ${fs*k}px Cinzel, serif`;g.font=nf();while(g.measureText(cd.en).width>236*k&&fs>8){fs-=.5;g.font=nf()}
  g.fillStyle='#f4e7c2';g.shadowColor='rgba(255,210,140,.6)';g.shadowBlur=8*k;g.fillText(cd.en,150*k,427*k);g.shadowBlur=0;
  g.font=`${15*k}px Sriracha, sans-serif`;g.fillStyle='#fff3dc';g.fillText(cd.th,150*k,461*k);
  g.textAlign='right';g.font=`700 ${10*k}px Cinzel, serif`;g.fillStyle=R.col;g.fillText(`${R.star} ${R.k}`,280*k,480*k)}
 return c.toDataURL('image/jpeg',.92)};
if(location.hash.includes('shoptest'))setTimeout(()=>{sh.hidden=false;render();openPack()},300); // test hook
if(location.hash.includes('shopall'))setTimeout(()=>{const out=[];for(const t of ['pack','box','set','single','col']){try{tab=t;render();out.push(t+':'+shBody.querySelectorAll('.tc').length)}catch(e){out.push(t+':ERR '+e.message)}}
 try{shBody.querySelector('[data-buy]');tab='box';render();shBody.querySelector('[data-buy=box]').click();out.push('boxhaul:'+shBody.querySelectorAll('.tc').length)}catch(e){out.push('box ERR '+e.message)}
 try{openPicker();out.push('picker:'+pk.querySelectorAll('.tbtn').length)}catch(e){out.push('picker ERR '+e.message)}
 out.push('price:'+[0,1,2,3,4].map(priceOf).join('/')+' set:'+SET_PRICE+' tiers:'+TIER.map(a=>a.length).join('/'));document.body.setAttribute('data-shop',out.join(' | '))},500); // test hook
if(location.hash.includes('pickone'))setTimeout(()=>{openPicker();pk.querySelector('.tbtn[data-i="40"]').click()},7000); // test hook
