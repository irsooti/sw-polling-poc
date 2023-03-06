const KEY_MESSAGE = 'message';
const broadcast = new BroadcastChannel(KEY_MESSAGE);

// The polling instance id AKA the interval id
let pollingInstanceId = null;

// When the service worker is installed, let's start polling
self.addEventListener('install', (event) => {
  self.skipWaiting();

  startPolling();
});

function broadcastMessage(message) {
  broadcast.postMessage(message);
}

function fetchApi(int) {
  console.log(`fetching polling instance [interval: ${int}]`, int);
  fetch('/api/')
    .then((r) => r.text())
    .then(broadcastMessage)
    .catch((err) => {
      // We don't care about errors here, just display them
      console.log('error', err);
    });
}

function startPolling() {
  if (pollingInstanceId === null) {
    // actually, this number does not change, but it's just an example
    pollingInstanceId = setInterval(() => fetchApi(pollingInstanceId), 5000);
  }
}

self.addEventListener('message', (event) => {
  if (event.data === 'start') {
    // TBD
    // we also ask to service worker to start polling immediately
    // to avoid waiting for the next interval?
    startPolling();
    // Anyway, polling is started when the service worker is installed/activated
    // but does not start immediately
  }
});
