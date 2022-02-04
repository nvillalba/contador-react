const CACHE_ELEMENTS = [
    "./",
    "https://unpkg.com/react@17/umd/react.production.min.js",
    "https://unpkg.com/react-dom@17/umd/react-dom.production.min.js",
    "https://unpkg.com/@babel/standalone/babel.min.js",
    "./styles.css",
    "./components/Contador.js"
];

// Instalación del Service Worker

const CACHE_NAME = "v2_cache_contador_react";

self.addEventListener("install", (e)=>{
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache =>{
            cache.addAll(CACHE_ELEMENTS)
            .then( ()=>{
                self.skipWaiting();
            })
            .catch(console.log)
        })
    );
});

// Activación del Service Worker
self.addEventListener("activate", (e)=>{

    const cacheWhitelist =[CACHE_NAME]

    e.waitUntil(
        caches.keys().then((cacheNames) =>{
            // console.log(cacheNames); // Esto es para verificar las versiones de cache y decidir que accion tomar.
            return Promise.all(cacheNames.map(cacheName =>{
                return cacheWhitelist.indexOf(cacheName) === -1 && caches.delete(cacheName)
            }))
        }) .then(() => self.clients.claim())
    );
});

// Respuesta del SW
self.addEventListener("fetch", (e)=>{
    e.respondWith(
        caches.match(e.request).then((res) => {
            if(res) {
                return res;
            }  
            return fetch(e.request);
    })
    );
});