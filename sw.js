/* 讓學生頁面可以「加到主畫面」。一律先向網路要最新檔案（老師更新模組後馬上生效），
   只有沒網路時才用上次存下的版本。Firebase 的資料不經過這裡。 */
const CACHE='learn-path-v1';
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
  const req=e.request;const url=new URL(req.url);
  if(req.method!=='GET'||url.origin!==location.origin)return;
  e.respondWith(fetch(req).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy)).catch(()=>{});return res;})
    .catch(()=>caches.match(req,{ignoreSearch:true}).then(r=>r||caches.match('./index.html'))));
});
