const EventEmitter = require('events');

const eventsBus = new EventEmitter();

module.exports = eventsBus; // Esporta l'istanza di EventEmitter nel senso che può essere utilizzata in altri moduli
// per gestire eventi personalizzati in modo centralizzato.
// Questo permette di emettere e ascoltare eventi in modo semplice e modulare,
// facilitando la comunicazione tra diverse parti dell'applicazione senza dover
// creare dipendenze dirette tra i moduli.
// Ad esempio, un modulo può emettere un evento quando si verifica un'azione
// specifica, e altri moduli possono ascoltare quell'evento per eseguire
// azioni correlate.
// In questo modo, si promuove una architettura più flessibile e scalabile,
// riducendo il coupling tra i componenti dell'applicazione.
// L'istanza di EventEmitter consente di utilizzare metodi come `on` per
// registrare listener per eventi specifici e `emit` per emettere eventi
// con eventuali dati associati. Questo approccio è molto utile in applicazioni
// Node.js per gestire eventi asincroni e comunicazione tra moduli in modo
// efficiente e chiaro.
