/* 五位模擬學生的測驗結果（c 對、w 錯、i 不會、b 沒寫到），格式和判定系統匯出的一樣 */
(function(){
function S(base,map){const a=base.split('');for(const [k,v] of Object.entries(map)){const [x,y]=k.split('-').map(Number);for(let q=x;q<=(y||x);q++)a[q-1]=v;}return a.join('');}
const C='c'.repeat(65);
window.LEARN_MOCK={type:'diag',students:[
 {seat:'1',name:'陳小安',s:S(C,{'18':'w','20':'w','22':'w','23':'i','24':'i','25':'w','26':'w','27':'i','28':'i','30':'b','31-65':'b'})},
 {seat:'2',name:'林小博',s:S(C,{'26':'w','27':'w','31':'w','32-33':'i','35-50':'i','51-65':'b'})},
 {seat:'3',name:'王小晴',s:S(C,{'28-30':'w','38':'w','41-42':'w','45':'w','46':'i','48':'i','50':'w','51-52':'i','54':'i','57':'w','58-65':'b'})},
 {seat:'4',name:'張小德',s:S(C,{'36-38':'w','43':'w','44-45':'w','46':'i','48':'i','50':'w','51-52':'i','54':'i','57':'w','58-65':'i'})},
 {seat:'5',name:'李小恩',s:S(C,{'52':'w','58-60':'w','62-63':'w'})}
]};
})();
