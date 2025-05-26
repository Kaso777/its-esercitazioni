const eventBus =require('./eventsBus');

function sendGreeting() {
    eventBus.emit('greet', 'Alice');
    eventBus.emit('greet', 'Bob');
    eventBus.emit('greet', 'Charlie');




}

sendGreeting();
// In questo esempio, abbiamo creato un modulo che utilizza l'istanza di EventEmitter
// per emettere un evento chiamato 'greet' con un messaggio di saluto.
// Questo evento può essere ascoltato da altri moduli o parti dell'applicazione
// che sono interessati a ricevere notifiche quando viene emesso.