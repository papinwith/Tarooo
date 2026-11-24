// Print-ready package for ordering the printed deck.
//   trim 72 x 120 mm (3:5, same shape as the cards on the site) + 3 mm bleed each side = 78 x 126 mm, 300 dpi
//   print_ready/front/*.jpg, print_ready/back/*.jpg, one PDF (front, back, front, back ...), CSV list + Thai ordering guide
// Usage: node tools/export_print.cjs
const fs=require('fs'),path=require('path'),puppeteer=require('puppeteer-core');
const CHROME=['C:/Program Files/Google/Chrome/Application/chrome.exe','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(p=>fs.existsSync(p));
const ROOT=path.join(__dirname,'..'),OUT=path.join(ROOT,'print_ready'),PAGE='file:///'+path.join(ROOT,'index.html').replace(/\\/g,'/')+'#card=0&export';
const DPI=300,MM=DPI/25.4,TRIM_W=72,TRIM_H=120,BLEED=3;
const px=mm=>Math.round(mm*MM),TW=px(TRIM_W),TH=px(TRIM_H),B=px(BLEED),FW=TW+2*B,FH=TH+2*B;
(async()=>{
 if(!CHROME)throw new Error('Chrome/Edge not found');
 for(const d of ['front','back'])fs.mkdirSync(path.join(OUT,d),{recursive:true});
 const br=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--disable-gpu']});
 const pg=await br.newPage();await pg.goto(PAGE,{waitUntil:'load'});await pg.waitForFunction('typeof exportCardJPG==="function"');
 const cards=await pg.evaluate(()=>deck.map((c,i)=>({i,en:c.en,th:c.th,rar:['C','U','R','SR'][c.rar]})));
 const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
 // card drawn at trim size in the middle; the bleed (and the rounded corners) are filled with the silver frame colour
 const render=(i,side)=>pg.evaluate(async(i,side,TW,TH,B,FW,FH)=>{const url=await exportCardJPG(i,side,TW),im=new Image();
  await new Promise(r=>{im.onload=r;im.src=url});const c=document.createElement('canvas');c.width=FW;c.height=FH;const g=c.getContext('2d');
  const gr=g.createLinearGradient(0,0,FW,FH);gr.addColorStop(0,'#eef1f6');gr.addColorStop(.5,'#a7adba');gr.addColorStop(1,'#e6e9f0');g.fillStyle=gr;g.fillRect(0,0,FW,FH);
  // repaint the dark rounded-corner pixels of the card image as silver, then draw it
  const t=document.createElement('canvas');t.width=TW;t.height=TH;const tg=t.getContext('2d');tg.drawImage(im,0,0,TW,TH);
  const rr=TW*18/300;tg.globalCompositeOperation='destination-in';tg.beginPath();tg.roundRect(0,0,TW,TH,rr);tg.fill();
  g.drawImage(t,B,B);return c.toDataURL('image/jpeg',.95)},i,side,TW,TH,B,FW,FH);
 const files=[];
 for(const c of cards){const base=`${String(c.i+1).padStart(2,'0')}_${slug(c.en)}`;
  for(const side of ['front','back']){const url=await render(c.i,side),f=path.join(side,`${base}_${side}.jpg`);
   fs.writeFileSync(path.join(OUT,f),Buffer.from(url.split(',')[1],'base64'));files.push(f)}
  process.stdout.write(`\r${c.i+1}/${cards.length}   `)}
 // one PDF, 78 x 126 mm pages: front of card 1, back of card 1, front of card 2 ...
 const html=`<html><head><style>@page{size:${TRIM_W+2*BLEED}mm ${TRIM_H+2*BLEED}mm;margin:0}body{margin:0}
  img{display:block;width:${TRIM_W+2*BLEED}mm;height:${TRIM_H+2*BLEED}mm;page-break-after:always}</style></head><body>
  ${files.map(f=>`<img src="file:///${path.join(OUT,f).replace(/\\/g,'/')}">`).join('')}</body></html>`;
 const htmlPath=path.join(OUT,'_pdf.html');fs.writeFileSync(htmlPath,html);
 const pp=await br.newPage();await pp.goto('file:///'+htmlPath.replace(/\\/g,'/'),{waitUntil:'load',timeout:0});
 await pp.pdf({path:path.join(OUT,'ARCANA_78cards_front-back.pdf'),width:`${TRIM_W+2*BLEED}mm`,height:`${TRIM_H+2*BLEED}mm`,printBackground:true,timeout:0});
 fs.unlinkSync(htmlPath);await br.close();
 fs.writeFileSync(path.join(OUT,'card_list.csv'),'\ufeffno,card,ชื่อไทย,rarity,foil,front,back\n'+cards.map(c=>{const b=`${String(c.i+1).padStart(2,'0')}_${slug(c.en)}`;
  return `${c.i+1},${c.en},${c.th},${c.rar},${c.rar==='R'||c.rar==='SR'?'ฟอยล์':''},front/${b}_front.jpg,back/${b}_back.jpg`}).join('\n')+'\n');
 const foil=cards.filter(c=>c.rar==='R'||c.rar==='SR');
 fs.writeFileSync(path.join(OUT,'อ่านก่อนสั่งพิมพ์.txt'),`ARCANA ไพ่ทาโรต์กระจกสีโฮโลแกรม — ไฟล์สำหรับสั่งพิมพ์
================================================================
จำนวน        78 ใบต่อสำรับ (พิมพ์ 2 หน้า: หน้าไพ่ + หลังไพ่)
ขนาดตัดจริง   ${TRIM_W} x ${TRIM_H} มม. (สัดส่วน 3:5 ขนาดไพ่ทาโรต์)
เผื่อตัดขอบ   ${BLEED} มม. ทุกด้าน → ขนาดไฟล์ ${TRIM_W+2*BLEED} x ${TRIM_H+2*BLEED} มม. = ${FW} x ${FH} px ที่ ${DPI} dpi
มุม          แนะนำไดคัทมุมมน รัศมี ~4 มม.
สี           ไฟล์เป็น RGB — ให้ร้านแปลงเป็น CMYK ก่อนพิมพ์ (สีม่วง/ฟ้าสดอาจหม่นลงเล็กน้อย ขอปรู๊ฟสีก่อนได้)
กระดาษ       แนะนำอาร์ตการ์ด 300–350 แกรม เคลือบด้านหรือเคลือบเงา (หรือกระดาษไพ่ blue-core)

ไฟล์ในโฟลเดอร์
 • ARCANA_78cards_front-back.pdf  — ไฟล์เดียวครบ 156 หน้า เรียง หน้า1, หลัง1, หน้า2, หลัง2, … (ส่งร้านได้เลย)
 • front/   — หน้าไพ่ 78 ไฟล์ (JPG)
 • back/    — หลังไพ่ 78 ไฟล์ (ลายเดียวกันทุกใบ ถ้าร้านใช้หลังไฟล์เดียวก็ใช้ไฟล์ไหนก็ได้)
 • card_list.csv — รายการไพ่ เลข ชื่อ แรร์ และใบที่ต้องทำฟอยล์

ใบที่ทำฟอยล์ (แรร์ ★ R และ ★★ SR) ${foil.length} ใบ:
${foil.map(c=>` ${String(c.i+1).padStart(2,'0')}  ${c.rar.padEnd(2)}  ${c.en} (${c.th})`).join('\n')}

ราคาขายที่ตั้งไว้ในเว็บ: ซอง 5 ใบ 49 บาท · Box 20 ซอง 980 บาท · Box set ครบ 78 ใบ 972 บาท
ขายปลีก/ใบ: C 11 · U 12 · R 14 · SR 15 บาท
`);
 console.log(`\nwrote ${files.length} JPGs (${FW}x${FH}px) + PDF + list to ${OUT}`);
})().catch(e=>{console.error(e);process.exit(1)});
