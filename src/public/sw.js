const KEY_MESSAGE = 'messaging::polling';
const broadcast = new BroadcastChannel(KEY_MESSAGE);

// The polling instance id AKA the interval id
let pollingInstanceId = null;

// When the service worker is installed, let's start polling
self.addEventListener('install', () => {
  self.skipWaiting();

  startPolling();
});

function broadcastMessage(message) {
  broadcast.postMessage(message);
}

/**
 * Fetch the API
 * @param {{debug: number, signal: AbortSignal}} props
 */
function fetchApi({ debug, signal }) {
  console.log(`fetching polling instance [interval: ${debug}]`, debug);
  return fetch('/api/', { signal: signal })
  // fetch('/lazy-api/', { signal: signal }) // if you want to test with a slow API ~3s/~6s
  .then((r) => r.text());
}

/**
 * Start polling
 */
function startPolling() {
  // actually, this number does not change, but it's just an example
  pollingInstanceId = setTimeout(() => {
    fetchApi({ debug: pollingInstanceId })
      .then(broadcastMessage)
      .catch((err) => {
        // We don't care about errors here, just display them
        console.log('error', err);
      })
      .finally(() => {
        console.log('polling done, restarting');
        clearInterval(pollingInstanceId);
        startPolling();
      });
  }, 5000);
}

self.addEventListener('message', (event) => {
  if (event.data === 'start') {
    // TBD
    // we also ask to service worker to start polling immediately
    // to avoid waiting for the next interval?
    if (!pollingInstanceId) {
      startPolling();
    }
    // Anyway, polling is started when the service worker is installed/activated
    // but does not start immediately
  }
});
