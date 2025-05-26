const eventBus =require('./eventsBus');

function eventiAeroporto() {
    eventBus.emit('arrival', 'Pisa', '18:00', 'ZB2134');
    eventBus.emit('departure', 'Madrid', '22:00', 'YY1111');
    eventBus.emit('arrival', 'Firenze', '05:00', 'PQ2222');
    eventBus.emit('departure', 'Lisbona', '09:30', 'TR0145');

    eventBus.emit('delay', 'Madrid', '22:00', 'YY1111');
    eventBus.emit('cancel', 'Lisbona', '09:30', 'TR0145');



}

eventiAeroporto();