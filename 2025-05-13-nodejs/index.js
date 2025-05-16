const express = require ('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Benvenuto su NodeJS!");
});

app.get('/about', (req, res) => {
    res.send("Questo è un backend di prova in Nodejs.<br/>Utilizza press per gestire le richieste");
});

app.get('/greet', (req, res) => {
    const name = req.query.name || 'Nuovo Utente'; //name è la variabile passata dal frontend
    res.send(`Hi ${name}! Welcome to this server.`);
});

app.get('/user/info', (req, res) => {
    res.json({
        id: 45,
        name: "Carolina",
        mail: "carolina@example.com",
        citta: "Pompei"
    }
    );
});

app.post('/echo', (req, res) => {
    console.log("Received", req.body);
    res.json({
        status: "ok",
        request: req.body
    });
});

app.listen(1234);

console.log("Il server sta funzionando")

/*
In realtà non mi serve per esporre stringhe, di quello si occupa la view.
Qui nel backend ci saranno le risposte alle chiamate che verranno fatte dal front end, per esempio
utente che clicca pulsante attiverà una chiamata ad un'api che verrà gestita dal backend.
I GET li userò per scambiare dati quindi.
*/