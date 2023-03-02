const KEY_MESSAGE = 'message';
const broadcast = new BroadcastChannel(KEY_MESSAGE);

let abortController = new AbortController();
let interval = null;

self.addEventListener('install', (event) => {
  self.skipWaiting();

  startPolling();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(async () => {
    const allClients = await clients.matchAll({
      includeUncontrolled: true,
    });

    console.log(allClients.map((c) => c.url));
  });
});

self.addEventListener('sync', (event) => {
  console.log('sync event', event);
});

function broadcastMessage(message) {
  broadcast.postMessage(message);
}

function fetchApi(abortController) {
  fetch('/api/', { signal: abortController.signal })
    .then((r) => r.text())
    .then(broadcastMessage)
    .catch((err) => {
      // ? important to check if the error is an abort error, or else it will log an error
      if (err.name === 'AbortError') {
        console.log('Aborted! This is expected.', err);
        return;
      }
      console.error(err);
    });
}

function startPolling() {
  interval = setInterval(() => fetchApi(abortController), 5000);
}

self.addEventListener('message', (event) => {
  if (event.data === 'start') {
    console.log(interval);
    if (interval !== null) clearInterval(interval);
    startPolling();
  }
});
