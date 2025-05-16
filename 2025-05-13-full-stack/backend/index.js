
const express = require ('express');
const cors = require ('cors');

const app = express();


app.use(express.json());
app.use(cors());

//Route 1: Home page
app.post('/', (req, res) => {
    
    res.json({
        
        nome: req.body.nome,
        messaggio: req.body.messaggio// Mostriamo i dati che il client ha inviato nel corpo della richiesta
    });
});

//Route 2: about page
app.post('/about', (req, res) => {
    res.json({
        id:1,
        name: 'giorio',
        email: 'esempoi@ciao.bbb'
    });
});


// Server Start
app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});

console.log("Ciauz il server sta funzionando");

/*
In realtà non mi serve per esporre stringhe, di quello si occupa la view.
Qui nel backend ci saranno le risposte alle chiamate che verranno fatte dal front end, per esempio
utente che clicca pulsante attiverà una chiamata ad un'api che verrà gestita dal backend.
I GET li userò per scambiare dati quindi.
*/