/* 資料層：示範模式（瀏覽器 localStorage）或 Firebase Realtime Database
   Firebase 路徑：learn/students/{座號}、learn/progress/{座號}/{模組}、learn/logs/{座號}/{自動編號} */
(function(){
'use strict';
const SDK='https://www.gstatic.com/firebasejs/10.12.2/';
const KEY='learn-demo-v1';
const loadScript=src=>new Promise((ok,no)=>{const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=()=>no(new Error('無法載入 '+src));document.head.appendChild(s);});
const clean=o=>JSON.parse(JSON.stringify(o));

/* ---------- 示範模式 ---------- */
const mem={students:{},progress:{},logs:{}};
function dread(){try{return JSON.parse(localStorage.getItem(KEY))||clean(mem);}catch{return mem;}}
function dwrite(d){try{localStorage.setItem(KEY,JSON.stringify(d));}catch{Object.assign(mem,d);}}
const Demo={
  mode:'demo',
  async init(){return true;},
  async user(){return{uid:'demo',admin:true};},
  async signInAdmin(){return true;},
  async getStudent(seat){return dread().students[seat]||null;},
  async getProgress(seat){return dread().progress[seat]||{};},
  async saveModule(seat,mid,data){const d=dread();d.progress[seat]=d.progress[seat]||{};d.progress[seat][mid]=data;dwrite(d);},
  async log(seat,ev){const d=dread();const L=d.logs[seat]=d.logs[seat]||[];L.push(ev);if(L.length>400)L.splice(0,L.length-400);dwrite(d);},
  async listStudents(){return dread().students;},
  async listProgress(){return dread().progress;},
  async listLogs(seat,n=30){return(dread().logs[seat]||[]).slice(-n).reverse();},
  async putStudents(arr){const d=dread();arr.forEach(s=>d.students[s.seat]=s);dwrite(d);},
  async removeStudent(seat){const d=dread();delete d.students[seat];delete d.progress[seat];delete d.logs[seat];dwrite(d);},
  async clearAll(){dwrite(clean({students:{},progress:{},logs:{}}));}
};

/* ---------- Firebase ---------- */
let fb=null,rdb=null;
const Fire={
  mode:'firebase',
  async init(cfg){
    await loadScript(SDK+'firebase-app-compat.js');await loadScript(SDK+'firebase-auth-compat.js');await loadScript(SDK+'firebase-database-compat.js');
    fb=firebase.initializeApp(cfg);rdb=firebase.database();
    await new Promise(r=>{const u=firebase.auth().onAuthStateChanged(()=>{u();r();});});
    return true;
  },
  async user(){return firebase.auth().currentUser;},
  async ensureStudentAuth(){if(!firebase.auth().currentUser)await firebase.auth().signInAnonymously();},
  async signInAdmin(){const p=new firebase.auth.GoogleAuthProvider();await firebase.auth().signInWithPopup(p);return true;},
  async signOut(){await firebase.auth().signOut();},
  async getStudent(seat){await this.ensureStudentAuth();const v=await rdb.ref('learn/students/'+seat).get();return v.val();},
  async getProgress(seat){const v=await rdb.ref('learn/progress/'+seat).get();return v.val()||{};},
  async saveModule(seat,mid,data){await rdb.ref(`learn/progress/${seat}/${mid}`).set(clean(data));},
  async log(seat,ev){await rdb.ref('learn/logs/'+seat).push(clean(ev));},
  async listStudents(){return(await rdb.ref('learn/students').get()).val()||{};},
  async listProgress(){return(await rdb.ref('learn/progress').get()).val()||{};},
  async listLogs(seat,n=30){const v=(await rdb.ref('learn/logs/'+seat).limitToLast(n).get()).val()||{};return Object.values(v).reverse();},
  async putStudents(arr){const u={};arr.forEach(s=>u['learn/students/'+s.seat]=clean(s));await rdb.ref().update(u);},
  async removeStudent(seat){const u={};['students','progress','logs'].forEach(k=>u[`learn/${k}/${seat}`]=null);await rdb.ref().update(u);},
  async clearAll(){await rdb.ref('learn').remove();}
};

const cfg=(window.LEARN_CONFIG||{}).firebase||{};
const useFire=cfg.apiKey&&cfg.apiKey!=='請貼上';
window.Store=useFire?Fire:Demo;
window.StoreReady=(async()=>{try{await window.Store.init(cfg);}catch(e){console.error(e);window.Store=Demo;Demo.fallback=e.message;}return window.Store;})();
})();
