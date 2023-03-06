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

Il problema nel fare ciò è che ogni client fa questa richiesta riferendosi ad un intervallo di tempo che viene settato per client e ne consegue che ogni client ha un suo timeout e fa una sua richiesta al server. Questo comporta un sovraccarico per il server che deve gestire n richieste ogni 5 secondi.

#### Soluzione
È possibile centralizzare il polling in un unico punto, ovvero il service worker. Il service worker è un worker che viene eseguito in background e che può essere utilizzato per gestire le richieste http. Il service worker può quindi fare polling al server e quando riceve una risposta la invia a tutti i client che hanno registrato un listener sul canale di comunicazione. Il client può quindi ricevere la risposta e aggiornare il DOM.

Per canale di comunicazione si intende il Broadcast Channel API che permette di inviare messaggi a tutti i client che hanno registrato un listener sul canale.

Ogni client quindi verifica se il service worker è attivo e se non lo è lo attiva e gli dice (per mezzo dell'interfaccia ServiceWorkerGlobalScope) che deve fare polling. 
## Useful links
- Broadcast Channel API: https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API
- Service Worker API: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API