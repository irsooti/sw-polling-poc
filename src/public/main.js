const NEW_MESSAGE_LISTENER = 'NEW_MESSAGE_LISTENER';
const RESET_MESSAGE_LISTENER = 'RESET_MESSAGE_LISTENER';
const KEY_MESSAGE = 'message';

const App = (() => {
  // Listen for new messages and update the DOM
  listenForNewMessage((data) => {
    window.document.title = data.detail;
    window.document.querySelector('#root').textContent = data.detail;
  });

  // Start polling for new messages
  startPolling();

  // Listen for changes to localStorage, it works **across** tabs but not the same tab
  listenForOtherTabs();
})();

function fetchApi(abortController) {
  fetch('/api/', { signal: abortController.signal })
    .then((r) => r.text())
    .then(broadcastMessage)
    .then(dispatchNewMessage)
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
  let abortController = new AbortController();
  let interval = setInterval(() => fetchApi(abortController), 5000);

  window.addEventListener(RESET_MESSAGE_LISTENER, () => {
    clearInterval(interval);

    abortController.abort();
    abortController = new AbortController();

    interval = setInterval(() => fetchApi(abortController), 5000);
  });
}

function onMessageReceive(ev) {
  if (ev.key !== KEY_MESSAGE || ev.newValue === null) return;

  var message = JSON.parse(ev.newValue);

  window.dispatchEvent(
    new CustomEvent(NEW_MESSAGE_LISTENER, { detail: message })
  );
  window.dispatchEvent(new CustomEvent(RESET_MESSAGE_LISTENER));
}

function broadcastMessage(message) {
  window.localStorage.setItem(KEY_MESSAGE, JSON.stringify(message));
  window.localStorage.removeItem(KEY_MESSAGE);
  return message;
}

function dispatchNewMessage(data) {
  return dispatchNewMessage(data);
}

function dispatchResetPolling() {
  window.dispatchEvent(new CustomEvent(RESET_MESSAGE_LISTENER));
}

function dispatchNewMessage(data) {
  window.dispatchEvent(new CustomEvent(NEW_MESSAGE_LISTENER, { detail: data }));
  return data;
}

function listenForOtherTabs() {
  window.addEventListener('storage', onMessageReceive);
}

function listenForNewMessage(callback) {
  window.addEventListener(NEW_MESSAGE_LISTENER, callback);
}
