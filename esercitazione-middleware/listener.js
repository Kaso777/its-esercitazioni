const eventBus = require('./eventsBus');


eventBus.on('greet', (name) => {
    console.log(`Hello, ${name}!`);
});
// In questo esempio, abbiamo registrato un listener per l'evento 'greet'.
// Quando l'evento viene emesso, il listener stampa un messaggio di saluto
// con il nome fornito. Questo dimostra come i listener possono essere utilizzati
// per rispondere a eventi specifici all'interno dell'applicazione.