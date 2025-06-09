const express = require('express');
const app = express();
const PORT = 3000;


app.use((req, res, next) => {
    console.log(`${req.method} request received on url ${req.url}`)
});

app.get('/', (req, res, next) => {
    console.log("Processing request for homepage");
    next();
});


app.get('/', (req, res) => {
    res.send('Hello there! Welcome to the homepage.');
});

app.get('/about', (req, res) => {
    res.send('About page');
})


app.listen(PORT, () => { // mi accende un server che si mette in ascolto sulla porta
    console.log(`Server running on http://localhost:${PORT}`)
})

