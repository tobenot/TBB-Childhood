// src/system/pwa.js
// PWA 支持：注入 manifest / theme-color / apple meta 到 <head>，并注册 service worker。
// 由 tweego 自动作为 story script 引入；运行时将标签写入真正的 <head>，
// 避免 SugarCube 无 head 注入槽位、且标签只能落在 body 的问题。

(function () {
  "use strict";

  var head = document.head || document.getElementsByTagName('head')[0];
  if (!head) {
    return;
  }

  function addLink(rel, href, attrs) {
    var link = document.createElement('link');
    link.rel = rel;
    link.href = href;
    if (attrs) {
      for (var k in attrs) {
        if (Object.prototype.hasOwnProperty.call(attrs, k)) {
          link.setAttribute(k, attrs[k]);
        }
      }
    }
    head.appendChild(link);
  }

  function addMeta(name, content) {
    var meta = document.createElement('meta');
    meta.setAttribute('name', name);
    meta.setAttribute('content', content);
    head.appendChild(meta);
  }

  // PWA manifest
  addLink('manifest', 'manifest.webmanifest');

  // 主题色（与 manifest 的 theme_color 一致）
  addMeta('theme-color', '#1a1a1a');

  // Apple / 移动端 PWA 元数据
  addMeta('apple-mobile-web-app-capable', 'yes');
  addMeta('mobile-web-app-capable', 'yes');
  addMeta('apple-mobile-web-app-status-bar-style', 'black-translucent');
  addMeta('apple-mobile-web-app-title', '不止于纸上');
  addLink('apple-touch-icon', 'assets/icons/apple-touch-icon.png');

  // 注册 service worker（仅在 http/https 下生效，file:// 直接跳过）
  if ('serviceWorker' in navigator && /^(https?:)/i.test(location.protocol)) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function (err) {
        console.warn('[PWA] service worker 注册失败：', err);
      });
    });
  }
})();
