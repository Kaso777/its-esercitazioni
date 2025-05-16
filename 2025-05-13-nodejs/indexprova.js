const http=require('http');

const server=http.createServer((req, res) => {
    res.end('Il server funziona');
});

server.listen(1234, () => console.log("Il server è in ascolto.")); //server si mette in ascolto

console.log("La console funziona!")