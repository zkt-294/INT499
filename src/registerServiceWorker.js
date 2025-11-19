// Registers service worker and dispatches a global `swUpdated` event
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => {
        console.log('Service Worker registered:', reg);
        // If there's an updated SW waiting, notify the app
        if (reg.waiting) {
          window.dispatchEvent(new Event('swUpdated'));
        }

        reg.addEventListener('updatefound', () => {
          const installing = reg.installing;
          if (!installing) return;
          installing.addEventListener('statechange', () => {
            if (installing.state === 'installed' && navigator.serviceWorker.controller) {
              // New content available, notify the app
              window.dispatchEvent(new Event('swUpdated'));
            }
          });
        });
      })
      .catch(err => console.error('SW registration failed:', err));
  });

  // When the active service worker changes, reload to get the new content
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload();
  });

  // Provide a helper to trigger skipWaiting from the app
  window.__swSkipWaiting = function () {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
    }
  };
}
