const eventBus = require('./eventsBus');


eventBus.on('arrival', (origin, hour, flight) => {
    console.log(`Il volo ${flight} è arrivato da ${origin} alle ${hour}.\n`);
});

eventBus.on('arrival', (origin, hour, flight) => {
    console.log(`[Noreply Notify] Gentile passeggero sei arrivato, sorti dall'aereo!\n`);
});

eventBus.on('departure', (destination, hour, flight) => {
    console.log(`Il volo ${flight} parte per ${destination} alle ${hour}.\n`);
});

eventBus.on('departure', (destination, hour, flight) => {
    console.log(`[Noreply Notify] Gentile passeggero il volo parte alle ${hour}, moviti!\n`);
});

eventBus.on('delay', (destination, hour, flight) => {
    console.log(`Il volo ${flight} per ${destination} è in ritardo.\n`);
});

eventBus.on('cancel', (destination, hour, flight) => {
    console.log(`Il volo ${flight} per ${destination} è stato cancellato.\n`);
});

