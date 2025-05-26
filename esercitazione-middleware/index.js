const express = require('express');
const app = express();
const PORT = 3000;

app.listen(PORT, () => { // mi accende un server che si mette in ascolto sulla porta
    console.log(`Server running on http://localhost:${PORT}`)
})

app.use((req, res, next) => {
    console.log(`${req.method} request received on url ${req.url}`);
    next();
});

app.get('/', (req, res,) => {
    res.write('<h1> Home page </h1>')
    res.end('Benvenuto!')
});

app.use('/user', (req, res) => {
    res.write(`User: ${req.query.name}\n`);
    res.end(`L'user ${req.query.name} ha chiamato l'url ${req.url}`);
});

app.get('/settings', (req, res ) => {
    res.write('Settings page\n');
    res.end(`JSON: ${JSON.stringify(req.query)}`); // Mostra i parametri della query string
})

app.get('/user/login', (req, res) => {
    res.write(`User login page\n`);
    res.end(`L'user ${req.query.name} ha fatto il login`)
})

app.get('/user/logout', (req, res) => {
    res.write(`User logout page\n`);
    res.end(`L'user ${req.query.name} ha fatto il logout`)
});
