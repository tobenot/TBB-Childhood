/*
 * sw.js - Service Worker for TBB-Childhood
 *
 * 策略：
 * - install：precache 应用外壳（index.html / manifest / 图标 / favicon）
 * - activate：清理旧版本缓存并立即接管客户端
 * - fetch：
 *   - navigate 请求 -> stale-while-revalidate（离线可用，后台更新）
 *   - 同源静态 GET 资源 -> stale-while-revalidate
 *   - /api 与跨域与非 GET 请求 -> 不拦截，直接走网络
 */

var CACHE_VERSION = 'tbb-childhood-v1';

var PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/favicon.ico',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/maskable-512.png',
  './assets/icons/apple-touch-icon.png'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(function (cache) {
      // 逐个缓存，单个失败不影响整体安装（例如 index.html 在源仓库中不存在）
      return Promise.all(
        PRECACHE_URLS.map(function (url) {
          return cache.add(url).catch(function (err) {
            console.warn('[SW] precache miss:', url, err && err.message);
          });
        })
      );
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (key) {
          return key !== CACHE_VERSION;
        }).map(function (key) {
          return caches.delete(key);
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (event) {
  var req = event.request;

  // 只处理 GET；POST/PUT 等交给网络
  if (req.method !== 'GET') {
    return;
  }

  var url;
  try {
    url = new URL(req.url);
  } catch (e) {
    return;
  }

  // 跨域请求不拦截
  if (url.origin !== self.location.origin) {
    return;
  }

  // /api 请求不拦截
  if (url.pathname.indexOf('/api') === 0) {
    return;
  }

  // 导航请求：stale-while-revalidate，离线回退 index.html
  if (req.mode === 'navigate') {
    event.respondWith(
      caches.open(CACHE_VERSION).then(function (cache) {
        return cache.match(req).then(function (cached) {
          var network = fetch(req).then(function (res) {
            if (res && res.status === 200) {
              cache.put(req, res.clone());
            }
            return res;
          }).catch(function () {
            return cached || cache.match('./index.html') || cache.match('./');
          });
          return cached || network;
        });
      })
    );
    return;
  }

  // 同源静态资源：stale-while-revalidate
  event.respondWith(
    caches.open(CACHE_VERSION).then(function (cache) {
      return cache.match(req).then(function (cached) {
        var network = fetch(req).then(function (res) {
          // 仅缓存基本（同源、非错误）响应，避免缓存 opaque / 错误体
          if (res && res.status === 200 && res.type === 'basic') {
            cache.put(req, res.clone());
          }
          return res;
        }).catch(function () {
          return cached;
        });
        return cached || network;
      });
    })
  );
});
