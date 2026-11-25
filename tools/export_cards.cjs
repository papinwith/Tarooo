// Export every card as print-ready JPGs, one file per side: cards_jpg/NN_name_front.jpg and NN_name_back.jpg
// Usage:  node tools/export_cards.cjs [width=750] [deity|tarot]   → cards_jpg/<deck>/   (uses the Chrome installed on this machine)
const fs=require('fs'),path=require('path'),puppeteer=require('puppeteer-core');
const CHROME=['C:/Program Files/Google/Chrome/Application/chrome.exe','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(p=>fs.existsSync(p));
const DECK=process.argv[3]==='tarot'?'tarot':'deity';
const W=+(process.argv[2]||750),OUT=path.join(__dirname,'..','cards_jpg',DECK),PAGE='file:///'+path.join(__dirname,'..','index.html').replace(/\\/g,'/')+'?deck='+DECK+'#card=0&export';
(async()=>{
 if(!CHROME)throw new Error('Chrome/Edge not found');
 fs.mkdirSync(OUT,{recursive:true});
 const br=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--disable-gpu']});
 const pg=await br.newPage();await pg.goto(PAGE,{waitUntil:'load'});
 await pg.waitForFunction('typeof exportCardJPG==="function"');
 const cards=await pg.evaluate(()=>deck.map((c,i)=>({i,en:c.en,rar:['C','R','SR','UR','SP'][c.rar]})));
 const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
 for(const c of cards){
  for(const side of ['front','back']){
   const url=await pg.evaluate((i,s,w)=>exportCardJPG(i,s,w),c.i,side,W);
   const f=`${String(c.i).padStart(2,'0')}_${slug(c.en)}_${side}.jpg`;
   fs.writeFileSync(path.join(OUT,f),Buffer.from(url.split(',')[1],'base64'));
  }
  process.stdout.write(`\r${c.i+1}/${cards.length} ${c.en.padEnd(24)}`);
 }
 // a little index of the set with rarity, handy for printing / pricing
 fs.writeFileSync(path.join(OUT,'_list.csv'),'no,card,rarity,front,back\n'+cards.map(c=>{const b=`${String(c.i).padStart(2,'0')}_${slug(c.en)}`;return `${c.i},${c.en},${c.rar},${b}_front.jpg,${b}_back.jpg`}).join('\n')+'\n');
 await br.close();console.log(`\nwrote ${cards.length*2} JPGs (${W}x${Math.round(W*5/3)}) to ${OUT}`);
})().catch(e=>{console.error(e);process.exit(1)});
