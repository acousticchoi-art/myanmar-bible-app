// Offline app-shell cache. A completed installation contains index.html plus its JS/CSS bundles.
const SHELL = 'kyanza-shell-v2';
const RUNTIME = 'kyanza-static-v1';
const OFFLINE_ICONS = ['/manifest.webmanifest', '/kyanza-icon.svg', '/kyanza-home-icon.png'];

async function installShell(){
  const cache = await caches.open(SHELL);
  // Do not use cache.addAll: one failed optional icon must not abort the whole installation.
  const page = await fetch(new Request('/', { cache:'reload', credentials:'same-origin' }));
  if (!page.ok) throw new Error('App entry unavailable');
  const html = await page.clone().text();
  const assetPaths = [...html.matchAll(/(?:src|href)\\s*=\\s*["'](\\/assets\\/[^"']+)["']/g)].map(match => match[1]);
  const scripts = [...new Set(assetPaths.filter(path=>/\\.js(?:\\?|$)/.test(path)))];
  const styles = [...new Set(assetPaths.filter(path=>/\\.css(?:\\?|$)/.test(path)))];
  if (!scripts.length) throw new Error('Missing required application JavaScript');
  // Cache essential bundles before marking the offline shell as ready.
  for (const path of [...scripts, ...styles]) {
    const response = await fetch(new Request(path, {cache:'reload', credentials:'same-origin'}));
    if(!response.ok) throw new Error('Unable to cache '+path);
    await cache.put(path,response);
  }
  await cache.put('/',page);
  // Icons and manifest are helpful but noncritical for opening the app offline.
  await Promise.all(OFFLINE_ICONS.map(async path=>{
    try {
      const response=await fetch(path,{cache:'reload'});
      if(response.ok)await cache.put(path,response);
    }catch{}
  }));
}

self.addEventListener('install',event=>{
  event.waitUntil((async()=>{await installShell();await self.skipWaiting()})());
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    // Preserve the previous working cache if an update was interrupted.
    const names=await caches.keys();
    const shells=names.filter(name=>name.startsWith('kyanza-shell-')&&name!==SHELL);
    if(shells.length>1)await Promise.all(shells.slice(0,-1).map(name=>caches.delete(name)));
    await self.clients.claim();
  })());
});
async function shellFallback(){
  const latest=await caches.open(SHELL);
  return await latest.match('/') || await caches.match('/') || Response.error();
}
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin===self.location.origin){
    if(event.request.mode==='navigate'){
      event.respondWith((async()=>{
        try{
          // Do not overwrite shell HTML unless corresponding versioned bundles are cached.
          const network=await fetch(event.request);
          if(network.ok)return network;
        }catch{}
        return shellFallback();
      })());
      return;
    }
    event.respondWith((async()=>{
      const cached=await caches.match(event.request);
      if(cached)return cached;
      try{
        const response=await fetch(event.request);
        if(response.ok&&url.pathname.startsWith('/assets/')){
          (await caches.open(RUNTIME)).put(event.request,response.clone()).catch(()=>{});
        }
        return response;
      }catch{return Response.error()}
    })());
  }else if(url.hostname==='fonts.googleapis.com'||url.hostname==='fonts.gstatic.com'){
    event.respondWith((async()=>{
      const cached=await caches.match(event.request);
      if(cached)return cached;
      try{
        const response=await fetch(event.request);
        (await caches.open(RUNTIME)).put(event.request,response.clone()).catch(()=>{});
        return response;
      }catch{return Response.error()}
    })());
  }
});
