const KEY_MESSAGE = 'message';
const broadcast = new BroadcastChannel(KEY_MESSAGE);

const App = (() => {
  // Listen for new messages and update the DOM
  listenForNewMessage(({ data }) => {
    window.document.title = data;
    window.document.querySelector('#root').textContent = data;
  });
})();

function listenForNewMessage(callback) {
  broadcast.addEventListener('message', callback);
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js', { scope: '/' })
    .then(function (registration) {
      if (registration.installing) {
        console.log('Service worker installing');
      } else if (registration.waiting) {
        console.log('Service worker installed');
      } else if (registration.active) {
        registration.active.postMessage('start');
      }
    })
    .catch(function (err) {
      console.log('ServiceWorker registration failed: ', err);
    });
}
