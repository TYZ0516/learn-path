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
function diagnose(s){ // s：65 個字元，c 對、w 錯、i 不會、b 沒寫到（路線：起點年級以內的 b 當作不會）
  const st=q=>s[q-1]||'b';
  const bands=BANDS.map(([a,b,p],g)=>{let c=0;for(let q=a;q<=b;q++)if(st(q)==='c')c++;return{g,c,n:b-a+1,pass:c>=p};});
  const f=bands.find(b=>!b.pass);const start=f?f.g:9;
  let last=0;for(let q=1;q<=65;q++)if(st(q)!=='b')last=q;
  return{start,startLabel:start>=9?'全部通過':GN[start],bands,last,correct:[...s].filter(x=>x==='c').length};
}
/* ---------- 路線：答錯、寫「不會」的題目，對應的關卡全部開放；由低年級排到高年級 ----------
   沒寫到的題目（2026/11/27 老師決定）：題目的年級在起點年級以內（≤ 起點）就開放；
   高於起點的不開放（速度測驗沒寫到，不代表不會，而且起點以上本來就還沒學穩）。
   目錄 CATALOG 本身就是由低年級排到高年級，同年級照目錄順序，所以整數除法一定排在小數除法前面。 */
function route(s){
  const d=diagnose(s);const st=q=>s[q-1]||'b';
  const need=new Set(),miss={};
  for(let q=1;q<=65;q++){const x=st(q);
    const open=x==='w'||x==='i'||(x==='b'&&gradeOf(q)<=d.start);
    if(open){const m=Q2M[q];need.add(m);(miss[m]=miss[m]||[]).push(q);}}
  const ord=m=>CATALOG.indexOf(CAT[m]);
  const ids=[...need].sort((a,b)=>CAT[a].grade-CAT[b].grade||ord(a)-ord(b));
  const out=[];ids.forEach(m=>{(PRE[m]||[]).forEach(p=>{if(!out.includes(p))out.push(p);});if(!out.includes(m))out.push(m);});
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
  s=norm(s).replace(/^[a-z]\s*=\s*/i,'').replace(/\s*(元|人|顆|公里|公尺|公分|公釐|毫米|平方公分|平方公尺|立方公分|公升|毫升|度|°|分鐘|分|秒|小時|個|本|張|頁|輛|台|盒|包|條|支|枝|隻|片|次|歲|天|倍|組|cm|mm|km|m)$/i,'').trim();let m;
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

/* ================= 補齊的 9 個基礎關卡（整數、時間、長度、分數意義、周長面積、因數倍數、統計機率） ================= */
/* ---- 這幾個關卡用到的答案檢查 ---- */
function divCheck(q,rm,d){return str=>{const s=norm(str).replace(/^商\s*/,'').replace(/\s/g,'');
  if(/^\d+$/.test(s)){if(+s===q&&rm===0)return{ok:true};if(+s===q)return{ok:false,note:'商對了，還要寫出餘數，格式像 7 餘 5。'};return{ok:false};}
  const m=s.match(/^(\d+)(?:餘|\.{2,}|…+|r)(\d+)$/i);if(!m)return{ok:false,note:'看不懂這個寫法，有餘數時請寫成 7 餘 5（或 7...5）。'};
  const a=+m[1],b=+m[2];if(a===q&&b===rm)return{ok:true};if(d&&b>=d)return{ok:false,note:`餘數 ${b} 不能比除數 ${d} 大或一樣大，代表還可以再多分一份。`};
  if(a===q)return{ok:false,note:'商對了，餘數不對：餘數 = 被除數 − 商 × 除數。'};return{ok:false};};}
function timeCheck(h,mi){return str=>{let s=norm(str).replace(/\s/g,'').replace(/整$/,'');const t=s.match(/^(上午|早上|中午|下午|晚上)/);if(t)s=s.slice(t[1].length);
  const m=s.match(/^(\d{1,2})(?::|點|時)(\d{1,2})?分?$/);if(!m)return{ok:false,note:'看不懂這個寫法，請寫成 4:15 或 4 點 15 分。'};
  const H=+m[1],M=+(m[2]||0);if(M>59)return{ok:false,note:'分鐘要小於 60，滿 60 分要換成 1 小時（這是格式問題，請再寫一次）。'};
  if(H%12===h%12&&M===mi)return{ok:true};if(M===mi)return{ok:false,note:'分鐘對了，小時不對：分鐘加起來滿 60 有沒有進 1 小時？'};return{ok:false};};}
function simplestCheck(v){return str=>{const p=parseNum(str);if(!p)return{ok:false,note:'看不懂這個答案的寫法，分數請寫成 3/4。'};if(!eq(p.v,v))return{ok:false};
  if(p.raw&&gcd(p.raw[0],p.raw[1])>1)return{ok:false,note:'大小對了，但還可以再約分：分子分母還有共同的因數。'};return{ok:true};};}
function mixedCheck(v){return str=>{const s=norm(str);const p=parseNum(s);if(!p)return{ok:false,note:'看不懂這個寫法，帶分數請寫成 3 2/5。'};if(!eq(p.v,v))return{ok:false};
  const m=s.match(/^(\d+)\s*(?:又|\s)\s*(\d+)\/(\d+)$/);if(!m||+m[2]>=+m[3])return{ok:false,note:'數值對了，但題目要寫成帶分數的格式，例如 3 2/5。'};
  if(gcd(+m[2],+m[3])>1)return{ok:true,note:'答對了！分數部分還可以再約分。'};return{ok:true};};}
function improperCheck(v){return str=>{const s=norm(str);const p=parseNum(s);if(!p)return{ok:false,note:'看不懂這個寫法，假分數請寫成 17/5。'};if(!eq(p.v,v))return{ok:false};
  if(!/^\d+\/\d+$/.test(s))return{ok:false,note:'數值對了，但題目要寫成假分數的格式，例如 17/5。'};return{ok:true};};}
const COLN=['個位','十位','百位','千位','萬位'];
const hm=t=>{const h=Math.floor(t/60)%24,m=t%60;return`${h<12?'上午':h===12?'中午':'下午'} ${h%12||12}:${String(m).padStart(2,'0')}`;};
const hm12=t=>{const h=Math.floor(t/60)%24,m=t%60;return`${h%12||12}:${String(m).padStart(2,'0')}`;};

/* ---------- 整數加減（進位、退位） ---------- */
MOD['I-add']={
  goal:'用直式算加減：同一位對齊、從個位算起，滿十進一，不夠減就向前一位借一當十。',
  wrong:{h:'常見的錯：47 + 38 算成 715（個位 7 + 8 = 15 整個寫下去）；52 − 27 算成 35（個位不夠減，就倒過來算 7 − 2）。',why:'個位 7 + 8 = 15，只在個位寫 5，那 1 個十要「進位」加到十位：4 + 3 + 1 = 8，答案 85。減法不能倒過來減：個位 2 不夠減 7，要向十位借 1 個十（= 10 個一），12 − 7 = 5，十位剩 4，4 − 2 = 2，答案 25。'},
  concept:['直式要個位對個位、十位對十位，從個位開始算。','加法：同一位加起來滿 10，這一位只寫個位數，向前一位進 1。','減法：同一位不夠減，向前一位借 1，這一位多 10；前一位是 0 時，要再往更前面借（例如 503 − 268）。'],
  widget:{init:()=>({p:0,k:0}),printState:()=>({p:3,k:3}),
    presets:[['+',47,38],['+',386,457],['−',52,27],['−',503,268]],
    calc(op,a,b){const A=String(a).split('').reverse().map(Number),B=String(b).split('').reverse().map(Number);const cols=[];
      if(op==='+'){const n=String(a+b).length;let c=0;for(let i=0;i<n;i++){const x=A[i]||0,y=B[i]||0,s=x+y+c;cols.push({x,y,cin:c,s,res:s%10,out:s>=10?1:0,only:i>=A.length&&i>=B.length});c=s>=10?1:0;}}
      else{let bin=0;for(let i=0;i<A.length;i++){const x=A[i],y=B[i]||0;let cur=x-bin,bout=0;if(cur<y){cur+=10;bout=1;}cols.push({x,y,bin,cur,res:cur-y,out:bout,before:x-bin});bin=bout;}}
      return cols;},
    render(s){const [op,a,b]=this.presets[s.p];const cols=this.calc(op,a,b);const n=cols.length,k=Math.min(s.k,n);const X=i=>330-i*52;let g='';
      const A=String(a).split('').reverse(),B=String(b).split('').reverse();
      A.forEach((d,i)=>g+=`<text x="${X(i)}" y="92" font-size="32" text-anchor="middle">${d}</text>`);
      B.forEach((d,i)=>g+=`<text x="${X(i)}" y="140" font-size="32" text-anchor="middle">${d}</text>`);
      g+=`<text x="${X(n-1)-56}" y="140" font-size="32" text-anchor="middle">${op}</text><line x1="${X(n-1)-80}" y1="154" x2="${X(0)+30}" y2="154" stroke="#333" stroke-width="2.5"/>`;
      for(let i=0;i<k;i++){const c=cols[i];g+=`<rect x="${X(i)-22}" y="160" width="44" height="40" rx="6" fill="${i===k-1?'#f6d7a8':'#eef3fb'}"/><text x="${X(i)}" y="192" font-size="32" font-weight="700" text-anchor="middle">${c.res}</text>`;
        if(op==='+'&&c.out)g+=`<text x="${X(i+1)}" y="44" font-size="20" fill="#d23c3c" font-weight="700" text-anchor="middle">+1</text>`;
        if(op!=='+'&&(c.bin||c.out))g+=`<line x1="${X(i)-12}" y1="82" x2="${X(i)+12}" y2="66" stroke="#d23c3c" stroke-width="2"/><text x="${X(i)}" y="44" font-size="20" fill="#d23c3c" font-weight="700" text-anchor="middle">${c.cur}</text>`;}
      if(k<n)g+=`<rect x="${X(k)-24}" y="58" width="48" height="148" rx="8" fill="none" stroke="#4f8fd8" stroke-width="2.5" stroke-dasharray="6 4"/>`;
      let msg;if(k===0)msg=`按「下一步」，從個位開始一位一位算。`;
      else{const c=cols[k-1],nm=COLN[k-1],nx=COLN[k];
        if(op==='+')msg=c.only?`${nm}：只有進位上來的 1，寫 1。`:`${nm}：${c.x} + ${c.y}${c.cin?' + 進位的 1':''} = ${c.s}，${c.out?`滿 10 了：寫 ${c.res}，向${nx}進 1（紅色的 +1）。`:`寫 ${c.res}。`}`;
        else msg=`${nm}：${c.bin?`${c.x} 被右邊借走 1，剩 ${c.before}。`:''}${c.out?`${c.before} 不夠減 ${c.y}，向${nx}借 1 當 10，變成 ${c.cur}，${c.cur} − ${c.y} = ${c.res}。`:`${c.before} − ${c.y} = ${c.res}。`}`;
        if(k===n)msg+=` 答案是 <b>${op==='+'?a+b:a-b}</b>。${op==='+'?'':`檢查：${a-b} + ${b} = ${a}。`}`;}
      return `<svg viewBox="0 0 440 215" class="wsvg">${g}</svg><p class="wmsg">${msg}</p>`;},
    controls(s){return `<div class="wctl"><button class="chip big" data-act="n">下一步</button><button class="chip" data-act="r">重來</button></div>
      <div class="wctl">換一題：${this.presets.map((p,i)=>`<button class="chip" data-act="p" data-v="${i}" aria-pressed="${s.p===i}">${p[1]} ${p[0]} ${p[2]}</button>`).join('')}</div>`;},
    act(s,a,v){if(a==='n'){const [op,x,y]=this.presets[s.p];s.k=Math.min(s.k+1,this.calc(op,x,y).length);}if(a==='r')s.k=0;if(a==='p'){s.p=+v;s.k=0;}}},
  example:{q:'503 − 268 = ?',steps:['個位：3 不夠減 8，要向十位借，可是十位是 0，只好先向百位借：百位 5 變 4，十位變成 10。','十位再借 1 給個位：十位剩 9，個位變 13，13 − 8 = 5。','十位 9 − 6 = 3，百位 4 − 2 = 2，答案 235。檢查：235 + 268 = 503。']},
  tiers:[
   r=>{if(r()<.5){let a,b;do{a=ri(r,15,79);b=ri(r,12,89-a+10);}while(a%10+b%10<10||a+b>99);return{h:`${a} + ${b} =`,key:String(a+b),check:numCheck(R(a+b)),hint:`個位 ${a%10} + ${b%10} = ${a%10+b%10}，滿 10 要向十位進 1。`};}
     let a,b;do{a=ri(r,31,98);b=ri(r,12,a-5);}while(a%10>=b%10);return{h:`${a} − ${b} =`,key:String(a-b),check:numCheck(R(a-b)),hint:`個位 ${a%10} 不夠減 ${b%10}，向十位借 1，變成 ${a%10+10} − ${b%10}。`};},
   r=>{if(r()<.5){let a,b;do{a=ri(r,156,689);b=ri(r,145,899-a);}while(a%10+b%10<10||Math.floor(a/10)%10+Math.floor(b/10)%10+1<10);return{h:`${a} + ${b} =`,key:String(a+b),check:numCheck(R(a+b)),hint:'個位、十位都會進位，進上去的 1 別忘了加。'};}
     let a,b;do{a=ri(r,3,9)*100+ri(r,0,8);b=ri(r,112,a-20);}while(b%10<=a%10||Math.floor(b/10)%10===0);return{h:`${a} − ${b} =`,key:String(a-b),check:numCheck(R(a-b)),hint:`十位是 0，要先向百位借：百位少 1，十位變 10，再借 1 給個位，十位剩 9。`};},
   r=>{const t=ri(r,0,2);if(t===0){const x=ri(r,215,689),b=ri(r,148,299);return{h:`□ + ${b} = ${x+b}，□ = ?`,key:String(x),check:numCheck(R(x)),hint:`□ = ${x+b} − ${b}。`};}
     if(t===1){const x=ri(r,245,699),b=ri(r,126,299);return{h:`□ − ${b} = ${x}，□ = ?`,key:String(x+b),check:numCheck(R(x+b)),hint:`被減數 = 差 + 減數 = ${x} + ${b}。`};}
     const a=ri(r,10,19)*100+ri(r,0,9),b=ri(r,268,689);return{h:`圖書館原有 ${a} 本書，借出 ${b} 本，還剩幾本？`,key:String(a-b),check:numCheck(R(a-b)),hint:`${a} − ${b}，注意 0 的地方要連續借位。`};}]
};

/* ---------- 時間的計算 ---------- */
MOD['M-time']={
  goal:'知道 1 小時 = 60 分，會算經過多久，也會算「幾點幾分再過多久是幾點幾分」。',
  wrong:{h:'常見的錯：從 9:40 到 10:20，用 1020 − 940 = 80，說經過 80 分；1 小時 30 分寫成 130 分。',why:'時間是「滿 60 分進 1 小時」，不是滿 100。9:40 到 10:00 是 20 分，10:00 到 10:20 又是 20 分，共 40 分。1 小時 30 分 = 60 + 30 = 90 分。'},
  concept:['1 小時 = 60 分，1 分 = 60 秒；1 天 = 24 小時，中午 12 點以後是下午。','算經過多久：先湊到整點，再加上整點之後的時間。','分鐘加起來滿 60，就換成 1 小時；不夠減時，借 1 小時當 60 分。'],
  widget:{init:()=>({s:0,add:0}),printState:()=>({s:0,add:40}),starts:[9*60+40,14*60+50,11*60+35],
    render(s){const t0=this.starts[s.s],t=t0+s.add;const h=Math.floor(t/60)%12,m=t%60;const cx=105,cy=105,R0=88;let g=`<circle cx="${cx}" cy="${cy}" r="${R0}" fill="#fff" stroke="#333" stroke-width="3"/>`;
      for(let i=1;i<=12;i++){const a=i*Math.PI/6;g+=`<text x="${cx+70*Math.sin(a)}" y="${cy-70*Math.cos(a)+6}" font-size="17" text-anchor="middle">${i}</text>`;}
      for(let i=0;i<60;i++){const a=i*Math.PI/30,r1=i%5?82:78;g+=`<line x1="${cx+r1*Math.sin(a)}" y1="${cy-r1*Math.cos(a)}" x2="${cx+R0*Math.sin(a)}" y2="${cy-R0*Math.cos(a)}" stroke="#333" stroke-width="${i%5?1:2}"/>`;}
      const ha=(h+m/60)*Math.PI/6,ma=m*Math.PI/30;
      g+=`<line x1="${cx}" y1="${cy}" x2="${cx+45*Math.sin(ha)}" y2="${cy-45*Math.cos(ha)}" stroke="#1d2433" stroke-width="7" stroke-linecap="round"/><line x1="${cx}" y1="${cy}" x2="${cx+68*Math.sin(ma)}" y2="${cy-68*Math.cos(ma)}" stroke="#d23c3c" stroke-width="4" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="5" fill="#333"/>`;
      const eh=Math.floor(s.add/60),em=s.add%60;
      g+=`<text x="220" y="55" font-size="18">開始：${hm(t0)}</text><text x="220" y="100" font-size="18" fill="#4f8fd8">經過：${eh?eh+' 小時 ':''}${em} 分（共 ${s.add} 分）</text><text x="220" y="145" font-size="20" font-weight="700">現在：${hm(t)}</text>`;
      const toHour=60-t0%60;
      return `<svg viewBox="0 0 440 215" class="wsvg">${g}</svg><p class="wmsg">${s.add===0?'按下面的按鈕讓時間往前走，看看分針（紅色）和時針怎麼動。':s.add<toHour?`從 ${hm(t0)} 走了 ${s.add} 分，到 ${hm(t)}；再走 ${toHour-s.add} 分就到整點 ${hm(t0+toHour)}。`:`從 ${hm(t0)} 先走 ${toHour} 分到整點 ${hm(t0+toHour)}${s.add>toHour?`，再走 ${s.add-toHour} 分到 ${hm(t)}`:''}。`}</p>`;},
    controls(s){return `<div class="wctl">往前走：${[[5,'5 分'],[15,'15 分'],[30,'30 分'],[60,'1 小時']].map(([v,n])=>`<button class="chip" data-act="a" data-v="${v}">+ ${n}</button>`).join('')}<button class="chip" data-act="z">重來</button></div>
      <div class="wctl">開始時間：${this.starts.map((t,i)=>`<button class="chip" data-act="s" data-v="${i}" aria-pressed="${s.s===i}">${hm(t)}</button>`).join('')}</div>`;},
    act(s,a,v){if(a==='a')s.add=Math.min(s.add+ +v,600);if(a==='z')s.add=0;if(a==='s'){s.s=+v;s.add=0;}}},
  example:{q:'上午 10:45 開始看電影，電影長 1 小時 50 分，幾點幾分結束？',steps:['先加 1 小時：11:45。','再加 50 分：45 + 50 = 95 分，滿 60 分要換成 1 小時，95 − 60 = 35。','所以是 12:35，也就是中午 12:35。']},
  tiers:[
   r=>{if(r()<.5){const h=ri(r,1,3),m=ri(r,1,11)*5;return{h:`${h} 小時 ${m} 分 = 幾分？`,key:String(h*60+m),check:numCheck(R(h*60+m)),hint:`1 小時 = 60 分：${h} × 60 + ${m}。`};}
     const t=ri(r,13,35)*5;return{h:`${t} 分 = ${Math.floor(t/60)} 小時又幾分？`,key:String(t%60),check:numCheck(R(t%60)),hint:`${t} − ${Math.floor(t/60)*60} = ?（1 小時是 60 分）`};},
   r=>{let t0,e;do{t0=ri(r,7,10)*60+ri(r,4,11)*5;e=ri(r,5,22)*5;}while(t0%60+e%60<60);return{h:`從 ${hm(t0)} 到 ${hm(t0+e)}，經過幾分鐘？`,key:String(e),check:numCheck(R(e)),hint:`先算到整點：${hm(t0)} 到 ${hm(t0+60-t0%60)} 是 ${60-t0%60} 分，再往後算。`};},
   r=>{let t0,e;do{t0=pick(r,[11,13,14,15,16])*60+ri(r,6,11)*5;e=ri(r,1,2)*60+ri(r,3,11)*5;}while(t0%60+e%60<60);const t=t0+e;
     return{h:`${hm(t0)} 出發，經過 ${Math.floor(e/60)} 小時 ${e%60} 分到達，到達時是幾點幾分？（寫成 4:15 這樣）`,key:hm12(t),check:timeCheck(Math.floor(t/60),t%60),hint:`先加 ${Math.floor(e/60)} 小時，再加 ${e%60} 分；分鐘超過 60 要進 1 小時。`};}]
};

/* ---------- 長度單位換算 ---------- */
MOD['M-len']={
  goal:'知道 1 公里 = 1000 公尺、1 公尺 = 100 公分、1 公分 = 10 公釐，會把「幾公尺幾公分」換成同一個單位。',
  wrong:{h:'常見的錯：3 公尺 5 公分寫成 35 公分；2 公里 40 公尺寫成 240 公尺。',why:'3 公尺是 3 × 100 = 300 公分，再加 5 公分是 305 公分；2 公里是 2000 公尺，再加 40 公尺是 2040 公尺。中間空出來的位數要補 0。'},
  concept:['1 公里 = 1000 公尺，1 公尺 = 100 公分，1 公分 = 10 公釐。','大單位換小單位用乘（數字變大）；小單位換大單位用除（數字變小）。','「幾公尺幾公分」：先把大單位換好，再加上小單位，空位記得補 0。'],
  widget:{init:()=>({p:0}),printState:()=>({p:0}),
    presets:[{a:3,b:5,u:1},{a:2,b:40,u:0},{a:4,b:6,u:2},{a:1,b:85,u:1}],U:['公里','公尺','公分','公釐'],F:[1000,100,10],
    render(s){const P=this.presets[s.p],U=this.U;let g='';
      U.forEach((u,i)=>{const x=20+i*102,y=30+i*38,on=i===P.u||i===P.u+1;g+=`<rect x="${x}" y="${y}" width="100" height="36" rx="6" fill="${on?'#f6d7a8':'#eef3fb'}" stroke="#333"/><text x="${x+50}" y="${y+25}" font-size="19" text-anchor="middle" font-weight="${on?700:400}">${u}</text>`;
        if(i<3)g+=`<path d="M${x+70} ${y+36} v 20 h 30" fill="none" stroke="${i===P.u?'#d23c3c':'#999'}" stroke-width="2"/><text x="${x+64}" y="${y+54}" font-size="15" text-anchor="end" fill="${i===P.u?'#d23c3c':'#666'}">× ${this.F[i]}</text>`;});
      const f=this.F[P.u],tot=P.a*f+P.b;const ds=String(tot).split(''),w=String(f).length;
      ds.forEach((d,i)=>{const pos=ds.length-1-i;g+=`<text x="${36+i*30}" y="196" font-size="28" font-weight="700" text-anchor="middle" fill="${pos<w-1?'#d23c3c':'#1d2433'}">${d}</text>`;});
      g+=`<text x="${36+ds.length*30-6}" y="196" font-size="17">${U[P.u+1]}</text>`;
      return `<svg viewBox="0 0 440 215" class="wsvg">${g}</svg><p class="wmsg">${P.a} ${U[P.u]} = ${P.a} × ${f} = ${P.a*f} ${U[P.u+1]}，再加 ${P.b} ${U[P.u+1]}，共 <b>${tot} ${U[P.u+1]}</b>（紅色的位數是 ${P.b} ${U[P.u+1]}）。${String(P.b).length<String(f).length-1?`${P.b} 只有 ${String(P.b).length} 位數，前面要補 0，不能寫成 ${P.a}${P.b}。`:''}</p>`;},
    controls(s){return `<div class="wctl">換一題：${this.presets.map((p,i)=>`<button class="chip" data-act="p" data-v="${i}" aria-pressed="${s.p===i}">${p.a} ${this.U[p.u]} ${p.b} ${this.U[p.u+1]}</button>`).join('')}</div>`;},
    act(s,a,v){s.p=+v;}},
  example:{q:'2 公里 35 公尺 + 980 公尺 = 幾公尺？',steps:['2 公里 = 2000 公尺，所以 2 公里 35 公尺 = 2035 公尺（百位要補 0）。','2035 + 980 = 3015 公尺。','也可以寫成 3 公里 15 公尺。']},
  tiers:[
   r=>{if(r()<.6){const a=ri(r,2,9),b=ri(r,12,95);return{h:`${a} 公尺 ${b} 公分 = 幾公分？`,key:String(a*100+b),check:numCheck(R(a*100+b)),hint:`${a} 公尺 = ${a*100} 公分，再加 ${b}。`};}
     const a=ri(r,2,19),b=ri(r,1,9);return{h:`${a} 公分 ${b} 公釐 = 幾公釐？`,key:String(a*10+b),check:numCheck(R(a*10+b)),hint:`1 公分 = 10 公釐：${a} × 10 + ${b}。`};},
   r=>{if(r()<.5){const a=ri(r,1,6),b=pick(r,[ri(r,1,9),ri(r,10,95)]);return{h:`${a} 公里 ${b} 公尺 = 幾公尺？`,key:String(a*1000+b),check:numCheck(R(a*1000+b)),hint:`${a} 公里 = ${a*1000} 公尺，${b} 要放在最後${b<10?'一位，中間補兩個 0':'兩位，百位補 0'}。`};}
     const a=ri(r,2,9),b=ri(r,1,9);return{h:`${a} 公尺 ${b} 公分 = 幾公分？`,key:String(a*100+b),check:numCheck(R(a*100+b)),hint:`${a} 公尺 = ${a*100} 公分，${b} 只有一位數，十位要補 0。`};},
   r=>{const t=ri(r,0,2);if(t===0){const n=ri(r,11,49)*10;return{h:`${n} 公分 = 幾公尺？（可以用小數）`,key:String(n/100),check:numCheck(R(n,100)),hint:`100 公分 = 1 公尺：${n} ÷ 100。`};}
     if(t===1){const n=ri(r,12,95)*100;return{h:`${n} 公尺 = 幾公里？（可以用小數）`,key:String(n/1000),check:numCheck(R(n,1000)),hint:`1000 公尺 = 1 公里：${n} ÷ 1000。`};}
     const a=pick(r,[1.2,1.5,2.4,2.5,3.6]),b=ri(r,3,9)*10+5;return{h:`${a} 公尺 + ${b} 公分 = 幾公分？`,key:String(Math.round(a*100)+b),check:numCheck(R(Math.round(a*100)+b)),hint:`${a} 公尺 = ${Math.round(a*100)} 公分。`};}]
};

/* ---------- 整數乘法 ---------- */
MOD['I-mul']={
  goal:'會用直式算乘法，知道 23 × 14 就是 23 × 10 加上 23 × 4。',
  wrong:{h:'常見的錯：23 × 14 算成 23 × 4 = 92，再加 23 × 1 = 23，得到 115；36 × 7 忘記加進位，算成 212。',why:'14 的 1 在十位，代表 10，要算 23 × 10 = 230，所以直式第二行要往左移一格：92 + 230 = 322。進位的數要在乘完下一位後加上去：6 × 7 = 42，寫 2 進 4；3 × 7 = 21，再加 4 = 25，答案 252。'},
  concept:['乘法就是「幾個幾」：4 × 6 是 4 個 6，也是 6 個 4，答案一樣。','把數拆成十位和個位，分開乘再加起來：23 × 14 = 23 × 10 + 23 × 4。','直式：先乘個位，再乘十位（寫的時候往左移一格），最後相加。'],
  widget:{init:()=>({p:0}),printState:()=>({p:0}),presets:[[23,14],[36,7],[45,12],[18,25]],
    render(s){const [a,b]=this.presets[s.p];const a1=Math.floor(a/10)*10,a0=a%10,b1=Math.floor(b/10)*10,b0=b%10;
      const cw=[a1?230:0,a0?110:0],rh=[b1?90:0,b0?62:0];const xs=[70,70+cw[0]],ys=[34,34+rh[0]];const col=[['#a9c9ef','#cfe1f7'],['#f6d7a8','#fbe6c8']];let g='',parts=[];
      [a1,a0].forEach((av,i)=>{if(!av)return;g+=`<text x="${xs[i]+cw[i]/2}" y="24" font-size="19" text-anchor="middle" font-weight="700">${av}</text>`;});
      [b1,b0].forEach((bv,j)=>{if(!bv)return;g+=`<text x="58" y="${ys[j]+rh[j]/2+7}" font-size="19" text-anchor="end" font-weight="700">${bv}</text>`;
        [a1,a0].forEach((av,i)=>{if(!av)return;g+=`<rect x="${xs[i]}" y="${ys[j]}" width="${cw[i]}" height="${rh[j]}" fill="${col[j][i]}" stroke="#333"/><text x="${xs[i]+cw[i]/2}" y="${ys[j]+rh[j]/2+7}" font-size="18" text-anchor="middle">${av} × ${bv} = ${av*bv}</text>`;parts.push(av*bv);});});
      return `<svg viewBox="0 0 440 ${44+rh[0]+rh[1]}" class="wsvg">${g}</svg><p class="wmsg">${a} 拆成 ${[a1,a0].filter(Boolean).join(' + ')}${b>=10?`，${b} 拆成 ${[b1,b0].filter(Boolean).join(' + ')}`:''}。每一塊分開算，再加起來：${parts.join(' + ')} = <b>${a*b}</b>。</p>`;},
    controls(s){return `<div class="wctl">換一題：${this.presets.map((p,i)=>`<button class="chip" data-act="p" data-v="${i}" aria-pressed="${s.p===i}">${p[0]} × ${p[1]}</button>`).join('')}</div>`;},
    act(s,a,v){s.p=+v;}},
  example:{q:'36 × 24 = ?',steps:['先乘個位：36 × 4 = 144。','再乘十位：36 × 20 = 720（直式寫成 72，往左移一格）。','加起來：144 + 720 = 864。']},
  tiers:[
   r=>{let a,b;do{a=ri(r,13,98);b=ri(r,3,9);}while((a%10)*b<10);return{h:`${a} × ${b} =`,key:String(a*b),check:numCheck(R(a*b)),hint:`先算 ${a%10} × ${b} = ${(a%10)*b}，寫 ${(a%10)*b%10} 進 ${Math.floor((a%10)*b/10)}；再算 ${Math.floor(a/10)} × ${b}，加上進位。`};},
   r=>{if(r()<.5){const a=ri(r,1,9)*100+ri(r,1,9),b=ri(r,3,9);return{h:`${a} × ${b} =`,key:String(a*b),check:numCheck(R(a*b)),hint:`十位是 0，0 × ${b} = 0，但個位乘完的進位要寫在十位。`};}
     const a=ri(r,12,39),b=ri(r,11,19);return{h:`${a} × ${b} =`,key:String(a*b),check:numCheck(R(a*b)),hint:`${a} × ${b} = ${a} × 10 + ${a} × ${b-10}。`};},
   r=>{if(r()<.5){const a=ri(r,23,98),b=ri(r,21,49);return{h:`${a} × ${b} =`,key:String(a*b),check:numCheck(R(a*b)),hint:`先算 ${a} × ${b%10}，再算 ${a} × ${b-b%10}，最後相加。`};}
     const n=ri(r,12,36),k=ri(r,14,28);const it=pick(r,[['盒','顆餅乾'],['箱','瓶水'],['排','張椅子']]);return{h:`一${it[0]}有 ${n} ${it[1].slice(0,1)}${it[1].slice(1)}，${k} ${it[0]}共有幾${it[1].slice(0,1)}？`,key:String(n*k),check:numCheck(R(n*k)),hint:`${k} 個 ${n}：${n} × ${k}。`};}]
};

/* ---------- 整數除法 ---------- */
MOD['I-div']={
  goal:'會用直式算除法，知道餘數一定比除數小，商的中間有 0 也不能漏掉。',
  wrong:{h:'常見的錯：47 ÷ 6 算成 6 餘 11；624 ÷ 6 算成 14（漏掉中間的 0）。',why:'餘數 11 比除數 6 大，代表還可以再分 1 份，應該是 7 餘 5。624 ÷ 6：百位 6 ÷ 6 = 1；十位 2 不夠除 6，商要寫 0；再把 2 和 4 合成 24，24 ÷ 6 = 4，答案是 104。'},
  concept:['除法是「平分」或「每幾個分一份」：47 顆糖每 6 顆裝一包，可以裝 7 包，剩 5 顆。','餘數一定比除數小。檢查：商 × 除數 + 餘數 = 被除數。','直式從最高位開始除；某一位不夠除，商就寫 0，再往下一位合起來除。'],
  widget:{init:()=>({n:47,d:6}),printState:()=>({n:47,d:6}),
    render(s){const {n,d}=s,q=Math.floor(n/d),rm=n%d;const per=Math.max(1,Math.floor(400/(d*13+14)));const gw=d*13+8;let g='',k=0;
      for(let i=0;i<q;i++){const x=12+(i%per)*(gw+6),y=12+Math.floor(i/per)*34;g+=`<rect x="${x}" y="${y}" width="${gw}" height="26" rx="8" fill="#eef3fb" stroke="#4f8fd8" stroke-width="1.5"/>`;for(let j=0;j<d;j++)g+=`<circle cx="${x+10+j*13}" cy="${y+13}" r="5" fill="#4f8fd8"/>`;k++;}
      const ry=12+Math.ceil(q/per)*34;for(let j=0;j<rm;j++)g+=`<circle cx="${22+j*16}" cy="${ry+13}" r="6" fill="#d23c3c"/>`;
      if(rm)g+=`<text x="${30+rm*16}" y="${ry+19}" font-size="17" fill="#d23c3c">剩 ${rm} 個</text>`;
      return `<svg viewBox="0 0 440 ${ry+(rm?40:8)}" class="wsvg">${g}</svg><p class="wmsg">${n} 個，每 ${d} 個圈成一組：可以圈 <b>${q} 組</b>，${rm?`剩下 <b>${rm} 個</b>（比 ${d} 少，不能再圈一組）。${n} ÷ ${d} = ${q} 餘 ${rm}。`:`剛好分完。${n} ÷ ${d} = ${q}。`}檢查：${q} × ${d}${rm?' + '+rm:''} = ${n}。</p>`;},
    controls(s){return `<div class="wctl">一共：${[17,23,30,47].map(v=>`<button class="chip" data-act="n" data-v="${v}" aria-pressed="${s.n===v}">${v} 個</button>`).join('')}</div>
      <div class="wctl">每組：${[3,4,5,6,8].map(v=>`<button class="chip" data-act="d" data-v="${v}" aria-pressed="${s.d===v}">${v} 個</button>`).join('')}</div>`;},
    act(s,a,v){s[a]=+v;}},
  example:{q:'635 ÷ 6 = ?',steps:['百位：6 ÷ 6 = 1，商寫 1。','十位：3 不夠除 6，商寫 0；把 3 和個位的 5 合成 35。','35 ÷ 6 = 5 餘 5，答案是 105 餘 5。檢查：105 × 6 + 5 = 635。']},
  tiers:[
   r=>{const d=ri(r,3,9),q=ri(r,3,12),rm=ri(r,1,d-1);const n=q*d+rm;return{h:`${n} ÷ ${d} = ？（有餘數請寫成「7 餘 5」）`,key:`${q} 餘 ${rm}`,check:divCheck(q,rm,d),hint:`${d} 的幾倍最接近 ${n} 又不超過？${d} × ${q} = ${q*d}。`};},
   r=>{let d,q;do{d=ri(r,2,9);q=r()<.6?ri(r,1,9)*100+ri(r,1,9):ri(r,1,9)*100+ri(r,1,9)*10;}while(q*d>999);return{h:`${q*d} ÷ ${d} =`,key:String(q),check:divCheck(q,0,d),hint:'從百位開始除；哪一位不夠除，商就寫 0。'};},
   r=>{if(r()<.5){const d=pick(r,[4,5,6,7,8,9]);let n;do{n=ri(r,23,60);}while(n%d===0);const q=Math.ceil(n/d);return{h:`${n} 位學生去校外教學，每輛車最多坐 ${d} 人，至少要幾輛車？`,key:String(q),check:numCheck(R(q)),hint:`${n} ÷ ${d} = ${Math.floor(n/d)} 餘 ${n%d}，剩下的 ${n%d} 人也要坐車。`};}
     const d=ri(r,12,35),q=ri(r,12,39);return{h:`${q*d} ÷ ${d} =`,key:String(q),check:divCheck(q,0,d),hint:`先估：${d} 大約是 ${Math.round(d/10)*10}，${q*d} ÷ ${Math.round(d/10)*10} 大約是多少？再調整。`};}]
};

/* ---------- 分數的意義與約分 ---------- */
MOD['F-equiv']={
  goal:'知道分數是「平分成幾份、取幾份」，會擴分、約分，找出一樣大的分數。',
  wrong:{h:`常見的錯：${F(2,3)} = ${F(4,5)}（分子分母都加 2）；${F(6,8)} 約分成 ${F(3,8)}（只除分子）。`,why:`擴分、約分要把分子和分母「同時乘」或「同時除」以同一個數，大小才不會變。${F(2,3)} 分子分母都乘 2 是 ${F(4,6)}；${F(6,8)} 分子分母都除以 2 是 ${F(3,4)}。`},
  concept:['分母：平分成幾份；分子：取了幾份。分子比分母大的叫假分數，可以化成帶分數。','擴分：分子分母同乘一個數，每一份切得更細，塗色的長度不變。','約分：分子分母同除以公因數；除到只剩 1 這個公因數，就是最簡分數。'],
  widget:{init:()=>({p:0,k:1}),printState:()=>({p:0,k:3}),presets:[[2,3],[3,4],[1,2],[3,5]],
    render(s){const [a,b]=this.presets[s.p],k=s.k,W=300;const bar=(n,den,y,col)=>{let g=`<rect x="20" y="${y}" width="${W}" height="40" fill="#fff" stroke="#333"/><rect x="20" y="${y}" width="${W*n/den}" height="40" fill="${col}" opacity=".8"/>`;
        for(let i=1;i<den;i++)g+=`<line x1="${20+W*i/den}" y1="${y}" x2="${20+W*i/den}" y2="${y+40}" stroke="#333"/>`;return g+`<text x="${W+34}" y="${y+27}" font-size="20">${n}/${den}</text>`;};
      return `<svg viewBox="0 0 440 130" class="wsvg">${bar(a,b,12,'#4f8fd8')}${bar(a*k,b*k,72,'#e39b3b')}</svg><p class="wmsg">${k===1?'下面的條和上面一樣。按「× 2」「× 3」把每一份再切細。':`每一份再切成 ${k} 份：分母 ${b} × ${k} = ${b*k}，塗色的份數也變成 ${a} × ${k} = ${a*k}。塗色的長度沒變，所以 ${F(a,b)} = ${F(a*k,b*k)}。反過來把 ${F(a*k,b*k)} 的分子分母同除以 ${k}，就是約分。`}</p>`;},
    controls(s){return `<div class="wctl">擴分：${[1,2,3,4].map(v=>`<button class="chip" data-act="k" data-v="${v}" aria-pressed="${s.k===v}">× ${v}</button>`).join('')}</div>
      <div class="wctl">換一個分數：${this.presets.map((p,i)=>`<button class="chip" data-act="p" data-v="${i}" aria-pressed="${s.p===i}">${p[0]}/${p[1]}</button>`).join('')}</div>`;},
    act(s,a,v){if(a==='k')s.k=+v;if(a==='p'){s.p=+v;s.k=1;}}},
  example:{q:`把 ${F(24,36)} 約分成最簡分數`,steps:[`24 和 36 都是偶數，同除以 2：${F(12,18)}。`,`12 和 18 都可以被 6 整除，同除以 6：${F(2,3)}。`,`2 和 3 只剩 1 這個公因數，所以最簡分數是 ${F(2,3)}。（一次除以最大公因數 12 也可以。）`]},
  tiers:[
   r=>{if(r()<.5){const b=ri(r,3,9),a=ri(r,1,b-1);const it=pick(r,[['一個披薩','片','吃了'],['一條緞帶','段','用了'],['一盒蛋糕','塊','分給弟弟']]);
       return{h:`${it[0]}平分成 ${b} ${it[1]}，${it[2]} ${a} ${it[1]}，是全部的幾分之幾？`,key:`${a}/${b}`,check:numCheck(R(a,b)),hint:`平分成 ${b} 份是分母，取了 ${a} 份是分子。`};}
     const b=ri(r,2,9),a=cop(r,b),k=ri(r,2,6);return{h:`${F(a,b)} = ${F('?',b*k)}，? 是多少？`,key:String(a*k),check:numCheck(R(a*k)),hint:`分母 ${b} 變成 ${b*k} 是乘 ${k}，分子也要乘 ${k}。`};},
   r=>{const b=ri(r,3,9),a=cop(r,b),g=ri(r,2,6);return{h:`把 ${F(a*g,b*g)} 約分成最簡分數`,key:`${a}/${b}`,check:simplestCheck(R(a,b)),hint:`${a*g} 和 ${b*g} 都可以被 ${g} 整除。`};},
   r=>{const d=ri(r,3,9),rr=cop(r,d),w=ri(r,1,5),n=w*d+rr;return r()<.5?{h:`把 ${F(n,d)} 化成帶分數`,key:`${w} ${rr}/${d}`,check:mixedCheck(R(n,d)),hint:`${n} ÷ ${d} = ${w} 餘 ${rr}：整數部分是 ${w}，剩下 ${rr} 份。`}
     :{h:`把 ${w}${F(rr,d)} 化成假分數`,key:`${n}/${d}`,check:improperCheck(R(n,d)),hint:`${w} 個整數 = ${w} × ${d} = ${w*d} 份，再加 ${rr} 份。`};}]
};

/* ---------- 周長與面積 ---------- */
MOD['M-rect']={
  goal:'分清楚周長（繞一圈的長度）和面積（裡面有幾格），會算長方形、正方形的周長和面積。',
  wrong:{h:'常見的錯：長 8、寬 5 的長方形，周長算成 8 + 5 = 13，或 8 × 5 = 40。',why:'周長要繞一整圈：長、寬、長、寬，(8 + 5) × 2 = 26 公分。8 × 5 = 40 是面積（裡面有 40 個 1 平方公分的方格），單位是平方公分。'},
  concept:['長方形周長 =（長 + 寬）× 2；正方形周長 = 邊長 × 4，單位是公分。','長方形面積 = 長 × 寬；正方形面積 = 邊長 × 邊長，單位是平方公分。','周長量的是「邊」，面積數的是「格子」，兩個不一樣。'],
  widget:{init:()=>({l:6,w:4,m:'p'}),printState:()=>({l:6,w:4,m:'a'}),
    render(s){const u=Math.min(40,Math.floor(380/s.l)),x0=30,y0=20;let g='';
      for(let i=0;i<s.l;i++)for(let j=0;j<s.w;j++){g+=`<rect x="${x0+i*u}" y="${y0+j*u}" width="${u}" height="${u}" fill="${s.m==='a'?'#cfe1f7':'#fff'}" stroke="#bbb"/>`;if(s.m==='a')g+=`<text x="${x0+i*u+u/2}" y="${y0+j*u+u/2+5}" font-size="13" text-anchor="middle" fill="#335">${j*s.l+i+1}</text>`;}
      g+=`<rect x="${x0}" y="${y0}" width="${s.l*u}" height="${s.w*u}" fill="none" stroke="${s.m==='p'?'#d23c3c':'#333'}" stroke-width="${s.m==='p'?5:2}"/>`;
      g+=`<text x="${x0+s.l*u/2}" y="${y0+s.w*u+24}" font-size="17" text-anchor="middle">長 ${s.l} 公分</text><text x="${x0+s.l*u+8}" y="${y0+s.w*u/2+6}" font-size="17">寬 ${s.w}</text>`;
      return `<svg viewBox="0 0 440 ${y0+s.w*u+34}" class="wsvg">${g}</svg><p class="wmsg">${s.m==='p'?`紅色是周長：繞一圈有 長 ${s.l} + 寬 ${s.w} + 長 ${s.l} + 寬 ${s.w} = (${s.l} + ${s.w}) × 2 = <b>${(s.l+s.w)*2} 公分</b>。`:`藍色是面積：每排 ${s.l} 格，有 ${s.w} 排，${s.l} × ${s.w} = <b>${s.l*s.w} 平方公分</b>。`}</p>`;},
    controls(s){return `<div class="wctl"><button class="chip" data-act="m" data-v="p" aria-pressed="${s.m==='p'}">看周長</button><button class="chip" data-act="m" data-v="a" aria-pressed="${s.m==='a'}">看面積</button></div>
      <div class="wctl">長：${[3,4,5,6,7,8].map(v=>`<button class="chip" data-act="l" data-v="${v}" aria-pressed="${s.l===v}">${v}</button>`).join('')}</div><div class="wctl">寬：${[2,3,4,5].map(v=>`<button class="chip" data-act="w" data-v="${v}" aria-pressed="${s.w===v}">${v}</button>`).join('')}</div>`;},
    act(s,a,v){s[a]=a==='m'?v:+v;}},
  example:{q:'一個長方形的周長是 30 公分，長是 9 公分，面積是多少平方公分？',steps:['周長 =（長 + 寬）× 2，所以長 + 寬 = 30 ÷ 2 = 15 公分。','寬 = 15 − 9 = 6 公分。','面積 = 9 × 6 = 54 平方公分。']},
  tiers:[
   r=>{const l=ri(r,5,15),w=ri(r,2,l-1);return r()<.5?{h:`長 ${l} 公分、寬 ${w} 公分的長方形，周長是多少公分？`,key:String((l+w)*2),check:numCheck(R((l+w)*2)),hint:`周長 =（長 + 寬）× 2。`}
     :{h:`長 ${l} 公分、寬 ${w} 公分的長方形，面積是多少平方公分？`,key:String(l*w),check:numCheck(R(l*w)),hint:`面積 = 長 × 寬。`};},
   r=>{const t=ri(r,0,2);if(t===0){const a=ri(r,3,15);return{h:`正方形的周長是 ${4*a} 公分，邊長是多少公分？`,key:String(a),check:numCheck(R(a)),hint:'正方形有 4 條一樣長的邊：周長 ÷ 4。'};}
     const l=ri(r,6,15),w=ri(r,2,l-1);return t===1?{h:`長方形的面積是 ${l*w} 平方公分，長是 ${l} 公分，寬是多少公分？`,key:String(w),check:numCheck(R(w)),hint:'寬 = 面積 ÷ 長。'}
       :{h:`長方形的周長是 ${(l+w)*2} 公分，長是 ${l} 公分，寬是多少公分？`,key:String(w),check:numCheck(R(w)),hint:`長 + 寬 = 周長 ÷ 2 = ${l+w}。`};},
   r=>{if(r()<.6){const l=ri(r,6,15),w=ri(r,2,l-1);return{h:`長方形的周長是 ${(l+w)*2} 公分，長是 ${l} 公分，面積是多少平方公分？`,key:String(l*w),check:numCheck(R(l*w)),hint:`先求寬：${(l+w)*2} ÷ 2 − ${l}，再算長 × 寬。`};}
     const a=ri(r,3,12);return{h:`正方形的周長是 ${4*a} 公分，面積是多少平方公分？`,key:String(a*a),check:numCheck(R(a*a)),hint:`邊長 = ${4*a} ÷ 4 = ${a}，面積 = 邊長 × 邊長。`};}]
};

/* ---------- 因數與倍數 ---------- */
MOD['I-factor']={
  goal:'會找出一個數所有的因數，會求兩個數的最大公因數和最小公倍數，並用在生活問題上。',
  wrong:{h:'常見的錯：找 36 的因數時漏掉 9 或 36；把 12 和 18 的最小公倍數算成 12 × 18 = 216。',why:'因數要「成對」找：1 × 36、2 × 18、3 × 12、4 × 9、6 × 6，才不會漏，1 和自己也是因數。12 × 18 是公倍數，但不是最小的：12 的倍數 12、24、36……，第一個也是 18 的倍數的是 36。'},
  concept:['a ÷ b 剛好整除，b 就是 a 的因數，a 就是 b 的倍數。','找因數：從 1 開始成對找，直到兩個數碰在一起。只有 1 和自己兩個因數的數（例如 2、3、5、7、11）叫做質數。','最大公因數：共同因數裡最大的；最小公倍數：共同倍數裡最小的。可以用短除法一起求。'],
  widget:{init:()=>({m:'f',n:24,p:0}),printState:()=>({m:'g',n:24,p:0}),pairs:[[12,18],[24,36],[8,12],[15,20]],
    render(s){let g='',msg='',H=0;if(s.m==='f'){const n=s.n,ps=[];for(let a=1;a*a<=n;a++)if(n%a===0)ps.push([a,n/a]);const c=Math.min(9,Math.floor(300/n));let y=12;
        ps.forEach(([a,b])=>{for(let i=0;i<b;i++)for(let j=0;j<a;j++)g+=`<rect x="${120+i*c}" y="${y+j*c}" width="${c}" height="${c}" fill="#a9c9ef" stroke="#fff" stroke-width=".8"/>`;g+=`<text x="12" y="${y+Math.min(a*c,40)/2+6}" font-size="18">${a} × ${b}</text>`;y+=Math.max(a*c,22)+12;});H=y;
        const fs=[];ps.forEach(([a,b])=>{fs.push(a);if(a!==b)fs.push(b);});fs.sort((x,y)=>x-y);
        msg=`${n} 個方格排成長方形，有 ${ps.length} 種排法，每種排法的長和寬就是一對因數。${n} 的因數：${fs.join('、')}，共 ${fs.length} 個。${fs.length===2?`只有 1 和 ${n}，所以 ${n} 是<b>質數</b>。`:''}`;}
      else{let [a,b]=this.pairs[s.p];const A=a,B=b,L=[];let y=30;for(const p of [2,3,5,7]){while(a%p===0&&b%p===0){g+=`<text x="60" y="${y}" font-size="22" text-anchor="end" fill="#d23c3c" font-weight="700">${p}</text><line x1="70" y1="${y-24}" x2="70" y2="${y+8}" stroke="#333" stroke-width="2"/><text x="110" y="${y}" font-size="22" text-anchor="middle">${a}</text><text x="180" y="${y}" font-size="22" text-anchor="middle">${b}</text><line x1="70" y1="${y+8}" x2="210" y2="${y+8}" stroke="#333" stroke-width="2"/>`;L.push(p);a/=p;b/=p;y+=40;}}
        g+=`<text x="110" y="${y}" font-size="22" text-anchor="middle" fill="#4f8fd8" font-weight="700">${a}</text><text x="180" y="${y}" font-size="22" text-anchor="middle" fill="#4f8fd8" font-weight="700">${b}</text>`;H=y+16;const G=L.reduce((x,y)=>x*y,1);
        g+=`<text x="240" y="50" font-size="18" fill="#d23c3c">最大公因數</text><text x="240" y="76" font-size="18" fill="#d23c3c">= ${L.join(' × ')} = ${G}</text><text x="240" y="116" font-size="18">最小公倍數</text><text x="240" y="142" font-size="18">= ${G} × ${a} × ${b} = ${G*a*b}</text>`;H=Math.max(H,156);
        msg=`短除法：用 ${A} 和 ${B} 共同的質因數一直除，直到兩數（藍色）沒有共同的因數。左邊紅色的數相乘是最大公因數，再乘上最下面兩個藍色的數，就是最小公倍數。`;}
      return `<svg viewBox="0 0 440 ${H}" class="wsvg">${g}</svg><p class="wmsg">${msg}</p>`;},
    controls(s){return `<div class="wctl"><button class="chip" data-act="m" data-v="f" aria-pressed="${s.m==='f'}">找因數</button><button class="chip" data-act="m" data-v="g" aria-pressed="${s.m==='g'}">短除法</button></div>`+
      (s.m==='f'?`<div class="wctl">${[12,18,24,36,17].map(v=>`<button class="chip" data-act="n" data-v="${v}" aria-pressed="${s.n===v}">${v}</button>`).join('')}</div>`
      :`<div class="wctl">${this.pairs.map((p,i)=>`<button class="chip" data-act="p" data-v="${i}" aria-pressed="${s.p===i}">${p[0]} 和 ${p[1]}</button>`).join('')}</div>`);},
    act(s,a,v){s[a]=a==='m'?v:+v;}},
  example:{q:'求 24 和 36 的最大公因數與最小公倍數',steps:['短除法：2 | 24 36 → 12 18；2 | 12 18 → 6 9；3 | 6 9 → 2 3。','2 和 3 沒有共同的因數了。最大公因數 = 2 × 2 × 3 = 12。','最小公倍數 = 12 × 2 × 3 = 72。']},
  tiers:[
   r=>{const n=pick(r,[24,30,36,40,42,48,54,60]);if(r()<.5){const fs=[],no=[];for(let i=2;i<n;i++)(n%i?no:fs).push(i);const c=pick(r,fs);const w=[];while(w.length<3){const x=pick(r,no.filter(v=>v<n/2+5));if(!w.includes(x))w.push(x);}
       const m=shuffleMC(r,String(c),w.map(String));return{h:`下列哪一個是 ${n} 的因數？`,mc:m.options,ans:m.ans,key:String(c),hint:`用 ${n} 除以每個選項，剛好整除的就是因數。`};}
     let k=0;for(let i=1;i<=n;i++)if(n%i===0)k++;return{h:`${n} 共有幾個因數？`,key:String(k),check:numCheck(R(k)),hint:`成對找：1 × ${n}、2 × ${n/2}……，別忘了 1 和 ${n}。`};},
   r=>{const g=ri(r,2,9);let x,y;do{x=ri(r,2,7);y=ri(r,2,7);}while(x===y||gcd(x,y)>1);return{h:`${g*x} 和 ${g*y} 的最大公因數是多少？`,key:String(g),check:numCheck(R(g)),hint:`用短除法，一直除到兩個數沒有共同的因數。`};},
   r=>{let a,b;do{a=pick(r,[6,8,9,10,12,15,18,20]);b=pick(r,[6,8,9,10,12,15,18,20]);}while(a===b||b%a===0||a%b===0);const L=lcm(a,b);
     return r()<.6?{h:`甲公車每 ${a} 分鐘發一班，乙公車每 ${b} 分鐘發一班。早上 7:00 兩車同時發車，至少再過幾分鐘會再同時發車？`,key:String(L),check:numCheck(R(L)),hint:`要找 ${a} 和 ${b} 的最小公倍數。`}
       :{h:`${a} 和 ${b} 的最小公倍數是多少？`,key:String(L),check:numCheck(R(L)),hint:`最小公倍數 = 最大公因數 ${gcd(a,b)} × ${a/gcd(a,b)} × ${b/gcd(a,b)}。`};}]
};

/* ---------- 統計與機率 ---------- */
MOD['S-stat']={
  goal:'會求平均數、中位數、眾數，知道極端值的影響，也會用「所有一樣可能的結果」算機率。',
  wrong:{h:'常見的錯：資料 5, 9, 2, 8, 3 的中位數說成 2（沒有先排序）；丟兩顆骰子，點數和是 7 的機率算成 1/11。',why:'中位數要先由小到大排好：2, 3, 5, 8, 9，正中間是 5。兩顆骰子的點數和 2～12 不是一樣容易出現：一共有 6 × 6 = 36 種一樣可能的結果，和是 7 的有 6 種，機率是 6/36 = 1/6。'},
  concept:['平均數 = 全部加起來 ÷ 個數，容易被特別大或特別小的數（極端值）拉走。','中位數：由小到大排好，取正中間；個數是偶數時，取中間兩個的平均。眾數：出現最多次的數。','機率 = 符合條件的結果數 ÷ 所有一樣可能的結果數，介於 0 和 1 之間。'],
  widget:{init:()=>({m:'d',x:false,s:7}),printState:()=>({m:'p',x:false,s:7}),
    render(s){let g='',msg='',H=170;if(s.m==='d'){const D=[4,5,5,6,7,8,s.x?30:9];const X=v=>20+v*12.5;const cnt={};
        g+=`<line x1="15" y1="120" x2="425" y2="120" stroke="#333" stroke-width="2"/>`;for(let v=0;v<=32;v+=5)g+=`<line x1="${X(v)}" y1="115" x2="${X(v)}" y2="125" stroke="#333"/><text x="${X(v)}" y="145" font-size="15" text-anchor="middle">${v}</text>`;
        D.forEach(v=>{cnt[v]=(cnt[v]||0)+1;g+=`<circle cx="${X(v)}" cy="${120-cnt[v]*16}" r="7" fill="${v===30?'#d23c3c':'#4f8fd8'}"/>`;});
        const mean=D.reduce((a,b)=>a+b,0)/D.length,med=[...D].sort((a,b)=>a-b)[3];
        g+=`<polygon points="${X(mean)},124 ${X(mean)-8},140 ${X(mean)+8},140" fill="#e39b3b"/><text x="${X(mean)}" y="162" font-size="15" text-anchor="middle" fill="#b06a00">平均 ${+mean.toFixed(2)}</text><line x1="${X(med)}" y1="40" x2="${X(med)}" y2="118" stroke="#0f8a6c" stroke-width="2" stroke-dasharray="4 3"/><text x="${X(med)}" y="34" font-size="15" text-anchor="middle" fill="#0f8a6c">中位數 ${med}</text>`;
        msg=s.x?`把 9 換成 30（極端值）：平均數從 6.29 被拉到 ${+mean.toFixed(2)}，可是中位數還是 6。資料有極端值時，中位數比較能代表「中間」。`:`7 個數由小到大：4, 5, 5, 6, 7, 8, 9。正中間第 4 個是 6，所以中位數是 6；5 出現 2 次最多，眾數是 5；平均數 = 44 ÷ 7 ≈ 6.29。按「加入極端值」看看會怎樣。`;}
      else{const c=34,x0=90,y0=36;let k=0;g+=`<text x="${x0-12}" y="${y0-12}" font-size="14">和</text>`;for(let i=1;i<=6;i++){g+=`<text x="${x0+(i-.5)*c}" y="${y0-8}" font-size="15" text-anchor="middle" fill="#4f8fd8">${i}</text><text x="${x0-10}" y="${y0+(i-.5)*c+5}" font-size="15" text-anchor="middle" fill="#e39b3b">${i}</text>`;
          for(let j=1;j<=6;j++){const on=i+j===s.s;if(on)k++;g+=`<rect x="${x0+(j-1)*c}" y="${y0+(i-1)*c}" width="${c}" height="${c}" fill="${on?'#f6d7a8':'#fff'}" stroke="#bbb"/><text x="${x0+(j-.5)*c}" y="${y0+(i-.5)*c+6}" font-size="16" text-anchor="middle" font-weight="${on?700:400}">${i+j}</text>`;}}
        H=y0+6*c+10;const r0=R(k,36);g+=`<text x="${x0+6*c+20}" y="90" font-size="17">和是 ${s.s}：</text><text x="${x0+6*c+20}" y="118" font-size="17">${k} 種</text><text x="${x0+6*c+20}" y="146" font-size="17" font-weight="700">${k}/36${r0.d!==36?' = '+ftxt(r0):''}</text>`;
        msg=`兩顆骰子（藍色一顆、橘色一顆）一共有 6 × 6 = 36 種一樣可能的結果。點數和是 ${s.s} 的有 ${k} 種，所以機率是 ${k}/36${r0.d!==36?' = '+ftxt(r0):''}。和是 7 的格子最多，所以 7 最容易出現。`;}
      return `<svg viewBox="0 0 440 ${H}" class="wsvg">${g}</svg><p class="wmsg">${msg}</p>`;},
    controls(s){return `<div class="wctl"><button class="chip" data-act="m" data-v="d" aria-pressed="${s.m==='d'}">平均數與中位數</button><button class="chip" data-act="m" data-v="p" aria-pressed="${s.m==='p'}">骰子的機率</button></div>`+
      (s.m==='d'?`<div class="wctl"><button class="chip" data-act="x" aria-pressed="${s.x}">${s.x?'拿掉極端值':'加入極端值 30'}</button></div>`
      :`<div class="wctl">點數和：${[2,4,7,10,12].map(v=>`<button class="chip" data-act="s" data-v="${v}" aria-pressed="${s.s===v}">${v}</button>`).join('')}</div>`);},
    act(s,a,v){if(a==='m')s.m=v;if(a==='x')s.x=!s.x;if(a==='s')s.s=+v;}},
  example:{q:'一個袋子裡有 3 顆紅球、5 顆白球、2 顆藍球，隨機摸一顆，摸到「不是白球」的機率是多少？',steps:['所有可能的結果：3 + 5 + 2 = 10 顆，每一顆被摸到的機會一樣。','不是白球的有紅球 3 顆 + 藍球 2 顆 = 5 顆。',`機率 = ${F(5,10)} = ${F(1,2)}。`]},
  tiers:[
   r=>{let D;do{D=Array.from({length:5},()=>ri(r,2,20));}while(new Set(D).size<5||D.reduce((a,b)=>a+b,0)%5);const sorted=[...D].sort((a,b)=>a-b);
     return r()<.5?{h:`資料：${D.join(', ')}，平均數是多少？`,key:String(D.reduce((a,b)=>a+b,0)/5),check:numCheck(R(D.reduce((a,b)=>a+b,0),5)),hint:`全部加起來 = ${D.reduce((a,b)=>a+b,0)}，再除以 5。`}
       :{h:`資料：${D.join(', ')}，中位數是多少？`,key:String(sorted[2]),check:numCheck(R(sorted[2])),hint:'先由小到大排好，再取正中間（第 3 個）。'};},
   r=>{if(r()<.5){let D;do{D=Array.from({length:6},()=>ri(r,1,30));}while(new Set(D).size<6);const s=[...D].sort((a,b)=>a-b);const m=R(s[2]+s[3],2);
       return{h:`資料：${D.join(', ')}，中位數是多少？`,key:ftxt(m).includes('/')?String((s[2]+s[3])/2):ftxt(m),check:numCheck(m),hint:`6 個數排好後，取第 3 和第 4 個（${s[2]} 和 ${s[3]}）的平均。`};}
     let avg,sc,last;do{avg=ri(r,70,88);sc=Array.from({length:4},()=>avg+ri(r,-8,8));last=avg*5-sc.reduce((a,b)=>a+b,0);}while(last<40||last>100);
     return{h:`小明 5 次考試的平均是 ${avg} 分，前 4 次是 ${sc.join('、')} 分，第 5 次考幾分？`,key:String(last),check:numCheck(R(last)),hint:`5 次總分 = ${avg} × 5 = ${avg*5}，再減掉前 4 次的和。`};},
   r=>{if(r()<.5){const s=ri(r,3,11);let k=0;for(let i=1;i<=6;i++)for(let j=1;j<=6;j++)if(i+j===s)k++;const v=R(k,36);return{h:`同時丟兩顆骰子，點數和是 ${s} 的機率是多少？`,key:ftxt(v),check:numCheck(v,{simplest:true}),hint:`一共有 36 種結果，數一數和是 ${s} 的有幾種。`};}
     const a=ri(r,2,6),b=ri(r,2,6),c=ri(r,1,5),t=a+b+c;const not=r()<.5;const v=R(not?t-b:a,t);
     return{h:`袋子裡有 ${a} 顆紅球、${b} 顆白球、${c} 顆藍球，隨機摸一顆，摸到${not?'「不是白球」':'紅球'}的機率是多少？`,key:ftxt(v),check:numCheck(v,{simplest:true}),hint:`一共 ${t} 顆，${not?`不是白球的有 ${t-b} 顆`:`紅球有 ${a} 顆`}。`};}]
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
