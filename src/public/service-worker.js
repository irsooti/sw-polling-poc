// https://developers.google.com/web/fundamentals/primers/service-workers/
// https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle
// https://developers.google.com/web/fundamentals/primers/service-workers/registration
// https://developers.google.com/web/fundamentals/primers/service-workers/high-performance-loading
// https://developers.google.com/web/fundamentals/primers/service-workers/registration

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/service-worker.js', { scope: '/' })
    .then(function (registration) {
      const fn = () => {
        fetch('/api/')
          .then((r) => r.text())
          .then((data) => {
            registration.active.postMessage(data);
          });
      };

      let interval = setInterval(fn, 10000);

      self.addEventListener('RESET', (data) => {
        console.log('RESET', data);
        clearInterval(interval);
        interval = setInterval(fn, 10000);
      });

      console.log(
        'ServiceWorker registration successful with scope: ',
        registration.scope
      );
    })
    .catch(function (err) {
      console.log('ServiceWorker registration failed: ', err);
    });

  self.addEventListener('message', (event) => {
    console.log(event);
    // event is a MessageEvent object
    self.dispatchEvent(
      new CustomEvent('RESET', {
        detail: 'x',
      })
    );

    self.dispatchEvent(
      new CustomEvent('HELLO', {
        detail: 'xxxxx',
      })
    );
    console.log(`The service worker sent me a message:`, event.data);
  });
}
