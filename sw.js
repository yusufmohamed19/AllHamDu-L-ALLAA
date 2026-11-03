const V="yawmi-v11",F=["./","./index.html","./manifest.json","./quran.js","./sync.js","./firebase-config.js","./icons/icon-192.png","./icons/icon-512.png","./icons/icon-maskable-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(F)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
const wait=ms=>new Promise((_,r)=>setTimeout(r,ms));
// أوفلاين أولًا: الملفات المحفوظة بتفتح فورًا (حتى من غير نت)، وبتتحدّث في الخلفية لما يكون فيه نت
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  if(new URL(e.request.url).origin!==location.origin)return;
  e.respondWith((async()=>{
    const c=await caches.open(V),nav=e.request.mode==="navigate";
    const hit=await c.match(e.request,{ignoreSearch:true})||(nav?await c.match("./index.html"):null);
    const net=fetch(e.request).then(r=>{if(r&&r.ok)c.put(e.request,r.clone());return r});
    if(hit){
      if(nav){try{return await Promise.race([net,wait(2500)])}catch(_){return hit}}
      net.catch(()=>{});return hit;
    }
    try{return await net}catch(_){return Response.error()}
  })());
});
