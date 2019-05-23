//IMPORTS
importScripts('js/sw-utils.js');

//1. declaro las constantes del cache

const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v2';
const INMUTABLE_CACHE = 'inmutable-v1';

//2. declaro el appshell que tendra todos los elementos necesarios para el funcionamiento del sitio

const APP_SHELL = [
    //'/',
    'index.html',
    'menu.html',
    'styles/style.css',
    'styles/framework.css',
    'styles/news.css',
    'images/silvano-letras.png',
    'images/pictures/9.jpg',
    'images/pictures/18.jpg',
    'images/pictures/14.jpg',
    'images/empty.png',
    'images/noticias/1/cover.png',
    'images/noticias/2/cover.png',
    'images/noticias/3/cover.png',
    'images/noticias/4/cover.png',
    'images/instagram-logo.png',
    'images/logo-footer.png',
    'scripts/plugins.js',
    'scripts/custom.js',
    'js/app.js',
    'js/sw-utils.js',
    'http://localhost:8081/favicon.ico'
];

//3. declaro el appshell de los inmutables (Librerias y archivos que no seran modificados jamás)

const APP_SHELL_INMUTABLE = [
    'scripts/lightwidget.js',
    'https://fonts.googleapis.com/css?family=Poppins:100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i|Roboto:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i',
    'fonts/css/fontawesome-all.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js',
    'http://localhost:8081/fonts/webfonts/fa-solid-900.woff2',
    'http://localhost:8081/fonts/webfonts/fa-brands-400.woff2',
    'http://localhost:8081/fonts/webfonts/fa-solid-900.woff',
    'http://localhost:8081/fonts/webfonts/fa-solid-900.ttf',
    'http://localhost:8081/fonts/BambinoNew.ttf',

];

//4. Realizo la instalación y almaceno los app_shell creados

self.addEventListener('install', e => {
    const cacheStatic = caches.open(STATIC_CACHE).then(cache => {
        cache.addAll(APP_SHELL);
    });

    const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache => {
        cache.addAll(APP_SHELL_INMUTABLE);
    });


    e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
});

//5. Creo un evento para eliminar los cachés viejos que ya no se requieran durante la instalación

self.addEventListener('activate', e => {
    const respuesta = caches.keys().then(keys => {
        keys.forEach(key => {
            if (key !== STATIC_CACHE && key.includes('static')) {
                return caches.delete(key);
            }

            if (key !== DYNAMIC_CACHE && key.includes('dynamic')) {
                return caches.delete(key);
            }
        });
    });

    e.waitUntil(respuesta);
});

//6. Configuro la estrategia Cache with Dynamic Fallback

self.addEventListener('fetch', e => {
    const respuesta = caches.match(e.request).then(res => {
        if (res) {
            return res;
        } else {
            console.log('No existe', e.request.url);
            return fetch(e.request).then(newResp => {
                return actualizarCacheDinamico(DYNAMIC_CACHE, e.request, newResp);
            });
        }
    });

    e.respondWith(respuesta);
});