// Kyanza offline application shell. Bible text is stored separately in IndexedDB.
const SHELL='kyanza-shell-v1';
const RUNTIME='kyanza-static-v1';
const ASSETS=['/','/manifest.webmanifest','/kyanza-icon.svg','/kyanza-home-icon.png'];
self.addEventListener('install', event => event.waitUntil((async()=>{
  const cache=await caches.open(SHELL);
  const page=await fetch('/',{cache:'reload'});
  if(!page.ok)throw new Error('App shell unavailable');
  const html=await page.clone().text();
  const hashed=[...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map(match=>match[1]);
  await cache.addAll([...new Set([...ASSETS.filter(path=>path!=='/'),...hashed])]);
  await cache.put('/',page);
  await self.skipWaiting();
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
  const names=await caches.keys();
  await Promise.all(names.filter(name=>name.startsWith('kyanza-shell-')&&name!==SHELL).map(name=>caches.delete(name)));
  await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin===self.location.origin){
    if(event.request.mode==='navigate'){
      event.respondWith((async()=>{
        try{const response=await fetch(event.request);if(response.ok){(await caches.open(SHELL)).put('/',response.clone()).catch(()=>{});}return response;}
        catch{return (await caches.match('/'))||Response.error();}
      })());
      return;
    }
    event.respondWith((async()=>{
      const cached=await caches.match(event.request);
      if(cached)return cached;
      try{
        const response=await fetch(event.request);
        if(response.ok&&(url.pathname.startsWith('/assets/')||url.pathname.startsWith('/bible/ko/'))){
          (await caches.open(RUNTIME)).put(event.request,response.clone()).catch(()=>{});
        }
        return response;
      }catch{return Response.error();}
    })());
  }else if(url.hostname==='fonts.googleapis.com'||url.hostname==='fonts.gstatic.com'){
    event.respondWith((async()=>{
      const cached=await caches.match(event.request);
      if(cached)return cached;
      try{
        const response=await fetch(event.request);
        (await caches.open(RUNTIME)).put(event.request,response.clone()).catch(()=>{});
        return response;
      }catch{return Response.error();}
    })());
  }
});
