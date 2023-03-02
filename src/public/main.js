const App = (() => {
  window.addEventListener('HELLO', (data) => {
    console.log({ data });
    window.document.querySelector('#root').textContent = data.detail;
  });

  const message_broadcast = (message) => {
    console.log({ message })
    window.localStorage.setItem('message', JSON.stringify(message));
    window.localStorage.removeItem('message');
  }

  function message_receive(ev) {
    console.log(ev);
    var message = JSON.parse(ev.originalEvent.newValue);

    window.dispatchEvent(new CustomEvent('HELLO', { detail: message }));

    // etc.
  }

  // Listen for changes to localStorage, it works **across** tabs but not the same tab
  window.addEventListener('storage', message_receive);

  return { message_broadcast };
})();
