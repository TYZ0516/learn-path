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
function norm(s){return String(s||'').trim().replace(/[／]/g,'/').replace(/[－−–]/g,'-').replace(/[：]/g,':').replace(/[，、]/g,',').replace(/（/g,'(').replace(/）/g,')').replace(/\s+/g,' ');}
function parseNum(s){
  s=norm(s).replace(/^[a-z]\s*=\s*/i,'').replace(/(元|人|公里|公分|平方公分|度|°)$/,'').trim();let m;
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
      const box=(x,w,top,mid,bot,col)=>`<rect x="${x}" y="40" width="${w}" height="70" fill="${col}" stroke="#333"/><text x="${x+w/2}" y="30" font-size="16" text-anchor="middle">${top}</text><text x="${x+w/2}" y="72" font-size="15" text-anchor="middle">${mid}</text><text x="${x+w/2}" y="96" font-size="17" font-weight="700" text-anchor="middle">${bot}</text>`;
      const cs=c>0?'+'+c:'−'+(-c);const wa=s.wrong;
      return `<svg viewBox="0 0 440 125" class="wsvg"><text x="12" y="82" font-size="18" font-weight="700">${as}</text><line x1="52" y1="40" x2="52" y2="110" stroke="#333" stroke-width="2"/>
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
        const lab=s.N?(fit?`= ${n*N/den}/${N}`:'切不剛好'):'';return g+`<text x="${W+18}" y="${y+22}" font-size="15">${n}/${den} ${lab}</text>`;};
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
      const cells=(n,y,col,lab,val)=>{let g='';for(let i=0;i<n;i++)g+=`<rect x="${70+i*cw}" y="${y}" width="${cw}" height="30" fill="${col}" stroke="#333"/><text x="${70+i*cw+cw/2}" y="${y+20}" font-size="12" text-anchor="middle">${f(one)}</text>`;
        return g+`<text x="4" y="${y+20}" font-size="14">${lab}</text><text x="${74+n*cw}" y="${y+20}" font-size="14" font-weight="700">${f(val)}</text>`;};
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
    render(s){const side=(a,b,x0)=>{let g='';const n=Math.min(a,8);for(let i=0;i<n;i++)g+=`<rect x="${x0+(i%4)*26}" y="${36-Math.floor(i/4)*26}" width="22" height="22" rx="3" fill="#4f8fd8"/><text x="${x0+(i%4)*26+11}" y="${52-Math.floor(i/4)*26}" fill="#fff" font-size="13" text-anchor="middle">x</text>`;
        const m=Math.min(b,12);for(let i=0;i<m;i++)g+=`<circle cx="${x0+112+(i%4)*18}" cy="${48-Math.floor(i/4)*18}" r="7" fill="#e39b3b"/>`;return g;};
      const ex=(a,b)=>[(a?(a===1?'x':a+'x'):''),(b?b:'')].filter(Boolean).join(' + ')||'0';
      const done=s.a===1&&s.b===0&&s.c===0||s.c===1&&s.d===0&&s.a===0;
      return `<svg viewBox="0 0 440 120" class="wsvg"><polygon points="215,110 225,110 220,72" fill="#555"/><line x1="20" y1="72" x2="420" y2="72" stroke="#555" stroke-width="4"/>
      ${side(s.a,s.b,24)}${side(s.c,s.d,236)}<text x="110" y="100" font-size="15" text-anchor="middle">${ex(s.a,s.b)}</text><text x="330" y="100" font-size="15" text-anchor="middle">${ex(s.c,s.d)}</text></svg>
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
      for(let i=0;i<2*k;i++)for(let j=0;j<k;j++)g+=`<rect x="${130+i*u}" y="${10+j*u}" width="${u}" height="${u}" fill="${(Math.floor(i/2)+j)%2?'#cfe1f7':'#a9c9ef'}" stroke="#fff"/>`;
      return `<svg viewBox="0 0 440 ${Math.max(90,k*u+30)}" class="wsvg"><rect x="10" y="10" width="${2*u}" height="${u}" fill="#e39b3b"/><text x="10" y="${u+30}" font-size="13">原來：面積 2 格</text>${g}
      <text x="${130}" y="${k*u+26}" font-size="13">放大 ${k} 倍：面積 ${2*k*k} 格（${k*k} 個原圖）</text></svg>
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

const TIERS=['基礎','進階','挑戰'];
function makeQ(mid,tier,seed){const g=MOD[mid].tiers[tier];const q=g(rng(seed));q.tier=tier;q.seed=seed;
  if(q.mc){q.check=i=>({ok:+i===q.ans});}return q;}

/* 由判定系統匯出的一位學生 → 學習系統的學生資料 */
function record(x){const seat=String(x.seat||'').replace(/\D/g,'');const st=String(x.s||'').slice(0,65).padEnd(65,'b');
  if(!seat||!/^[cwib]+$/.test(st))return null;const r=route(st);
  return{seat,name:String(x.name||'').slice(0,20),s:st,start:r.diag.start,startLabel:r.diag.startLabel,route:r.route,miss:r.miss,bands:r.diag.bands.map(b=>[b.c,b.n,b.pass?1:0]),importedAt:new Date().toISOString()};}
window.Learn={record,PRE,parseLin,GN,BANDS,CATALOG,CAT,Q2M,MOD,TIERS,diagnose,route,makeQ,rng,F,gcd};
})();
