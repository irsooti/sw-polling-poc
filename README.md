# Optimize polling interval for the current web server

## Installation
To run this application run the following:

```bash
npm install # or pnpm if you have it
npm start
```

Then open [http://localhost:3000/](http://localhost:3000/) to see your app.

## How it works (in italian)

![Docs](./docs/sw.svg)

### Panoramica del problema
Supponiamo di avere n client (per client si intendono tab, finestre o iframe dello stesso url) che devono fare polling ad un server. Il server risponde con un testo, il client quindi utilizza questo testo per disporlo sul DOM. Il server risponde con un testo diverso ogni 5 secondi. Il client quindi deve fare polling ogni 5 secondi.

Il problema nel fare ciò è che ogni client una sua richiesta al server e questo comporta un sovraccarico per il server che deve gestire n richieste client ogni 5 secondi.

#### Soluzione
È possibile centralizzare il polling in un unico punto, ovvero il service worker. Il service worker è un worker che viene eseguito in background e che può essere utilizzato per gestire le richieste http. Il service worker può quindi fare polling al server e quando riceve una risposta la invia a tutti i client che hanno registrato un listener sul canale di comunicazione dedicato. Il client può quindi ricevere la risposta e aggiornare il DOM.

Per canale di comunicazione si intende l'impiego della Broadcast Channel API che permette di inviare messaggi a tutti i client che sottoscrivono al canale.

Ogni client quindi verifica se il service worker è attivo e se non lo è lo attiva e gli dice (per mezzo dell'interfaccia ServiceWorkerGlobalScope) che deve fare polling.

In questo modo, nonostante ci possano essere tanti client, è soltanto nel service worker che verrà fatto polling.

## Browser supportati e possibili problematiche
I service worker sono una tecnologia abbastanza consolidata, [caniuse](https://caniuse.com/serviceworkers) mostra un ampio supporto verso tutti i browser eccezion fatta per opera mini che rappresenta lo 0,99% dell'uso globale ed internet explorer 0,62%.
Le broadcast sono supportati [praticamente allo stesso modo](https://caniuse.com/?search=broadcast), solo che per quanto riguarda opera mini il supporto è sconosciuto.
Non ho evidenza di possibili problematiche.

## Useful links
- Broadcast Channel API: https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API
- Service Worker API: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
- Is service worker ready? https://jakearchibald.github.io/isserviceworkerready
