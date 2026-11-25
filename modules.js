/* 個別化學習路線：模組庫 —— 觀念目錄、路線產生、已完成的模組內容 */
(function(){
'use strict';
const GN=['小一','小二','小三','小四','小五','小六','七年級','八年級','九年級'];
const BANDS=[[1,4,3],[5,8,3],[9,12,3],[13,17,4],[18,23,5],[24,30,6],[31,43,10],[44,57,11],[58,65,6]];
const gradeOf=q=>BANDS.findIndex(b=>q>=b[0]&&q<=b[1]);

/* ---------- 觀念目錄：測驗 65 題對應到的觀念關卡 ---------- */
const CATALOG=[
 ['I-add','整數加減（進位、退位）',0,[1,2,3,5,6]],
 ['M-time','時間的計算',0,[4]],
 ['M-len','長度單位換算',1,[8]],
 ['I-mul','整數乘法',1,[7,9,13]],
 ['I-div','整數除法',2,[10,14]],
 ['F-equiv','分數的意義與約分',2,[11,16]],
 ['M-rect','周長與面積',2,[12,17]],
 ['F-dec','小數的四則運算',3,[15,20,25]],
 ['F-addunlike','異分母分數加減',4,[18]],
 ['F-muldiv','分數乘除',4,[19,24]],
 ['I-factor','因數與倍數',4,[21,34]],
 ['M-tri','三角形面積',4,[22]],
 ['M-vol','長方體體積',4,[23]],
 ['I-order','四則運算的順序',5,[26,27]],
 ['R-base','基準量與比較量',5,[28]],
 ['R-rate','速率',5,[29]],
 ['M-circle','圓周長與圓面積',5,[30]],
 ['A-neg','負數運算與乘方',6,[31,32,33]],
 ['A-exp','指數律',6,[35]],
 ['A-dist','分配律與去括號',6,[]],
 ['A-lin','一元一次方程式',6,[36,37,38]],
 ['A-sys','二元一次聯立方程式',6,[39]],
 ['N-coord','坐標與直線',6,[40,55]],
 ['R-prop','比例式與正比',6,[41,42]],
 ['A-ineq','一元一次不等式',6,[43]],
 ['A-poly','乘法公式與因式分解',7,[44,49]],
 ['A-root','平方根與根式',7,[45,46]],
 ['G-pyth','畢氏定理與特殊直角三角形',7,[47,48]],
 ['A-quad','一元二次方程式（十字交乘）',7,[50,51,52]],
 ['N-seq','等差數列與級數',7,[53,54]],
 ['G-tri','三角形與四邊形的性質',7,[56,57]],
 ['G-sim','相似形與面積比',8,[58]],
 ['G-circle','圓的性質',8,[59,60]],
 ['G-center','三角形的心',8,[61,62]],
 ['N-quadfn','二次函數的圖形',8,[63]],
 ['S-stat','統計與機率',8,[64,65]],
].map(([id,name,grade,qs])=>({id,name,grade,qs}));
const CAT={};CATALOG.forEach(c=>CAT[c.id]=c);
const Q2M={};CATALOG.forEach(c=>c.qs.forEach(q=>Q2M[q]=c.id));
/* 預備概念：路線裡出現左邊的關卡時，自動把右邊的關卡排在它前面 */
const PRE={'A-lin':['A-dist']};

/* ---------- 起點判定（與判定系統相同的標準） ---------- */
function diagnose(s){ // s：65 個字元，c 對、w 錯、i 不會、b 沒寫到
  const st=q=>s[q-1]||'b';
  const bands=BANDS.map(([a,b,p],g)=>{let c=0;for(let q=a;q<=b;q++)if(st(q)==='c')c++;return{g,c,n:b-a+1,pass:c>=p};});
  const f=bands.find(b=>!b.pass);const start=f?f.g:9;
  let last=0;for(let q=1;q<=65;q++)if(st(q)!=='b')last=q;
  return{start,startLabel:start>=9?'全部通過':GN[start],bands,last,correct:[...s].filter(x=>x==='c').length};
}
/* ---------- 路線：起點年級 → 起點以下的缺口 → 下一個年級 ---------- */
function route(s){
  const d=diagnose(s);const st=q=>s[q-1]||'b';
  const need=new Set(),miss={};
  for(let q=1;q<=65;q++){const g=gradeOf(q),x=st(q);
    const bad=x==='w'||x==='i'||(x==='b'&&g<=d.start+1&&q<=d.last+8);
    if(bad&&g<=d.start+1){need.add(Q2M[q]);(miss[Q2M[q]]=miss[Q2M[q]]||[]).push(q);}}
  const rank=m=>{const g=CAT[m].grade;return g===d.start?0:g<d.start?1:2;};
  const ids=[...need].sort((a,b)=>rank(a)-rank(b)||CAT[a].grade-CAT[b].grade||CATALOG.indexOf(CAT[a])-CATALOG.indexOf(CAT[b]));
  const out=[];ids.forEach(m=>{(PRE[m]||[]).forEach(p=>{if(!out.includes(p)&&!ids.includes(p))out.push(p);});if(!out.includes(m))out.push(m);});
  return{diag:d,route:out,miss};
}

/* ---------- 亂數與分數工具 ---------- */
function rng(seed){let a=seed>>>0||1;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const ri=(r,a,b)=>a+Math.floor(r()*(b-a+1));
const cop=(r,b)=>{let a;do{a=1+Math.floor(r()*(b-1));}while(gcd(a,b)>1);return a;};
const pick=(r,arr)=>arr[Math.floor(r()*arr.length)];
const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b)[a,b]=[b,a%b];return a;};
const lcm=(a,b)=>a/gcd(a,b)*b;
const R=(n,d=1)=>{if(d<0){n=-n;d=-d;}const g=gcd(n,d)||1;return{n:n/g,d:d/g};};
const add=(x,y)=>R(x.n*y.d+y.n*x.d,x.d*y.d),sub=(x,y)=>R(x.n*y.d-y.n*x.d,x.d*y.d),mul=(x,y)=>R(x.n*y.n,x.d*y.d),div=(x,y)=>R(x.n*y.d,x.d*y.n);
const eq=(x,y)=>x&&y&&x.n*y.d===y.n*x.d;
const ftxt=x=>x.d===1?String(x.n):(x.n<0?'−':'')+Math.abs(x.n)+'/'+x.d;
const F=(n,d)=>`<span class="fr"><span class="nu">${n}</span><span class="de">${d}</span></span>`;
const fh=x=>x.d===1?(x.n<0?'−'+(-x.n):String(x.n)):(x.n<0?'−':'')+F(Math.abs(x.n),x.d);
const mixh=x=>{if(x.d===1||Math.abs(x.n)<x.d)return fh(x);const w=Math.trunc(x.n/x.d),r=Math.abs(x.n%x.d);return (x.n<0?'−':'')+Math.abs(w)+F(r,x.d);};
const neg=n=>n<0?'−'+(-n):String(n);
const sgn=n=>n<0?' − '+(-n):' + '+n;
function norm(s){return String(s||'').trim().replace(/[０-９ａ-ｚＡ-Ｚ．＋]/g,c=>String.fromCharCode(c.charCodeAt(0)-0xFEE0)).replace(/　/g,' ').replace(/[／]/g,'/').replace(/[－−–]/g,'-').replace(/[：]/g,':').replace(/[，、]/g,',').replace(/（/g,'(').replace(/）/g,')').replace(/\s+/g,' ');}
function parseNum(s){
  s=norm(s).replace(/^[a-z]\s*=\s*/i,'').replace(/(元|人|顆|公里|公分|平方公分|度|°)$/,'').trim();let m;
  if(m=s.match(/^(-?)(\d+)\s*(?:又|\s)\s*(\d+)\/(\d+)$/)){const w=+m[2],n=+m[3],d=+m[4];if(!d)return null;const v=R(w*d+n,d);return{v:m[1]?R(-v.n,v.d):v,raw:[n,d]};}
  if(m=s.match(/^(-?\d+)\/(-?\d+)$/)){if(!+m[2])return null;return{v:R(+m[1],+m[2]),raw:[+m[1],+m[2]]};}
  if(m=s.match(/^-?\d+(\.\d+)?$/)){const p=(m[1]||'.').length-1;const k=10**p;return{v:R(Math.round(parseFloat(s)*k),k),raw:null};}
  return null;
}
function numCheck(ans,{simplest=false}={}){return str=>{const p=parseNum(str);if(!p)return{ok:false,note:'看不懂這個答案的寫法，例如分數請寫成 3/4。'};
  if(!eq(p.v,ans))return{ok:false};
  if(simplest&&p.raw&&gcd(p.raw[0],p.raw[1])>1)return{ok:true,note:'答對了！不過還可以再約分成最簡分數。'};return{ok:true};};}
function ratioCheck(a,b){const g=gcd(a,b);a/=g;b/=g;return str=>{const m=norm(str).match(/^(\d+)\s*:\s*(\d+)$/);if(!m)return{ok:false,note:'請用「4:9」這樣的格式。'};
  const x=+m[1],y=+m[2],h=gcd(x,y);if(x/h===a&&y/h===b)return{ok:true,note:h>1?'對，也可以化簡成 '+a+':'+b+'。':''};return{ok:false};};}
function shuffleMC(r,correct,wrong){const opts=[correct,...wrong.slice(0,3)];for(let i=opts.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[opts[i],opts[j]]=[opts[j],opts[i]];}return{options:opts,ans:opts.indexOf(correct)};}

/* 一次式 ax + b 的讀取與顯示 */
function parseLin(str){let t=norm(str).replace(/\s/g,'').replace(/X/g,'x').replace(/^[a-z]?=/,'');if(!t||!/^[-+0-9x]+$/.test(t))return null;
  if(!/^[-+]/.test(t))t='+'+t;const terms=t.match(/[-+][0-9]*x?/g);if(!terms||terms.join('')!==t)return null;let a=0,b=0;
  for(const m of terms){const sg=m[0]==='-'?-1:1;const body=m.slice(1);if(!body)return null;if(body.endsWith('x')){const c=body.slice(0,-1);a+=sg*(c===''?1:+c);}else b+=sg*(+body);}return{a,b};}
function lin(a,b){const A=a===0?'':a===1?'x':a===-1?'−x':neg(a)+'x';const B=b===0?'':A?(b>0?' + '+b:' − '+(-b)):neg(b);return(A+B)||'0';}
function linCheck(a,b){return str=>{const p=parseLin(str);if(!p)return{ok:false,note:'看不懂這個寫法，請寫成像 −2x − 10 這樣（x 的項在前）。'};
  if(p.a===a&&p.b===b)return{ok:true};
  if(p.a===a&&p.b===-b)return{ok:false,note:'x 的項對了，但常數項的正負號錯了：括號外的數要連同正負號，乘到每一項。'};
  if(p.a===a)return{ok:false,note:'x 的項對了，常數項不對：括號外的數有沒有乘到第二項？'};return{ok:false};};}

/* ================= 已完成的模組 ================= */
const MOD={};

/* ---------- 0. 分配律與去括號（一元一次方程式的預備觀念） ---------- */
MOD['A-dist']={
  goal:'把括號外的數（包括負數）連同正負號，乘到括號裡的每一項。',
  wrong:{h:'常見的錯：−2(x + 5) 寫成 −2x + 10 或 −2x + 5；−(x − 3) 寫成 −x − 3；3(x − 2) − 2(x + 1) 的後半寫成 − 2x + 2。',why:'括號外的 −2 要和括號裡的「每一項」相乘，而且要連同正負號一起乘：(−2) × x = −2x，(−2) × (+5) = −10。括號前只有負號時，就是乘以 −1。'},
  concept:['分配律：a(b + c) = ab + ac，括號外的數要乘到括號裡的每一項。','把減號看成加上負數：x − 3 = x + (−3)，這樣正負號就不會漏掉。','括號前只有負號，就是乘以 −1，括號裡每一項都變號：−(x − 3) = −x + 3。'],
  widget:{
    init:()=>({a:-2,c:5,wrong:false}),
    printState:()=>({a:-2,c:5,wrong:false}),
    render(s){const a=s.a,c=s.c;const as=a===-1?'−1':neg(a);const p1=lin(a,0),p2=a*c;
      const box=(x,w,top,mid,bot,col)=>`<rect x="${x}" y="40" width="${w}" height="70" fill="${col}" stroke="#333"/><text x="${x+w/2}" y="30" font-size="19" text-anchor="middle">${top}</text><text x="${x+w/2}" y="72" font-size="18" text-anchor="middle">${mid}</text><text x="${x+w/2}" y="96" font-size="20" font-weight="700" text-anchor="middle">${bot}</text>`;
      const cs=c>0?'+'+c:'−'+(-c);const wa=s.wrong;
      return `<svg viewBox="0 0 440 125" class="wsvg"><text x="12" y="82" font-size="21" font-weight="700">${as}</text><line x1="52" y1="40" x2="52" y2="110" stroke="#333" stroke-width="2"/>
       ${box(60,170,'x',`(${as}) × x`,p1,'#cfe1f7')}${box(230,170,cs,`(${as}) × (${cs})`,wa?(-p2>0?'+'+(-p2):'−'+p2):(p2>0?'+'+p2:'−'+(-p2)),wa?'#f7c9c9':'#f6d7a8')}</svg>
      <p class="wmsg">${wa?`這是常見的錯：只把 ${as} 乘給 x，第二格的正負號沒有跟著乘，寫成 ${lin(a,-p2)}。<b>正確</b>是 ${lin(a,p2)}。`
        :`${as}(x ${c>0?'+ '+c:'− '+(-c)}) 拆成兩格：每一格都要乘 ${as}。左格 ${p1}，右格 (${as}) × (${cs}) = ${p2>0?'+'+p2:'−'+(-p2)}，合起來是 <b>${lin(a,p2)}</b>。`}</p>`;},
    controls(s){return `<div class="wctl">括號外：${[3,2,-1,-2,-3].map(n=>`<button class="chip" data-act="a" data-v="${n}" aria-pressed="${s.a===n}">${n===-1?'−（只有負號）':neg(n)}</button>`).join('')}</div>
      <div class="wctl">括號裡的常數：${[5,4,-3,-6].map(n=>`<button class="chip" data-act="c" data-v="${n}" aria-pressed="${s.c===n}">${n>0?'+ '+n:'− '+(-n)}</button>`).join('')}</div>
      <div class="wctl"><button class="chip" data-act="w" aria-pressed="${s.wrong}">${s.wrong?'看正確的算法':'看常見的錯誤寫法'}</button></div>`;},
    act(s,a,v){if(a==='a')s.a=+v;if(a==='c')s.c=+v;if(a==='w')s.wrong=!s.wrong;}
  },
  example:{q:'化簡 3(x − 2) − 2(x + 1)',steps:['先處理第一個括號：3 × x = 3x，3 × (−2) = −6，得到 3x − 6。','第二個括號前面是 −2：(−2) × x = −2x，(−2) × (+1) = −2，得到 −2x − 2。','合起來：3x − 6 − 2x − 2 = x − 8。']},
  tiers:[
   r=>{const a=ri(r,2,9),b=ri(r,1,9)*pick(r,[1,-1]);return{h:`去括號：${a}(x ${b>0?'+':'−'} ${Math.abs(b)}) =`,key:lin(a,a*b),check:linCheck(a,a*b),hint:`${a} 要乘到 x，也要乘到 ${b>0?'+':'−'}${Math.abs(b)}。`};},
   r=>{const a=pick(r,[-1,-2,-3,-4,-5,-6]),b=ri(r,1,9)*pick(r,[1,-1]);const as=a===-1?'−':neg(a);
     return{h:`去括號：${as}(x ${b>0?'+':'−'} ${Math.abs(b)}) =`,key:lin(a,a*b),check:linCheck(a,a*b),hint:a===-1?'括號前只有負號，就是乘以 −1，括號裡每一項都要變號。':`(${neg(a)}) × (${b>0?'+':'−'}${Math.abs(b)}) = ${a*b>0?'+':'−'}${Math.abs(a*b)}，負負得正、正負得負。`};},
   r=>{let p,q,m,n;do{p=ri(r,2,6);q=ri(r,2,5);m=ri(r,1,6)*pick(r,[1,-1]);n=ri(r,1,6)*pick(r,[1,-1]);}while(p===q);const A=p-q,B=p*m-q*n;
     return{h:`化簡：${p}(x ${m>0?'+':'−'} ${Math.abs(m)}) − ${q}(x ${n>0?'+':'−'} ${Math.abs(n)}) =`,key:lin(A,B),check:linCheck(A,B),hint:`後面的括號是乘以 −${q}：(−${q}) × (${n>0?'+':'−'}${Math.abs(n)}) = ${-q*n>0?'+':'−'}${Math.abs(q*n)}。`};}
  ]
};

/* ---------- 1. 異分母分數加減 ---------- */
MOD['F-addunlike']={
  goal:'會先通分，再把分子相加減，算出異分母分數的加減。',
  wrong:{h:`常見的錯：${F(1,2)} + ${F(2,3)} = ${F(3,5)}（分子加分子、分母加分母）。`,why:`${F(1,2)} 是半個，${F(3,5)} 比半個只多一點點，可是 ${F(1,2)} 再加上 ${F(2,3)}，明明已經超過 1 個了。分母不同時，每一份的大小不一樣，不能直接相加。`},
  concept:['分母代表「切成幾份」，分母不同，每一份就不一樣大。','先把兩個分數切成一樣大的份數（找分母的公倍數），這叫做「通分」。','份數一樣大以後，分子才能直接相加減。最後記得約分。'],
  widget:{
    init:()=>({p:0,N:0}),
    printState:()=>({p:0,N:6}),
    presets:[[1,2,2,3],[1,3,1,4],[3,4,1,6],[2,5,1,2]],
    render(s){const [a,b,c,d]=this.presets[s.p];const W=300,H=34;
      const bar=(n,den,y,col)=>{const N=s.N||den;const fit=N%den===0;let g=`<rect x="10" y="${y}" width="${W}" height="${H}" fill="#fff" stroke="#333"/><rect x="10" y="${y}" width="${W*n/den}" height="${H}" fill="${col}" opacity=".75"/>`;
        for(let k=1;k<N;k++)g+=`<line x1="${10+W*k/N}" y1="${y}" x2="${10+W*k/N}" y2="${y+H}" stroke="#333" stroke-width="${fit?1:.6}" ${fit?'':'stroke-dasharray="3 3"'}/>`;
        const lab=s.N?(fit?`= ${n*N/den}/${N}`:'切不剛好'):'';return g+`<text x="${W+18}" y="${y+22}" font-size="18">${n}/${den} ${lab}</text>`;};
      const N=s.N,ok=N&&N%b===0&&N%d===0;
      return `<svg viewBox="0 0 440 110" class="wsvg">${bar(a,b,10,'#4f8fd8')}${bar(c,d,60,'#e39b3b')}</svg>
      <p class="wmsg">${!N?'先看原本的樣子：兩個分數每一份的大小不一樣。按下面的數字，把兩條都改切成同樣的份數。':ok?`兩條都切成 ${N} 份了！${F(a,b)} = ${F(a*N/b,N)}，${F(c,d)} = ${F(c*N/d,N)}，現在可以相加：${F(a*N/b+c*N/d,N)}${gcd(a*N/b+c*N/d,N)>1?'，再約分。':'。'}`:`切成 ${N} 份時，有一條切不剛好（虛線）。${N} 要同時是 ${b} 和 ${d} 的倍數才行。`}</p>`;},
    controls(s){return `<div class="wctl">改切成：${[2,3,4,5,6,8,9,10,12].map(n=>`<button class="chip" data-act="N" data-v="${n}" aria-pressed="${s.N===n}">${n} 份</button>`).join('')}</div>
      <div class="wctl">換一題：${this.presets.map((p,i)=>`<button class="chip" data-act="p" data-v="${i}" aria-pressed="${s.p===i}">${p[0]}/${p[1]} + ${p[2]}/${p[3]}</button>`).join('')}</div>`;},
    act(s,a,v){if(a==='N')s.N=+v;if(a==='p'){s.p=+v;s.N=0;}}
  },
  example:{q:`${F(3,4)} + ${F(1,6)} = ?`,steps:[`4 和 6 的最小公倍數是 12，所以通分成分母 12。`,`${F(3,4)} = ${F(9,12)}（分子分母都乘 3），${F(1,6)} = ${F(2,12)}（都乘 2）。`,`${F(9,12)} + ${F(2,12)} = ${F(11,12)}，已經是最簡分數。`]},
  tiers:[
   r=>{const b=pick(r,[2,3,4,5,6]);const d=b*pick(r,[2,3].filter(k=>b*k<=12));const a=cop(r,b),c=cop(r,d);const x=add(R(a,b),R(c,d));
     return{h:`${F(a,b)} + ${F(c,d)} =`,key:ftxt(x),check:numCheck(x,{simplest:true}),hint:`${d} 是 ${b} 的倍數，把 ${F(a,b)} 換成分母 ${d}。`};},
   r=>{let b,d;do{b=pick(r,[2,3,4,5,7]);d=pick(r,[3,4,5,7,9]);}while(b===d||gcd(b,d)>1);const a=cop(r,b),c=cop(r,d);const x=add(R(a,b),R(c,d));
     return{h:`${F(a,b)} + ${F(c,d)} =`,key:ftxt(x),check:numCheck(x,{simplest:true}),hint:`${b} 和 ${d} 的最小公倍數是 ${lcm(b,d)}。`};},
   r=>{let b,d,a,c,w;do{b=pick(r,[3,4,6]);d=pick(r,[4,6,8,9]);a=cop(r,b);c=cop(r,d);w=ri(r,1,3);}while(b===d||R(c,d).n*b>=(w*b+a)*R(c,d).d);
     const x=sub(R(w*b+a,b),R(c,d));return{h:`${w}${F(a,b)} − ${F(c,d)} =`,key:ftxt(x),check:numCheck(x,{simplest:true}),hint:`先把 ${w}${F(a,b)} 化成假分數 ${F(w*b+a,b)}，再通分（公倍數 ${lcm(b,d)}）。`};}
  ]
};

/* ---------- 2. 四則運算的順序 ---------- */
MOD['I-order']={
  goal:'知道「先括號、再乘除、後加減；同一級由左到右」，並能正確計算。',
  wrong:{h:'常見的錯：36 − (8 + 4) ÷ 3 × 2，從左算到右得到 16。',why:'算式不是照「看到的順序」算，而是照「運算的等級」算：乘除比加減優先，括號又比乘除優先。'},
  concept:['第一步找括號，括號裡的先算。','再找乘號和除號，同一級的由左到右算。','最後才算加減，同樣由左到右。'],
  widget:{
    init:()=>({e:0,k:0,msg:''}),
    printState:()=>({e:0,k:4,msg:''}),
    seqs:[
      [{x:'36 − (8 + 4) ÷ 3 × 2',o:['36 − 8','8 + 4','4 ÷ 3','3 × 2'],c:1,w:'括號優先，先算 8 + 4。'},
       {x:'36 − 12 ÷ 3 × 2',o:['36 − 12','12 ÷ 3','3 × 2'],c:1,w:'乘除比減法優先；乘除同一級時，由左到右，所以先算 12 ÷ 3。'},
       {x:'36 − 4 × 2',o:['36 − 4','4 × 2'],c:1,w:'乘法比減法優先。'},
       {x:'36 − 8',o:['36 − 8'],c:0,w:''},{x:'28',o:[],c:-1}],
      [{x:'[2|3] + [1|2] ÷ [3|4]',o:['[2|3] + [1|2]','[1|2] ÷ [3|4]'],c:1,w:'除法比加法優先。'},
       {x:'[2|3] + [2|3]',o:['[2|3] + [2|3]'],c:0,w:''},{x:'[4|3]',o:[],c:-1}],
      [{x:'50 − 6 × (3 + 2) + 8',o:['50 − 6','6 × 3','3 + 2','2 + 8'],c:2,w:'括號優先。'},
       {x:'50 − 6 × 5 + 8',o:['50 − 6','6 × 5','5 + 8'],c:1,w:'乘法比加減優先。'},
       {x:'50 − 30 + 8',o:['50 − 30','30 + 8'],c:0,w:'只剩加減，由左到右，先算 50 − 30。'},
       {x:'20 + 8',o:['20 + 8'],c:0,w:''},{x:'28',o:[],c:-1}]],
    m:s=>s.replace(/\[(\d+)\|(\d+)\]/g,(_,a,b)=>F(a,b)),
    render(s){const q=this.seqs[s.e];const cur=q[s.k];
      return `<div class="steps">${q.slice(0,s.k+1).map((st,i)=>`<div class="stp ${i===s.k?'now':''}">${i?'= ':''}${this.m(st.x)}</div>`).join('')}</div>
      <p class="wmsg">${cur.c===-1?'算完了！每一步都照「括號 → 乘除 → 加減」的順序。':s.msg||'下一步要先算哪一部分？點一點下面的按鈕。'}</p>`;},
    controls(s){const cur=this.seqs[s.e][s.k];return `<div class="wctl">${cur.o.map((o,i)=>`<button class="chip big" data-act="pick" data-v="${i}">${this.m(o)}</button>`).join('')}</div>
      <div class="wctl">換一題：${this.seqs.map((q,i)=>`<button class="chip" data-act="e" data-v="${i}" aria-pressed="${s.e===i}">第 ${i+1} 題</button>`).join('')}</div>`;},
    act(s,a,v){if(a==='e'){s.e=+v;s.k=0;s.msg='';return;}const cur=this.seqs[s.e][s.k];if(+v===cur.c){s.k++;s.msg='';}else s.msg='還不是這一步喔：'+cur.w;}
  },
  example:{q:'48 ÷ (2 + 6) × 3 − 5 = ?',steps:['括號先算：2 + 6 = 8，變成 48 ÷ 8 × 3 − 5。','乘除由左到右：48 ÷ 8 = 6，6 × 3 = 18，變成 18 − 5。','最後算減法：18 − 5 = 13。']},
  tiers:[
   r=>{const b=ri(r,2,9),c=ri(r,2,9),a=ri(r,5,40);const op=r()<.5;const x=op?a+b*c:a+b*c;
     return op?{h:`${a} + ${b} × ${c} =`,key:String(a+b*c),check:numCheck(R(a+b*c)),hint:`先算 ${b} × ${c}。`}
       :{h:`${a+b*c} − ${b*c} ÷ ${c} =`,key:String(a+b*c-b),check:numCheck(R(a+b*c-b)),hint:`先算 ${b*c} ÷ ${c}。`};},
   r=>{const d=ri(r,2,5),e=ri(r,2,4),t=d*ri(r,2,4);const b=ri(r,1,t-1),c=t-b;const a=t/d*e+ri(r,1,30);const v=a-t/d*e;
     return{h:`${a} − (${b} + ${c}) ÷ ${d} × ${e} =`,key:String(v),check:numCheck(R(v)),hint:`括號 → ${t}；再由左到右算 ${t} ÷ ${d} × ${e}。`};},
   r=>{const p=R(ri(r,1,3),pick(r,[3,4,5]));const q=R(1,pick(r,[2,3]));const s=R(ri(r,1,3),4);const x=add(p,div(q,s.n?s:R(1,4)));
     return{h:`${fh(p)} + ${fh(q)} ÷ ${fh(s)} =`,key:ftxt(x),check:numCheck(x,{simplest:true}),hint:`除法優先：先算 ${fh(q)} ÷ ${fh(s)}（除以一個分數等於乘以它的倒數）。`};}
  ]
};

/* ---------- 3. 基準量與比較量 ---------- */
MOD['R-base']={
  goal:'分辨「誰是基準量（全部、被比的）」、「誰是比較量」，用線段圖求出答案。',
  wrong:{h:`常見的錯：「小明有 120 元，是小華的 ${F(3,4)}」，算成 120 × ${F(3,4)} = 90。`,why:`「是小華的 ${F(3,4)}」代表小華才是全部（基準量），小明只是其中的 3 份。小華應該比小明多，不會比 120 少。`},
  concept:['「A 是 B 的幾分之幾」：B 是基準量（全部），A 是比較量。','把基準量畫成一條，平分成分母那麼多份；比較量是其中的分子那麼多份。','先求「一份是多少」，再乘上要的份數。'],
  widget:{
    init:()=>({q:4,p:3,known:'comp',v:120}),
    printState:()=>({q:4,p:3,known:'comp',v:120}),
    render(s){const W=300,cw=W/Math.max(s.q,s.p);const one=s.known==='comp'?s.v/s.p:s.v/s.q;const base=one*s.q,comp=one*s.p;const f=x=>Number.isInteger(x)?x:x.toFixed(2).replace(/\.?0+$/,'');
      const cells=(n,y,col,lab,val)=>{let g='';for(let i=0;i<n;i++)g+=`<rect x="${70+i*cw}" y="${y}" width="${cw}" height="30" fill="${col}" stroke="#333"/><text x="${70+i*cw+cw/2}" y="${y+20}" font-size="15" text-anchor="middle">${f(one)}</text>`;
        return g+`<text x="4" y="${y+20}" font-size="17">${lab}</text><text x="${74+n*cw}" y="${y+20}" font-size="17" font-weight="700">${f(val)}</text>`;};
      return `<svg viewBox="0 0 440 100" class="wsvg">${cells(s.q,10,'#cfe1f7','基準量',base)}${cells(s.p,58,'#f6d7a8','比較量',comp)}</svg>
      <p class="wmsg">比較量是基準量的 ${F(s.p,s.q)}。已知${s.known==='comp'?'比較量':'基準量'}是 ${s.v}，${s.known==='comp'?`它有 ${s.p} 份`:`它有 ${s.q} 份`}，所以一份是 ${f(one)}；${s.known==='comp'?`基準量 ${s.q} 份 = ${f(base)}`:`比較量 ${s.p} 份 = ${f(comp)}`}。</p>`;},
    controls(s){return `<div class="wctl">分母（基準量切幾份）：${[2,3,4,5,6,8].map(n=>`<button class="chip" data-act="q" data-v="${n}" aria-pressed="${s.q===n}">${n}</button>`).join('')}</div>
      <div class="wctl">分子（比較量有幾份）：${[1,2,3,4,5,6,7].map(n=>`<button class="chip" data-act="p" data-v="${n}" aria-pressed="${s.p===n}">${n}</button>`).join('')}</div>
      <div class="wctl">已知的是：<button class="chip" data-act="k" data-v="comp" aria-pressed="${s.known==='comp'}">比較量</button><button class="chip" data-act="k" data-v="base" aria-pressed="${s.known==='base'}">基準量</button>
      <label>數值 <input type="number" data-act="v" value="${s.v}" style="width:90px"></label></div>`;},
    act(s,a,v){if(a==='q')s.q=+v;if(a==='p')s.p=+v;if(a==='k')s.known=v;if(a==='v'&&+v>0)s.v=+v;}
  },
  example:{q:`一本書看了 84 頁，是全書的 ${F(7,10)}。全書有幾頁？`,steps:['「是全書的 7/10」→ 全書是基準量，看了的 84 頁是比較量。','全書切成 10 份，看了其中 7 份：一份 = 84 ÷ 7 = 12 頁。','全書 10 份 = 12 × 10 = 120 頁。檢查：120 比 84 多，合理。']},
  tiers:[
   r=>{const q=pick(r,[3,4,5,6,8]);let p;do{p=ri(r,1,q-1);}while(gcd(p,q)>1);const B=q*ri(r,3,12);const v=B*p/q;const who=pick(r,[['全班','男生','人'],['一條繩子','剪下的部分','公分'],['一箱蘋果','壞掉的','顆']]);
     return{h:`${who[0]}有 ${B} ${who[2]}，${who[1]}是${who[0]}的 ${F(p,q)}，${who[1]}有多少${who[2]}？`,key:v+' '+who[2],check:numCheck(R(v)),hint:`${who[0]}是基準量。一份 = ${B} ÷ ${q}。`};},
   r=>{const q=pick(r,[3,4,5,6,8]);let p;do{p=ri(r,1,q-1);}while(gcd(p,q)>1);const A=p*ri(r,3,15);const v=A*q/p;
     return{h:`小明有 ${A} 元，是姊姊的 ${F(p,q)}。姊姊有多少元？`,key:v+' 元',check:numCheck(R(v)),hint:`姊姊是基準量（${q} 份），小明是其中 ${p} 份：一份 = ${A} ÷ ${p}。`};},
   r=>{const k=pick(r,[6,7,8,9]);const orig=100*ri(r,3,15);const y=orig*k/10;
     return{h:`一件外套打 ${k} 折後賣 ${y} 元，原價是多少元？`,key:orig+' 元',check:numCheck(R(orig)),hint:`打 ${k} 折＝售價是原價的 ${F(k,10)}，原價是基準量。`};}
  ]
};

/* ---------- 4. 一元一次方程式 ---------- */
MOD['A-lin']={
  goal:'用「等號兩邊做一樣的事」來解方程式，正確處理括號與分母。',
  wrong:{h:'常見的錯：3(x − 2) = x + 4 寫成 3x − 2 = x + 4；(x − 1)/2 = (x + 2)/3 去分母寫成 3x − 1 = 2x + 2。',why:'括號外的 3 要乘到括號裡的每一項；去分母時，分子是一個整體，要整個乘，所以要先加括號：3(x − 1) = 2(x + 2)。'},
  concept:['方程式像天平：兩邊同時加、減、乘、除同一個數，天平仍然平衡。','先去括號（每一項都要乘）、去分母（分子加括號再乘），再把 x 集中到一邊。','最後兩邊同除以 x 的係數，並把答案代回去檢查。'],
  widget:{
    init:()=>({p:0,a:3,b:2,c:1,d:8,msg:''}),
    printState:()=>({p:0,a:3,b:2,c:1,d:8,msg:'藍色方塊是 x，橘色圓點是 1。兩邊同時拿走 1 個 x、再拿走 2 個圓點，變成 2x = 6，兩邊同除以 2，得到 x = 3。'}),
    presets:[[3,2,1,8],[4,1,2,7],[5,3,2,12]],
    render(s){const side=(a,b,x0)=>{let g='';const n=Math.min(a,8);for(let i=0;i<n;i++)g+=`<rect x="${x0+(i%4)*26}" y="${36-Math.floor(i/4)*26}" width="22" height="22" rx="3" fill="#4f8fd8"/><text x="${x0+(i%4)*26+11}" y="${52-Math.floor(i/4)*26}" fill="#fff" font-size="16" text-anchor="middle">x</text>`;
        const m=Math.min(b,12);for(let i=0;i<m;i++)g+=`<circle cx="${x0+112+(i%4)*18}" cy="${48-Math.floor(i/4)*18}" r="7" fill="#e39b3b"/>`;return g;};
      const ex=(a,b)=>[(a?(a===1?'x':a+'x'):''),(b?b:'')].filter(Boolean).join(' + ')||'0';
      const done=s.a===1&&s.b===0&&s.c===0||s.c===1&&s.d===0&&s.a===0;
      return `<svg viewBox="0 0 440 120" class="wsvg"><polygon points="215,110 225,110 220,72" fill="#555"/><line x1="20" y1="72" x2="420" y2="72" stroke="#555" stroke-width="4"/>
      ${side(s.a,s.b,24)}${side(s.c,s.d,236)}<text x="110" y="100" font-size="18" text-anchor="middle">${ex(s.a,s.b)}</text><text x="330" y="100" font-size="18" text-anchor="middle">${ex(s.c,s.d)}</text></svg>
      <p class="wmsg">${done?`解出來了：x = ${s.a?s.d:s.b}。把它代回原本的方程式檢查看看！`:s.msg||'藍色方塊是 x，橘色圓點是 1。用下面的按鈕，讓兩邊做一樣的事，最後只剩一個 x。'}</p>`;},
    controls(s){const g=gcd(gcd(s.a,s.b),gcd(s.c,s.d));return `<div class="wctl"><button class="chip" data-act="m1">兩邊各拿走 1 個圓點</button><button class="chip" data-act="mx">兩邊各拿走 1 個 x</button>
      ${[2,3,4,5].filter(k=>g%k===0).map(k=>`<button class="chip" data-act="dv" data-v="${k}">兩邊同除以 ${k}</button>`).join('')}</div>
      <div class="wctl">換一題：${this.presets.map((p,i)=>`<button class="chip" data-act="p" data-v="${i}" aria-pressed="${s.p===i}">${p[0]}x + ${p[1]} = ${p[2]===1?'':p[2]}x + ${p[3]}</button>`).join('')}</div>`;},
    act(s,a,v){s.msg='';if(a==='p'){Object.assign(s,{p:+v,a:this.presets[v][0],b:this.presets[v][1],c:this.presets[v][2],d:this.presets[v][3]});}
      if(a==='m1'){if(s.b>0&&s.d>0){s.b--;s.d--;}else s.msg='有一邊已經沒有圓點了，不能兩邊都拿。';}
      if(a==='mx'){if(s.a>0&&s.c>0){s.a--;s.c--;}else s.msg='有一邊已經沒有 x 了。';}
      if(a==='dv'){const k=+v;s.a/=k;s.b/=k;s.c/=k;s.d/=k;}}
  },
  example:{q:'2(x + 3) = (x − 1) ÷ 1 + 10，解 x',steps:['去括號：2x + 6 = x − 1 + 10，也就是 2x + 6 = x + 9。','兩邊減 x：x + 6 = 9；兩邊減 6：x = 3。','檢查：左邊 2(3 + 3) = 12，右邊 3 − 1 + 10 = 12，相等。']},
  tiers:[
   r=>{const a=ri(r,2,9),x=ri(r,-6,9),b=ri(r,-15,15)||3;const c=a*x+b;
     return{h:`解方程式：${a}x${sgn(b)} = ${neg(c)}`,key:'x = '+x,check:numCheck(R(x)),hint:`兩邊先${b>0?'減':'加'} ${Math.abs(b)}，再同除以 ${a}。`};},
   r=>{let a,c,b,x,d,sg;do{a=pick(r,[-4,-3,-2,2,3,4,5]);c=ri(r,1,4);b=ri(r,1,6);sg=pick(r,[1,-1]);x=ri(r,-4,8);d=a*(x-sg*b)-c*x;}while(a===c||d===0);
     return{h:`解方程式：${neg(a)}(x ${sg>0?'−':'+'} ${b}) = ${c===1?'':c}x${sgn(d)}`,key:'x = '+x,check:numCheck(R(x)),hint:`去括號：${neg(a)} 要乘到括號裡的兩項，連符號一起乘，得到 ${neg(a)}x${sgn(-a*sg*b)}。`};},
   r=>{let p,q,m,n,x;do{p=pick(r,[2,3,4]);q=pick(r,[3,4,5]);x=ri(r,-5,12);m=ri(r,-5,5);n=0;const num=q*(x+m);if(num%p===0){const k=num/p-x;n=k;}else n=null;}while(p===q||n===null||n===0||m===0||Math.abs(n)>20);
     return{h:`解方程式：${F('x'+sgn(m),p)} = ${F('x'+sgn(n),q)}`,key:'x = '+x,check:numCheck(R(x)),hint:`兩邊同乘 ${lcm(p,q)}：${lcm(p,q)/p}(x${sgn(m)}) = ${lcm(p,q)/q}(x${sgn(n)})，分子要加括號。`};}
  ]
};

/* ---------- 5. 相似形與面積比 ---------- */
MOD['G-sim']={
  goal:'知道相似形的邊長比是 a : b 時，面積比是 a² : b²，並能反推。',
  wrong:{h:'常見的錯：兩個相似三角形邊長比 2 : 3，就說面積比也是 2 : 3。',why:'面積是「長 × 寬」兩個方向一起放大。長變 3 倍、寬也變 3 倍，面積就變成 3 × 3 = 9 倍。'},
  concept:['相似形的對應邊長都乘上同一個倍數 k。','面積有兩個方向，所以變成 k × k = k² 倍。','邊長比 a : b → 面積比 a² : b²；面積比 → 開根號得到邊長比。'],
  widget:{
    init:()=>({k:2}),
    printState:()=>({k:3}),
    render(s){const u=18,k=s.k;let g='';
      for(let i=0;i<2*k;i++)for(let j=0;j<k;j++)g+=`<rect x="${160+i*u}" y="${10+j*u}" width="${u}" height="${u}" fill="${(Math.floor(i/2)+j)%2?'#cfe1f7':'#a9c9ef'}" stroke="#fff"/>`;
      return `<svg viewBox="0 0 440 ${Math.max(90,k*u+30)}" class="wsvg"><rect x="10" y="10" width="${2*u}" height="${u}" fill="#e39b3b"/><text x="10" y="${u+30}" font-size="16">原來：2 格</text>${g}
      <text x="${160}" y="${k*u+28}" font-size="16">放大 ${k} 倍：面積 ${2*k*k} 格（${k*k} 個原圖）</text></svg>
      <p class="wmsg">邊長變 ${k} 倍 → 面積變 ${k} × ${k} = ${k*k} 倍。所以邊長比 1 : ${k}，面積比 1 : ${k*k}。三角形也一樣。</p>`;},
    controls(s){return `<div class="wctl">放大倍數：${[1,2,3,4].map(n=>`<button class="chip" data-act="k" data-v="${n}" aria-pressed="${s.k===n}">${n} 倍</button>`).join('')}</div>`;},
    act(s,a,v){s.k=+v;}
  },
  example:{q:'△ABC ∼ △DEF，邊長比 3 : 5，△ABC 面積 27，△DEF 面積？',steps:['邊長比 3 : 5 → 面積比 9 : 25。','27 是 9 份，一份 = 27 ÷ 9 = 3。','△DEF 是 25 份 = 3 × 25 = 75。']},
  tiers:[
   r=>{let a,b;do{a=ri(r,1,5);b=ri(r,2,7);}while(a>=b||gcd(a,b)>1);return{h:`兩個相似三角形的對應邊長比是 ${a} : ${b}，面積比是多少？（寫成 a:b）`,key:`${a*a}:${b*b}`,check:ratioCheck(a*a,b*b),hint:`面積比 = ${a}² : ${b}²。`};},
   r=>{let a,b;do{a=ri(r,1,5);b=ri(r,2,7);}while(a>=b||gcd(a,b)>1);return{h:`兩個相似多邊形的面積比是 ${a*a} : ${b*b}，對應邊長比是多少？（寫成 a:b）`,key:`${a}:${b}`,check:ratioCheck(a,b),hint:`${a*a} = ${a}²，${b*b} = ${b}²。`};},
   r=>{let a,b;do{a=ri(r,1,4);b=ri(r,2,6);}while(a>=b||gcd(a,b)>1);const one=ri(r,1,6);const S=a*a*one;
     return{h:`△ABC ∼ △DEF，AB : DE = ${a} : ${b}。若 △ABC 的面積是 ${S}，△DEF 的面積是多少？`,key:String(one*b*b),check:numCheck(R(one*b*b)),hint:`面積比 ${a*a} : ${b*b}；${S} 是 ${a*a} 份。`};}
  ]
};

/* ---------- 6. 二次函數的圖形 ---------- */
MOD['N-quadfn']={
  goal:'看出 y = a(x − h)² + k 的開口方向和頂點，知道平移的方向。',
  wrong:{h:'常見的錯：y = −(x − 1)² + 3 的頂點說成 (−1, 3)。',why:'x − 1 = 0 時才是最高點，也就是 x = 1。括號裡是「減 h」，頂點的 x 坐標就是 +h：向右移 h。'},
  concept:['a > 0 開口向上，a < 0 開口向下；|a| 越大，開口越窄。','y = a(x − h)² + k 的頂點是 (h, k)：(x − h) 讓圖形向右移 h，+ k 讓圖形向上移 k。','判斷頂點的 x：令括號 = 0。'],
  widget:{
    init:()=>({a:1,h:0,k:0}),
    printState:()=>({a:-1,h:2,k:1}),
    render(s){const S=20,O=150,X=x=>O+x*S,Y=y=>O-y*S;let g='';for(let i=-7;i<=7;i++){g+=`<line x1="${X(i)}" y1="0" x2="${X(i)}" y2="300" stroke="#e3e7ee"/><line x1="0" y1="${Y(i)}" x2="300" y2="${Y(i)}" stroke="#e3e7ee"/>`;}
      g+=`<line x1="0" y1="${O}" x2="300" y2="${O}" stroke="#777"/><line x1="${O}" y1="0" x2="${O}" y2="300" stroke="#777"/>`;
      const path=(a,h,k)=>{let d='';for(let x=-7.5;x<=7.5;x+=.1){const y=a*(x-h)**2+k;if(Math.abs(y)>9)continue;d+=(d?'L':'M')+X(x).toFixed(1)+','+Y(y).toFixed(1);}return d;};
      const hs=s.h===0?'x':`(x ${s.h>0?'−':'+'} ${Math.abs(s.h)})`;const as=s.a===1?'':s.a===-1?'−':String(s.a).replace('-','−');const ks=s.k===0?'':` ${s.k>0?'+':'−'} ${Math.abs(s.k)}`;
      return `<div class="graphwrap"><svg viewBox="0 0 300 300" class="wsvg sq">${g}<path d="${path(1,0,0)}" fill="none" stroke="#bbb" stroke-dasharray="4 4" stroke-width="2"/><path d="${path(s.a,s.h,s.k)}" fill="none" stroke="#d23c3c" stroke-width="3"/>
      <circle cx="${X(s.h)}" cy="${Y(s.k)}" r="5" fill="#1f4e8c"/></svg>
      <div><p class="eqn">y = ${as}${hs}²${ks}</p><p class="wmsg">頂點 (${neg(s.h)}, ${neg(s.k)})，開口${s.a>0?'向上':'向下'}。灰色虛線是 y = x²：紅線是它${s.h?`向${s.h>0?'右':'左'}移 ${Math.abs(s.h)}`:''}${s.h&&s.k?'、':''}${s.k?`向${s.k>0?'上':'下'}移 ${Math.abs(s.k)}`:''}${!s.h&&!s.k?'沒有平移':''}${s.a!==1?'，並改變開口':''}的結果。</p></div></div>`;},
    controls(s){const row=(n,lab,vals)=>`<div class="wctl">${lab}：${vals.map(v=>`<button class="chip" data-act="${n}" data-v="${v}" aria-pressed="${s[n]===v}">${String(v).replace('-','−')}</button>`).join('')}</div>`;
      return row('a','a',[-2,-1,-0.5,0.5,1,2])+row('h','h',[-3,-2,-1,0,1,2,3])+row('k','k',[-3,-2,-1,0,1,2,3]);},
    act(s,a,v){s[a]=+v;}
  },
  example:{q:'y = 2(x + 3)² − 1 的開口方向與頂點？',steps:['a = 2 > 0，開口向上。','x + 3 = 0 → x = −3；括號外 − 1 → y = −1。','頂點 (−3, −1)：由 y = 2x² 向左移 3、向下移 1。']},
  tiers:[
   r=>{let h,k;do{h=ri(r,-5,5);k=ri(r,-5,5);}while(!h||!k);const v=(x,y)=>`(${neg(x)}, ${neg(y)})`;const m=shuffleMC(r,v(h,k),[v(-h,k),v(h,-k),v(-h,-k)]);
     return{h:`y = (x ${h>0?'−':'+'} ${Math.abs(h)})² ${k>0?'+':'−'} ${Math.abs(k)} 的頂點是？`,mc:m.options,ans:m.ans,key:v(h,k),hint:'令括號 = 0 求頂點的 x。'};},
   r=>{let h,k;do{h=ri(r,-4,4);k=ri(r,-4,4);}while(!h||!k);const a=pick(r,[-3,-2,-1,1,2,3]);const v=(up,x,y)=>`開口${up?'向上':'向下'}，頂點 (${neg(x)}, ${neg(y)})`;
     const m=shuffleMC(r,v(a>0,h,k),[v(a<0,h,k),v(a>0,-h,k),v(a<0,-h,k)]);const as=a===1?'':a===-1?'−':neg(a);
     return{h:`y = ${as}(x ${h>0?'−':'+'} ${Math.abs(h)})² ${k>0?'+':'−'} ${Math.abs(k)} 的圖形`,mc:m.options,ans:m.ans,key:v(a>0,h,k),hint:'看 a 的正負決定開口，令括號 = 0 求頂點。'};},
   r=>{let h,k;do{h=ri(r,-4,4);k=ri(r,-4,4);}while(!h||!k);const e=(x,y)=>`y = (x ${x>0?'−':'+'} ${Math.abs(x)})² ${y>0?'+':'−'} ${Math.abs(y)}`;const m=shuffleMC(r,e(h,k),[e(-h,k),e(h,-k),e(-h,-k)]);
     return{h:`把 y = x² 的圖形向${h>0?'右':'左'}平移 ${Math.abs(h)}、向${k>0?'上':'下'}平移 ${Math.abs(k)}，新的函數是？`,mc:m.options,ans:m.ans,key:e(h,k),hint:`向右移 h → (x − h)；向上移 k → + k。`};}
  ]
};

/* ================= 第二批模組（模擬路線需要的其他關卡） ================= */
/* ---- 共用的答案檢查 ---- */
function listCheck(vals){return str=>{const parts=norm(str).replace(/[xX]\s*=/g,'').replace(/或|和/g,',').split(/[,;]/).map(x=>x.trim()).filter(Boolean);const ps=parts.map(parseNum);
  if(!parts.length||ps.some(p=>!p))return{ok:false,note:'請把答案用逗號隔開，例如 2, −3。'};
  if(ps.length!==vals.length)return{ok:false,note:`這題應該有 ${vals.length} 個答案。`};const used=[];
  for(const v of vals){const i=ps.findIndex((p,j)=>!used.includes(j)&&eq(p.v,v));if(i<0)return{ok:false};used.push(i);}return{ok:true};};}
function pairCheck(x,y,nx='x',ny='y'){if(typeof x==='number')x=R(x);if(typeof y==='number')y=R(y);return str=>{const s=norm(str);const mx=s.match(new RegExp(nx+'\\s*=\\s*(-?[\\d./]+)','i')),my=s.match(new RegExp(ny+'\\s*=\\s*(-?[\\d./]+)','i'));let a,b;
  if(mx&&my){a=parseNum(mx[1]);b=parseNum(my[1]);}else{const p=s.replace(/[()]/g,'').split(/[,\s]+/).filter(Boolean);if(p.length!==2)return{ok:false,note:`請寫成 ${nx}=5, ${ny}=2 或 (5, 2)。`};a=parseNum(p[0]);b=parseNum(p[1]);}
  if(!a||!b)return{ok:false,note:'看不懂這個寫法。'};if(eq(a.v,x)&&eq(b.v,y))return{ok:true};if(eq(a.v,y)&&eq(b.v,x))return{ok:false,note:'兩個數字的順序寫反了。'};return{ok:false};};}
function ineqCheck(op,v){return str=>{const s=norm(str).replace(/\s/g,'').replace(/>=/g,'≥').replace(/<=/g,'≤');const m=s.match(/^x(>|<|≥|≤)(-?[\d./]+)$/);
  if(!m)return{ok:false,note:'請寫成 x > 3 這樣的格式（≥ 可以打成 >=）。'};const p=parseNum(m[2]);if(!p||!eq(p.v,v))return{ok:false};
  if(m[1]!==op){const flip={'>':'<','<':'>','≥':'≤','≤':'≥'}[op];return{ok:false,note:m[1]===flip?'數字對了，但不等號方向錯了：兩邊乘或除以負數時，不等號要變向。':'不等號不對，注意有沒有「等於」。'};}return{ok:true};};}
function parseQuad(str){let t=norm(str).replace(/\s/g,'').replace(/x\^2|x²/g,'X');if(!t||!/^[-+0-9xX]+$/.test(t))return null;if(!/^[-+]/.test(t))t='+'+t;
  const terms=t.match(/[-+][0-9]*[xX]?/g);if(!terms||terms.join('')!==t)return null;let a=0,b=0,c=0;
  for(const m of terms){const sg=m[0]==='-'?-1:1,body=m.slice(1);if(!body)return null;const k=body.replace(/[xX]$/,'');const n=k===''?1:+k;if(body.endsWith('X'))a+=sg*n;else if(body.endsWith('x'))b+=sg*n;else c+=sg*n;}return{a,b,c};}
function quad(a,b,c){const t=[];if(a)t.push(a===1?'x²':a===-1?'−x²':neg(a)+'x²');if(b)t.push((t.length?(b>0?' + ':' − '):(b<0?'−':''))+(Math.abs(b)===1?'':Math.abs(b))+'x');if(c)t.push((t.length?(c>0?' + ':' − '):(c<0?'−':''))+Math.abs(c));return t.join('')||'0';}
function quadCheck(a,b,c){return str=>{const p=parseQuad(str);if(!p)return{ok:false,note:'請寫成 x² + 6x + 9 這樣（x² 可以打成 x^2）。'};
  if(p.a===a&&p.b===b&&p.c===c)return{ok:true};if(p.a===a&&p.c===c&&p.b===0&&b!==0)return{ok:false,note:'少了中間的 x 項：(x + a)² 要展開成 x² + 2ax + a²。'};return{ok:false};};}
const svgNL=(lo,hi,marks='',W=420)=>{const X=v=>20+(v-lo)*(W-40)/(hi-lo);let g=`<line x1="10" y1="50" x2="${W-10}" y2="50" stroke="#333" stroke-width="2"/>`;const step=hi-lo>12?2:1;for(let v=lo;v<=hi;v++)g+=`<line x1="${X(v)}" y1="44" x2="${X(v)}" y2="56" stroke="#333"/>`+((v-lo)%step===0||v===0?`<text x="${X(v)}" y="76" font-size="17" text-anchor="middle">${neg(v)}</text>`:'');return{g:g+marks,X};};

/* ---------- 分數乘除 ---------- */
MOD['F-muldiv']={
  goal:'會做分數乘法（先約分再乘），知道除以一個分數等於乘以它的倒數。',
  wrong:{h:`常見的錯：${F(3,4)} ÷ ${F(5,8)} 直接上下相乘，寫成 ${F(15,32)}；或是乘完沒有約分。`,why:`除法問的是「${F(3,4)} 裡面有幾個 ${F(5,8)}」。${F(5,8)} 比 ${F(3,4)} 小一點，答案應該比 1 大一點，${F(15,32)} 連 1 都不到，一定不對。`},
  concept:['分數 × 分數：分子乘分子、分母乘分母，能先約分就先約分。','除以一個分數 = 乘以它的倒數（分子分母對調）。','帶分數要先化成假分數再乘除。'],
  widget:{init:()=>({p:0}),printState:()=>({p:0}),presets:[[2,3,3,4],[1,2,4,5],[3,5,2,3]],
    render(s){const [a,b,c,d]=this.presets[s.p];const W=240,H=160,x0=100,y0=10;let g='';
      for(let i=0;i<b;i++)for(let j=0;j<d;j++){const inA=i<a,inC=j<c;g+=`<rect x="${x0+i*W/b}" y="${y0+j*H/d}" width="${W/b}" height="${H/d}" fill="${inA&&inC?'#7a5cc4':inA?'#cfe1f7':inC?'#f6d7a8':'#fff'}" stroke="#333"/>`;}
      return `<svg viewBox="0 0 440 ${H+40}" class="wsvg">${g}<text x="${x0}" y="${H+30}" font-size="16">直的取 ${a}/${b}，橫的取 ${c}/${d}</text></svg>
      <p class="wmsg">紫色是兩者重疊的部分：${a*c} 格，全部共有 ${b*d} 格，所以 ${F(a,b)} × ${F(c,d)} = ${F(a*c,b*d)}${gcd(a*c,b*d)>1?' = '+fh(R(a*c,b*d)):''}。除法就換成乘倒數：${F(a,b)} ÷ ${F(c,d)} = ${F(a,b)} × ${F(d,c)} = ${fh(R(a*d,b*c))}。</p>`;},
    controls(s){return `<div class="wctl">換一題：${this.presets.map((p,i)=>`<button class="chip" data-act="p" data-v="${i}" aria-pressed="${s.p===i}">${p[0]}/${p[1]} × ${p[2]}/${p[3]}</button>`).join('')}</div>`;},
    act(s,a,v){s.p=+v;}},
  example:{q:`${F(3,4)} ÷ ${F(5,8)} = ?`,steps:[`除以 ${F(5,8)} 改成乘以倒數 ${F(8,5)}：${F(3,4)} × ${F(8,5)}。`,`先約分：4 和 8 約成 1 和 2，變成 ${F(3,1)} × ${F(2,5)}。`,`3 × 2 = 6，1 × 5 = 5，答案 ${F(6,5)}（= 1${F(1,5)}）。`]},
  tiers:[
   r=>{const b=pick(r,[3,4,5,6,8]),d=pick(r,[3,4,5,6,9]);const a=cop(r,b),c=cop(r,d);const x=mul(R(a,b),R(c,d));return{h:`${F(a,b)} × ${F(c,d)} =`,key:ftxt(x),check:numCheck(x,{simplest:true}),hint:'分子乘分子、分母乘分母，可以先交叉約分。'};},
   r=>{const b=pick(r,[2,3,4,5,6]),d=pick(r,[3,4,5,7,8]);const a=cop(r,b),c=cop(r,d);const x=div(R(a,b),R(c,d));return{h:`${F(a,b)} ÷ ${F(c,d)} =`,key:ftxt(x),check:numCheck(x,{simplest:true}),hint:`改成乘倒數：${F(a,b)} × ${F(d,c)}。`};},
   r=>{const w=ri(r,1,3),b=pick(r,[2,3,4]),a=cop(r,b),d=pick(r,[3,4,5,6]),c=cop(r,d);const op=r()<.5;const A=R(w*b+a,b);const x=op?mul(A,R(c,d)):div(A,R(c,d));
     return{h:`${w}${F(a,b)} ${op?'×':'÷'} ${F(c,d)} =`,key:ftxt(x),check:numCheck(x,{simplest:true}),hint:`先把 ${w}${F(a,b)} 化成假分數 ${F(w*b+a,b)}${op?'':'，再乘以倒數'}。`};}]
};

/* ---------- 三角形面積 ---------- */
MOD['M-tri']={
  goal:'知道三角形面積 = 底 × 高 ÷ 2，也能由面積反推底或高。',
  wrong:{h:'常見的錯：底 10、高 6 的三角形，面積算成 60（忘記除以 2）。',why:'三角形是同底同高的長方形（或平行四邊形）的一半，所以要除以 2。'},
  concept:['三角形面積 = 底 × 高 ÷ 2。','高要和底垂直，不一定是斜邊。','反推：高 = 面積 × 2 ÷ 底。'],
  widget:{init:()=>({t:.5}),printState:()=>({t:.3}),
    render(s){const x0=60,W=300,H=140,ax=x0+W*s.t;return `<svg viewBox="0 0 440 180" class="wsvg"><rect x="${x0}" y="20" width="${W}" height="${H}" fill="#f6d7a8" stroke="#333" stroke-dasharray="5 4"/>
      <polygon points="${x0},${20+H} ${x0+W},${20+H} ${ax},20" fill="#4f8fd8" opacity=".85" stroke="#333"/><line x1="${ax}" y1="20" x2="${ax}" y2="${20+H}" stroke="#d23c3c" stroke-width="2" stroke-dasharray="4 3"/>
      <text x="${x0+W/2}" y="176" font-size="17" text-anchor="middle">底</text><text x="${ax+6}" y="${20+H/2}" font-size="17" fill="#d23c3c">高</text></svg>
      <p class="wmsg">藍色三角形的頂點不管移到哪裡，左右兩塊橘色加起來都剛好和藍色一樣大，所以三角形 = 長方形的一半 = 底 × 高 ÷ 2。</p>`;},
    controls(s){return `<div class="wctl">移動頂點：${[.1,.3,.5,.7,.9].map(v=>`<button class="chip" data-act="t" data-v="${v}" aria-pressed="${s.t===v}">${Math.round(v*10)}</button>`).join('')}</div>`;},
    act(s,a,v){s.t=+v;}},
  example:{q:'一個三角形面積 36 平方公分，底 9 公分，高是多少？',steps:['面積 = 底 × 高 ÷ 2，所以底 × 高 = 36 × 2 = 72。','高 = 72 ÷ 9 = 8 公分。','檢查：9 × 8 ÷ 2 = 36。']},
  tiers:[
   r=>{const b=ri(r,3,16),h=ri(r,2,12)*(b%2?2:1);return{h:`底 ${b} 公分、高 ${h} 公分的三角形，面積是多少平方公分？`,key:String(b*h/2),check:numCheck(R(b*h,2)),hint:`${b} × ${h} ÷ 2。`};},
   r=>{const b=ri(r,4,14),h=ri(r,3,12);const A=R(b*h,2);return{h:`三角形的面積是 ${ftxt(A).replace('/','／')==ftxt(A)?ftxt(A):fh(A)} 平方公分，底是 ${b} 公分，高是多少公分？`,key:String(h),check:numCheck(R(h)),hint:`高 = 面積 × 2 ÷ 底。`};},
   r=>{const a=ri(r,3,10),b=a+ri(r,2,8),h=ri(r,2,10)*((a+b)%2?2:1);return{h:`上底 ${a}、下底 ${b}、高 ${h} 公分的梯形，面積是多少平方公分？（提示：切成兩個三角形）`,key:String((a+b)*h/2),check:numCheck(R((a+b)*h,2)),hint:`兩個三角形：${a} × ${h} ÷ 2 和 ${b} × ${h} ÷ 2，加起來 = (${a} + ${b}) × ${h} ÷ 2。`};}]
};

/* ---------- 長方體體積 ---------- */
MOD['M-vol']={
  goal:'知道長方體體積 = 長 × 寬 × 高，會用體積求高，並認識 1 公升 = 1000 立方公分。',
  wrong:{h:'常見的錯：長 5、寬 4、高 3 的長方體，把三個數相加得到 12。',why:'體積是「可以放幾個 1 立方公分的小方塊」：底層放 5 × 4 = 20 個，疊 3 層，共 60 個。'},
  concept:['體積 = 長 × 寬 × 高（底面積 × 高）。','底層有幾個小方塊 × 疊幾層 = 總數。','1 公升 = 1000 立方公分，1 毫升 = 1 立方公分。'],
  widget:{init:()=>({l:4,w:3,h:2}),printState:()=>({l:4,w:3,h:3}),
    render(s){const u=30,dx=14,dy=10;let g='';
      for(let z=0;z<s.h;z++)for(let y=s.w-1;y>=0;y--)for(let x=0;x<s.l;x++){const X=110+x*u+y*dx,Y=200-z*u-y*dy;
        g+=`<polygon points="${X},${Y} ${X+u},${Y} ${X+u},${Y-u} ${X},${Y-u}" fill="#a9c9ef" stroke="#335"/><polygon points="${X},${Y-u} ${X+u},${Y-u} ${X+u+dx},${Y-u-dy} ${X+dx},${Y-u-dy}" fill="#cfe1f7" stroke="#335"/><polygon points="${X+u},${Y} ${X+u+dx},${Y-dy} ${X+u+dx},${Y-u-dy} ${X+u},${Y-u}" fill="#7fa9db" stroke="#335"/>`;}
      return `<svg viewBox="0 0 440 210" class="wsvg">${g}</svg><p class="wmsg">底層：長 ${s.l} × 寬 ${s.w} = ${s.l*s.w} 個；疊 ${s.h} 層 → ${s.l*s.w} × ${s.h} = <b>${s.l*s.w*s.h} 立方公分</b>。</p>`;},
    controls(s){const row=(k,lab,vals)=>`<div class="wctl">${lab}：${vals.map(v=>`<button class="chip" data-act="${k}" data-v="${v}" aria-pressed="${s[k]===v}">${v}</button>`).join('')}</div>`;return row('l','長',[2,3,4,5])+row('w','寬',[1,2,3])+row('h','高（層數）',[1,2,3,4]);},
    act(s,a,v){s[a]=+v;}},
  example:{q:'長 20、寬 15 公分的魚缸，倒入 3 公升的水，水深幾公分？',steps:['3 公升 = 3000 立方公分。','底面積 = 20 × 15 = 300 平方公分。','水深 = 3000 ÷ 300 = 10 公分。']},
  tiers:[
   r=>{const l=ri(r,2,12),w=ri(r,2,9),h=ri(r,2,8);return{h:`長 ${l}、寬 ${w}、高 ${h} 公分的長方體，體積是多少立方公分？`,key:String(l*w*h),check:numCheck(R(l*w*h)),hint:`${l} × ${w} × ${h}。`};},
   r=>{const l=ri(r,3,10),w=ri(r,2,8),h=ri(r,2,9);return{h:`長方體的體積是 ${l*w*h} 立方公分，長 ${l} 公分、寬 ${w} 公分，高是多少公分？`,key:String(h),check:numCheck(R(h)),hint:`高 = 體積 ÷（長 × 寬）= ${l*w*h} ÷ ${l*w}。`};},
   r=>{const l=pick(r,[10,20,25,30]),w=pick(r,[10,20,40]);const h=ri(r,2,15);const V=l*w*h;const ok=V%1000===0;return ok?{h:`長 ${l}、寬 ${w} 公分的水箱，倒入 ${V/1000} 公升的水，水深幾公分？`,key:String(h),check:numCheck(R(h)),hint:`${V/1000} 公升 = ${V} 立方公分，再除以底面積 ${l*w}。`}
     :{h:`長 ${l}、寬 ${w} 公分的水箱，倒入 ${V} 毫升的水，水深幾公分？`,key:String(h),check:numCheck(R(h)),hint:`1 毫升 = 1 立方公分，${V} ÷ ${l*w}。`};}]
};

/* ---------- 小數的四則運算 ---------- */
MOD['F-dec']={
  goal:'小數加減時對齊小數點，小數乘法會數小數位數，除以小數時先把除數變成整數。',
  wrong:{h:'常見的錯：2.7 + 4.85 寫成 7.12（尾巴對齊）；3.6 × 2.5 寫成 0.9 或 90。',why:'加減要對齊「小數點」才是同樣的位值相加；乘法的小數位數 = 兩個數的小數位數相加。'},
  concept:['加減：小數點對齊，空位補 0（2.70 + 4.85）。','乘法：先當整數乘，再數兩個數共有幾位小數。','除以小數：除數和被除數的小數點同時往右移，直到除數是整數。'],
  widget:{init:()=>({p:0}),printState:()=>({p:0}),
    presets:[{t:'2.7 + 4.85',rows:['&nbsp;&nbsp;2.70','+ 4.85','&nbsp;&nbsp;7.55'],m:'小數點對齊，2.7 補成 2.70，同位值相加：7.55。'},
      {t:'3.6 × 2.5',rows:['36 × 25 = 900','小數位數：1 + 1 = 2 位','900 → 9.00 = 9'],m:'先當成整數乘，再從右邊數回 2 位小數。'},
      {t:'4.2 ÷ 0.35',rows:['0.35 → 35（右移 2 位）','4.2 → 420（也右移 2 位）','420 ÷ 35 = 12'],m:'除數和被除數同時放大 100 倍，商不變。'}],
    render(s){const p=this.presets[s.p];return `<div class="steps" style="font-family:ui-monospace,monospace">${p.rows.map((r,i)=>`<div class="stp now" style="${i===2?'border-top:2px solid currentColor':''}">${r}</div>`).join('')}</div><p class="wmsg">${p.m}</p>`;},
    controls(s){return `<div class="wctl">${this.presets.map((p,i)=>`<button class="chip" data-act="p" data-v="${i}" aria-pressed="${s.p===i}">${p.t}</button>`).join('')}</div>`;},
    act(s,a,v){s.p=+v;}},
  example:{q:'1.25 × 0.4 = ?',steps:['先算 125 × 4 = 500。','小數位數：1.25 有 2 位、0.4 有 1 位，共 3 位。','500 → 0.500 = 0.5。']},
  tiers:[
   r=>{const a=ri(r,11,99)/10,b=ri(r,101,999)/100;const op=r()<.6;const x=op?a+b:Math.max(a,b)-Math.min(a,b);const A=op?a:Math.max(a,b),B=op?b:Math.min(a,b);const v=Math.round(x*100)/100;
     return{h:`${A} ${op?'+':'−'} ${B} =`,key:String(v),check:numCheck(R(Math.round(v*100),100)),hint:'小數點對齊，位數不夠的補 0。'};},
   r=>{const a=ri(r,11,99),b=ri(r,2,9),pa=pick(r,[1,2]),pb=1;const v=a*b/10**(pa+pb);return{h:`${a/10**pa} × ${b/10**pb} =`,key:String(+v.toFixed(4)),check:numCheck(R(a*b,10**(pa+pb))),hint:`先算 ${a} × ${b} = ${a*b}，小數位數共 ${pa+pb} 位。`};},
   r=>{const q=ri(r,3,40),d=pick(r,[0.2,0.4,0.5,0.25,0.15,0.35,1.5,2.5]);const n=+(q*d).toFixed(2);return{h:`${n} ÷ ${d} =`,key:String(q),check:numCheck(R(q)),hint:`除數 ${d} 變成整數：兩邊的小數點同時往右移。`};}]
};

/* ---------- 圓周長與圓面積 ---------- */
MOD['M-circle']={
  goal:'分清楚圓周長（2 × 半徑 × 圓周率）和圓面積（半徑 × 半徑 × 圓周率），不把直徑當半徑。',
  wrong:{h:'常見的錯：半徑 5 的圓面積算成 31.4（其實是周長），或算成 5 × 2 × 3.14 ÷ 2。',why:'周長是「繞一圈的長度」，單位是公分；面積是「圓裡面有多大」，單位是平方公分。面積的公式要乘兩次半徑。'},
  concept:['圓周長 = 直徑 × 圓周率 = 半徑 × 2 × 圓周率。','圓面積 = 半徑 × 半徑 × 圓周率。','題目給直徑時，先除以 2 得到半徑。'],
  widget:{init:()=>({r:3}),printState:()=>({r:3}),
    render(s){const R0=s.r*14,n=12;let g=`<circle cx="90" cy="95" r="${R0}" fill="#cfe1f7" stroke="#333"/><line x1="90" y1="95" x2="${90+R0}" y2="95" stroke="#d23c3c" stroke-width="2"/><text x="${90+R0/2}" y="90" font-size="15" text-anchor="middle" fill="#d23c3c">r=${s.r}</text>`;
      const w=Math.PI*R0/ (n/2);for(let i=0;i<n;i++){const up=i%2===0,x=200+Math.floor(i/2)*w+(up?0:w/2),y=95;
        g+=up?`<path d="M${x},${y+R0/2} L${x+w},${y+R0/2} L${x+w/2},${y-R0/2} Z" fill="${i%4?'#a9c9ef':'#7fa9db'}" stroke="#335"/>`:`<path d="M${x},${y-R0/2} L${x+w},${y-R0/2} L${x+w/2},${y+R0/2} Z" fill="${i%4===1?'#a9c9ef':'#7fa9db'}" stroke="#335"/>`;}
      const C=+(2*s.r*3.14).toFixed(2),A=+(s.r*s.r*3.14).toFixed(2);
      return `<svg viewBox="0 0 440 190" class="wsvg">${g}<text x="200" y="${95+R0/2+20}" font-size="15">長 ≈ r × 圓周率、寬 r</text></svg>
      <p class="wmsg">周長 = ${s.r} × 2 × 3.14 = <b>${C} 公分</b>　面積 = ${s.r} × ${s.r} × 3.14 = <b>${A} 平方公分</b>。把圓切成很多扇形排開，會接近長 r × 3.14、寬 r 的長方形，所以面積 = r × r × 3.14。</p>`;},
    controls(s){return `<div class="wctl">半徑：${[1,2,3,4,5].map(v=>`<button class="chip" data-act="r" data-v="${v}" aria-pressed="${s.r===v}">${v}</button>`).join('')}</div>`;},
    act(s,a,v){s.r=+v;}},
  example:{q:'直徑 10 公分的圓，面積是多少？（圓周率 3.14）',steps:['直徑 10 → 半徑 5。','面積 = 5 × 5 × 3.14。','= 25 × 3.14 = 78.5 平方公分。']},
  tiers:[
   r=>{const d=r()<.5;const v=ri(r,2,12);const C=+(d?v*3.14:2*v*3.14).toFixed(2);return{h:`${d?'直徑':'半徑'} ${v} 公分的圓，周長是多少公分？（圓周率 3.14）`,key:String(C),check:numCheck(R(Math.round(C*100),100)),hint:d?'周長 = 直徑 × 3.14。':'周長 = 半徑 × 2 × 3.14。'};},
   r=>{const v=ri(r,2,10);const A=+(v*v*3.14).toFixed(2);return{h:`半徑 ${v} 公分的圓，面積是多少平方公分？（圓周率 3.14）`,key:String(A),check:numCheck(R(Math.round(A*100),100)),hint:`${v} × ${v} × 3.14。`};},
   r=>{const v=ri(r,1,6)*2;const half=r()<.5;const A=+((v/2)**2*3.14/(half?2:1)).toFixed(2);return{h:`直徑 ${v} 公分的${half?'半圓':'圓'}，面積是多少平方公分？（圓周率 3.14）`,key:String(A),check:numCheck(R(Math.round(A*100),100)),hint:`半徑 = ${v} ÷ 2 = ${v/2}${half?'；半圓要再除以 2':''}。`};}]
};

/* ---------- 速率 ---------- */
MOD['R-rate']={
  goal:'知道「距離 = 速率 × 時間」，會求距離、時間，並換算速率的單位。',
  wrong:{h:'常見的錯：時速 60 公里，2.5 小時走多遠，算成 60 ÷ 2.5 = 24。',why:'時速 60 公里是「每 1 小時走 60 公里」，走 2.5 小時就是 2.5 個 60，要用乘法。'},
  concept:['速率 = 每單位時間走的距離（時速 60 公里 = 每小時 60 公里）。','距離 = 速率 × 時間；時間 = 距離 ÷ 速率。','換算單位：1 公里 = 1000 公尺，1 小時 = 60 分鐘。'],
  widget:{init:()=>({v:60,t:2.5}),printState:()=>({v:60,t:2.5}),
    render(s){const W=360,max=5,px=W/max;let g=`<line x1="40" y1="60" x2="${40+W}" y2="60" stroke="#999" stroke-width="2"/>`;
      for(let i=0;i<=max;i++)g+=`<line x1="${40+i*px}" y1="54" x2="${40+i*px}" y2="66" stroke="#999"/><text x="${40+i*px}" y="84" font-size="14" text-anchor="middle">${i} 時</text>`;
      for(let i=0;i<Math.ceil(s.t);i++){const w=Math.min(1,s.t-i)*px;g+=`<rect x="${40+i*px}" y="34" width="${w-2}" height="18" fill="${i%2?'#7fa9db':'#a9c9ef'}"/><text x="${40+i*px+w/2}" y="47" font-size="14" text-anchor="middle">${+(s.v*Math.min(1,s.t-i)).toFixed(1)}</text>`;}
      return `<svg viewBox="0 0 440 100" class="wsvg">${g}</svg><p class="wmsg">每 1 小時走 ${s.v} 公里，走 ${s.t} 小時：${s.v} × ${s.t} = <b>${+(s.v*s.t).toFixed(1)} 公里</b>。每一段代表 1 小時走的距離。</p>`;},
    controls(s){return `<div class="wctl">時速：${[40,60,80].map(v=>`<button class="chip" data-act="v" data-v="${v}" aria-pressed="${s.v===v}">${v}</button>`).join('')}</div><div class="wctl">時間（小時）：${[1,1.5,2.5,3,4.5].map(v=>`<button class="chip" data-act="t" data-v="${v}" aria-pressed="${s.t===v}">${v}</button>`).join('')}</div>`;},
    act(s,a,v){s[a]=+v;}},
  example:{q:'分速 250 公尺，等於時速多少公里？',steps:['1 小時 = 60 分鐘，所以 1 小時走 250 × 60 = 15000 公尺。','15000 公尺 = 15 公里。','時速 15 公里。']},
  tiers:[
   r=>{const v=pick(r,[4,5,12,15,40,45,60,72,80]),t=pick(r,[1.5,2,2.5,3,4,0.5]);return{h:`時速 ${v} 公里，走 ${t} 小時，共走多少公里？`,key:String(v*t),check:numCheck(R(Math.round(v*t*10),10)),hint:`距離 = 速率 × 時間 = ${v} × ${t}。`};},
   r=>{const v=pick(r,[40,50,60,80,90]),t=pick(r,[1.5,2,2.5,3,3.5]);return{h:`從甲地到乙地 ${v*t} 公里，汽車時速 ${v} 公里，要幾小時？`,key:String(t),check:numCheck(R(Math.round(t*10),10)),hint:`時間 = 距離 ÷ 速率 = ${v*t} ÷ ${v}。`};},
   r=>{const m=pick(r,[50,100,150,200,250,300,500]);return{h:`分速 ${m} 公尺，等於時速多少公里？`,key:String(m*60/1000),check:numCheck(R(m*60,1000)),hint:`1 小時走 ${m} × 60 公尺，再換成公里（÷ 1000）。`};}]
};

/* ---------- 比例式與正比 ---------- */
MOD['R-prop']={
  goal:'會解比例式（內項乘積 = 外項乘積），分辨正比和反比。',
  wrong:{h:'常見的錯：x : 6 = 4 : 3，算成 x = 6 × 3 ÷ 4 = 4.5（交叉相乘乘錯邊）；把正比當成「一起加多少」。',why:'比例式 a : b = c : d 的意思是兩個比值相等，所以 a × d = b × c（外項乘積 = 內項乘積）。正比是「一起乘幾倍」，不是「一起加幾」。'},
  concept:['a : b = c : d → a × d = b × c。','正比：y ÷ x 固定（y = kx），x 變 2 倍，y 也變 2 倍。','反比：x × y 固定，x 變 2 倍，y 變成一半。'],
  widget:{init:()=>({k:3,inv:false}),printState:()=>({k:3,inv:false}),
    render(s){const xs=[1,2,3,4,6];const ys=xs.map(x=>s.inv?+(12*s.k/4/x).toFixed(2):s.k*x);
      return `<table class="ptab"><tr><th>x</th>${xs.map(x=>`<td>${x}</td>`).join('')}</tr><tr><th>y</th>${ys.map(y=>`<td><b>${y}</b></td>`).join('')}</tr><tr><th>${s.inv?'x × y':'y ÷ x'}</th>${xs.map((x,i)=>`<td>${s.inv?+(x*ys[i]).toFixed(1):s.k}</td>`).join('')}</tr></table>
      <p class="wmsg">${s.inv?`反比：x × y 永遠是 ${3*s.k}。x 變大，y 就變小。`:`正比：y ÷ x 永遠是 ${s.k}，也就是 y = ${s.k}x。x 從 2 變 4（2 倍），y 從 ${2*s.k} 變 ${4*s.k}（也是 2 倍）。`}</p>`;},
    controls(s){return `<div class="wctl"><button class="chip" data-act="m" data-v="0" aria-pressed="${!s.inv}">正比</button><button class="chip" data-act="m" data-v="1" aria-pressed="${s.inv}">反比</button>　k：${[2,3,5].map(v=>`<button class="chip" data-act="k" data-v="${v}" aria-pressed="${s.k===v}">${v}</button>`).join('')}</div>`;},
    act(s,a,v){if(a==='m')s.inv=v==='1';else s.k=+v;}},
  example:{q:'x : 6 = 4 : 3，x = ?',steps:['外項是 x 和 3，內項是 6 和 4。','x × 3 = 6 × 4 = 24。','x = 24 ÷ 3 = 8。']},
  tiers:[
   r=>{const b=pick(r,[2,3,4,5,6,8]),c=ri(r,2,9),d=pick(r,[2,3,4,5]);const k=ri(r,1,4);const bb=d*k;return{h:`x : ${bb} = ${c} : ${d}，x = ?`,key:String(c*k),check:numCheck(R(c*k)),hint:`外項乘積 = 內項乘積：x × ${d} = ${bb} × ${c}。`};},
   r=>{const k=ri(r,2,9),x1=ri(r,2,6),x2=ri(r,3,12);return{h:`y 與 x 成正比，x = ${x1} 時 y = ${k*x1}。x = ${x2} 時 y = ?`,key:String(k*x2),check:numCheck(R(k*x2)),hint:`先求 y ÷ x = ${k}，所以 y = ${k}x。`};},
   r=>{const P=pick(r,[12,24,36,48,60]);const ds=[2,3,4,6,12].filter(d=>P%d===0);const x1=pick(r,ds),x2=pick(r,ds.filter(d=>d!==x1));return{h:`y 與 x 成反比，x = ${x1} 時 y = ${P/x1}。x = ${x2} 時 y = ?`,key:String(P/x2),check:numCheck(R(P,x2)),hint:`反比：x × y 固定 = ${P}。`};}]
};

/* ---------- 負數運算與乘方 ---------- */
MOD['A-neg']={
  goal:'會在數線上做正負數的加減，判斷乘除的正負號，分清楚 (−3)² 和 −3²。',
  wrong:{h:'常見的錯：−3² = 9；(−12) ÷ (−3) × (−2) 算成 −2；把 −5 當成比 −2 大。',why:'−3² 的指數只作用在 3 上，意思是 −(3 × 3) = −9；(−3)² 才是 (−3) × (−3) = 9。在數線上，越往左越小，所以 −5 < −2。'},
  concept:['數線上越右邊越大：−5 < −2 < 0 < 3。','加一個正數往右走，加一個負數（或減一個正數）往左走。','乘除：同號得正、異號得負；負號的個數是奇數，結果就是負的。','−a² = −(a × a)，(−a)² = (−a) × (−a)。'],
  widget:{init:()=>({a:-3,op:'+',b:5}),printState:()=>({a:-3,op:'-',b:4}),
    render(s){const res=s.op==='+'?s.a+s.b:s.a-s.b;const N=svgNL(-10,10);const x1=N.X(s.a),x2=N.X(res);
      const mk=`<circle cx="${x1}" cy="50" r="6" fill="#4f8fd8"/><circle cx="${x2}" cy="50" r="6" fill="#d23c3c"/><path d="M${x1},36 Q${(x1+x2)/2},${10} ${x2},36" fill="none" stroke="#d23c3c" stroke-width="2" marker-end="url(#ar)"/>`;
      return `<svg viewBox="0 0 440 92" class="wsvg"><defs><marker id="ar" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#d23c3c"/></marker></defs>${N.g}${mk}</svg>
      <p class="wmsg">從 ${neg(s.a)} 出發，${s.op==='+'?(s.b>=0?'加正數往右':'加負數往左'):(s.b>=0?'減正數往左':'減負數 = 加正數，往右')}走 ${Math.abs(s.b)} 格，到 <b>${neg(res)}</b>。</p>`;},
    controls(s){return `<div class="wctl">起點：${[-6,-3,0,2].map(v=>`<button class="chip" data-act="a" data-v="${v}" aria-pressed="${s.a===v}">${neg(v)}</button>`).join('')}</div>
      <div class="wctl">運算：<button class="chip" data-act="op" data-v="+" aria-pressed="${s.op==='+'}">加</button><button class="chip" data-act="op" data-v="-" aria-pressed="${s.op==='-'}">減</button>　${[5,4,-2,-4].map(v=>`<button class="chip" data-act="b" data-v="${v}" aria-pressed="${s.b===v}">${v<0?'('+neg(v)+')':v}</button>`).join('')}</div>`;},
    act(s,a,v){if(a==='op')s.op=v;else s[a]=+v;if(Math.abs(s.op==='+'?s.a+s.b:s.a-s.b)>10)s.b=s.b>0?2:-2;}},
  example:{q:'(−2)³ − (−4)² ÷ 8 = ?',steps:['乘方先算：(−2)³ = −8（三個負號 → 負），(−4)² = 16。','再算除法：16 ÷ 8 = 2，變成 −8 − 2。','−8 − 2 = −10。']},
  tiers:[
   r=>{const a=ri(r,-15,15),b=ri(r,1,15);const t=pick(r,['+-','--','-+']);const exp=t==='+-'?`${neg(a)} + (−${b})`:t==='--'?`${neg(a)} − (−${b})`:`${neg(a)} − ${b}`;const v=t==='--'?a+b:a-b;
     return{h:`${exp} =`,key:neg(v),check:numCheck(R(v)),hint:t==='--'?'減一個負數 = 加一個正數。':'加負數、減正數，都是在數線上往左走。'};},
   r=>{const k=pick(r,[0,1,2]);if(k===0){const a=ri(r,2,6);const neg1=r()<.5;return{h:`${neg1?'−'+a+'²':'(−'+a+')²'} =`,key:neg(neg1?-a*a:a*a),check:numCheck(R(neg1?-a*a:a*a)),hint:'看指數作用在誰身上：有括號才是整個 (−a) 自乘。'};}
     const a=ri(r,2,6),b=ri(r,2,5),c=ri(r,2,4);const sa=pick(r,[1,-1]),sb=pick(r,[1,-1]),sc=pick(r,[1,-1]);const A=sa*a*b,B=sb*b,C=sc*c;const v=A/B*C;
     const p=n=>n<0?`(${neg(n)})`:String(n);return{h:`${p(A)} ÷ ${p(B)} × ${p(C)} =`,key:neg(v),check:numCheck(R(v)),hint:'乘除由左到右；先數負號個數決定正負。'};},
   r=>{const p=R(pick(r,[-1,-2,-3,1]),pick(r,[2,3,4]));const q=R(1,pick(r,[2,3]));const t=R(-pick(r,[1,2,3,4]),pick(r,[3,5]));const v=add(p,mul(q,t));
     return{h:`(${fh(p)}) + ${fh(q)} × (${fh(t)}) =`,key:ftxt(v),check:numCheck(v,{simplest:true}),hint:'先乘後加，注意正負號。'};}]
};

/* ---------- 指數律 ---------- */
MOD['A-exp']={
  goal:'用「數有幾個相乘」理解指數律，會用科學記號表示很大或很小的數。',
  wrong:{h:'常見的錯：2³ × 2⁴ = 2¹²（指數相乘）或 4⁷（底數相乘）。',why:'2³ 是 3 個 2 相乘，2⁴ 是 4 個 2 相乘，合起來是 3 + 4 = 7 個 2 相乘，所以是 2⁷。'},
  concept:['aᵐ × aⁿ = aᵐ⁺ⁿ（個數相加）。','aᵐ ÷ aⁿ = aᵐ⁻ⁿ（個數相減）。','(aᵐ)ⁿ = aᵐˣⁿ（m 個一組，共 n 組）。','科學記號：a × 10ⁿ，1 ≤ a < 10。'],
  widget:{init:()=>({m:3,n:4}),printState:()=>({m:3,n:4}),
    render(s){const box=(k,col)=>Array.from({length:k},()=>`<span style="display:inline-block;min-width:26px;padding:3px 0;margin:2px;border-radius:5px;background:${col};text-align:center;color:#111">2</span>`).join('×');
      return `<div style="font-size:16px;line-height:2">2<sup>${s.m}</sup> × 2<sup>${s.n}</sup> = ${box(s.m,'#cfe1f7')} × ${box(s.n,'#f6d7a8')}</div><p class="wmsg">藍色 ${s.m} 個 2、橘色 ${s.n} 個 2，一共 ${s.m+s.n} 個 2 相乘，所以 2<sup>${s.m}</sup> × 2<sup>${s.n}</sup> = <b>2<sup>${s.m+s.n}</sup></b>，不是 2<sup>${s.m*s.n}</sup>。</p>`;},
    controls(s){return `<div class="wctl">左邊：${[2,3,4].map(v=>`<button class="chip" data-act="m" data-v="${v}" aria-pressed="${s.m===v}">2^${v}</button>`).join('')}　右邊：${[2,3,4,5].map(v=>`<button class="chip" data-act="n" data-v="${v}" aria-pressed="${s.n===v}">2^${v}</button>`).join('')}</div>`;},
    act(s,a,v){s[a]=+v;}},
  example:{q:'(3 × 10⁴) × (2 × 10³) = ?',steps:['前面的數相乘：3 × 2 = 6。','10 的次方相乘，指數相加：10⁴ × 10³ = 10⁷。','答案 6 × 10⁷。']},
  tiers:[
   r=>{const b=pick(r,[2,3,5,7,'a']),m=ri(r,2,6),n=ri(r,2,6);return{h:`${b}<sup>${m}</sup> × ${b}<sup>${n}</sup> = ${b}<sup>□</sup>，□ = ?`,key:String(m+n),check:numCheck(R(m+n)),hint:'個數相加。'};},
   r=>{const b=pick(r,[2,3,5,'x']);if(r()<.5){const m=ri(r,6,12),n=ri(r,2,5);return{h:`${b}<sup>${m}</sup> ÷ ${b}<sup>${n}</sup> = ${b}<sup>□</sup>，□ = ?`,key:String(m-n),check:numCheck(R(m-n)),hint:'相除時個數相減。'};}
     const m=ri(r,2,5),n=ri(r,2,4);return{h:`(${b}<sup>${m}</sup>)<sup>${n}</sup> = ${b}<sup>□</sup>，□ = ?`,key:String(m*n),check:numCheck(R(m*n)),hint:`${m} 個一組，共 ${n} 組。`};},
   r=>{if(r()<.5){const a=ri(r,2,4),b=ri(r,2,2),m=ri(r,2,6),n=ri(r,2,5);return{h:`(${a} × 10<sup>${m}</sup>) × (${b} × 10<sup>${n}</sup>) = ${a*b} × 10<sup>□</sup>，□ = ?`,key:String(m+n),check:numCheck(R(m+n)),hint:'10 的次方相乘，指數相加。'};}
     const d=ri(r,11,99),k=ri(r,2,5);const num='0.'+'0'.repeat(k-1)+d;return{h:`${num} 用科學記號寫成 ${(d/10).toFixed(1)} × 10<sup>□</sup>，□ = ?`,key:String(-k),check:numCheck(R(-k)),hint:'小數點往右移幾位，指數就是負幾。'};}]
};

/* ---------- 二元一次聯立方程式 ---------- */
MOD['A-sys']={
  goal:'會用加減消去法和代入消去法解二元一次聯立方程式，並把解代回檢查。',
  wrong:{h:'常見的錯：x + y = 7、x − y = 3 兩式相加得 2x = 10 後，寫成 x = 10；或把 x、y 寫反。',why:'2x = 10 代表兩個 x 是 10，還要除以 2；求出 x 以後，再代回其中一式求 y，最後兩式都要檢查。'},
  concept:['目標：把兩個未知數消掉一個，變成一元一次方程式。','加減消去：兩式相加或相減，讓某個未知數的係數變成 0（必要時先把一式乘上某數）。','代入消去：把「y = …」代進另一式。','解出來後代回兩式檢查。'],
  widget:{init:()=>({k:0,step:0}),printState:()=>({k:0,step:3}),
    sets:[{e:['x + y = 7','x − y = 3'],s:['兩式相加：y 和 −y 抵消','2x = 10 → x = 5','代回第一式：5 + y = 7 → y = 2'],a:'(5, 2)'},
          {e:['2x + 3y = 12','3x − y = 7'],s:['第二式乘 3：9x − 3y = 21','和第一式相加：11x = 33 → x = 3','代回：3·3 − y = 7 → y = 2'],a:'(3, 2)'},
          {e:['y = 2x + 1','3x + y = 11'],s:['把 y = 2x + 1 代入第二式','3x + (2x + 1) = 11 → 5x = 10 → x = 2','y = 2·2 + 1 = 5'],a:'(2, 5)'}],
    render(s){const q=this.sets[s.k];return `<div style="font-size:19px;border-left:4px solid #4f8fd8;padding-left:12px">${q.e.map(x=>`<div>${x}</div>`).join('')}</div>
      <div class="steps" style="margin-top:8px">${q.s.slice(0,s.step).map(x=>`<div class="stp now">${x}</div>`).join('')}</div><p class="wmsg">${s.step>=3?`解是 x、y = ${q.a}。代回兩個式子都成立。`:'按「下一步」看怎麼消去一個未知數。'}</p>`;},
    controls(s){return `<div class="wctl">${s.step<3?'<button class="chip big" data-act="n">下一步</button>':''}${this.sets.map((q,i)=>`<button class="chip" data-act="k" data-v="${i}" aria-pressed="${s.k===i}">第 ${i+1} 組</button>`).join('')}</div>`;},
    act(s,a,v){if(a==='n')s.step++;else{s.k=+v;s.step=0;}}},
  example:{q:'解 x + 2y = 8、3x − 2y = 8',steps:['兩式相加，2y 和 −2y 抵消：4x = 16，x = 4。','代回第一式：4 + 2y = 8，y = 2。','檢查第二式：12 − 4 = 8 ✓。答案 x = 4, y = 2。']},
  tiers:[
   r=>{const x=ri(r,-3,9),y=ri(r,-3,9);return{h:`解聯立方程式：x + y = ${neg(x+y)}，x − y = ${neg(x-y)}（寫成 x=…, y=…）`,key:`x = ${x}, y = ${y}`,check:pairCheck(x,y),hint:'兩式相加消去 y。'};},
   r=>{const x=ri(r,-2,6),y=ri(r,-3,9);const m=ri(r,2,4),b=y-m*x,p=ri(r,1,4);return{h:`解聯立方程式：y = ${m}x${b?sgn(b):''}，${p}x + y = ${neg(p*x+y)}（寫成 x=…, y=…）`,key:`x = ${x}, y = ${y}`,check:pairCheck(x,y),hint:`把 y = ${m}x${b?sgn(b):''} 代入第二式。`};},
   r=>{let a,b,c,d,x,y;do{a=ri(r,1,4);b=ri(r,1,4);c=ri(r,1,4);d=-ri(r,1,3);x=ri(r,-3,6);y=ri(r,-3,6);}while(a*d-b*c===0);
     const L=(p,q)=>`${p===1?'':p}x ${q<0?'−':'+'} ${Math.abs(q)===1?'':Math.abs(q)}y`;return{h:`解聯立方程式：${L(a,b)} = ${neg(a*x+b*y)}，${L(c,d)} = ${neg(c*x+d*y)}（寫成 x=…, y=…）`,key:`x = ${x}, y = ${y}`,check:pairCheck(x,y),hint:'先把一式乘上某數，讓 y 的係數相反，再相加。'};}]
};

/* ---------- 坐標與直線 ---------- */
MOD['N-coord']={
  goal:'會判斷點在哪個象限，找出直線 y = ax + b 和兩軸的交點，判斷點是否在直線上。',
  wrong:{h:'常見的錯：(−3, 4) 說在第四象限（x、y 搞混）；y = 2x − 3 和 y 軸的交點寫成 (−3, 0)。',why:'坐標寫成 (x, y)：先左右、再上下。和 y 軸相交的點在 y 軸上，x 一定是 0，所以是 (0, b)。'},
  concept:['(x, y)：x 是左右（右正左負），y 是上下（上正下負）。','象限：右上一、左上二、左下三、右下四。','和 y 軸的交點：令 x = 0，得到 (0, b)；和 x 軸的交點：令 y = 0。'],
  widget:{init:()=>({x:-3,y:4,a:2,b:-3}),printState:()=>({x:-3,y:4,a:2,b:-3}),
    render(s){const S=18,O=150,X=v=>O+v*S,Y=v=>O-v*S;let g='';for(let i=-7;i<=7;i++)g+=`<line x1="${X(i)}" y1="${Y(7.5)}" x2="${X(i)}" y2="${Y(-7.5)}" stroke="#e5e8ee"/><line x1="${X(-7.5)}" y1="${Y(i)}" x2="${X(7.5)}" y2="${Y(i)}" stroke="#e5e8ee"/>`;
      g+=`<line x1="${X(-8)}" y1="${O}" x2="${X(8)}" y2="${O}" stroke="#666"/><line x1="${O}" y1="${Y(8)}" x2="${O}" y2="${Y(-8)}" stroke="#666"/><text x="${X(4)}" y="${Y(6)}" fill="#999" font-size="17">一</text><text x="${X(-5)}" y="${Y(6)}" fill="#999" font-size="17">二</text><text x="${X(-5)}" y="${Y(-5)}" fill="#999" font-size="17">三</text><text x="${X(4)}" y="${Y(-5)}" fill="#999" font-size="17">四</text>`;
      const x1=-8,x2=8;g+=`<line x1="${X(x1)}" y1="${Y(s.a*x1+s.b)}" x2="${X(x2)}" y2="${Y(s.a*x2+s.b)}" stroke="#d23c3c" stroke-width="2.5"/><circle cx="${X(0)}" cy="${Y(s.b)}" r="5" fill="#d23c3c"/>`;
      g+=`<line x1="${X(s.x)}" y1="${O}" x2="${X(s.x)}" y2="${Y(s.y)}" stroke="#4f8fd8" stroke-dasharray="3 3"/><line x1="${O}" y1="${Y(s.y)}" x2="${X(s.x)}" y2="${Y(s.y)}" stroke="#4f8fd8" stroke-dasharray="3 3"/><circle cx="${X(s.x)}" cy="${Y(s.y)}" r="6" fill="#4f8fd8"/>`;
      const q=s.x>0&&s.y>0?'第一':s.x<0&&s.y>0?'第二':s.x<0&&s.y<0?'第三':s.x>0&&s.y<0?'第四':'坐標軸上';
      return `<div class="graphwrap"><svg viewBox="0 0 300 300" class="wsvg sq" style="overflow:hidden">${g}</svg><div><p class="wmsg">藍點 (${neg(s.x)}, ${neg(s.y)})：先往${s.x<0?'左':'右'} ${Math.abs(s.x)} 格，再往${s.y<0?'下':'上'} ${Math.abs(s.y)} 格，在<b>${q}${q.endsWith('上')?'':'象限'}</b>。</p><p class="wmsg">紅線 y = ${s.a}x${sgn(s.b)}：令 x = 0 得 y = ${neg(s.b)}，和 y 軸交在 <b>(0, ${neg(s.b)})</b>。</p></div></div>`;},
    controls(s){return `<div class="wctl">藍點：${[[-3,4],[3,4],[-2,-5],[4,-2]].map(([x,y])=>`<button class="chip" data-act="p" data-v="${x},${y}" aria-pressed="${s.x===x&&s.y===y}">(${neg(x)}, ${neg(y)})</button>`).join('')}</div>
      <div class="wctl">紅線：${[[2,-3],[1,2],[-1,4]].map(([a,b])=>`<button class="chip" data-act="l" data-v="${a},${b}" aria-pressed="${s.a===a&&s.b===b}">y = ${a===1?'':a===-1?'−':a}x${sgn(b)}</button>`).join('')}</div>`;},
    act(s,a,v){const [p,q]=v.split(',').map(Number);if(a==='p'){s.x=p;s.y=q;}else{s.a=p;s.b=q;}}},
  example:{q:'直線 y = −2x + 6 和兩軸的交點？',steps:['和 y 軸：令 x = 0，y = 6 → (0, 6)。','和 x 軸：令 y = 0，0 = −2x + 6，x = 3 → (3, 0)。','畫圖時把這兩點連起來就是這條直線。']},
  tiers:[
   r=>{let x,y;do{x=ri(r,-8,8);y=ri(r,-8,8);}while(!x||!y);const q=x>0&&y>0?0:x<0&&y>0?1:x<0?2:3;const names=['第一象限','第二象限','第三象限','第四象限'];
     return{h:`點 (${neg(x)}, ${neg(y)}) 在哪一個象限？`,mc:names,ans:q,key:names[q],hint:'先看 x 的正負（左右），再看 y 的正負（上下）。'};},
   r=>{const a=pick(r,[-3,-2,-1,2,3,4]),b=ri(r,-8,8)||5;return{h:`直線 y = ${a===1?'':a===-1?'−':neg(a)}x${sgn(b)} 和 y 軸的交點坐標是？（寫成 (x, y)）`,key:`(0, ${neg(b)})`,check:pairCheck(0,b,'x','y'),hint:'在 y 軸上的點，x = 0。'};},
   r=>{const a=pick(r,[-3,-2,2,3]),x0=ri(r,-4,4),b=ri(r,-6,6);return{h:`直線 y = ${neg(a)}x${b?sgn(b):''} 和 x 軸的交點坐標是？（寫成 (x, y)）`,key:`(${ftxt(R(-b,a))}, 0)`,check:pairCheck(R(-b,a),R(0),'x','y'),hint:'在 x 軸上的點，y = 0，解 0 = ax + b。'};}]
};

/* ---------- 一元一次不等式 ---------- */
MOD['A-ineq']={
  goal:'會解一元一次不等式，特別是乘或除以負數時，不等號要變向，並能在數線上表示解。',
  wrong:{h:'常見的錯：−2x > 6，兩邊除以 −2 得到 x > −3。',why:'2 < 5，兩邊乘以 −1 變成 −2 和 −5，在數線上 −2 在 −5 的右邊，所以 −2 > −5：大小關係反過來了。因此除以 −2 時，不等號要變向：x < −3。'},
  concept:['不等式兩邊同加、同減一個數，不等號不變。','兩邊同乘、同除一個正數，不等號不變。','兩邊同乘、同除一個負數，不等號要變向。','數線上：> 或 < 用空心圓，≥ 或 ≤ 用實心圓。'],
  widget:{init:()=>({flip:false}),printState:()=>({flip:true}),
    render(s){const N=svgNL(-6,6);const a=s.flip?-2:2,b=s.flip?-5:5;const mk=`<circle cx="${N.X(a)}" cy="50" r="7" fill="#4f8fd8"/><circle cx="${N.X(b)}" cy="50" r="7" fill="#e39b3b"/><text x="${N.X(a)}" y="30" font-size="17" text-anchor="middle">${neg(a)}</text><text x="${N.X(b)}" y="30" font-size="17" text-anchor="middle">${neg(b)}</text>`;
      return `<svg viewBox="0 0 440 90" class="wsvg">${N.g}${mk}</svg><p class="wmsg">${s.flip?'兩邊乘以 −1：−2 和 −5。−2 在右邊，所以 <b>−2 > −5</b>，不等號變向了。':'原本：2 < 5（藍點在橘點左邊）。按「兩邊乘以 −1」看看會怎樣。'}</p>`;},
    controls(s){return `<div class="wctl"><button class="chip big" data-act="f">${s.flip?'回到 2 < 5':'兩邊乘以 −1'}</button></div>`;},
    act(s){s.flip=!s.flip;}},
  example:{q:'解 3 − 2x ≥ 11',steps:['兩邊減 3：−2x ≥ 8。','兩邊除以 −2，不等號變向：x ≤ −4。','數線上在 −4 畫實心圓，往左畫。']},
  tiers:[
   r=>{const a=ri(r,-9,9)||4,c=ri(r,-9,9);const op=pick(r,['>','<','≥','≤']);return{h:`解不等式：x${sgn(a)} ${op} ${neg(c+a)}（寫成 x > 3 的形式）`,key:`x ${op} ${neg(c)}`,check:ineqCheck(op,R(c)),hint:`兩邊${a>0?'減':'加'} ${Math.abs(a)}，不等號不變。`};},
   r=>{const a=pick(r,[-5,-4,-3,-2,2,3,4]),c=ri(r,-6,6);const op=pick(r,['>','<','≥','≤']);const flip={'>':'<','<':'>','≥':'≤','≤':'≥'};const op2=a<0?flip[op]:op;
     return{h:`解不等式：${neg(a)}x ${op} ${neg(a*c)}（寫成 x > 3 的形式）`,key:`x ${op2} ${neg(c)}`,check:ineqCheck(op2,R(c)),hint:a<0?`兩邊除以 ${neg(a)}，是負數，不等號要變向。`:`兩邊除以 ${a}，不等號不變。`};},
   r=>{const a=pick(r,[-4,-3,-2,2,3]),b=ri(r,1,5),c=ri(r,-4,6);const op=pick(r,['>','≤']);const flip={'>':'<','≤':'≥'};const op2=a<0?flip[op]:op;const k=ri(r,-5,5);const rhs=a*(c-b)+k;
     return{h:`解不等式：${neg(a)}(x − ${b})${k?sgn(k):''} ${op} ${neg(rhs)}（寫成 x > 3 的形式）`,key:`x ${op2} ${neg(c)}`,check:ineqCheck(op2,R(c)),hint:`先移項、去括號（${neg(a)} 要乘到兩項），最後除以 ${neg(a)}${a<0?'，記得變向':''}。`};}]
};

/* ---------- 乘法公式與因式分解 ---------- */
MOD['A-poly']={
  goal:'會用 (a + b)² = a² + 2ab + b²、(a + b)(a − b) = a² − b² 展開，也能反過來因式分解。',
  wrong:{h:'常見的錯：(x + 3)² = x² + 9；x² − 9 分解成 (x − 3)²。',why:'(x + 3)² 是 (x + 3)(x + 3)，畫成正方形會有四塊：x²、3x、3x、9，中間兩塊不能漏。(x − 3)² 展開是 x² − 6x + 9，不是 x² − 9。'},
  concept:['(a + b)² = a² + 2ab + b²；(a − b)² = a² − 2ab + b²。','(a + b)(a − b) = a² − b²（平方差）。','因式分解是展開的相反：看到 x² − 9 = x² − 3²，就是 (x + 3)(x − 3)。'],
  widget:{init:()=>({b:3}),printState:()=>({b:3}),
    render(s){const x=120,u=22,b=s.b*u,x0=60,y0=15;
      return `<svg viewBox="0 0 440 ${x+b+46}" class="wsvg"><rect x="${x0}" y="${y0}" width="${x}" height="${x}" fill="#cfe1f7" stroke="#333"/><rect x="${x0+x}" y="${y0}" width="${b}" height="${x}" fill="#f6d7a8" stroke="#333"/><rect x="${x0}" y="${y0+x}" width="${x}" height="${b}" fill="#f6d7a8" stroke="#333"/><rect x="${x0+x}" y="${y0+x}" width="${b}" height="${b}" fill="#b9e3c6" stroke="#333"/>
      <text x="${x0+x/2}" y="${y0+x/2+5}" font-size="19" text-anchor="middle">x²</text><text x="${x0+x+b/2}" y="${y0+x/2+5}" font-size="17" text-anchor="middle">${s.b}x</text><text x="${x0+x/2}" y="${y0+x+b/2+5}" font-size="17" text-anchor="middle">${s.b}x</text><text x="${x0+x+b/2}" y="${y0+x+b/2+5}" font-size="17" text-anchor="middle">${s.b*s.b}</text>
      <text x="${x0+x/2}" y="${y0+x+b+22}" font-size="16" text-anchor="middle">x</text><text x="${x0+x+b/2}" y="${y0+x+b+22}" font-size="16" text-anchor="middle">${s.b}</text></svg>
      <p class="wmsg">邊長 x + ${s.b} 的正方形，面積 = x² + ${s.b}x + ${s.b}x + ${s.b*s.b} = <b>x² + ${2*s.b}x + ${s.b*s.b}</b>。兩塊橘色長方形就是常被漏掉的「2ab」。</p>`;},
    controls(s){return `<div class="wctl">(x + b)²，b = ${[1,2,3,4].map(v=>`<button class="chip" data-act="b" data-v="${v}" aria-pressed="${s.b===v}">${v}</button>`).join('')}</div>`;},
    act(s,a,v){s.b=+v;}},
  example:{q:'展開 (2x − 5)²',steps:['套用 (a − b)² = a² − 2ab + b²，a = 2x，b = 5。','a² = 4x²，2ab = 2 × 2x × 5 = 20x，b² = 25。','答案 4x² − 20x + 25。']},
  tiers:[
   r=>{const b=ri(r,1,9)*pick(r,[1,-1]);return{h:`展開：(x ${b>0?'+':'−'} ${Math.abs(b)})² =`,key:quad(1,2*b,b*b),check:quadCheck(1,2*b,b*b),hint:`x² ${b>0?'+':'−'} 2 × ${Math.abs(b)} × x + ${b*b}。`};},
   r=>{const b=ri(r,1,9),k=pick(r,[1,1,2,3]);return{h:`展開：(${k===1?'':k}x + ${b})(${k===1?'':k}x − ${b}) =`,key:quad(k*k,0,-b*b),check:quadCheck(k*k,0,-b*b),hint:'平方差：a² − b²，中間項會抵消。'};},
   r=>{const b=ri(r,2,9);const t=pick(r,[0,1,2]);const P=t===0?quad(1,0,-b*b):t===1?quad(1,2*b,b*b):quad(1,-2*b,b*b);const ans=t===0?`(x + ${b})(x − ${b})`:t===1?`(x + ${b})²`:`(x − ${b})²`;
     const opts=[`(x + ${b})(x − ${b})`,`(x + ${b})²`,`(x − ${b})²`,`(x − ${b*b})(x + 1)`];const m=shuffleMC(r,ans,opts.filter(o=>o!==ans));return{h:`因式分解：${P} =`,mc:m.options,ans:m.ans,key:ans,hint:'看常數項和中間項：只有兩項而且相減是平方差。'};}]
};

/* ---------- 平方根與根式 ---------- */
MOD['A-root']={
  goal:'分清楚「a 的平方根」（有正負兩個）和 √a（正的那個），會化簡根式並合併同類方根。',
  wrong:{h:'常見的錯：16 的平方根只寫 4；√8 + √18 寫成 √26。',why:'平方後等於 16 的數有 4 和 −4 兩個，√16 只代表正的 4。根號不能直接相加，就像 2 個蘋果 + 3 個香蕉不能變成 5 個水果一樣，要先化成同一種「√2」才能合併。'},
  concept:['a 的平方根是 ±√a；√a 只表示正的平方根。','化簡：把根號裡的完全平方數拿出來，√18 = √(9 × 2) = 3√2。','同類方根（根號裡一樣）才能相加減：2√2 + 3√2 = 5√2。'],
  widget:{init:()=>({n:18}),printState:()=>({n:18}),
    render(s){let k=1;for(let i=2;i*i<=s.n;i++)if(s.n%(i*i)===0)k=i;const rest=s.n/(k*k);
      return `<div style="font-size:22px">√${s.n} = √(${k*k} × ${rest}) = √${k*k} × √${rest} = <b>${k===1?'':k}${rest===1?'':'√'+rest}${rest===1&&k===1?'1':''}</b></div>
      <p class="wmsg">${k===1?`${s.n} 裡面沒有大於 1 的完全平方數因數，不能再化簡。`:`在 ${s.n} 裡找最大的完全平方數因數 ${k*k}（= ${k}²），把 ${k} 拿到根號外面。`}</p>`;},
    controls(s){return `<div class="wctl">${[8,12,18,20,27,48,50,72].map(v=>`<button class="chip" data-act="n" data-v="${v}" aria-pressed="${s.n===v}">√${v}</button>`).join('')}</div>`;},
    act(s,a,v){s.n=+v;}},
  example:{q:'√48 − √27 + 2√75 = ?',steps:['化簡：√48 = 4√3，√27 = 3√3，√75 = 5√3。','2√75 = 10√3。','4√3 − 3√3 + 10√3 = 11√3。']},
  tiers:[
   r=>{const a=ri(r,2,15);const m=shuffleMC(r,`±${a}`,[`${a}`,`${a*a*2}`,`±${a*2}`]);return{h:`${a*a} 的平方根是？`,mc:m.options,ans:m.ans,key:`±${a}`,hint:'平方後等於它的數，有正負兩個。'};},
   r=>{let k,p;do{k=ri(r,2,6);p=pick(r,[2,3,5,6,7]);}while(k===p);const n=k*k*p;const m=shuffleMC(r,`${k}√${p}`,[`${p}√${k}`,`${k*k}√${p}`,`√${n}`]);return{h:`把 √${n} 化成最簡根式：`,mc:m.options,ans:m.ans,key:`${k}√${p}`,hint:`${n} = ${k*k} × ${p}。`};},
   r=>{let p,a,b;do{p=pick(r,[2,3,5]);a=ri(r,2,4);b=ri(r,2,5);}while(a*b===a+b);const A=a*a*p,B=b*b*p;const m=shuffleMC(r,`${a+b}√${p}`,[`√${A+B}`,`${a*b}√${p}`,`${a+b}√${2*p}`]);return{h:`√${A} + √${B} = ？`,mc:m.options,ans:m.ans,key:`${a+b}√${p}`,hint:`先化簡：√${A} = ${a}√${p}，√${B} = ${b}√${p}。`};}]
};

/* ---------- 畢氏定理與特殊直角三角形 ---------- */
MOD['G-pyth']={
  goal:'會用畢氏定理求直角三角形的邊長，判斷三邊能不能構成直角三角形，認識 30°-60°-90° 和 45°-45°-90° 的邊長比。',
  wrong:{h:'常見的錯：斜邊 10、30° 角的對邊算成 5√3；6、8、12 也當成直角三角形。',why:'30°-60°-90° 的邊長比是 1 : √3 : 2，最短的邊對最小的角（30°），是斜邊的一半。判斷直角三角形要檢查「兩短邊平方和 = 最長邊平方」：36 + 64 = 100 ≠ 144。'},
  concept:['直角三角形：兩股的平方和 = 斜邊的平方（a² + b² = c²）。','反過來，三邊滿足 a² + b² = c²，就是直角三角形。','30°-60°-90°：1 : √3 : 2；45°-45°-90°：1 : 1 : √2。'],
  widget:{init:()=>({p:0}),printState:()=>({p:0}),presets:[[3,4,5],[5,12,13],[6,8,10]],
    render(s){const [a,b,c]=this.presets[s.p];const u=120/b;const A=a*u,B=b*u,x0=40+A,y0=A+20;
      return `<svg viewBox="0 0 440 ${y0+B+10}" class="wsvg"><rect x="${x0-A}" y="${y0-A}" width="${A}" height="${A}" fill="#f6d7a8" stroke="#333"/><rect x="${x0}" y="${y0}" width="${B}" height="${B}" fill="#cfe1f7" stroke="#333"/>
      <polygon points="${x0},${y0} ${x0+B},${y0} ${x0},${y0-A}" fill="#fff" stroke="#d23c3c" stroke-width="2.5"/><text x="${x0-A/2}" y="${y0-A/2+5}" font-size="16" text-anchor="middle">${a}²=${a*a}</text><text x="${x0+B/2}" y="${y0+B/2+5}" font-size="16" text-anchor="middle">${b}²=${b*b}</text><text x="${x0+B/2+14}" y="${y0-A/2-4}" font-size="17" fill="#d23c3c">斜邊 ${c}</text></svg>
      <p class="wmsg">兩股 ${a}、${b}：${a}² + ${b}² = ${a*a} + ${b*b} = ${c*c} = ${c}²，所以斜邊是 <b>${c}</b>。兩個正方形的面積加起來，會等於斜邊上的正方形。</p>`;},
    controls(s){return `<div class="wctl">${this.presets.map((p,i)=>`<button class="chip" data-act="p" data-v="${i}" aria-pressed="${s.p===i}">${p.join('、')}</button>`).join('')}</div>`;},
    act(s,a,v){s.p=+v;}},
  example:{q:'直角三角形斜邊 13，一股 5，另一股是多少？',steps:['設另一股為 x：5² + x² = 13²。','25 + x² = 169，x² = 144。','x = 12（邊長取正）。']},
  tiers:[
   r=>{const t=pick(r,[[3,4,5],[5,12,13],[8,15,17],[7,24,25],[6,8,10],[9,12,15]]);return{h:`直角三角形兩股長 ${t[0]}、${t[1]}，斜邊長是多少？`,key:String(t[2]),check:numCheck(R(t[2])),hint:`${t[0]}² + ${t[1]}² = 斜邊²。`};},
   r=>{const t=pick(r,[[3,4,5],[5,12,13],[8,15,17],[7,24,25],[9,40,41],[12,16,20]]);return{h:`直角三角形斜邊長 ${t[2]}，一股長 ${t[0]}，另一股長是多少？`,key:String(t[1]),check:numCheck(R(t[1])),hint:`另一股² = ${t[2]}² − ${t[0]}²。`};},
   r=>{const h=pick(r,[4,6,8,10,12]);const t=r()<.5;if(t){const m=shuffleMC(r,String(h/2),[`${h/2}√3`,`${h}√3`,String(h*2)]);return{h:`直角三角形中有一個角是 30°，斜邊長 ${h}，30° 角所對的邊長是？`,mc:m.options,ans:m.ans,key:String(h/2),hint:'30°-60°-90° 的邊長比 1 : √3 : 2，30° 對最短邊。'};}
     const k=h/2;const m=shuffleMC(r,`${k}√2`,[String(k*2),`${k}√3`,String(k)]);return{h:`等腰直角三角形的兩股都是 ${k}，斜邊長是？`,mc:m.options,ans:m.ans,key:`${k}√2`,hint:'45°-45°-90° 的邊長比 1 : 1 : √2。'};}]
};

/* ---------- 一元二次方程式（十字交乘） ---------- */
MOD['A-quad']={
  goal:'會用十字交乘把二次式分解，解出一元二次方程式的兩個根，不在兩邊同除以 x。',
  wrong:{h:'常見的錯：x² − 5x − 6 = 0 的解寫成 −6 或 1（正負號反了）；x² = 4x 兩邊除以 x 只得到 x = 4；2x² + x − 3 忘記處理首項係數。',why:'(x − 6)(x + 1) = 0 代表 x − 6 = 0 或 x + 1 = 0，所以 x = 6 或 −1，根的正負號和因式相反。兩邊同除以 x 時，如果 x = 0 就不能除，會漏掉 x = 0 這個根。'},
  concept:['先移項讓一邊是 0。','十字交乘：x² + bx + c，找兩個數相乘 = c、相加 = b。','分解成 (x − p)(x − q) = 0，解是 x = p 或 x = q。','首項不是 1 時，十字左邊也要拆（例如 2x² 拆成 2x 和 x）。'],
  widget:{init:()=>({k:0,pick:-1}),printState:()=>({k:0,pick:0}),sets:[{b:-5,c:-6},{b:5,c:6},{b:-1,c:-12}],
    render(s){const {b,c}=this.sets[s.k];const pairs=[];for(let p=-Math.abs(c);p<=Math.abs(c);p++)if(p&&c%p===0&&p<=c/p)pairs.push([p,c/p]);
      const sel=pairs[s.pick];const ok=sel&&sel[0]+sel[1]===b;
      return `<div style="font-size:20px">x² ${b<0?'−':'+'} ${Math.abs(b)===1?'':Math.abs(b)}x ${c<0?'−':'+'} ${Math.abs(c)} = 0</div>
      <p class="mute">找兩個數：相乘 = ${neg(c)}，相加 = ${neg(b)}。點一組試試看：</p><div class="wctl">${pairs.map((p,i)=>`<button class="chip" data-act="p" data-v="${i}" aria-pressed="${s.pick===i}">${neg(p[0])} 和 ${neg(p[1])}</button>`).join('')}</div>
      <p class="wmsg">${!sel?'還沒選。':ok?`✓ ${neg(sel[0])} × ${neg(sel[1])} = ${neg(c)}，${neg(sel[0])} + ${neg(sel[1])} = ${neg(b)}。分解成 (x ${sel[0]<0?'−':'+'} ${Math.abs(sel[0])})(x ${sel[1]<0?'−':'+'} ${Math.abs(sel[1])}) = 0，解是 <b>x = ${neg(-sel[0])} 或 x = ${neg(-sel[1])}</b>（正負號和因式相反）。`:`✗ 相乘是 ${neg(c)}，但相加是 ${neg(sel[0]+sel[1])}，不是 ${neg(b)}。`}</p>`;},
    controls(s){return `<div class="wctl">換一題：${this.sets.map((q,i)=>`<button class="chip" data-act="k" data-v="${i}" aria-pressed="${s.k===i}">第 ${i+1} 題</button>`).join('')}</div>`;},
    act(s,a,v){if(a==='k'){s.k=+v;s.pick=-1;}else s.pick=+v;}},
  example:{q:'解 2x² + x − 3 = 0',steps:['十字交乘：2x² 拆成 2x 和 x，−3 拆成 3 和 −1。','交叉相乘：2x × (−1) + x × 3 = x ✓，分解成 (2x + 3)(x − 1) = 0。','2x + 3 = 0 → x = −3/2；x − 1 = 0 → x = 1。']},
  tiers:[
   r=>{let p,q;do{p=ri(r,-9,9);q=ri(r,-9,9);}while(!p||!q||p===q);const b=-(p+q),c=p*q;return{h:`解方程式：${quad(1,b,c)} = 0（兩個解用逗號隔開）`,key:`${neg(p)}, ${neg(q)}`,check:listCheck([R(p),R(q)]),hint:`找兩個數相乘 ${neg(c)}、相加 ${neg(b)}；解的正負號和因式相反。`};},
   r=>{const k=ri(r,-9,9)||3;const a=pick(r,[1,2,3]);return{h:`解方程式：${a===1?'':a}x² = ${neg(a*k)}x（兩個解用逗號隔開）`,key:`0, ${neg(k)}`,check:listCheck([R(0),R(k)]),hint:`不要兩邊除以 x！移項後提出 x：x(${a===1?'':a}x ${a*k<0?'+':'−'} ${Math.abs(a*k)}) = 0。`};},
   r=>{let a,p,q;do{a=pick(r,[2,3]);p=ri(r,-5,5);q=ri(r,-4,4);}while(!p||!q||gcd(Math.abs(p),a)!==1);
     /* (a x − p)(x − q) = a x² − (aq + p)x + pq */const A=a,B=-(a*q+p),C=p*q;return{h:`解方程式：${quad(A,B,C)} = 0（兩個解用逗號隔開，分數寫成 3/2）`,key:`${ftxt(R(p,a))}, ${neg(q)}`,check:listCheck([R(p,a),R(q)]),hint:`${A}x² 拆成 ${A}x 和 x 做十字交乘。`};}]
};

/* ---------- 等差數列與級數 ---------- */
MOD['N-seq']={
  goal:'會用 aₙ = a₁ + (n − 1)d 求等差數列的某一項，用「首項加末項，乘項數除以 2」求和。',
  wrong:{h:'常見的錯：2, 5, 8, … 的第 10 項算成 2 + 3 × 10 = 32；1 + 3 + … + 19 算成 200（忘記除以 2）。',why:'從第 1 項到第 10 項只「跳」了 9 次，所以是加 9 個公差。求和時把數列倒過來配對，每一對都是首項 + 末項，但這樣算了兩次，要除以 2。'},
  concept:['公差 d = 後一項 − 前一項。','第 n 項：aₙ = a₁ + (n − 1)d。','和 = (首項 + 末項) × 項數 ÷ 2。','項數 = (末項 − 首項) ÷ d + 1。'],
  widget:{init:()=>({a:2,d:3,n:6}),printState:()=>({a:2,d:3,n:6}),
    render(s){const t=Array.from({length:s.n},(_,i)=>s.a+i*s.d);return `<div style="display:flex;gap:3px;align-items:flex-end">${t.map((v,i)=>`<div style="text-align:center;flex:1 1 0;max-width:52px"><div style="width:100%;height:${12+v*3}px;max-height:150px;background:${i===s.n-1?'#d23c3c':'#a9c9ef'};border-radius:4px 4px 0 0"></div><div style="font-size:13px">${v}</div><div class="mute" style="font-size:11px">a${i+1}</div></div>`).join('')}</div>
      <p class="wmsg">第 ${s.n} 項 = ${s.a} + (${s.n} − 1) × ${s.d} = <b>${t[s.n-1]}</b>（從 a₁ 到 a${s.n} 跳了 ${s.n-1} 次）。前 ${s.n} 項的和 = (${s.a} + ${t[s.n-1]}) × ${s.n} ÷ 2 = <b>${(s.a+t[s.n-1])*s.n/2}</b>。</p>`;},
    controls(s){return `<div class="wctl">首項：${[1,2,5].map(v=>`<button class="chip" data-act="a" data-v="${v}" aria-pressed="${s.a===v}">${v}</button>`).join('')}　公差：${[2,3,4].map(v=>`<button class="chip" data-act="d" data-v="${v}" aria-pressed="${s.d===v}">${v}</button>`).join('')}　項數：${[4,6,8,10].map(v=>`<button class="chip" data-act="n" data-v="${v}" aria-pressed="${s.n===v}">${v}</button>`).join('')}</div>`;},
    act(s,a,v){s[a]=+v;}},
  example:{q:'3 + 7 + 11 + … + 43 = ?',steps:['公差 4，項數 = (43 − 3) ÷ 4 + 1 = 11。','和 = (3 + 43) × 11 ÷ 2。','= 46 × 11 ÷ 2 = 253。']},
  tiers:[
   r=>{const a=ri(r,-5,10),d=pick(r,[-3,-2,2,3,4,5]),n=ri(r,6,20);return{h:`等差數列 ${[0,1,2,3].map(i=>neg(a+i*d)).join(', ')}, … 的第 ${n} 項是？`,key:neg(a+(n-1)*d),check:numCheck(R(a+(n-1)*d)),hint:`a${n} = ${neg(a)} + (${n} − 1) × ${neg(d)}。`};},
   r=>{const a=ri(r,1,10),d=pick(r,[2,3,4,5]),n=ri(r,8,25);return{h:`等差數列的首項是 ${a}，公差是 ${d}，${a+(n-1)*d} 是第幾項？`,key:String(n),check:numCheck(R(n)),hint:`(${a+(n-1)*d} − ${a}) ÷ ${d} + 1。`};},
   r=>{const a=ri(r,1,9),d=pick(r,[1,2,3,4]),n=ri(r,6,15);const L=a+(n-1)*d;return{h:`${a} + ${a+d} + ${a+2*d} + … + ${L} = ？`,key:String((a+L)*n/2),check:numCheck(R((a+L)*n,2)),hint:`項數 = (${L} − ${a}) ÷ ${d} + 1 = ${n}；和 = (首項 + 末項) × 項數 ÷ 2。`};}]
};

/* ---------- 三角形與四邊形的性質 ---------- */
MOD['G-tri']={
  goal:'會用三角形內角和 180°、外角定理求角度，分辨平行四邊形、矩形、菱形的性質。',
  wrong:{h:'常見的錯：外角 110°、一個內角 40°，另一個不相鄰的內角算成 180° − 110° − 40° = 30°；以為所有平行四邊形的對角線都等長。',why:'外角 = 兩個不相鄰內角的和，所以另一個角是 110° − 40° = 70°。對角線等長是矩形才有的性質，一般平行四邊形只有「對角線互相平分」。'},
  concept:['三角形內角和 = 180°。','外角 = 和它不相鄰的兩個內角相加。','平行四邊形：對邊相等、對角相等、對角線互相平分。','矩形再加上對角線等長；菱形再加上四邊等長、對角線互相垂直。'],
  widget:{init:()=>({A:50,B:60}),printState:()=>({A:40,B:70}),
    render(s){const C=180-s.A-s.B;const toR=d=>d*Math.PI/180;const bx=60,by=170,cx=300,cy=170;const L=cx-bx;
      const ta=Math.tan(toR(s.B)),tb=Math.tan(toR(C));const L2=Math.min(L,150*(ta+tb)/(ta*tb));const cx2=bx+L2;const ax=bx+L2*tb/(ta+tb),ay=by-(ax-bx)*ta;
      return `<svg viewBox="0 0 440 190" class="wsvg"><polygon points="${bx},${by} ${cx2},${cy} ${ax},${ay}" fill="#cfe1f7" stroke="#333"/><line x1="${cx2}" y1="${cy}" x2="420" y2="${cy}" stroke="#333" stroke-dasharray="5 4"/>
      <text x="${ax}" y="${ay+22}" font-size="16" text-anchor="middle">${s.A}°</text><text x="${bx+22}" y="${by-6}" font-size="16">${s.B}°</text><text x="${cx2-30}" y="${cy-6}" font-size="16">${C}°</text><text x="${cx2+30}" y="${cy-8}" font-size="17" fill="#d23c3c" font-weight="700">${180-C}°</text></svg>
      <p class="wmsg">紅色外角 = 180° − ${C}° = <b>${180-C}°</b>，剛好等於另外兩個內角相加：${s.A}° + ${s.B}° = ${s.A+s.B}°。</p>`;},
    controls(s){return `<div class="wctl">頂角：${[30,40,50,70].map(v=>`<button class="chip" data-act="A" data-v="${v}" aria-pressed="${s.A===v}">${v}°</button>`).join('')}　左下角：${[50,60,70].map(v=>`<button class="chip" data-act="B" data-v="${v}" aria-pressed="${s.B===v}">${v}°</button>`).join('')}</div>`;},
    act(s,a,v){s[a]=+v;}},
  example:{q:'△ABC 中，∠A = 2∠B，∠C 的外角是 120°，求 ∠B。',steps:['∠C 的外角 = ∠A + ∠B = 120°。','2∠B + ∠B = 120°，3∠B = 120°。','∠B = 40°。']},
  tiers:[
   r=>{const a=ri(r,30,90),b=ri(r,20,150-a);return{h:`三角形的兩個內角是 ${a}° 和 ${b}°，第三個內角是幾度？`,key:String(180-a-b),check:numCheck(R(180-a-b)),hint:'內角和 180°。'};},
   r=>{const a=ri(r,25,80),b=ri(r,25,80);return{h:`三角形的一個外角是 ${a+b}°，和它不相鄰的一個內角是 ${a}°，另一個不相鄰的內角是幾度？`,key:String(b),check:numCheck(R(b)),hint:'外角 = 兩個不相鄰內角的和。'};},
   r=>{const sets=[['所有平行四邊形','對角線互相平分',['對角線等長','對角線互相垂直','四邊等長']],['所有矩形','對角線等長',['對角線互相垂直','四邊等長','對角線平分內角']],['所有菱形','對角線互相垂直',['對角線等長','四個角都是直角','鄰邊互相垂直']]];
     const [n,c,w]=pick(r,sets);const m=shuffleMC(r,c,w);return{h:`下列哪一個性質是「${n}」一定成立的？`,mc:m.options,ans:m.ans,key:c,hint:'矩形是角特別（直角），菱形是邊特別（四邊等長）。'};}]
};

/* ---------- 圓的性質 ---------- */
MOD['G-circle']={
  goal:'知道圓周角是同弧圓心角的一半、半圓的圓周角是 90°，切線和半徑垂直。',
  wrong:{h:'常見的錯：同弧的圓心角 100°，圓周角也寫 100°；切線長用 13 − 5 = 8 算。',why:'圓周角的頂點在圓上，比圓心離弧更遠，張開的角度只有圓心角的一半。切線和過切點的半徑垂直，所以半徑、切線、圓心到點的連線會形成直角三角形，要用畢氏定理。'},
  concept:['圓周角 = 同弧所對圓心角的一半。','直徑（半圓）所對的圓周角 = 90°。','切線 ⟂ 過切點的半徑；切線長 = √(OP² − r²)。'],
  widget:{init:()=>({c:100}),printState:()=>({c:100}),
    render(s){const O=[150,110],R0=80,toR=d=>d*Math.PI/180;const a1=toR(90+s.c/2),a2=toR(90-s.c/2);const A=[O[0]+R0*Math.cos(a1),O[1]+R0*Math.sin(a1)],B=[O[0]+R0*Math.cos(a2),O[1]+R0*Math.sin(a2)],P=[O[0],O[1]-R0];
      return `<svg viewBox="0 0 440 210" class="wsvg"><circle cx="${O[0]}" cy="${O[1]}" r="${R0}" fill="none" stroke="#333"/><polyline points="${A} ${O} ${B}" fill="none" stroke="#4f8fd8" stroke-width="2.5"/><polyline points="${A} ${P} ${B}" fill="none" stroke="#d23c3c" stroke-width="2.5"/><circle cx="${O[0]}" cy="${O[1]}" r="3"/>
      <text x="${O[0]+8}" y="${O[1]+4}" font-size="16" fill="#4f8fd8">${s.c}°</text><text x="${P[0]+6}" y="${P[1]+22}" font-size="16" fill="#d23c3c">${s.c/2}°</text><text x="260" y="60" font-size="17" fill="#4f8fd8">藍：圓心角 ${s.c}°</text><text x="260" y="84" font-size="17" fill="#d23c3c">紅：圓周角 ${s.c/2}°</text></svg>
      <p class="wmsg">同一段弧（下方）：圓心角 ${s.c}°，圓周角只有一半 = <b>${s.c/2}°</b>。${s.c===180?'圓心角 180° 就是直徑，圓周角剛好 90°。':''}</p>`;},
    controls(s){return `<div class="wctl">圓心角：${[60,100,140,180].map(v=>`<button class="chip" data-act="c" data-v="${v}" aria-pressed="${s.c===v}">${v}°</button>`).join('')}</div>`;},
    act(s,a,v){s.c=+v;}},
  example:{q:'圓 O 半徑 5，圓外一點 P 到 O 的距離 13，求切線長 PA。',steps:['切線 PA ⟂ 半徑 OA，所以 △OAP 是直角三角形，斜邊是 OP。','PA² = 13² − 5² = 169 − 25 = 144。','PA = 12。']},
  tiers:[
   r=>{const c=ri(r,3,17)*10;return{h:`圓上一段弧所對的圓心角是 ${c}°，同弧所對的圓周角是幾度？`,key:String(c/2),check:numCheck(R(c,2)),hint:'圓周角是圓心角的一半。'};},
   r=>{if(r()<.5){const i=ri(r,15,80);return{h:`同弧所對的圓周角是 ${i}°，圓心角是幾度？`,key:String(2*i),check:numCheck(R(2*i)),hint:'圓心角是圓周角的 2 倍。'};}
     const a=ri(r,20,70);return{h:`AB 是圓的直徑，C 是圓上另一點，∠CAB = ${a}°，∠CBA 是幾度？`,key:String(90-a),check:numCheck(R(90-a)),hint:'直徑所對的圓周角 ∠ACB = 90°。'};},
   r=>{const t=pick(r,[[5,12,13],[3,4,5],[8,15,17],[6,8,10],[7,24,25]]);return{h:`圓 O 的半徑是 ${t[0]}，圓外一點 P 到圓心的距離是 ${t[2]}，從 P 畫圓的切線，切線長是？`,key:String(t[1]),check:numCheck(R(t[1])),hint:`切線 ⟂ 半徑，切線長² = ${t[2]}² − ${t[0]}²。`};}]
};

/* ---------- 三角形的心 ---------- */
MOD['G-center']={
  goal:'分清楚外心、內心、重心的作法與性質，會用重心 2 : 1、直角三角形外心在斜邊中點來計算。',
  wrong:{h:'常見的錯：把「到三邊等距」當成外心；中線長 9，重心到頂點算成 3 或 4.5。',why:'外心是三邊中垂線的交點，到三個「頂點」等距（外接圓圓心）；內心是角平分線的交點，到三個「邊」等距（內切圓圓心）。重心把中線分成 2 : 1，靠頂點那段占 2 份。'},
  concept:['外心：中垂線交點，到三頂點等距；直角三角形的外心在斜邊中點。','內心：角平分線交點，到三邊等距。','重心：中線交點，把每條中線分成 2 : 1（頂點到重心是 2 份）。'],
  widget:{init:()=>({m:'g'}),printState:()=>({m:'g'}),
    render(s){const A=[80,170],B=[360,170],C=[150,30];const mid=(p,q)=>[(p[0]+q[0])/2,(p[1]+q[1])/2];let g=`<polygon points="${A} ${B} ${C}" fill="#f4f6fa" stroke="#333" stroke-width="2"/>`;let msg='';
      if(s.m==='g'){const G=[(A[0]+B[0]+C[0])/3,(A[1]+B[1]+C[1])/3];[[A,mid(B,C)],[B,mid(A,C)],[C,mid(A,B)]].forEach(([p,q])=>g+=`<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" stroke="#4f8fd8" stroke-width="1.5"/>`);g+=`<circle cx="${G[0]}" cy="${G[1]}" r="5" fill="#d23c3c"/>`;msg='重心：三條中線（頂點連到對邊中點）的交點，把每條中線分成 2 : 1。';}
      if(s.m==='o'){const d=2*(A[0]*(B[1]-C[1])+B[0]*(C[1]-A[1])+C[0]*(A[1]-B[1]));const n=p=>p[0]*p[0]+p[1]*p[1];const O=[(n(A)*(B[1]-C[1])+n(B)*(C[1]-A[1])+n(C)*(A[1]-B[1]))/d,(n(A)*(C[0]-B[0])+n(B)*(A[0]-C[0])+n(C)*(B[0]-A[0]))/d];const R0=Math.hypot(A[0]-O[0],A[1]-O[1]);
        g+=`<circle cx="${O[0]}" cy="${O[1]}" r="${R0}" fill="none" stroke="#4f8fd8" stroke-dasharray="4 3"/>${[A,B,C].map(p=>`<line x1="${O[0]}" y1="${O[1]}" x2="${p[0]}" y2="${p[1]}" stroke="#4f8fd8"/>`).join('')}<circle cx="${O[0]}" cy="${O[1]}" r="5" fill="#d23c3c"/>`;msg='外心：三邊中垂線的交點，到三個頂點的距離都一樣（三條藍線等長），是外接圓的圓心。';}
      if(s.m==='i'){const a=Math.hypot(B[0]-C[0],B[1]-C[1]),b=Math.hypot(A[0]-C[0],A[1]-C[1]),c=Math.hypot(A[0]-B[0],A[1]-B[1]);const I=[(a*A[0]+b*B[0]+c*C[0])/(a+b+c),(a*A[1]+b*B[1]+c*C[1])/(a+b+c)];const rr=Math.abs((B[0]-A[0])*(A[1]-I[1])-(A[0]-I[0])*(B[1]-A[1]))/c;
        g+=`<circle cx="${I[0]}" cy="${I[1]}" r="${rr}" fill="none" stroke="#4f8fd8" stroke-dasharray="4 3"/><circle cx="${I[0]}" cy="${I[1]}" r="5" fill="#d23c3c"/>`;msg='內心：三條角平分線的交點，到三個邊的距離都一樣，是內切圓的圓心。';}
      return `<svg viewBox="0 0 440 ${s.m==='o'?240:190}" class="wsvg" style="overflow:hidden">${g}</svg><p class="wmsg">${msg}</p>`;},
    controls(s){return `<div class="wctl">${[['g','重心'],['o','外心'],['i','內心']].map(([k,n])=>`<button class="chip" data-act="m" data-v="${k}" aria-pressed="${s.m===k}">${n}</button>`).join('')}</div>`;},
    act(s,a,v){s.m=v;}},
  example:{q:'直角三角形兩股 6、8，外接圓半徑是多少？',steps:['斜邊 = √(6² + 8²) = 10。','直角三角形的外心在斜邊中點。','外接圓半徑 = 斜邊的一半 = 5。']},
  tiers:[
   r=>{const sets=[['外心','到三個頂點的距離相等',['到三邊的距離相等','是三條中線的交點','是三條高的交點']],['內心','到三邊的距離相等',['到三個頂點的距離相等','是三條中線的交點','一定在斜邊中點']],['重心','是三條中線的交點',['到三邊的距離相等','到三個頂點的距離相等','是三條中垂線的交點']]];
     const [n,c,w]=pick(r,sets);const m=shuffleMC(r,c,w);return{h:`三角形的${n}有什麼性質？`,mc:m.options,ans:m.ans,key:c,hint:'外心↔頂點、內心↔邊、重心↔中線。'};},
   r=>{const k=ri(r,2,8);const toV=r()<.5;return toV?{h:`三角形的一條中線長 ${3*k}，重心到這條中線所在頂點的距離是？`,key:String(2*k),check:numCheck(R(2*k)),hint:'頂點到重心占中線的 2/3。'}:{h:`三角形的一條中線長 ${3*k}，重心到這條中線所在邊的中點的距離是？`,key:String(k),check:numCheck(R(k)),hint:'重心到中點占中線的 1/3。'};},
   r=>{const t=pick(r,[[6,8,10],[5,12,13],[8,15,17],[9,12,15],[12,16,20]]);return{h:`直角三角形的兩股長 ${t[0]}、${t[1]}，外接圓的半徑是多少？`,key:String(t[2]/2),check:numCheck(R(t[2],2)),hint:'外心在斜邊中點，半徑 = 斜邊 ÷ 2。'};}]
};

const TIERS=['基礎','進階','挑戰'];
function makeQ(mid,tier,seed){const g=MOD[mid].tiers[tier];const q=g(rng(seed));q.tier=tier;q.seed=seed;
  if(q.mc){q.check=i=>({ok:+i===q.ans});}return q;}

/* 由判定系統匯出的一位學生 → 學習系統的學生資料 */
function record(x){const seat=String(x.seat||'').replace(/\D/g,'');const st=String(x.s||'').slice(0,65).padEnd(65,'b');
  if(!seat||!/^[cwib]+$/.test(st))return null;const r=route(st);
  return{seat,name:String(x.name||'').slice(0,20),s:st,start:r.diag.start,startLabel:r.diag.startLabel,route:r.route,miss:r.miss,bands:r.diag.bands.map(b=>[b.c,b.n,b.pass?1:0]),importedAt:new Date().toISOString()};}
window.Learn={record,PRE,parseLin,GN,BANDS,CATALOG,CAT,Q2M,MOD,TIERS,diagnose,route,makeQ,rng,F,gcd};
})();
